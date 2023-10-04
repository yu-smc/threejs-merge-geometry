import * as THREE from "three";
import Stats from "stats-js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let world, mesh, positionsChunkParam;
const amount = 3000;
const boxSpeeds = [];

class World {
  constructor({ stageDom }) {
    this.stageDom = stageDom;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.stats = new Stats();
    this.orbitControls = null;

    this.beforeRenderFunctions = [];

    this.#init();
  }

  #init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60,
      this.stageDom.clientWidth / this.stageDom.clientHeight,
      1,
      5000
    );

    this.camera.position.set(0, 0, -10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setClearColor(new THREE.Color(0x000000));
    this.renderer.setSize(this.stageDom.clientWidth, this.stageDom.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.stageDom.appendChild(this.renderer.domElement);

    document.body.appendChild(this.stats.dom);

    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  update() {
    this.stats.begin();

    requestAnimationFrame(() => {
      this.update();
    });

    this.beforeRenderFunctions.forEach((f) => f());

    this.renderer.render(this.scene, this.camera);
    this.orbitControls.update();

    this.stats.end();
  }
}

const getInitialPositonVec3List = () => {
  const result = [];
  const radius = 3; // 球の半径
  const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // 黄金角

  for (let i = 0; i < amount; i++) {
    const y = 1 - (i / (amount - 1)) * 2; // -1から1までの値

    const distance = Math.sqrt(1 - y * y) * radius;
    const theta = phi * i;

    result.push(
      new THREE.Vector3(
        distance * Math.cos(theta),
        y * radius,
        distance * Math.sin(theta)
      )
    );
  }

  return result;
};

const updateGeometry = () => {
  const positionAttributes = mesh.geometry.attributes.position;

  for (let i = 0; i < amount; i++) {
    const initJ = i * positionsChunkParam;
    for (let j = initJ; j < initJ + positionsChunkParam; j += 3) {
      positionAttributes.array[j + 2] -= boxSpeeds[i];
    }
  }

  positionAttributes.needsUpdate = true;
};

const setupThreeContents = () => {
  const initialPositionVec3List = getInitialPositonVec3List();

  const geometries = [];
  for (let i = 0; i < amount; i++) {
    const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);

    const initPos = initialPositionVec3List[i];
    geometry.translate(initPos.x, initPos.y, initPos.z);

    geometries.push(geometry);
    boxSpeeds.push(Math.random() * 0.01);
  }

  const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);

  positionsChunkParam = mergedGeometry.attributes.position.array.length / amount;

  const material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
  });

  mesh = new THREE.Mesh(mergedGeometry, material);

  world.scene.add(mesh);

  const light = new THREE.PointLight(0xffffff, 100, 1000);
  light.position.set(3, 5, -10);
  world.scene.add(light);

  world.beforeRenderFunctions.push(updateGeometry);
};

const init = () => {
  world = new World({
    stageDom: document.getElementById("three-stage"),
  });

  setupThreeContents();

  world.update();
};

window.onload = init;
