<!--
 * @Author: fg
 * @Date: 2022-12-15 16:22:27
 * @LastEditors: fg
 * @LastEditTime: 2022-12-19 15:19:33
 * @Description: content
-->
<template>
  <div class="meeting">
    <h1>hello meeting</h1>
    <Button @click="changeWin">更改窗口</Button>
  </div>
</template>
<script setup lang="ts">
import { Button } from "view-ui-plus";
import { ipcRenderer } from "electron";

const changeWin = () => {
  //
  ipcRenderer.send("win_size", 100, 100);
};
</script>
<style scoped lang="less">
.meeting {
  h1 {
    font-size: 40px;
  }
}
</style>
