<!--
 * @Author: fg
 * @Date: 2023-02-27 16:50:04
 * @LastEditors: fg
 * @LastEditTime: 2023-04-10 15:46:35
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
            :files="refVideoComp?.fileList"
            @onSeek="onSeek"
            @onMediaChange="onMediaChange"
            @onVoice="onVoice"
            @onRefresh="onRefresh"
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
        <!-- :files="refVideoComp?.fileList"
          :current="refVideoComp?.current" -->
        <Caption
          ref="refCaption"
          :show="refBControl?.isShowCaption"
          :time="refVideoComp?.canvasConfig.currentTime"
          :stt="computedStt"
        ></Caption>
        <div class="loadMsg" v-show="loadMsg.length > 0">
          <div class="msgItem" v-for="(item, index) in loadMsg" :key="index">
            {{ item.msg }}
          </div>
        </div>
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
          @onUseChange="onUseChange"
          @onAnalectaChange="onAnalectaChange"
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

const {
  downloadUse,
  handleDownload,
  isExistMeetFileAsync,
  handleDownloadAsync,
  doDownloadAsync,
} = useDownload(queryParams.id, queryParams.name || "") as any;

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
    refCaption.value?.handlePosition();
  }, 200);
};

/* watch(
  () => downloadUse.isNeedDownload,
  (val) => {
    console.log("upload: " + val);
    if (val) handleDownload();
  }
); */
const refVideoCon = ref<HTMLElement>();

const refVideoComp = ref<InstanceType<typeof VideoComp>>();

const refBControl = ref<InstanceType<typeof BControl>>();

const refCaption = ref<InstanceType<typeof Caption>>();

const onMediaChange = () => {
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

// 计算字幕文件路径
const computedStt = computed(() => {
  if (refVideoComp.value?.fileList && refVideoComp.value!.fileList.length > 0) {
    return refVideoComp.value?.fileList[refVideoComp.value.videoConfig.current]
      .stt;
  } else {
    return "";
  }
});

// 音量更改
const onVoice = (val: number) => {
  refVideoComp.value?.onVoiceChange(val / 100);
};

// 用户数据更改
const onUseChange = (list: any[]) => {
  refVideoComp.value?.userDataChange(list, refVideoComp.value?.videoConfig);
};

// 选集数据修改
const onAnalectaChange = (index: number) => {
  refVideoComp.value?.uploadCurrent(index);
};

// 页面刷新
const onRefresh = () => {
  if (refVideoComp.value?.videoConfig.playing) {
    refVideoComp.value?.onMediaCtrl();
  }
  onLoadHandle();
};

// 页面加载处理
let loadMsg = ref<any[]>([
  {
    type: 0, // 0 普通  1 可操作  2 报错
    msg: "播放器初始化中...",
  },
]);

// 检测是否允许后面代码继续处理
let errorFlag = ref<boolean>(false);
const onLoadHandle = async () => {
  // 文件检测
  handleLoadMsg({
    type: 0,
    msg: "本地文件开始检测...",
  });
  const resHandle1 = await isExistMeetFileAsync().catch((e: any) => {
    errorFlag.value = true;
    handleLoadMsg({
      type: 2,
      msg: "本地文件检测失败",
    });
  });
  if (resHandle1 && !errorFlag.value) {
    if (resHandle1.isNeedDownload) {
      handleLoadMsg({
        type: 0,
        msg: "正在获取云端文件数据...",
      });
      const resHandle2 = await doDownloadAsync().catch((e: any) => {
        errorFlag.value = true;
        handleLoadMsg({
          type: 2,
          msg: "获取云端文件数据失败",
        });
      });
      if (resHandle2 && !errorFlag.value) {
        handleLoadMsg({
          type: 0,
          msg: "正在进行文件下载...",
        });
        //下载处理
        const resHandle3 = await handleDownloadAsync().catch((e: any) => {
          errorFlag.value = true;
          handleLoadMsg({
            type: 2,
            msg: "云端文件下载操作失败",
          });
        });
      }
    } else {
      handleLoadMsg({
        type: 0,
        msg: "文件加载中...",
      });
    }
  }
  // 文件解析
  if (!errorFlag.value) {
    handleLoadMsg({
      type: 0,
      msg: "本地文件数据读取中...",
    });
    refVideoComp.value?.uploadFileData();
    handleLoadMsg({
      type: 0,
      msg: "本地批注文件数据解析中...",
    });
    const resHandle4 = await refVideoComp.value?.parseFile().catch((err) => {
      handleLoadMsg({
        type: 2,
        msg: "本地批注文件数据解析失败",
      });
    });

    if (resHandle4) {
      handleLoadMsg({
        type: 0,
        msg: "本地字幕文件数据解析中...",
      });
      try {
        refCaption.value?.readStt();
      } catch (error) {
        handleLoadMsg({
          type: 2,
          msg: "本地字幕文件数据解析失败",
        });
      }
      handleLoadMsg({
        type: 0,
        msg: "本地字幕文件数据解析成功",
      });
    }
    setTimeout(() => {
      loadMsg.value = [];
    }, 2000);
  }
};
const handleLoadMsg = (data: any) => {
  setTimeout(() => {
    let temp = loadMsg.value;
    temp.push(data);
    loadMsg.value = temp;
  }, 200);
};

onMounted(() => {
  console.log("basic onMounted");
  onLoadHandle();
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
  .loadMsg {
    .size(auto, auto);
    padding: 20px 10px;
    padding-bottom: 4px;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    bottom: 100px;
    left: 0px;
    z-index: 10;
    .msgItem {
      font-size: 14px;
      color: #fff;
      opacity: 0.8;
      margin-bottom: 2px;
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
