<!--
 * @Author: fg
 * @Date: 2022-12-16 15:13:52
 * @LastEditors: fg
 * @LastEditTime: 2023-01-09 14:35:04
 * @Description: content
-->
<template>
  <div class="equipment">
    <h1>hello equipment</h1>
    <Button @click="addWindows">创建窗口</Button>
    <Button @click="addWindows1">创建file窗口</Button>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from "electron";

const addWindows = async () => {
  const result = await ipcRenderer.invoke("open-win", {
    type: 0,
    urlName: "models/meet/summary",
  });
  console.log(result);
};
const addWindows1 = async () => {
  const result = await ipcRenderer.invoke("open-win", {
    type: 1,
    urlName: "models/meet/file?name=123",
  });
  console.log(result);
};
</script>
<style scoped lang="less">
.equipment {
  h1 {
    font-size: 40px;
  }
}
</style>
