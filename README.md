# vuex-typescript-helper

[![npm](https://img.shields.io/npm/v/vuex-typescript-helper.svg)](https://www.npmjs.com/package/vuex-typescript-helper)

Namespaced store helper for Vuex with TypeScript

## Requirements

[TypeScript 2.8+](https://github.com/Microsoft/TypeScript)

[Vuex](https://github.com/vuejs/vuex)

## Usage

```typescript
import Vue from "vue";
import Vuex, { Store } from "vuex";
import {
  createModuleBuilder,
  createNamespacedStoreFactory
} from "vuex-typescript-helper";

Vue.use(Vuex);

const moduleA = createModuleBuilder({
  num: 0,
  str1: "",
  str2: "",
  bool: false
})
  .getter("str", (state) => `${state.str1}_${state.str2}`)
  .getter(
    "numOrStr",
    (state, getters) => (state.bool ? getters.str : state.num)
  )
  .mutation(
    "setNum",
    (state, payload: { value: number }) => (state.num = payload.value)
  )
  .mutation(
    "setStr1",
    (state, payload: { value: string }) => (state.str1 = payload.value)
  )
  .mutation(
    "setStr2",
    (state, payload: { value: string }) => (state.str2 = payload.value)
  )
  .mutation("toggleBool", (state) => (state.bool = !state.bool))
  .action("setStr", (context, payload: { value: string }) => {
    if (context.getters.str === payload.value) {
      return;
    }

    const [str1, str2] = payload.value.split("_");
    context.commit("setStr1", { value: str1 });
    context.commit("setStr2", { value: str2 });
  })
  .build();

const moduleB = createModuleBuilder({
  message: null as string | null
})
  .mutation(
    "setMessage",
    (state, payload: { value: string }) => (state.message = payload.value)
  )
  .mutation("cleanMessage", (state) => (state.message = null))
  .build();

const moduleRoot = createModuleBuilder({
  count: 0
})
  .mutation(
    "increaseCount",
    (state, payload: { count?: number }) =>
      (state.count += payload.count != null ? payload.count : 1)
  )
  .module("moduleA", moduleA)
  .module("moduleB", moduleB)
  .build();

const store = new Store<any>({
  ...moduleRoot
});

const storeFactory = createNamespacedStoreFactory<typeof moduleRoot>(store);
const moduleAStore = storeFactory("moduleA")();
const moduleBStore = storeFactory("moduleB")();
const moduleRootStore = storeFactory();

moduleAStore.dispatch("setStr", { value: "str1_str2" });
moduleAStore.commit("setNum", { value: 233 });
moduleBStore.commit("setMessage", { value: "vuex" });
moduleRootStore.commit("increaseCount", {});
```

For more example, see [test/test.ts](https://github.com/SpringNyan/vuex-typescript-helper/blob/master/test/test.ts)

## License

MIT
