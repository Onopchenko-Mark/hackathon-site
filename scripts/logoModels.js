import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import processItem from "../scripts/partsData";
import * as dat from "dat.gui";

// Screen size storage
const sizes = {
  width: window.innerWidth * 0.8,
  height: window.innerHeight / 3,
};

// Models
const teslaModel = new THREE.Object3D();
const volkModel = new THREE.Object3D();
const mercModel = new THREE.Object3D();
const audiModel = new THREE.Object3D();

// Item names
const ids_to_names = {};
export const positions = [teslaModel, volkModel, mercModel, audiModel];

// Scene
const scene = new THREE.Scene();

// Camera
// FOV, aspect ratio
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  300
);
camera.position.set(2, 0, 15);
camera.rotation.y = 0.1;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#motors"),
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

rgbeLoader.load("models/env_map.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  loader.load("models/tesla_logo/scene.gltf", (gltf) => {
    teslaModel.add(gltf.scene);
    scene.add(teslaModel);
    const modelScale = 10;
    teslaModel.scale.set(modelScale, modelScale, modelScale);
    teslaModel.rotation.y = 0.4;
    ids_to_names[teslaModel.id] = "TeslaMotor";
  });

  loader.load("models/volkswagen_logo/scene.gltf", (gltf) => {
    volkModel.add(gltf.scene);
    scene.add(volkModel);
    const modelScale = 1.5;
    volkModel.scale.set(modelScale, modelScale, modelScale);
    volkModel.position.set(30, -20, 0);
    volkModel.rotation.x = Math.PI * 0.25;
    ids_to_names[volkModel.id] = "VolkswagenMotor";
  });

  loader.load("models/mercedes_logo/scene.gltf", processMerc);
  function processMerc(gltf) {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    gltf.scene.position.set(-c.x, size.y / 2 - c.y, -c.z); // center the gltf scene
    mercModel.add(gltf.scene);
    scene.add(mercModel);
    const modelScale = 0.22;
    mercModel.scale.set(modelScale, modelScale, modelScale);
    mercModel.rotation.x = Math.PI * 0.5;
    mercModel.position.set(0, -40, 0);
    ids_to_names[mercModel.id] = "MercedesMotor";
  }

  loader.load("models/audi_logo/scene.gltf", processAudi);
  function processAudi(gltf) {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    gltf.scene.position.set(-c.x, size.y / 2 - 2.4 * c.y, -c.z); // center the gltf scene
    audiModel.add(gltf.scene);
    scene.add(audiModel);
    const modelScale = 2;
    audiModel.scale.set(modelScale, modelScale, modelScale);
    audiModel.position.set(-30, -20, 0);
    audiModel.rotation.set(-0.1, -0.65, 0.05);
    ids_to_names[audiModel.id] = "AudiMotor";
  }
});

// Resize
window.addEventListener("resize", () => {
  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
});

// // Dat GUI
// const gui = new dat.GUI();
// let folderCam = gui.addFolder("Camera");
// folderCam.add(camera.position, "x", -20, 20, 0.1).name("X");
// folderCam.add(camera.position, "y", -20, 20, 0.1).name("Y");
// folderCam.add(camera.position, "z", 0, 100, 0.1).name("Z");

const loop = () => {
  renderer.render(scene, camera);
  for (let id in ids_to_names) {
    if (id == volkModel.id) continue;
    scene.getObjectById(Number.parseInt(id), true).rotation.y += 0.01;
  }
  window.requestAnimationFrame(loop);
};

loop();

const parts = {
  TeslaMotor: {
    name: "Tesla Motor",
    cost: 2500,
    power: 450,
    consume: 0.34,
  },
  VolkswagenMotor: {
    name: "Volkswagen Motor",
    cost: 2200,
    power: 430,
    consume: 0.29,
  },
  MercedesMotor: {
    name: "Mercedes Motor",
    cost: 2600,
    power: 460,
    consume: 0.37,
  },
  AudiMotor: {
    name: "Audi Motor",
    cost: 2000,
    power: 400,
    consume: 0.25,
  },
};

export default function processItem(inputItem) {
  const item = parts[ids_to_names[inputItem.id]];
  document.querySelector("header").innerText = item.name;
  document.querySelector(".right-panel").innerHTML = "";

  document.querySelector(
    ".right-panel"
  ).innerHTML += `<p class="price">Price: $${item.cost}</p>`;

  document.querySelector(
    ".right-panel"
  ).innerHTML += ` <div class="specs"></div>`;
  document.querySelector(
    ".specs"
  ).innerHTML += `<p class="power">Power: ${item.power} hsp<p>`;
  document.querySelector(
    ".specs"
  ).innerHTML += `<p class="consume">  Efficiency: ${item.consume} kWh</p>
`;
}
