export declare type Getter<TState, TGetterValueTree extends GetterValueTree<any>, TValue> = (state: TState, getters: TGetterValueTree, rootState: any, rootGetters: any) => TValue;
export declare type GetterTree = {
    [key: string]: Getter<any, any, any>;
};
export declare type GetterValueTree<TGetterTree extends GetterTree> = {
    [K in keyof TGetterTree]: GetterValue<TGetterTree[K]>;
};
export declare type GetterValue<TGetter extends Getter<any, any, any>> = TGetter extends Getter<any, any, infer TValue> ? TValue : never;
