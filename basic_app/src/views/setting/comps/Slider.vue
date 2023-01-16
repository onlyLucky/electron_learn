<!--
 * @Author: fg
 * @Date: 2023-01-16 16:09:35
 * @LastEditors: fg
 * @LastEditTime: 2023-01-16 16:49:16
 * @Description: content
-->
<template>
  <div class="slider">
    <Slider
      style="flex-shrink: 0"
      :marks="propsObj?.marks"
      :min="propsObj?.min"
      :max="propsObj?.max"
      :show-input="propsObj?.showInput"
      :show-tip="propsObj?.showTip"
    ></Slider>
    <!-- <span></span> -->
  </div>
</template>
<script lang="ts" setup>
type PropsType = {
  marks?: object;
  max: number;
  min: number;
  showInput?: boolean;
  showTip?: boolean;
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
          max: 20,
          min: 1,
          marks: {},
          showInput: false,
          showTip: false,
        },
      };
    },
  }
);
const propsObj = props.compData.props;
</script>
<style lang="less" scoped>
.slider {
  width: 500px;
  /* display: flex;
  align-items: center;
  span {
    flex-shrink: 0;
  } */
}
</style>
