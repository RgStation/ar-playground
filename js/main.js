import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

let camera, scene, renderer;
let currentModel = null;

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

  // pakotetaan tyyli JS:llä (varmin tapa)
  arButton.style.position = "fixed";
  arButton.style.top = "10px";
  arButton.style.left = "10px";
  arButton.style.width = "120px";
  arButton.style.height = "40px";
  arButton.style.zIndex = "20";

  // NAPIT
  document.getElementById("robotBtn").onclick = () => loadModel("assets/models/RobotExpressive.glb", 0.4, -0.5);
  document.getElementById("appleBtn").onclick = () => loadModel("assets/models/apple.glb", 0.2, -0.2);
  document.getElementById("heartBtn").onclick = () => loadModel("assets/models/heart_in_love.glb", 0.1, -0.2);
  document.getElementById("colorBtn").onclick = () => changeColor(0x00ff00);

  renderer.setAnimationLoop(render);
}

// 🔄 LOAD MODEL
function loadModel(path, scale, yPos) {

  if (currentModel) {
    scene.remove(currentModel);
  }

  loader.load(path, (gltf) => {

    currentModel = gltf.scene;

    currentModel.scale.setScalar(scale);

    // 👇 tärkeä: alas ja eteen
    currentModel.position.set(0, yPos, -1);

    scene.add(currentModel);
  });
}

// 🎨 COLOR (toimii myös tekstuureilla)
function changeColor(color) {

  if (!currentModel) return;

  currentModel.traverse((child) => {
    if (child.isMesh) {

      // korvaa materiaali kokonaan (varmin tapa)
      child.material = new THREE.MeshStandardMaterial({
        color: color
      });

    }
  });
}

// 🎥 RENDER
function render() {

  if (currentModel) {
    currentModel.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}