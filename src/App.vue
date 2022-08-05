<script setup lang="ts">
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
const { t } = useI18n(); // use as global scope
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
#app {
}
</style>

<!-- 
  import { useCounterStore } from "./stores/counter";
import { storeToRefs } from "pinia";
const counterStore = useCounterStore();
// console.log(counterStore.counter); //通过 store 实例访问状态来直接读取和写入状态
// const { counter } = storeToRefs(counterStore); //从 Store 中提取属性同时保持其响应式，需要采用这种方式
// counterStore.$reset(); //将状态 重置 到其初始值
/* //这样可以修改多个值
counterStore.$patch({
  counter: 1,
}); */
/* //也可以是一个函数
counterStore.$patch((state) => {
  state.counter = 2;
}); */
//通过将其 $state 属性设置为新对象来替换 Store 的整个状态
// counterStore.$state = { counter: 2, name: "abc" };

/* //与常规的 watch() 相比，使用 $subscribe() 的优点是 subscriptions 只会在 patches 之后触发一次
counterStore.$subscribe(
  (mutation, state) => {
    console.log(mutation); //storeId: "counter" type: "patch function"
    console.log(mutation.storeId);
    console.log(state);
  },
  // 此订阅将在组件卸载后保留
  { detached: true }
); */

/* // Actions 像 methods 一样被调用：
// counterStore.increment(); */
 -->
