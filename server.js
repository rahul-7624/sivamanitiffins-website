const http = require('http');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const PORT = 8080;

// ═══════════════════════════════════════════════════════════════════
//  RAZORPAY CONFIG — create a free account at https://razorpay.com
//  Go to Dashboard → Settings → API Keys → Generate Test Key
//  Paste your Key ID and Key Secret below
// ═══════════════════════════════════════════════════════════════════
const RAZORPAY_KEY_ID     = 'rzp_test_TAF93dWgHK9vU5';   // ← replace this
const RAZORPAY_KEY_SECRET = 'REPLACE_WITH_YOUR_KEY_SECRET';         // ← replace this

// Creates a Razorpay order (returns { id, amount, currency, ... })
function createRazorpayOrder(amountRupees) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const body = JSON.stringify({
            amount: Math.round(amountRupees * 100), // Razorpay uses paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
        });
        const options = {
            hostname: 'api.razorpay.com',
            port: 443,
            path: '/v1/orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'Content-Length': Buffer.byteLength(body)
            }
        };
        const req = https.request(options, (res2) => {
            let data = '';
            res2.on('data', chunk => { data += chunk; });
            res2.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res2.statusCode === 200) resolve(parsed);
                    else reject(new Error(parsed.error?.description || 'Razorpay order creation failed'));
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Verifies Razorpay payment signature (HMAC-SHA256)
function verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, signature) {
    const expected = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
    return expected === signature;
}


let publicUrl = null;
let tunnelProcess = null;
let isShuttingDown = false;

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    let wifiIp    = null;
    let otherIp   = null;

    for (const [name, addrs] of Object.entries(interfaces)) {
        const lower = name.toLowerCase();
        const isWifi = lower === 'wi-fi' || lower === 'wlan' || lower.startsWith('wlan');

        for (const iface of addrs) {
            if (iface.family !== 'IPv4' || iface.internal) continue;

            // Skip VirtualBox / VMware subnets (192.168.56.x, 192.168.99.x, 172.x.x.x)
            if (iface.address.startsWith('192.168.56.') ||
                iface.address.startsWith('192.168.99.') ||
                iface.address.startsWith('172.')) continue;

            if (isWifi && !wifiIp) {
                wifiIp = iface.address;   // Prefer Wi-Fi
            } else if (!isWifi && !otherIp) {
                otherIp = iface.address;  // Keep as fallback
            }
        }
    }
    return wifiIp || otherIp || 'localhost';
}

