// ==============================
// PRODUCT DATA (iPhone 17 Pro Max + similar products)
// ==============================
const FEATURED_PRODUCT = {
    id: 1,
    name: "Apple iPhone 17 Pro Max (Cosmic Orange, 256 GB)",
    price: 149900,
    oldPrice: 159900,
    category: "Electronics",
    img: "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/d/c/j/-original-imaghx5ggdchzghh.jpeg?q=70",
    rating: 4.7,
    color: "Cosmic Orange",
    storage: "256 GB"
};

const similarProducts = [
    { id:2,  name:"Apple iPhone 17 Pro (Deep Blue, 256 GB)",        price:134900, oldPrice:144900, category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/h/z/h/-original-imaghx5gzfhz69ts.jpeg?q=70", rating:4.6 },
    { id:3,  name:"Samsung Galaxy S25 Ultra (Titanium Gray, 512GB)",price:124999, oldPrice:149999, category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/s/z/z/-original-imah2z8gghhykzfh.jpeg?q=70", rating:4.6 },
    { id:4,  name:"OnePlus 13 Pro (Obsidian Black, 256GB)",         price:69999,  oldPrice:84999,  category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/0/e/7/-original-imah2z8ggwzuqksc.jpeg?q=70", rating:4.5 },
    { id:5,  name:"Apple iPhone 16 Pro Max (Natural Titanium, 256GB)", price:139900, oldPrice:159900, category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/5/y/f/-original-imaghx5gqfpaez9y.jpeg?q=70", rating:4.7 },
    { id:6,  name:"Google Pixel 10 Pro (Obsidian, 256GB)",         price:89999,  oldPrice:99999,  category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/1/3/4/-original-imah2z8gqeysfqhk.jpeg?q=70", rating:4.5 },
    { id:7,  name:"Samsung Galaxy Z Fold 7 (Beige, 512GB)",        price:164999, oldPrice:184999, category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/r/j/e/-original-imah2z8ggnzajkvr.jpeg?q=70", rating:4.4 },
    { id:8,  name:"Nothing Phone (4) Pro (White, 256GB)",          price:44999,  oldPrice:54999,  category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/x/j/3/-original-imah2z8ggmwbztdz.jpeg?q=70", rating:4.3 },
    { id:9,  name:"Xiaomi 15 Pro (Titanium Silver, 512GB)",        price:79999,  oldPrice:89999,  category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/p/t/s/-original-imah2z8ggbhmzfuk.jpeg?q=70", rating:4.4 },
    { id:10, name:"Vivo X200 Pro (Midnight Black, 256GB)",         price:59999,  oldPrice:69999,  category:"Electronics", img:"https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/n/k/f/-original-imah2z8ggyfjzdta.jpeg?q=70", rating:4.5 },
];

const allProducts = [FEATURED_PRODUCT, ...similarProducts];

// ==============================
// STATE
// ==============================
let cart = JSON.parse(localStorage.getItem('flipkartCart')) || [];
let selectedColor = "Cosmic Orange";
let selectedStorage = "256 GB";
let currentPrice = 149900;
let currentOldPrice = 159900;
let selectedPayment = "upi";
let addressSaved = null;

// ==============================
// UTILITY
// ==============================
function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
}

function discountPercent(oldPrice, newPrice) {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

// ==============================
// PAGE NAVIGATION
// ==============================
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    
    if (page === 'cart') renderCart();
    if (page === 'payment') initPayment();
    if (page === 'home') renderSimilarProducts();
}

// ==============================
// PRODUCT PAGE FUNCTIONS
// ==============================
function changeImage(imgEl) {
    document.getElementById('mainProductImg').src = imgEl.src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    imgEl.classList.add('active');
}

function selectColor(el) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    selectedColor = el.dataset.color;
    document.getElementById('selectedColorText').textContent = selectedColor;
    
    // Update main image based on color
    const colorMap = {
        "Cosmic Orange": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/d/c/j/-original-imaghx5ggdchzghh.jpeg?q=70",
        "Silver": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/0/g/2/-original-imaghx5gj9mzfmcz.jpeg?q=70",
        "Deep Blue": "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/n/8/d/-original-imaghx5ggi2nhnhh.jpeg?q=70"
    };
    document.getElementById('mainProductImg').src = colorMap[selectedColor] || colorMap["Cosmic Orange"];
}

// ==============================
// ADD TO CART / BUY NOW
// ==============================
function addToCart(product) {
    const item = product || FEATURED_PRODUCT;
    const cartItem = {
        ...item,
        qty: 1,
        selectedColor: selectedColor,
        selectedStorage: selectedStorage
    };
    
    const existing = cart.find(x => x.id === item.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(cartItem);
    }
    saveCart();
    updateCartBadge();
    showToast('Added to cart!');
    showPage('cart');
}

function buyNow(product) {
    const item = product || FEATURED_PRODUCT;
    cart = [{
        ...item,
        qty: 1,
        selectedColor: selectedColor,
        selectedStorage: selectedStorage
    }];
    saveCart();
    updateCartBadge();
    showPage('cart');
}

function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    Object.assign(toast.style, {
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        background: '#212121', color: 'white', padding: '12px 28px', borderRadius: '6px',
        fontSize: '14px', zIndex: '9999', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        animation: 'fadeInUp 0.3s ease'
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2000);
}

// Inject toast animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
document.head.appendChild(styleSheet);

// ==============================
// CART OPERATIONS
// ==============================
function saveCart() {
    localStorage.setItem('flipkartCart', JSON.stringify(cart));
}

function updateCartBadge() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').textContent = total;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCart();
}

function changeQty(productId, delta) {
    const item = cart.find(x => x.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(productId); return; }
    saveCart();
    updateCartBadge();
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const details = document.getElementById('priceDetails');

    if (cart.length === 0) {
        list.innerHTML = `<div class="empty-cart"><p>Your cart is empty!</p><button class="btn-shop-now" onclick="showPage('home')">Shop Now</button></div>`;
        details.innerHTML = '<p style="color:#878787;">No items</p>';
        document.querySelector('.place-order-btn').style.display = 'none';
        return;
    }

    document.querySelector('.place-order-btn').style.display = 'block';

    list.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="price">${formatPrice(item.price)}</div>
                <div style="font-size:12px;color:#878787;">${item.selectedColor || ''}${item.selectedStorage ? ' | ' + item.selectedStorage : ''}</div>
                <div class="cart-qty">
                    <button onclick="changeQty(${item.id}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                    <span style="margin-left:12px; color:#ff6161; cursor:pointer; font-size:13px; font-weight:500;" onclick="removeFromCart(${item.id})">Remove</span>
                </div>
            </div>
        </div>
    `).join('');

    const totalMrp = cart.reduce((s, i) => s + i.oldPrice * i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const disc = totalMrp - totalPrice;
    const delivery = totalPrice >= 499 ? 0 : 40;

    details.innerHTML = `
        <div class="summary-row"><span>Price (${cart.reduce((s,i) => s+i.qty,0)} items)</span><span>${formatPrice(totalMrp)}</span></div>
        <div
