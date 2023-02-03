<!--
 * @Author: fg
 * @Date: 2023-01-09 14:32:12
 * @LastEditors: fg
 * @LastEditTime: 2023-02-03 11:34:41
 * @Description: content
-->
<template>
  <div class="equipment">
    <div class="header f-row-b-c">
      <h1>会议纪要</h1>
      <SystemOpt color="var(--bg)"></SystemOpt>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
</script>
<style scoped lang="less">
.equipment {
  .size(100vw,100vh);
  .header {
    .size(100%,48px);
    padding: 0 8px 0 16px;
    box-sizing: border-box;
    background-color: @f_color_active;
    -webkit-app-region: drag;
    h1 {
      font-size: 16px;
      color: @bg;
    }
  }
}
</style>
