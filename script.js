// Overhauled Data Architecture & Bento Rendering

const products = [
    { id: 1, name: "Evening Beaded", kesPrice: 12870, originalPrice: 16900, isOnSale: true, imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Carpet Craft", kesPrice: 7800, originalPrice: null, isOnSale: false, imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Wildlife Tapestry", kesPrice: 10140, originalPrice: null, isOnSale: false, imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Designer Edge", kesPrice: 25870, originalPrice: 27300, isOnSale: true, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Brooklyn Stevie", kesPrice: 5200, originalPrice: null, isOnSale: false, imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Classic Flap", kesPrice: 22100, originalPrice: null, isOnSale: false, imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Dakine Messenger", kesPrice: 15600, originalPrice: 24700, isOnSale: true, imageUrl: "https://images.unsplash.com/photo-1628149462151-511bb7eb7e31?q=80&w=800&auto=format&fit=crop" },
    { id: 8, name: "Canvas Tote", kesPrice: 21450, originalPrice: null, isOnSale: false, imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop" }
];

// Define the bento box structure (how many rows/cols each item takes)
const bentoClasses = [
    "md:col-span-2 md:row-span-2", // 1. Large Feature Square
    "md:col-span-1 md:row-span-1", // 2. Standard Square
    "md:col-span-1 md:row-span-1", // 3. Standard Square
    "md:col-span-2 md:row-span-1", // 4. Wide Rectangle
    "md:col-span-1 md:row-span-2", // 5. Tall Portrait Rectangle
    "md:col-span-1 md:row-span-1", // 6. Standard Square
    "md:col-span-2 md:row-span-1", // 7. Wide Rectangle
    "md:col-span-2 md:row-span-1"  // 8. Wide Rectangle
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('bento-grid');
    grid.innerHTML = '';

    products.forEach((product, index) => {
        // Assign bento class based on index (loops if more products than classes)
        const gridClass = bentoClasses[index % bentoClasses.length];
        
        const priceDisplay = product.isOnSale 
            ? `<span class="text-white font-bold text-lg">KES ${product.kesPrice.toLocaleString()}</span>
               <span class="text-white/60 text-sm line-through ml-2">KES ${product.originalPrice.toLocaleString()}</span>`
            : `<span class="text-white font-bold text-lg">KES ${product.kesPrice.toLocaleString()}</span>`;

        const saleTag = product.isOnSale
            ? `<div class="absolute top-4 left-4 bg-slate-900 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full z-20">Sale</div>`
            : '';

        const cardHTML = `
            <div class="relative rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end ${gridClass}">
                ${saleTag}
                
                <!-- Background Image -->
                <img src="${product.imageUrl}" alt="${product.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0">
                
                <!-- Gradient Overlay for Text Readability -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <!-- Content Details -->
                <div class="relative z-20 p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 class="text-white font-bold text-xl md:text-2xl leading-tight mb-2 tracking-tight">${product.name}</h3>
                    <div class="flex justify-between items-end mt-4">
                        <div>${priceDisplay}</div>
                        <!-- Add to Cart Button inside the card -->
                        <button onclick="addToCart(${product.id})" class="bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// --- Cart & Checkout Logic (Maintained from Phase 3) ---

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.innerText = totalItems;
    
    // Add a tiny animation bump to the cart when an item is added
    const cartBtn = document.getElementById('cart-trigger');
    cartBtn.classList.add('scale-110', 'bg-slate-800');
    setTimeout(() => cartBtn.classList.remove('scale-110', 'bg-slate-800'), 200);
}

document.getElementById('cart-trigger').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    const totalPrice = cart.reduce((sum, item) => sum + (item.kesPrice * item.quantity), 0);
    document.getElementById('modal-total').innerText = totalPrice.toLocaleString();
    document.getElementById('checkout-modal').classList.remove('hidden');
});

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
    resetCheckoutUI();
}

function resetCheckoutUI() {
    document.getElementById('payment-form').classList.remove('hidden');
    document.getElementById('payment-status').classList.add('hidden');
    document.getElementById('phone-number').value = '';
}

function simulateSTKPush() {
    const phone = document.getElementById('phone-number').value;
    if (phone.length < 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const form = document.getElementById('payment-form');
    const status = document.getElementById('payment-status');
    
    form.classList.add('hidden');
    status.classList.remove('hidden');

    status.innerHTML = `<p class="text-slate-600 font-bold text-lg animate-pulse">Initiating STK Push...</p>`;

    setTimeout(() => {
        status.innerHTML = `<p class="text-slate-800 font-semibold text-lg">Check your phone ( ${phone} ) and enter your M-Pesa PIN.</p>`;
    }, 2000);

    setTimeout(() => {
        status.innerHTML = `
            <div class="text-green-500 text-6xl mb-4">✓</div>
            <p class="text-green-600 font-black text-2xl">Payment Successful!</p>
            <p class="text-sm text-slate-500 mt-2 font-mono bg-slate-50 py-2 rounded">TXN ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
        `;
        cart = [];
        updateCartUI();
        setTimeout(closeCheckout, 5000); 
    }, 6000);
}

// Initialize
document.addEventListener('DOMContentLoaded', renderProducts);
