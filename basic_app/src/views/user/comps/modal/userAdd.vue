<!--
 * @Author: fg
 * @Date: 2023-03-21 19:59:33
 * @LastEditors: fg
 * @LastEditTime: 2023-03-23 16:21:16
 * @Description: 新增用户
-->
<template>
  <Modal
    v-model="isShow"
    width="520"
    class-name="userModal f-row-c-c"
    :mask-closable="!loading"
    @on-cancel="onCancel"
  >
    <template #header>
      <h1 class="mTitle">新增用户</h1>
    </template>
    <div class="content">
      <Form :model="form" class="conForm" :rules="ruleForm" ref="refForm">
        <h1 class="cTitle">基本信息</h1>
        <div class="conBox basicInfo">
          <div class="f-row-c-s" style="width: 100%">
            <FormItem label="" prop="avatarPath" class="formItem">
              <div class="formLabel f-row-s-c">
                <p>用户头像</p>
              </div>
              <div class="formValCon">
                <Upload
                  action="/"
                  accept=".jpg, .jpeg, .png"
                  :show-upload-list="false"
                  :before-upload="handleUpload"
                >
                  <div class="uploadAvatar f-row-c-c" v-show="!form.avatarPath">
                    <Icon
                      v-show="!avatarLoading"
                      type="ios-camera"
                      size="30"
                      color="var(--fontColor)"
                    ></Icon>
                    <Icon
                      v-show="avatarLoading"
                      type="ios-loading"
                      size="30"
                      color="var(--fontColor)"
                      class="conLoading iconLoading"
                    ></Icon>
                  </div>
                  <div class="avatarBox f-row-c-c" v-show="form.avatarPath">
                    <img :src="computedAvatarPath" alt="" />
                  </div>
                </Upload>
              </div>
            </FormItem>
            <div class="f-col" style="width: 50%">
              <FormItem
                label=""
                prop="userName"
                class="formItem"
                style="width: 100%"
              >
                <div class="formLabel f-row-s-c">
                  <span class="labelTag">*</span>
                  <p>登录账号</p>
                  <span>(用于应用登录账号)</span>
                </div>
                <div class="formValCon has">
                  <Input
                    :border="false"
                    type="text"
                    v-model="form.userName"
                    placeholder="请输入登录账号"
                  ></Input>
                </div>
              </FormItem>
              <FormItem
                label=""
                prop="nickname"
                class="formItem"
                style="width: 100%"
              >
                <div class="formLabel f-row-s-c">
                  <span class="labelTag">*</span>
                  <p>用户昵称</p>
                </div>
                <div class="formValCon">
                  <Input
                    :border="false"
                    type="text"
                    v-model="form.nickname"
                    placeholder="请输入用户昵称"
                  ></Input>
                </div>
              </FormItem>
            </div>
          </div>

          <FormItem label="" prop="phone" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>电话</p>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                type="tel"
                v-model="form.phone"
                placeholder="请输入联系电话"
              ></Input>
            </div>
          </FormItem>
          <FormItem label="" prop="email" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>邮箱</p>
            </div>
            <div class="formValCon has">
              <Input
                :border="false"
                type="email"
                v-model="form.email"
                placeholder="请输入邮箱"
              ></Input>
            </div>
          </FormItem>

          <FormItem label="" prop="userSex" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>性别</p>
            </div>
            <div class="formValCon">
              <RadioGroup v-model="form.userSex">
                <Radio
                  v-for="(item, index) in genderData"
                  :key="index"
                  :label="item.value"
                >
                  <span>{{ item.name }}</span>
                </Radio>
              </RadioGroup>
            </div>
          </FormItem>

          <FormItem label="" prop="status" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>状态</p>
            </div>
            <div class="formValCon has">
              <RadioGroup v-model="form.status">
                <Radio
                  v-for="(item, index) in statusData"
                  :key="index"
                  :label="item.value"
                >
                  <span>{{ item.name }}</span>
                </Radio>
              </RadioGroup>
            </div>
          </FormItem>
        </div>
        <h1 class="cTitle">其他信息</h1>
        <div class="conBox">
          <FormItem label="" prop="deptId" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>归属部门</p>
            </div>
            <div class="formValCon">
              <Cascader
                :data="deptList"
                class="hLItemValue"
                v-model="form.deptId"
                :render-format="handleFormat"
                :change-on-select="true"
                clearable
                filterable
                placeholder="请选择归属部门"
              ></Cascader>
            </div>
          </FormItem>
          <FormItem label="" prop="careerId" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>职位</p>
            </div>
            <div class="formValCon">
              <Select v-model="form.careerId" placeholder="请选择职位">
                <Option
                  :value="item.id"
                  :key="index"
                  v-for="(item, index) in caeerData"
                >
                  {{ item.caeerName }}
                </Option>
              </Select>
            </div>
          </FormItem>
          <FormItem label="" prop="enterTime" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>入职时间</p>
            </div>
            <div class="formValCon">
              <DatePicker
                v-model="form.enterTime"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择入职时间"
                @on-change="onTimeChange"
              />
            </div>
          </FormItem>
        </div>
      </Form>
    </div>
    <template #footer>
      <Button type="text" v-debounce="onCancel">取消</Button>
      <Button type="primary" :loading="loading" v-debounce="onConfirm"
        >添加</Button
      >
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Form, Message, Cascader } from "view-ui-plus";
import {
  postUploadAvatar,
  getUserCareer,
  getDept,
  validateUserName,
  addUser,
  updateDept,
} from "@/apis/user";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let isShow = ref<boolean>(false);
// 表单加载
let loading = ref<boolean>(false);
let refForm = ref<InstanceType<typeof Form>>();

