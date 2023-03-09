<!--
 * @Author: fg
 * @Date: 2023-03-09 17:20:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-09 18:01:49
 * @Description: 字幕文件
-->
<template>
  <div class="Caption" v-move>
    <h1>meet List</h1>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="less">
.Caption {
  .size(200px,40px);
  position: absolute;
  left: 0;
  top: 0;
  background-color: pink;
  h1 {
    font-size: 30px;
  }
}
</style>
