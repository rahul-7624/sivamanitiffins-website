// ==============================================
//  SIVAMANI TIFFINS - ORDERING SYSTEM
//  app.js – Shared between menu.html & admin.html
// ==============================================

// ── MENU DATA ──────────────────────────────────
const MENU_ITEMS = [
    // Idly & Bonda
    { id: 1, name: 'Idly', price: 40, category: 'Idly & Bonda', image: 'idly.jpg', desc: 'Soft and fluffy steamed rice cakes served with chutney & sambar.' },
    { id: 2, name: 'Raagi Idly', price: 45, category: 'Idly & Bonda', image: 'idly.jpg', desc: 'Nutritious steamed idlis made with finger millet flour.' },
    { id: 3, name: 'Mysore Bonda', price: 40, category: 'Idly & Bonda', image: 'bonda.avif', desc: 'Golden fried, crispy and spongy dumplings made of spiced flour.' },
    { id: 4, name: 'Onion Bonda', price: 40, category: 'Idly & Bonda', image: 'bonda.avif', desc: 'Delicious crispy fried onion dumplings with traditional herbs.' },
    { id: 5, name: 'Wada', price: 45, category: 'Idly & Bonda', image: 'vada.jpg', desc: 'Crispy, savory deep-fried black gram lentil fritters.' },
    { id: 6, name: 'Sambar Idly', price: 60, category: 'Idly & Bonda', image: 'idly.jpg', desc: 'Steamed idlis submerged in hot, aromatic lentil sambar.' },
    { id: 7, name: 'Sambar Wada', price: 60, category: 'Idly & Bonda', image: 'vada.jpg', desc: 'Crispy wada soaked in rich, spicy South Indian sambar.' },
    // Puri & Others
    { id: 8, name: 'Puri', price: 50, category: 'Puri & Others', image: 'poori.jpg', desc: 'Fluffy deep-fried whole wheat breads served with spiced potato curry.' },
    { id: 9, name: 'Utappam', price: 60, category: 'Puri & Others', image: 'Uttapam.jpg', desc: 'Thick rice pancake topped with onions, tomatoes, and chilies.' },
    { id: 10, name: 'Upma', price: 50, category: 'Puri & Others', image: 'upma.webp', desc: 'Roasted semolina cooked to perfection with ghee and vegetables.' },
    { id: 11, name: 'Katta Pongal', price: 50, category: 'Puri & Others', image: 'pongal.webp', desc: 'Traditional rice and lentil mash seasoned with ghee, pepper, and cashews.' },
    { id: 12, name: 'Pesara Punugulu', price: 40, category: 'Puri & Others', image: 'pesarattu.jpg', desc: 'Tiny crispy bite-sized fritters made from green gram batter.' },
    { id: 13, name: 'Uggani Bajji', price: 50, category: 'Puri & Others', image: 'logo.jpg', desc: 'Spiced puffed rice mix served alongside hot chili bajji.' },
    { id: 14, name: 'Dibba Rotta', price: 50, category: 'Puri & Others', note: 'With Panakam', image: 'logo.jpg', desc: 'Thick, crusty pan-baked rice cake served with sweet syrup.' },
    // Dosa
    { id: 15, name: 'Plain Dosa', price: 40, category: 'Dosa', image: 'plain dosa.jpg', desc: 'Golden, paper-thin crispy crepe prepared from fermented rice batter.' },
    { id: 16, name: 'Onion Dosa', price: 50, category: 'Dosa', image: 'onion dosa.jpg', desc: 'Crispy rice crepe loaded with finely chopped spiced onions.' },
    { id: 17, name: 'Masala Dosa', price: 50, category: 'Dosa', image: 'masala dosa.png', desc: 'Classic crispy crepe filled with seasoned potato mash.' },
    { id: 18, name: 'Upma Dosa', price: 50, category: 'Dosa', image: 'masala dosa.png', desc: 'Crispy crepe smeared with savory semolina upma.' },
    { id: 19, name: 'Karam Dosa', price: 50, category: 'Dosa', image: 'masala dosa.png', desc: 'Spicy and crispy crepe coated with hot garlic-chili paste.' },
    { id: 20, name: 'Set Dosa', price: 40, category: 'Dosa', image: 'plain dosa.jpg', desc: 'Fluffy, soft, pancake-style dosas served in a set.' },
    // Pesarattu
    { id: 21, name: 'Pesarattu Plain', price: 45, category: 'Pesarattu', image: 'pesarattu.jpg', desc: 'Nutritious thin crepe made from whole green gram batter.' },
    { id: 22, name: 'Pesarattu Onion', price: 50, category: 'Pesarattu', image: 'pesarattu.jpg', desc: 'Green gram crepe topped with chopped onions and ginger.' },
    { id: 23, name: 'Pesarattu Masala', price: 50, category: 'Pesarattu', image: 'pesarattu.jpg', desc: 'Green gram crepe filled with spiced potato curry.' },
    { id: 24, name: 'Pesarattu Upma', price: 50, category: 'Pesarattu', image: 'pesarattu.jpg', desc: 'Traditional combination of green gram crepe with upma filling.' },
    { id: 25, name: 'Pesarattu Karam', price: 50, category: 'Pesarattu', image: 'pesarattu.jpg', desc: 'Spicy green gram crepe smeared with hot chili garlic chutney.' },
    { id: 26, name: 'Pesarattu Onion & Masala', price: 60, category: 'Pesarattu', image: 'pesarattu.jpg', desc: 'Authentic, protein-rich green gram crepe.' },
    { id: 27, name: 'Chitti Pesara', price: 50, category: 'Pesarattu', image: 'pesarattu.jpg', desc: 'Mini signature green gram crepes loaded with flavor.' },
    // Rava Dosa
    { id: 28, name: 'Rava Plain Dosa', price: 50, category: 'Rava Dosa', image: 'rava dosa.jpeg', desc: 'Crispy, web-like crepe made with semolina, rice flour, and spices.' },
    { id: 29, name: 'Rava Onion Dosa', price: 60, category: 'Rava Dosa', image: 'rava dosa.jpeg', desc: 'Semolina crepe loaded with green chilies and onions.' },
    { id: 30, name: 'Rava Masala Dosa', price: 70, category: 'Rava Dosa', image: 'rava dosa.jpeg', desc: 'Crisp semolina crepe served with spiced potato filling.' },
    { id: 31, name: 'Rava Upma Dosa', price: 70, category: 'Rava Dosa', image: 'rava dosa.jpeg', desc: 'Crisp semolina crepe stuffed with savory hot upma.' },
    // Raagi Dosa
    { id: 32, name: 'Raagi Plain Dosa', price: 50, category: 'Raagi Dosa', image: 'plain dosa.jpg', desc: 'Healthy, iron-rich crepe prepared with finger millet flour.' },
    { id: 33, name: 'Raagi Onion Dosa', price: 60, category: 'Raagi Dosa', image: 'onion dosa.jpg', desc: 'Millet crepe topped with onions and cumin seeds.' },
    { id: 34, name: 'Raagi Masala Dosa', price: 60, category: 'Raagi Dosa', image: 'masala dosa.png', desc: 'Healthy finger millet crepe served with potato filling.' },
    { id: 35, name: 'Raagi Upma Dosa', price: 60, category: 'Raagi Dosa', image: 'masala dosa.png', desc: 'Millet crepe filled with warm, seasoned upma.' },
    { id: 36, name: 'Raagi Karam Dosa', price: 60, category: 'Raagi Dosa', image: 'masala dosa.png', desc: 'Spicy millet crepe coated with garlic red chili chutney.' },
    // Chapathi & Parata
    { id: 37, name: 'Chapathi (2)', price: 50, category: 'Chapathi & Parata', image: 'poori.jpg', desc: 'Soft griddle-cooked whole wheat flatbreads served with vegetable kurma.' },
    { id: 38, name: 'Parata (2)', price: 60, category: 'Chapathi & Parata', image: 'poori.jpg', desc: 'Multi-layered, flaky flatbreads served with spiced kurma curry.' },
    // Specials
    { id: 39, name: 'Special Pottikkalu', price: 40, category: 'Specials', image: 'logo.jpg', desc: 'Steamed jackfruit-leaf-wrapped aromatic rice cakes.' },
];

