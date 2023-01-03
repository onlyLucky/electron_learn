/*
 * @Author: fg
 * @Date: 2022-12-29 10:13:16
 * @LastEditors: fg
 * @LastEditTime: 2023-01-03 18:16:12
 * @Description: 会议列表数据表格组件
 */

import { Table } from "view-ui-plus";
import { PropType, defineExpose } from "vue";
import { getMeetingById } from "@/apis/meet";
import style from "./style.module.less";

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
              selectNum = c ? tableData.value.length - disabledNum : 0;
            }
          });
          tableData.value = tempData;
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
                params.row.select = value;
              },
              onOnChange: (c: boolean) => {
                c ? selectNum++ : selectNum--;
                selAll.value =
                  selectNum + disabledNum == tableData.value.length;
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
      let state = [
        {
          name: "非保密",
          color: "var(--fontColor)",
        },
        {
          name: "保密",
          color: "var(--f_color_active)",
        },
      ];
      return h(
        resolveComponent("Switch"),
        {
          "model-value": params.row.secrecy,
          size: "large",
          "true-value": 1,
          "false-value": 0,
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
          onChange: (value: any) => {
            console.log(value);
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
                  onClick: () => {
                    console.log(params.row);
                  },
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
                  onClick: () => {
                    console.log(params.row);
                  },
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
                  onClick: () => {
                    console.log(params.row);
                  },
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
                  onClick: () => {
                    console.log(params.row);
                  },
                }),
              ],
            }
          ),
        ]
      );
    },
  },
]);

// 获取数据
let tableData = ref<any[]>([]);
let total = ref<number>(0);
const getTableData = (params: SearchType, emit: any) => {
  getMeetingById(params).then((res) => {
    res.data?.records.map((item) => {
      if (item.state == 0) {
        disabledNum++;
      }
      item.select = false;
    });
    tableData.value = res.data?.records || [];
    total.value = res.data?.total || 0;
    console.log(tableData.value, "tableData.value");
    emit("uploadData", total.value);
  });
};
// 去详情
const goDetail = (item: any) => {
  console.log(item);
};

// 全选删除 功能
let selAll = ref<boolean>(false);
let selectNum = 0; //选中数量
let disabledNum = 0; //禁止选择的数量

export type SearchType = {
  name?: string;
  dataValue?: any[];
  deviceId?: string | number;
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
        pageSize: 10,
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
  data() {
    return {
      total,
      tableData,
    };
  },
  // 这里居然还可以使用data method
  setup(props, ctx) {
    const { expose, emit } = ctx;
    // 导出属性，ref 中可以使用
    expose({
      total,
      tableData,
    });
    getTableData(props.search, emit);
    return () => (
      <Table
        width={props.size.width}
        height={props.size.height}
        data={tableData.value}
        columns={columns}
      ></Table>
    );
  },
});
