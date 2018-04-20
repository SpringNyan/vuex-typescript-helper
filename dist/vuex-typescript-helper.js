(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vuex-typescript-helper"] = factory();
	else
		root["vuex-typescript-helper"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! exports provided: createModuleBuilder, createNamespacedStoreFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module */ \"./lib/module.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"createModuleBuilder\", function() { return _module__WEBPACK_IMPORTED_MODULE_0__[\"createModuleBuilder\"]; });\n\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ \"./lib/store.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"createNamespacedStoreFactory\", function() { return _store__WEBPACK_IMPORTED_MODULE_1__[\"createNamespacedStoreFactory\"]; });\n\n\r\n\r\n\n\n//# sourceURL=webpack://vuex-typescript-helper/./lib/index.js?");

/***/ }),

/***/ "./lib/module.js":
/*!***********************!*\
  !*** ./lib/module.js ***!
  \***********************/
/*! exports provided: createModuleBuilder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createModuleBuilder\", function() { return createModuleBuilder; });\nvar __assign = (undefined && undefined.__assign) || Object.assign || function(t) {\r\n    for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n        s = arguments[i];\r\n        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n            t[p] = s[p];\r\n    }\r\n    return t;\r\n};\r\nvar _ModuleBuilder = /** @class */ (function () {\r\n    function _ModuleBuilder(state) {\r\n        this._module = {\r\n            state: {},\r\n            getters: {},\r\n            mutations: {},\r\n            actions: {},\r\n            modules: {}\r\n        };\r\n        this._module.state = state;\r\n    }\r\n    _ModuleBuilder.prototype.getter = function (key, getter) {\r\n        this._module.getters[key] = getter;\r\n        return this;\r\n    };\r\n    _ModuleBuilder.prototype.mutation = function (type, mutation) {\r\n        this._module.mutations[type] = mutation;\r\n        return this;\r\n    };\r\n    _ModuleBuilder.prototype.action = function (type, action) {\r\n        this._module.actions[type] = action;\r\n        return this;\r\n    };\r\n    _ModuleBuilder.prototype.module = function (key, module) {\r\n        this._module.modules[key] = Object.assign({}, module, {\r\n            namespaced: true\r\n        });\r\n        return this;\r\n    };\r\n    _ModuleBuilder.prototype.build = function () {\r\n        return {\r\n            state: this._module.state,\r\n            getters: __assign({}, this._module.getters),\r\n            actions: __assign({}, this._module.actions),\r\n            mutations: __assign({}, this._module.mutations),\r\n            modules: __assign({}, this._module.modules)\r\n        };\r\n    };\r\n    return _ModuleBuilder;\r\n}());\r\nfunction createModuleBuilder(state) {\r\n    return new _ModuleBuilder(state);\r\n}\r\n\n\n//# sourceURL=webpack://vuex-typescript-helper/./lib/module.js?");

/***/ }),

/***/ "./lib/store.js":
/*!**********************!*\
  !*** ./lib/store.js ***!
  \**********************/
/*! exports provided: createNamespacedStoreFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createNamespacedStoreFactory\", function() { return createNamespacedStoreFactory; });\nvar isProxySupported = typeof Proxy === \"function\";\r\nvar _NamespacedStore = /** @class */ (function () {\r\n    function _NamespacedStore(store, paths) {\r\n        this._store = store;\r\n        this._paths = paths;\r\n    }\r\n    Object.defineProperty(_NamespacedStore.prototype, \"state\", {\r\n        get: function () {\r\n            var state = this._store.state;\r\n            this._paths.forEach(function (path) {\r\n                state = state[path];\r\n            });\r\n            return state;\r\n        },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    Object.defineProperty(_NamespacedStore.prototype, \"getters\", {\r\n        get: function () {\r\n            var _this = this;\r\n            if (this._paths.length === 0) {\r\n                return this._store.getters;\r\n            }\r\n            if (!isProxySupported) {\r\n                if (this._store.getters !== this._rootGetters) {\r\n                    this._rootGetters = this._store.getters;\r\n                    this._getters = undefined;\r\n                }\r\n            }\r\n            if (this._getters == null) {\r\n                if (isProxySupported) {\r\n                    this._getters = new Proxy({}, {\r\n                        get: function (target, p) {\r\n                            var path = _this._paths.concat([p]).join(\"/\");\r\n                            return _this._store.getters[path];\r\n                        }\r\n                    });\r\n                }\r\n                else {\r\n                    var prefix_1 = this._paths.join(\"/\") + \"/\";\r\n                    var getters_1 = {};\r\n                    Object.keys(this._store.getters)\r\n                        .filter(function (key) { return key.startsWith(prefix_1); })\r\n                        .forEach(function (key) {\r\n                        Object.defineProperty(getters_1, key.substring(prefix_1.length), {\r\n                            get: function () {\r\n                                return _this._store.getters[key];\r\n                            },\r\n                            enumerable: true\r\n                        });\r\n                    });\r\n                    this._getters = getters_1;\r\n                }\r\n            }\r\n            return this._getters;\r\n        },\r\n        enumerable: true,\r\n        configurable: true\r\n    });\r\n    _NamespacedStore.prototype.path = function (path) {\r\n        return new _NamespacedStore(this._store, this._paths.concat([path]));\r\n    };\r\n    _NamespacedStore.prototype.dispatch = function (type, payload, options) {\r\n        if (this._paths.length === 0) {\r\n            return this._store.dispatch(type, payload, options);\r\n        }\r\n        else {\r\n            var prefix = this._paths.join(\"/\") + \"/\";\r\n            return this._store.dispatch(prefix + type, payload, options);\r\n        }\r\n    };\r\n    _NamespacedStore.prototype.commit = function (type, payload, options) {\r\n        if (this._paths.length === 0) {\r\n            return this._store.commit(type, payload, options);\r\n        }\r\n        else {\r\n            var prefix = this._paths.join(\"/\") + \"/\";\r\n            return this._store.commit(prefix + type, payload, options);\r\n        }\r\n    };\r\n    _NamespacedStore.prototype.registerModule = function (module, options) {\r\n        this._store.registerModule(this._paths, Object.assign({}, module, {\r\n            namespaced: true\r\n        }), options);\r\n        return this;\r\n    };\r\n    _NamespacedStore.prototype.unregisterModule = function () {\r\n        this._store.unregisterModule(this._paths);\r\n        return this;\r\n    };\r\n    return _NamespacedStore;\r\n}());\r\nfunction _createNamespacedStoreFactory(store, paths) {\r\n    return function (path) {\r\n        return path != null\r\n            ? _createNamespacedStoreFactory(store, paths.concat([path]))\r\n            : new _NamespacedStore(store, paths);\r\n    };\r\n}\r\nfunction createNamespacedStoreFactory(store) {\r\n    return _createNamespacedStoreFactory(store, []);\r\n}\r\n\n\n//# sourceURL=webpack://vuex-typescript-helper/./lib/store.js?");

/***/ })

/******/ });
});