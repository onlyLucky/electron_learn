<!--
 * @Author: fg
 * @Date: 2023-02-10 09:33:29
 * @LastEditors: fg
 * @LastEditTime: 2023-02-10 17:58:09
 * @Description: 音频组件
-->
<template>
  <div class="AudioBox">
    <audio
      ref="refAudio"
      controls
      :src="audioInfo.src"
      @timeupdate="onPlayChange"
      @canplay="onCanPlay"
    ></audio>
    <Button @click="handlePlay">play</Button>
    <Button @click="handleCurrent">current</Button>
  </div>
</template>
<script setup lang="ts">
let props = withDefaults(
  defineProps<{
    src: string[];
  }>(),
  {
    src: () => [],
  }
);

let emit = defineEmits<{
  (e: "info", info: AudioInfoType): void;
  (e: "change", info: AudioInfoType): void;
}>();

type AudioInfoType = {
  src: string;
  duration: number;
  durationTxt: string;
  currentTime: number;
  currentTimeTxt: string;
  progress: number;
};
let current = ref<number>(0); //当前第几个
let AudioList = reactive<AudioInfoType[]>([]);
const refAudio = ref<HTMLAudioElement>();
let audioInfo = reactive<AudioInfoType>({
  src: "",
  durationTxt: "",
  duration: 0,
  currentTime: 0,
  currentTimeTxt: "",
  progress: 0,
});

const init = () => {
  props.src.map((item) => {
    AudioList.push({
      src: item,
      durationTxt: "",
      duration: 0,
      currentTime: 0,
      currentTimeTxt: "",
      progress: 0,
    });
  });
  audioInfo.src = props.src[0];
};

const handlePlay = () => {
  if (refAudio.value?.paused) {
    refAudio.value?.play();
    return true;
  } else {
    refAudio.value?.pause();
    return false;
  }
};
const handleCurrent = () => {
  refAudio.value!.currentTime = 20;
};

/**
 * @description:获取赋值 duration
 * @return {*}
 */
const onCanPlay = () => {
  audioInfo.duration = refAudio.value?.duration!;
  AudioList[current.value].duration = audioInfo.duration;
  let tempTxt = computedTime(audioInfo.duration);
  audioInfo.durationTxt = tempTxt;
  AudioList[current.value].durationTxt = tempTxt;
};

/**
 * @description: 监听timeupdate事件触发
 * @param {*} e 事件对象
 * @return {*}
 */
const onPlayChange = (e: Event) => {
  audioInfo.currentTime = (e.target as HTMLAudioElement).currentTime;
  emit("change", audioInfo);
};

const computedTime = (seconds: number): string => {
  let min =
    Math.trunc(seconds / 60) > 10
      ? Math.trunc(seconds / 60)
      : "0" + Math.trunc(seconds / 60);
  let sec =
    Math.trunc(seconds % 60) > 10
      ? Math.trunc(seconds % 60)
      : "0" + Math.trunc(seconds % 60);
  return `${min}:${sec}`;
};

// 监听同步数据
watch(
  () => audioInfo.currentTime,
  (n) => {
    console.log("123--");
    let tempTxt = computedTime(audioInfo.currentTime);
    audioInfo.progress = (audioInfo.currentTime / audioInfo.duration) * 100;
    audioInfo.currentTimeTxt = tempTxt;
    AudioList[current.value].currentTimeTxt = tempTxt;
    AudioList[current.value].progress = audioInfo.progress;
    AudioList[current.value].currentTime = audioInfo.currentTime;
  },
  { deep: true }
);

// 跳转指定播放
const seek = (progress: number) => {
  audioInfo.currentTime = (progress / 100) * audioInfo.duration;
  refAudio.value!.currentTime = audioInfo.currentTime;
  if (refAudio.value?.paused) {
    refAudio.value.play();
  }
};
// 下一首
// 上一首

onMounted(() => {
  init();
});

defineExpose({
  seek,
});
</script>
<style scoped lang="less">
.AudioBox {
  position: fixed;
  top: 0;
  left: 0;
  audio {
    opacity: 1;
  }
}
</style>
