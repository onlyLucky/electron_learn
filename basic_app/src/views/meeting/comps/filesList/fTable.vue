<!--
 * @Author: fg
 * @Date: 2023-02-06 11:43:09
 * @LastEditors: fg
 * @LastEditTime: 2023-03-15 19:19:26
 * @Description: 文件列表的块状组件
-->
<template>
  <div class="table" ref="refTable">
    <Table
      :columns="columns"
      :data="tData"
      :height="tableHeight"
      @on-selection-change="onSelectChange"
    >
      <template #loading>
        <Spin :show="loading" fix size="large" class="loading">
          <Icon
            type="ios-loading"
            size="26"
            class="conLoading iconLoading"
          ></Icon>
          <div class="conLoadingTxt">加载中...</div>
        </Spin>
      </template>
    </Table>
  </div>
</template>
<script setup lang="ts">
import { useType } from "./useType";
import { useRoute } from "vue-router";
import { getAllFileByMeetId } from "@/apis/meet";
import { useBytesUnit } from "@/hooks/useTools";
import { useMsgTimeShow } from "@/hooks/useMsgTime";
import hdObj from "_v/setting/handleData";
import { join } from "path";
import { shell } from "electron";
import _ from "lodash";
const fs = require("fs");
const downloadPath = hdObj.getConfigItem("download").downloadPath;
const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
let emit = defineEmits<{
  (e: "onDownload"): void;
  (e: "onDel"): void;
}>();
// 加载
let loading = ref<boolean>(false);
// props
let selAll = ref<boolean>(false);
const columns = [
  {
    /* renderHeader: (h: any, params: any) => {
      return h(resolveComponent("Checkbox"), {
        disabled: false,
        modelValue: selAll.value,
        ["onUpdate:model-value"]: (value: boolean) => {
          selAll.value = value;
        },
        onOnChange: (c: boolean) => {},
      });
    }, */
    type: "selection",
    width: 60,
    align: "center",
    /* render: (h: any, params: any) => {
      return h(
        resolveComponent("Tooltip"),
        {
          placement: "right-end",
          content: "已下载",
          disabled: params.row.dStatus,
        },
        {
          default: () => [
            h(resolveComponent("Checkbox"), {
              disabled: params.row.dStatus,
              modelValue: params.row.select,
              ["onUpdate:model-value"]: (value: boolean) => {
                tableData.value[params.index].select = value;
              },
              onOnChange: (c: boolean) => {
                c ? selectNum.value++ : selectNum.value--;
                selAll.value =
                  selectNum.value + disabledNum == tableData.value.length;
                emit("delChange");
              },
            }),
          ],
        }
      );
    }, */
  },
  {
    title: "文件信息",
    key: "realName",
    render: (h: any, params: any) => {
      return h(
        "div",
        {
          class: "fileName f-row-b-c",
        },
        [
          h(
            "div",
            {
              class: "fileLeft f-row-s-c",
            },
            [
              h("img", {
                src: useType(params.row.realName),
              }),
              h(
                "div",
                {
                  class: params.row.dStatus
                    ? "fileInfo fileActive f-col-c-s"
                    : "fileInfo f-col-c-s",
                  onClick: _.debounce(function () {
                    if (params.row.dStatus) {
                      shell.openPath(params.row.localPath);
                    }
                  }, 300),
                },
                [
                  h(
                    resolveComponent("Text"),
                    {
                      placement: "bottom-start",
                      ellipsis: true,
                      style: { fontSize: "16px" },
                      "ellipsis-config": { tooltip: true },
                    },
                    () => params.row.realName
                  ),
                  h(
                    "p",
                    {
                      class: "fileStatus",
                      style: {
                        color: params.row.dStatus
                          ? "var(--success)"
                          : "var(--fontColor)",
                      },
                    },
                    params.row.dStatus ? "已下载" : "未下载"
                  ),
                ]
              ),
            ]
          ),
          h(
            "div",
            {
              class: "fileRight f-row-e-c",
            },
            [
              h(
                resolveComponent("Dropdown"),
                { trigger: "click", placement: "bottom-start" },
                {
                  default: () =>
                    h(
                      resolveComponent("Tooltip"),
                      {
                        content: "更多",
                        placement: "top",
                        transfer: true,
                        disabled: true,
                      },
                      // <Icon type="ios-more" />
                      {
                        default: () => [
                          h(resolveComponent("SvgIcon"), {
                            iconName: "icon-gengduo",
                            color: "var(--f_color_h6)",
                            class: "iconOpt",
                            size: "22",
                          }),
                        ],
                      }
                    ),
                  list: () =>
                    h(
                      resolveComponent("DropdownMenu"),
                      {},
                      {
                        default: () => [
                          h(
                            resolveComponent("DropdownItem"),
                            {
                              disabled: !params.row.dStatus,
                              style: {
                                color: "var(--error)",
                                opacity: !params.row.dStatus ? 0.5 : 1,
                              },
                              onClick: _.debounce(function () {
                                selection.value = [params.row];
                                delNum.value = 1;
                                emit("onDel");
                              }, 300),
                            },
                            { default: () => "删除文件" }
                          ),
                          h(
                            resolveComponent("DropdownItem"),
                            {
                              disabled: params.row.dStatus,
                              onClick: _.debounce(function () {
                                selection.value = [params.row];
                                downloadNum.value = 1;
                                emit("onDownload");
                              }, 300),
                            },
                            { default: () => "下载文件" }
                          ),
                        ],
                      }
                    ),
                }
              ),
              // h(SvgIcon,{})
            ]
          ),
        ]
      );
    },
  },
  {
    title: "文件大小",
    key: "fileSize",
    width: 150,
    sortable: true,
    render: (h: any, params: any) => {
      return h("div", { class: "fileSize" }, useBytesUnit(params.row.fileSize));
    },
  },
  {
    title: "上传时间",
    key: "createTime",
    width: 150,
    sortable: true,
    render: (h: any, params: any) => {
      return h(
        "div",
        { class: "fileSize" },
        useMsgTimeShow(params.row.createTime)
      );
    },
  },
  {
    title: "下载时间",
    key: "dCTime",
    width: 150,
    sortable: true,
  },
];
const refTable = ref<HTMLElement>();
let tableHeight = ref<number>();