type FormType = {
  userName: string;
  nickname: string;
  userSex: 1 | 2;
  status: 0 | 1;
  phone: string;
  email: string;
  enterTime: string;
  avatarPath: string;
  careerId: any;
  deptId: number[];
  deptName: string;
};
let form = reactive<FormType>({
  userName: "",
  nickname: "",
  userSex: 1,
  status: 0,
  phone: "",
  email: "",
  enterTime: "",
  avatarPath: "",
  careerId: "",
  deptId: [],
  deptName: "",
});

// 初始化form
const initForm = () => {
  let temp = {
    userName: "",
    nickname: "",
    userSex: 1,
    status: 0,
    phone: "",
    email: "",
    enterTime: "",
    avatarPath: "",
    careerId: "",
    deptId: [],
    deptName: "",
  };
  Object.assign(form, temp);
};

let caeerData = ref<any[]>([]);

let genderData = [
  {
    name: "男",
    value: 1,
  },
  {
    name: "女",
    value: 2,
  },
];

let statusData = [
  {
    name: "在职",
    value: 0,
  },
  {
    name: "离职",
    value: 1,
  },
];

const userNameRule = (rule: any, value: any, callback: Function) => {
  if (value) {
    validateUserName({ username: form.userName })
      .then((res) => {
        if (!res.data) {
          callback(new Error("登录账号已存在"));
        } else {
          callback();
        }
      })
      .catch((err) => {
        Message.error(err || "登录账号接口调用失败");
        callback();
      });
  } else {
    callback(new Error("登录账号不能为空"));
  }
};

const deptIdRule = (rule: any, value: any, callback: Function) => {
  if (value.length <= 0) {
    callback(new Error("归属部门不能为空"));
  }
  callback();
};

// 头像上传加载状态
let avatarLoading = ref<boolean>(false);
let ruleForm = {
  nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  deptId: [{ validator: deptIdRule, trigger: "blur" }],
  userName: [{ validator: userNameRule, trigger: "blur" }],
};

let deptList = ref<any[]>([]);