const GHEE_PRICE = 30;

// ── STATE ───────────────────────────────────────
let cart = [];
let availability = {};
let currentCat = 'All';

// ── AVAILABILITY ────────────────────────────────
async function initAvailability() {
    // Default fallback values
    MENU_ITEMS.forEach(i => availability[i.id] = true);

    try {
        const response = await fetch('/api/availability');
        if (response.ok) {
            const data = await response.json();
            Object.keys(data).forEach(id => {
                availability[id] = data[id];
            });
            // Update UI if rendering items
            if (document.getElementById('catTabs')) {
                renderItems();
            }
            if (typeof renderAdminMenu === 'function') {
                renderAdminMenu();
            }
            return;
        }
    } catch (e) {
        console.warn('Could not load availability from server, trying localStorage', e);
    }

    const saved = localStorage.getItem('siva_avail');
    if (saved) {
        try {
            const localData = JSON.parse(saved);
            Object.keys(localData).forEach(id => {
                availability[id] = localData[id];
            });
        } catch (e) { }
    }
}

async function saveAvailability(updatedItem = null) {
    if (updatedItem) {
        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });
            if (response.ok) {
                const data = await response.json();
                availability = { ...availability, ...data.availability };
            }
        } catch (e) {
            console.error('Failed to post availability to server', e);
        }
    }
    localStorage.setItem('siva_avail', JSON.stringify(availability));
}

