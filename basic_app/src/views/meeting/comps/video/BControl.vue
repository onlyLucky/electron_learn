<!--
 * @Author: fg
 * @Date: 2023-02-28 10:30:12
 * @LastEditors: fg
 * @LastEditTime: 2023-04-26 16:22:24
 * @Description: content
-->
<template>
  <div class="Control">
    <div class="controlTop f-row-c-c">
      <span class="ctrlTime ctrlStart">{{
        mediaData.currentTimeTxt || "00:00"
      }}</span>
      <Slider
        :model-value="mediaData.progress"
        class="cenSlider"
        show-tip="never"
        backgroundColor="#e9e9e9"
        block-size="40"
        block-color="#ffffff"
        @on-change="onSliderChange"
      >
      </Slider>
      <span class="ctrlTime ctrlEnd">{{
        mediaData.durationTxt || "00:00"
      }}</span>
    </div>
    <div class="controlBottom f-row-b-c">
      <div class="ctrlBLeft f-row-c-c">
        <!-- v-show="!(!mediaData.isAudioCanPlay || !mediaData.isVideoCanPlay)" -->
        <div class="f-row-c-c" v-show="computedMediaCtl">
          <div
            class="ctrlIcon f-row-c-c"
            v-debounce="onMediaCtrlTap"
            v-show="!mediaData.playing"
          >
            <svg-icon
              iconName="icon-zanting"
              className="optItem"
              size="28"
              color="var(--bg)"
            ></svg-icon>
          </div>
          <div
            class="ctrlIcon f-row-c-c"
            v-debounce="onMediaCtrlTap"
            v-show="mediaData.playing"
          >
            <svg-icon
              iconName="icon-zanting1"
              className="optItem"
              size="28"
              color="var(--bg)"
            ></svg-icon>
          </div>
        </div>
        <!-- v-show="!mediaData.isAudioCanPlay || !mediaData.isVideoCanPlay" -->
        <div class="ctrlIcon f-row-c-c" v-show="!computedMediaCtl">
          <svg-icon
            iconName="icon-jiazaizhong"
            className="ctrlItem iconLoading"
            size="28"
            color="var(--bg)"
          ></svg-icon>
        </div>

        <div class="ctrlIcon f-row-c-c" v-debounce="onRefresh">
          <Tooltip content="刷新">
            <svg-icon
              iconName="icon-reset"
              className="optItem"
              size="28"
              color="var(--bg)"
            ></svg-icon>
          </Tooltip>
        </div>
        <!-- {{ !mediaData.isVideoCanPlay }} -->
        <div class="voiceCon f-row-c-c">
          <div class="ctrlIcon f-row-c-c">
            <svg-icon
              :iconName="
                voiceNum <= 0 ? 'icon-shengyinguanbi' : 'icon-shengyin'
              "
              className="optItem"
              size="28"
              color="var(--bg)"
            ></svg-icon>
          </div>
          <div class="voiceBox f-row-c-c">
            <Slider
              :model-value="voiceNum"
              class="voiceSlider"
              backgroundColor="#fff"
              block-size="40"
              block-color="pink"
              @on-change="onVoiceChange"
            >
            </Slider>
          </div>
        </div>
      </div>
      <div class="ctrlBRight f-row-c-c">
        <!-- <div class="ctrlIcon f-row-c-c">
          <span>倍速</span>
        </div> -->
        <div
          :class="['ctrlIcon', 'f-row-c-c', isShowCaption ? 'active' : '']"
          v-debounce="onCaptionTap"
        >
          <Tooltip content="字幕">
            <svg-icon
              iconName="icon-zimu"
              className="optItem"
              size="28"
              :color="isShowCaption ? 'var(--f_color_active)' : 'var(--bg)'"
            ></svg-icon>
          </Tooltip>
        </div>
        <div
          class="ctrlIcon f-row-c-c"
          v-show="!smallSizeFlag"
          @click="onScreenChange(true)"
        >
          <Tooltip content="全屏">
            <svg-icon
              iconName="icon-quanping"
              className="optItem"
              size="26"
              color="var(--bg)"
            ></svg-icon>
          </Tooltip>
        </div>
        <div
          class="ctrlIcon f-row-c-c"
          v-show="smallSizeFlag"
          @click="onScreenChange(false)"
        >
          <Tooltip content="退出全屏">
            <svg-icon
              iconName="icon-suoxiaotuichuquanpingshouhui"
              className="optItem"
              size="26"
              color="var(--bg)"
            ></svg-icon>
          </Tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from "electron";
