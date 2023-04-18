<!--
 * @Author: fg
 * @Date: 2023-02-24 14:03:33
 * @LastEditors: fg
 * @LastEditTime: 2023-04-18 16:27:07
 * @Description: 会议列表
-->
<template>
  <div class="mTable" ref="refTable">
    <!-- @on-selection-change="onSelect" -->

    <Table
      :columns="columns"
      :data="tableData"
      :height="tableHeight"
      :loading="loading"
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
import { Message, Text } from "view-ui-plus";
import { ipcRenderer } from "electron";
import { getMeetingById, deleteByIds } from "@/apis/meet";
import { useSwitchMultiple } from "@/hooks/useMeetSwitch";
import _ from "lodash";
export type SearchType = {
  name?: string;
  dataValue?: any[];
  deviceId?: string | number;
  isDel: number;
  pageNum: number;
  pageSize: number;
};
export type SizeType = {
  width: number;
  height: number;
};

let emit = defineEmits<{
  (e: "delChange"): void;
  (e: "uploadData"): void;
  (e: "detail", row: any, isEdit: boolean): void;
}>();
let props = withDefaults(
  defineProps<{
    search: SearchType;
  }>(),
  {
    search: () => {
      return { pageNum: 1, pageSize: 8, isDel: 0 };
    },
  }
);
const columns = reactive<any[]>([
  {
    renderHeader: (h: any, params: any) => {
      return h(resolveComponent("Checkbox"), {
        disabled: false,
        modelValue: selAll.value,
        ["onUpdate:model-value"]: (value: boolean) => {
          selAll.value = value;
        },
        onOnChange: (c: boolean) => {
          let tempData = tableData.value;

          tempData.map((item) => {
            if (item.state != 0) {
              item.select = c;
              selectNum.value = c ? tableData.value.length - disabledNum : 0;
            }
          });
          // 引用对象不进行强赋值dom不会更新
          tableData.value = JSON.parse(JSON.stringify(tempData));
          emit("delChange");
        },
      });
    },
    width: 60,
    align: "center",
    render: (h: any, params: any) => {
      return h(
        resolveComponent("Tooltip"),
        {
          placement: "right-end",
          content: "该会议正在进行中",
          disabled: params.row.state == 0 ? false : true,
        },
        {
          default: () => [
            h(resolveComponent("Checkbox"), {
              disabled: params.row.state == 0 ? true : false,
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
    },
  },
  {
    title: "会议",
    key: "name",
    minWidth: 400,
    render: (h: any, params: any) => {
      let state = [
        {
          name: "进行中",
          color: "var(--success)",
        },
        {
          name: "已结束",
          color: "var(--fontColor)",
        },
      ];
      return h("div", { class: "meetNameBox f-row-b-c" }, [
        h("div", { class: "mNameLeft f-col-b-s" }, [
          h(
            resolveComponent("Text"),
            {
              ellipsis: true,
              class: "mNameTxt",
              "ellipsis-config": { tooltip: true },
              placement: "bottom-start",
              onClick: _.debounce(function () {
                emit("detail", params.row, false);
              }, 300),
            },
            () => params.row.name
          ),
          h("div", { class: "meetLeftBottom f-row-s-c" }, [
            h("div", { class: "mStatus f-row-s-c" }, [
              h("span", {
                class: "iconStatus",
                style: {
                  background: state[params.row.state].color,
                },
              }),
              h(
                "span",
                {
                  class: "statusTxt",
                  style: {
                    color: state[params.row.state].color,
                  },
                },
                state[params.row.state].name
              ),
            ]),
            h("div", { class: "equipmentBox f-row-s-c" }, [
              h(resolveComponent("SvgIcon"), {
                iconName: "icon-ziyuanxhdpi",
                class: "iconEquip",
                color: "var(--fontColor)",
                size: "16",
              }),
              h(
                resolveComponent("Text"),
                {
                  ellipsis: true,
                  class: "equipTxt",
                  "ellipsis-config": { tooltip: true },
                  placement: "bottom-start",
                },
                () => params.row.deviceName
              ),
            ]),
          ]),
        ]),
        h("div", { class: "mNameRight f-row-e-c" }, [
          h(
            resolveComponent("Tooltip"),
            {
              content: "编辑",
              placement: "top",
              transfer: true,
            },
            // <Icon type="ios-more" />
            {
              default: () => [
                h(resolveComponent("SvgIcon"), {
                  iconName: "icon-bianji",
                  class: "iconOpt",
                  color: "var(--f_color_h6)",
                  size: "22",
                  onClick: _.debounce(function () {
                    emit("detail", params.row, true);
                  }, 300),
                }),
              ],
            }
          ),
          h(
            resolveComponent("Dropdown"),
            {
              trigger: "click",
              placement:
                tableData.value.length <= 8 - 2
                  ? "bottom-start"
                  : params.index >= tableData.value.length - 2
                  ? "top-start"
                  : "bottom-start",
            },
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
                          onClick: _.debounce(async function () {
                            const result = await ipcRenderer.invoke(
                              "open-win",
                              {
                                type: 0,
                                urlName: `models/meet/share?name=${params.row.name}&id=${params.row.id}`,
                                width: 800,
                                height: 700,
                                minWidth: 800,
                                minHeight: 700,
                                resizable: false,
                                title: `${params.row.name}_分享列表`,
                              }
                            );
                            // console.log(params.row);
                          }, 300),
                        },
                        { default: () => "分享列表" }
                      ),
                      h(
                        resolveComponent("DropdownItem"),
                        {
                          disabled: params.row.fileUpload == 0,
                          onClick: _.debounce(async function () {
                            const result = await ipcRenderer.invoke(
                              "open-win",
                              {
                                type: 0,
                                urlName: `models/meet/file?name=${params.row.name}&id=${params.row.id}`,
                                width: 900,
                                height: 600,
                                minWidth: 900,
                                minHeight: 600,
                                resizable: true,
                                title: `${params.row.name}_文件列表`,
                              }
                            );
                            // console.log(params.row);
                          }, 300),
                        },
                        { default: () => "文件列表" }
                      ),
                      h(
                        resolveComponent("DropdownItem"),
                        {
                          disabled: params.row.fileUpload == 0,
                          onClick: _.debounce(async function () {
                            // console.log(params.row);
                            const result = await ipcRenderer.invoke(
                              "open-win",
                              {
                                type: 0,
                                urlName: `models/meet/summary?name=${params.row.name}&id=${params.row.id}`,
                                width: 1024,
                                height: 700,
                                minWidth: 1024,
                                minHeight: 700,
                                resizable: false,
                                title: `${params.row.name}_会议纪要`,
                              }
                            );
                          }, 300),
                        },
                        { default: () => "会议纪要" }
                      ),
                      h(
                        resolveComponent("DropdownItem"),
                        {
                          disabled: params.row.fileUpload == 0,
                          onClick: _.debounce(async function () {
                            // console.log(params.row);
                            const result = await ipcRenderer.invoke(
                              "open-win",
                              {
                                type: 0,
                                urlName: `models/meet/video?name=${params.row.name}&id=${params.row.id}`,
                                width: 1500,
                                height: 700,
                                minWidth: 1500,
                                minHeight: 700,
                                resizable: true,
                                title: `${params.row.name}_会议视频`,
                              }
                            );
                          }, 300),
                        },
                        { default: () => "视频播放" }
                      ),
                    ],
                  }
                ),
            }
          ),
          // h(SvgIcon,{})
        ]),
      ]);
    },
  },
  {
    title: "会议保密",
    key: "secrecy",
    align: "center",
    width: 100,
    render: (h: any, params: any) => {
      return h(
        resolveComponent("Switch"),
        {
          "model-value": params.row.secrecy,
          size: "large",
          "true-value": 1,
          "false-value": 0,
          loading: params.row.isSecrecyLoading,
          "before-change": () => {
            return useSwitchMultiple(
              {
                id: params.row.id,
                secrecy: params.row.secrecy ? 0 : 1,
              },
              () => {
                params.row.isSecrecyLoading = true;
              },
              () => {
                params.row.isSecrecyLoading = false;
              }
            );
          },
          onOnChange: (val: number) => {
            params.row.secrecy = val;
            tableData.value[params.index].secrecy = val;
          },
        },
        {
          open: () => h("span", {}, "保密"),
          close: () => h("span", {}, "公开"),
        }
      );
    },
  },
  {
    title: "会议分享",
    key: "meetShare",
    width: 100,
    align: "center",
    render: (h: any, params: any) => {
      return h(
        resolveComponent("Switch"),
        {
          "model-value": params.row.meetShare,
          size: "large",
          "true-value": 0,
          "false-value": 1,
          loading: params.row.isMeetShareLoading,
          "before-change": () => {
            return useSwitchMultiple(
              {
                id: params.row.id,
                meetShare: params.row.meetShare ? 0 : 1,
              },
              () => {
                params.row.isMeetShareLoading = true;
              },
              () => {
                params.row.isMeetShareLoading = false;
              }
            );
          },
          onOnChange: (val: number) => {
            params.row.meetShare = val;
            tableData.value[params.index].meetShare = val;
          },
        },
        {
          open: () => h("span", {}, "允许"),
          close: () => h("span", {}, "禁止"),
        }
      );
    },
  },
  {
    title: "创建人",
    key: "createUserName",
    tooltip: true,
    width: 120,
  },
  {
    title: "会议时间",
    key: "createTime",
    minWidth: 160,
  },
]);

