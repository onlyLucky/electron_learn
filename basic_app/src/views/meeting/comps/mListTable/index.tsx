/*
 * @Author: fg
 * @Date: 2022-12-29 10:13:16
 * @LastEditors: fg
 * @LastEditTime: 2023-02-08 13:34:17
 * @Description: 会议列表数据表格组件
 */

import { Table, Message, Spin, Icon } from "view-ui-plus";
import { PropType } from "vue";
import { getMeetingById, deleteByIds, reviseMeetDetail } from "@/apis/meet";
import style from "./style.module.less";
import { ipcRenderer } from "electron";
import _ from "lodash";
import { useSwitchMultiple } from "@/hooks/useMeetSwitch";

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
    title: "设备名称",
    key: "deviceName",
    minWidth: 100,
    tooltip: true,
  },
  {
    title: "会议名称",
    key: "name",
    minWidth: 200,
    tooltip: true,
    className: style.meetingName,
  },
  {
    title: "状态",
    key: "state",
    width: 100,
    align: "center",
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
      return h(
        "div",
        {
          class: "f-row-c-c",
          style: {
            cursor: "default",
          },
        },
        [
          h("span", {
            style: {
              width: "10px",
              height: "10px",
              background: state[params.row.state].color,
              borderRadius: "50%",
              marginRight: "4px",
            },
          }),
          h(
            "span",
            {
              style: {
                fontSize: "14px",
                color: state[params.row.state].color,
              },
            },
            state[params.row.state].name
          ),
        ]
      );
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
  {
    title: "操作",
    key: "action",
    align: "center",
    minWidth: 160,
    fixed: "right",
    render: (h: any, params: any) => {
      return h(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
          },
        },
        [
          h(
            resolveComponent("Tooltip"),
            {
              content: "分享列表",
              placement: "top",
              transfer: true,
            },
            {
              default: () => [
                h(resolveComponent("Button"), {
                  type: "success",
                  icon: "ios-share-alt",
                  size: "small",
                  shape: "circle",
                  style: {
                    margin: "0 2px",
                  },
                  onClick: _.debounce(function () {
                    console.log(params.row);
                  }, 300),
                }),
              ],
            }
          ),
          h(
            resolveComponent("Tooltip"),
            {
              content: "文件列表",
              placement: "top",
              transfer: true,
            },
            {
              default: () => [
                h(resolveComponent("Button"), {
                  type: "warning",
                  icon: "ios-folder",
                  size: "small",
                  shape: "circle",
                  style: {
                    margin: "0 2px",
                  },
                  onClick: _.debounce(async function () {
                    const result = await ipcRenderer.invoke("open-win", {
                      type: 0,
                      urlName: `models/meet/file?name=${params.row.name}&id=${params.row.id}`,
                      width: 900,
                      height: 600,
                      minWidth: 900,
                      minHeight: 600,
                      resizable: true,
                      title: `${params.row.name}_文件列表`,
                    });
                    // console.log(params.row);
                  }, 300),
                }),
              ],
            }
          ),
          h(
            resolveComponent("Tooltip"),
            {
              content: "会议纪要",
              placement: "top",
              transfer: true,
            },
            {
              default: () => [
                h(resolveComponent("Button"), {
                  type: "error",
                  icon: "ios-bookmark",
                  size: "small",
                  shape: "circle",
                  style: {
                    margin: "0 2px",
                  },
                  onClick: _.debounce(async function () {
                    // console.log(params.row);
                    const result = await ipcRenderer.invoke("open-win", {
                      type: 0,
                      urlName: `models/meet/summary?id=${params.row.id}`,
                      width: 1024,
                      height: 700,
                      minWidth: 1024,
                      minHeight: 700,
                      resizable: true,
                      title: `${params.row.name}_文件列表`,
                    });
                    console.log(result);
                  }, 300),
                }),
              ],
            }
          ),
          h(
            resolveComponent("Tooltip"),
            {
              content: "视频播放",
              placement: "top",
              transfer: true,
            },
            {
              default: () => [
                h(resolveComponent("Button"), {
                  type: "primary",
                  icon: "ios-videocam",
                  size: "small",
                  shape: "circle",
                  style: {
                    margin: "0 2px",
                  },
                  onClick: _.debounce(function () {
                    console.log(params.row);
                  }, 300),
                }),
              ],
            }
          ),
        ]
      );
    },
  },
]);

// 全局设置setup，emit
let emit: any;
let searchTemp = reactive<SearchType>({
  pageNum: 1,
  pageSize: 8,
  isDel: 0,
});

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
// 去详情
const tabCellTap = (row?: any, column?: any) => {
  if (column.title == "会议名称") {
    emit("detail", row);
  }
};

// 全选删除 功能
let selAll = ref<boolean>(false);
let selectNum = ref<number>(0); //选中数量
let disabledNum = 0; //禁止选择的数量
// 删除功能调用
const delFun = () => {
  if (selectNum.value == 0) {
    Message.info("暂未选择需要删除的会议");
    return false;
  }
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
    getTableData(searchTemp);
  });
};

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
interface Props {
  search: SearchType;
  size: SizeType;
}
export const MListTable = defineComponent({
  components: {
    Table,
  },
  props: {
    search: {
      type: Object as PropType<SearchType>, //Props["search"]
      default: {
        pageNum: 1,
        pageSize: 8,
        isDel: 0,
      },
    },
    size: {
      type: Object as PropType<Props["size"]>,
      default: {
        width: 770,
        height: 430,
      },
    },
  },
  // 这里居然还可以使用data method
  setup(props, ctx) {
    // const { expose, emit } = ctx;
    emit = ctx.emit;
    Object.assign(searchTemp, props.search);
    getTableData(props.search);
    // 监听搜索项的改变
    watch(props.search, (val) => {
      Object.assign(searchTemp, props.search);
    });
    // 导出属性，ref 中可以使用 ,属性需要响应式的数据
    return {
      total,
      tableData,
      selectNum,
      getTableData,
      delFun,
    };
  },
  render() {
    return (
      <Table
        width={this.size.width}
        height={this.size.height}
        data={this.tableData}
        loading={loading.value}
        columns={columns}
        onOnCellClick={tabCellTap}
      >
        {{
          loading: () => (
            <Spin
              fix
              size="large"
              style={{
                width: "120px",
                height: "120px",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Icon
                type="ios-loading"
                size={22}
                class={style.spinLoading}
              ></Icon>
              <div style={{ marginTop: "10px", fontSize: "14px" }}>
                加载中...
              </div>
            </Spin>
          ),
        }}
      </Table>
    );
  },
  unmounted() {},
});
