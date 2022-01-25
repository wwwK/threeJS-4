import './styles.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import GUI from "lil-gui";
import gradientTexture from './gradients/3.jpg';
import { NearestFilter } from 'three';

const canvas = document.querySelector("canvas");

// for debug panel
const parameters = {
  color: '',
  lightColor: '',
  lightIntensity: 1,
  radius: 10,
  tube: 3,
  p: 2,
  q: 3,
  rotation: {
    x: 0.1,
    y: 0.1,
    z: 0.1
  }
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
// LIGHT
const light = new THREE.AmbientLight(parameters.lightColor, 0.5)
light.position.set(50, 50 , 50)
const pointLight = new THREE.PointLight(parameters.lightColor, 0.5)
pointLight.position.set(38, 38, 38)
light.color.set(parameters.lightColor)
pointLight.color.set(parameters.lightColor)

// maintains sizing despite window resizing by resetting size options on window resize
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  
  // update camera properties
  camera.aspect = sizes.width / sizes.height;
});

// TEXTURE
const textureLoader = new THREE.TextureLoader()
const toonTexture = textureLoader.load(gradientTexture)
toonTexture.minFilter = THREE.NearestFilter
toonTexture.magFilter = THREE.NearestFilter
toonTexture.generateMipmaps = false

// OBJECTS
const geometry = new THREE.TorusKnotGeometry(parameters.radius, parameters.tube, 100, 16, parameters.p, parameters.q);

const material = new THREE.MeshToonMaterial();
material.gradientMap = toonTexture
const mesh = new THREE.Mesh(
  geometry,
  material
  );

// for axes view
const axesHelper = new THREE.AxesHelper();
// debug panel/controls **
const gui = new GUI();
gui.title('Playground Controls')
// MESH: edit position on screen
const meshPosition = gui.addFolder('Position')
meshPosition.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('X-Axis');
meshPosition.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Y-Axis');
meshPosition.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('Z-Axis');
// ** FIX **
const meshRotation = gui.addFolder('Rotation')
meshRotation.add(mesh.rotation, 'x').min(-0.3).max(0.3).step(0.01).name('X-Axis')
// **** ^ FIX ^ ***
// LOOPS
const appearanceFolder = gui.addFolder('Appearance')
// edit mesh visibility
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
// edit color
gui.addColor(parameters, 'color').onChange(() => {
  // onChange, set material color to changed selection
  material.color.set(parameters.color)
});
// LIGHTS
gui.addColor(light, 'color').onChange(() => {
  light.color.set(parameters.lightColor)
}).name('light color')
// 
// **

// add items to scene
scene.add(camera, mesh, axesHelper, light, pointLight);

const clock = new THREE.Clock()

const animationTick = () => {
  const elapsedTime = clock.getElapsedTime()
  controls.update();

  mesh.rotation.x = parameters.rotation.x * elapsedTime
  mesh.rotation.y = parameters.rotation.y * elapsedTime
  mesh.rotation.z = parameters.rotation.z * elapsedTime

  renderer.render(scene, camera);
  
  window.requestAnimationFrame(animationTick);
};

animationTick();