// Function to automatically start Cloudflare Tunnel using local cloudflared.exe
function startCloudflareTunnel() {
    const cfPath = path.join(__dirname, 'cloudflared.exe');
    if (!fs.existsSync(cfPath)) {
        console.warn(`[Tunnel] cloudflared.exe not found at ${cfPath}. Public tunnel will not be started.`);
        return;
    }

    console.log('[Tunnel] Starting Cloudflare Tunnel...');
    // We launch it with trycloudflare which sets up a quick temporary tunnel, forcing http2 (TCP) protocol to prevent connection timeouts on UDP blocking
    tunnelProcess = spawn(cfPath, ['tunnel', '--protocol', 'http2', '--url', `http://localhost:${PORT}`], {
        cwd: __dirname
    });

    tunnelProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[Tunnel stdout] ${output.trim()}`);
        parseTunnelUrl(output);
    });

    tunnelProcess.stderr.on('data', (data) => {
        const output = data.toString();
        console.log(`[Tunnel stderr] ${output.trim()}`);
        parseTunnelUrl(output);
    });

    tunnelProcess.on('close', (code) => {
        console.log(`[Tunnel] Process exited with code ${code}`);
        publicUrl = null;
        if (!isShuttingDown) {
            console.log('[Tunnel] Restarting Cloudflare Tunnel process in 10s...');
            setTimeout(startCloudflareTunnel, 10000);
        }
    });
}

function parseTunnelUrl(text) {
    // Cloudflare logs temporary tunnel urls as https://*.trycloudflare.com
    const regex = /(https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com)/;
    const match = text.match(regex);
    if (match && match[1]) {
        const newUrl = match[1];
        if (publicUrl !== newUrl) {
            publicUrl = newUrl;
            console.log(`\n======================================================`);
            console.log(`[Tunnel] Public Cloudflare Tunnel URL established successfully!`);
            console.log(`[Tunnel] URL: ${publicUrl}`);
            console.log(`======================================================\n`);
        }
    }

    // Detect disconnection or error states to reset publicUrl to null
    if (text.includes('lost connection') || 
        text.includes('failed to connect') || 
        text.includes('connection refused') || 
        text.includes('Retrying connection') ||
        text.includes('Failed to create new connection')) {
        if (publicUrl !== null) {
            console.log('[Tunnel] Connection lost or retrying. Resetting public URL.');
            publicUrl = null;
        }
    }
}

const DATA_DIR = __dirname;
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');
const AVAIL_FILE  = path.join(__dirname, 'availability.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

// Memory state
let orders = [];
let orderHistory = [];
let availability = {};
let currentTokenParcel = 0;
let currentTokenDineIn = 0;
let sseClients = [];
let settings = {
    morningTiming: "Morning: 6:00 AM – 12:00 PM",
    eveningTiming: "Evening: 6:00 PM – 11:00 PM"
};

// Load persisted data
function initData() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
            orders = data.orders || [];
            currentTokenParcel = data.currentTokenParcel || 0;
            currentTokenDineIn = data.currentTokenDineIn || 0;
            
            // Legacy support
            if (data.currentToken !== undefined && currentTokenParcel === 0 && currentTokenDineIn === 0) {
                currentTokenParcel = data.currentToken;
            }
        }
        if (fs.existsSync(HISTORY_FILE)) {
            orderHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
        if (fs.existsSync(AVAIL_FILE)) {
            const content = fs.readFileSync(AVAIL_FILE, 'utf8');
            availability = JSON.parse(content || '{}');
        }
        if (fs.existsSync(SETTINGS_FILE)) {
            const content = fs.readFileSync(SETTINGS_FILE, 'utf8');
            settings = { ...settings, ...JSON.parse(content || '{}') };
        }
    } catch (e) {
        console.error('Error loading data:', e);
        orders = [];
        availability = {};
    }
}

function saveOrders() {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify({ currentTokenParcel, currentTokenDineIn, orders }, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving orders.json:', e);
    }
}

function saveHistory() {
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(orderHistory, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving history.json:', e);
    }
}

function saveAvailability() {
    try {
        fs.writeFileSync(AVAIL_FILE, JSON.stringify(availability, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving availability.json:', e);
    }
}

function saveSettings() {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving settings.json:', e);
    }
}

initData();

// Helper to send JSON responses
function sendJSON(res, data, status = 200) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// Server logic
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // --- API ENDPOINTS ---
    
    // Settings Endpoints
    if (req.method === 'GET' && pathname === '/api/settings') {
        return sendJSON(res, settings);
    }
    
    if (req.method === 'POST' && pathname === '/api/settings') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                settings = { ...settings, ...data };
                saveSettings();
                return sendJSON(res, { success: true });
            } catch (e) {
                return sendJSON(res, { error: 'Invalid data' }, 400);
            }
        });
        return;
    }

    // SSE Realtime connection for Admin
    if (req.method === 'GET' && pathname === '/api/orders/live') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // Send initial heartbeat
        res.write('data: {"type":"connected"}\n\n');

        sseClients.push(res);

        req.on('close', () => {
            sseClients = sseClients.filter(client => client !== res);
        });
        return;
    }

    // Get server details (including dynamic local network IP and public tunnel URL)
    if (req.method === 'GET' && pathname === '/api/server-info') {
        return sendJSON(res, { localIp: getLocalIP(), port: PORT, publicUrl: publicUrl });
    }

    // Get today's orders
    if (req.method === 'GET' && pathname === '/api/orders') {
        return sendJSON(res, orders);
    }

    // Get order history
    if (req.method === 'GET' && pathname === '/api/history') {
        return sendJSON(res, { history: orderHistory });
    }

    // ── RAZORPAY: Create a payment order ─────────────────────────
    if (req.method === 'POST' && pathname === '/api/create-payment') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const { amount } = JSON.parse(body);
                const rzpOrder = await createRazorpayOrder(amount);
                return sendJSON(res, {
                    orderId: rzpOrder.id,
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    keyId: RAZORPAY_KEY_ID
                });
            } catch (e) {
                console.error('[Razorpay] Order creation failed:', e.message);
                return sendJSON(res, { error: e.message }, 500);
            }
        });
        return;
    }

    // ── RAZORPAY: Verify payment & auto-place order ───────────────
    if (req.method === 'POST' && pathname === '/api/verify-payment') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData } = JSON.parse(body);

                const valid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
                if (!valid) {
                    console.warn('[Razorpay] Invalid signature — possible fraud attempt');
                    return sendJSON(res, { error: 'Payment verification failed' }, 400);
                }

                // ✅ Payment verified — place the order
                const type = orderData.orderType === 'dine_in' ? 'dine_in' : 'parcel';
                let tStr = '';
                if (type === 'parcel') {
                    currentTokenParcel += 1;
                    tStr = 'P' + String(currentTokenParcel).padStart(3, '0');
                } else {
                    currentTokenDineIn += 1;
                    tStr = 'D' + String(currentTokenDineIn).padStart(3, '0');
                }

                const now = new Date();
                const newOrder = {
                    token: tStr,
                    orderType: type,
                    date: now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    items: orderData.items || [],
                    ghee: !!orderData.ghee,
                    total: orderData.total || 0,
                    status: 'paid',
                    payment: {
                        app: orderData.payment?.app || 'Razorpay',
                        razorpayOrderId,
                        razorpayPaymentId,
                        upiId: orderData.payment?.upiId || '',
                        amount: orderData.total,
                        date: now.toLocaleDateString('en-IN'),
                        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                    }
                };

                orders.unshift(newOrder);
                saveOrders();

                // Notify admin portal in real-time
                sseClients.forEach(client => {
                    client.write(`data: ${JSON.stringify({ type: 'new_order', order: newOrder })}\n\n`);
                });

                console.log(`[Order] ✅ Paid & placed — Token #${newOrder.token} | ₹${newOrder.total} | ${newOrder.orderType}`);
                return sendJSON(res, { success: true, order: newOrder });
            } catch (e) {
                console.error('[Razorpay] Verification error:', e);
                return sendJSON(res, { error: 'Server error during verification' }, 500);
            }
        });
        return;
    }

    // Place new order (manual / legacy fallback)

    if (req.method === 'POST' && pathname === '/api/orders') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const orderData = JSON.parse(body);
                const type = orderData.orderType === 'dine_in' ? 'dine_in' : 'parcel';
                let tStr = '';
                if (type === 'parcel') {
                    currentTokenParcel += 1;
                    tStr = 'P' + String(currentTokenParcel).padStart(3, '0');
                } else {
                    currentTokenDineIn += 1;
                    tStr = 'D' + String(currentTokenDineIn).padStart(3, '0');
                }

                const newOrder = {
                    token: tStr,
                    orderType: type,
                    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    items: orderData.items || [],
                    ghee: !!orderData.ghee,
                    total: orderData.total || 0,
                    status: orderData.status || 'received',
                    payment: orderData.payment || null
                };

                orders.unshift(newOrder);
                saveOrders();

                // Broadcast to SSE clients
                sseClients.forEach(client => {
                    client.write(`data: ${JSON.stringify({ type: 'new_order', order: newOrder })}\n\n`);
                });

                return sendJSON(res, { success: true, order: newOrder });
            } catch (e) {
                return sendJSON(res, { error: 'Invalid order payload' }, 400);
            }
        });
        return;
    }

    // Reset orders
    if (req.method === 'POST' && pathname === '/api/orders/reset') {
        // Save current orders to history before clearing
        orderHistory = [...orders, ...orderHistory];
        saveHistory();

        orders = [];
        currentTokenParcel = 0;
        currentTokenDineIn = 0;
        saveOrders();

        sseClients.forEach(client => {
            client.write(`data: ${JSON.stringify({ type: 'reset' })}\n\n`);
        });

        return sendJSON(res, { success: true });
    }

    // Confirm payment for a specific order (Admin action)
    if (req.method === 'POST' && pathname.startsWith('/api/orders/') && pathname.endsWith('/confirm')) {
        const tokenNum = pathname.split('/')[3];
        const order = orders.find(o => String(o.token) === tokenNum);
        if (!order) return sendJSON(res, { error: 'Order not found' }, 404);

        order.status = 'confirmed';
        saveOrders();

        // Broadcast confirmation to all SSE clients (customer page listens too)
        sseClients.forEach(client => {
            client.write(`data: ${JSON.stringify({ type: 'payment_confirmed', token: tokenNum, order })}\n\n`);
        });

        return sendJSON(res, { success: true, order });
    }

    // Cancel a specific order (Admin action)
    if (req.method === 'POST' && pathname.startsWith('/api/orders/') && pathname.endsWith('/cancel')) {
        const tokenNum = pathname.split('/')[3];
        const order = orders.find(o => String(o.token) === tokenNum);
        if (!order) return sendJSON(res, { error: 'Order not found' }, 404);

        order.status = 'cancelled';
        saveOrders();

        // Broadcast cancellation to all SSE clients
        sseClients.forEach(client => {
            client.write(`data: ${JSON.stringify({ type: 'order_cancelled', token: tokenNum, order })}\n\n`);
        });

        return sendJSON(res, { success: true, order });
    }

    // Get menu availability
    if (req.method === 'GET' && pathname === '/api/availability') {
        return sendJSON(res, availability);
    }

    // Update menu availability
    if (req.method === 'POST' && pathname === '/api/availability') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // merge updates
                availability = { ...availability, ...data };
                saveAvailability();

                // Notify all clients of availability change
                sseClients.forEach(client => {
                    client.write(`data: ${JSON.stringify({ type: 'availability', availability })}\n\n`);
                });

                return sendJSON(res, { success: true, availability });
            } catch (e) {
                return sendJSON(res, { error: 'Invalid availability payload' }, 400);
            }
        });
        return;
    }

    // --- STATIC FILES ---
    let filePath = path.join(__dirname, decodeURIComponent(pathname));
    if (pathname === '/') {
        filePath = path.join(__dirname, 'index.html');
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.webp':
            contentType = 'image/webp';
            break;
        case '.avif':
            contentType = 'image/avif';
            break;
        case '.mp3':
            contentType = 'audio/mpeg';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'index.html'), (err, htmlContent) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(htmlContent);
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

// Clean up child process on exit
function cleanup() {
    isShuttingDown = true;
    if (tunnelProcess) {
        console.log('[Tunnel] Stopping Cloudflare Tunnel...');
        tunnelProcess.kill();
    }
    process.exit();
}
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.listen(PORT, () => {
    console.log(`[Server] SHIVAMANI TIFFINS Backend running at http://localhost:${PORT}/`);
    startCloudflareTunnel();
});
