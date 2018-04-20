import { DispatchOptions } from "vuex";

import { GetterValueTree } from "./getter";
import { MutationTree, Commit } from "./mutation";

export type ActionContext<
  TState,
  TGetterValueTree extends GetterValueTree<any>,
  TMutationTree extends MutationTree,
  TActionTree extends ActionTree
> = {
  dispatch: Dispatch<TActionTree>;
  commit: Commit<TMutationTree>;
  state: TState;
  getters: TGetterValueTree;
  rootState: any;
  rootGetters: any;
};

export type Action<
  TState,
  TGetterValueTree extends GetterValueTree<any>,
  TMutationTree extends MutationTree,
  TActionTree extends ActionTree,
  TPayload,
  TResult
> = (
  injectee: ActionContext<TState, TGetterValueTree, TMutationTree, TActionTree>,
  payload: TPayload
) => TResult | Promise<TResult>;

export type ActionTree = {
  [type: string]: Action<any, any, any, any, any, any>;
};

export type ActionPayload<
  TAction extends Action<any, any, any, any, any, any>
> = TAction extends Action<any, any, any, any, infer TPayload, any>
  ? TPayload
  : never;

export type ActionResult<
  TAction extends Action<any, any, any, any, any, any>
> = TAction extends Action<any, any, any, any, any, infer TResult>
  ? TResult
  : never;

export type Dispatch<TActionTree extends ActionTree> = {
  <TType extends keyof TActionTree>(
    type: TType,
    payload: ActionPayload<TActionTree[TType]>,
    options?: DispatchOptions & { root?: false }
  ): Promise<ActionResult<TActionTree[TType]>>;
  (
    type: string,
    payload: any,
    options: DispatchOptions & { root: true }
  ): Promise<any>;
};
