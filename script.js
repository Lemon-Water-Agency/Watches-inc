import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ==========================================
// 1. Core Setup
// ==========================================
const canvas = document.getElementById('watch-canvas');
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Color Space & Tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// ==========================================
// 2. Lighting & Environment
// ==========================================
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ==========================================
// 3. User Controls & Limits
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false;

// --- HORIZONTAL LIMITS (AZIMUTH) ---
// Restrict horizontal rotation to a tight ±20° cone (approx ±0.35 rad)
// Decreasing this value narrows the view further; 0 locks it completely.
controls.minAzimuthAngle = -Math.PI / 9; // -20 degrees
controls.maxAzimuthAngle = Math.PI / 9;  // +20 degrees

// --- VERTICAL LIMITS (POLAR) ---
// Math.PI / 2 is level with the center. Clamping between ~75° and ~95°
// prevents looking from too high above or under the bezel.
controls.minPolarAngle = Math.PI / 2.4; // ~75 degrees
controls.maxPolarAngle = Math.PI / 1.9; // ~95 degrees 

// ==========================================
// 4. Model Loading & Material Override
// ==========================================
const loader = new GLTFLoader();
let watchModel;

loader.load(
    'assets/models/invicta_watch.glb', 
    (gltf) => {
        watchModel = gltf.scene;
        
        // Scale and Position
        const scaleFactor = 50; 
        watchModel.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        watchModel.position.set(0, 5.5, 0); 
        
        // Initial Rotation
        watchModel.rotation.x = Math.PI / 6; 
        watchModel.rotation.z = Math.PI / 24; 

        // Material Traversal
        watchModel.traverse((child) => {
            if (child.isMesh && child.material) {
                // Override broken glass material
                if (child.material.name === 'Material.000') {
                    const newGlassMaterial = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff,
                        metalness: 0.1,
                        roughness: 0.0,
                        transparent: true,
                        opacity: 0.15,
                        depthWrite: false, // Prevents artifacting over HTML
                        envMapIntensity: 2.5
                    });
                    child.material = newGlassMaterial;
                } else {
                    // Update rest of the watch for reflections
                    child.material.envMapIntensity = 1.0;
                    child.material.needsUpdate = true;
                }
            }
        });

        scene.add(watchModel);
    },
    undefined,
    (error) => console.error('An error happened:', error)
);

// ==========================================
// 5. Responsiveness
// ==========================================
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// ==========================================
// 1. Product Data & Rendering
// ==========================================
const products = [
    { id: 1, name: "PRC 100 Titanium", price: "$2,450" },
    { id: 2, name: "Chronograph Stealth", price: "$1,850" },
    { id: 3, name: "Minimalist Series 1", price: "$950" },
    { id: 4, name: "Diver Pro Deep", price: "$3,200" }
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

renderProducts();
// ==========================================
// 6. Animation Loop (Clean Hero Setup)
// ==========================================
function animate() {
    requestAnimationFrame(animate);
    
    if (watchModel) {
        // Lock to the exact center of the screen
        watchModel.position.set(0, -0.5, 0);
        watchModel.scale.set(30, 30, 30);
        
        // Base upright rotations
        const baseRotX = (Math.PI / 2) - 0.1; 
        const baseRotY = 0;            
        const baseRotZ = 0; 
        
        // Add the premium idle sway
        const time = Date.now() * 0.001; 
        const sway = Math.sin(time * 0.5) * 0.15;
        
        watchModel.rotation.x = baseRotX;
        watchModel.rotation.y = baseRotY + sway;
        watchModel.rotation.z = baseRotZ;
    }

    controls.update(); 
    renderer.render(scene, camera);
}

animate();
