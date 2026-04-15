import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

let camera, scene, renderer;
let currentModel = null;
let models = {};

const loader = new THREE.GLTFLoader();

init();

function init() {

  const container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 1.6, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  container.appendChild(renderer.domElement);

  // VALO
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // AR BUTTON
  const arButton = ARButton.createButton(renderer);
  document.body.appendChild(arButton);

  arButton.style.position = "fixed";
  arButton.style.top = "10px";
  arButton.style.right = "10px";
  arButton.style.width = "120px";
  arButton.style.height = "40px";
  arButton.style.zIndex = "10";

  // LADATAAN MALLIT
  loadAllModels();

  // NAPIT
  document.getElementById("robotBtn").onclick = () => switchModel("robot");
  document.getElementById("appleBtn").onclick = () => switchModel("apple");
  document.getElementById("heartBtn").onclick = () => switchModel("heart");
  document.getElementById("colorBtn").onclick = () => changeColor(0x00ff00);

  renderer.setAnimationLoop(render);
}

// LATAA KAIKKI
function loadAllModels() {

  loader.load("assets/models/RobotExpressive.glb", (gltf) => {
    models.robot = gltf.scene;
    setupModel(models.robot, 1.2);
  });

  loader.load("assets/models/apple.glb", (gltf) => {
    models.apple = gltf.scene;
    setupModel(models.apple, 0.3);
  });

  loader.load("assets/models/heart_in_love.glb", (gltf) => {
    models.heart = gltf.scene;
    setupModel(models.heart, 0.5);
  });
}

// MALLIN ASETUKSET
function setupModel(model, scale) {
  model.scale.setScalar(scale);

  model.visible = false;

  scene.add(model);
}

// VAIHTO
function switchModel(name) {

  if (currentModel) {
    currentModel.visible = false;
  }

  currentModel = models[name];

  if (currentModel) {
    placeInFrontOfCamera(currentModel);
    currentModel.visible = true;
  }
}

// MALLI KAMERAN ETEEN

function placeInFrontOfCamera(model) {

    const distance = 1;

    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(camera.quaternion);

    const pos = camera.position.clone().add(dir.multiplyScalaer(distance));

    model.position.copy(pos);

    model.lookAt(camera.position);
}

// VÄRIN VAIHTO
function changeColor(color) {
  if (!currentModel) return;

  currentModel.traverse((child) => {
    if (child.isMesh && child.material && child.material.color) {
        child.material.color.set(color);
      }
  });
}

// RENDER
function render() {

  if (currentModel) {
    currentModel.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}