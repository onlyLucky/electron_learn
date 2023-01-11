<!--
 * @Author: fg
 * @Date: 2023-01-11 14:17:33
 * @LastEditors: fg
 * @LastEditTime: 2023-01-11 15:15:17
 * @Description: 设置
-->
<template>
  <div class="setting">
    <div class="header f-row-b-c">
      <h1>设置</h1>
      <SystemOpt
        :isShowChangeSize="false"
        color="var(--bg)"
        :isShowMinSize="false"
      ></SystemOpt>
    </div>
    <div class="content">
      <div class="search"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt";
</script>
<style scoped lang="less">
.setting {
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
