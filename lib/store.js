var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var isProxySupported = typeof Proxy === "function";
var _StoreHelper = /** @class */ (function (_super) {
    __extends(_StoreHelper, _super);
    function _StoreHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
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
                        .filter(function (key) { return key.startsWith(prefix_1); })
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
    _StoreHelper.prototype.path = function (path) {
        return newStoreHelper(this._store, this._paths.concat([path]));
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
        return this;
    };
    return _StoreHelper;
}(Function));
function newStoreHelper(store, paths) {
    var storeHelper = function (path) {
        return newStoreHelper(store, storeHelper._paths.concat([path]));
    };
    storeHelper.__proto__ = _StoreHelper.prototype;
    storeHelper._store = store;
    storeHelper._paths = paths;
    return storeHelper;
}
export function createStoreHelper(store) {
    return newStoreHelper(store, []);
}
