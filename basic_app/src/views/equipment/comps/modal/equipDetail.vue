<!--
 * @Author: fg
 * @Date: 2023-02-21 10:52:25
 * @LastEditors: fg
 * @LastEditTime: 2023-02-21 18:23:41
 * @Description: 设备详情modal
-->
<template>
  <Modal v-model="isShow" width="520" class-name="ModalDetail f-row-c-c">
    <template #header>
      <h1 class="mTitle">设备管理</h1>
    </template>
    <div class="content">
      <div class="headerInfo f-row-s-c">
        <Circle
          class="circle"
          size="80"
          :percent="80"
          strokeWidth="7"
          trailWidth="7"
          strokeColor="var(--f_color_active)"
          dashboard
        >
          <div class="f-col-c-c">
            <p class="eValueTxt1">剩余</p>
            <p class="eValueTxt2">123.23MB</p>
          </div>
        </Circle>
        <div class="hInfoRight f-col-b-s">
          <div class="hLeftTop f-row-b-c">
            <Text
              className="equipNameTxt"
              :ellipsis-config="{ tooltip: true }"
              ellipsis
              placement="bottom-start"
              >测试设备测试设备测试设备测试设备测试设备测试设备测试设备测试设备测试设备测试设备测试设备</Text
            >
            <div class="optBox f-row-c-c">
              <Tooltip placement="bottom" content="编辑">
                <svg-icon
                  iconName="icon-bianji"
                  className="optIcon"
                  size="22"
                  color="var(--fontColor)"
                ></svg-icon>
              </Tooltip>
            </div>
          </div>
          <div class="hLeftBottom f-row-s-c">
            <div class="status">
              <p>使用中</p>
            </div>
            <p class="storeTxt">100MB/128GB</p>
          </div>
        </div>
      </div>
      <h3 class="titleTxt">基本信息</h3>
      <div class="conBox">
        <Form :model="form" class="conForm" :rules="ruleForm" ref="refForm">
          <FormItem label="" prop="code" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>设备编码</p>
              <span>(新增设备识别独有标识)</span>
            </div>
            <div class="formValCon">
              <!-- <Input
                :border="false"
                v-model="form.code"
                placeholder="请输入设备编码"
              ></Input> -->
              <p class="formVal">FC-5B-12-11-4C-1B</p>
            </div>
          </FormItem>
          <FormItem label="" prop="name" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>设备名称</p>
            </div>
            <div class="formValCon">
              <!-- <Input
                :border="false"
                v-model="form.name"
                placeholder="请输入设备名称"
              ></Input> -->
              <p class="formVal">可立批测试设备wx01型</p>
            </div>
          </FormItem>
          <FormItem label="" prop="softwareVersion" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>软件版本</p>
            </div>
            <div class="formValCon">
              <!-- <Input
                :border="false"
                v-model="form.softwareVersion"
                placeholder="请输入软件版本"
              ></Input> -->
              <p class="formVal">v1.0.25-alpha.12</p>
            </div>
          </FormItem>
          <FormItem label="" prop="productionDate" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>生产日期</p>
            </div>
            <div class="formValCon">
              <!-- <DatePicker
                :model-value="form.productionDate"
                type="date"
                placeholder="请选择生产日期"
              /> -->
              <p class="formVal">2023-02-16</p>
            </div>
          </FormItem>
          <FormItem label="" prop="mouseNum" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>鼠标数量</p>
            </div>
            <div class="formValCon">
              <!-- <InputNumber v-model="form.mouseNum" :min="1" controls-outside /> -->
              <p class="formVal">8</p>
            </div>
          </FormItem>
          <FormItem label="" prop="productionDate" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>本地硬盘大小</p>
            </div>
            <div class="formValCon f-row-b-c">
              <!-- <InputNumber
                class="formBite"
                :min="1"
                v-model="biteUnitSize"
                placeholder="请输入硬盘大小"
              ></InputNumber>
              <Select v-model="biteUnit" class="formUnit">
                <Option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in biteUnitArr"
                >
                  {{ item.name }}
                </Option>
              </Select> -->
              <p class="formVal">200 GB</p>
            </div>
          </FormItem>
        </Form>
      </div>
      <h3 class="titleTxt">鼠标配置</h3>
      <div class="mouseBox">
        <div class="mouseItem f-row-b-c">
          <div class="mItemLeft">一号鼠标</div>
          <div class="mItemOpt f-row-c-c">
            <Poptip placement="top" width="200" trigger="hover">
              <div class="mItemOptIcon optFontSize f-row-c-c">
                <svg-icon
                  iconName="icon-zitidaxiao-"
                  size="14"
                  color="var(--fontColor)"
                ></svg-icon>
              </div>
              <template #content>
                <div class="fSizeBox">
                  <h3>字体大小</h3>
                  <Slider></Slider>
                </div>
              </template>
            </Poptip>
            <div class="mItemOptIcon colorSelect">
              <ColorPicker></ColorPicker>
            </div>

            <!-- <svg-icon
              iconName="icon-bianji"
              className="mItemOptIcon"
              size="20"
              color="var(--fontColor)"
            ></svg-icon> -->
          </div>
        </div>
      </div>
    </div>
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
import { useBytesUnit } from "@/hooks/useTools";
import { getDeviceDetail, getMouseByDevice } from "@/apis/equipment";
import _ from "lodash";

