<!--
 * @Author: fg
 * @Date: 2023-02-03 14:55:51
 * @LastEditors: fg
 * @LastEditTime: 2023-03-15 19:21:14
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
        <Tooltip placement="bottom-end" content="删除文件">
          <Badge :count="refFTable?.delNum">
            <div class="optItem f-row-c-c" v-debounce="onDelFile">
              <svg-icon
                iconName="icon-shanchu1"
                className="optIcon"
                size="22"
                color="var(--fontColor)"
              ></svg-icon>
            </div>
          </Badge>
        </Tooltip>
        <Tooltip placement="bottom-end" content="下载文件">
          <Badge :count="refFTable?.downloadNum">
            <div class="optItem f-row-c-c" v-debounce="onDownloadFile">
              <svg-icon
                iconName="icon-yunxiazai-"
                className="optIcon"
                size="22"
                color="var(--fontColor)"
              ></svg-icon>
            </div>
          </Badge>
        </Tooltip>
      </div>
    </div>
    <!-- 展示内容 -->
    <div class="content">
      <fTable
        ref="refFTable"
        @onDownload="onDownloadFile"
        @onDel="onDelFile"
      ></fTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import fTable from "../comps/filesList/fTable.vue";
import { useDownload } from "../comps/mListDetail/useDownload";
import { ComponentInternalInstance } from "vue";
import { Message, Modal } from "view-ui-plus";
const fs = require("fs");

const cxt: ComponentInternalInstance = getCurrentInstance()!;
const bus = cxt.appContext.config.globalProperties.$bus;

const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);

const { downloadUse, handleDownload } = useDownload(
  queryParams.id,
  queryParams.name || ""
) as any;

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

const refFTable = ref<InstanceType<typeof fTable>>();
// 类型名称
let filter = reactive<FileFilterType>({
  type: 0,
  typeName: filterData[0].name,
});
const onMenuTap = (val: number) => {
  filter.type = val;
  filter.typeName = filterData[val].name;
};
// 文件下载
const onDownloadFile = () => {
  if (refFTable.value!.downloadNum > 0 && downloadUse.status != 1) {
    let temp: any[] = [];
    refFTable.value!.selection.map((item: any) => {
      if (!item.dStatus) {
        temp.push({
          fId: item.id,
          path: localStorage.getItem("staticPath") + item.fileUrl,
          directory: `${queryParams.name}.${queryParams.id}`,
          fileName: item.realName,
          fileSize: item.fileSize,
        });
      }
    });
    downloadUse.needDownloadArr = temp;
    handleDownload(false);
  }
};
// 文件删除
const onDelFile = () => {
  if (refFTable.value!.delNum > 0) {
    Modal.confirm({
      title: "是否确认删除文件",
      loading: true,
      onOk: () => {
        let temp: number = 0;
        refFTable.value!.selection.map((item: any) => {
          handleDelFile(item.localPath);
          temp++;
          if (temp == refFTable.value!.selection.length) {
            refFTable.value?.getData();
            Modal.remove();
            Message.success("所选的文件删除完成");
          }
        });
      },
    });
  }
};

const handleDelFile = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

watch(
  () => downloadUse.isNeedDownload,
  (val) => {
    if (!val) {
      refFTable.value?.getData();
      setTimeout(() => {
        Message.success("所选的文件下载完成");
      }, 400);
    }
  }
);

watch(
  () => downloadUse.progress,
  (val) => {
    if (val == 100) {
      setTimeout(() => {
        downloadUse.progress = 0;
      }, 1000);
    }
    bus.emit("progressChange", val);
  }
);
</script>
<style scoped lang="less">
.fileListCon {
  .size(100%,100%);
  padding: 16px;
  box-sizing: border-box;
  position: relative;
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
    .filterOpt {
      .size(auto,100%);
      padding-right: 20px;
      box-sizing: border-box;
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
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 110px);
  }
}
</style>
