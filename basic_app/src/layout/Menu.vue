<!--
 * @Author: fg
 * @Date: 2022-12-15 16:43:56
 * @LastEditors: fg
 * @LastEditTime: 2022-12-15 17:47:34
 * @Description: content
-->
<template>
  <div class="menu">
    <Menu active-name="1-2" :open-names="['4']">
      <Submenu name="4">
        <template #title>
          <Icon type="ios-cog" />
          Navigation Three
        </template>
        <MenuItem name="4-1">Option 9</MenuItem>
        <MenuItem name="4-2">Option 10</MenuItem>
        <MenuItem name="4-3">Option 11</MenuItem>
        <MenuItem name="4-4">Option 12</MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>
<script setup lang="ts">
import routes from "@/router/routes";
import { Menu, Submenu, MenuItem } from "view-ui-plus";
console.log(routes, "routes");
</script>
<style scoped lang="less">
:deep(.ivu-menu) {
  width: 100% !important;
}
:deep(.ivu-menu-vertical .ivu-menu-submenu-title) {
  padding: 14px;
}
:deep(.ivu-menu-item:hover) {
  background-color: #f4f4f4;
}
:deep(.ivu-menu-vertical.ivu-menu-light:after) {
  display: none;
}
.menu {
  width: 100%;
}
</style>
