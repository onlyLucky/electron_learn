<!--
 * @Author: fg
 * @Date: 2023-02-06 11:43:09
 * @LastEditors: fg
 * @LastEditTime: 2023-02-06 18:01:31
 * @Description: 文件列表的块状组件
-->
<template>
  <div class="table">
    <Table
      :columns="columns"
      :data="tData"
      style="width: 100%; height: 100%"
    ></Table>
  </div>
</template>
<script setup lang="ts">
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
              class: "fileLeft f-row-c-c",
            },
            [
              h("img", { src: "" }),
              h("div", { class: "fileInfo" }, [
                h("h1", {}, "文件名称"),
                h("p", {}, "已下载"),
              ]),
            ]
          ),
          h(
            "div",
            {
              class: "fileRight",
            },
            []
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

let tData = [
  {
    id: 1573,
    type: 10,
    length: null,
    code: null,
    isChild: 0,
    parentId: 0,
    deviceId: 18,
    deviceName: null,
    realName: "继续测试长视频-1.mp4",
    fileSize: 145940772,
    createTime: "2022-10-27 17:04",
    updateTime: "2022-10-27 17:05",
  },
];
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
:deep(.fileName) {
  .size(100%,60px);
  background-color: pink;
}
.table {
  .size(100%,100%);
  h1 {
    font-size: 30px;
  }
}
</style>
