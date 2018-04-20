import { Action, ActionTree } from "./action";
import { Getter, GetterTree, GetterValueTree } from "./getter";
import { Mutation, MutationTree } from "./mutation";
import { State } from "./state";
export declare type Module<TState, TGetterTree extends GetterTree, TMutationTree extends MutationTree, TActionTree extends ActionTree, TModuleTree extends ModuleTree> = {
    state: State<TState>;
    getters: TGetterTree;
    actions: TActionTree;
    mutations: TMutationTree;
    modules: TModuleTree;
};
export declare type ModuleTree = {
    [key: string]: Module<any, any, any, any, any>;
};
export declare type ModuleState<TModule extends Module<any, any, any, any, any>> = TModule extends Module<infer TState, any, any, any, any> ? TState : never;
export interface ModuleBuilder<TState, TGetterTree extends GetterTree, TMutationTree extends MutationTree, TActionTree extends ActionTree, TModuleTree extends ModuleTree> {
    getter<TKey extends string, TValue>(key: TKey, getter: Getter<TState, GetterValueTree<TGetterTree>, TValue>): ModuleBuilder<TState, TGetterTree & {
        [K in TKey]: Getter<TState, GetterValueTree<TGetterTree>, TValue>;
    }, TMutationTree, TActionTree, TModuleTree>;
    mutation<TType extends string, TPayload>(type: TType, mutation: Mutation<TState, TPayload>): ModuleBuilder<TState, TGetterTree, TMutationTree & {
        [K in TType]: Mutation<TState, TPayload>;
    }, TActionTree, TModuleTree>;
    action<TType extends string, TPayload, TResult>(type: TType, action: Action<TState, GetterValueTree<TGetterTree>, TMutationTree, TActionTree, TPayload, TResult>): ModuleBuilder<TState, TGetterTree, TMutationTree, TActionTree & {
        [K in TType]: Action<TState, GetterValueTree<TGetterTree>, TMutationTree, TActionTree, TPayload, TResult>;
    }, TModuleTree>;
    module<TKey extends string, TModule extends Module<any, any, any, any, any>>(key: TKey, module: TModule): ModuleBuilder<TState, TGetterTree, TMutationTree, TActionTree, TModuleTree & {
        [K in TKey]: TModule;
    }>;
    build(): Module<TState, TGetterTree, TMutationTree, TActionTree, TModuleTree>;
}
export declare function createModuleBuilder<TState>(state: State<TState>): ModuleBuilder<TState, {}, {}, {}, {}>;
