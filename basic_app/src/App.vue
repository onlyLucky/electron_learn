<template>
  <router-view />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ipcRenderer } from "electron";
const { locale } = useI18n();

onMounted(() => {
  // 主题初始化
  document.body.setAttribute("class", "theme_basic");
  // document.getElementById("app")!.className = "theme_basic";
  // 判断当前是否有config配置
  ipcRenderer.send("get_app");
  ipcRenderer.on("set_url", (e, url, lang) => {
    locale.value = lang;
    localStorage.setItem("app_url", url);
  });
});
</script>
<style lang="less"></style>
