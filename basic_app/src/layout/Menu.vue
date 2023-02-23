<!--
 * @Author: fg
 * @Date: 2022-12-15 16:43:56
 * @LastEditors: fg
 * @LastEditTime: 2023-02-23 19:59:38
 * @Description: content
-->
<template>
  <div class="menu f-col-s-c">
    <div
      :class="[
        'menuItem',
        activeRouteName == item.name ? 'active' : '',
        open ? 'menuItemRow f-row-s-c' : 'menuItemCol f-col-c-c',
      ]"
      v-for="(item, index) in menuList"
      :key="index"
      @click="handleMenuTap(item)"
    >
      <!-- ios-construct ios-people -->
      <SvgIcon
        :iconName="item.meta?.icon"
        :size="open ? '26' : activeRouteName == item.name ? '22' : '28'"
        :color="activeRouteName == item.name ? 'var(--bg)' : 'var(--fontColor)'"
      ></SvgIcon>
      <span>{{ item.meta?.title }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
import routes from "@/router/routes";
// Submenu
import { ref, watch } from "vue";
const props = withDefaults(
  defineProps<{
    open: boolean;
  }>(),
  {
    open: false,
  }
);
let menuList: RouteRecordRaw[] | undefined = [] as RouteRecordRaw[];
let activeRouteName = ref<string>("");
const route = useRoute();
const router = useRouter();
routes.map((item) => {
  if (item.name == "_index") {
    menuList = item.children;
  }
});

const handleMenuTap = (item: any) => {
  router.push({ name: item.name });
};

// 监听路由
watch(
  () => route.name,
  (n, o) => {
    console.log(n, o);
    activeRouteName.value = <string>n;
  },
  { immediate: true }
);
</script>
<style scoped lang="less">
:deep(.ivu-menu) {
  width: 100% !important;
}
:deep(.ivu-menu-vertical .ivu-menu-submenu-title) {
  padding: 14px;
}
:deep(.ivu-menu-item:hover) {
  background-color: @menu_item_hover;
}
:deep(.ivu-menu-vertical.ivu-menu-light:after) {
  display: none;
}
.menu {
  .size(100%,100%);
  user-select: none;
  overflow: auto;

  .menuItem {
    // background-color: pink;
    cursor: pointer;
    &:hover {
      background-color: @menu_hover;
    }
  }
  .menuItem.active {
    background-color: @f_color_active;
    span {
      color: @bg;
    }
  }
  .menuItemCol {
    .size(64px,64px);
    border-radius: 6px;
    margin-top: 8px;
    span {
      font-size: 12px;
      margin-top: 2px;
      color: @fontColor;
    }
  }
  .menuItemCol.active {
    span {
      margin-top: 6px;
      font-size: 14px;
    }
  }
  .menuItemRow {
    .size(100%,50px);
    margin-top: 10px;
    padding: 0 20px;
    box-sizing: border;
    border-radius: 0 30px 30px 0;
    span {
      font-size: 16px;
      color: @fontColor;
      margin-left: 20px;
    }
  }
  .menuItemRow.active {
  }
}
</style>
