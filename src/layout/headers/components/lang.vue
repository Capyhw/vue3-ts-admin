<template>
  <el-dropdown @command="handleCommand">
    <svg-icon name="language"></svg-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh" :disabled="currentLanguage === 'zh'"
          >中文
        </el-dropdown-item>
        <el-dropdown-item command="en" :disabled="currentLanguage === 'en'"
          >English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
import { useLangStore } from "@/stores/lang";
const i18n = useI18n();
const langStore = useLangStore();

const currentLanguage = computed(() => {
  return i18n.locale.value;
});
//切换语言
const handleCommand = (val: string) => {
  i18n.locale.value = val;
  langStore.changLang(val);
  localStorage.setItem("lang", val);
};
</script>

<style lang="scss" scoped></style>
