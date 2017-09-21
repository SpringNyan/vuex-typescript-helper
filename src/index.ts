import { Store as _Store, StoreOptions, DispatchOptions, CommitOptions, ActionContext } from "vuex";

export type KeyOfModules<T extends Module<any, any, any, any, any, any>> = keyof T["modules"];
export type ModuleOf<T extends Module<any, any, any, any, any, any>, K extends keyof T["modules"]> = T["modules"][K];

export type StateOf<T extends Module<any, any, any, any, any, any>> =
    {[K in keyof T["state"]]: T["state"][K]; } &
    {[K in keyof T["modules"]]: StateOf<T["modules"][K]>; };

export type Store<TModule extends Module<any, any, any, any, any, any>> =
    _Store<StateOf<TModule>> & { namespace: Namespace<TModule> };

export interface Namespace<TModule extends Module<any, any, any, any, any, any>> {
    (): StoreContext<TModule>;
    <
        T1 extends KeyOfModules<TModule>>(
        key1: T1): StoreContext<ModuleOf<TModule, T1>>;
    <
        T1 extends KeyOfModules<TModule>,
        T2 extends KeyOfModules<ModuleOf<TModule, T1>>>(
        key1: T1,
        key2: T2): StoreContext<ModuleOf<ModuleOf<TModule, T1>, T2>>;
    <
        T1 extends KeyOfModules<TModule>,
        T2 extends KeyOfModules<ModuleOf<TModule, T1>>,
        T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>>(
        key1: T1,
        key2: T2,
        key3: T3): StoreContext<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>;
    <
        T1 extends KeyOfModules<TModule>,
        T2 extends KeyOfModules<ModuleOf<TModule, T1>>,
        T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>,
        T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>>(
        key1: T1,
        key2: T2,
        key3: T3,
        key4: T4): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>;
    <
        T1 extends KeyOfModules<TModule>,
        T2 extends KeyOfModules<ModuleOf<TModule, T1>>,
        T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>,
        T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>,
        T5 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>>(
        key1: T1,
        key2: T2,
        key3: T3,
        key4: T4,
        key5: T5): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>>;
    <
        T1 extends KeyOfModules<TModule>,
        T2 extends KeyOfModules<ModuleOf<TModule, T1>>,
        T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>,
        T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>,
        T5 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>,
        T6 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>>>(
        key1: T1,
        key2: T2,
        key3: T3,
        key4: T4,
        key5: T5,
        key6: T6): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>, T6>>;
    <
        T1 extends KeyOfModules<TModule>,
        T2 extends KeyOfModules<ModuleOf<TModule, T1>>,
        T3 extends KeyOfModules<ModuleOf<ModuleOf<TModule, T1>, T2>>,
        T4 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>>,
        T5 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>>,
        T6 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>>,
        T7 extends KeyOfModules<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>, T6>>>(
        key1: T1,
        key2: T2,
        key3: T3,
        key4: T4,
        key5: T5,
        key6: T6,
        key7: T7): StoreContext<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<ModuleOf<TModule, T1>, T2>, T3>, T4>, T5>, T6>, T7>>;
}

export type StateType<TState> = { "@stateType": TState };
export type ValueType<TValue> = { "@valueType": TValue };
export type PayloadType<TPayload> = { "@payloadType": TPayload };
export type ResultType<TReturn> = { "@resultType": TReturn };

export type Getter<TState, TRootState, TValue> = (state: TState, getters: any, rootState: TRootState, rootGetters: any) => TValue;
export type Action<TState, TRootState, TPayload, TReturn> = (injectee: ActionContext<TState, TRootState>, payload: TPayload) => TReturn | Promise<TReturn>;
export type Mutation<TState, TPayload> = (state: TState, payload: TPayload) => void;

export interface Module<
    TState,
    TRootState,
    TGetters extends { [key: string]: Getter<TState, TRootState, any> & ValueType<any> },
    TActions extends { [key: string]: Action<TState, TRootState, any, any> & PayloadType<any> & ResultType<any> },
    TMutations extends { [key: string]: Mutation<TState, any> & PayloadType<any> },
    TModules extends { [key: string]: Module<any, TRootState, any, any, any, any> }> {
    namespaced: true;
    state: (TState | (() => TState)) & StateType<TState>;
    getters: TGetters;
    actions: TActions;
    mutations: TMutations;
    modules: TModules;
}

export type StateCreator<TState> = (state: TState | (() => TState))
    => (TState | (() => TState)) & StateType<TState>;

export type GetterCreator<TState, TRootState> = <TValue>(getter: Getter<TState, TRootState, TValue>)
    => Getter<TState, TRootState, TValue> & ValueType<TValue>;

export type ActionCreator<TState, TRootState> = <TPayload, TReturn>(action: Action<TState, TRootState, TPayload, TReturn>) =>
    Action<TState, TRootState, TPayload, TReturn> & PayloadType<TPayload> & ResultType<TReturn>;

export type MutationCreator<TState> = <TPayload>(mutation: Mutation<TState, TPayload>) =>
    Mutation<TState, TPayload> & PayloadType<TPayload>;