// ── CATEGORIES ──────────────────────────────────
function renderCategories() {
    const el = document.getElementById('catTabs');
    if (!el) return;
    const cats = ['All', ...new Set(MENU_ITEMS.map(i => i.category))];
    el.innerHTML = cats.map(c => `
        <button class="cat-tab ${c === currentCat ? 'active' : ''}" onclick="filterCat('${c}')">${c}</button>
    `).join('');
}

function filterCat(cat) {
    currentCat = cat;
    renderCategories();
    renderItems();
}

// ── ITEMS ────────────────────────────────────────
function renderItems() {
    const el = document.getElementById('itemsGrid');
    if (!el) return;

    const items = currentCat === 'All'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(i => i.category === currentCat);

    el.innerHTML = items.map(item => {
        const avail = availability[item.id] !== false;
        const inCart = cart.find(c => c.id === item.id);
        const qty = inCart ? inCart.qty : 0;

        return `
        <div class="item-card ${!avail ? 'unavailable' : ''}">
            <div class="item-card-inner">
                <div class="item-details">
                    <div class="item-name-row">
                        <span class="veg-badge"><span class="veg-dot"></span></span>
                        <h4 class="item-name">${item.name}</h4>
                        ${!avail ? '<span class="unavail-badge">Sold Out</span>' : ''}
                    </div>
                    <p class="item-desc">${item.desc || 'Freshly prepared traditional South Indian dish.'}</p>
                    ${item.note ? `<span class="item-note"><i class="fa-solid fa-circle-info"></i> ${item.note}</span>` : ''}
                    <div class="item-price-row">
                        <span class="item-price">₹${item.price}</span>
                        <div class="item-action">
                            ${avail
                ? (qty === 0
                    ? `<button class="add-item-btn" onclick="addItem(${item.id})"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 3px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></svg> Add</button>`
                    : `<div class="qty-control">
                                        <button class="qty-btn-sm" onclick="removeItem(${item.id})">−</button>
                                        <span class="qty-val">${qty}</span>
                                        <button class="qty-btn-sm" onclick="addItem(${item.id})">+</button>
                                       </div>`)
                : '<span class="sold-out-text">Sold Out</span>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── CART OPERATIONS ──────────────────────────────
function addItem(id) {
    const item = MENU_ITEMS.find(i => i.id === id);
    if (!item) return;
    const ex = cart.find(c => c.id === id);
    if (ex) ex.qty++;
    else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    afterCartChange();
    renderItems();
}

function removeItem(id) {
    const ex = cart.find(c => c.id === id);
    if (!ex) return;
    ex.qty--;
    if (ex.qty <= 0) cart = cart.filter(c => c.id !== id);
    afterCartChange();
    renderItems();
}

function afterCartChange() {
    updateBadge();
    updateFloating();
}

// totals
function totalQty() { return cart.reduce((s, i) => s + i.qty, 0); }
function subtotal() { return cart.reduce((s, i) => s + i.qty * i.price, 0); }
function gheeTotal() {
    const chk = document.getElementById('gheeCheck');
    return (chk && chk.checked) ? totalQty() * GHEE_PRICE : 0;
}
function grandTotal() { return subtotal() + gheeTotal(); }

// ── BADGE + FLOATING CART ────────────────────────
function updateBadge() {
    const b = document.getElementById('cartBadge');
    if (b) b.textContent = totalQty();
}

function updateFloating() {
    const fc = document.getElementById('floatingCart');
    const fi = document.getElementById('fcItems');
    const ft = document.getElementById('fcTotal');
    if (!fc) return;
    const q = totalQty();
    if (q > 0) {
        fc.style.display = 'flex';
        fi.textContent = `${q} item${q > 1 ? 's' : ''}`;
        ft.textContent = `₹${subtotal()}`;
    } else {
        fc.style.display = 'none';
    }
}

// ── VIEWS ────────────────────────────────────────
function showView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${name}`);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);

    if (name === 'cart') buildCartView();
    if (name === 'payment') buildPaymentView();
    if (name === 'history') buildHistoryView();
}