let tData = ref<any[]>([]);
onMounted(() => {
  tableHeight.value = refTable.value?.clientHeight;
  getData();
  window.onresize = () => {
    tableHeight.value = refTable.value?.clientHeight;
  };
});
const getData = () => {
  loading.value = true;
  selection.value = [];
  downloadNum.value = 0;
  delNum.value = 0;
  getAllFileByMeetId({ meetId: queryParams.id })
    .then((res) => {
      let temp: any[] = [];
      res.data.map((item: any, index: number) => {
        let tempPath = join(
          downloadPath,
          `/${queryParams.name}.${queryParams.id}/${item.realName}`
        );
        if (fs.existsSync(tempPath)) {
          item.dStatus = true;
          // item._disabled = true;
          item.dCTime = useMsgTimeShow(fs.statSync(tempPath).ctime);
          item.localPath = tempPath;
        } else {
          item.dStatus = false;
          // item._disabled = false;
          item.localPath = "";
        }
        temp.push(item);
      });
      tData.value = temp;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
let selection = ref<any[]>([]);
// 选项更改变化
let downloadNum = ref<number>(0);
let delNum = ref<number>(0);
const onSelectChange = (selects: any[]) => {
  let tempDownload = 0;
  let tempDel = 0;
  selects.map((item: any) => {
    if (item.dStatus) {
      tempDel++;
    } else {
      tempDownload++;
    }
  });
  downloadNum.value = tempDownload;
  delNum.value = tempDel;
  selection.value = selects;
};
defineExpose({
  selection,
  downloadNum,
  delNum,
  getData,
});
</script>
<style scoped lang="less">
:deep(.ivu-table th) {
  background-color: @bg;
  border-bottom: none;
  color: @fontColor;
  font-weight: 400;
}
:deep(.ivu-table td) {
  border-bottom: none;
}
:deep(.ivu-table:before) {
  display: none;
}
:deep(.ivu-typography) {
  color: @f_color_h3;
}
:deep(.fileInfo.fileActive) {
  .ivu-typography {
    color: @f_color_active;
  }
}
:deep(.fileName) {
  .size(100%,60px);
  .fileLeft {
    .size(100%,100%);
    img {
      .size(46px,46px);
      margin-right: 6px;
    }
    .fileInfo {
      .fileStatus {
        font-size: 12px;
        margin-top: 6px;
        color: @fontColor;
      }
    }
    .fileInfo.fileActive {
      cursor: pointer;
    }
  }
  .fileRight {
    display: none;
    .size(auto, 100%);
    padding-left: 10px;
    flex-shrink: 0;
    .iconOpt {
      /* border: 10px solid transparent;
      background-clip: padding-box; */
      cursor: pointer;
    }
  }
  &:hover {
    .fileRight {
      display: flex;
    }
  }
}
:deep(.fileSize) {
  .size(100%,100%);
}
.table {
  .size(100%,100%);
  h1 {
    font-size: 30px;
  }
}
.conLoadingTxt {
  margin-top: 10px;
  white-space: nowrap;
}
</style>
