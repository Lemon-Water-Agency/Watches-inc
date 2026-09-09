import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// 1. PRODUCT DATA & RENDERING (CATALOG)
// ==========================================
const products = [
    { id: 1, name: "PRC 100 Titanium", price: "$2,450" },
    { id: 2, name: "Chronograph Stealth", price: "$1,850" },
    { id: 3, name: "Minimalist Series 1", price: "$950" },
    { id: 4, name: "Diver Pro Deep", price: "$3,200" },
    { id: 5, name: "Aviator GMT", price: "$4,100" },
    { id: 6, name: "Carbon Fiber Edition", price: "$2,900" }
];

// Reusable SVG Watch Wireframe
const watchSvgWireframe = `
    <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" class="watch-wireframe">
        <!-- Straps with link details -->
        <path d="M75 20 h50 v60 h-50 z M75 40 h50 M75 60 h50" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="2"/>
        <path d="M75 220 h50 v60 h-50 z M75 240 h50 M75 260 h50" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="2"/>
        <!-- Crown -->
        <rect x="160" y="142" width="6" height="16" rx="2" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="2"/>
        <!-- Case & Bezel -->
        <circle cx="100" cy="150" r="60" fill="none" stroke="currentColor" class="wireframe-bright" stroke-width="3"/>
        <circle cx="100" cy="150" r="50" fill="none" stroke="currentColor" class="wireframe-dim" stroke-width="1.5" stroke-dasharray="4 4"/>
        <!-- Hands -->
        <line x1="100" y1="150" x2="100" y2="115" stroke="currentColor" class="wireframe-bright" stroke-width="2" stroke-linecap="round"/>
        <line x1="100" y1="150" x2="120" y2="150" stroke="currentColor" class="wireframe-bright" stroke-width="3" stroke-linecap="round"/>
    </svg>
`;

function renderProducts() {
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

// Execute catalog rendering immediately
renderProducts();

// ==========================================
// 2. THREE.JS HERO SETUP
// ==========================================
const canvas = document.getElementById('watch-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, // Allows the background text to show through the canvas
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false; // Locks zoom to keep scale consistent
controls.enablePan = false;  // Locks panning

// Lighting (Premium Studio Setup)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 3);
mainLight.position.set(5, 10, 7);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);

// Load Model
let watchModel;
const loader = new GLTFLoader();

loader.load(
    'assets/models/invicta_watch.glb',
    function (gltf) {
        watchModel = gltf.scene;
        
        // Center and scale the model for the hero section
        watchModel.position.set(0, -0.5, 0);
        watchModel.scale.set(30, 30, 30); 
        
        scene.add(watchModel);
    },
    undefined,
    function (error) {
        console.error('An error happened loading the 3D model:', error);
    }
);

// ==========================================
// 3. ANIMATION & EVENT LISTENERS
// ==========================================
function animate() {
    requestAnimationFrame(animate);
    
    if (watchModel) {
        // Base upright rotations
        const baseRotX = (Math.PI / 2) - 0.1; 
        const baseRotY = 0;            
        const baseRotZ = 0; 
        
        // Premium idle sway
        const time = Date.now() * 0.001; 
        const sway = Math.sin(time * 0.5) * 0.15;
        
        watchModel.rotation.x = baseRotX;
        watchModel.rotation.y = baseRotY + sway;
        watchModel.rotation.z = baseRotZ;
    }

    controls.update(); 
    renderer.render(scene, camera);
}

// Start animation loop
animate();

// Handle window resize gracefully
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
