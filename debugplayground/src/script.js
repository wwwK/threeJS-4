import './styles.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import GUI from "lil-gui";
const canvas = document.querySelector("canvas");

// for debug panel
const parameters = {
  color: '',
  radius: 10,
  tube: 3
}

// sets reusable sizes for use globally
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// base for scene build *
const scene = new THREE.Scene();
// CAMERA creation
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = parameters.radius * 3.5;
// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// *

// CAMERA controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// maintains sizing despite window resizing by resetting size options on window resize
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  
  // update camera properties
  camera.aspect = sizes.width / sizes.height;
});

// objects
const geometry = new THREE.TorusKnotGeometry(parameters.radius, parameters.tube, 100, 16);
const material = new THREE.MeshToonMaterial({ color: parameters.color });
const mesh = new THREE.Mesh(geometry, material);

// for axes view
const axesHelper = new THREE.AxesHelper();
// debug panel/controls **
const gui = new GUI();
gui.title('Playground Controls')
// MESH: edit position on screen
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('X-Axis');
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Y-Axis');
gui.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('Z-Axis');
// edit mesh visibility
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
// edit color
gui.addColor(parameters, 'color').onChange(() => {
  // onChange, set material color to changed selection
  material.color.set(parameters.color)
});
// CAMERA
// **

// add items to scene
scene.add(camera, mesh, axesHelper);

const animationTick = () => {
  controls.update();
  
  renderer.render(scene, camera);
  
  window.requestAnimationFrame(animationTick);
};

animationTick();