// 获取数据
let tableData = ref<any[]>([]);
let total = ref<number>(0);
let loading = ref<boolean>(false);

const getTableData = (params: SearchType) => {
  loading.value = true;
  getMeetingById(params)
    .then((res) => {
      selectNum.value = 0;
      disabledNum = 0;
      emit("delChange");
      selAll.value = false;
      res.data?.records.map((item) => {
        if (item.state == 0) {
          disabledNum++;
        }
        item.select = false;
        item.isSecrecyLoading = false;
        item.isMeetShareLoading = false;
      });

      tableData.value = res.data?.records || [];
      total.value = res.data?.total || 0;
      emit("uploadData");
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};

// 全选删除 功能
let selAll = ref<boolean>(false);
let selectNum = ref<number>(0); //选中数量
let disabledNum = 0; //禁止选择的数量
// 删除功能调用
const delFun = () => {
  let temp: any[] = [];
  tableData.value.map((item) => {
    console.log(item.state, item.select);
    if (item.state != 0 && item.select == true) {
      temp.push(item.id);
    }
  });
  deleteByIds({
    ids: temp.toString(),
  }).then((res) => {
    getTableData(props.search);
  });
};

let tableHeight = ref<number>();
const refTable = ref<HTMLElement>();
onMounted(() => {
  tableHeight.value = refTable.value?.clientHeight;
  window.onresize = () => {
    tableHeight.value = refTable.value?.clientHeight;
  };
});
defineExpose({
  total,
  tableData,
  selectNum,
  getTableData,
  delFun,
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
:deep(.ivu-tooltip-rel) {
  font-size: 16px;
}
:deep(.ivu-table-body) {
  .ivu-table-cell {
    font-size: 16px;
  }
}
:deep(.meetNameBox) {
  .size(100%, 70px);
  .mNameLeft {
    height: 100%;
    padding: 10px 0px;
    box-sizing: border-box;
    .mNameTxt {
      font-size: 16px;
      cursor: pointer;
    }
    .mNameTxt.ivu-typography {
      color: @f_color_active;
    }
    .meetLeftBottom {
      width: 100%;
      .mStatus {
        width: 72px;
        flex-shrink: 0;
        .iconStatus {
          .size(10px,10px);
          border-radius: 50%;
          margin-right: 4px;
        }
        .statusTxt {
          font-size: 14px;
        }
      }
      .equipmentBox {
        width: calc(100% - 72px);
        .iconEquip {
          flex-shrink: 0;
          margin-right: 6px;
        }
        .equipTxt {
          font-size: 14px;
          color: @fontColor;
        }
      }
    }
  }
  .mNameRight {
    display: none;
    .size(auto, 100%);
    padding-left: 10px;
    flex-shrink: 0;
    .iconOpt {
      /* border: 10px solid transparent;
      background-clip: padding-box; */
      cursor: pointer;
      margin-left: 10px;
    }
  }
  &:hover {
    .mNameRight {
      display: flex;
    }
  }
}
.mTable {
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
