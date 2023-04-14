<!--
 * @Author: fg
 * @Date: 2023-01-16 10:10:33
 * @LastEditors: fg
 * @LastEditTime: 2023-04-12 15:52:06
 * @Description: content
-->
<template>
  <component :is="compName" :compData="data"></component>
</template>
<script lang="ts" setup>
import SelectComps from "./Select.vue";
import RadioGroupComps from "./RadioGroup.vue";
import SliderComps from "./Slider.vue";
const comps: Map<string, any> = new Map([["Select", SelectComps]]);
comps.set("RadioGroup", RadioGroupComps);
comps.set("Slider", SliderComps);
// console.log(comps, comps.get("Select"));

const props = withDefaults(
  defineProps<{
    data?: DataType;
  }>(),
  {
    data: () => {
      return {
        description: "",
        name: "",
        parent: "",
        value: "",
        type: "",
        props: {},
      };
    },
  }
);
const compName = comps.get(props.data.type) || "";
</script>
<style lang="less" scoped></style>
