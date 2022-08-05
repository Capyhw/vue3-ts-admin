<template>
  <div class="hamburger-container" @click="toggleClick" id="hamburger">
    <el-icon v-show="!collapse" :size="24"><Fold /></el-icon>
    <el-icon v-show="collapse" :size="24"><Expand /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Fold, Expand } from "@element-plus/icons-vue";
import { useAsideStore } from "@/stores/aside";
const asideStore = useAsideStore();
//折叠状态
let collapse = computed(() => {
  return asideStore.sideType;
});
//改变折叠状态
const toggleClick = () => {
  asideStore.changeSideType();
};
</script>

<style lang="scss" scoped>
.hamburger-container {
  margin-right: 16px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
