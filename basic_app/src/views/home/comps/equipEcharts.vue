<!--
 * @Author: fg
 * @Date: 2023-03-31 16:57:19
 * @LastEditors: fg
 * @LastEditTime: 2023-04-04 13:54:50
 * @Description: 设备echarts
-->
<template>
  <div class="Echarts" ref="refEquipEcharts"></div>
</template>
<script setup lang="ts">
import { getDeviceChart } from "@/apis/home";
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
const refEquipEcharts = ref<any>("");
type EChartsOption = echarts.EChartsOption;
// 基于准备好的dom，初始化echarts实例
let myChart: any;
type TypeData = {
  name: string;
  value: any;
};
let echartsData = ref<TypeData[]>([
  { value: 1048, name: "Search Engine" },
  { value: 735, name: "Direct" },
  { value: 580, name: "Email" },
  { value: 484, name: "Union Ads" },
  { value: 0, name: "Video Ads" },
]);
const init = () => {
  myChart = echarts.init(refEquipEcharts.value);
  let option: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      type: "scroll",
      bottom: "0px",
      left: "center",
    },
    series: [
      {
        name: "使用次数",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: "var(--home_num_t)",
          },
        },
        labelLine: {
          show: false,
        },
        data: echartsData.value,
      },
    ],
    textStyle: {
      fontFamily: "HarmonyOS_Sans",
    },
  };
  myChart.setOption(option);
};
const onResize = () => {
  myChart.resize();
};
const getData = () => {
  getDeviceChart({ type: props.type }).then((res) => {
    console.log(res);
    echartsData.value = res.data;
    init();
    onResize();
  });
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
