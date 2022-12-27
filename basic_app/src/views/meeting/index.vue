<!--
 * @Author: fg
 * @Date: 2022-12-15 16:22:27
 * @LastEditors: fg
 * @LastEditTime: 2022-12-27 17:54:32
 * @Description: content
-->
<template>
  <div class="meeting">
    <div class="searchBox f-w f-row-e-c">
      <div class="formItem f-row-c-c">
        <span class="label">会议名称</span>
        <Input placeholder="请输入会议名称"></Input>
      </div>
      <div class="formItem">
        <span class="label">会议名称</span>
        <Input placeholder="请输入会议名称"></Input>
      </div>
    </div>
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
  width: 100%;
  height: 100%;
  .searchBox {
    width: 100%;
    padding: 14px;
    box-sizing: border-box;
  }
  h1 {
    font-size: 40px;
  }
}
</style>
