<!--
 * @Author: fg
 * @Date: 2023-02-27 16:50:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-09 17:31:59
 * @Description: 视频播放
-->
<template>
  <div class="Video">
    <div v-show="!refBControl?.smallSizeFlag" class="header f-row-b-c">
      <div class="hTitle">
        <Text
          :ellipsis-config="{ tooltip: true }"
          ellipsis
          placement="bottom-start"
        >
          {{ queryParams.name || "视频播放" }}
          {{ refBControl?.smallSizeFlag }}
        </Text>
      </div>
      <SystemOpt color="var(--bg)"></SystemOpt>
    </div>
    <div
      class="content f-row-c-c"
      :style="{
        height: refBControl?.smallSizeFlag ? '100%' : 'calc(100% - 48px)',
      }"
    >
      <div
        :class="[
          'leftCon',
          refVideoComp?.videoConfig.playing ? 'playLeftCon' : '',
        ]"
        :style="{ width: isShowRight ? 'calc(100% - 400px)' : '100%' }"
        ref="refVideoCon"
      >
        <VideoComp
          ref="refVideoComp"
          :width="mediaConfig.width"
          :height="mediaConfig.height"
        ></VideoComp>
        <!-- 底部进度条 -->
        <div class="ControlBox">
          <BControl
            ref="refBControl"
            :mediaData="refVideoComp?.videoConfig"
            @onSeek="onSeek"
            @onMediaChange="onMediaChange"
          ></BControl>
        </div>
        <div class="switchIcon f-row-c-c" v-debounce="onRightChange">
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

        <!-- 字幕 -->
        <Caption></Caption>
      </div>

      <!-- 侧边展示内容 -->
      <div
        class="rightCon"
        :style="{
          width: isShowRight ? '400px' : '0px',
          opacity: isShowRight ? 1 : 0,
        }"
      >
        <RightTab
          :show="isShowRight"
          :files="refVideoComp?.fileList"
          :user="refVideoComp?.userList"
          :vConfig="refVideoComp?.videoConfig"
        ></RightTab>
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
import VideoComp from "../comps/video/videoComp.vue";
import Caption from "../comps/video/Caption.vue";
import { useRoute } from "vue-router";
import { useDownload, DownloadType } from "../comps/mListDetail/useDownload";
const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);

const { downloadUse, handleDownload } = useDownload(
  queryParams.id,
  queryParams.name || ""
) as any;

let mediaConfig = reactive<any>({
  width: "",
  height: "",
});

const isShowRight = ref<boolean>(false);
const onRightChange = () => {
  isShowRight.value = !isShowRight.value;
  setTimeout(() => {
    mediaConfig.height = refVideoCon.value?.clientHeight;
    mediaConfig.width = refVideoCon.value?.clientWidth;
  }, 200);
};

watch(
  () => downloadUse.isNeedDownload,
  (val) => {
    console.log("upload: " + val);
    if (val) handleDownload();
  }
);
const refVideoCon = ref<HTMLElement>();

const refVideoComp = ref<InstanceType<typeof VideoComp>>();

const refBControl = ref<InstanceType<typeof BControl>>();

const onMediaChange = () => {
  // console.log();
  refVideoComp.value?.onMediaCtrl();
  if (refVideoComp.value?.videoConfig.playing) {
    refVideoComp.value?.startPath();
  } else {
    refVideoComp.value?.pausePath();
  }
};

const onSeek = (progress: number) => {
  refVideoComp.value?.seekTo(progress);
  refVideoComp.value?.seekToCanvas(refVideoComp.value?.videoConfig);
};

onMounted(() => {
  mediaConfig.height = refVideoCon.value?.clientHeight;
  mediaConfig.width = refVideoCon.value?.clientWidth;
  window.onresize = () => {
    mediaConfig.height = refVideoCon.value?.clientHeight;
    mediaConfig.width = refVideoCon.value?.clientWidth;
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
      .ControlBox {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 10;
        .size(100%, 100px);
        transition: bottom 0.36s ease-in-out;
      }
    }

    .switchIcon {
      .size(36px,80px);
      border-radius: 6px 0px 0px 6px;
      // background-color: rgba(255, 255, 255, 0.06);
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 9;
      transition: right 0.36s ease-in-out;
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    .rightCon {
      .size(400px,100%);
      flex-shrink: 0;
      background-color: #18191b;
      z-index: 10;
      opacity: 1;
      transition: width 0.2s ease-in-out, opacity 0.76s ease-in-out;
    }
    .leftCon.playLeftCon {
      .ControlBox {
        bottom: -100px;
      }
      .switchIcon {
        right: -36px;
      }
    }
    .leftCon.playLeftCon:hover {
      .ControlBox {
        bottom: 0px;
      }
      .switchIcon {
        right: 0px;
      }
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
