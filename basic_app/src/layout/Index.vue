<!--
 * @Author: fg
 * @Date: 2022-12-14 14:05:24
 * @LastEditors: fg
 * @LastEditTime: 2023-01-11 13:39:14
 * @Description: Index
-->
<template>
  <div class="_app">
    <WaterMark :option="waterSetting"></WaterMark>
    <Header></Header>
    <div class="appContent f">
      <div class="menuBox">
        <Menu></Menu>
      </div>
      <div class="contentBox">
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from "./Header.vue";
import Menu from "./Menu.vue";
import WaterMark, { SettingType } from "@/commons/WaterMask/index.vue";
const waterSetting = ref<SettingType>({
  textArr: ["可立批"],
  fillStyle: "rgba(0,0,0,.05)",
});
</script>
<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.99, -0.01, 0.37, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
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
