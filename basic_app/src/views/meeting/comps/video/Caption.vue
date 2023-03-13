<!--
 * @Author: fg
 * @Date: 2023-03-09 17:20:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-13 15:57:54
 * @Description: 字幕文件
-->
<template>
  <!-- noMove -->
  <div
    :class="['Caption', moveFlag ? 'canMove' : 'noMove']"
    ref="refCaption"
    v-move="moveFlag"
    v-show="show && captionConfig.subtitleTxt != ''"
  >
    <p>{{ captionConfig.subtitleTxt }}</p>
  </div>
</template>
<script setup lang="ts">
import { Message } from "view-ui-plus";
const fs = require("fs");

let props = withDefaults(
  defineProps<{
    show: boolean;
    time: number;
    stt: string;
    download: boolean;
  }>(),
  {
    show: false,
    time: 0,
    stt: "",
    download: false,
  }
);
type CaptionType = {
  list: any[]; //字幕数据列表
  curIndex: number; //当前第几个字幕
  subtitleTxt: string; //字幕展示文字
  subtitleIndex: number; //当前处于哪个时间段
  curTimeArr: any[]; //当前字幕文件时间点数组
};
let captionConfig = reactive<CaptionType>({
  list: [],
  curIndex: 0,
  subtitleTxt: "",
  subtitleIndex: -1,
  curTimeArr: [],
});
let moveFlag = ref<boolean>(true);
let refCaption = ref<HTMLDivElement>();
const handlePosition = () => {
  if (moveFlag.value) {
    let left =
      (refCaption.value!.parentElement!.clientWidth -
        refCaption.value!.clientWidth) /
        2 +
      "px";
    let top =
      refCaption.value!.parentElement!.clientHeight -
      refCaption.value!.clientHeight -
      160 +
      "px";
    refCaption.value!.style.left = left;
    refCaption.value!.style.top = top;
  }
};

// 初始化（下一首）
const initData = () => {
  let temp = {
    curIndex: 0,
    subtitleTxt: "",
    subtitleIndex: -1,
  };
  Object.assign(captionConfig, temp);
};

const readStt = () => {
  if (props.stt != "") {
    let temp = "";
    try {
      temp = fs.readFileSync(props.stt, "utf-8");
    } catch (error) {
      Message.error("字幕文件解析失败");
      return false;
    }
    captionConfig.list = JSON.parse(temp);
    let tempTimeArr: number[] = [];
    captionConfig.list.map((item) => {
      tempTimeArr.push(item.bgTime);
    });
    captionConfig.curTimeArr = tempTimeArr;
    handleCurrentStt();
  }
};

const getTimeIndex = (timeArr: number[], time: number) => {
  let timeIndex: number = -1;
  if (timeArr.length > 0) {
    if (time >= timeArr[timeArr.length - 1]) {
      return timeArr.length - 1;
    }
    // console.log(timeArr,time)
    for (let index in timeArr) {
      if (Number(timeArr[index]) >= time) {
        timeIndex = Number(index);
        break;
      }
    }
  }

  return timeIndex;
};

const handleCurrentStt = () => {
  let index = getTimeIndex(captionConfig.curTimeArr, props.time);
  captionConfig.curIndex = index;
  /* if (captionConfig.list.length <= 0) {
    initData();
    return false;
  } */
  // console.log("props.time:", props.time, captionConfig, index);
  if (index >= 1) {
    captionConfig.subtitleIndex =
      captionConfig.list[index - 1].bgTime <= props.time &&
      captionConfig.list[index - 1].edTime >= props.time
        ? index - 1
        : -1;
    captionConfig.subtitleTxt =
      captionConfig.subtitleIndex != -1
        ? captionConfig.list[index - 1].text
        : "";
  }

  /* console.log(
    props.time,
    index,
    captionConfig.subtitleIndex,
    "captionConfig.subtitleIndex",
    captionConfig.subtitleTxt
  ); */
};

watch(
  () => captionConfig.subtitleTxt,
  async (val) => {
    if (moveFlag.value) {
      await nextTick();
      let left =
        (refCaption.value!.parentElement!.clientWidth -
          refCaption.value!.clientWidth) /
          2 +
        "px";
      refCaption.value!.style.left = left;
    }
  }
);

watch(
  () => props.time,
  (val) => {
    initData();
    handleCurrentStt();
  }
);

watch(
  () => props.download,
  (val) => {
    if (!val) {
      readStt();
    }
  }
);

watch(
  () => props.stt,
  (val) => {
    readStt();
  }
);

onMounted(() => {
  console.log(refCaption.value?.parentElement);
  handlePosition();
  readStt();
  window.onresize = () => {
    handlePosition();
  };
});
defineExpose({
  handlePosition,
});
</script>
<style scoped lang="less">
.Caption {
  position: absolute;
  left: 0;
  p {
    display: inline-block;
    text-align: center;
    padding: 6px 12px;
    font-size: 16px;
    color: @bg;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.Caption.noMove {
  .size(100%,auto);
  padding: 0 20px;
  box-sizing: border-box;
  bottom: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Caption.canMove {
  .size(auto,auto);
  cursor: move;
}
</style>
