import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 1. IMPORT ROOM ENVIRONMENT
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'; 

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

// 2. CRITICAL: COLOR SPACE & TONE MAPPING FOR GLTF
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// 3. GENERATE ENVIRONMENT MAP FOR REFLECTIONS
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

// (Optional) You can keep or remove your directional lights now, 
// as the RoomEnvironment provides excellent baseline lighting.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ==========================================
// 3. User Controls
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.enablePan = false;    
controls.enableZoom = false;   

// --- NEW: RESTRICT ROTATION ANGLES ---
// 1. Horizontal (Azimuth) Limits: Lock to a 90-degree front cone
controls.minAzimuthAngle = -Math.PI / 4; // -45 degrees
controls.maxAzimuthAngle = Math.PI / 4;  // 45 degrees

// 2. Vertical (Polar) Limits: Prevent looking straight over the top/bottom
controls.minPolarAngle = Math.PI / 3;        // ~60 degrees from top
controls.maxPolarAngle = Math.PI / 2 + 0.2;  // Just below the equator

// Turn OFF default autoRotate, as it will get stuck against the new limits
controls.autoRotate = false;


const loader = new GLTFLoader();
let watchModel;

loader.load(
    'assets/models/invicta_watch.glb', 
    (gltf) => {
        watchModel = gltf.scene;
        
        const scaleFactor = 50; 
        watchModel.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        watchModel.position.set(0, -0.5, 0); 
        
        watchModel.rotation.x = Math.PI / 6; 
        watchModel.rotation.y = -Math.PI / 12; 
        watchModel.rotation.z = Math.PI / 24; 

        // --- NEW MATERIAL OVERRIDE LOGIC ---
        watchModel.traverse((child) => {
            if (child.isMesh && child.material) {
                
                // Target the specific broken glass material by name
                if (child.material.name === 'Material.000') {
                    // Create a realistic physical glass material
                    // Replace the previous broken material
                   // Replace the previous broken material
                        const newGlassMaterial = new THREE.MeshPhysicalMaterial({
                            color: 0xffffff,
                            metalness: 0.1,
                            roughness: 0.0,
                            transparent: true,  // Enable classic transparency
                            opacity: 0.15,      // Very low opacity to see the dial clearly
                            depthWrite: true,  // CRITICAL: Prevents the glass from z-fighting with the dial behind it
                            envMapIntensity: 2.5 // Crank up the reflections to maintain the "glassy" look
                        });
                    // replace the broken material
                    child.material = newGlassMaterial;
                } else {
                    // Ensure metal and dial materials read environment lighting properly
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
    
    // Apply a gentle, continuous swaying motion to the model
    if (watchModel) {
        const time = Date.now() * 0.001; // Elapsed time in seconds
        
        // Sway the Y-axis (left to right) smoothly
        // Multipliers control the speed and the width of the swing
        watchModel.rotation.y = Math.sin(time * 0.5) * 0.4 - (Math.PI / 12);
        
        // Optional: Add a very slight floating effect on the Y position
        watchModel.position.y = Math.sin(time * 1.2) * 0.05 - 0.5;
    }

    controls.update(); 
    renderer.render(scene, camera);
}
