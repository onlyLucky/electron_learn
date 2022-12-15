<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  // 主题初始化
  document.getElementById("app")!.className = "theme_basic";
});
</script>
<style lang="less"></style>
