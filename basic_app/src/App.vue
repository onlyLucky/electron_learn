<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  // 初始化主题
  document.getElementById("app")!.className = "theme_basic";
});
</script>
<style lang="less"></style>