const getDeptData = () => {
  deptList.value = [];
  getDept().then((res) => {
    deptList.value = handleDeptData(res.data);
  });
};
// 处理部门数据
const handleDeptData = (arr: any[]): any[] => {
  let tempArr: any[] = [];
  arr.map((item: any) => {
    let temp = {
      value: item.id,
      label: item.deptName,
      children: [] as any[],
    };
    if (item.children && item.children.length > 0) {
      temp.children = handleDeptData(item.children) as any[];
    }
    tempArr.push(temp);
  });
  return tempArr;
};

// 处理级联选择器展示数据
const handleFormat = (labels: any[], selectedData: any[]) => {
  let index = labels.length - 1;
  form.deptName = labels[index];
  return labels[index];
};

// 入职日期改变
const onTimeChange = (e: string) => {
  form.enterTime = e;
};

const handleShow = () => {
  isShow.value = true;
};
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
      let params = { ...form };
      params.deptId = form.deptId[form.deptId.length - 1] as any;
      addUser(params)
        .then((res) => {
          updateDept({
            newDept: params.deptId as any,
            userId: res.data.id,
          })
            .then((result) => {
              loading.value = false;
              isShow.value = false;
              Message.success("新增用户操作成功");
              initForm();
              (refForm.value?.resetFields as any)();
              emit("onSuccess");
            })
            .catch((error) => {
              loading.value = false;
              Message.error(error || "新增用户操作失败");
            });
        })
        .catch((err) => {
          loading.value = false;
          Message.error(err || "新增用户操作失败");
        });
    } else {
      return false;
    }
  });
};
// 上传静态资源
const handleUpload = (file: any) => {
  form.avatarPath = "";
  avatarLoading.value = true;
  postUploadAvatar({ files: file })
    .then((res) => {
      console.log(res, "res");
      form.avatarPath = res.data;
      avatarLoading.value = false;
    })
    .catch((err) => {
      Message.error(err || "上传头像资源失败");
      avatarLoading.value = false;
    });
  return false;
};
const computedAvatarPath = computed(() => {
  return form.avatarPath
    ? localStorage.getItem("staticPath") + form.avatarPath
    : "";
});

onMounted(() => {
  getDeptData();
  getUserCareer({}).then((res) => {
    caeerData.value = res.data;
  });
});
defineExpose({
  handleShow,
});
</script>
<style lang="less">
.userModal {
  user-select: none;
  box-sizing: border-box;
  .mTitle {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    // @fontColor
    color: @f_color_h6;
  }
  .content {
    max-height: 500px;
    .size(100%,auto);
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
    .cTitle {
      .size(100%,24px);
      line-height: 24px;
      font-size: 14px;
      margin-bottom: 6px;
      padding-left: 22px;
      color: @f_color_h6;
      position: relative;
      opacity: 0.8;
      box-sizing: border-box;
      &::after {
        content: "";
        position: absolute;
        .size(4px, 18px);
        background: @f_color_active;
        left: -12px;
        top: 2px;
      }
    }
    .conBox {
      .size(100%,calc(100% - 30px));
      border-radius: 6px;
      // border: 1px solid @search_bottom_border;
      padding: 8px 10px;
      display: flex;
      flex-wrap: wrap;
      align-items: self-start;
      .uploadAvatar {
        .size(120px,120px);
        border-radius: 4px;
        border: 1px dashed @fontColor;
        cursor: pointer;
      }
      .avatarBox {
        .size(120px,120px);
        background-color: @bg;
        border-radius: 4px;
        border: 1px dashed @fontColor;
        cursor: pointer;
        img {
          .size(90px,90px);
        }
      }
    }

    .conForm {
      .size(100%,auto);

      .formItem {
        .size(50%,auto);
        min-height: 80px;
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
          .ivu-input-wrapper,
          .ivu-select,
          .ivu-cascader-rel {
            width: 90%;
          }
          .ivu-select-selection {
            border: none;
          }
          .ivu-select-visible .ivu-select-selection {
            box-shadow: none;
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
      .basicInfo .formItem .formValCon.has::after {
        display: block;
      }
    }
  }
  .ivu-modal {
    top: 0px !important;
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
      width: 100%;
      padding: 0px 16px;
      box-sizing: border-box;
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
