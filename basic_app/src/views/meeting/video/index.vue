<!--
 * @Author: fg
 * @Date: 2023-02-27 16:50:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-02 17:21:33
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
    <div class="content f-row-c-c">
      <div class="leftCon" ref="refVideoCon">
        <video
          id="player"
          @ended="onPlayEnd"
          ref="refPlayer"
          :style="{
            width: mediaConfig.width + 'px',
            height: mediaConfig.height + 'px',
          }"
          :poster="mediaConfig.videoBg"
        >
          <source :src="mediaConfig.src" type="video/mp4" />
        </video>

        <!-- 底部进度条 -->
        <div class="ControlBox">
          <BControl></BControl>
        </div>
      </div>
      <div
        class="switchIcon f-row-c-c"
        v-debounce="onRightChange"
        :style="{ right: isShowRight ? '400px' : '0px' }"
      >
        <svg-icon
          v-show="!isShowRight"
          iconName="icon-left-arrow"
          className="optItem"
          size="18"
          color="var(--bg)"
        ></svg-icon>
        <svg-icon
          v-show="isShowRight"
          iconName="icon-right-arrow"
          className="optItem"
          size="18"
          color="var(--bg)"
        ></svg-icon>
      </div>
      <!-- 侧边展示内容 -->
      <div class="rightCon" :style="{ width: isShowRight ? '400px' : '0px' }">
        <RightTab></RightTab>
      </div>
    </div>
    <div class="downLoading f-col-c-c" v-show="downloadUse.isNeedDownload">
      <div class="dTop f-row-c-c">
        <svg-icon
          iconName="icon-yunxiazai-"
          className="optItem"
          size="30"
          color="var(--bg)"
        ></svg-icon>
        <span>下载中...</span>
      </div>
      <div class="progress">
        <Progress
          :percent="downloadUse.progress"
          :stroke-width="6"
          status="active"
        >
          <span class="proTxt"> {{ downloadUse.progress || 0 }}% </span>
        </Progress>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import BControl from "../comps/video/BControl.vue";
import RightTab from "../comps/video/rightTab.vue";
import { useRoute } from "vue-router";
import { useDownload, DownloadType } from "../comps/mListDetail/useDownload";
import { useVideo } from "./useVideo";
import console from "console";
const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);

const { downloadUse, handleDownload } = useDownload(
  queryParams.id,
  queryParams.name || ""
) as any;

let mediaConfig = reactive<any>({
  width: "",
  height: "",
  videoBg:
    "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAOEiEk.img",
  src: "https://prod-streaming-video-msn-com.akamaized.net/9752d732-2354-483f-a678-a6d0cd2c22b7/1a5ed13a-43f5-4e85-95c8-6579065c4d7c.mp4",
});

const isShowRight = ref<boolean>(false);
const onRightChange = () => {
  isShowRight.value = !isShowRight.value;
};

watch(
  () => downloadUse.isNeedDownload,
  (val) => {
    console.log("upload: " + val);
    if (val) handleDownload();
  }
);
const refVideoCon = ref<HTMLElement>();
// useVideo(refVideoCon);
const onPlayEnd = () => {};
const refPlayer = ref<HTMLVideoElement>();

nextTick(() => {
  let temp = useVideo({
    playObj: refPlayer.value as HTMLVideoElement,
    mId: queryParams.id,
    mName: queryParams.name,
  });
});
onMounted(() => {
  mediaConfig.height = refVideoCon.value?.clientHeight;
  mediaConfig.width = (refVideoCon.value?.clientWidth as number) - 400;
  window.onresize = () => {
    mediaConfig.height = refVideoCon.value?.clientHeight;
    mediaConfig.width = isShowRight.value
      ? refVideoCon.value?.clientWidth
      : (refVideoCon.value?.clientWidth as number) - 400;
  };
});
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
  background-color: @video_header;
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
    overflow: hidden;
    .leftCon {
      .size(100%,100%);
      position: relative;
      video {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
      }
      .ControlBox {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 10;
        .size(100%,100px);
      }
    }
    .switchIcon {
      .size(36px,80px);
      border-radius: 6px 0px 0px 6px;
      background-color: rgba(255, 255, 255, 0.06);
      position: absolute;
      right: 400px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 9;
      transition: right 0.2s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
    .rightCon {
      .size(400px,100%);
      flex-shrink: 0;
      background-color: #18191b;
      z-index: 10;
      transition: width 0.2s;
    }
  }
  .downLoading {
    .size(100%, calc(100% - 48px));
    position: absolute;
    top: 48px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 12;
    .dTop {
      margin-bottom: 10px;
      .optItem {
        margin-right: 14px;
      }
      span {
        font-size: 14px;
        color: @bg;
      }
    }
    .progress {
      .size(260px,30px);
      .proTxt {
        font-size: 14px;
        color: @bg;
      }
    }
  }
}
</style>
