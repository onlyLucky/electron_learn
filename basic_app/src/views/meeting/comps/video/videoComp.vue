<!--
 * @Author: fg
 * @Date: 2023-03-03 11:13:32
 * @LastEditors: fg
 * @LastEditTime: 2023-03-13 15:17:42
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
      :src="fileList[videoConfig.current].videoSrc"
      :poster="fileList[videoConfig.current].videoBg"
      @timeupdate="onVideoChange"
      @canplay="onCanPlay"
      @ended="onPlayEnd"
    >
      <!-- <source :src="fileList[current].videoSrc" type="video/mp4" /> -->
    </video>
    <!-- :src="audioInfo.src"
      @timeupdate="onPlayChange"
      @canplay="onCanPlay"
      @ended="onEnded" -->
    <audio
      controls
      ref="refAudio"
      :src="fileList[videoConfig.current].audioSrc"
      @canplay="onAudioCanPlay"
    ></audio>
    <canvas id="canvas" width="200" height="200" ref="refCanvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { useFile } from "./hooks/useFile";
import { useVideo, TypeVideoConfig } from "./hooks/useVideo";
import { useCanvas } from "./hooks/useCanvas";

const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
const props = withDefaults(
  defineProps<{ width: number; height: number; download: boolean }>(),
  {
    width: 1100,
    height: 652,
    download: false,
  }
);
let mediaConfig = reactive<any>({
  videoBg:
    "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAOEiEk.img",
  src: "https://prod-streaming-video-msn-com.akamaized.net/9752d732-2354-483f-a678-a6d0cd2c22b7/1a5ed13a-43f5-4e85-95c8-6579065c4d7c.mp4",
  audioSrc:
    "https://m801.music.126.net/20230210095355/6a44ab660525af0af6f395ac8a8532f8/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096426578/ff65/7348/d83f/36ab528a5935b3ee552768bd939af6cf.mp3",
});

const { fileList, handleFolder } = useFile(
  queryParams.name || "",
  queryParams.id
);
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
watch(
  () => props.width,
  (val) => {
    computedCanvasSize();
  }
);
watch(
  () => props.download,
  (val) => {
    if (!val) {
      handleFolder();
      parseXmlFile(fileList.value[videoConfig.current].xml);
    }
  }
);
watch(
  () => props.height,
  (val) => {
    computedCanvasSize();
  }
);
const {
  parseXmlFile,
  userList,
  uploadCtx,
  canvasConfig,
  startPath,
  pausePath,
  seekToCanvas,
  onPathEnd,
  userDataChange,
  handleCtxPlay,
} = useCanvas();
parseXmlFile(fileList.value[videoConfig.current].xml);
let refCanvas = ref<HTMLCanvasElement>();
watch(refCanvas, (val) => {
  if (val) {
    uploadCtx(refCanvas.value as HTMLCanvasElement);
  }
});

const onVideoChange = (e: Event) => {
  let cTime = (e.target as HTMLVideoElement).currentTime;
  uploadCurrentTime(cTime);
};
let ratio = ref<number>(1); //视频比例
const onCanPlay = (e: Event) => {
  console.log("canplay");
  onVideoCanPlay(e);
  ratio.value = Number(
    (refPlayer.value!.videoWidth / refPlayer.value!.videoHeight).toFixed(3)
  );

  computedCanvasSize();
};
// 处理canvas比例计算
const computedCanvasSize = () => {
  // video ref 的宽高比例
  let videoDomRatio = props.width / props.height;
  if (videoDomRatio >= ratio.value) {
    refCanvas.value!.height = props.height;
    refCanvas.value!.width = props.height * ratio.value;
  } else {
    refCanvas.value!.width = props.width;
    refCanvas.value!.height = props.width / ratio.value;
  }
  canvasConfig.width = refCanvas.value!.width;
  canvasConfig.height = refCanvas.value!.height;
  canvasConfig.ratio = refCanvas.value!.width / refPlayer.value!.videoWidth;
  handleCtxPlay(videoConfig);
};
// 结束
const onPlayEnd = () => {
  onEnd();
  onPathEnd();
};

const onVoiceChange = (val: number) => {
  videoConfig.voiceNum = val;
  refAudio.value!.volume = val;
};

watch(
  () => videoConfig.current,
  (val) => {
    // 暂停批注
    onPathEnd();
    // 更新批注文件
    parseXmlFile(fileList.value[videoConfig.current].xml);
    // 修改为异步调用，音频视频监听过canplay之后才能调用播放
    setTimeout(() => {
      // 播放设置
      refPlayer.value?.play();
      refAudio.value?.play();
      videoConfig.playing = true;
      // 播放数据
      handleCtxPlay(videoConfig);
    });
  }
);

defineExpose({
  videoConfig,
  canvasConfig,
  fileList,
  userList,
  getDate,
  onMediaCtrl,
  seekTo,
  startPath,
  pausePath,
  seekToCanvas,
  onVoiceChange,
  userDataChange,
  uploadCurrent,
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
  #canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
