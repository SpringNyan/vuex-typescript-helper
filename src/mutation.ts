import { CommitOptions } from "vuex";

export type Mutation<TState, TPayload> = (
  state: TState,
  payload: TPayload
) => void;

export type MutationTree = {
  [type: string]: Mutation<any, any>;
};

export type MutationPayload<
  TMutation extends Mutation<any, any>
> = TMutation extends Mutation<any, infer TPayload> ? TPayload : never;

export type Commit<TMutationTree extends MutationTree> = {
  <TType extends keyof TMutationTree>(
    type: TType,
    payload: MutationPayload<TMutationTree[TType]>,
    options?: CommitOptions & { root?: false }
  ): void;
  (type: string, payload: any, options: CommitOptions & { root: true }): void;
};
