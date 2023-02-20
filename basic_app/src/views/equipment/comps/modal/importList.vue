<!--
 * @Author: fg
 * @Date: 2023-02-20 15:34:10
 * @LastEditors: fg
 * @LastEditTime: 2023-02-20 18:32:27
 * @Description: 导入设备列表
-->
<template>
  <Modal
    v-model="isShow"
    width="900"
    class-name="Modal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">导入数据处理</h1>
    </template>
    <div class="content">
      <Table
        :columns="columns"
        :data="tData"
        height="500"
        @on-selection-change="onSelect"
      ></Table>
    </div>
    <template #footer>
      <Badge :count="selectArr.length">
        <Button type="primary" :loading="loading" v-debounce="formImport">
          确认导入
        </Button>
      </Badge>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Message } from "view-ui-plus";
import { postImportDevice } from "@/apis/equipment";
import _ from "lodash";

let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let isShow = ref<boolean>(false);
const handleShow = () => {
  isShow.value = true;
};
// 表格部分
const columns: any[] = [
  {
    type: "selection",
    width: 60,
    align: "center",
  },
  {
    title: "设备",
    key: "name",
    minWidth: 320,
    render: (h: any, params: any) => {
      return h(
        "div",
        {
          class: "equipName f-row-b-c",
        },
        [
          h(
            "div",
            {
              class: "equipLeft f-row-s-c",
            },
            [
              h("div", { class: "equipInfo f-col-b-s" }, [
                h(
                  resolveComponent("Text"),
                  {
                    placement: "bottom-start",
                    ellipsis: true,
                    class: "equipNameTxt",
                    style: { fontSize: "16px" },
                    "ellipsis-config": { tooltip: true },
                  },
                  () => params.row.name
                ),
                h(
                  "div",
                  {
                    class: "equipBottom f-row-s-c",
                    style: {},
                  },
                  h(
                    resolveComponent("Tooltip"),
                    {
                      content: "设备已存在",
                      placement: "bottom-start",
                      transfer: true,
                      disabled: params.row.isSucceed,
                    },
                    {
                      default: () =>
                        h("div", { class: "f-row-s-c" }, [
                          h("div", { class: "equipStatusBox f-row-c-c" }, [
                            h(resolveComponent("Icon"), {
                              type: "ios-checkmark-circle",
                              color: "var(--f_color_active)",
                              class: "equipStatusIcon",
                              style: {
                                display: params.row.isSucceed
                                  ? "block"
                                  : "none",
                              },
                              size: "18",
                            }),
                            h(resolveComponent("Icon"), {
                              type: "ios-close-circle",
                              color: "var(--error)",
                              class: "equipStatusIcon",
                              style: {
                                display: !params.row.isSucceed
                                  ? "block"
                                  : "none",
                              },
                              size: "18",
                            }),
                            h(
                              "div",
                              {
                                class: "equipStatus",
                                style: {
                                  color: params.row.isSucceed
                                    ? "var(--f_color_active)"
                                    : "var(--error)",
                                },
                              },
                              params.row.isSucceed ? "验证通过" : "验证失败"
                            ),
                          ]),

                          h(
                            "span",
                            { class: "equipBite" },
                            params.row.hardDiskSize
                          ),
                        ]),
                    }
                  )
                ),
              ]),
            ]
          ),
          h(
            "div",
            {
              class: "equipRight f-row-e-c",
            },
            [
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
                      color: "var(--f_color_h3)",
                      size: "22",
                    }),
                  ],
                }
              ),
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
                      },
                      // <Icon type="ios-more" />
                      {
                        default: () => [
                          h(resolveComponent("SvgIcon"), {
                            iconName: "icon-gengduo",
                            color: "var(--f_color_h3)",
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
                            {},
                            { default: () => "设置管理员" }
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
    title: "设备编码",
    key: "code",
    minWidth: 150,
    maxWidth: 300,
    render: (h: any, params: any) => {
      return h(
        resolveComponent("Text"),
        {
          placement: "bottom-start",
          ellipsis: true,
          class: "equipTItem",
          style: { fontSize: "14px" },
          "ellipsis-config": { tooltip: true },
        },
        () => params.row.code
      );
    },
  },
  {
    title: "软件版本",
    key: "softwareVersion",
    minWidth: 150,
    maxWidth: 300,
    render: (h: any, params: any) => {
      return h(
        resolveComponent("Text"),
        {
          placement: "bottom-start",
          ellipsis: true,
          class: "equipTItem",
          style: { fontSize: "14px" },
          "ellipsis-config": { tooltip: true },
        },
        () => params.row.softwareVersion
      );
    },
  },
  {
    title: "鼠标数量",
    align: "center",
    key: "mouseNum",
    width: 100,
  },
];
let tData = reactive<any[]>([]);
let selectArr = ref<any[]>([]);
const onSelect = (selection: any) => {
  selectArr.value = selection;
};
// 处理数据列表
const handleData = (list: any[]) => {
  list.map((item) => {
    item._disabled = !item.isSucceed;
  });
  tData = [...list];
};
// 加载
let loading = ref<boolean>(false);
// 确认导入
const formImport = () => {
  if (selectArr.value.length > 0) {
    postImportDevice({ importData: selectArr.value })
      .then((res) => {
        Message.success("设备导入成功");
      })
      .catch((err) => {
        Message.error(err || "设备导入失败");
      });
  } else {
    Message.info("未选择需要导入的设备");
  }
};

defineExpose({
  handleShow,
  handleData,
});
</script>
<style lang="less">
.Modal {
  user-select: none;
  .mTitle {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    // @fontColor
    color: #666;
  }
  .content {
    .size(100%, 500px);
    background-color: pink;
  }
  .ivu-modal {
    top: 0;
  }
  .ivu-modal-content {
    .ivu-modal-close {
      top: 22px;
    }
    .ivu-modal-header {
      border-bottom: none;
      display: flex;
    }
    .ivu-modal-body {
      padding: 0px 16px;
      .ivu-form-item-error .ivu-input,
      .ivu-input {
        border: none;
      }
      .ivu-input {
        font-size: 14px;
      }
      .ivu-form-item-error .ivu-input:focus,
      .ivu-date-picker-focused input:not([disabled]),
      .ivu-input:focus {
        box-shadow: none;
      }
      .ivu-form-item-error-tip {
        padding-left: 10px;
        font-size: 12px;
      }
      .ivu-form-item {
        margin-bottom: 0px;
      }
      .ivu-input-number-input {
        text-align: center;
      }
      .ivu-input-number-controls-outside-btn i {
        font-size: 20px;
      }
      .ivu-input-group-append,
      .ivu-input-group-prepend {
        background-color: transparent;
        border: none;
      }
      .ivu-table th {
        background-color: @bg;
        border-bottom: none;
        color: @fontColor;
        font-weight: 400;
      }
      .ivu-table td {
        border-bottom: none;
      }
      .ivu-table:before {
        display: none;
      }
      .ivu-typography {
        color: @f_color_h3;
      }
      .ivu-table-header thead tr th {
        padding: 16px 0px;
      }
      .equipTItem {
        color: @f_color_h3;
      }
      .equipName {
        .size(100%, 70px);

        .equipLeft {
          .size(100%,100%);
          .equipInfo {
            height: 56px;
            // padding: 10px 0;
            box-sizing: border-box;
            .equipNameTxt {
              cursor: pointer;
              color: @f_color_active;
            }
            .equipBottom {
              font-size: 12px;
              color: @fontColor;
              .equipBite {
              }
              .equipStatusBox {
                cursor: pointer;
                .equipStatusIcon {
                  margin-right: 6px;
                }
                .equipStatus {
                  margin-right: 10px;
                }
              }
            }
          }
        }
        .equipRight {
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
          .equipRight {
            display: flex;
          }
        }
      }
    }
    .ivu-modal-footer {
      border-top: none;
    }
  }
}
</style>
