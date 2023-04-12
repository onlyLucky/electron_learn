<!--
 * @Author: fg
 * @Date: 2023-03-17 14:52:20
 * @LastEditors: fg
 * @LastEditTime: 2023-04-11 14:31:59
 * @Description: 用户列表表格组件
-->
<template>
  <div class="useTable" ref="refTable">
    <Table
      :columns="columns"
      :data="tData"
      :height="tableHeight"
      :loading="loading"
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
</template>
<script setup lang="ts">
import {
  getUserByDeptIdPage,
  getUserList,
  getUserCareer,
  deleteUser,
  quitJobUser,
} from "@/apis/user";
import _ from "lodash";
import { Modal } from "view-ui-plus";

let emit = defineEmits<{
  (e: "onDel"): void;
  (e: "upload"): void;
  (e: "onResetPwa", id: number): void;
  (e: "onDetail", item: any, flag: boolean): void;
}>();

const refTable = ref<HTMLElement>();
let tableHeight = ref<number>();

let staticPath = localStorage.getItem("staticPath");

const columns = [
  {
    type: "selection",
    width: 60,
    align: "center",
  },
  {
    title: "用户",
    key: "name",
    minWidth: 360,
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
                          params.row.userSex == 2 || params.row.userSex == 1
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
                          display: params.row.userSex == 1 ? "block" : "none",
                        },
                        size: "16",
                      }),
                      h(resolveComponent("SvgIcon"), {
                        iconName: "icon-nv",
                        class: "iconGender",
                        color: "var(--error)",
                        style: {
                          display: params.row.userSex == 2 ? "block" : "none",
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
                      emit("onDetail", params.row, false);
                    }, 300),
                  },
                  {
                    default: () => [
                      h("span", { class: "nickname" }, params.row.nickname),
                      h(
                        "span",
                        {
                          class: "careerName",
                        },
                        computedCaeerName(params.row.careerId)
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
                      "div",
                      {
                        class: "equipStatus",
                        style: {
                          color:
                            params.row.status != 1
                              ? "var(--success)"
                              : "var(--fontColor)",
                        },
                      },
                      params.row.status == 1 ? "离职" : "在职"
                    ),
                  ]
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
                      color: "var(--f_color_h6)",
                      size: "22",
                      onClick: _.debounce(function () {
                        emit("onDetail", params.row, true);
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
                    params.index >= tData.length - 2
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
                        disabled: true,
                        transfer: true,
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
                              onClick: _.debounce(function () {
                                emit("onResetPwa", params.row.id);
                              }, 300),
                            },
                            { default: () => "重置密码" }
                          ),
                          h(
                            resolveComponent("DropdownItem"),
                            {
                              style: {
                                display:
                                  params.row.status == 0 ? "block" : "none",
                              },
                              onClick: _.debounce(function () {
                                Modal.confirm({
                                  title: "是否确认执行离职操作",
                                  loading: true,
                                  onOk: () => {
                                    quitJobUser({ userId: params.row.id }).then(
                                      (res) => {
                                        Modal.remove();
                                        emit("upload");
                                      }
                                    );
                                  },
                                });
                              }, 300),
                            },
                            { default: () => "离职" }
                          ),
                          h(
                            resolveComponent("DropdownItem"),
                            {
                              onClick: _.debounce(function () {
                                selectArr.value = [params.row.id];
                                emit("onDel");
                              }, 300),
                            },
                            { default: () => "删除用户" }
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
    title: "登录账号",
    align: "center",
    key: "userName",
    tooltip: true,
    width: 150,
  },
  {
    title: "联系方式",
    key: "phone",
    tooltip: true,
    width: 180,
  },
  {
    title: "邮箱",
    key: "email",
    tooltip: true,
    width: 240,
  },
];

// 数据总数total
let pageTotal = ref<number>(0);
let loading = ref<boolean>(false);
let tData = reactive<any[]>([]);

// 选择
let selectArr = ref<any[]>([]);
const onSelect = (selection: any) => {
  let temp: any[] = [];
  selection.map((item: any) => {
    temp.push(item.id);
  });
  selectArr.value = temp;
};
// 根据用户信息搜索
const getDataByUser = (params: any) => {
  loading.value = true;
  tData.length = 0;
  getUserList(params)
    .then((res) => {
      // tData = [...res.data.records];
      res.data.records.map((item: any) => {
        tData.push(item);
      });
      pageTotal.value = res.data.total;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
// 根据组织搜索
const getDataByDept = (params: any) => {
  loading.value = true;
  tData.length = 0;
  getUserByDeptIdPage(params)
    .then((res) => {
      // tData = [...res.data.records];
      res.data.records.map((item: any) => {
        tData.push(item);
      });
      pageTotal.value = res.data.total;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};

// 获取职位列表
let careerMap = ref<any[]>([]);
const getUserCareerData = () => {
  careerMap.value = [];
  getUserCareer({}).then((res) => {
    careerMap.value = res.data;
  });
};

// 删除用户
const onDel = (cb: Function) => {
  deleteUser({ ids: selectArr.value.toString() }).then((res) => {
    if (cb) {
      cb();
    }
    selectArr.value = [];
  });
};

const onSingDelCancel = () => {
  selectArr.value = [];
};

const computedCaeerName: any = (id: any) => {
  let temp = "";
  careerMap.value.map((item: any) => {
    if (item.id == Number(id)) {
      temp = item.caeerName;
    }
  });
  if (temp) {
    temp = `(${temp})`;
  }
  return temp;
};

const onResizeHeight = () => {
  console.log("onResizeHeight--");
  tableHeight.value = refTable.value?.clientHeight;
};

onMounted(() => {
  tableHeight.value = refTable.value?.clientHeight;
  getUserCareerData();
});
defineExpose({
  pageTotal,
  selectArr,
  getDataByUser,
  getDataByDept,
  getUserCareerData,
  onDel,
  onSingDelCancel,
  onResizeHeight,
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
:deep(.ivu-table-header thead tr th) {
  padding: 16px 0px;
}
:deep(.equipTItem) {
  color: @f_color_h3;
}
:deep(.ivu-tooltip-rel) {
  font-size: 16px;
}
:deep(.ivu-table-body) {
  .ivu-table-cell {
    font-size: 16px;
  }
  .ivu-typography {
    font-size: 16px;
  }
}
:deep(.equipName) {
  .size(100%, 66px);

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
      height: 66px;
      padding: 10px 0;
      box-sizing: border-box;

      .equipNameTxt {
        cursor: pointer;
        color: @f_color_active;
        .careerName {
          font-size: 14px;
          color: @fontColor;
          margin-left: 10px;
        }
      }
      .equipBottom {
        font-size: 14px;
        color: @fontColor;
        .equipStatus {
          margin-right: 10px;
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
.useTable {
  .size(100%,100%);
}
.conLoadingTxt {
  margin-top: 10px;
  white-space: nowrap;
}
</style>
