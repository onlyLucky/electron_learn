<!--
 * @Author: fg
 * @Date: 2023-02-03 14:55:51
 * @LastEditors: fg
 * @LastEditTime: 2023-02-06 16:53:37
 * @Description: content
-->
<template>
  <div class="fileListCon">
    <div class="header f-row-b-c">
      <!-- 面包屑 -->
      <div class="breadcrumb f-row-s-c">
        <span class="breadcrumbItem itemLink">全部会议</span>
        <span class="breadcrumbItem itemLine">/</span>
        <Text
          class="breadcrumbItem itemMeet"
          :ellipsis-config="{ tooltip: true }"
          ellipsis
          placement="bottom-start"
        >
          {{ queryParams.name || "会议文件" }}
        </Text>
        <!-- <span class="breadcrumbItem itemMeet">{{
          queryParams.name || "会议文件"
        }}</span> -->
      </div>
      <!-- 操作按钮 -->
      <!-- <div class="optBox f-row-e-c">
        <Tooltip placement="bottom-end" content="缩略图" v-show="!showType">
          <svg-icon
            iconName="icon-suolvetuqiehuan"
            className="optItem"
            size="24"
            color="var(--f_color_h3)"
          ></svg-icon>
        </Tooltip>
        <Tooltip placement="bottom-end" content="列表" v-show="showType">
          <svg-icon
            iconName="icon-Icon-huiyiliebiao"
            className="optItem"
            size="24"
            color="var(--f_color_h3)"
          ></svg-icon>
        </Tooltip>
      </div> -->
    </div>
    <!-- 筛选 -->
    <div class="filter f-row-b-c">
      <div class="filterBox f-row-s-c">
        <div class="filterItem f-row-c-c">
          <span class="labelName">类型</span>
          <Dropdown
            trigger="click"
            @on-click="onMenuTap"
            placement="bottom-start"
          >
            <span class="valueName">
              {{ filter.typeName || "全部文件类型" }}
              <Icon type="ios-arrow-down"></Icon>
            </span>
            <template #list>
              <DropdownMenu>
                <DropdownItem
                  v-for="(item, index) in filterData"
                  :key="index"
                  :name="index"
                  >{{ item.name }}</DropdownItem
                >
              </DropdownMenu>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="filterOpt f-row-e-c">
        <Checkbox :model-value="false">全选下载</Checkbox>
        <div class="optBox" v-show="false">
          <Button type="primary">下载</Button>
        </div>
      </div>
    </div>
    <!-- 展示内容 -->
    <div class="content">
      <fTable></fTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import fTable from "../comps/filesList/fTable.vue";
const route = useRoute();
const router = useRouter();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
let showType = ref<boolean>(false); // 展示样式类型 false列表 true 缩略图
const filterData = [
  {
    name: "全部文件类型",
    value: 0,
  },
  {
    name: "图片类型",
    value: 1,
  },
  {
    name: "文档类型",
    value: 2,
  },
  {
    name: "音频类型",
    value: 3,
  },
  {
    name: "视频类型",
    value: 4,
  },
  {
    name: "其他类型",
    value: 5,
  },
];
// 类型名称
let filter = reactive<FileFilterType>({
  type: 0,
  typeName: filterData[0].name,
});
const onMenuTap = (val: number) => {
  filter.type = val;
  filter.typeName = filterData[val].name;
};
</script>
<style scoped lang="less">
.fileListCon {
  .size(100%,100%);
  padding: 16px;
  box-sizing: border-box;
  h1 {
    font-size: 30px;
  }
  .header {
    .size(100%, 50px);
    padding-bottom: 10px;
    border-bottom: 1px solid @search_bottom_border;
    box-sizing: border-box;
    .breadcrumb {
      width: calc(100% - 100px);
      height: 100%;
      font-size: 16px;
      .breadcrumbItem {
        color: @f_color_h3;
      }
      .itemLink {
        color: @f_color_active;
        cursor: pointer;
        flex-shrink: 0;
      }
      .itemMeet {
        width: 100%;
      }
      .breadcrumbItem.itemLine {
        margin: 0 4px;
        font-weight: bold;
        flex-shrink: 0;
      }
    }
    .optBox {
      .size(100px, 100%);
      .optItem {
        cursor: pointer;
      }
    }
  }
  .filter {
    .size(100%, 60px);
    .filterBox {
      .size(auto,100%);
      .filterItem {
        .size(auto,100%);
        .labelName {
          font-size: 14px;
          color: @fontColor;
          margin-right: 10px;
        }
        .valueName {
          border-radius: 4px;
          font-size: 14px;
          padding: 6px 10px;
          cursor: pointer;
          color: @f_color_h3;
          &:hover {
            background-color: @menu_item_hover;
          }
        }
      }
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 110px);
  }
}
</style>
