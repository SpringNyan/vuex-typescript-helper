import { Store as _Store, StoreOptions, DispatchOptions, CommitOptions, ActionContext } from "vuex";
export declare type KeyOfModules<T extends Module<any, any, any, any, any, any>> = keyof T["modules"];
export declare type ModuleOf<T extends Module<any, any, any, any, any, any>, K extends keyof T["modules"]> = T["modules"][K];
export declare type StateOf<T extends Module<any, any, any, any, any, any>> = {
    [K in keyof T["state"]]: T["state"][K];
} & {
    [K in keyof T["modules"]]: StateOf<T["modules"][K]>;
};
export declare type Store<TModule extends Module<any, any, any, any, any, any>> = _Store<StateOf<TModule>> & {
    namespace: Namespace<TModule>;
};
export interface Namespace<TModule extends Module<any, any, any, any, any, any>> {
    (): StoreContext<TModule>;
    <T1 extends KeyOfModules<TModule>>(key1: T1): StoreContext<ModuleOf<TModule, T1>>;
    <T1 extends KeyOfModules<TModule>, T2 extends KeyOfModules<ModuleOf<TModule, T1>>>(key1: T1, key2: T2): StoreContext<ModuleOf<ModuleOf<TModule, T1>, T2>>;
    <T1 extends KeyOfModules<TModule>, T2 extends KeyOfModules<ModuleOf<TModule, T1>>, T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>>(key1: T1, key2: T2, key3: T3): StoreContext<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>;
    <T1 extends KeyOfModules<TModule>, T2 extends KeyOfModules<ModuleOf<TModule, T1>>, T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>, T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>>(key1: T1, key2: T2, key3: T3, key4: T4): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>;
    <T1 extends KeyOfModules<TModule>, T2 extends KeyOfModules<ModuleOf<TModule, T1>>, T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>, T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>, T5 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>>(key1: T1, key2: T2, key3: T3, key4: T4, key5: T5): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>>;
    <T1 extends KeyOfModules<TModule>, T2 extends KeyOfModules<ModuleOf<TModule, T1>>, T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>, T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>, T5 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>, T6 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>>>(key1: T1, key2: T2, key3: T3, key4: T4, key5: T5, key6: T6): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>, T6>>;
    <T1 extends KeyOfModules<TModule>, T2 extends KeyOfModules<ModuleOf<TModule, T1>>, T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>, T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>, T5 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>, T6 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>>, T7 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>, T6>>>(key1: T1, key2: T2, key3: T3, key4: T4, key5: T5, key6: T6, key7: T7): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>, T6>, T7>>;
}
export declare type StateType<TState> = {
    "@stateType": TState;
};
export declare type ValueType<TValue> = {
    "@valueType": TValue;
};
export declare type PayloadType<TPayload> = {
    "@payloadType": TPayload;
};
export declare type ResultType<TReturn> = {
    "@resultType": TReturn;
};
export declare type Getter<TState, TRootState, TValue> = (state: TState, getters: any, rootState: TRootState, rootGetters: any) => TValue;
export declare type Action<TState, TRootState, TPayload, TReturn> = (injectee: ActionContext<TState, TRootState>, payload: TPayload) => TReturn | Promise<TReturn>;
export declare type Mutation<TState, TPayload> = (state: TState, payload: TPayload) => void;
export interface Module<TState, TRootState, TGetters extends {
    [key: string]: Getter<TState, TRootState, any> & ValueType<any>;
}, TActions extends {
    [key: string]: Action<TState, TRootState, any, any> & PayloadType<any> & ResultType<any>;
}, TMutations extends {
    [key: string]: Mutation<TState, any> & PayloadType<any>;
}, TModules extends {
    [key: string]: Module<any, TRootState, any, any, any, any>;
}> {
    namespaced: true;
    state: (TState | (() => TState)) & StateType<TState>;
    getters: TGetters;
    actions: TActions;
    mutations: TMutations;
    modules: TModules;
}
export declare type StateCreator<TState> = (state: TState | (() => TState)) => (TState | (() => TState)) & StateType<TState>;
export declare type GetterCreator<TState, TRootState> = <TValue>(getter: Getter<TState, TRootState, TValue>) => Getter<TState, TRootState, TValue> & ValueType<TValue>;
export declare type ActionCreator<TState, TRootState> = <TPayload, TReturn>(action: Action<TState, TRootState, TPayload, TReturn>) => Action<TState, TRootState, TPayload, TReturn> & PayloadType<TPayload> & ResultType<TReturn>;
export declare type MutationCreator<TState> = <TPayload>(mutation: Mutation<TState, TPayload>) => Mutation<TState, TPayload> & PayloadType<TPayload>;
export declare type ModuleCreator<TState, TRootState> = <TGetters extends {
    [key: string]: Getter<TState, TRootState, any> & ValueType<any>;
}, TActions extends {
    [key: string]: Action<TState, TRootState, any, any> & PayloadType<any> & ResultType<any>;
}, TMutations extends {
    [key: string]: Mutation<TState, any> & PayloadType<any>;
}, TModules extends {
    [key: string]: Module<any, TRootState, any, any, any, any>;
}>(module: Partial<Module<TState, TRootState, TGetters, TActions, TMutations, TModules>>) => Module<TState, TRootState, TGetters, TActions, TMutations, TModules>;
export interface CreatorContext<TState, TRootState> {
    createState: StateCreator<TState>;
    createGetter: GetterCreator<TState, TRootState>;
    createAction: ActionCreator<TState, TRootState>;
    createMutation: MutationCreator<TState>;
    createModule: ModuleCreator<TState, TRootState>;
}
export declare function createState<TState>(state: TState | (() => TState)): (TState | (() => TState)) & StateType<TState>;
export declare function createGetter<TState, TRootState, TValue>(getter: Getter<TState, TRootState, TValue>): Getter<TState, TRootState, TValue> & ValueType<TValue>;
export declare function createAction<TState, TRootState, TPayload, TReturn>(action: Action<TState, TRootState, TPayload, TReturn>): Action<TState, TRootState, TPayload, TReturn> & PayloadType<TPayload> & ResultType<TReturn>;
export declare function createMutation<TState, TPayload>(mutation: Mutation<TState, TPayload>): Mutation<TState, TPayload> & PayloadType<TPayload>;
export declare function createModule<TState, TRootState, TGetters extends {
    [key: string]: Getter<TState, TRootState, any> & ValueType<any>;
}, TActions extends {
    [key: string]: Action<TState, TRootState, any, any> & PayloadType<any> & ResultType<any>;
}, TMutations extends {
    [key: string]: Mutation<TState, any> & PayloadType<any>;
}, TModules extends {
    [key: string]: Module<any, TRootState, any, any, any, any>;
}>(module: Partial<Module<TState, TRootState, TGetters, TActions, TMutations, TModules>>): Module<TState, TRootState, TGetters, TActions, TMutations, TModules>;
export declare function createCreatorContext<TState, TRootState>(): CreatorContext<TState, TRootState>;
export declare type Getters<T extends any> = T["_getters"];
export declare type ActionPayload<T extends any> = T["_actionPayload"];
export declare type MutationPayload<T extends any> = T["_mutationPayload"];
export declare class StoreContext<TModule extends Module<any, any, any, any, any, any>> {
    readonly path: string;
    readonly state: StateOf<TModule>;
    readonly getters: Getters<TModule>;
    private readonly store;
    private readonly splittedPath;
    constructor(store: Store<TModule>, path?: string);
    namespace: Namespace<TModule>;
    dispatch<T extends keyof TModule["actions"]>(type: T, payload: TModule["actions"][T]["@payloadType"], options?: DispatchOptions): Promise<TModule["actions"][T]["@resultType"]>;
    commit<T extends keyof TModule["mutations"]>(type: T, payload: TModule["mutations"][T]["@payloadType"], options?: CommitOptions): void;
    private withPath(str);
}
export declare function createStore<TOptions extends StoreOptions<any> & Module<any, any, any, any, any, any>>(options: TOptions): Store<TOptions>;
