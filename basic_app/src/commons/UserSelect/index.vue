<!--
 * @Author: fg
 * @Date: 2023-03-27 14:17:34
 * @LastEditors: fg
 * @LastEditTime: 2023-03-27 16:59:58
 * @Description: 用户选择
-->
<template>
  <Modal
    v-model="isShow"
    width="800"
    class-name="selectModal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">{{ title }}</h1>
    </template>
    <div class="content f-row-b-s">
      <!-- <h1 class="cTitle">基本信息</h1> -->
      <div class="conLeft">
        <div class="header f-row-b-c">
          <div class="hLeft">
            <Input
              v-show="showType == 0"
              :border="false"
              type="text"
              v-model="searchName"
              placeholder="请输入用户昵称"
            ></Input>
          </div>
          <div class="hRight"></div>
        </div>
      </div>
      <div class="conRight"></div>
    </div>
    <template #footer>
      <Button type="text" v-debounce="onCancel">取消</Button>
      <Button type="primary" :loading="loading" v-debounce="onConfirm"
        >确定</Button
      >
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Form, Message } from "view-ui-plus";
import {} from "@/apis/user";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let props = withDefaults(
  defineProps<{
    title: string;
  }>(),
  {
    title: "选择人员",
  }
);
let isShow = ref<boolean>(false);
let showType = ref<0 | 1>(0); // 左侧搜索类型，0： 用户列表搜索   1： 组织架构搜索
let searchName = ref<string>("");
const handleShow = () => {
  isShow.value = true;
};
// 表单加载
let loading = ref<boolean>(false);
// 获取设备

// 操作
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
.selectModal {
  user-select: none;
  .mTitle {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    // @fontColor
    color: @f_color_h6;
  }
  .content {
    .size(100%,500px);
    .conLeft {
      .size(50%, 100%);
      border-right: 1px solid @search_bottom_border;
    }
    .conRight {
      .size(50%, 100%);
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
    }
    .ivu-modal-footer {
      border-top: none;
    }
  }
}
</style>
