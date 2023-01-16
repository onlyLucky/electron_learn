<!--
 * @Author: fg
 * @Date: 2023-01-16 16:08:05
 * @LastEditors: fg
 * @LastEditTime: 2023-01-16 16:21:56
 * @Description: content
-->
<template>
  <div class="radio">
    <RadioGroup v-model="radioVal">
      <Radio
        v-for="(item, index) in radioList"
        :key="index"
        :label="item.value"
      >
        <span>{{ item.label }}</span>
      </Radio>
    </RadioGroup>
  </div>
</template>
<script lang="ts" setup>
type PropsType = {
  data: any[];
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
          data: [],
        },
      };
    },
  }
);
let radioVal = ref<number>(props.compData.value);
const radioList = props.compData.props?.data;
</script>
<style lang="less" scoped>
.radio {
  touch-action: none; //无用
}
</style>
