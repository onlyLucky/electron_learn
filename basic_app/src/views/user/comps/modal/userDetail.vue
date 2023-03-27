<!--
 * @Author: fg
 * @Date: 2023-03-23 14:25:15
 * @LastEditors: fg
 * @LastEditTime: 2023-03-27 13:35:03
 * @Description: 用户详情
-->
<template>
  <Modal
    v-model="isShow"
    width="520"
    class-name="userDetail f-row-c-c"
    :mask-closable="!loading"
    @on-cancel="onCancel"
  >
    <template #header>
      <h1 class="mTitle">{{ isEdit ? "用户编辑" : "用户详情" }}</h1>
    </template>
    <div class="content">
      <Form :model="form" class="conForm" :rules="ruleForm" ref="refForm">
        <div class="headerInfo f-row-s-c">
          <div class="hInfoLeft f-row-s-c">
            <div class="avatar">
              <img :src="computedAvatarPath" alt="" v-show="form.avatarPath" />
              <div class="infoAva f-row-c-c" v-show="!form.avatarPath">
                <span>{{ form.nickname.slice(-2) }}</span>
              </div>
              <div class="avaHover" v-show="isEdit">
                <Upload
                  action="/"
                  accept=".jpg, .jpeg, .png"
                  :show-upload-list="false"
                  :before-upload="handleUpload"
                >
                  <div class="uploadAvatar f-row-c-c">
                    <Icon
                      type="ios-camera"
                      size="30"
                      color="var(--meet_summary_icon_time)"
                    ></Icon>
                  </div>
                </Upload>
              </div>
              <div class="genderBox f-row-c-c" v-show="!isEdit">
                <svg-icon
                  iconName="icon-nan"
                  v-show="detail.userSex == 1"
                  className="iconGender"
                  size="16"
                  color="var(--f_color_active)"
                ></svg-icon>
                <svg-icon
                  iconName="icon-nv"
                  v-show="detail.userSex == 2"
                  className="iconGender"
                  size="16"
                  color="var(--error)"
                ></svg-icon>
                <span
                  class="noGender"
                  v-show="detail.userSex != 2 && detail.userSex != 1"
                  >???</span
                >
              </div>
              <Dropdown
                class="genderBox"
                v-show="isEdit"
                placement="bottom-start"
              >
                <div class="f-row-c-c">
                  <svg-icon
                    iconName="icon-nan"
                    v-show="form.userSex == 1"
                    className="iconGender"
                    size="16"
                    color="var(--f_color_active)"
                  ></svg-icon>
                  <svg-icon
                    iconName="icon-nv"
                    v-show="form.userSex == 2"
                    className="iconGender"
                    size="16"
                    color="var(--error)"
                  ></svg-icon>
                  <span
                    class="noGender"
                    v-show="form.userSex != 2 && form.userSex != 1"
                    >???</span
                  >
                  <Icon type="ios-arrow-down" class="iconEditGender"></Icon>
                </div>
                <template #list>
                  <DropdownMenu>
                    <DropdownItem
                      v-for="(item, index) in genderData"
                      :key="index"
                      @click="form.userSex = item.value"
                      >{{ item.name }}</DropdownItem
                    >
                  </DropdownMenu>
                </template>
              </Dropdown>
            </div>
          </div>
          <div class="hInfoRight f-col-b-s">
            <div class="hLeftTop f-row-b-c">
              <Input
                :border="false"
                type="text"
                v-show="isEdit"
                clearable
                v-model="form.nickname"
                placeholder="请输入用户昵称"
              ></Input>
              <Text
                v-show="!isEdit"
                class="equipNameTxt"
                :ellipsis-config="{ tooltip: true }"
                ellipsis
                placement="bottom-start"
                >{{ detail.nickname }}</Text
              >
              <div class="optBox f-row-c-c">
                <Tooltip placement="bottom" content="编辑" v-show="!isEdit">
                  <svg-icon
                    iconName="icon-bianji"
                    v-debounce="handleChange"
                    className="optIcon"
                    size="22"
                    color="var(--fontColor)"
                  ></svg-icon>
                </Tooltip>
              </div>
            </div>
            <div class="hLeftBottom f-row-s-c">
              <p class="storeTxt">登录账号：{{ detail.userName }}</p>
              <div class="status">
                <p
                  :style="{
                    display: isEdit ? 'none' : 'inline-block',
                    color:
                      form.status == 0
                        ? 'var(--f_color_active)'
                        : 'var(--fontColor)',
                  }"
                >
                  {{ detail.status == 0 ? "在职" : "已离职" }}
                </p>
                <Select
                  v-show="isEdit"
                  v-model="form.status"
                  size="small"
                  style="width: 100px"
                >
                  <Option
                    v-for="(item, index) in statusData"
                    :value="item.value"
                    :key="index"
                    >{{ item.name }}</Option
                  >
                </Select>
              </div>
            </div>
          </div>
        </div>
        <h1 class="cTitle">基本信息</h1>
        <div class="conBox">
          <FormItem label="" prop="phone" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>电话</p>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                type="tel"
                v-model="form.phone"
                v-show="isEdit"
                placeholder="请输入联系电话"
              ></Input>
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ detail.phone || "暂无电话" }}
                </Text>
              </div>
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
                v-show="isEdit"
                placeholder="请输入邮箱"
              ></Input>
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ detail.email || "暂无邮箱" }}
                </Text>
              </div>
            </div>
          </FormItem>
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
                v-show="isEdit"
                :render-format="handleFormat"
                :change-on-select="true"
                clearable
                filterable
                placeholder="请选择归属部门"
              ></Cascader>
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ detail.deptName }}
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="" prop="careerId" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>职位</p>
            </div>
            <div class="formValCon">
              <Select
                v-model="form.careerId"
                placeholder="请选择职位"
                v-show="isEdit"
              >
                <Option
                  :value="item.id"
                  :key="index"
                  v-for="(item, index) in caeerData"
                >
                  {{ item.caeerName }}
                </Option>
              </Select>
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ computedCaeerName }}
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="" prop="enterTime" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>入职时间</p>
            </div>
            <div class="formValCon">
              <DatePicker
                v-model="form.enterTime"
                v-show="isEdit"
                format="yyyy-MM-dd"
                type="date"
                placeholder="请选择入职时间"
                @on-change="onTimeChange"
              />
              <div class="formVal" v-show="!isEdit">
                <Text :ellipsis-config="{ tooltip: true }" ellipsis>
                  {{ detail.enterTime || "暂无入职时间" }}
                </Text>
              </div>
            </div>
          </FormItem>
        </div>
      </Form>
    </div>
    <template #footer>
      <div v-show="!isEdit"></div>
      <Button v-show="isEdit" type="text" v-debounce="onQuit">退出编辑</Button>
      <Button
        v-show="isEdit"
        type="primary"
        :loading="loading"
        v-debounce="onConfirm"
        >保存</Button
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
  updateDept,
  uploadUser,
  getDeptByUserId,
} from "@/apis/user";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
// 当前是否为编辑状态
let isEdit = ref<boolean>(false);
let isShow = ref<boolean>(false);
// 表单加载
let loading = ref<boolean>(false);
let refForm = ref<InstanceType<typeof Form>>();

