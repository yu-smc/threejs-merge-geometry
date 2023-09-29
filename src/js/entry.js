import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

class World {
  constructor({ stageDom }) {
    this.stageDom = stageDom;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

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

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setClearColor(new THREE.Color(0x000000));
    this.renderer.setSize(
      this.stageDom.clientWidth,
      this.stageDom.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.stageDom.appendChild(this.renderer.domElement);
  }

  update() {
    requestAnimationFrame(() => {
      this.update();
    });

    this.renderer.render(this.scene, this.camera);
  }
}

const init = () => {
  const world = new World({
    stageDom: document.getElementById("three-stage"),
  });
  world.update();
};

window.onload = init;
