/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/img/background.png":
/*!********************************!*\
  !*** ./src/img/background.png ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "31942a041602f6de351ae417d153641e.png");

/***/ }),

/***/ "./src/img/plateform.png":
/*!*******************************!*\
  !*** ./src/img/plateform.png ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "b728bc7b848f49e63d1ca02d43f3025b.png");

/***/ }),

/***/ "./src/js/canvas.js":
/*!**************************!*\
  !*** ./src/js/canvas.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _img_plateform_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../img/plateform.png */ "./src/img/plateform.png");
/* harmony import */ var _img_background_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../img/background.png */ "./src/img/background.png");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 526;
var gravity = 1.5;

var Player = /*#__PURE__*/function () {
  function Player() {
    _classCallCheck(this, Player);

    this.position = {
      x: 100,
      y: 100
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.width = 30;
    this.height = 30;
  }

  _createClass(Player, [{
    key: "draw",
    value: function draw() {
      c.fillStyle = 'red';
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }, {
    key: "update",
    value: function update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.position.y + this.height + this.velocity.y <= canvas.height) this.velocity.y += gravity;
    }
  }]);

  return Player;
}();

var Plateform = /*#__PURE__*/function () {
  function Plateform(_ref) {
    var x = _ref.x,
        y = _ref.y,
        image = _ref.image;

    _classCallCheck(this, Plateform);

    this.position = {
      x: x,
      y: y
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height; //TODO Faire les bonnes dimensions cube trop haut
  }

  _createClass(Plateform, [{
    key: "draw",
    value: function draw() {
      c.drawImage(this.image, this.position.x, this.position.y);
    }
  }]);

  return Plateform;
}();

var GenericObject = /*#__PURE__*/function () {
  function GenericObject(_ref2) {
    var x = _ref2.x,
        y = _ref2.y,
        image = _ref2.image;

    _classCallCheck(this, GenericObject);

    this.position = {
      x: x,
      y: y
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height; //TODO Faire les bonnes dimensions cube trop haut
  }

  _createClass(GenericObject, [{
    key: "draw",
    value: function draw() {
      c.drawImage(this.image, this.position.x, this.position.y);
    }
  }]);

  return GenericObject;
}();

function createImage(imageSrc) {
  var image = new Image();
  image.src = imageSrc;
  return image;
}

var plateformImage = createImage(_img_plateform_png__WEBPACK_IMPORTED_MODULE_0__["default"]);
var player = new Player();
var plateforms = [new Plateform({
  x: -1,
  y: 420,
  image: plateformImage
}), new Plateform({
  x: plateformImage.width - 1,
  y: 420,
  image: plateformImage
}), new Plateform({
  x: plateformImage.width - 1,
  y: 420,
  image: plateformImage
}), new Plateform({
  x: plateformImage.width * 2 + 200,
  y: 420,
  image: plateformImage
})];
var genericObjects = [new GenericObject({
  x: 0,
  y: 0,
  image: createImage(_img_background_png__WEBPACK_IMPORTED_MODULE_1__["default"])
})];
var keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
};
var scrollOffset = 0;

function init() {
  player = new Player();
  plateforms = [new Plateform({
    x: -1,
    y: 420,
    image: plateformImage
  }), new Plateform({
    x: plateformImage.width - 1,
    y: 420,
    image: plateformImage
  }), new Plateform({
    x: plateformImage.width - 1,
    y: 420,
    image: plateformImage
  }), new Plateform({
    x: plateformImage.width * 2 + 200,
    y: 420,
    image: plateformImage
  })];
  genericObjects = [new GenericObject({
    x: 0,
    y: 0,
    image: createImage(_img_background_png__WEBPACK_IMPORTED_MODULE_1__["default"])
  })];
  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'wheat';
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach(function (genericObject) {
    genericObject.draw();
  });
  plateforms.forEach(function (plateform) {
    plateform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      plateforms.forEach(function (plateform) {
        scrollOffset += 5;
        plateform.position.x -= 5;
      });
      genericObjects.forEach(function (genericObject) {
        genericObject.position.x -= 3;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      plateforms.forEach(function (plateform) {
        plateform.position.x += 5;
      });
      genericObjects.forEach(function (genericObject) {
        genericObject.position.x += 3;
      });
    }
  } // plateform collision


  plateforms.forEach(function (plateform) {
    if (player.position.y + player.height <= plateform.position.y && player.position.y + player.height + player.velocity.y >= plateform.position.y && player.position.x + player.width >= plateform.position.x && player.position.x <= plateform.position.x + plateform.width) {
      player.velocity.y = 0;
    }
  }); // Win condition

  if (scrollOffset > 4000) {
    console.log('you win');
  } //Lose condition


  if (player.position.y > canvas.height) {
    init();
  }
}

animate();
addEventListener('keydown', function (_ref3) {
  var keyCode = _ref3.keyCode;
  console.log(keyCode);

  switch (keyCode) {
    case 81:
      console.log('left');
      keys.left.pressed = true;
      break;

    case 83:
      console.log('down');
      break;

    case 68:
      console.log('right');
      keys.right.pressed = true;
      break;

    case 90:
      console.log('up');
      player.velocity.y -= 20;
      break;
  }

  console.log(keys.right.pressed);
});
addEventListener('keyup', function (_ref4) {
  var keyCode = _ref4.keyCode;
  console.log(keyCode);

  switch (keyCode) {
    case 81:
      console.log('left');
      keys.left.pressed = false;
      break;

    case 83:
      console.log('down');
      break;

    case 68:
      console.log('right');
      keys.right.pressed = false;
      break;

    case 90:
      console.log('up');
      player.velocity.y -= 20;
      break;
  }

  console.log(keys.right.pressed);
});

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map