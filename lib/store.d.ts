import { Store, ModuleOptions } from "vuex";
import { Dispatch } from "./action";
import { GetterValueTree } from "./getter";
import { Module, ModuleState } from "./module";
import { Commit } from "./mutation";
export declare type StoreState<TModule extends Module<any, any, any, any, any>> = ModuleState<TModule["state"]> & {
    [K in keyof TModule["modules"]]: TModule["modules"][K] extends Module<any, any, any, any, any> ? StoreState<TModule["modules"][K]> : never;
};
export declare type StoreHelper<TModule extends Module<any, any, any, any, any>> = {
    <TPath extends keyof TModule["modules"]>(path: TPath): TModule["modules"][TPath] extends Module<any, any, any, any, any> ? StoreHelper<TModule["modules"][TPath]> : never;
    readonly state: StoreState<TModule>;
    readonly getters: GetterValueTree<TModule["getters"]>;
    path<TLocalModule extends Module<any, any, any, any, any> = Module<{}, {}, {}, {}, {}>>(path: string): StoreHelper<TLocalModule>;
    dispatch: Dispatch<TModule["actions"]>;
    commit: Commit<TModule["mutations"]>;
    registerModule<TModule extends Module<any, any, any, any, any>>(module: TModule, options?: ModuleOptions): StoreHelper<TModule>;
    unregisterModule(): StoreHelper<TModule>;
};
export declare function createStoreHelper<TModule extends Module<any, any, any, any, any>>(store: Store<any>): StoreHelper<TModule>;
