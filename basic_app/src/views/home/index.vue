<!--
 * @Author: fg
 * @Date: 2023-03-30 10:14:25
 * @LastEditors: fg
 * @LastEditTime: 2023-03-30 10:35:05
 * @Description: 首页
-->
<template>
  <div class="meetListCon">
    <h1>meet index</h1>
    <Button @click="loginOut">退出登录</Button>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from "electron";
const loginOut = () => {
  // on_login_out
  console.log("on_login_out");
  ipcRenderer.send("on_login_out");
};
</script>
<style scoped lang="less">
.meetListCon {
  h1 {
    font-size: 30px;
  }
}
</style>
