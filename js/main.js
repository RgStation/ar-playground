import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

let camera, scene, renderer;
let currentModel = null;
let currentModelName = "";

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

    arButton.style.width = "220px";
    arButton.style.height = "80px";

    arButton.style.display = "flex";
    arButton.style.alignItems = "center";
    arButton.style.justifyContent = "center";

    arButton.style.padding = "5px, 20px";
    arButton.style.margin = "0";

    arButton.style.background = "black";
    arButton.style.color = "white";
    arButton.style.borderRadius = "14px";
    arButton.style.zIndex = "20";

    arButton.style.fontSize = "30px";
    arButton.style.textAlign = "center";

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

  renderer.setAnimationLoop(render);
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
        y = -0.4;
    }

    if (path.includes("heart")) {
        y = -0.5;
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

  currentModel.traverse((child) => {
    if (child.isMesh) {

      // korvaa materiaali kokonaan
      child.material = new THREE.MeshStandardMaterial({
        color: color
      });

    }
  });
}

// RENDER
function render() {

  if (currentModel && currentModelName !== "robot") {
    currentModel.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}