import { TypeVideoConfig } from "./hooks/useVideo";
let props = withDefaults(
  defineProps<{
    mediaData: TypeVideoConfig;
    files: any[];
  }>(),
  {
    mediaData: () => {
      return {
        progress: 0,
        current: 0,
        playing: false,
        voiceNum: 0,
        SpeedNum: 1,
        isVideoCanPlay: false,
        isAudioCanPlay: false,
        duration: 0,
        currentTime: 0,
        durationTxt: "",
        currentTimeTxt: "",
      };
    },
    files: () => [],
  }
);
let emit = defineEmits<{
  (e: "onMediaChange"): void;
  (e: "onSeek", progress: number): void;
  (e: "onVoice", num: number): void;
  (e: "onRefresh"): void;
}>();
const onMediaCtrlTap = () => {
  emit("onMediaChange");
};
const onSliderChange = (val: number) => {
  emit("onSeek", val);
};
// 更改全屏
let smallSizeFlag = ref<boolean>(false);
const onScreenChange = (flag: boolean) => {
  smallSizeFlag.value = flag;
  ipcRenderer.send("win_full", flag);
  // ipcRenderer.send("window_max");
};
/* ipcRenderer.on("window_max_status", (event, status) => {
  smallSizeFlag.value = status;
}); */
let voiceNum = ref<number>(0);
watch(
  () => props.mediaData.voiceNum,
  (val) => {
    voiceNum.value = val * 100;
  }
);
// 计算媒体控制
const computedMediaCtl = computed(() => {
  // true ctrl  false loading
  console.log("computedMediaCtl:", props.files.length, props.mediaData);
  if (props.files.length <= 0) {
    return false;
  }
  if (
    props.files[props.mediaData.current].videoSrc &&
    props.files[props.mediaData.current].audioSrc
  ) {
    return !(
      !props.mediaData.isAudioCanPlay || !props.mediaData.isVideoCanPlay
    );
  } else {
    if (
      !props.files[props.mediaData.current].videoSrc &&
      !props.files[props.mediaData.current].audioSrc
    ) {
      return false;
    } else {
      if (!props.files[props.mediaData.current].videoSrc) {
        return false;
      } else {
        return props.mediaData.isVideoCanPlay;
      }
    }
  }
  // return true;
});
// 音量更改
const onVoiceChange = (val: number) => {
  voiceNum.value = val;
  console.log("onVoice", val);
  emit("onVoice", val);
};

// 字幕更改
const isShowCaption = ref<boolean>(false);
const onCaptionTap = () => {
  isShowCaption.value = !isShowCaption.value;
};

const onRefresh = () => {
  emit("onRefresh");
};
// 导出数据
defineExpose({
  smallSizeFlag,
  isShowCaption,
});
</script>
<style scoped lang="less">
:deep(.voiceBox) {
  .ivu-slider-button {
    border: none;
  }
  .ivu-slider-bar {
    background: @bg;
  }
  .ivu-slider-wrap {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
:deep(.ivu-slider-wrap) {
  .ivu-slider-button-wrap {
    .size(18px,18px);
    top: -6px;
    .ivu-tooltip {
      .size(18px,18px);
      display: flex;
      align-items: center;
      justify-content: center;
      .ivu-tooltip-rel {
        .size(18px,18px);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.Control {
  .size(100%,100%);
  background-color: rgba(0, 0, 0, 0.9);
  padding: 10px;
  box-sizing: border-box;
  .controlTop {
    .size(100%,auto);
    // background-color: pink;
    .ctrlTime {
      text-align: center;
      .size(80px, 100%);
      flex-shrink: 0;
      .fontSizePx2Em(14);
      color: @bg;
    }
    .cenSlider {
      width: 100%;
    }
  }
  .controlBottom {
    .size(100%,40px);
    box-sizing: border-box;
    padding: 0 10px;
    box-sizing: border-box;
    .ctrlIcon {
      .size(40px,40px);
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: rgba(50, 50, 50, 0.3);
      }
      span {
        color: @bg;
        .fontSizePx2Em(14);
      }
    }
    .ctrlIcon.active {
      background-color: rgba(50, 50, 50, 0.3);
    }
    .voiceBox {
      .size(130px, 30px);
      padding: 0 20px 0 10px;
      box-sizing: border-box;
      display: none;
      .voiceSlider {
        width: 100%;
      }
    }
    .voiceCon {
      &:hover {
        .voiceBox {
          display: flex;
        }
      }
    }

    .ctrlBLeft {
      .voiceCon {
        .ctrlIcon {
          margin-right: 0px;
        }
      }
    }
    .ctrlBRight {
      .ctrlIcon {
        margin-left: 10px;
      }
    }
    .ctrlBLeft {
      .ctrlIcon {
        margin-right: 10px;
      }
    }
  }
}
</style>
