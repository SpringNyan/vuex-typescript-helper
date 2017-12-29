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
exports.createModuleBuilder = (function () {
    var _ModuleBuilder = /** @class */ (function () {
        function _ModuleBuilder() {
        }
        _ModuleBuilder.prototype.getter = function (key, getter) {
            this._module.getters[key] = getter;
            return this;
        };
        _ModuleBuilder.prototype.mutation = function (type, mutation) {
            this._module.mutations[type] = mutation;
            return this;
        };
        _ModuleBuilder.prototype.action = function (type, action) {
            this._module.actions[type] = action;
            return this;
        };
        _ModuleBuilder.prototype.module = function (key, module) {
            this._module.modules[key] = Object.assign({}, module, {
                namespaced: true
            });
            return this;
        };
        _ModuleBuilder.prototype.build = function () {
            return {
                state: this._module.state,
                getters: __assign({}, this._module.getters),
                actions: __assign({}, this._module.actions),
                mutations: __assign({}, this._module.mutations),
                modules: __assign({}, this._module.modules)
            };
        };
        return _ModuleBuilder;
    }());
    return function (state) {
        var builder = Object.create(_ModuleBuilder.prototype);
        builder._module = {
            state: state,
            getters: {},
            mutations: {},
            actions: {},
            modules: {}
        };
        return builder;
    };
})();
exports.createStoreHelper = (function () {
    var _StoreHelper = /** @class */ (function () {
        function _StoreHelper() {
        }
        Object.defineProperty(_StoreHelper.prototype, "state", {
            get: function () {
                var state = this._store.state;
                this._paths.forEach(function (path) {
                    state = state[path];
                });
                return state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_StoreHelper.prototype, "getters", {
            get: function () {
                if (this._paths.length === 0) {
                    return this._store.getters;
                }
                if (this._store.getters !== this._storeGetters) {
                    this._storeGetters = this._store.getters;
                    this._cachedGetters = undefined;
                }
                if (this._cachedGetters != null) {
                    return this._cachedGetters;
                }
                var prefix = this._paths.join("/") + "/";
                var getters = {};
                Object.keys(this._store.getters)
                    .filter(function (key) { return key.startsWith(prefix); })
                    .forEach(function (key) {
                    Object.defineProperty(getters, key.substring(prefix.length), {
                        get: function () {
                            return this._store.getters[key];
                        },
                        enumerable: true
                    });
                });
                this._cachedGetters = getters;
                return getters;
            },
            enumerable: true,
            configurable: true
        });
        _StoreHelper.prototype.path = function (path) {
            return newStoreHelper(this._store, this._paths.concat([path]), false);
        };
        _StoreHelper.prototype.dispatch = function (type, payload, options) {
            if (this._paths.length === 0) {
                return this._store.dispatch(type, payload, options);
            }
            else {
                var prefix = this._paths.join("/") + "/";
                return this._store.dispatch(prefix + type, payload, options);
            }
        };
        _StoreHelper.prototype.commit = function (type, payload, options) {
            if (this._paths.length === 0) {
                return this._store.commit(type, payload, options);
            }
            else {
                var prefix = this._paths.join("/") + "/";
                return this._store.commit(prefix + type, payload, options);
            }
        };
        _StoreHelper.prototype.registerModule = function (module, options) {
            this._store.registerModule(this._paths, module, options);
            return this;
        };
        _StoreHelper.prototype.unregisterModule = function () {
            this._store.unregisterModule(this._paths);
        };
        return _StoreHelper;
    }());
    _StoreHelper.prototype.__proto__ = Function.prototype;
    var storeHelperCaches = new Map();
    function newStoreHelper(store, paths, cached) {
        if (!storeHelperCaches.has(store)) {
            storeHelperCaches.set(store, {});
        }
        var caches = storeHelperCaches.get(store);
        var namespace = paths.join("/");
        if (caches[namespace] != null) {
            return caches[namespace];
        }
        var helper = function (path) {
            return newStoreHelper(store, helper._paths.concat([path]), true);
        };
        helper.__proto__ = _StoreHelper.prototype;
        helper._store = store;
        helper._paths = paths;
        helper._storeGetters = undefined;
        helper._cachedGetters = undefined;
        if (cached) {
            caches[namespace] = helper;
        }
        return helper;
    }
    return function (store) {
        return newStoreHelper(store, [], true);
    };
})();
// #endregion
