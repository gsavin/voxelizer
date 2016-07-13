'use strict';

class Renderer {
  constructor(container) {
    this.render = this.render.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 500);
    this._camera.position.set(0, 5, 20);
    this._camera.up = new THREE.Vector3(0, 1, 0);

    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setClearColor(0xefefef);

    this._container = container;
    this._container.appendChild(this._renderer.domElement);

    this._scene = new THREE.Scene();

    this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.25;
    this._controls.enableZoom = true;

    this._controls.addEventListener('change', this.render);

    this._animated = false;

    window.addEventListener( 'resize', this.onWindowResize, false );
  }

  get scene() {
    return this._scene;
  }

  get controls() {
    return this._controls;
  }

  get camera() {
    return this._camera;
  }

  get animated() {
    return this._animated;
  }

  set animated(animated) {
    let a = this._animated;

    this._animated = animated;

    if (animated && !a) {
      requestAnimationFrame(this.animate);
    }
  }

  render() {
    this._renderer.render(this._scene, this._camera);
  }

  animate() {
    if (this._animated) {
      requestAnimationFrame(this.animate);
    }

    this.render();
  }

  onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize( window.innerWidth, window.innerHeight );

    requestAnimationFrame(this.render);
  }
}

module.exports = Renderer;
