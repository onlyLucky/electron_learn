<!--
 * @Author: fg
 * @Date: 2022-12-16 17:43:05
 * @LastEditors: fg
 * @LastEditTime: 2022-12-20 13:36:24
 * @Description: content
-->
<template>
  <div class="login">
    <div class="f-row-e-c loginHeader">
      <SystemOpt :isShowChangeSize="isShowChangeSize"></SystemOpt>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
const isShowChangeSize = false;
</script>
<style scoped lang="less">
.login {
  width: 100vw;
  height: 100vh;
  -webkit-app-region: drag;
  .loginHeader {
  }
  h1 {
    font-size: 40px;
  }
}
</style>
