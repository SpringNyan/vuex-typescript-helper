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
import VuexTypeScriptHelper, { createModuleBuilder, NamespacedStoreFactory } from "vuex-typescript-helper";

Vue.use(Vuex);
Vue.use(VuexTypeScriptHelper); // register vuex-typescript-helper after vuex

const moduleA = createModuleBuilder({
  num: 0,
  str1: "",
  str2: "",
  bool: false
})
  .getter("str", (state) => `${state.str1}_${state.str2}`)
  .getter("numOrStr", (state, getters) => (state.bool ? getters.str : state.num))
  .mutation("setNum", (state, payload: { value: number }) => (state.num = payload.value)) 
  .mutation("setStr1", (state, payload: { value: string }) => (state.str1 = payload.value))
  .mutation("setStr2", (state, payload: { value: string }) => (state.str2 = payload.value))
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

const moduleRoot = createModuleBuilder({
  count: 0
})
  .mutation("increaseCount", (state, payload: { count?: number }) => (state.count += payload.count != null ? payload.count : 1))
  .module("moduleA", moduleA)
  .build();

declare module "vue/types/vue" {
  export interface Vue {
    readonly $storeFactory: NamespacedStoreFactory<typeof moduleRoot>; // add strong typed $storeFactory definition to Vue instance
  }
}

const store = new Store<any>({
  ...moduleRoot
});

new Vue({
  store,
  render: (h) => h(App)
}).$mount("#app");
```

In App.vue

```vue
<template>
    <div>
        <div>Num: {{ num }}</div>
        <div>Str: {{ str }}</div>
        <div>Count: {{ count }}</div>
        <button @click="increase()">Increase</button>
        <button @click="setStr()">SetStr</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
  public get num() {
    return this.$storeFactory("moduleA")().state.num;
  }

  public get str() {
    return this.$storeFactory("moduleA")().getters.str;
  }

  public get count() {
    return this.$storeFactory().state.count;
  }

  public increase() {
    this.$storeFactory().commit("increaseCount", {});
  }

  public setStr() {
    this.$storeFactory("moduleA")().dispatch("setStr", {
      value: "aaa_bbb"
    });
  }
}
</script>
```

For more example, see [test/test.ts](https://github.com/SpringNyan/vuex-typescript-helper/blob/master/test/test.ts)

## License

MIT
