/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	const Renderer  = __webpack_require__(5)
	    , container = document.querySelector('#container')
	    , stlLoader = new THREE.STLLoader()
	    , Voxelizer = __webpack_require__(6)
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  margin: 0px;\n  padding: 0px; }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);