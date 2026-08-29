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
controls.autoRotate = false; // Disabled for custom sway animation

// Restrict viewing angles to the front face
controls.minAzimuthAngle = -Math.PI / 4; 
controls.maxAzimuthAngle = Math.PI / 4;  
controls.minPolarAngle = Math.PI / 3;        
controls.maxPolarAngle = Math.PI / 2 + 0.2;  

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
        const scaleFactor = 30; 
        watchModel.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        watchModel.position.set(0, -0.5, 0); 
        
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
function animate() {
    requestAnimationFrame(animate);
    
    // Custom sway animation
    if (watchModel) {
        const time = Date.now() * 0.001; 
        watchModel.rotation.y = Math.sin(time * 0.5) * 0.4 - (Math.PI / 12);
        watchModel.position.y = Math.sin(time * 1.2) * 0.05 - 0.5;
    }

    controls.update(); 
    renderer.render(scene, camera);
}

animate();
