<!--
 * @Author: fg
 * @Date: 2023-03-09 17:20:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-10 15:58:57
 * @Description: 字幕文件
-->
<template>
  <!-- noMove -->
  <div
    class="Caption canMove"
    ref="refCaption"
    v-move="moveFlag"
    :style="moveFlag ? styleObj : {}"
    v-show="show"
  >
    <p>meet List{{ stt }}</p>
  </div>
</template>
<script setup lang="ts">
import { join } from "path";
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
type styleType = {
  top: string;
  left: string;
};
let styleObj = reactive<styleType>({
  top: "0px",
  left: "0px",
});
const handlePosition = () => {
  if (moveFlag.value) {
    setTimeout(() => {
      let left =
        (refCaption.value!.parentElement!.clientWidth -
          refCaption.value!.clientWidth) /
          2 +
        "px";
      let top =
        refCaption.value!.parentElement!.clientHeight -
        refCaption.value!.clientHeight -
        120 +
        "px";
      Object.assign(styleObj, { left, top });
    }, 200);
  }
};

// 初始化（下一首）
const initData = () => {
  let temp = {
    list: [],
    curIndex: 0,
    subtitleTxt: "",
    subtitleIndex: -1,
    curTimeArr: [],
  };
  Object.assign(captionConfig, temp);
};

const readStt = () => {
  if (props.stt != "") {
    fs.readFileSync(props.stt, "utf-8");
  }
};

watch(
  () => props.show,
  (val) => {
    console.log(val, "props.show--");
    if (captionConfig.list.length <= 0) {
      // 读取数据
    }
  }
);

watch(
  () => props.time,
  (val) => {
    console.log(val);
  }
);

watch(
  () => props.download,
  (val) => {
    if (!val) {
    }
  }
);

onMounted(() => {
  console.log(refCaption.value?.parentElement);
  handlePosition();
  window.onresize = () => {
    handlePosition();
  };
});
</script>
<style scoped lang="less">
.Caption {
  position: absolute;
  left: 0;
  background-color: pink;
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
