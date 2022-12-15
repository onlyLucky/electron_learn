<!--
 * @Author: fg
 * @Date: 2022-12-14 14:04:52
 * @LastEditors: fg
 * @LastEditTime: 2022-12-15 14:35:26
 * @Description: header
-->
<template>
  <div class="header">
    <div class="headerLeft">
      <HLogo></HLogo>
    </div>
    <div class="headerRight">
      <SystemOpt></SystemOpt>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import HLogo from "./comps/HLogo.vue";
</script>
<style scoped lang="less">
.header {
  width: 100vw;
  height: 48px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  /* 值为no-drag时不可拖拽 */
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  z-index: 2;
  position: relative;
  justify-content: space-between;
}
</style>
