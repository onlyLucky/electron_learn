<!--
 * @Author: fg
 * @Date: 2023-01-06 18:03:51
 * @LastEditors: fg
 * @LastEditTime: 2023-01-09 16:45:10
 * @Description: content
-->
<template>
  <svg :class="svgClass" :style="style" aria-hidden="true">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "#409eff",
  },
  style: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `#${props.iconName}`;
});
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return "svg-icon";
});
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  vertical-align: -2px;
}
</style>
