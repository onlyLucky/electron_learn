<!--
 * @Author: fg
 * @Date: 2022-12-14 14:05:24
 * @LastEditors: fg
 * @LastEditTime: 2022-12-15 14:10:26
 * @Description: Index
-->
<template>
  <div class="_app">
    <Header></Header>
    <div class="appContent f">
      <div class="menuBox"></div>
      <div class="contentBox"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from "./Header.vue";
</script>
<style scoped lang="less">
._app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .appContent {
    width: 100%;
    height: calc(100% - 48px);
    background-color: #f5f7f9;
    position: relative;
    z-index: 1;
    .menuBox {
      width: 200px;
      height: 100%;
      background-color: pink;
    }
    .contentBox {
      width: calc(100% - 200px);
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      background-color: #fff;
    }
  }
}
</style>
