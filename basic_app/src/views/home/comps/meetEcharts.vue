<!--
 * @Author: fg
 * @Date: 2023-03-31 16:57:19
 * @LastEditors: fg
 * @LastEditTime: 2023-04-11 14:47:04
 * @Description: 会议echarts
-->
<template>
  <div class="Echarts" ref="refMeetEcharts"></div>
</template>
<script setup lang="ts">
import { getMeetChart } from "@/apis/home";
//  按需引入 echarts
import * as echarts from "echarts";
import { useTools } from "@/hooks/useTools";

const { useDateGetDay, doHandleMonth } = useTools();
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
type TypeOption = {
  data: any[];
  xData: any[];
  nameArr: any[];
};
let optionData = reactive<TypeOption>({
  data: [
    [140, 232, 101, 264, 90, 340, 250],
    [120, 282, 111, 234, 220, 340, 310],
    [320, 132, 201, 334, 190, 130, 220],
    [220, 402, 231, 134, 190, 230, 120],
    [220, 302, 181, 234, 500, 290, 150],
  ],
  xData: ["1", "2", "3", "4", "5", "6", "7"],
  nameArr: ["设备 1", "设备 2", "设备 3", "设备 4", "设备 5"],
});
const init = () => {
  myChart = echarts.init(refMeetEcharts.value);
  let tempAreaColor = [
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: "rgb(128, 255, 165)",
      },
      {
        offset: 1,
        color: "rgb(1, 191, 236)",
      },
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: "rgb(0, 221, 255)",
      },
      {
        offset: 1,
        color: "rgb(77, 119, 255)",
      },
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: "rgb(55, 162, 255)",
      },
      {
        offset: 1,
        color: "rgb(116, 21, 219)",
      },
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: "rgb(255, 0, 135)",
      },
      {
        offset: 1,
        color: "rgb(135, 0, 157)",
      },
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: "rgb(255, 191, 0)",
      },
      {
        offset: 1,
        color: "rgb(224, 62, 76)",
      },
    ]),
  ];
  let option: EChartsOption = {
    color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
    textStyle: {
      fontFamily: "HarmonyOS_Sans",
    },
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
      data: optionData.nameArr,
      textStyle: {
        fontSize: "14px",
        color: "#666",
      },
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
        data: optionData.xData,
        axisLabel: {
          formatter: (value, index) => {
            // 每逢索引 8 的倍数显示（规则可自定义，在所有轴类型中有效）
            // 此处返回要显示的文本
            if (optionData.xData.length <= 10) {
              return value;
            } else {
              return index % 2 == 0 ? value : "";
            }
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [],
  };
  let tempSeries: echarts.SeriesOption[] = [];
  optionData.nameArr.map((item, index) => {
    tempSeries.push({
      name: item,
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: tempAreaColor[index % tempAreaColor.length],
      },
      emphasis: {
        focus: "series",
      },
      data: optionData.data[index],
    });
  });
  option.series = tempSeries;
  myChart.setOption(option);
};
const onResize = () => {
  myChart.resize();
};
const getData = () => {
  getMeetChart({ type: props.type })
    .then((res) => {
      handleTypeXData();
      let tempName: any[] = [];
      let tempData: any[] = [];
      res.data.map((item: any) => {
        tempData.push(item.value);
        tempName.push(item.name);
      });
      optionData.nameArr = tempName;
      optionData.data = tempData;
      init();
      onResize();
    })
    .catch((err) => {
      init();
      onResize();
    });
};
const handleTypeXData = () => {
  console.log(useDateGetDay(-7), "useDateGetDay(-7)");
  let temp = [];
  if (props.type == 1) {
    for (let i = 0; i < 7; i++) {
      temp.push(useDateGetDay(-i));
    }
  }
  if (props.type == 2) {
    for (let i = 0; i < 30; i++) {
      temp.push(useDateGetDay(-i));
    }
  }
  if (props.type == 3) {
    let y = new Date().getFullYear();
    let m = new Date().getMonth() + 1;
    for (let i = 0; i < 12; i++) {
      temp.push(
        `${m - i <= 0 ? y - 1 : y}/${doHandleMonth(
          m - i <= 0 ? 12 + (m - i) : m - i
        )}`
      );
    }
  }
  optionData.xData = temp;
};
watch(
  () => props.type,
  (n) => {
    getData();
  }
);
onMounted(() => {
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
