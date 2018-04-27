import Vue, { VueConstructor } from "vue";
import { createNamespacedStoreFactory } from "./store";

export default class VuexTypeScriptHelper {
  public static install(_Vue: VueConstructor): void {
    _Vue.mixin({
      beforeCreate(this: Vue & { [propertyKey: string]: any }): void {
        if (this.$store) {
          this.$storeFactory = createNamespacedStoreFactory(this.$store);
        }
      }
    });
  }
}

export * from "./action";
export * from "./getter";
export * from "./module";
export * from "./mutation";
export * from "./state";
export * from "./store";
