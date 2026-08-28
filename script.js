// Phase 2: Data Architecture & Dynamic Rendering

// 1. The Product Database (Mock Data)
const products = [
    {
        id: 1,
        name: "An Exquisite Beaded Evening Bag",
        description: "What we sell are not just simple handbags, the products of our shop are a statement piece for your evening attire.",
        price: 99.00,
        originalPrice: 130.00,
        isOnSale: true,
        imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "ArtisanStreet's Carpet Bag",
        description: "We are proud to present you the largest choice of handbags on the web. Crafted with intricate carpet-style threading.",
        price: 60.00,
        originalPrice: null,
        isOnSale: false,
        imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "ArtisanStreet's Wildlife Tapestry",
        description: "Here you can find a great number of different goods. Our store offers stylish, premium quality animal print designs.",
        price: 78.00,
        originalPrice: null,
        isOnSale: false,
        imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Boyt Edge Designer Carpet Bag",
        description: "Our store offers stylish, premium quality handbags at the lowest possible prices. Perfect for weekend getaways.",
        price: 199.00,
        originalPrice: 210.00,
        isOnSale: true,
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Brooklyn Heights Stevie",
        description: "We have a perfect reputation and great experience in this sphere, delivering classic navy silhouettes.",
        price: 40.00,
        originalPrice: null,
        isOnSale: false,
        imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "Chanel Classic Flap Caviar",
        description: "What we sell are not just simple handbags, the products of our shop are a part of fashion history.",
        price: 170.00,
        originalPrice: null,
        isOnSale: false,
        imageUrl: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "Dakine Girls Messenger Laptop",
        description: "We know how important it is for the modern women to have several interesting and trendy bags for work and play.",
        price: 120.00,
        originalPrice: 190.00,
        isOnSale: true,
        imageUrl: "https://images.unsplash.com/photo-1628149462151-511bb7eb7e31?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 8,
        name: "Double Pocket Canvas Tote",
        description: "Nowadays fashion is an integral part of the culture and social relations. A practical and stylish daily driver.",
        price: 165.00,
        originalPrice: null,
        isOnSale: false,
        imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop"
    }
];

// 2. Dynamic Rendering Function
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    
    // Clear out the hardcoded HTML placeholder
    productGrid.innerHTML = '';

    // Loop through the data and build HTML for each item
    products.forEach(product => {
        // Handle conditional sale pricing display
        const priceHTML = product.isOnSale 
            ? `<span class="text-slate-700 font-bold">$ ${product.price.toFixed(2)}</span>
               <span class="text-slate-400 text-xs line-through">$ ${product.originalPrice.toFixed(2)}</span>`
            : `<span class="text-slate-700 font-bold">$ ${product.price.toFixed(2)}</span>`;

        // Handle conditional sale badge display
        const saleBadgeHTML = product.isOnSale
            ? `<div class="absolute top-2 right-2 bg-pink-400 text-white text-[10px] font-bold px-2 py-4 rounded-sm z-10" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);">SALE</div>`
            : '';

        // Construct the card HTML
        const cardHTML = `
            <div class="bg-white p-4 rounded shadow-sm relative group hover:shadow-md transition flex flex-col h-full">
                ${saleBadgeHTML}
                <div class="h-48 bg-fuchsia-50 mb-4 rounded flex items-center justify-center overflow-hidden">
                    <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                </div>
                <h4 class="text-pink-400 font-semibold text-sm truncate" title="${product.name}">${product.name}</h4>
                <p class="text-xs text-slate-400 mt-1 line-clamp-2 flex-grow">${product.description}</p>
                <div class="mt-3 flex items-baseline space-x-2">
                    ${priceHTML}
                </div>
                <div class="mt-4 flex space-x-2">
                    <button class="bg-slate-600 text-white text-xs px-3 py-2 rounded flex-1 hover:bg-slate-700 transition" onclick="addToCart(${product.id})">Add to cart</button>
                    <button class="border border-slate-300 text-slate-600 text-xs px-3 py-2 rounded hover:border-pink-400 hover:text-pink-400 transition">View</button>
                </div>
            </div>
        `;

        // Inject into the grid container
        productGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// 3. Initialize the render when the page loads
document.addEventListener('DOMContentLoaded', renderProducts);

// Placeholder for Phase 3 function
function addToCart(productId) {
    console.log(`Product ${productId} added to cart!`);
  }
