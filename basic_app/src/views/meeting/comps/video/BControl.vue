<!--
 * @Author: fg
 * @Date: 2023-02-28 10:30:12
 * @LastEditors: fg
 * @LastEditTime: 2023-03-03 18:00:13
 * @Description: content
-->
<template>
  <div class="Control">
    <div class="controlTop f-row-c-c">
      <span class="ctrlTime ctrlStart">12:20:30</span>
      <slider
        :model-value="progress"
        class="cenSlider"
        show-tip="never"
        backgroundColor="#e9e9e9"
        block-size="40"
        block-color="#ffffff"
        @on-change="onSliderChange"
      >
      </slider>
      <span class="ctrlTime ctrlEnd">01:20:30</span>
    </div>
    <div class="controlBottom f-row-b-c">
      <div class="ctrlBLeft f-row-c-c">
        <div class="ctrlIcon f-row-c-c" v-debounce="onMediaCtrlTap">
          <svg-icon
            iconName="icon-zanting"
            className="optItem"
            size="28"
            color="var(--bg)"
          ></svg-icon>
        </div>
        <div class="ctrlIcon f-row-c-c">
          <svg-icon
            iconName="icon-zanting1"
            className="optItem"
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
        <div class="ctrlIcon f-row-c-c">
          <svg-icon
            iconName="icon-shengyin"
            className="optItem"
            size="28"
            color="var(--bg)"
          ></svg-icon>
        </div>
      </div>
      <div class="ctrlBRight f-row-c-c">
        <div class="ctrlIcon f-row-c-c">
          <span>倍速</span>
        </div>
        <div class="ctrlIcon f-row-c-c">
          <Tooltip content="字幕">
            <svg-icon
              iconName="icon-zimu"
              className="optItem"
              size="28"
              color="var(--bg)"
            ></svg-icon>
          </Tooltip>
        </div>
        <div class="ctrlIcon f-row-c-c">
          <Tooltip content="全屏">
            <svg-icon
              iconName="icon-quanping"
              className="optItem"
              size="26"
              color="var(--bg)"
            ></svg-icon>
          </Tooltip>
        </div>
        <div class="ctrlIcon f-row-c-c">
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
import { TypeVideoConfig } from "./hooks/useVideo";
const progress = ref<number>(40);
const onSliderChange = () => {};
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
        ProgressTime: 0,
        isVideoCanPlay: false,
        isAudioCanPlay: false,
        duration: 0,
      };
    },
  }
);
let emit = defineEmits<{
  (e: "onMediaChange"): void;
}>();
const onMediaCtrlTap = () => {
  emit("onMediaChange");
};
</script>
<style scoped lang="less">
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
      &:hover {
        background-color: rgba(50, 50, 50, 0.3);
      }
      span {
        color: @bg;
        font-size: 14px;
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
