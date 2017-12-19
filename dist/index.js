"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = require("vuex");
function createState(state) {
    return state;
}
exports.createState = createState;
function createGetter(getter) {
    return getter;
}
exports.createGetter = createGetter;
function createAction(action) {
    return action;
}
exports.createAction = createAction;
function createMutation(mutation) {
    return mutation;
}
exports.createMutation = createMutation;
function createModule(module) {
    return __assign({ namespaced: true, state: {}, getters: {}, actions: {}, mutations: {}, modules: {} }, module);
}
exports.createModule = createModule;
function createCreatorContext() {
    return {
        createState: createState,
        createGetter: createGetter,
        createAction: createAction,
        createMutation: createMutation,
        createModule: createModule
    };
}
exports.createCreatorContext = createCreatorContext;
var StoreContext = /** @class */ (function () {
    function StoreContext(store, path) {
        var _this = this;
        this.namespace = function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var path = _this.splittedPath.concat(keys).join("/");
            return new StoreContext(_this.store, path);
        };
        this.store = store;
        this.path = path != null ? path : "";
        this.splittedPath = this.path !== "" ? this.path.split("/") : [];
    }
    Object.defineProperty(StoreContext.prototype, "state", {
        get: function () {
            var state = this.store.state;
            this.splittedPath.forEach(function (key) {
                state = state[key];
            });
            return state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StoreContext.prototype, "getters", {
        get: function () {
            var _this = this;
            if (typeof Proxy === "undefined") {
                if (this.path === "") {
                    return this.store.getters;
                }
                var propertyDescriptorMap_1 = {};
                var getters = {};
                var prefix_1 = this.path + "/";
                Object.keys(this.store.getters)
                    .filter(function (key) { return key.indexOf(prefix_1) === 0; })
                    .forEach(function (key) {
                    propertyDescriptorMap_1[key.substring(prefix_1.length)] = {
                        get: function () { return _this.store.getters[key]; },
                        enumerable: true,
                        configurable: true
                    };
                });
                Object.defineProperties(getters, propertyDescriptorMap_1);
                return getters;
            }
            else {
                // TODO: handle other traps.
                return new Proxy({}, {
                    get: function (target, name) {
                        var key = _this.withPath(name);
                        return _this.store.getters[key];
                    }
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    StoreContext.prototype.dispatch = function (type, payload, options) {
        return this.store.dispatch(this.withPath(type), payload, options);
    };
    StoreContext.prototype.commit = function (type, payload, options) {
        return this.store.commit(this.withPath(type), payload, options);
    };
    StoreContext.prototype.withPath = function (str) {
        return "" + this.path + (this.path !== "" ? "/" : "") + str;
    };
    return StoreContext;
}());
exports.StoreContext = StoreContext;
function createStore(options) {
    var store = new vuex_1.Store(options);
    var context = new StoreContext(store);
    store.namespace = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        return context.namespace.apply(context, keys);
    };
    return store;
}
exports.createStore = createStore;
