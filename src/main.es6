'use strict';

require('./main.scss');

const Renderer  = require('./renderer.es6')
    , container = document.querySelector('#container')
    , stlLoader = new THREE.STLLoader()
    , Voxelizer = require('./voxelizer.es6')
    , loader    = document.querySelector('#loader')
    , granularity = document.querySelector('#granularity')
    , granularityValue = document.querySelector('#granularity-value')
    , displayOriginal = document.querySelector('input[name="display-original"]');

granularity.addEventListener('input', () => {
  granularityValue.innerHTML = granularity.value + " subdivisions";
});

let renderer = new Renderer(container);
renderer.render();

let m = new THREE.MeshBasicMaterial({color: 0x660000});
m.transparent = true;
m.opacity = 0.5;

loader.addEventListener('change', e => {
  let file = e.target.files[0];

  if (file) {
    let reader = new FileReader();

    loader.disabled = true;

    reader.onload = e => {
      let contents = e.target.result
        , geom     = stlLoader.parse(contents);

      setTimeout(() => {
        let mesh = new THREE.Mesh(geom, m);

        if (displayOriginal.checked) {
          renderer.scene.add(mesh);
        }

        geom.computeBoundingBox();

        /*mesh.translateX(-(geom.boundingBox.max.x - geom.boundingBox.min.x) / 2);
        mesh.translateY(-(geom.boundingBox.max.y - geom.boundingBox.min.y) / 2);
        mesh.translateZ(-(geom.boundingBox.max.z - geom.boundingBox.min.z) / 2);*/

        let voxelizer = new Voxelizer(renderer);
        renderer.scene.add(voxelizer);
        voxelizer.build(mesh, parseInt(granularity.value), true);

        requestAnimationFrame(renderer.render);

        loader.disabled = false;
        loader.value = '';
      }, 5);
    };

    console.log("Start loading", file.name);
    reader.readAsArrayBuffer(file);
  }
}, false);

/*stlLoader.load('./sample.stl', geom => {
  let m = new THREE.MeshBasicMaterial({color: 0x660000});
  m.transparent = true;
  m.opacity = 0.5;

  let range = document.createElement('input');
  range.setAttribute('type', 'range');
  range.setAttribute('min', 0);
  range.setAttribute('max', 1);
  range.setAttribute('value', 0.5);
  range.setAttribute('step', 0.05);
  range.style.position = 'absolute';
  range.style.top = '0px';
  range.style.right  = '0px';

  container.appendChild(range);

  range.addEventListener('change', e => {
    m.opacity = range.value;
    m.needsUpdate = true;

    requestAnimationFrame(renderer.render);
  });

  let mesh = new THREE.Mesh(geom, m);
  //renderer.scene.add(mesh);

  let voxelizer = new Voxelizer(renderer);
  renderer.scene.add(voxelizer);
  voxelizer.build(mesh, 10, true);

  requestAnimationFrame(renderer.render);
});*/
