<!--
 * @Author: fg
 * @Date: 2023-03-21 15:05:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-21 17:46:38
 * @Description: content
-->
<template>
  <Modal
    v-model="isShow"
    width="520"
    class-name="Modal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">密码重置</h1>
    </template>
    <div class="content">
      <!-- <h1 class="cTitle">基本信息</h1> -->
      <div class="conBox">
        <Form :model="form" class="conForm" :rules="ruleForm" ref="refForm">
          <FormItem label="" prop="password" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>新密码</p>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                type="password"
                password
                v-model="form.password"
                placeholder="请输入新密码"
              ></Input>
            </div>
          </FormItem>
          <FormItem label="" prop="confirmPassword" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>确认密码</p>
              <span>(新密码与确认密码要一致)</span>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                type="password"
                password
                v-model="form.confirmPassword"
                placeholder="请再次输入确认密码"
              ></Input>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <template #footer>
      <Button type="text" v-debounce="onCancel">取消</Button>
      <Button type="primary" :loading="loading" v-debounce="onConfirm"
        >重置</Button
      >
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Form, Message } from "view-ui-plus";
import { uploadPassword } from "@/apis/user";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let isShow = ref<boolean>(false);
let userId = ref<number>();

let refForm = ref<InstanceType<typeof Form>>();

let form = reactive<any>({
  password: "",
  confirmPassword: "",
});
const confirmPasswordRule = (rule: any, value: any, callback: Function) => {
  if (value) {
    if (value != form.password) {
      callback(new Error("新密码与确认密码要一致"));
    }
  } else {
    callback(new Error("确认密码不能为空"));
  }
  // 最后要执行一下回调，不然不会触发校验
  callback();
};
let ruleForm = {
  password: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
  confirmPassword: [
    // { required: true, message: "确认密码不能为空", trigger: "blur" },
    { validator: confirmPasswordRule, trigger: "blur" },
  ],
};

const handleShow = (id: number) => {
  userId.value = id;
  isShow.value = true;
};
// 表单加载
let loading = ref<boolean>(false);

// 操作
const onCancel = () => {
  (refForm.value?.resetFields as any)();
  isShow.value = false;
  loading.value = false;
};
const onConfirm = () => {
  (refForm.value?.validate as any)((valid: any) => {
    if (valid) {
      loading.value = true;
      Message.destroy();
      uploadPassword({ id: userId.value as number, password: form.password })
        .then((res) => {
          loading.value = false;
          isShow.value = false;
          Message.success("重置用户密码操作成功");
          emit("onSuccess");
        })
        .catch((err) => {
          loading.value = false;
          Message.error(err || "重置用户密码操作失败");
        });
    } else {
      return false;
    }
  });
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
    color: @f_color_h6;
  }
  .content {
    .size(100%,auto);
    .cTitle {
      .size(100%,24px);
      line-height: 24px;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .conBox {
      .size(100%,calc(100% - 30px));
      border-radius: 6px;
      // border: 1px solid @search_bottom_border;
      padding: 8px 10px;
      .conForm {
        .size(100%,auto);
        display: flex;
        flex-wrap: wrap;
        align-items: self-start;
        .formItem {
          .size(50%,80px);
          flex-shrink: 0;
          margin-bottom: 2px;
          // border-bottom: 1px solid @search_bottom_border;
          box-sizing: border-box;
          .formLabel {
            font-size: 14px;
            color: #666;
            position: relative;
            padding-left: 10px;
            box-sizing: border-box;
            .labelTag {
              position: absolute;
              top: 4px;
              left: 0;
              font-size: 20px;
              color: @error;
            }
            p {
              margin-right: 10px;
            }
            span {
              font-size: 12px;
              color: @fontColor;
            }
          }
          .formValCon {
            width: 100%;
            padding-left: 4px;
            box-sizing: border-box;
            position: relative;
            &::after {
              content: "";
              .size(2px, 20px);
              position: absolute;
              top: 8px;
              left: -14px;
              background-color: @search_bottom_border;
            }
            .ivu-input-type-password {
              width: 90%;
              input {
                padding-right: 32px;
              }
            }
            .ivu-input-prefix i,
            .ivu-input-suffix i {
              color: #333 !important;
            }
          }
          &:nth-child(2n + 1) {
            .formValCon {
              &::after {
                display: none;
              }
            }
          }
          &:nth-child(2n) {
          }
        }
      }
    }
  }
  .ivu-modal {
    top: -100px;
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
