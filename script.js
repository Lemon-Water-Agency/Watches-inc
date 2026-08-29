import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// 1. Core Setup (Scene, Camera, Renderer)
// ==========================================
const canvas = document.getElementById('watch-canvas');
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();

// Camera setup (Field of View, Aspect Ratio, Near clipping, Far clipping)
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0, 5); // Pull camera back to view the model

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, // CRITICAL: Keeps background transparent to show Layer 1 text
    antialias: true // Smooths jagged edges on the model
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimizes for retina displays

// ==========================================
// 2. Lighting (Essential for GLTF materials)
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Soft global light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Strong directional light mimicking the sun/studio
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Optional: Add a subtle backlight to make the metallic edges pop
const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(-5, 5, -5);
scene.add(backLight);

// ==========================================
// 3. User Controls
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adds smooth deceleration
controls.dampingFactor = 0.05;
controls.enablePan = false;    // Prevents user from dragging the watch off-screen
controls.enableZoom = false;   // Prevents scrolling from messing with the hero layout
controls.autoRotate = true;    // Gives the watch a premium showcase feel
controls.autoRotateSpeed = 1.0; 

// ==========================================
// 4. Model Loading
// ==========================================
const loader = new GLTFLoader();
let watchModel;

loader.load(
    'assets/models/invicta_watch.glb', // Matches your exact file path
    (gltf) => {
        watchModel = gltf.scene;
        
        // 🚨 IMPORTANT: Scale and position often need tweaking depending on how the model was exported from Blender
        watchModel.scale.set(1, 1, 1); 
        watchModel.position.set(0, 0, 0);
        
        // Tilt the watch slightly so the face is visible
        watchModel.rotation.x = Math.PI / 8; 

        scene.add(watchModel);
    },
    (xhr) => {
        // Logs loading progress to the console
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('An error happened loading the 3D model:', error);
    }
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
// 6. Animation Loop
// ==========================================
function animate() {
    requestAnimationFrame(animate);
    
    // Required if controls.enableDamping or controls.autoRotate are set
    controls.update(); 
    
    renderer.render(scene, camera);
}

// Start the loop
animate();
