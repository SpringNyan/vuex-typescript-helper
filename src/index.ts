import { Store, CommitOptions, DispatchOptions, ModuleOptions } from "vuex";

export type SelfPick<T> = { [K in keyof T]: T[K] };

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
    [type: string]: Mutation<any, any> & PayloadType<any>;
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
    [type: string]: Action<any, any, any, any, any, any> &
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
    modules: TModuleTree;
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
export type ModuleBuilder<
    TState,
    TGetterTree extends GetterTree,
    TMutationTree extends MutationTree,
    TActionTree extends ActionTree,
    TModuleTree extends ModuleTree
> = SelfPick<{
    getter<TKey extends string, TValue>(
        key: TKey,
        getter: Getter<TState, StoreGetters<TGetterTree>, TValue>
    ): ModuleBuilder<
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
    ): ModuleBuilder<
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
    ): ModuleBuilder<
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
    ): ModuleBuilder<
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
}>;

export const createModuleBuilder: <TState>(
    state: State<TState>
) => ModuleBuilder<TState, {}, {}, {}, {}> = (() => {
    class _ModuleBuilder {
        public _module: Module<any, any, any, any, any>;

        public getter(key: string, getter: Getter<any, any, any>) {
            this._module.getters[key] = getter;
            return this;
        }

        public mutation(type: string, mutation: Mutation<any, any>) {
            this._module.mutations[type] = mutation;
            return this;
        }

        public action(
            type: string,
            action: Action<any, any, any, any, any, any>
        ) {
            this._module.actions[type] = action;
            return this;
        }

        public module(key: string, module: Module<any, any, any, any, any>) {
            this._module.modules[key] = Object.assign({}, module, {
                namespaced: true
            });
            return this;
        }

        public build() {
            return {
                state: this._module.state,
                getters: { ...this._module.getters },
                actions: { ...this._module.actions },
                mutations: { ...this._module.mutations },
                modules: { ...this._module.modules }
            };
        }
    }

    return <TState>(
        state: State<TState>
    ): ModuleBuilder<TState, {}, {}, {}, {}> => {
        const builder = Object.create(_ModuleBuilder.prototype);
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
export type StoreHelper<
    TModule extends Module<any, any, any, any, any>
> = SelfPick<{
    <TPath extends keyof TModule["modules"]>(path: TPath): StoreHelper<
        TModule["modules"][TPath]
    >;

    readonly state: StoreState<TModule>;
    readonly getters: StoreGetters<TModule["getters"]>;

    path<
        TLocalModule extends Module<any, any, any, any, any> = Module<
            {},
            {},
            {},
            {},
            {}
        >
    >(
        path: string
    ): StoreHelper<TLocalModule>;

    dispatch: Dispatch<TModule["actions"]>;
    commit: Commit<TModule["mutations"]>;

    registerModule<TModule extends Module<any, any, any, any, any>>(
        module: TModule,
        options?: ModuleOptions
    ): StoreHelper<TModule>;

    unregisterModule(): void;

    freeze(): StoreHelper<TModule>;
}>;

export const createStoreHelper: <
    TModule extends Module<any, any, any, any, any>
>(
    store: Store<any>
) => StoreHelper<TModule> = (() => {
    class _StoreHelper {
        public _store: Store<any>;
        public _paths: string[];

        public _isFreeze: boolean;

        public _storeGetters?: StoreGetters<any>;
        public _cachedGetters?: StoreGetters<any>;

        public get state() {
            let state = this._store.state;
            this._paths.forEach(path => {
                state = state[path];
            });

            return state;
        }

        public get getters() {
            if (this._paths.length === 0) {
                return this._store.getters;
            }

            if (this._store.getters !== this._storeGetters) {
                this._storeGetters = this._store.getters;
                this._cachedGetters = undefined;
            }

            if (this._cachedGetters != null) {
                return this._cachedGetters;
            }

            const prefix = this._paths.join("/") + "/";

            const getters = {};
            Object.keys(this._store.getters)
                .filter(key => key.startsWith(prefix))
                .forEach(key => {
                    Object.defineProperty(
                        getters,
                        key.substring(prefix.length),
                        {
                            get() {
                                return this._store.getters[key];
                            },
                            enumerable: true
                        }
                    );
                });

            this._cachedGetters = getters;

            return getters;
        }

        public path(path: string) {
            return (this as any)(path);
        }

        public dispatch(type: string, payload: any, options?: DispatchOptions) {
            if (this._paths.length === 0) {
                return this._store.dispatch(type, payload, options);
            } else {
                const prefix = this._paths.join("/") + "/";
                return this._store.dispatch(prefix + type, payload, options);
            }
        }

        public commit(type: string, payload: any, options?: CommitOptions) {
            if (this._paths.length === 0) {
                return this._store.commit(type, payload, options);
            } else {
                const prefix = this._paths.join("/") + "/";
                return this._store.commit(prefix + type, payload, options);
            }
        }

        public registerModule(
            module: Module<any, any, any, any, any>,
            options?: ModuleOptions
        ) {
            this._store.registerModule(this._paths, module, options);
            return this;
        }

        public unregisterModule() {
            this._store.unregisterModule(this._paths);
        }

        public freeze() {
            this._isFreeze = true;
            return this;
        }
    }

    function newStoreHelper(store: Store<any>, paths: string[]) {
        const helper: any = function(path: string) {
            if (helper._isFreeze) {
                return newStoreHelper(store, [...helper._paths, path]);
            } else {
                helper._paths.push(path);
                helper._cachedGetters = undefined;
                return helper;
            }
        };
        helper.__proto__ = _StoreHelper.prototype;

        helper._store = store;
        helper._paths = paths;
        helper._isFreeze = false;
        helper._storeGetters = undefined;
        helper._cachedGetters = undefined;

        return helper;
    }

    return <TModule extends Module<any, any, any, any, any>>(
        store: Store<any>
    ): StoreHelper<TModule> => {
        return newStoreHelper(store, []);
    };
})();
// #endregion
