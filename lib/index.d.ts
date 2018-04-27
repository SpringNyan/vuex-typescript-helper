import { VueConstructor } from "vue";
export default class VuexTypeScriptHelper {
    static install(_Vue: VueConstructor): void;
}
export * from "./action";
export * from "./getter";
export * from "./module";
export * from "./mutation";
export * from "./state";
export * from "./store";
