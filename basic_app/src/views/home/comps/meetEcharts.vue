<!--
 * @Author: fg
 * @Date: 2023-03-31 16:57:19
 * @LastEditors: fg
 * @LastEditTime: 2023-04-03 18:01:23
 * @Description: 会议echarts
-->
<template>
  <div class="Echarts" ref="refMeetEcharts"></div>
</template>
<script setup lang="ts">
import { getMeetChart } from "@/apis/home";
//  按需引入 echarts
import * as echarts from "echarts";

let props = withDefaults(
  defineProps<{
    type: 1 | 2 | 3;
  }>(),
  {
    type: 1,
  }
);
// refEcharts
const refMeetEcharts = ref<any>("");
type EChartsOption = echarts.EChartsOption;
// 基于准备好的dom，初始化echarts实例
let myChart: any;
const init = () => {
  myChart = echarts.init(refMeetEcharts.value);
  let option: EChartsOption = {
    color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
    title: {},
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      type: "scroll",
      data: [
        "Line 1",
        "Line 2",
        "Line 3",
        "Line 4",
        "Line 5",
        "Line 6",
        "Line 7",
        "Line 8",
      ],
    },
    toolbox: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["3/1", "3/2", "3/3", "3/4", "3/5", "3/6", "3/7"],
        axisLabel: {
          formatter: (value, index) => {
            // 每逢索引 8 的倍数显示（规则可自定义，在所有轴类型中有效）
            // 此处返回要显示的文本
            return index % 3 == 0 ? value : "";
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Line 1",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(128, 255, 165)",
            },
            {
              offset: 1,
              color: "rgb(1, 191, 236)",
            },
          ]),
        },
        emphasis: {
          focus: "series",
        },
        data: [140, 232, 101, 264, 90, 340, 250],
      },
      {
        name: "Line 2",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(0, 221, 255)",
            },
            {
              offset: 1,
              color: "rgb(77, 119, 255)",
            },
          ]),
        },
        emphasis: {
          focus: "series",
        },
        data: [120, 282, 111, 234, 220, 340, 310],
      },
      {
        name: "Line 3",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(55, 162, 255)",
            },
            {
              offset: 1,
              color: "rgb(116, 21, 219)",
            },
          ]),
        },
        emphasis: {
          focus: "series",
        },
        data: [320, 132, 201, 334, 190, 130, 220],
      },
      {
        name: "Line 4",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 0, 135)",
            },
            {
              offset: 1,
              color: "rgb(135, 0, 157)",
            },
          ]),
        },
        emphasis: {
          focus: "series",
        },
        data: [220, 402, 231, 134, 190, 230, 120],
      },
      {
        name: "Line 5",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: "top",
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 191, 0)",
            },
            {
              offset: 1,
              color: "rgb(224, 62, 76)",
            },
          ]),
        },
        emphasis: {
          focus: "series",
        },
        data: [220, 302, 181, 234, 500, 290, 150],
      },
    ],
  };
  myChart.setOption(option);
};
const onResize = () => {
  myChart.resize();
};
const getData = () => {
  getMeetChart({ type: props.type }).then((res) => {
    console.log(res);
  });
};
onMounted(() => {
  init();
  getData();
});
defineExpose({
  myChart,
  onResize,
});
</script>
<style scoped lang="less">
.Echarts {
  .size(100%,100%);
  h1 {
    font-size: 30px;
  }
}
</style>
