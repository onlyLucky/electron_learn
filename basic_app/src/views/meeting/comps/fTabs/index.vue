<!--
 * @Author: fg
 * @Date: 2023-02-03 13:58:21
 * @LastEditors: fg
 * @LastEditTime: 2023-02-03 16:56:50
 * @Description: 文件tabs切换
-->
<template>
  <div class="Tabs f-row-s-c">
    <!-- active -->
    <div class="tabItem active f-row-s-c" @click="goFile">
      <svg-icon
        iconName="icon-wenjianjia1"
        className="tabItemIcon"
        size="24"
        color="#faba62"
      ></svg-icon>
      <Text
        class="meetName"
        :ellipsis-config="{ tooltip: true }"
        ellipsis
        placement="bottom-start"
      >
        {{ queryParams.name || "会议文件" }}
      </Text>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
type QPType = {
  name: string;
  id: any;
};
const queryParams = reactive<QPType>(route.query as QPType);
const router = useRouter();
const goMeet = () => {
  console.log("meet");
  router.push({ name: "files_meet" });
};
const goFile = () => {
  console.log("file");
  router.push({ name: "files_list" });
};
</script>
<style scoped lang="less">
.Tabs {
  .size(100%,100%);
  padding-top: 14px;
  box-sizing: border-box;
  .tabItem {
    padding: 0 10px;
    .size(200px, 100%);
    border-radius: 8px 8px 0px 0px;
    box-sizing: border-box;
    -webkit-app-region: no-drag;
    .tabItemIcon {
      margin-right: 6px;
    }
    .meetName {
      width: calc(100% - 30px);
      font-size: 14px;
      font-weight: bold;
      color: @bg;
    }
  }
  .tabItem.active {
    background-color: @bg;
    .meetName {
      color: @f_color_h3;
    }
  }
}
</style>
