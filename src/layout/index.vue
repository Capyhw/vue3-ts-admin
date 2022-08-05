<template>
  <el-container class="layout-container-demo">
    <el-aside :width="asideWidth" class="sidebar-container">
      <Menu></Menu>
    </el-aside>

    <el-container
      class="container"
      :class="{ hidderContainer: !asideStore.sideType }"
    >
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { Message, Setting } from "@element-plus/icons-vue";
import Menu from "./Menu.vue";
import Header from "./headers/index.vue";
import variables from "@/styles/variables.module.scss";
import { ref } from "vue";
import { useAsideStore } from "@/stores/aside";
import { computed } from "@vue/reactivity";
const asideStore = useAsideStore();
const asideWidth = computed(() => {
  return asideStore.sideType
    ? variables.sideBarWidth
    : variables.hideSideBarWidth;
});
</script>

<style scoped lang="scss">
.layout-container-demo {
  height: 100%;
  .el-aside {
    height: 100%;
    background-color: #304156;
  }
  .container {
    width: calc(100% - $sideBarWidth);
    height: 100%;
    padding: 0;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    transition: all 0.28s;
    .el-header {
      padding: 0;
    }
    &.hidderContainer {
      width: calc(100% - $hideSideBarWidth);
    }
  }
}
</style>
