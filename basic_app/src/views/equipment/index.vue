<!--
 * @Author: fg
 * @Date: 2022-12-16 15:13:52
 * @LastEditors: fg
 * @LastEditTime: 2023-02-13 18:05:22
 * @Description: content
-->
<template>
  <div class="equipment">
    <div class="header f-row-b-c">
      <div class="hLeft">
        <h1>设备列表</h1>
      </div>
      <div class="hRight f-row-c-c">
        <!-- search -->
        <div class="searchBox f-row-c-c">
          <Tooltip placement="bottom-end" content="搜索设备">
            <div class="optItem f-row-c-c" v-show="!searchFlag">
              <svg-icon
                iconName="icon-sousuo1"
                className="optIcon"
                size="20"
                color="var(--fontColor)"
                @click="showSearch(true)"
              ></svg-icon>
            </div>
          </Tooltip>
          <div class="searchCon f-row-c-c" v-show="searchFlag">
            <Input
              type="text"
              ref="refSearchInput"
              placeholder="设备名称搜索"
              clearable
            ></Input>
            <span @click="showSearch(false)">取消</span>
          </div>
        </div>
        <div class="optLine"></div>
        <Tooltip placement="bottom-end" content="新增设备">
          <div class="optItem f-row-c-c">
            <svg-icon
              iconName="icon-icon-xinzeng"
              className="optIcon"
              size="24"
              color="var(--fontColor)"
            ></svg-icon>
            <!-- <span>新增</span> -->
          </div>
        </Tooltip>

        <Tooltip placement="bottom-end" content="删除设备">
          <div class="optItem f-row-c-c">
            <svg-icon
              iconName="icon-shanchu1"
              className="optIcon"
              size="22"
              color="var(--fontColor)"
            ></svg-icon>
          </div>
        </Tooltip>
        <div class="optLine"></div>
        <Dropdown placement="bottom-start">
          <div class="optItem f-row-c-c">
            <svg-icon
              iconName="icon-gengduo"
              className="optIcon"
              size="24"
              color="var(--fontColor)"
            ></svg-icon>
          </div>
          <!-- <div class="moreItem f-row-c-c">
            <svg-icon
              iconName="icon-gengduo"
              className="optIcon"
              size="20"
              color="var(--bg)"
            ></svg-icon>
            <span>更多</span>
          </div> -->
          <template #list>
            <div class="menuTitle">
              <p>导入设备</p>
            </div>
            <DropdownMenu>
              <DropdownItem>下载模板</DropdownItem>
              <DropdownItem>导入设备</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="content"></div>
  </div>
</template>
<script setup lang="ts">
// TODO: 列表添加模式 列表加载更多 底部分页模式

import { Input } from "view-ui-plus";

// 顶部搜索部分
let refSearchInput = ref<InstanceType<typeof Input>>();
let searchFlag = ref<boolean>(false);
const showSearch = (flag: boolean) => {
  searchFlag.value = flag;
  nextTick(() => {
    if (flag) {
      (refSearchInput.value as any).focus();
    }
  });
};
</script>
<style scoped lang="less">
:deep(.ivu-input) {
  border-radius: 50px;
}
.equipment {
  .size(100%,100%);
  padding: 10px;
  box-sizing: border-box;
  .header {
    .size(100%, 46px);
    padding-bottom: 6px;
    border-bottom: 1px solid @search_bottom_border;
    box-sizing: border-box;
    .hLeft {
      font-size: 16px;
      color: @f_color_h3;
    }
    .hRight {
      .size(auto,100%);
      .optItem {
        padding: 6px;
        border-radius: 4px;
        background-color: @bg;
        cursor: pointer;
        margin-left: 10px;
        &:hover {
          background-color: @search_bottom_border;
        }
        span {
          margin-left: 4px;
          font-size: 14px;
          color: @f_color_h3;
        }
      }
      .optLine {
        .size(2px, 46%);
        border-radius: 2px;
        background-color: @fontColor;
        opacity: 0.5;
        margin-left: 10px;
      }
      .searchBox {
        margin-right: 10px;
        .optItem {
          padding: 8px;
          border-radius: 50%;
        }
        .searchCon {
          span {
            margin-left: 10px;
            flex-shrink: 0;
            font-size: 14px;
            color: @fontColor;
            cursor: pointer;
          }
        }
      }
      .moreItem {
        padding: 6px 10px;
        border-radius: 4px;
        background-color: @f_color_active;
        cursor: pointer;
        margin-left: 10px;
        span {
          margin-left: 4px;
          font-size: 14px;
          color: @bg;
        }
      }
    }
  }
}
.menuTitle {
  .size(100%,32px);
  font-size: 12px;
  padding: 0px 18px 2px;
  box-sizing: border-box;
  line-height: 30px;
  color: @fontColor;
  border-bottom: 1px solid @search_bottom_border;
}
</style>
