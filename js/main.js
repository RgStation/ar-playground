import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

let camera, scene, renderer;
let currentModel = null;
let currentModelName = "";
let overlayMesh = null;

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

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  container.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // AR BUTTON
    const arButton = ARButton.createButton(renderer);
    document.body.appendChild(arButton);

    // selkeä tyyli
    arButton.style.position = "fixed";
    arButton.style.top = "10px";
    arButton.style.left = "10px";
    arButton.style.zIndex = "20";

  // NAPIT
  document.getElementById("robotBtn").onclick = () => {
    currentModelName = "robot";
    loadModel("assets/models/RobotExpressive.glb", 0.08);
  };
  document.getElementById("appleBtn").onclick = () => {
    currentModelName = "apple";
    loadModel("assets/models/apple.glb", 0.2);
  };
  document.getElementById("heartBtn").onclick = () => {
    currentModelName = "heart";
    loadModel("assets/models/pumping_heart_model.glb", 0.01);
  };
  document.getElementById("greenBtn").onclick = () => changeColor("#21aa41");
  document.getElementById("blueBtn").onclick = () => changeColor("#164ace");
  document.getElementById("yellowBtn").onclick = () => changeColor("#dff708");
  document.getElementById("pinkBtn").onclick = () => changeColor("#f708b7");

  // FILTER VÄRIHOMMA
  const overlayGeometry = new THREE.PlaneGeometry(10, 10);

  const overlayMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0,
  });

  overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);

    document.getElementById("normalFilter").onclick = () => setFilter(0x000000, 0);
    document.getElementById("redFilter").onclick = () => setFilter(0xff0000, 0.2);
    document.getElementById("blueFilter").onclick = () => setFilter(0x0000ff, 0.2);
    document.getElementById("greenFilter").onclick = () => setFilter("#21aa41", 0.2);

  // kameran eteen
  overlayMesh.position.set(0, 0, -0,5);
  camera.add(overlayMesh);
  scene.add(camera);

  renderer.setAnimationLoop(render);
}

function setFilter(color, opacity) {
    if (!overlayMesh) return;

    overlayMesh.material.color.set(color);
    overlayMesh.material.opacity = opacity;
}

// LOAD MODEL
function loadModel(path, scale) {

  if (currentModel) {
    scene.remove(currentModel);
  }

  loader.load(path, (gltf) => {

    currentModel = gltf.scene;

    // eri korkeudet eri malleille
    let y = -0.2;

    if (path.includes("RobotExpressive")) {
        y = -0.3;
    }

    if (path.includes("heart")) {
        y = -0.3;
    }

    currentModel.scale.setScalar(scale);

    // 👇 tärkeä: alas ja eteen
    currentModel.position.set(0, y, -1);

    scene.add(currentModel);
  });
}

// COLOR
function changeColor(color) {

  if (!currentModel) return;

  if (currentModelName === "robot") return;

  currentModel.traverse((child) => {
    if (child.isMesh && child.material) {

      child.material.map = null;
      child.material.color.set(color);
      child.material.needsUpdate = true;

    }
  });
}

// RENDER
function render() {
    if (overlayMesh) {
        const distance = 0.5;

        const dir = new THREE.Vector3(0, 0, -1);
        dir.appyQuaternion(camera.quaternion);

        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        overlayMesh.position.copy(pos);
        overlayMesh.quaternion.copy(camera.quaternion);
    }

  renderer.render(scene, camera);
}