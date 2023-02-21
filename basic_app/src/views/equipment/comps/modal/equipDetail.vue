<!--
 * @Author: fg
 * @Date: 2023-02-21 10:52:25
 * @LastEditors: fg
 * @LastEditTime: 2023-02-21 11:08:45
 * @Description: 设备详情modal
-->
<template>
  <Modal v-model="isShow" width="520" class-name="Modal f-row-c-c">
    <template #header>
      <h1 class="mTitle">设备管理</h1>
    </template>
    <div class="content"></div>
    <template #footer>
      <div></div>
      <!-- <Badge :count="selectArr.length">
        <Button type="primary" :loading="loading" v-debounce="formImport">
          确认导入
        </Button>
      </Badge> -->
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Message } from "view-ui-plus";
import { postImportDevice } from "@/apis/equipment";
import _ from "lodash";

let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let isShow = ref<boolean>(false);
const handleShow = () => {
  isShow.value = true;
};

defineExpose({
  handleShow,
});
</script>
<style lang="less">
.Modal {
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
    background-color: pink;
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
    }
    .ivu-modal-footer {
      border-top: none;
    }
  }
}
</style>