export type ModuleCreator<TState, TRootState> = <
    TGetters extends { [key: string]: Getter<TState, TRootState, any> & ValueType<any> },
    TActions extends { [key: string]: Action<TState, TRootState, any, any> & PayloadType<any> & ResultType<any> },
    TMutations extends { [key: string]: Mutation<TState, any> & PayloadType<any> },
    TModules extends { [key: string]: Module<any, TRootState, any, any, any, any> }>(
    module: Partial<Module<TState, TRootState, TGetters, TActions, TMutations, TModules>>) =>
    Module<TState, TRootState, TGetters, TActions, TMutations, TModules>;

export interface CreatorContext<TState, TRootState> {
    createState: StateCreator<TState>;
    createGetter: GetterCreator<TState, TRootState>;
    createAction: ActionCreator<TState, TRootState>;
    createMutation: MutationCreator<TState>;
    createModule: ModuleCreator<TState, TRootState>;
}

export function createState<TState>(state: TState | (() => TState))
    : (TState | (() => TState)) & StateType<TState> {
    return state as any;
}

export function createGetter<TState, TRootState, TValue>(getter: Getter<TState, TRootState, TValue>)
    : Getter<TState, TRootState, TValue> & ValueType<TValue> {
    return getter as any;
}

export function createAction<TState, TRootState, TPayload, TReturn>(action: Action<TState, TRootState, TPayload, TReturn>)
    : Action<TState, TRootState, TPayload, TReturn> & PayloadType<TPayload> & ResultType<TReturn> {
    return action as any;
}

export function createMutation<TState, TPayload>(mutation: Mutation<TState, TPayload>)
    : Mutation<TState, TPayload> & PayloadType<TPayload> {
    return mutation as any;
}

export function createModule<
    TState,
    TRootState,
    TGetters extends { [key: string]: Getter<TState, TRootState, any> & ValueType<any> },
    TActions extends { [key: string]: Action<TState, TRootState, any, any> & PayloadType<any> & ResultType<any> },
    TMutations extends { [key: string]: Mutation<TState, any> & PayloadType<any> },
    TModules extends { [key: string]: Module<any, TRootState, any, any, any, any> }>(
    module: Partial<Module<TState, TRootState, TGetters, TActions, TMutations, TModules>>)
    : Module<TState, TRootState, TGetters, TActions, TMutations, TModules> {
    return {
        namespaced: true,
        state: {},
        getters: {},
        actions: {},
        mutations: {},
        modules: {},
        ...module
    } as any;
}

export function createCreatorContext<TState, TRootState>(): CreatorContext<TState, TRootState> {
    return {
        createState,
        createGetter,
        createAction,
        createMutation,
        createModule
    };
}

export type Getters<T extends any> = T["_getters"];
export type ActionPayload<T extends any> = T["_actionPayload"];
export type MutationPayload<T extends any> = T["_mutationPayload"];

export class StoreContext<TModule extends Module<any, any, any, any, any, any>> {
    public readonly path: string;

    public get state(): StateOf<TModule> {
        let state = this.store.state as any;
        this.splittedPath.forEach((key) => {
            state = state[key];
        });

        return state;
    }

    public get getters(): Getters<TModule> {
        if (typeof Proxy === "undefined") {
            if (this.path === "") {
                return this.store.getters;
            }

            const propertyDescriptorMap: PropertyDescriptorMap = {};
            const getters: any = {};

            const prefix = this.path + "/";
            Object.keys(this.store.getters)
                .filter((key) => key.indexOf(prefix) === 0)
                .forEach((key) => {
                    propertyDescriptorMap[key.substring(prefix.length)] = {
                        get: () => this.store.getters[key],
                        enumerable: true,
                        configurable: true
                    };
                });

            Object.defineProperties(getters, propertyDescriptorMap);

            return getters;
        } else {
            // TODO: handle other traps.
            return new Proxy({}, {
                get: (target: any, name: string) => {
                    const key = this.withPath(name);
                    return this.store.getters[key];
                }
            });
        }
    }

    private readonly store: Store<TModule>;
    private readonly splittedPath: string[];

    constructor(store: Store<TModule>, path?: string) {
        this.store = store;
        this.path = path != null ? path : "";
        this.splittedPath = this.path !== "" ? this.path.split("/") : [];
    }

    public namespace: Namespace<TModule> = (...keys: string[]) => {
        const path = this.splittedPath.concat(keys).join("/");
        return new StoreContext<any>(this.store, path);
    }

    public dispatch<T extends keyof TModule["actions"]>(type: T, payload: TModule["actions"][T]["@payloadType"], options?: DispatchOptions)
        : Promise<TModule["actions"][T]["@resultType"]> {
        return this.store.dispatch(this.withPath(type), payload, options);
    }

    public commit<T extends keyof TModule["mutations"]>(type: T, payload: TModule["mutations"][T]["@payloadType"], options?: CommitOptions)
        : void {
        return this.store.commit(this.withPath(type), payload, options);
    }

    private withPath(str: string): string {
        return this.path +
            this.path !== "" ? "/" : "" +
            str;
    }
}

export function createStore<TOptions extends StoreOptions<any> & Module<any, any, any, any, any, any>>(options: TOptions): Store<TOptions> {
    const store = new _Store(options) as Store<TOptions>;
    const context = new StoreContext(store);
    store.namespace = (...keys: string[]) => {
        return context.namespace(...keys);
    };

    return store;
}
