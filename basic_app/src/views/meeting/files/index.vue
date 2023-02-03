<!--
 * @Author: fg
 * @Date: 2023-01-09 14:32:12
 * @LastEditors: fg
 * @LastEditTime: 2023-02-03 16:20:24
 * @Description: content
-->
<template>
  <div class="File">
    <div class="header f-row-b-c">
      <div class="tabBox">
        <FTabs></FTabs>
      </div>
      <SystemOpt color="var(--bg)"></SystemOpt>
    </div>
    <div class="FileContent">
      <router-view />
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import FTabs from "../comps/fTabs/index.vue";
</script>
<style scoped lang="less">
.File {
  .size(100vw,100vh);
  .header {
    .size(100%,48px);
    padding: 0 8px 0 16px;
    box-sizing: border-box;
    background-color: @f_color_active;
    -webkit-app-region: drag;
    .tabBox {
      width: calc(100% - 150px);
      height: 100%;
    }
  }
  .FileContent {
    width: 100%;
    height: calc(100% - 48px);
  }
}
</style>
