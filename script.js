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

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.enablePan = false;    
controls.enableZoom = false;   
controls.autoRotate = true;    
controls.autoRotateSpeed = 1.0; 

const loader = new GLTFLoader();
let watchModel;

loader.load(
    'assets/models/invicta_watch.glb', 
    (gltf) => {
        watchModel = gltf.scene;
        
        // Ensure scale and position match what you dialed in previously
        const scaleFactor = 40; 
        watchModel.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        watchModel.position.set(0, -0.5, 0); 
        
        watchModel.rotation.x = Math.PI / 6; 
        watchModel.rotation.y = -Math.PI / 12; 
        watchModel.rotation.z = Math.PI / 24; 

        // 4. MESH TRAVERSAL (Failsafe for glass opacity)
        watchModel.traverse((child) => {
            if (child.isMesh && child.material) {
                // Ensure materials read environment lighting properly
                child.material.envMapIntensity = 1.0;
                child.material.needsUpdate = true;
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

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}
animate();
