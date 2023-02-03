<!--
 * @Author: fg
 * @Date: 2023-02-03 14:55:51
 * @LastEditors: fg
 * @LastEditTime: 2023-02-03 17:47:24
 * @Description: content
-->
<template>
  <div class="fileListCon">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <div class="item">全部</div>
      /
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const router = useRouter();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
</script>
<style scoped lang="less">
.fileListCon {
  .size(100%,100%);
  padding: 16px;
  box-sizing: border-box;
  h1 {
    font-size: 30px;
  }
}
</style>
