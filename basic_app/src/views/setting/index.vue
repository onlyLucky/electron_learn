<!--
 * @Author: fg
 * @Date: 2023-01-11 14:17:33
 * @LastEditors: fg
 * @LastEditTime: 2023-01-16 15:29:33
 * @Description: 设置
-->
<template>
  <div class="setting">
    <div class="header f-row-b-c">
      <h1>设置</h1>
      <SystemOpt :isShowChangeSize="false" color="var(--fontColor)"></SystemOpt>
    </div>
    <div class="content">
      <div class="search f-row-e-c">
        <Select
          class="searchBox"
          filterable
          placeholder="搜索设置项"
          v-model="searchConfig"
        >
          <Option
            v-for="(item, index) in searchData"
            :value="item.name"
            :key="index"
            >{{ item.description }}</Option
          >
        </Select>
      </div>
      <div class="conBox">
        <div class="leftCon">
          <div
            @click="menuTap(index, item)"
            @mouseenter="menuMouseEnter(index, item)"
            @mouseleave="menuMouseLeave(index, item)"
            v-for="(item, index) in menuData"
            :class="{
              menuItem: true,
              menuItemHover: item.hover,
              menuItemSelected: item.select,
            }"
            :key="index"
          >
            {{ item.description }}
          </div>
        </div>
        <div class="rightCon">
          <div
            class="menuCom"
            v-for="(menu, menuIndex) in menuData"
            :key="menuIndex"
            :id="menu.name"
          >
            <h3>{{ menu.description }}</h3>
            <div
              class="menuComChild"
              v-for="(item, index) in menu.children"
              :key="menuIndex + '' + index"
            >
              <h4>{{ item.description }}</h4>
              <div class="settingCon">
                <SettingComps :data="item"></SettingComps>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt";
import SettingComps from "./comps/index.vue";
import hdObj from "./handleData";
const menuData = reactive(hdObj.menu);
const searchData = reactive(hdObj.mList);
let searchConfig = ref<string>("");
onMounted(async () => {
  await nextTick();
  console.log(document.getElementsByClassName("menuItem")[1], "getElementById");
});
const menuTap = (index: number, item: any) => {
  menuData.map((item) => {
    item.hover = false;
    item.select = false;
  });
  menuData[index].select = true;
  document.getElementsByClassName("menuCom")[index]!.scrollIntoView({
    behavior: "smooth",
  });
};
const menuMouseEnter = (index: number, item: any) => {
  if (!item.select) {
    menuData[index].hover = true;
  }
};
const menuMouseLeave = (index: number, item: any) => {
  if (!item.select) {
    menuData[index].hover = false;
  }
};
</script>
<style scoped lang="less">
:deep(.searchBox .ivu-select-selection) {
  border-radius: 20px;
}
.setting {
  .size(100vw,100vh);
  .header {
    .size(100%,48px);
    padding: 0 8px 0 16px;
    box-sizing: border-box;
    // background-color: @f_color_active;
    -webkit-app-region: drag;
    h1 {
      font-size: 16px;
      font-weight: 400;
      color: @fontColor;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 48px);
    padding-right: 4px;
    box-sizing: border-box;
    .search {
      .size(100%,50px);
      padding: 0 20px;
      box-sizing: border-box;
      .searchBox {
        width: 240px;
      }
    }
    .conBox {
      width: 100%;
      height: calc(100% - 50px);
      display: flex;
      .leftCon {
        .size(200px, 100%);
        padding: 0 20px;
        border-right: 1px solid @search_bottom_border;
        box-sizing: border-box;
        .menuItem {
          .size(100%, 34px);
          .textCenter(34px);
          margin-bottom: 10px;
          border-radius: 4px;
          font-size: 14px;
          color: @f_color_h3;
          cursor: pointer;
          &:last-child {
            margin-bottom: 0px;
          }
        }
        .menuItem.menuItemHover {
          color: @f_color_active;
        }
        .menuItem.menuItemSelected {
          color: @bg;
          background-color: @f_color_active;
        }
      }
      .rightCon {
        width: calc(100% - 200px);
        height: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        overflow: auto;
        .menuCom {
          .size(100%, auto);
          margin-bottom: 30px;
          h3 {
            height: 24px;
            line-height: 24px;
            font-size: 18px;
            color: @f_color_h3;
            margin-bottom: 14px;
          }
          .menuComChild {
            .size(100%, auto);
            padding: 10px 0;
            h4 {
              font-size: 14px;
              color: #333;
              margin-bottom: 8px;
            }
            .settingCon {
              font-size: 14px;
              color: #999;
              touch-action: none;
            }
          }
        }
      }
    }
  }
}
</style>
