<!--
 * @Author: fg
 * @Date: 2023-02-03 13:58:21
 * @LastEditors: fg
 * @LastEditTime: 2023-03-15 16:44:13
 * @Description: 文件tabs切换
-->
<template>
  <div class="Tabs f-row-s-c">
    <!-- active -->
    <div class="tabItem active f-row-s-c" @click="goFile">
      <div
        class="progressBar"
        :style="{
          width: tabWidth + 'px',
          opacity: tabWidth == 0 ? 0 : 1,
        }"
      ></div>
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

let props = withDefaults(
  defineProps<{
    progress: number;
  }>(),
  {
    progress: 0,
  }
);
let tabWidth = ref<number>(0);
watch(
  () => props.progress,
  (val) => {
    tabWidth.value = 200 * (val / 100);
  }
);

const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
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
    overflow: hidden;
    -webkit-app-region: no-drag;
    position: relative;

    .progressBar {
      position: absolute;
      top: 0;
      left: 0;
      .size(100px, 100%);
      box-sizing: border-box;
      opacity: 0;
      transition: width 0.2s ease-in-out;
      background-color: rgba(40, 107, 246, 0.25);
    }
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
