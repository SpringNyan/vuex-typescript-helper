import { Action, ActionTree } from "./action";
import { Getter, GetterTree, GetterValueTree } from "./getter";
import { Mutation, MutationTree } from "./mutation";
import { State } from "./state";

export type Module<
  TState,
  TGetterTree extends GetterTree,
  TMutationTree extends MutationTree,
  TActionTree extends ActionTree,
  TModuleTree extends ModuleTree
> = {
  state: State<TState>;
  getters: TGetterTree;
  actions: TActionTree;
  mutations: TMutationTree;
  modules: TModuleTree;
};

export type ModuleTree = {
  [key: string]: Module<any, any, any, any, any>;
};

export type ModuleState<
  TModule extends Module<any, any, any, any, any>
> = TModule extends Module<infer TState, any, any, any, any> ? TState : never;

export interface ModuleBuilder<
  TState,
  TGetterTree extends GetterTree,
  TMutationTree extends MutationTree,
  TActionTree extends ActionTree,
  TModuleTree extends ModuleTree
> {
  getter<TKey extends string, TValue>(
    key: TKey,
    getter: Getter<TState, GetterValueTree<TGetterTree>, TValue>
  ): ModuleBuilder<
    TState,
    TGetterTree &
      { [K in TKey]: Getter<TState, GetterValueTree<TGetterTree>, TValue> },
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
    TMutationTree & { [K in TType]: Mutation<TState, TPayload> },
    TActionTree,
    TModuleTree
  >;

  action<TType extends string, TPayload, TResult>(
    type: TType,
    action: Action<
      TState,
      GetterValueTree<TGetterTree>,
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
          GetterValueTree<TGetterTree>,
          TMutationTree,
          TActionTree,
          TPayload,
          TResult
        >
      },
    TModuleTree
  >;

  module<TKey extends string, TModule extends Module<any, any, any, any, any>>(
    key: TKey,
    module: TModule
  ): ModuleBuilder<
    TState,
    TGetterTree,
    TMutationTree,
    TActionTree,
    TModuleTree & { [K in TKey]: TModule }
  >;

  build(): Module<TState, TGetterTree, TMutationTree, TActionTree, TModuleTree>;
}

class _ModuleBuilder {
  private _module: Module<any, any, any, any, any> = {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {}
  };

  constructor(state: any) {
    this._module.state = state;
  }

  public getter(key: string, getter: Getter<any, any, any>) {
    this._module.getters[key] = getter;
    return this;
  }

  public mutation(type: string, mutation: Mutation<any, any>) {
    this._module.mutations[type] = mutation;
    return this;
  }

  public action(type: string, action: Action<any, any, any, any, any, any>) {
    this._module.actions[type] = action;
    return this;
  }

  public module(key: string, module: Module<any, any, any, any, any>) {
    this._module.modules[key] = {
      ...module,
      namespaced: true
    };

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

export function createModuleBuilder<TState>(
  state: State<TState>
): ModuleBuilder<TState, {}, {}, {}, {}> {
  return new _ModuleBuilder(state) as any;
}
