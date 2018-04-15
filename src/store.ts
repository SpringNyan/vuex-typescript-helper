import { Store, DispatchOptions, CommitOptions, ModuleOptions } from "vuex";

import { Dispatch } from "./action";
import { GetterValueTree } from "./getter";
import { Module, ModuleState } from "./module";
import { Commit } from "./mutation";

const isProxySupported = typeof Proxy === "function";

export type StoreState<
  TModule extends Module<any, any, any, any, any>
> = ModuleState<TModule["state"]> &
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

export type StoreHelper<TModule extends Module<any, any, any, any, any>> = {
  <TPath extends keyof TModule["modules"]>(
    path: TPath
  ): TModule["modules"][TPath] extends Module<any, any, any, any, any>
    ? StoreHelper<TModule["modules"][TPath]>
    : never;

  readonly state: StoreState<TModule>;
  readonly getters: GetterValueTree<TModule["getters"]>;

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
};

class _StoreHelper {
  private _paths!: string[];

  private _store!: Store<any>;

  private _getters: GetterValueTree<any> | undefined;
  private _rootGetters: GetterValueTree<any> | undefined;

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
          .filter(key => key.startsWith(prefix))
          .forEach(key => {
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
    return newStoreHelper(this._store, [...this._paths, path]);
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
    return this;
  }
}

function newStoreHelper(store: Store<any>, paths: string[]) {
  const storeHelper: any = (path: string) => {
    return newStoreHelper(store, [...storeHelper._paths, path]);
  };

  storeHelper._store = store;
  storeHelper._paths = paths;

  Object.keys(_StoreHelper.prototype).forEach(key => {
    if (key === "state" || key === "getters") {
      Object.defineProperty(storeHelper, key, {
        get: () => _StoreHelper.prototype[key],
        enumerable: true,
        configurable: true
      });
    } else {
      storeHelper[key] = (_StoreHelper.prototype as any)[key];
    }
  });

  return storeHelper;
}

export function createStoreHelper<
  TModule extends Module<any, any, any, any, any>
>(store: Store<any>): StoreHelper<TModule> {
  return newStoreHelper(store, []);
}
