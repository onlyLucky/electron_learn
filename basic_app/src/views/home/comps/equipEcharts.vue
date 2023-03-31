<!--
 * @Author: fg
 * @Date: 2023-03-31 16:57:19
 * @LastEditors: fg
 * @LastEditTime: 2023-03-31 17:49:41
 * @Description: 设备echarts
-->
<template>
  <div class="Echarts" ref="refEquipEcharts"></div>
</template>
<script setup lang="ts">
//  按需引入 echarts
import * as echarts from "echarts";
// refEcharts
const refEquipEcharts = ref<any>("");
type EChartsOption = echarts.EChartsOption;
// 基于准备好的dom，初始化echarts实例
let myChart: any;
const init = () => {
  myChart = echarts.init(refEquipEcharts.value);
  let option: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
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
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };
  myChart.setOption(option);
};
onMounted(() => {
  init();
  window.onresize = () => {
    console.log("equip onresize");
    myChart.resize();
  };
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
