<!--
 * @Author: fg
 * @Date: 2023-01-09 10:39:59
 * @LastEditors: fg
 * @LastEditTime: 2023-01-09 17:42:33
 * @Description: content
-->
<template>
  <div class="summary">
    <div class="header f-row-b-c">
      <h1>会议纪要</h1>
      <SystemOpt
        :isShowChangeSize="false"
        color="var(--bg)"
        :isShowAllSize="false"
      ></SystemOpt>
    </div>
    <div class="content"></div>
    <div class="footer"></div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
</script>
<style scoped lang="less">
.summary {
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
  .content {
    width: 100%;
    height: calc(100% - 121px);
    padding: 20px;
    box-sizing: border-box;
  }
  .footer {
    .size(100%, 73px);
    border-top: 1px solid @meet_summary_bbc;
  }
}
</style>
