<!--
 * @Author: fg
 * @Date: 2023-02-27 16:50:04
 * @LastEditors: fg
 * @LastEditTime: 2023-02-27 17:54:09
 * @Description: 视频播放
-->
<template>
  <div class="Video">
    <div class="header f-row-b-c">
      <div class="hTitle">
        <Text
          :ellipsis-config="{ tooltip: true }"
          ellipsis
          placement="bottom-start"
        >
          {{ queryParams.name || "视频播放" }}
        </Text>
      </div>
      <SystemOpt color="var(--bg)"></SystemOpt>
    </div>
    <div class="content">
      <video
        id="player"
        @ended="onPlayEnd"
        ref="player"
        width="100%"
        height="100%"
        :poster="mediaConfig.videoBg"
        controls
      >
        <source id="videoPlay" :src="mediaConfig.src" type="video/mp4" />
      </video>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import { useRoute } from "vue-router";
const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);

let mediaConfig = reactive<any>({
  videoBg:
    "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAOEiEk.img",
  src: "https://prod-streaming-video-msn-com.akamaized.net/9752d732-2354-483f-a678-a6d0cd2c22b7/1a5ed13a-43f5-4e85-95c8-6579065c4d7c.mp4",
});

const onPlayEnd = () => {};
</script>
<style scoped lang="less">
:deep(.hTitle) {
  .ivu-typography {
    color: @bg;
    font-size: 16px;
    font-weight: bold;
  }
}
.Video {
  .size(100vw,100vh);
  .header {
    .size(100%,48px);
    padding: 0 8px 0 16px;
    box-sizing: border-box;
    background-color: @video_header;
    -webkit-app-region: drag;
    .hTitle {
      font-size: 16px;
      color: @bg;
    }
  }
  .content {
    .size(100%, calc(100% - 48px));
    background-color: @video_header;
    position: relative;
    video {
      /* height: 300px; */
      .size(100%,auto);
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