type FormType = {
  userName: string;
  nickname: string;
  userSex: number;
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
let detail = ref<any>({});

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

const handleShow = (data: any, flag: boolean) => {
  data.careerId = Number(data.careerId);
  Object.assign(form, data);
  detail.value = data;
  getDeptByUserId({ userId: data.id }).then((res) => {
    let temp: number[] = [];
    res.data.ancestors.split(",").map((item: any) => temp.push(Number(item)));
    temp.shift();
    temp.push(res.data.id);
    form.deptId = temp;
    detail.value.deptId = temp;
    detail.value.deptName = res.data.deptName;
    form.deptName = res.data.deptName;
  });
  isEdit.value = flag;
  isShow.value = true;
};
// 更改编辑模式
const handleChange = () => {
  isEdit.value = true;
  Object.assign(form, detail.value);
};

// 退出编辑
const onQuit = () => {
  // (refForm.value?.resetFields as any)();
  console.log(detail.value, "detail.value");
  loading.value = false;
  isEdit.value = false;
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
      uploadUser(params)
        .then((res) => {
          if (detail.value.deptId == form.deptId) {
            uploadEnd();
          } else {
            updateDept({
              newDept: params.deptId as any,
              oldDept: detail.value.deptId[detail.value.deptId.length - 1],
              userId: detail.value.id,
            })
              .then((result) => {
                uploadEnd();
              })
              .catch((error) => {
                loading.value = false;
                Message.error(error || "更新用户操作失败");
              });
          }
        })
        .catch((err) => {
          loading.value = false;
          Message.error(err || "更新用户操作失败");
        });
    } else {
      return false;
    }
  });
};
// 成功上传
const uploadEnd = () => {
  loading.value = false;
  isShow.value = false;
  Message.success("更新用户操作成功");
  initForm();
  (refForm.value?.resetFields as any)();
  emit("onSuccess");
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
const computedCaeerName = computed(() => {
  let res = "暂无职位";
  caeerData.value.map((item) => {
    if (Number(detail.value.careerId) == item.id) {
      res = item.caeerName;
    }
  });
  return res;
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
.userDetail {
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
    padding: 10px;
    overflow-y: scroll;
    box-sizing: border-box;
    .headerInfo {
      .size(100%, 80px);
      margin-bottom: 20px;
      .hInfoLeft {
        .size(90px, 90px);
        margin-right: 20px;
        .avatar {
          .size(74px, 74px);
          border-radius: 6px;
          position: relative;
          &:hover {
            .avaHover {
              display: block;
            }
          }
          img {
            .size(100%, 100%);
            border-radius: 6px;
          }
          .infoAva {
            .size(100%, 100%);
            border-radius: 6px;
            background-color: @f_color_active;
            span {
              font-size: 18px;
              color: @bg;
            }
          }
          .avaHover {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            cursor: pointer;
            .size(100%, 100%);
            border-radius: 6px;
            overflow: hidden;
            background-color: rgba(0, 0, 0, 0.4);
            .uploadAvatar {
              .size(74px, 74px);
            }
          }
          .genderBox {
            position: absolute;
            bottom: -4px;
            right: -10px;
            background: @bg;
            padding: 2px;
            border-radius: 20px;
            border: 1px solid @search_bottom_border;
            cursor: pointer;
            span.noGender {
              display: inline-block;
              font-size: 12px;
              width: 30px;
              text-align: center;
              color: @fontColor;
            }
            .iconEditGender {
              margin-left: 10px;
            }
          }
        }
      }
      .hInfoRight {
        .size(calc(100% - 110px), 100%);
        padding: 10px 0;
        box-sizing: border-box;

        .hLeftTop {
          .size(100%,30px);
          line-height: 30px;
          .equipNameTxt {
            .size(100%,100%);
            font-size: 16px;
            font-weight: 500;
          }
          .ivu-input {
            padding: 0px;
            font-size: 16px;
          }
          .ivu-input-wrapper {
            width: 200px;
          }
          .ivu-typography {
            color: @f_color_h3;
          }
          .optBox {
            .size(auto,30px);
            flex-shrink: 0;
            margin-left: 10px;
            .optIcon {
              margin-left: 10px;
              cursor: pointer;
            }
          }
        }
        .hLeftBottom {
          color: @fontColor;
          font-size: 12px;
          .status {
            margin-left: 20px;
            .editStatus {
              color: var(--f_color_active);
              cursor: pointer;
            }
            .ivu-select-visible .ivu-select-selection {
              box-shadow: none;
            }
            .ivu-select-selection {
              color: var(--f_color_active);
              border: none;
            }
          }
        }
      }
    }
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
        left: 8px;
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
          .formVal {
            font-size: 14px;
            .size(100%,32px);
            padding: 0px 7px;
            .ivu-typography {
              color: @f_color_h3;
            }
          }
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
