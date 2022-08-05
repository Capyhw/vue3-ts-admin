<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar shape="square" :size="45" :src="squareUrl"></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>用户名：</el-dropdown-item>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useTokenStore } from "@/stores/token";
const tokenStore = useTokenStore();

const squareUrl = ref("http://img.2qqtouxiang.com/pic/TX10332_01.jpg");

const logout = () => {
  tokenStore.logout();
};
</script>

<style lang="scss" scoped>
::v-deep .el-dropdown-menu__item {
  white-space: nowrap;
}
</style>
