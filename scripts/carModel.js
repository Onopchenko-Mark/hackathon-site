import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import * as dat from "dat.gui";

// Screen size storage
const sizes = {
  width: window.innerWidth * 0.8,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

//Grid;
let gridHelper = new THREE.GridHelper(500);
scene.add(gridHelper);

// Camera
// FOV, aspect ratio
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  300
);
camera.position.set(0, 40, 120);
camera.rotation.y = 0.1;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

// Load Models
const rgbeLoader = new RGBELoader();
const loader = new GLTFLoader();

const carModel = new THREE.Object3D();
rgbeLoader.load("models/env_map.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  loader.load("models/car/scene.gltf", processCar);

  function processCar(gltf) {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    gltf.scene.position.set(-c.x, size.y / 2 - c.y, -c.z); // center the gltf scene
    carModel.add(gltf.scene);
    scene.add(carModel);
    carModel.position.set(0, 0, 0);
  }
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// // Dat GUI
// const gui = new dat.GUI();
// let folderCam = gui.addFolder("Camera");
// folderCam.add(camera.position, "x", -500, 1000, 1).name("X");
// folderCam.add(camera.position, "y", 0, 1000, 1).name("Y");
// folderCam.add(camera.position, "z", 0, 1000, 1).name("Z");

// Resize
window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();
