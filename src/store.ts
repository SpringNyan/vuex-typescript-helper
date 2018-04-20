import { Store, DispatchOptions, CommitOptions, ModuleOptions } from "vuex";

import { Dispatch } from "./action";
import { GetterValueTree } from "./getter";
import { Module, ModuleState } from "./module";
import { Commit } from "./mutation";

const isProxySupported = typeof Proxy === "function";

export type StoreState<
  TModule extends Module<any, any, any, any, any>
> = ModuleState<TModule> &
  {
    [K in keyof TModule["modules"]]: TModule["modules"][K] extends Module<
      any,
      any,
      any,
      any,
      any
    >
      ? StoreState<TModule["modules"][K]>
      : never
  };

export interface StoreHelper<TModule extends Module<any, any, any, any, any>> {
  readonly state: StoreState<TModule>;
  readonly getters: GetterValueTree<TModule["getters"]>;

  path<TPath extends keyof TModule["modules"]>(
    path: TPath
  ): TModule["modules"][TPath] extends Module<any, any, any, any, any>
    ? StoreHelper<TModule["modules"][TPath]>
    : never;

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

  unregisterModule(): StoreHelper<TModule>;
}

export interface StoreHelperFactory<
  TModule extends Module<any, any, any, any, any>
> {
  (): StoreHelper<TModule>;
  <TPath extends keyof TModule["modules"]>(
    path: TPath
  ): TModule["modules"][TPath] extends Module<any, any, any, any, any>
    ? StoreHelperFactory<TModule["modules"][TPath]>
    : never;
}

class _StoreHelper {
  private readonly _store: Store<any>;
  private readonly _paths: string[];

  private _getters: GetterValueTree<any> | undefined;
  private _rootGetters: GetterValueTree<any> | undefined;

  constructor(store: Store<any>, paths: string[]) {
    this._store = store;
    this._paths = paths;
  }

  public get state() {
    let state = this._store.state;
    this._paths.forEach((path) => {
      state = state[path];
    });

    return state;
  }

  public get getters() {
    if (this._paths.length === 0) {
      return this._store.getters;
    }

    if (!isProxySupported) {
      if (this._store.getters !== this._rootGetters) {
        this._rootGetters = this._store.getters;
        this._getters = undefined;
      }
    }

    if (this._getters == null) {
      if (isProxySupported) {
        this._getters = new Proxy(
          {},
          {
            get: (target: any, p: string) => {
              const path = [...this._paths, p].join("/");
              return this._store.getters[path];
            }
          }
        );
      } else {
        const prefix = this._paths.join("/") + "/";

        const getters = {};
        Object.keys(this._store.getters)
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => {
            Object.defineProperty(getters, key.substring(prefix.length), {
              get: () => {
                return this._store.getters[key];
              },
              enumerable: true
            });
          });

        this._getters = getters;
      }
    }

    return this._getters;
  }

  public path(path: string) {
    return new _StoreHelper(this._store, [...this._paths, path]);
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
    this._store.registerModule(
      this._paths,
      Object.assign({}, module, {
        namespaced: true
      }),
      options
    );
    return this;
  }

  public unregisterModule() {
    this._store.unregisterModule(this._paths);
    return this;
  }
}

export function createStoreHelper<
  TModule extends Module<any, any, any, any, any>
>(store: Store<any>): StoreHelper<TModule> {
  return new _StoreHelper(store, []) as any;
}

function _createStoreHelperFactory<
  TModule extends Module<any, any, any, any, any>
>(store: Store<any>, paths: string[]): StoreHelperFactory<TModule> {
  return (path?: string) =>
    path != null
      ? _createStoreHelperFactory(store, [...paths, path])
      : (new _StoreHelper(store, paths) as any);
}

export function createStoreHelperFactory<
  TModule extends Module<any, any, any, any, any>
>(store: Store<any>): StoreHelperFactory<TModule> {
  return _createStoreHelperFactory(store, []);
}