// ── HISTORY VIEW ─────────────────────────────────
function buildHistoryView() {
    const list = document.getElementById('historyList');
    if (!list) return;

    const localOrders = JSON.parse(localStorage.getItem('siva_orders') || '[]');

    if (localOrders.length === 0) {
        list.innerHTML = `
            <div class="empty-history">
                <span style="font-size: 40px; display: block; margin-bottom: 12px; opacity: 0.5;">📄</span>
                <p>No past orders found.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = localOrders.map(o => `
        <div class="history-card" onclick="openHistoryOrder('${o.token}')">
            <div class="hc-header">
                <span class="hc-token">#${o.token}</span>
                <span class="hc-date">${o.date || ''} | ${o.time || ''}</span>
                <span class="hc-total">₹${o.total}</span>
            </div>
            <div class="hc-items">
                ${o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                ${o.ghee ? ', Ghee Extra' : ''}
            </div>
        </div>
    `).join('');
}

function openHistoryOrder(tokenNum) {
    const localOrders = JSON.parse(localStorage.getItem('siva_orders') || '[]');
    const order = localOrders.find(o => o.token === tokenNum);
    if (order) {
        showView('token');
        renderToken(order);
    }
}

// ── CART VIEW ────────────────────────────────────
function buildCartView() {
    const cc = document.getElementById('cartContents');
    const os = document.getElementById('orderSummary');
    const gb = document.getElementById('gheeBox');
    const pb = document.getElementById('proceedBtn');
    if (!cc) return;

    if (cart.length === 0) {
        cc.innerHTML = `<div class="empty-cart">
            <span>🛒</span><p>Cart is empty</p>
            <button onclick="showView('menu')">← Back to Menu</button>
        </div>`;
        if (gb) gb.style.display = 'none';
        if (os) os.innerHTML = '';
        if (pb) pb.style.display = 'none';
        return;
    }

    if (gb) gb.style.display = 'block';
    if (pb) pb.style.display = 'flex';

    cc.innerHTML = cart.map(item => `
        <div class="cart-row">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-ctrl">
                <button class="qty-btn-sm" onclick="removeItemCart(${item.id})">−</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn-sm" onclick="addItemCart(${item.id})">+</button>
            </div>
            <div class="cart-item-price">₹${item.qty * item.price}</div>
        </div>`).join('');

    buildSummary();
}

function buildSummary() {
    const os = document.getElementById('orderSummary');
    if (!os) return;
    const gt = gheeTotal();
    const sub = subtotal();
    const tot = sub + gt;

    os.innerHTML = `
        <div class="summary-row"><span>Subtotal (${totalQty()} items)</span><span>₹${sub}</span></div>
        ${gt ? `<div class="summary-row"><span>Ghee Extra (${totalQty()} × ₹${GHEE_PRICE})</span><span>₹${gt}</span></div>` : ''}
        <div class="summary-row total-row"><span>Total</span><span>₹${tot}</span></div>
    `;
}

function addItemCart(id) { addItem(id); buildCartView(); }
function removeItemCart(id) { removeItem(id); buildCartView(); }
function updateCartView() { buildCartView(); }

// ── PAYMENT VIEW (RAZORPAY) ───────────────────────────────
const UPI_ID = '9398418297@ibl';  // Your UPI ID (shown in checkout info)

function buildPaymentView() {
    const total = grandTotal();

    // Update pay amount display
    const pa = document.getElementById('payAmount');
    if (pa) pa.textContent = `₹${total}`;

    const lbl = document.getElementById('rzpPayAmtLabel');
    if (lbl) lbl.textContent = `₹${total}`;

    // Build order summary list
    const summaryEl = document.getElementById('payOrderSummary');
    if (summaryEl) {
        const gheeChecked = !!(document.getElementById('gheeCheck') || {}).checked;
        const gheeAmt = gheeChecked ? cart.reduce((s, i) => s + i.qty, 0) * GHEE_PRICE : 0;
        summaryEl.innerHTML =
            cart.map(i => `
                <div class="pay-item-row">
                    <span>${i.name} × ${i.qty}</span>
                    <span>₹${i.qty * i.price}</span>
                </div>`).join('') +
            (gheeChecked ? `<div class="pay-item-row"><span>Ghee Extra</span><span>₹${gheeAmt}</span></div>` : '');
    }
}

async function initiateRazorpayPayment() {
    const btn = document.getElementById('rzpPayBtn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Opening Payment...'; }

    const total = grandTotal();

    try {
        // Step 1: Create a Razorpay order on our server
        const res = await fetch('/api/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: total })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Could not create payment order');
        }

        const { orderId, keyId } = await res.json();

        // Step 2: Open Razorpay checkout popup
        const options = {
            key: keyId,
            amount: total * 100,     // in paise
            currency: 'INR',
            name: 'SHIVAMANI TIFFINS',
            description: cart.map(i => `${i.name} x${i.qty}`).join(', '),
            order_id: orderId,
            theme: { color: '#ff6b00' },
            prefill: { name: '', email: '', contact: '' },
            handler: async function (response) {
                // Step 3: Payment captured — verify on server and place order
                await verifyAndPlaceOrder(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                );
            },
            modal: {
                ondismiss: function () {
                    // User closed without paying — re-enable button
                    if (btn) { btn.disabled = false; btn.innerHTML = `🔒 Pay ₹${total} Securely`; }
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (e) {
        console.error('[Razorpay] Error:', e);
        alert('❌ Could not open payment: ' + e.message + '\n\nMake sure you have set your Razorpay API keys in server.js');
        if (btn) { btn.disabled = false; btn.innerHTML = `🔒 Pay ₹${total} Securely`; }
    }
}

async function verifyAndPlaceOrder(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const gheeChecked = !!(document.getElementById('gheeCheck') || {}).checked;
    const gheeAmt = gheeChecked ? cart.reduce((s, i) => s + i.qty, 0) * GHEE_PRICE : 0;
    
    const orderTypeEl = document.querySelector('input[name="orderType"]:checked');
    const orderType = orderTypeEl ? orderTypeEl.value : 'dine_in';

    const orderData = {
        orderType: orderType,
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        ghee: gheeChecked,
        total: grandTotal(),
        payment: { app: 'Razorpay', upiId: UPI_ID }
    };

    try {
        const res = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            // ✅ Order placed! Save to local history and show confirmation
            const localOrders = JSON.parse(localStorage.getItem('siva_orders') || '[]');
            localOrders.unshift(data.order);
            localStorage.setItem('siva_orders', JSON.stringify(localOrders));

            cart = [];
            updateBadge();
            updateFloating();

            showOrderConfirmed(data.order);
        } else {
            alert('⚠️ Payment was received but order placement failed: ' + (data.error || 'Unknown error'));
        }
    } catch (e) {
        console.error('[verify-payment] Error:', e);
        alert('⚠️ Payment received but could not confirm order. Please contact the shop.');
    }
}

function showOrderConfirmed(order) {
    const card = document.getElementById('confirmedOrderCard');
    if (card) {
        const gheeAmt = order.ghee ? order.items.reduce((s, i) => s + i.qty, 0) * GHEE_PRICE : 0;
        card.innerHTML =
            order.items.map(i => `
                <div class="confirmed-order-item">
                    <span>${i.name} × ${i.qty}</span>
                    <span>₹${i.qty * i.price}</span>
                </div>`).join('') +
            (order.ghee ? `<div class="confirmed-order-item"><span>Ghee Extra</span><span>₹${gheeAmt}</span></div>` : '') +
            `<div class="confirmed-total-row"><span>Total Paid</span><span>₹${order.total}</span></div>
             <p class="confirmed-meta">Payment ID: ${order.payment?.razorpayPaymentId || '—'}<br>${order.date} · ${order.time}</p>`;
    }
    showView('confirmed');
}

function placeNewOrder() {
    cart = [];
    updateBadge();
    updateFloating();
    showView('menu');
    renderItems();
}

// ── LEGACY / FALLBACK — kept for admin manual order flow ─────
let pendingOrderToken = null;




// ── TOKEN PAGE ────────────────────────────────────
let tokenTimerInterval = null;
let currentViewedOrder = null;
const TOKEN_DURATION = 5 * 60; // 5 minutes only

function renderToken(order) {
    currentViewedOrder = order;
    const td = document.getElementById('tokenDisplay');
    const ts = document.getElementById('tokenOrderSummary');

    if (td) {
        const typeLabel = order.orderType === 'parcel' ? '🛍️ PARCEL' : '🍽️ DINE IN';
        td.innerHTML = `${order.token} <div style="font-size:16px; margin-top:8px; color:#ff6b00;">${typeLabel}</div>`;
    }

    if (ts) {
        const gheeAmt = order.ghee ? order.items.reduce((s, i) => s + i.qty, 0) * GHEE_PRICE : 0;
        ts.innerHTML =
            order.items.map(i =>
                `<div class="slip-item-row">
                    <span class="si-name">${i.name}</span>
                    <span class="si-qty">x${i.qty}</span>
                    <span class="si-price">₹${i.qty * i.price}</span>
                 </div>`
            ).join('') +
            (order.ghee
                ? `<div class="slip-item-row ghee-row"><span class="si-name">Ghee Extra</span><span class="si-qty"></span><span class="si-price">₹${gheeAmt}</span></div>`
                : '') +
            (order.payment ? `
            <div class="order-pay-info">
                <span>💳 ${order.payment.app}</span>
                <span>${order.payment.upiId}</span>
                ${order.payment.txnId && order.payment.txnId !== '—' ? `<span>📝 Txn: ${order.payment.txnId}</span>` : ''}
                <span>📅 ${order.payment.date} ${order.payment.time}</span>
            </div>` : '') +
            `<div class="slip-item-row slip-total-row">
                <span class="si-name">TOTAL PAID</span>
                <span class="si-qty"></span>
                <span class="si-price">₹${order.total}</span>
             </div>
             <div class="slip-order-time">Date: ${order.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })} &nbsp;|&nbsp; Time: ${order.time}</div>`;
    }

    const overlay = document.getElementById('expiredOverlay');
    const slip = document.getElementById('tokenSlip');
    if (overlay) overlay.style.display = 'none';
    if (slip) slip.style.opacity = '1';

    // Populate Payment Details section
    const paySection = document.getElementById('slipPaymentDetails');
    if (paySection && order.payment) {
        const p = order.payment;
        const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        el('slipPayApp', p.app || 'UPI');
        el('slipPayUpi', p.upiId || UPI_ID);
        el('slipPayAmount', `₹${p.amount || order.total}`);
        el('slipPayTxn', p.txnId || '—');
        el('slipPayTime', `${p.date || order.date} | ${p.time || order.time}`);
        paySection.style.display = 'block';

        // Dynamic status style update
        const statusEl = document.getElementById('slipPayStatus');
        if (statusEl) {
            statusEl.className = 'slip-pay-status'; // reset classes
            if (order.status === 'confirmed') {
                statusEl.textContent = '✅ ORDER CONFIRMED';
                statusEl.classList.add('confirmed');
            } else if (order.status === 'cancelled') {
                statusEl.textContent = '❌ ORDER CANCELLED';
                statusEl.classList.add('cancelled');
            } else {
                statusEl.textContent = '⏳ AWAITING CONFIRMATION';
                statusEl.classList.add('pending');
            }
        }
    } else if (paySection) {
        paySection.style.display = 'none';
    }

    const timerSection = document.getElementById('timerSection');
    if (order.status === 'cancelled') {
        if (tokenTimerInterval) {
            clearInterval(tokenTimerInterval);
            tokenTimerInterval = null;
        }
        if (timerSection) timerSection.style.display = 'none';
    } else {
        if (timerSection) timerSection.style.display = 'block';
        startTokenTimer(TOKEN_DURATION);
    }
}

function startTokenTimer(seconds) {
    if (tokenTimerInterval) clearInterval(tokenTimerInterval);

    let remaining = seconds;
    const timerEl = document.getElementById('slipTimer');
    const barEl = document.getElementById('timerBar');
    const sectionEl = document.getElementById('timerSection');

    function updateDisplay() {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        if (timerEl) timerEl.textContent = timeStr;

        const pct = (remaining / TOKEN_DURATION) * 100;
        if (barEl) {
            barEl.style.width = pct + '%';
            if (pct > 50) barEl.style.background = '#22c55e';
            else if (pct > 25) barEl.style.background = '#f59e0b';
            else barEl.style.background = '#ef4444';
        }

        if (sectionEl) {
            if (remaining <= 60) sectionEl.className = 'slip-timer-section timer-critical';
            else if (remaining <= 180) sectionEl.className = 'slip-timer-section timer-warning';
            else sectionEl.className = 'slip-timer-section';
        }

        if (remaining <= 60 && timerEl) {
            timerEl.classList.toggle('timer-flash');
        }
    }

    updateDisplay();

    tokenTimerInterval = setInterval(() => {
        remaining--;
        updateDisplay();

        if (remaining <= 0) {
            clearInterval(tokenTimerInterval);
            expireToken();
        }
    }, 1000);
}

function expireToken() {
    const overlay = document.getElementById('expiredOverlay');
    const slip = document.getElementById('tokenSlip');
    if (overlay) overlay.style.display = 'flex';
    if (slip) slip.style.opacity = '0.25';
}

function newOrder() {
    if (tokenTimerInterval) {
        clearInterval(tokenTimerInterval);
        tokenTimerInterval = null;
    }
    cart = [];
    updateBadge();
    updateFloating();
    showView('menu');
    renderItems();
}

// ── SSE REALTIME SUBSCRIPTION ────────────────────
// 10-minute payment timer state
let paymentTimerInterval = null;
const PAYMENT_TIMEOUT = 10 * 60; // 10 minutes to complete UPI payment

function startPaymentTimer() {
    if (paymentTimerInterval) clearInterval(paymentTimerInterval);
    let remaining = PAYMENT_TIMEOUT;
    const timerEl = document.getElementById('paymentCountdown');

    function tick() {
        if (!timerEl) return;
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (remaining <= 0) {
            clearInterval(paymentTimerInterval);
            timerEl.textContent = 'EXPIRED';
            timerEl.style.color = '#ef4444';
        }
    }
    tick();
    paymentTimerInterval = setInterval(() => { remaining--; tick(); }, 1000);
}

function stopPaymentTimer() {
    if (paymentTimerInterval) {
        clearInterval(paymentTimerInterval);
        paymentTimerInterval = null;
    }
}

function initSSE() {
    try {
        const source = new EventSource('/api/orders/live');

        source.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);

                // Realtime availability updates
                if (data.type === 'availability') {
                    availability = { ...availability, ...data.availability };
                    if (document.getElementById('catTabs')) {
                        renderItems();
                    }
                    if (typeof renderAdminMenu === 'function') {
                        renderAdminMenu();
                    }
                }

                // Payment confirmed by admin
                if (data.type === 'payment_confirmed') {
                    if (data.token === pendingOrderToken) {
                        stopPaymentTimer();
                        pendingOrderToken = null;
                        // Show token slip with the confirmed order data
                        showView('token');
                        renderToken(data.order);
                    }

                    // Update order in local history
                    const localOrders = JSON.parse(localStorage.getItem('siva_orders') || '[]');
                    const orderIndex = localOrders.findIndex(o => o.token === data.token);
                    if (orderIndex !== -1) {
                        localOrders[orderIndex].status = 'confirmed';
                        localStorage.setItem('siva_orders', JSON.stringify(localOrders));
                    }

                    // Re-render if customer is currently viewing this token
                    if (currentViewedOrder && currentViewedOrder.token === data.token) {
                        renderToken(data.order);
                    }
                }

                // Order cancelled by admin
                if (data.type === 'order_cancelled') {
                    // Update order in local history
                    const localOrders = JSON.parse(localStorage.getItem('siva_orders') || '[]');
                    const orderIndex = localOrders.findIndex(o => o.token === data.token);
                    if (orderIndex !== -1) {
                        localOrders[orderIndex].status = 'cancelled';
                        localStorage.setItem('siva_orders', JSON.stringify(localOrders));
                    }

                    // If customer is on waiting screen for this order, show cancellation
                    if (data.token === pendingOrderToken) {
                        pendingOrderToken = null;
                        // Show a clear cancellation message on the waiting view
                        const wTitle = document.querySelector('.waiting-title');
                        const wSub = document.querySelector('.waiting-sub');
                        if (wTitle) { wTitle.textContent = '❌ Order Cancelled'; wTitle.style.color = '#ef4444'; }
                        if (wSub) wSub.textContent = 'Your order was cancelled by the shop. Please try again.';
                    }

                    // Re-render if customer is currently viewing this token
                    if (currentViewedOrder && currentViewedOrder.token === data.token) {
                        renderToken(data.order);
                    }
                }
            } catch (e) {
                console.error("Error parsing SSE message:", e);
            }
        };

        source.onerror = function () {
            console.warn("SSE connection lost. Reconnecting in 3s...");
        };
    } catch (e) {
        console.error("Could not initialize SSE connection:", e);
    }
}

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initAvailability();
    initSSE();
    if (document.getElementById('catTabs')) {
        renderCategories();
        renderItems();
    }
    
    // Check URL for pre-selected order type
    const params = new URLSearchParams(window.location.search);
    const orderType = params.get('type');
    if (orderType === 'parcel' || orderType === 'dine_in') {
        const radio = document.querySelector(`input[name="orderType"][value="${orderType}"]`);
        if (radio) {
            radio.checked = true;
            updateOrderTypeStyle();
            
            // Optionally hide the selection box so customers can't change it 
            // if they scanned a specific QR code
            const box = document.getElementById('orderTypeBox');
            if (box) {
                box.style.display = 'none';
            }
        }
    }
});

function updateOrderTypeStyle() {
    const isDineIn = document.querySelector('input[name="orderType"][value="dine_in"]').checked;
    const lblDineIn = document.getElementById('lblDineIn');
    const lblParcel = document.getElementById('lblParcel');
    if (isDineIn) {
        if(lblDineIn) { lblDineIn.style.background = 'rgba(255,107,0,0.15)'; lblDineIn.style.borderColor = 'var(--orange)'; }
        if(lblParcel) { lblParcel.style.background = 'rgba(255,255,255,0.05)'; lblParcel.style.borderColor = 'transparent'; }
    } else {
        if(lblParcel) { lblParcel.style.background = 'rgba(255,107,0,0.15)'; lblParcel.style.borderColor = 'var(--orange)'; }
        if(lblDineIn) { lblDineIn.style.background = 'rgba(255,255,255,0.05)'; lblDineIn.style.borderColor = 'transparent'; }
    }
}