let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let isShow = ref<boolean>(false);
let isEdit = ref<boolean>(false); // 编辑状态 查看状态
const handleShow = () => {
  isShow.value = true;
};
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
let biteUnitArr = [
  { name: "KB", value: 1 },
  { name: "MB", value: 2 },
  { name: "GB", value: 3 },
  { name: "TB", value: 4 },
];
let statusType = [
  { name: "已创建", value: "10" },
  { name: "使用中", value: "20" },
  { name: "已停用", value: "30" },
];

let biteUnit = ref<number>(3);
let biteUnitSize = ref<number>(1);
// 字体选择配置
const fontSizeConfig = [1, 3, 5, 7, 9];

const getData = (item: any) => {
  getDeviceDetail(item.id).then((res) => {
    console.log(res);
  });
  getMouseByDevice({ deviceCode: item.code }).then((res) => {
    console.log(res);
  });
};

defineExpose({
  handleShow,
  getData,
});
</script>
<style lang="less">
.ModalDetail {
  user-select: none;
  .mTitle {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #666;
  }
  .content {
    .size(100%, 580px);
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;
    .headerInfo {
      .size(100%, 80px);
      margin-bottom: 10px;
      .circle {
        margin-right: 20px;
        .eValueTxt1 {
          font-size: 14px;
          margin-bottom: 4px;
        }
        .eValueTxt2 {
          font-size: 12px;
        }
      }
      .hInfoRight {
        .size(calc(100% - 90px), 100%);
        padding: 10px 0;
        box-sizing: border-box;

        .hLeftTop {
          .size(100%,30px);
          line-height: 30px;
          .equipNameTxt {
            .size(100%,100%);
            font-size: 16px;
            font-weight: 500;
            .ivu-typography {
              color: @f_color_h3;
            }
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
            margin-right: 20px;
          }
        }
      }
    }
    .titleTxt {
      .size(100%,40px);
      line-height: 40px;
      font-size: 14px;
      color: @f_color_h3;
    }
    .conBox {
      .size(100%,auto);
      border-radius: 6px;
      // border: 1px solid @search_bottom_border;
      // padding: 8px 10px;
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
            color: @f_color_h6;
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
            .formVal {
              font-size: 14px;
              color: @f_color_h3;
              .size(100%,32px);
              padding: 4px 7px;
              // color: #515a6e;
            }
            .formBite {
              width: calc(100% - 80px);
              border: none;
              .ivu-input-number-input-wrap .ivu-input-number-input {
                text-align: left;
              }
              &:hover {
                .ivu-input-number-handler-wrap {
                  display: none;
                }
              }
            }
            .formUnit {
              width: 80px;
              .ivu-select-selection {
                border: none;
                box-shadow: none;
              }
            }
            .ivu-input-number-focused {
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
      }
    }
    .mouseBox {
      .size(100%,auto);
      display: flex;
      flex-wrap: wrap;
      .mouseItem {
        .size(50%,auto);
        margin-bottom: 10px;
        // background-color: pink;
        box-sizing: border-box;
        &:nth-child(2n + 1) {
          padding-right: 10px;
        }
        &:nth-child(2n) {
          padding-left: 10px;
        }
        .mItemLeft {
          .size(100%,auto);
        }
        .mItemOpt {
          flex-shrink: 0;
          .mItemOptIcon {
            margin-left: 10px;
            cursor: pointer;
          }
          .mItemOptIcon.optFontSize {
            .size(20px,20px);
            border: 1px solid @fontColor;
            border-radius: 50%;
          }
          .colorSelect.mItemOptIcon {
            .ivu-input-icon {
              display: none;
            }
            .ivu-input-icon-normal + .ivu-input {
              padding-right: 0;
            }
            .ivu-color-picker-focused {
              box-shadow: none;
            }
            .ivu-input {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .ivu-modal {
    top: 0;
  }
  .ivu-modal-content {
    .ivu-modal-close {
      top: 14px;
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
        color: @f_color_h3;
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
