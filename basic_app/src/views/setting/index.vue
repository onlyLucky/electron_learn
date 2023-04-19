<!--
 * @Author: fg
 * @Date: 2023-01-11 14:17:33
 * @LastEditors: fg
 * @LastEditTime: 2023-04-19 19:40:24
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
          clearable
          placeholder="搜索设置项"
          v-model="searchConfig"
          @on-change="onSearchChange"
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
        <div class="rightCon" @scroll="onRightScroll">
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
                <SettingComps
                  :data="item"
                  :index="[menuIndex, index]"
                ></SettingComps>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="optBox f-row-e-c">
        <Button type="text">取消</Button>
        <Button type="primary" v-debounce="onload">保存</Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt";
import SettingComps from "./comps/index.vue";
import { ipcRenderer } from "electron";
import { useSetting } from "./useSetting";
import _ from "lodash";
import { useTools } from "@/hooks/useTools";

const { useValueInArr } = useTools();

const { menuData, searchData, copyData, computedSearchIndex, compareJson } =
  useSetting();
// 记录每个菜单项的高度
let menuItemH: number[] = [];
// 是否触发滚动
let isTriggerScrollEvent: boolean = true;

let searchConfig = ref<string>("");

//计算右侧menuCom 的高度 范围
const computedMenuH = () => {
  menuItemH = [];
  let temp = 0;
  for (let dom of document.getElementsByClassName("menuCom") as any) {
    temp = temp + dom.clientHeight;
    menuItemH.push(temp);
  }
};
// 左侧菜单点击处理
const menuTap = (index: number, item: any) => {
  setMenuActive(index);
  // 设置缓动滚动
  isTriggerScrollEvent = false;
  document.getElementsByClassName("menuCom")[index]!.scrollIntoView({
    behavior: "smooth",
  });
  setTimeout(() => {
    isTriggerScrollEvent = true;
  }, 800);
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
// 搜索设置项更改
const onSearchChange = () => {
  let indexs = unref(searchConfig)
    ? computedSearchIndex(unref(searchConfig))
    : [0];

  setMenuActive(indexs[0]);
  isTriggerScrollEvent = false;
  nextTick(() => {
    if (indexs.length == 1) {
      console.log(document.getElementsByClassName("menuCom")[indexs[0]]);
      document.getElementsByClassName("menuCom")[indexs[0]]!.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (indexs.length == 2) {
      document
        .getElementsByClassName("menuCom")
        [indexs[0]].getElementsByClassName("menuComChild")
        [indexs[1]]!.scrollIntoView({
          behavior: "smooth",
        });
    }
    setTimeout(() => {
      isTriggerScrollEvent = true;
    }, 800);
  });
};

// 右侧滚动检测
const onRightScroll = (e: any) => {
  if (isTriggerScrollEvent) {
    _.debounce(() => {
      let index = useValueInArr(menuItemH, e.target.scrollTop || 0);
      setMenuActive(index);
    }, 300)();
  }
};

// 设置选中的menu Item
const setMenuActive: any = (index: number) => {
  menuData.map((item) => {
    item.hover = false;
    item.select = false;
  });
  menuData[index].select = true;
};

const onload = () => {
  // document.body.style.fontFamily = "KeHeiTi";
  // ipcRenderer.send("set_config", "fontFamily", "KeHeiTi");
  // console.log("KeHeiTi--:");
  compareJson();
  console.log("onload", menuData);
};

onMounted(async () => {
  await nextTick();
  computedMenuH();
  window.onresize = () => {
    computedMenuH();
  };
});
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
      // 50
      height: calc(100% - 105px);
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
          padding-bottom: 30px;
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
    .optBox {
      .size(100%, 50px);
      padding: 0 14px;
      box-sizing: border-box;
      button {
        margin-left: 20px;
      }
    }
  }
}
</style>
