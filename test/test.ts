import { expect } from "chai";
import Vue from "vue";
import Vuex, { Store } from "vuex";
import { createModuleBuilder, createStoreHelperFactory } from "../lib";

Vue.use(Vuex);

describe("vuex-typescript-helper", () => {
  it("test", () => {
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

    const factory = createStoreHelperFactory<typeof moduleRoot>(store);
    const moduleAHelper = factory("moduleA")();
    const moduleBHelper = factory("moduleB")();
    const moduleRootHelper = factory();

    moduleAHelper.dispatch("setStr", { value: "str1_str2" });
    moduleAHelper.commit("setNum", { value: 233 });
    moduleBHelper.commit("setMessage", { value: "vuex" });
    moduleRootHelper.commit("increaseCount", {});

    expect(moduleRootHelper.state.count).to.equal(1);

    expect(moduleRootHelper.state.moduleA.num).to.equal(233);
    expect(moduleAHelper.state.num).to.equal(233);

    expect(moduleRootHelper.state.moduleA.str1).to.equal("str1");
    expect(moduleAHelper.state.str2).to.equal("str2");
    expect(moduleAHelper.getters.str).to.equal("str1_str2");

    expect(moduleAHelper.state.bool).to.equal(false);
    moduleAHelper.commit("toggleBool", {});
    expect(moduleAHelper.state.bool).to.equal(true);

    expect(moduleRootHelper.state.moduleB.message).to.equal("vuex");
    expect(moduleBHelper.state.message).to.equal("vuex");
    moduleBHelper.commit("cleanMessage", {});
    expect(moduleBHelper.state.message).to.equal(null);

    const dynamicModule = createModuleBuilder({
      numOrStr: 0 as string | number
    })
      .getter("isStr", (state) => typeof state.numOrStr === "string")
      .mutation(
        "setNumOrStr",
        (state, payload: { value: string | number }) =>
          (state.numOrStr = payload.value)
      )
      .build();

    moduleAHelper
      .path("dynamic")
      .registerModule(dynamicModule)
      .commit("setNumOrStr", { value: "str" });

    expect(
      factory("moduleA")().path<typeof dynamicModule>("dynamic").getters.isStr
    ).to.equal(true);

    expect((moduleRootHelper.state.moduleA as any).dynamic.numOrStr).to.equal(
      "str"
    );

    moduleRootHelper
      .path("moduleA")
      .path("dynamic")
      .unregisterModule();

    expect((moduleRootHelper.state.moduleA as any).dynamic).to.equal(undefined);
  });
});
