<template>
  <el-scrollbar>
    <el-menu
      :default-active="$route.path"
      router
      active-text-color="#ffd04b"
      text-color="#fff"
      :collapse="!asideStore.sideType"
      :collapse-transition="false"
      :background-color="variables.menuBg"
    >
      <el-sub-menu
        :index="'/' + item.path"
        v-for="(item, index) in menuList"
        :key="item.id"
      >
        <template #title>
          <el-icon><component :is="iconList[index]"></component> </el-icon>
          <span>{{ $t(`menus.${item.path}`) }}</span>
        </template>
        <el-menu-item
          v-for="item2 in item.children"
          :key="item2.id"
          :index="'/' + item2.path"
        >
          <template #title>
            <el-icon><component :is="icon"></component> </el-icon>
            <span>{{ $t(`menus.${item2.path}`) }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { menuList as apiMenuList } from "@/api/menu.js";
import { ref } from "vue";
import { useAsideStore } from "@/stores/aside";
import variables from "@/styles/variables.module.scss";

const asideStore = useAsideStore();
type MENULIST = {
  id: number;
  authName: string;
  order: number;
  path: string;
  children: MENULIST[] | [];
};
const iconList = ref(["user", "setting", "shop", "tickets", "pie-chart"]);
const icon = ref("menu");
const menuList = ref<MENULIST[]>([]);
const initMenuList = async () => {
  let res = await apiMenuList();
  res.pop();
  menuList.value = res;
  console.log(menuList.value);
};
initMenuList();
</script>

<style lang="scss" scoped>
.el-menu {
  border: 0;
}
</style>
