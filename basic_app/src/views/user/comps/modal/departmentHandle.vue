<!--
 * @Author: fg
 * @Date: 2023-03-24 17:05:17
 * @LastEditors: fg
 * @LastEditTime: 2023-03-25 10:16:38
 * @Description: 部门管理
-->
<template>
  <Modal
    v-model="isShow"
    :width="770"
    class-name="departmentModal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">部门管理</h1>
    </template>
    <div class="content">
      <vue3-tree-org
        :data="state.data"
        :node-draggable="false"
        :horizontal="state.horizontal"
        :label-style="state.style"
        :default-expand-level="3"
        :tool-bar="state.toolBar"
      />
      <!-- <h1 class="cTitle">基本信息</h1> -->
      <!-- <div class="optBox f-row-e-c">
        <Tooltip placement="bottom-end" content="新增职位">
          <div class="optItem f-row-c-c" v-debounce="showAdd">
            <svg-icon
              iconName="icon-icon-xinzeng"
              className="optIcon"
              size="24"
              color="var(--fontColor)"
            ></svg-icon>
          </div>
        </Tooltip>
      </div> -->
    </div>
    <template #footer>
      <div></div>
      <!-- <Button type="text" v-debounce="onCancel">取消</Button>
      <Button type="primary" :loading="loading" v-debounce="onConfirm"
        >重置</Button
      > -->
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Message, Modal } from "view-ui-plus";
import { getDept, getParUserByDeptId } from "@/apis/user";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
// 加载
let loading = ref<boolean>(false);
let isShow = ref<boolean>(false);
const handleShow = () => {
  isShow.value = true;
};
const state = reactive({
  data: {
    id: 1,
    label: "xxx科技有限公司",
    children: [
      {
        id: 2,
        pid: 1,
        label: "产品研发部",
        children: [
          { id: 6, pid: 2, label: "禁止编辑节点" },
          { id: 8, pid: 2, label: "禁止拖拽节点" },
          { id: 10, pid: 2, label: "测试" },
        ],
      },
      {
        id: 3,
        pid: 1,
        label: "客服部",
        children: [
          { id: 11, pid: 3, label: "客服一部" },
          {
            id: 12,
            pid: 3,
            label: "客服二部",
          },
        ],
      },
      { id: 4, pid: 1, label: "业务部" },
    ],
  },
  horizontal: true,
  expandAll: true,
  toolBar: false,
  style: {
    background: "#fff",
    color: "#5e6d82",
  },
});
/* const getData = () => {
  loading.value = true;
  getUserCareer({})
    .then((res) => {
      res.data.map((item: any) => {
        item.isEdit = false;
        item.caeerNameCopy = item.caeerName;
      });
      caeerData.value = res.data;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
}; */

const showAdd = () => {};
const defineMenus = (e: any, node: any) => {
  if (node.disabled) {
    return [
      { name: "复制", command: "copy" },
      { name: "自定义", command: "defind" },
    ];
  } else {
    return [
      { name: "复制", command: "copy" },
      { name: "新建", command: "add" },
      { name: "编辑", command: "edit" },
      { name: "自定义", command: "defind" },
    ];
  }
};
const onMenus = (data: any) => {
  console.log(data);
};
//
const onCancel = () => {
  isShow.value = false;
  loading.value = false;
};
const onConfirm = () => {};

defineExpose({
  handleShow,
});
</script>
<style lang="less">
.departmentModal {
  user-select: none;
  .mTitle {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    // @fontColor
    color: @f_color_h6;
  }
  .content {
    .size(100%,500px);
    /* overflow-y: scroll;
    overflow-x: hidden; */
    box-sizing: border-box;
    .cTitle {
      .size(100%,24px);
      line-height: 24px;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .optBox {
      .size(100%, 40px);
      .optItem {
        padding: 6px;
        border-radius: 4px;
        background-color: @bg;
        cursor: pointer;
        margin-left: 10px;
        &:hover {
          background-color: @search_bottom_border;
        }
        span {
          margin-left: 4px;
          font-size: 14px;
          color: @f_color_h3;
        }
      }
    }
  }
  .ivu-modal {
    top: 0px;
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
    }
    .ivu-modal-footer {
      border-top: none;
    }
  }
}
</style>
