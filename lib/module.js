var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _ModuleBuilder = /** @class */ (function () {
    function _ModuleBuilder(state) {
        this._module = {
            state: {},
            getters: {},
            mutations: {},
            actions: {},
            modules: {}
        };
        this._module.state = state;
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
        this._module.modules[key] = __assign({}, module, { namespaced: true });
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
export function createModuleBuilder(state) {
    return new _ModuleBuilder(state);
}
