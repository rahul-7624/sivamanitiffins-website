// ===========================
//  CART STATE
// ===========================
let cart = [];

// ===========================
//  TOGGLE CART SIDEBAR
// ===========================
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

// ===========================
//  ADD TO CART
// ===========================
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartUI();
    showToast(`✅ ${name} added to cart!`);
    flashCartButton();
}

// ===========================
//  REMOVE ITEM COMPLETELY
// ===========================
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
    showToast(`🗑️ ${name} removed`);
}

// ===========================
//  CHANGE QUANTITY
// ===========================
function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeItem(name);
        return;
    }

    updateCartUI();
}

// ===========================
//  CLEAR ENTIRE CART
// ===========================
function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    updateCartUI();
    showToast('🗑️ Cart cleared');
}

// ===========================
//  UPDATE CART UI
// ===========================
function updateCartUI() {
    const cartList    = document.getElementById('cartList');
    const emptyCart   = document.getElementById('emptyCart');
    const cartFooter  = document.getElementById('cartFooter');
    const cartCount   = document.getElementById('cartCount');
    const subtotalEl  = document.getElementById('subtotal');
    const totalEl     = document.getElementById('cartTotal');

    // Count badge
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    cartCount.textContent = totalItems;

    // Total price
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (cart.length === 0) {
        emptyCart.style.display  = 'flex';
        cartList.innerHTML       = '';
        cartFooter.style.display = 'none';
        return;
    }

    emptyCart.style.display  = 'none';
    cartFooter.style.display = 'block';
    subtotalEl.textContent   = `₹${total}`;
    totalEl.textContent      = `₹${total}`;

    cartList.innerHTML = cart.map(item => `
        <li class="cart-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
            </div>
            <div class="item-controls">
                <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty('${item.name}', +1)">+</button>
                <button class="remove-btn" onclick="removeItem('${item.name}')">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
}

// ===========================
//  CHECKOUT
// ===========================
function checkout() {
    if (cart.length === 0) {
        showToast('⚠️ Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Build summary
    let summary = cart.map(i =>
        `<div>• ${i.name} × ${i.quantity} — ₹${i.price * i.quantity}</div>`
    ).join('');
    summary += `<div style="margin-top:10px;font-weight:700;color:#ff6b00;font-size:16px;">Total Paid: ₹${total}</div>`;

    document.getElementById('modalSummary').innerHTML = summary;

    // Show modal
    document.getElementById('checkoutModal').classList.add('show');

    // Close cart sidebar
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';

    // Clear cart after checkout
    cart = [];
    updateCartUI();
}

// ===========================
//  CLOSE MODAL
// ===========================
function closeModal() {
    document.getElementById('checkoutModal').classList.remove('show');
}

// Close modal on overlay click
document.getElementById('checkoutModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// ===========================
//  TOAST NOTIFICATION
// ===========================
let toastTimer = null;

function showToast(msg) {
    let toast = document.getElementById('toastEl');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastEl';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = msg;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ===========================
//  FLASH CART BUTTON
// ===========================
function flashCartButton() {
    const btn = document.getElementById('cartToggle');
    btn.style.transform = 'scale(1.2)';
    btn.style.boxShadow = '0 0 20px rgba(255,107,0,0.8)';
    setTimeout(() => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
    }, 400);
}

// ===========================
//  SCROLL TO MENU
// ===========================
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// ===========================
//  NAVBAR SCROLL HIGHLIGHT
// ===========================
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(15,15,15,0.98)';
    } else {
        header.style.background = 'rgba(15,15,15,0.85)';
    }
});

// ===========================
//  INIT
// ===========================
updateCartUI();