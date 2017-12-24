import { Store, CommitOptions, DispatchOptions, ModuleOptions } from "vuex";

// #region Type
export type StateType<TState> = { "@stateType": TState };
export type ValueType<TValue> = { "@valueType": TValue };
export type PayloadType<TPayload> = { "@payloadType": TPayload };
export type ResultType<TResult> = { "@resultType": TResult };
// #endregion

// #region State
export type State<TState> = TState | (() => TState);
// #endregion

// #region Getter
export type Getter<TState, TStoreGetters extends StoreGetters<any>, TValue> = (
    state: TState,
    getters: TStoreGetters,
    rootState: any,
    rootGetters: any
) => TValue;

export type GetterTree = {
    [key: string]: Getter<any, any, any> & ValueType<any>;
};
// #endregion

// #region Mutation
export type Mutation<TState, TPayload> = (
    state: TState,
    payload: TPayload
) => void;

export type MutationTree = {
    [key: string]: Mutation<any, any> & PayloadType<any>;
};
// #endregion

// #region Action
export type ActionContext<
    TState,
    TStoreGetters extends StoreGetters<any>,
    TMutationTree extends MutationTree,
    TActionTree extends ActionTree
> = {
    dispatch: Dispatch<TActionTree>;
    commit: Commit<TMutationTree>;
    state: TState;
    getters: TStoreGetters;
    rootState: any;
    rootGetters: any;
};

export type Action<
    TState,
    TStoreGetters extends StoreGetters<any>,
    TMutationTree extends MutationTree,
    TActionTree extends ActionTree,
    TPayload,
    TResult
> = (
    injectee: ActionContext<TState, TStoreGetters, TMutationTree, TActionTree>,
    payload: TPayload
) => TResult | Promise<TResult>;

export type ActionTree = {
    [key: string]: Action<any, any, any, any, any, any> &
        PayloadType<any> &
        ResultType<any>;
};
// #endregion

// #region Module
export type Module<
    TState,
    TGetterTree extends GetterTree,
    TMutationTree extends MutationTree,
    TActionTree extends ActionTree,
    TModuleTree extends ModuleTree
> = {
    state: State<TState> & StateType<TState>;
    getters: TGetterTree;
    actions: TActionTree;
    mutations: TMutationTree;
    modules: ModuleTree;
};

export type ModuleTree = {
    [key: string]: Module<any, any, any, any, any>;
};
// #endregion

// #region Store
export type StoreState<
    TModule extends Module<any, any, any, any, any>
> = TModule["state"]["@stateType"] &
    { [K in keyof TModule["modules"]]: StoreState<TModule["modules"][K]> };

export type StoreGetters<TGetterTree extends GetterTree> = {
    [K in keyof TGetterTree]: TGetterTree[K]["@valueType"]
};

export type Commit<TMutationTree extends MutationTree> = {
    <TType extends keyof TMutationTree>(
        type: TType,
        payload: TMutationTree[TType]["@payloadType"],
        options?: CommitOptions & { root?: false }
    ): void;
    (type: string, payload: any, options: CommitOptions & { root: true }): void;
};

export type Dispatch<TActionTree extends ActionTree> = {
    <TType extends keyof TActionTree>(
        type: TType,
        payload: TActionTree[TType]["@payloadType"],
        options?: DispatchOptions & { root?: false }
    ): Promise<TActionTree[TType]["@resultType"]>;
    (
        type: string,
        payload: any,
        options: DispatchOptions & { root: true }
    ): Promise<any>;
};
// #endregion

// #region ModuleBuilder
export interface IModuleBuilder<
    TState,
    TGetterTree extends GetterTree,
    TMutationTree extends MutationTree,
    TActionTree extends ActionTree,
    TModuleTree extends ModuleTree
> {
    getter<TKey extends string, TValue>(
        key: TKey,
        getter: Getter<TState, StoreGetters<TGetterTree>, TValue>
    ): IModuleBuilder<
        TState,
        TGetterTree &
            {
                [K in TKey]: Getter<TState, StoreGetters<TGetterTree>, TValue> &
                    ValueType<TValue>
            },
        TMutationTree,
        TActionTree,
        TModuleTree
    >;

    mutation<TType extends string, TPayload>(
        type: TType,
        mutation: Mutation<TState, TPayload>
    ): IModuleBuilder<
        TState,
        TGetterTree,
        TMutationTree &
            {
                [K in TType]: Mutation<TState, TPayload> & PayloadType<TPayload>
            },
        TActionTree,
        TModuleTree
    >;

    action<TType extends string, TPayload, TResult>(
        type: TType,
        action: Action<
            TState,
            StoreGetters<TGetterTree>,
            TMutationTree,
            TActionTree,
            TPayload,
            TResult
        >
    ): IModuleBuilder<
        TState,
        TGetterTree,
        TMutationTree,
        TActionTree &
            {
                [K in TType]: Action<
                    TState,
                    StoreGetters<TGetterTree>,
                    TMutationTree,
                    TActionTree,
                    TPayload,
                    TResult
                > &
                    PayloadType<TPayload> &
                    ResultType<TResult>
            },
        TModuleTree
    >;

    module<
        TKey extends string,
        TModule extends Module<any, any, any, any, any>
    >(
        key: TKey,
        module: TModule
    ): IModuleBuilder<
        TState,
        TGetterTree,
        TMutationTree,
        TActionTree,
        TModuleTree & { [K in TKey]: TModule }
    >;

    build(): Module<
        TState,
        TGetterTree,
        TMutationTree,
        TActionTree,
        TModuleTree
    >;
}

export const createModuleBuilder: <TState>(
    state: State<TState>
) => IModuleBuilder<TState, {}, {}, {}, {}> = (() => {
    const builderPrototype: IModuleBuilder<any, any, any, any, any> & {
        _module: Module<any, any, any, any, any>;
    } = {
        _module: undefined as any,
        getter(key, getter) {
            this._module.getters[key] = getter;
            return this;
        },
        mutation(type, mutation) {
            this._module.mutations[type] = mutation;
            return this;
        },
        action(type, action) {
            this._module.actions[type] = action;
            return this;
        },
        module(key, module) {
            this._module.modules[key] = Object.assign({}, module, {
                namespaced: true
            });
            return this;
        },
        build() {
            return this._module;
        }
    };

    return <TState>(
        state: State<TState>
    ): IModuleBuilder<TState, {}, {}, {}, {}> => {
        const builder: typeof builderPrototype = Object.create(
            builderPrototype
        );
        builder._module = {
            state,
            getters: {},
            mutations: {},
            actions: {},
            modules: {}
        };

        return builder;
    };
})();
// #endregion

// #region StoreHelper
export interface IStoreHelper<TModule extends Module<any, any, any, any, any>> {
    <TPath extends keyof TModule["modules"]>(path: TPath): IStoreHelper<
        TModule["modules"][TPath]
    >;

    readonly state: StoreState<TModule>;
    readonly getters: StoreGetters<TModule["getters"]>;

    dispatch: Dispatch<TModule["actions"]>;
    commit: Commit<TModule["mutations"]>;

    registerModule<TModule extends Module<any, any, any, any, any>>(
        module: TModule,
        options?: ModuleOptions
    ): IStoreHelper<TModule>;

    unregisterModule(): void;
}
// #endregion
