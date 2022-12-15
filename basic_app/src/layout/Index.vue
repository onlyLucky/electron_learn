<!--
 * @Author: fg
 * @Date: 2022-12-14 14:05:24
 * @LastEditors: fg
 * @LastEditTime: 2022-12-15 16:45:13
 * @Description: Index
-->
<template>
  <div class="_app">
    <Header></Header>
    <div class="appContent f">
      <div class="menuBox">
        <Menu></Menu>
      </div>
      <div class="contentBox">
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from "./Header.vue";
import Menu from "./Menu.vue";
</script>
<style scoped lang="less">
._app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .appContent {
    width: 100%;
    height: calc(100% - 48px);
    background-color: @bg;
    position: relative;
    z-index: 1;
    .menuBox {
      width: 200px;
      height: 100%;
      background-color: @bg;
      box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
      position: relative;
      z-index: 1;
      overflow: auto;
      overflow-x: hidden;
    }
    .contentBox {
      width: calc(100% - 200px);
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      background-color: @content_bg;
      position: relative;
      z-index: 0;
      .content {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background-color: @bg;
        overflow: auto;
        overflow-x: hidden;
      }
    }
  }
}
</style>
