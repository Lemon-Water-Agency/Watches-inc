// products.js

const products = [
    { id: 1, name: "PRC 100 Titanium", price: "$2,450" },
    { id: 2, name: "Chronograph Stealth", price: "$1,850" },
    { id: 3, name: "Minimalist Series 1", price: "$950" },
    { id: 4, name: "Diver Pro Deep", price: "$3,200" },
    { id: 5, name: "Aviator GMT", price: "$4,100" },
    { id: 6, name: "Carbon Fiber Edition", price: "$2,900" }
];

const watchSvgWireframe = `
    <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" class="watch-wireframe">
        <path d="M75 20 h50 v60 h-50 z M75 40 h50 M75 60 h50" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="2"/>
        <path d="M75 220 h50 v60 h-50 z M75 240 h50 M75 260 h50" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="2"/>
        <rect x="160" y="142" width="6" height="16" rx="2" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="2"/>
        <circle cx="100" cy="150" r="60" fill="none" stroke="currentColor" class="wireframe-bright" stroke-width="3"/>
        <circle cx="100" cy="150" r="50" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="1.5" stroke-dasharray="4 4"/>
        <line x1="100" y1="150" x2="100" y2="115" stroke="currentColor" class="wireframe-bright" stroke-width="2" stroke-linecap="round"/>
        <line x1="100" y1="150" x2="120" y2="150" stroke="currentColor" class="wireframe-bright" stroke-width="3" stroke-linecap="round"/>
    </svg>
`;

// Export the function so script.js can use it
export function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let html = '';
    products.forEach(product => {
        html += `
            <article class="product-card">
                <div class="product-svg-container">
                    ${watchSvgWireframe}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                </div>
            </article>
        `;
    });
    grid.innerHTML = html;
}
