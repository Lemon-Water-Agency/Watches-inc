import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ==========================================
// DATA LAYER: Product Information
// ==========================================

// Data for Act II: The Flagship Deep Dive
const flagshipWatch = {
    id: 'flagship-1',
    brand: 'CARREN WATCHES',
    model: 'PRC 100 TITANIUM',
    type: '(CHRONOGRAPH)',
    description: 'Relive the original era with our newest models. The vintage look has been enhanced with a slimmer profile and a Master Chronometer upgrade.',
    price: '$2,450',
    specs: {
        size: 'GENT',
        caseMaterial: 'TITANIUM',
        waterResistance: '10 BAR (100M)',
        glassMaterial: 'SAPPHIRE CRYSTAL',
        dialColor: 'ANTHRACITE',
        dialType: 'INDEX',
        braceletMaterial: 'TITANIUM',
        movementCaliber: 'G10.211',
        movementType: 'QUARTZ'
    },
    thumbnails: [
        'assets/images/thumb-front.png',
        'assets/images/thumb-side.png',
        'assets/images/thumb-back.png'
    ]
};

// Data for Act III: The Light Catalog Grid
const catalogWatches = [
    { id: 'cat-1', brand: 'Rolex Daytona', price: '$17,551', image: 'assets/images/rolex.png' },
    { id: 'cat-2', brand: 'Seiko Watch', price: '$4,521', image: 'assets/images/seiko.png' },
    { id: 'cat-3', brand: 'Citizen Watches', price: '$8,266', image: 'assets/images/citizen.png' }
];



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
// 6. Animation Loop (Swaying)
// ==========================================


// ==========================================
// 6. Scroll Animation Interpolation
// ==========================================
function animate() {
    requestAnimationFrame(animate);
    
    if (watchModel) {
        // Calculate how far the user has scrolled down the page
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        let scrollPercent = scrollY / maxScroll;
        
        // Clamp scroll percent between 0 and 1
        scrollPercent = Math.max(0, Math.min(1, scrollPercent));

       // --- INTERPOLATION TARGETS ---
        
        // Hero State (Scroll 0) - Centered and upright, facing the camera
        const startX = 0;
        const startY = -0.5;
        const startScale = 30;
        
        // 🚨 CORRECTED ROTATIONS 🚨
        // Math.PI / 2 tips the model 90 degrees forward so the face looks at the camera.
        // We subtract a tiny bit (0.1) so it leans back just slightly for a premium look.
        const startRotX = (Math.PI / 2) - 0.1; 
        const startRotY = 0;            
        const startRotZ = 0;            

        // Collection State (Scroll 1) - Bottom left, scaled up, angled right
        const endX = -2.5; 
        const endY = -1.5;
        const endScale = 55;
        
        // Match the X and Z rotations to keep it standing up during scroll
        const endRotX = Math.PI / 2;    
        const endRotY = Math.PI / 6;    // Turns slightly right
        const endRotZ = 0;              

        // Apply Linear Interpolation (Lerp) based on scroll
        watchModel.position.x = startX + (endX - startX) * scrollPercent;
        watchModel.position.y = startY + (endY - startY) * scrollPercent;
        
        const currentScale = startScale + (endScale - startScale) * scrollPercent;
        watchModel.scale.set(currentScale, currentScale, currentScale);

        // Apply axis rotations
        watchModel.rotation.x = startRotX + (endRotX - startRotX) * scrollPercent;
        watchModel.rotation.z = startRotZ + (endRotZ - startRotZ) * scrollPercent;
        
        // Add the idle sway on top of the scroll rotation (Y-axis)
        const time = Date.now() * 0.001; 
        const sway = Math.sin(time * 0.5) * 0.15;
        watchModel.rotation.y = (startRotY + (endRotY - startRotY) * scrollPercent) + sway;
    }

    controls.update(); 
    renderer.render(scene, camera);
}

animate();
