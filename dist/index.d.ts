import { Store, CommitOptions, DispatchOptions, ModuleOptions } from "vuex";
export declare type SelfPick<T> = {
    [K in keyof T]: T[K];
};
export declare type StateType<TState> = {
    "@stateType": TState;
};
export declare type ValueType<TValue> = {
    "@valueType": TValue;
};
export declare type PayloadType<TPayload> = {
    "@payloadType": TPayload;
};
export declare type ResultType<TResult> = {
    "@resultType": TResult;
};
export declare type State<TState> = TState | (() => TState);
export declare type Getter<TState, TStoreGetters extends StoreGetters<any>, TValue> = (state: TState, getters: TStoreGetters, rootState: any, rootGetters: any) => TValue;
export declare type GetterTree = {
    [key: string]: Getter<any, any, any> & ValueType<any>;
};
export declare type Mutation<TState, TPayload> = (state: TState, payload: TPayload) => void;
export declare type MutationTree = {
    [type: string]: Mutation<any, any> & PayloadType<any>;
};
export declare type ActionContext<TState, TStoreGetters extends StoreGetters<any>, TMutationTree extends MutationTree, TActionTree extends ActionTree> = {
    dispatch: Dispatch<TActionTree>;
    commit: Commit<TMutationTree>;
    state: TState;
    getters: TStoreGetters;
    rootState: any;
    rootGetters: any;
};
export declare type Action<TState, TStoreGetters extends StoreGetters<any>, TMutationTree extends MutationTree, TActionTree extends ActionTree, TPayload, TResult> = (injectee: ActionContext<TState, TStoreGetters, TMutationTree, TActionTree>, payload: TPayload) => TResult | Promise<TResult>;
export declare type ActionTree = {
    [type: string]: Action<any, any, any, any, any, any> & PayloadType<any> & ResultType<any>;
};
export declare type Module<TState, TGetterTree extends GetterTree, TMutationTree extends MutationTree, TActionTree extends ActionTree, TModuleTree extends ModuleTree> = {
    state: State<TState> & StateType<TState>;
    getters: TGetterTree;
    actions: TActionTree;
    mutations: TMutationTree;
    modules: TModuleTree;
};
export declare type ModuleTree = {
    [key: string]: Module<any, any, any, any, any>;
};
export declare type StoreState<TModule extends Module<any, any, any, any, any>> = TModule["state"]["@stateType"] & {
    [K in keyof TModule["modules"]]: StoreState<TModule["modules"][K]>;
};
export declare type StoreGetters<TGetterTree extends GetterTree> = {
    [K in keyof TGetterTree]: TGetterTree[K]["@valueType"];
};
export declare type Commit<TMutationTree extends MutationTree> = {
    <TType extends keyof TMutationTree>(type: TType, payload: TMutationTree[TType]["@payloadType"], options?: CommitOptions & {
        root?: false;
    }): void;
    (type: string, payload: any, options: CommitOptions & {
        root: true;
    }): void;
};
export declare type Dispatch<TActionTree extends ActionTree> = {
    <TType extends keyof TActionTree>(type: TType, payload: TActionTree[TType]["@payloadType"], options?: DispatchOptions & {
        root?: false;
    }): Promise<TActionTree[TType]["@resultType"]>;
    (type: string, payload: any, options: DispatchOptions & {
        root: true;
    }): Promise<any>;
};
export declare type ModuleBuilder<TState, TGetterTree extends GetterTree, TMutationTree extends MutationTree, TActionTree extends ActionTree, TModuleTree extends ModuleTree> = SelfPick<{
    getter<TKey extends string, TValue>(key: TKey, getter: Getter<TState, StoreGetters<TGetterTree>, TValue>): ModuleBuilder<TState, TGetterTree & {
        [K in TKey]: Getter<TState, StoreGetters<TGetterTree>, TValue> & ValueType<TValue>;
    }, TMutationTree, TActionTree, TModuleTree>;
    mutation<TType extends string, TPayload>(type: TType, mutation: Mutation<TState, TPayload>): ModuleBuilder<TState, TGetterTree, TMutationTree & {
        [K in TType]: Mutation<TState, TPayload> & PayloadType<TPayload>;
    }, TActionTree, TModuleTree>;
    action<TType extends string, TPayload, TResult>(type: TType, action: Action<TState, StoreGetters<TGetterTree>, TMutationTree, TActionTree, TPayload, TResult>): ModuleBuilder<TState, TGetterTree, TMutationTree, TActionTree & {
        [K in TType]: Action<TState, StoreGetters<TGetterTree>, TMutationTree, TActionTree, TPayload, TResult> & PayloadType<TPayload> & ResultType<TResult>;
    }, TModuleTree>;
    module<TKey extends string, TModule extends Module<any, any, any, any, any>>(key: TKey, module: TModule): ModuleBuilder<TState, TGetterTree, TMutationTree, TActionTree, TModuleTree & {
        [K in TKey]: TModule;
    }>;
    build(): Module<TState, TGetterTree, TMutationTree, TActionTree, TModuleTree>;
}>;
export declare const createModuleBuilder: <TState>(state: State<TState>) => ModuleBuilder<TState, {}, {}, {}, {}>;
export declare type StoreHelper<TModule extends Module<any, any, any, any, any>> = SelfPick<{
    <TPath extends keyof TModule["modules"]>(path: TPath): StoreHelper<TModule["modules"][TPath]>;
    readonly state: StoreState<TModule>;
    readonly getters: StoreGetters<TModule["getters"]>;
    path<TLocalModule extends Module<any, any, any, any, any> = Module<{}, {}, {}, {}, {}>>(path: string): StoreHelper<TLocalModule>;
    dispatch: Dispatch<TModule["actions"]>;
    commit: Commit<TModule["mutations"]>;
    registerModule<TModule extends Module<any, any, any, any, any>>(module: TModule, options?: ModuleOptions): StoreHelper<TModule>;
    unregisterModule(): void;
    freeze(): StoreHelper<TModule>;
}>;
export declare const createStoreHelper: <TModule extends Module<any, any, any, any, any>>(store: Store<any>) => StoreHelper<TModule>;
