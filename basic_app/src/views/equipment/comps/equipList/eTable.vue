<!--
 * @Author: fg
 * @Date: 2023-02-14 10:26:32
 * @LastEditors: fg
 * @LastEditTime: 2023-02-21 11:05:55
 * @Description: 设备列表
-->
<template>
  <div class="eTable" ref="refTable">
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
import { useBytesUnit } from "@/hooks/useTools";
import { getDevicePage, deleteEquipByIds } from "@/apis/equipment";
import _ from "lodash";
export type ParamsType = {
  pageSize: number;
  pageNum: number;
  name?: string;
};
let emit = defineEmits<{
  (e: "onDel"): void;
  (e: "onSelectChange", len: number): void;
  (e: "onDetail", item: any): void;
}>();
const columns = [
  {
    type: "selection",
    width: 60,
    align: "center",
  },
  {
    title: "设备",
    key: "name",
    minWidth: 450,
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
                h(
                  resolveComponent("Circle"),
                  {
                    percent:
                      (params.row.localStoreUseSize / params.row.hardDiskSize) *
                      100,
                    size: 80,
                    strokeWidth: 7,
                    trailWidth: 7,
                    dashboard: true,
                    strokeColor: "var(--f_color_active)",
                  },
                  () => [
                    h("div", { class: "equipValueTxt" }, [
                      h("p", { class: "eValueTxt1" }, "剩余"),
                      h(
                        "p",
                        { class: "eValueTxt2" },
                        useBytesUnit(
                          params.row.hardDiskSize - params.row.localStoreUseSize
                        )
                      ),
                    ]),
                  ]
                ),
              ]),
              h("div", { class: "equipInfo f-col-b-s" }, [
                h(
                  resolveComponent("Text"),
                  {
                    placement: "bottom-start",
                    ellipsis: true,
                    class: "equipNameTxt",
                    style: { fontSize: "16px" },
                    "ellipsis-config": { tooltip: true },
                    onClick: _.debounce(function () {
                      emit("onDetail", params.row);
                    }, 300),
                  },
                  () => params.row.name
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
                            params.row.status == 10 || params.row.status == 20
                              ? "var(--success)"
                              : "var(--fontColor)",
                        },
                      },
                      params.row.status == 10
                        ? "已创建"
                        : params.row.status == 20
                        ? "使用中"
                        : "停用中"
                    ),
                    h(
                      "span",
                      { class: "equipBite" },
                      `${useBytesUnit(
                        params.row.localStoreUseSize
                      )} / ${useBytesUnit(params.row.hardDiskSize)}`
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
                          h(
                            resolveComponent("DropdownItem"),
                            {
                              onClick: _.debounce(function () {
                                console.log(params.row);
                                console.log("onClick");
                                selectArr.value = [params.row.id];
                                emit("onDel");
                              }, 300),
                            },
                            { default: () => "删除设备" }
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
    minWidth: 160,
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
    minWidth: 160,
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
const refTable = ref<HTMLElement>();
let tableHeight = ref<number>();
let tData = reactive<any[]>([]);
let selectArr = ref<any[]>([]);
const onSelect = (selection: any) => {
  let temp: any[] = [];
  selection.map((item: any) => {
    temp.push(item.id);
  });
  selectArr.value = temp;

  emit("onSelectChange", selection.length);
};
onMounted(() => {
  tableHeight.value = refTable.value?.clientHeight;
  window.onresize = () => {
    tableHeight.value = refTable.value?.clientHeight;
  };
});

let loading = ref<boolean>(false);
const getData = (params: ParamsType, callBack: Function) => {
  loading.value = true;
  tData.length = 0;
  getDevicePage(params)
    .then((res) => {
      // tData = [...res.data.records];
      res.data.records.map((item: any) => {
        tData.push(item);
      });
      if (callBack) {
        callBack(res);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
const onDel = (cb: Function) => {
  deleteEquipByIds({ ids: selectArr.value.toString() }).then((res) => {
    if (cb) {
      cb();
    }
    emit("onSelectChange", 0);
  });
};
defineExpose({
  selectArr,
  getData,
  onDel,
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
:deep(.equipName) {
  .size(100%, 86px);

  .equipLeft {
    .size(100%,100%);
    .equipValue {
      .size(80px,100px);
      flex-shrink: 0;
      margin-right: 24px;
      .equipValueTxt {
        color: @fontColor;
        .eValueTxt1 {
          font-size: 10px;
          margin-bottom: 4px;
        }
        .eValueTxt2 {
          font-size: 12px;
        }
      }
    }
    .equipInfo {
      height: 100px;
      padding: 20px 0;
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
.conLoadingTxt {
  margin-top: 10px;
  white-space: nowrap;
}
.eTable {
  .size(100%,100%);
  h1 {
    font-size: 30px;
  }
}
</style>
