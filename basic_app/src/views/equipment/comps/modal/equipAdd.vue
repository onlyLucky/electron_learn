<!--
 * @Author: fg
 * @Date: 2023-02-17 10:44:17
 * @LastEditors: fg
 * @LastEditTime: 2023-02-17 17:54:39
 * @Description: 新增设备
-->
<template>
  <Modal
    v-model="isShow"
    width="520"
    class-name="addModal f-row-c-c"
    ok-text="新增"
  >
    <template #header>
      <h1 class="mTitle">新增设备</h1>
    </template>
    <div class="content">
      <!-- <h1 class="cTitle">基本信息</h1> -->
      <div class="conBox">
        <Form :model="form" class="conForm" :rules="ruleForm">
          <FormItem label="" prop="code" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>设备编码</p>
              <span>(新增设备识别独有标识)</span>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                v-model="form.code"
                placeholder="请输入设备编码"
              ></Input>
            </div>
          </FormItem>
          <FormItem label="" prop="name" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>设备名称</p>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                v-model="form.name"
                placeholder="请输入设备名称"
              ></Input>
            </div>
          </FormItem>
          <FormItem label="" prop="softwareVersion" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>软件版本</p>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                v-model="form.softwareVersion"
                placeholder="请输入软件版本"
              ></Input>
            </div>
          </FormItem>
          <FormItem label="" prop="productionDate" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>生产日期</p>
            </div>
            <div class="formValCon">
              <DatePicker
                :model-value="form.productionDate"
                type="date"
                placeholder="请选择生产日期"
              />
            </div>
          </FormItem>
          <FormItem label="" prop="mouseNum" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>鼠标数量</p>
            </div>
            <div class="formValCon">
              <InputNumber v-model="form.mouseNum" :min="1" controls-outside />
            </div>
          </FormItem>
          <FormItem label="" prop="productionDate" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>本地硬盘大小</p>
            </div>
            <div class="formValCon">
              <Input v-model="form.hardDiskSize" placeholder="请输入硬盘大小">
                <template #append>
                  <Select v-model="biteUnit" style="width: 80px">
                    <Option
                      :value="item"
                      :key="index"
                      v-for="(item, index) in biteUnitArr"
                    >
                      {{ item }}
                    </Option>
                  </Select>
                </template>
              </Input>
            </div>
          </FormItem>
          <FormItem label="" prop="status" class="formItem" style="width: 100%">
            <div class="formLabel f-row-s-c">
              <p>状态</p>
            </div>
            <div class="formValCon">
              <RadioGroup v-model="form.status">
                <Radio
                  v-for="(item, index) in statusType"
                  :key="index"
                  :label="item.value"
                >
                  <span>{{ item.name }}</span>
                </Radio>
              </RadioGroup>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <!-- <template #footer>
      <Button type="error" size="large" long>Delete</Button>
    </template> -->
  </Modal>
</template>
<script setup lang="ts">
let isShow = ref<boolean>(false);
type FormType = {
  code: string;
  name: string;
  status: "10" | "20" | "30";
  hardDiskSize?: number | "";
  mouseNum?: number;
  productionDate?: string;
  softwareVersion?: string;
};
// 新增表单
let form = reactive<FormType>({
  code: "",
  name: "",
  status: "10",
  hardDiskSize: "",
  mouseNum: 1,
  productionDate: "",
  softwareVersion: "",
});
let ruleForm = {
  code: [{ required: true, message: "设备编码不能为空", trigger: "blur" }],
  name: [{ required: true, message: "设备编码不能为空", trigger: "blur" }],
};
let biteUnitArr = ["KB", "MB", "GB", "TB"];
let statusType = [
  { name: "已创建", value: "10" },
  { name: "使用中", value: "20" },
  { name: "已停用", value: "30" },
];
let biteUnit = ref<string>("GB");
const handleShow = () => {
  isShow.value = true;
};

defineExpose({
  handleShow,
});
</script>
<style lang="less">
.addModal {
  user-select: none;
  .mTitle {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    // @fontColor
    color: #666;
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
