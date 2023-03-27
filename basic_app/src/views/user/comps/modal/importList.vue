<!--
 * @Author: fg
 * @Date: 2023-03-27 09:56:54
 * @LastEditors: fg
 * @LastEditTime: 2023-03-27 11:34:20
 * @Description: 导入xlsx解析数据列表
-->
<template>
  <Modal
    v-model="isShow"
    width="900"
    class-name="userParseModal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">导入数据处理</h1>
    </template>
    <div class="content">
      <Table
        :columns="columns"
        :data="tData"
        :loading="loading"
        height="500"
        @on-selection-change="onSelect"
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
import { postImportUser } from "@/apis/user";
import _ from "lodash";

let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let isShow = ref<boolean>(false);
let staticPath = localStorage.getItem("staticPath");

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
    title: "用户",
    key: "name",
    minWidth: 200,
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
              h("div", { class: "equipValue f-col-c-s" }, [
                h("div", { class: "avatar f-row-c-c" }, [
                  h("img", {
                    class: "avatarImg",
                    src: staticPath + params.row.avatarPath,
                    style: {
                      display: params.row.avatarPath ? "block" : "none",
                    },
                  }),
                  h(
                    "div",
                    {
                      class: "avatarBox f-row-c-c",
                      style: {
                        display: params.row.avatarPath ? "none" : "flex",
                      },
                    },
                    [h("span", {}, params.row.nickname.slice(-2))]
                  ),
                  h(
                    "div",
                    {
                      class: "genderBox",
                      style: {
                        display:
                          params.row.userSex == "男" ||
                          params.row.userSex == "女"
                            ? "block"
                            : "none",
                      },
                    },
                    [
                      h(resolveComponent("SvgIcon"), {
                        iconName: "icon-nan",
                        class: "iconGender",
                        color: "var(--f_color_active)",
                        style: {
                          display:
                            params.row.userSex == "男" ? "block" : "none",
                        },
                        size: "16",
                      }),
                      h(resolveComponent("SvgIcon"), {
                        iconName: "icon-nv",
                        class: "iconGender",
                        color: "var(--error)",
                        style: {
                          display:
                            params.row.userSex == "女" ? "block" : "none",
                        },
                        size: "16",
                      }),
                    ]
                  ),
                ]),
              ]),
              h("div", { class: "equipInfo f-col-b-s" }, [
                h(
                  resolveComponent("Text"),
                  {
                    placement: "bottom-start",
                    ellipsis: true,
                    class: "equipNameTxt f-row-c-c",
                    style: { fontSize: "16px" },
                    "ellipsis-config": { tooltip: true },
                    onClick: _.debounce(function () {
                      // emit("onDetail", params.row, false);
                    }, 300),
                  },
                  {
                    default: () => [
                      h("span", { class: "nickname" }, params.row.nickname),
                      h(
                        "span",
                        {
                          class: "careerName",
                          style: {
                            display: params.row.careerName ? "block" : "none",
                          },
                        },
                        params.row.careerName
                          ? `(${params.row.careerName})`
                          : ""
                      ),
                    ],
                  }
                ),
                h(
                  "div",
                  {
                    class: "equipBottom f-row-s-c",
                    style: {},
                  },
                  [
                    h(
                      resolveComponent("Tooltip"),
                      {
                        content: params.row.errorMsg,
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
                    ),
                  ]
                ),
              ]),
            ]
          ),
        ]
      );
    },
  },
  {
    title: "登录账号",
    align: "center",
    key: "userName",
    tooltip: true,
    width: 120,
  },
  {
    title: "部门",
    key: "deptName",
    tooltip: true,
    width: 140,
  },
  {
    title: "入职时间",
    key: "enterTime",
    tooltip: true,
    width: 120,
  },
  {
    title: "手机号",
    key: "phone",
    tooltip: true,
    width: 160,
  },
];
let tData = reactive<any[]>([]);
let selectArr = ref<any[]>([]);
const onSelect = (selection: any) => {
  selectArr.value = selection;
};
// 处理数据列表
const handleData = (list: any[]) => {
  let temp: any[] = [];
  list.map((item) => {
    item._disabled = !item.isSucceed;
    if (!item._disabled) {
      item._checked = true;
      temp.push(item);
    }
  });
  selectArr.value = temp;
  tData = [...list];
};
// 加载
let loading = ref<boolean>(false);
// 确认导入
const formImport = () => {
  if (selectArr.value.length > 0) {
    loading.value = true;
    postImportUser({ importData: selectArr.value })
      .then((res) => {
        loading.value = false;
        isShow.value = false;
        Message.success("用户导入成功");
      })
      .catch((err) => {
        loading.value = false;
        isShow.value = false;
        Message.error(err || "用户导入失败");
      });
  } else {
    Message.info("未选择需要导入的人员");
  }
};

defineExpose({
  handleShow,
  handleData,
});
</script>
<style lang="less">
.conLoadingTxt {
  margin-top: 10px;
  white-space: nowrap;
}
.userParseModal {
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
          .equipValue {
            .size(66px,66px);
            flex-shrink: 0;
            margin-right: 10px;
            .avatar {
              .size(60px,60px);
              position: relative;
              .avatarImg {
                .size(50px,50px);
              }
              .avatarBox {
                .size(50px,50px);
                border-radius: 6px;
                background-color: @f_color_active;
                span {
                  font-size: 14px;
                  color: @bg;
                }
              }
              .genderBox {
                position: absolute;
                bottom: 0px;
                right: 0px;
                background: @bg;
                padding: 2px;
                border-radius: 50%;
                border: 1px solid @search_bottom_border;
              }
            }
          }
          .equipInfo {
            height: 56px;
            // padding: 10px 0;
            box-sizing: border-box;
            .equipNameTxt {
              cursor: pointer;
              color: @f_color_active;
              .careerName {
                font-size: 12px;
                color: @fontColor;
                margin-left: 10px;
              }
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
