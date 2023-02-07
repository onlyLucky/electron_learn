<!--
 * @Author: fg
 * @Date: 2023-02-06 11:43:09
 * @LastEditors: fg
 * @LastEditTime: 2023-02-07 15:50:22
 * @Description: 文件列表的块状组件
-->
<template>
  <div class="table" ref="refTable">
    <Table :columns="columns" :data="tData" :height="tableHeight"></Table>
  </div>
</template>
<script setup lang="ts">
import { useType } from "./useType";
import { useRoute } from "vue-router";
import { getAllFileByMeetId } from "@/apis/meet";
import { useBytesUnit } from "@/hooks/useTools";
const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
// props
/* let props = withDefaults(
  defineProps<{
    columns: any[]; 
  }>(),
  {
    columns: () => [],
  }
); */
const columns = [
  {
    type: "selection",
    width: 60,
    align: "center",
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
              h("div", { class: "fileInfo f-col-c-s" }, [
                h(
                  resolveComponent("Text"),
                  {
                    placement: "bottom-start",
                    ellipsis: true,
                    style: { fontSize: "16px" },
                    "ellipsis-config": { tooltip: true },
                  },
                  params.row.realName
                ),
                h("p", { class: "fileStatus" }, "已下载"),
              ]),
            ]
          ),
          h(
            "div",
            {
              class: "fileRight f-row-e-c",
            },
            [
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
                    h(resolveComponent("Icon"), {
                      type: "ios-more",
                      class: "iconOpt",
                      size: "26",
                    }),
                  ],
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
  },
  {
    title: "下载时间",
    key: "updateTime",
    width: 150,
    sortable: true,
  },
];
const refTable = ref<HTMLElement>();
let tableHeight = ref<number>();

let tData = reactive<any[]>([]);
onMounted(() => {
  tableHeight.value = refTable.value?.clientHeight;
  getData();
  window.onresize = () => {
    tableHeight.value = refTable.value?.clientHeight;
  };
});
const getData = () => {
  getAllFileByMeetId({ meetId: queryParams.id }).then((res) => {
    res.data.map((item: any, index: number) => tData.push(item));
  });
};
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
</style>
