<!--
 * @Author: fg
 * @Date: 2023-03-03 11:13:32
 * @LastEditors: fg
 * @LastEditTime: 2023-03-06 15:07:03
 * @Description: video audio canvas comp 
-->
<template>
  <div class="mediaBox f-row-c-c">
    <video
      id="player"
      ref="refPlayer"
      :style="{
        width: props.width + 'px',
        height: props.height + 'px',
      }"
      :poster="fileList[current].videoBg"
      @timeupdate="onVideoChange"
      @canplay="onVideoCanPlay"
      @ended="onPlayEnd"
    >
      <source :src="fileList[current].videoSrc" type="video/mp4" />
    </video>
    <!-- :src="audioInfo.src"
      @timeupdate="onPlayChange"
      @canplay="onCanPlay"
      @ended="onEnded" -->
    <audio
      controls
      ref="refAudio"
      :src="fileList[current].audioSrc"
      @canplay="onAudioCanPlay"
    ></audio>
    {{}}
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { useFile } from "./hooks/useFile";
import { useVideo, TypeVideoConfig } from "./hooks/useVideo";

const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
const props = withDefaults(defineProps<{ width: number; height: number }>(), {
  width: 1100,
  height: 652,
});
let mediaConfig = reactive<any>({
  videoBg:
    "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAOEiEk.img",
  src: "https://prod-streaming-video-msn-com.akamaized.net/9752d732-2354-483f-a678-a6d0cd2c22b7/1a5ed13a-43f5-4e85-95c8-6579065c4d7c.mp4",
  audioSrc:
    "https://m801.music.126.net/20230210095355/6a44ab660525af0af6f395ac8a8532f8/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096426578/ff65/7348/d83f/36ab528a5935b3ee552768bd939af6cf.mp3",
});

// 当前播放第几个
let current = ref<number>(0);
const { fileList } = useFile(queryParams.name || "", queryParams.id);
console.log(fileList, "fileList");

const refPlayer = ref<HTMLVideoElement>();
const refAudio = ref<HTMLAudioElement>();
// 媒体设置
const {
  videoConfig,
  getDate,
  uploadDomObj,
  onAudioCanPlay,
  onVideoCanPlay,
  onMediaCtrl,
  uploadCurrentTime,
  onEnd,
  uploadCurrent,
  seekTo,
} = useVideo(queryParams.name || "", queryParams.id);
watch(refPlayer, (val) => {
  if (val) {
    uploadDomObj(true, val);
  }
});
watch(refAudio, (val) => {
  if (val) {
    uploadDomObj(false, val);
  }
});
watch(current, (val) => {});

const onVideoChange = (e: Event) => {
  let cTime = (e.target as HTMLVideoElement).currentTime;
  uploadCurrentTime(cTime);
};
// 结束
const onPlayEnd = () => {
  onEnd();
};

defineExpose({
  videoConfig,
  getDate,
  onMediaCtrl,
  seekTo,
});
</script>
<style scoped lang="less">
.mediaBox {
  .size(100%,100%);
  position: relative;
  h1 {
    font-size: 30px;
  }
  audio {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
</style>