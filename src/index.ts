import { CommitOptions, DispatchOptions } from "vuex";

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
export type Getter<TState, TGetters extends Getters<any>, TValue> = (
    state: TState,
    getters: TGetters,
    rootState: any,
    rootGetters: any
) => TValue;

export type GetterTree = {
    [key: string]: Getter<any, any, any> & ValueType<any>;
};

export type Getters<TGetterTree extends GetterTree> = {
    [K in keyof TGetterTree]: TGetterTree[K]["@valueType"]
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
    TGetters extends Getters<any>,
    TMutationTree extends MutationTree,
    TActionTree extends ActionTree
> = {
    dispatch: Dispatch<TActionTree>;
    commit: Commit<TMutationTree>;
    state: TState;
    getters: TGetters;
    rootState: any;
    rootGetters: any;
};

export type Action<
    TState,
    TGetters extends Getters<any>,
    TMutationTree extends MutationTree,
    TActionTree extends ActionTree,
    TPayload,
    TResult
> = (
    injectee: ActionContext<TState, TGetters, TMutationTree, TActionTree>,
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
    namespaced: true;
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
    result: Module<
        TState,
        TGetterTree,
        TMutationTree,
        TActionTree,
        TModuleTree
    >;

    getter<TKey extends string, TValue>(
        key: TKey,
        getter: Getter<TState, Getters<TGetterTree>, TValue>
    ): IModuleBuilder<
        TState,
        TGetterTree &
            {
                [K in TKey]: Getter<TState, Getters<TGetterTree>, TValue> &
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
            Getters<TGetterTree>,
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
                    Getters<TGetterTree>,
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
}
// #endregion
