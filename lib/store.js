var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var isProxySupported = typeof Proxy === "function";
var _NamespacedStore = /** @class */ (function () {
    function _NamespacedStore(store, paths) {
        this._store = store;
        this._paths = paths;
    }
    Object.defineProperty(_NamespacedStore.prototype, "state", {
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
    Object.defineProperty(_NamespacedStore.prototype, "getters", {
        get: function () {
            var _this = this;
            if (this._paths.length === 0) {
                return this._store.getters;
            }
            if (!isProxySupported) {
                if (this._store.getters !== this._rootGetters) {
                    this._rootGetters = this._store.getters;
                    this._getters = undefined;
                }
            }
            if (this._getters == null) {
                if (isProxySupported) {
                    this._getters = new Proxy({}, {
                        get: function (target, p) {
                            var path = _this._paths.concat([p]).join("/");
                            return _this._store.getters[path];
                        }
                    });
                }
                else {
                    var prefix_1 = this._paths.join("/") + "/";
                    var getters_1 = {};
                    Object.keys(this._store.getters)
                        .filter(function (key) { return key.lastIndexOf(prefix_1, 0) === 0; })
                        .forEach(function (key) {
                        Object.defineProperty(getters_1, key.substring(prefix_1.length), {
                            get: function () {
                                return _this._store.getters[key];
                            },
                            enumerable: true
                        });
                    });
                    this._getters = getters_1;
                }
            }
            return this._getters;
        },
        enumerable: true,
        configurable: true
    });
    _NamespacedStore.prototype.path = function (path) {
        return new _NamespacedStore(this._store, this._paths.concat([path]));
    };
    _NamespacedStore.prototype.dispatch = function (type, payload, options) {
        if (this._paths.length === 0) {
            return this._store.dispatch(type, payload, options);
        }
        else {
            var prefix = this._paths.join("/") + "/";
            return this._store.dispatch(prefix + type, payload, options);
        }
    };
    _NamespacedStore.prototype.commit = function (type, payload, options) {
        if (this._paths.length === 0) {
            return this._store.commit(type, payload, options);
        }
        else {
            var prefix = this._paths.join("/") + "/";
            return this._store.commit(prefix + type, payload, options);
        }
    };
    _NamespacedStore.prototype.registerModule = function (module, options) {
        this._store.registerModule(this._paths, __assign({}, module, { namespaced: true }), options);
        return this;
    };
    _NamespacedStore.prototype.unregisterModule = function () {
        this._store.unregisterModule(this._paths);
        return this;
    };
    return _NamespacedStore;
}());
function _createNamespacedStoreFactory(store, paths) {
    return function (path) {
        return path != null
            ? _createNamespacedStoreFactory(store, paths.concat([path]))
            : new _NamespacedStore(store, paths);
    };
}
export function createNamespacedStoreFactory(store) {
    return _createNamespacedStoreFactory(store, []);
}
