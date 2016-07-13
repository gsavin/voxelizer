'use strict';

class Voxelizer extends THREE.Group {
  constructor() {
    super();

    this._displayRaycasters = false;
  }

  build(obj, subs, regular = false) {
    if (!(obj instanceof THREE.Mesh)) {
      throw "Voxelizer works with Mesh.";
    }

    if (typeof subs === 'number') {
      subs = new THREE.Vector3(subs, subs, subs);
    }

    let geom = obj.geometry;
    geom.computeBoundingBox();

    let scale = new THREE.Vector3(
      (geom.boundingBox.max.x - geom.boundingBox.min.x) / (subs.x - 1),
      (geom.boundingBox.max.y - geom.boundingBox.min.y) / (subs.y - 1),
      (geom.boundingBox.max.z - geom.boundingBox.min.z) / (subs.z - 1)
    );

    if (regular) {
      scale.x = scale.y = scale.z = Math.min(scale.x, scale.y, scale.z);

      subs.x = Math.ceil((geom.boundingBox.max.x - geom.boundingBox.min.x) / scale.x) + 1;
      subs.y = Math.ceil((geom.boundingBox.max.y - geom.boundingBox.min.y) / scale.y) + 1;
      subs.z = Math.ceil((geom.boundingBox.max.z - geom.boundingBox.min.z) / scale.z) + 1;
    }

    let boxG  = new THREE.BoxGeometry(0.95 * scale.x, 0.95 * scale.y, 0.95 * scale.z)
      , boxM  = new THREE.MeshBasicMaterial({color: 0x222222})
      , voxel = new THREE.Mesh(boxG, boxM);

    boxM.transparent = true;
    boxM.opacity = 0.5;

    this.build2(obj, subs, geom.boundingBox, scale, voxel);
  }

  build1(obj, subs, bb, scale, voxel) {
    let rays = [];

    [-1, 0, 1].forEach(dx => {
      [-1, 0, 1].forEach(dy => {
        [-1, 0, 1].forEach(dz => {
          let v = new THREE.Vector3(dx * scale.x, dy * scale.y, dz * scale.z)
            , l = v.length();

          v.normalize;

          rays.push([v, l]);
        });
      });
    });

    let rayPosition = new THREE.Vector3();

    for (let i = 0; i < subs.x; i++) {
      for (let j = 0; j < subs.y; j++) {
        for (let k = 0; k < subs.z; k++) {
          let v = voxel.clone();

          v.position.set(
            bb.min.x + i * scale.x + obj.position.x,
            bb.min.y + j * scale.y + obj.position.y,
            bb.min.z + k * scale.z + obj.position.z
          );

          for (let idx = 0; idx < rays.length; idx++) {
            rayPosition.copy(voxel.position);

            rayPosition.x -= Math.sign(rays[idx][0].x) * scale.x / 2;
            rayPosition.y -= Math.sign(rays[idx][0].y) * scale.y / 2;
            rayPosition.z -= Math.sign(rays[idx][0].z) * scale.z / 2;

            let ray       = new THREE.Raycaster(voxel.position, rays[idx][0], 0, rays[idx][1])
              , intersect = ray.intersectObject(obj, true);

            if (intersect.length > 0) {
              this.add(v);
              break;
            }
          }
        }
      }
    }
  }

  build2(obj, subs, bb, scale, voxel) {
    let hashes = {};

    this.buildRay(obj, subs, bb, scale, voxel, hashes, 'x', 'y', 'z');
    this.buildRay(obj, subs, bb, scale, voxel, hashes, 'x', 'z', 'y');
    this.buildRay(obj, subs, bb, scale, voxel, hashes, 'y', 'z', 'x');
  }

  buildRay(obj, subs, bb, scale, voxel, hashes, xn, yn, zn) {
    let p = new THREE.Vector3()
      , t = new THREE.Vector3()
      , d = new THREE.Vector3(0, 0, 0);

    let rayCasterG = new THREE.BoxGeometry(0.25 * scale.x, 0.25 * scale.y, 0.25 * scale.z)
      , rayCasterM = new THREE.MeshBasicMaterial({color: 0x006600})
      , rayCasterO = new THREE.Mesh(rayCasterG, rayCasterM);

    rayCasterM.transparent = true;
    rayCasterM.opacity = 0.5;

    for (let x = 0; x < subs[xn]; x++) {
      for (let y = 0; y < subs[yn]; y++) {
        p[xn] = bb.min[xn] + x * scale[xn];
        p[yn] = bb.min[yn] + y * scale[yn];
        p[zn] = bb.min[zn] - scale[zn] / 2;

        let lambda = (pz, dz, dRef) => {
          d[zn] = dz;
          p[zn] = pz;

          let ray       = new THREE.Raycaster(p, d)
            , intersect = ray.intersectObject(obj, true);

          if (this._displayRaycasters) {
            let o = rayCasterO.clone();
            o.position.copy(p);

            this.add(o);

            let lG = new THREE.Geometry();
            lG.vertices.push(
              p.clone(),
              p.clone()
            );
            lG.vertices[1].add(d);
            this.add(new THREE.Line(lG, rayCasterM));
          }

          if (intersect.length > 0) {
            for (let i = 0; i < intersect.length; i++) {
              /*let o = rayCasterO.clone();
              o.position.copy(intersect[i].point);
              this.add(o);*/

              let z = dRef(intersect[i].distance - scale[zn] / 2);
              z = Math.floor(z / scale[zn]);

              t[xn] = x;
              t[yn] = y;
              t[zn] = z;

              let hash = Math.floor(subs.x * subs.y * t.z + subs.x * t.y + t.x);

              if (!hashes[hash]) {
                hashes[hash] = true;

                let v = voxel.clone();

                v.position.set(
                  obj.position.x + bb.min.x + t.x * scale.x + scale.x / 2,
                  obj.position.y + bb.min.y + t.y * scale.y + scale.y / 2,
                  obj.position.z + bb.min.z + t.z * scale.z + scale.z / 2
                );

                this.add(v);
              }
            }
          }
        };

        lambda(bb.min[zn] - scale[zn] / 2,  1, d => { return d; });
        lambda(bb.max[zn] + scale[zn] / 2, -1, d => { return bb.max[zn] - bb.min[zn] - d; });
      }
    }
  }
}

module.exports = Voxelizer;
