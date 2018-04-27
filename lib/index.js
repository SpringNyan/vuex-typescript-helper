import { createNamespacedStoreFactory } from "./store";
var VuexTypeScriptHelper = /** @class */ (function () {
    function VuexTypeScriptHelper() {
    }
    VuexTypeScriptHelper.install = function (_Vue) {
        _Vue.mixin({
            beforeCreate: function () {
                if (this.$store) {
                    this.$storeFactory = createNamespacedStoreFactory(this.$store);
                }
            }
        });
    };
    return VuexTypeScriptHelper;
}());
export default VuexTypeScriptHelper;
export * from "./module";
export * from "./store";
