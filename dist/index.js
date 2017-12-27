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
    var ModuleBuilder = /** @class */ (function () {
        function ModuleBuilder() {
        }
        ModuleBuilder.prototype.getter = function (key, getter) {
            this._module.getters[key] = getter;
            return this;
        };
        ModuleBuilder.prototype.mutation = function (type, mutation) {
            this._module.mutations[type] = mutation;
            return this;
        };
        ModuleBuilder.prototype.action = function (type, action) {
            this._module.actions[type] = action;
            return this;
        };
        ModuleBuilder.prototype.module = function (key, module) {
            this._module.modules[key] = Object.assign({}, module, {
                namespaced: true
            });
            return this;
        };
        ModuleBuilder.prototype.build = function () {
            return {
                state: this._module.state,
                getters: __assign({}, this._module.getters),
                actions: __assign({}, this._module.actions),
                mutations: __assign({}, this._module.mutations),
                modules: __assign({}, this._module.modules)
            };
        };
        return ModuleBuilder;
    }());
    return function (state) {
        var builder = Object.create(ModuleBuilder.prototype);
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
    var StoreHelper = /** @class */ (function () {
        function StoreHelper() {
        }
        Object.defineProperty(StoreHelper.prototype, "state", {
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
        Object.defineProperty(StoreHelper.prototype, "getters", {
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
        StoreHelper.prototype.dispatch = function (type, payload, options) {
            if (this._paths.length === 0) {
                return this._store.dispatch(type, payload, options);
            }
            else {
                var prefix = this._paths.join("/") + "/";
                return this._store.dispatch(prefix + type, payload, options);
            }
        };
        StoreHelper.prototype.commit = function (type, payload, options) {
            if (this._paths.length === 0) {
                return this._store.commit(type, payload, options);
            }
            else {
                var prefix = this._paths.join("/") + "/";
                return this._store.commit(prefix + type, payload, options);
            }
        };
        StoreHelper.prototype.registerModule = function (module, options) {
            this._store.registerModule(this._paths, module, options);
            return this;
        };
        StoreHelper.prototype.unregisterModule = function () {
            this._store.unregisterModule(this._paths);
        };
        StoreHelper.prototype.freeze = function () {
            this._isFreeze = true;
            return this;
        };
        return StoreHelper;
    }());
    function newStoreHelper(store, paths) {
        var helper = function (path) {
            if (this._isFreeze) {
                return newStoreHelper(store, this._paths.concat([path]));
            }
            else {
                this._paths.push(path);
                this._cachedGetters = undefined;
                return helper;
            }
        };
        helper.__proto__ = StoreHelper.prototype; // TODO: very slow operation
        helper._store = store;
        helper._paths = paths;
        helper._isFreeze = false;
        helper._storeGetters = undefined;
        helper._cachedGetters = undefined;
        return helper;
    }
    return function (store) {
        return newStoreHelper(store, []);
    };
})();
// #endregion
