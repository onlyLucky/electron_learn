<!--
 * @Author: fg
 * @Date: 2022-12-15 16:43:56
 * @LastEditors: fg
 * @LastEditTime: 2022-12-16 17:03:39
 * @Description: content
-->
<template>
  <div class="menu">
    <Menu :active-name="activeRouteName">
      <!-- <Submenu name="1">
        <template #title>
          <Icon type="ios-cog" />
          Navigation Three
        </template>
      </Submenu> -->
      <MenuItem
        :name="(item.name as string)"
        v-for="(item, index) in menuList"
        :key="index"
        @click="handleMenuTap(item)"
      >
        <div class="menuItem f-row-s-c">
          <!-- ios-construct ios-people -->
          <div class="iconBox">
            <Icon :type="item.meta?.icon" size="20" />
          </div>

          <span>{{ item.meta?.title }}</span>
        </div>
      </MenuItem>
    </Menu>
  </div>
</template>
<script setup lang="ts">
import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
import routes from "@/router/routes";
// Submenu
import { Menu, MenuItem } from "view-ui-plus";
import { ref, watch } from "vue";
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
  width: 100%;
  user-select: none;
  .menuItem {
    .iconBox {
      width: 20px;
      height: 20px;
    }
    span {
      margin-left: 10px;
      font-size: 16px;
    }
  }
}
</style>
