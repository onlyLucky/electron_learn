/*
 * @Author: fg
 * @Date: 2022-12-29 10:13:16
 * @LastEditors: fg
 * @LastEditTime: 2022-12-29 19:59:18
 * @Description: 会议列表数据表格组件
 */

import { Table } from "view-ui-plus";
import { PropType, defineExpose } from "vue";
import { getMeetingById } from "@/apis/meet";

const columns = reactive<any[]>([
  {
    title: "设备名称",
    key: "deviceName",
    width: 200,
    render: (h: any, params: any) => {
      if (params.row.deviceName.length > 10) {
        return h(
          resolveComponent("Tooltip"),
          {
            content: params.row.deviceName,
            placement: "top",
          },
          [
            h(
              "div",
              {
                // title: params.row.deviceName,
                style: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              },
              params.row.deviceName
            ),
          ]
        );
      } else {
        return h(
          "div",
          {
            // title: params.row.deviceName,
            style: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          },
          params.row.deviceName
        );
      }
    },
  },
  {
    title: "会议名称",
    key: "name",
    width: 300,
    render: (h: any, params: any) => {
      return h(
        "div",
        {
          // title: params.row.deviceName,
          style: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "var(--f_color_active)",
            cursor: "pointer",
            onClick: () => {
              goDetail(params.row);
            },
          },
          class: "meetingName",
        },
        params.row.name
      );
    },
  },
  {
    title: "状态",
    key: "state",
    minWidth: 80,
    render: (h: any, params: any) => {
      let state = [
        {
          name: "进行中",
          color: "pink",
        },
        {
          name: "已结束",
          color: "#999",
        },
      ];
      h(
        resolveComponent("Tag"),
        {
          type: "border",
          color: state[params.row.state].color,
          style: {
            cursor: "default",
          },
        },
        state[params.row.state].name
      );
    },
  },
  {
    title: "创建人",
    key: "originatorName",
    minWidth: 120,
  },
  {
    title: "保密会议",
    key: "createName",
    minWidth: 80,
  },
  {
    title: "会议分享",
    key: "createName",
    minWidth: 80,
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
    minWidth: 200,
    fixed: "right",
  },
]);

// 获取数据
let tableData = ref<any[]>([]);
let total = ref<number>(0);
const getTableData = (params: SearchType, emit: any) => {
  getMeetingById(params).then((res) => {
    tableData.value = res.data?.records || [];
    total.value = res.data?.total || 0;
    emit("uploadData", total.value);
  });
};
// 去详情
const goDetail = (item: any) => {
  console.log(item);
};

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
