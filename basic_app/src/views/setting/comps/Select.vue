<!--
 * @Author: fg
 * @Date: 2023-01-16 13:37:32
 * @LastEditors: fg
 * @LastEditTime: 2023-01-16 16:13:18
 * @Description: content
-->

<template>
  <div class="select">
    <Select
      style="width: 300px"
      placeholder="请选择设备"
      v-model="selectVal"
      @on-change="onChange"
    >
      <Option
        v-for="(item, index) in options"
        :key="index"
        :value="item.value"
        >{{ item.label }}</Option
      >
    </Select>
  </div>
</template>
<script lang="ts" setup>
type PropsType = {
  filterable?: boolean;
  option: any[];
};

const props = withDefaults(
  defineProps<{
    compData?: DataType<PropsType>;
  }>(),
  {
    compData: () => {
      return {
        description: "",
        name: "",
        parent: "",
        value: "",
        type: "",
        props: {
          filterable: true,
          option: [],
        },
      };
    },
  }
);
const options = props.compData.props?.option;
let selectVal = ref<string>(props.compData.value);
const onChange = (val: any) => {
  selectVal.value = val;
};
</script>
<style lang="less" scoped>
.select {
  touch-action: none; //无用
}
</style>
