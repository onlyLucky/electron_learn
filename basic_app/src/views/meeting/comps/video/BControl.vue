<!--
 * @Author: fg
 * @Date: 2023-02-28 10:30:12
 * @LastEditors: fg
 * @LastEditTime: 2023-03-10 13:51:11
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
        <div
          class="f-row-c-c"
          v-show="!(!mediaData.isAudioCanPlay || !mediaData.isVideoCanPlay)"
        >
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
        <div
          class="ctrlIcon f-row-c-c"
          v-show="!mediaData.isAudioCanPlay || !mediaData.isVideoCanPlay"
        >
          <svg-icon
            iconName="icon-jiazaizhong"
            className="ctrlItem iconLoading"
            size="28"
            color="var(--bg)"
          ></svg-icon>
        </div>

        <div class="ctrlIcon f-row-c-c">
          <Tooltip content="刷新">
            <svg-icon
              iconName="icon-reset"
              className="optItem"
              size="28"
              color="var(--bg)"
            ></svg-icon>
          </Tooltip>
        </div>
        <div class="voiceCon f-row-c-c">
          <div class="ctrlIcon f-row-c-c">
            <svg-icon
              iconName="icon-shengyin"
              className="optItem"
              size="28"
              color="var(--bg)"
            ></svg-icon>
          </div>
          <div class="voiceBox f-row-c-c">
            <Slider
              :model-value="40"
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
  }>(),
  {
    mediaData: () => {
      return {
        progress: 0,
        current: 0,
        playing: false,
        voiceNum: 0.5,
        SpeedNum: 1,
        isVideoCanPlay: false,
        isAudioCanPlay: false,
        duration: 0,
        currentTime: 0,
        durationTxt: "",
        currentTimeTxt: "",
      };
    },
  }
);
let emit = defineEmits<{
  (e: "onMediaChange"): void;
  (e: "onSeek", progress: number): void;
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
// 音量更改
const onVoiceChange: any = () => {};

// 字幕更改
const isShowCaption = ref<boolean>(false);
const onCaptionTap = () => {
  isShowCaption.value = !isShowCaption.value;
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
.Control {
  .size(100%,100%);
  background-color: rgba(0, 0, 0, 0.9);
  padding: 10px;
  box-sizing: border-box;
  h1 {
    font-size: 30px;
  }
  .controlTop {
    .size(100%,auto);
    // background-color: pink;
    .ctrlTime {
      text-align: center;
      .size(80px, 100%);
      flex-shrink: 0;
      font-size: 14px;
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
        font-size: 14px;
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
