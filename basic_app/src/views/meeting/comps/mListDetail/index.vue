<!--
 * @Author: fg
 * @Date: 2023-01-05 17:47:11
 * @LastEditors: fg
 * @LastEditTime: 2023-01-05 18:01:06
 * @Description: 会议详情
-->
<template>
  <teleport to="#DetailModel"></teleport>
</template>
<script lang="ts" setup></script>
<style lang="less" scoped>
.detail {
  position: absolute;
  background-color: @bg;
  top: 0px;
  right: 0;
  .size(500px,100%);
  z-index: 1000;
  box-shadow: -7px 0px 20px -14px @fontColor;
}
</style>
