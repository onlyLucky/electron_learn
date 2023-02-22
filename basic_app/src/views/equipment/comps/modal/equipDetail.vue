<!--
 * @Author: fg
 * @Date: 2023-02-21 10:52:25
 * @LastEditors: fg
 * @LastEditTime: 2023-02-22 16:41:47
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
            <p class="eValueTxt2">{{ computedRemainderDisk }}</p>
          </div>
        </Circle>
        <div class="hInfoRight f-col-b-s">
          <div class="hLeftTop f-row-b-c">
            <Text
              class="equipNameTxt"
              :ellipsis-config="{ tooltip: true }"
              ellipsis
              placement="bottom-start"
              >测试设备</Text
            >
            <div class="optBox f-row-c-c">
              <Tooltip placement="bottom" content="编辑">
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
            <div class="status">
              <p>使用中</p>
            </div>
            <p class="storeTxt">
              {{ useBytesUnit(detailDate.localStoreUseSize || 0) }}/{{
                useBytesUnit(form.hardDiskSize || 0)
              }}
            </p>
          </div>
        </div>
      </div>
      <h3 class="titleTxt">基本信息</h3>
      <div class="conBox">
        <Form :model="form" class="conForm" :rules="ruleForm" ref="refForm">
          <FormItem label="" prop="code" class="formItem">
            <div class="formLabel f-row-s-c">
              <span v-show="isEdit" class="labelTag">*</span>
              <p>设备编码</p>
              <span>(新增设备识别独有标识)</span>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                v-model="form.code"
                v-show="isEdit"
                disabled
                placeholder="请输入设备编码"
              ></Input>
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ form.code }}
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="" prop="name" class="formItem">
            <div class="formLabel f-row-s-c">
              <span v-show="isEdit" class="labelTag">*</span>
              <p>设备名称</p>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                v-model="form.name"
                v-show="isEdit"
                placeholder="请输入设备名称"
              ></Input>
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ form.name }}
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="" prop="softwareVersion" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>软件版本</p>
            </div>
            <div class="formValCon">
              <Input
                :border="false"
                v-show="isEdit"
                v-model="form.softwareVersion"
                placeholder="请输入软件版本"
              ></Input>
              <!-- class="formVal" -->
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ form.softwareVersion }}
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="" prop="productionDate" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>生产日期</p>
            </div>
            <div class="formValCon">
              <DatePicker
                v-show="isEdit"
                :model-value="form.productionDate"
                type="date"
                placeholder="请选择生产日期"
              />
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ form.productionDate || "无" }}
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="" prop="mouseNum" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>鼠标数量</p>
            </div>
            <div class="formValCon">
              <InputNumber
                v-show="isEdit"
                v-model="form.mouseNum"
                :min="1"
                controls-outside
              />
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ form.mouseNum }}
                </Text>
              </div>
            </div>
          </FormItem>
          <FormItem label="" prop="productionDate" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>本地硬盘大小</p>
            </div>
            <div class="formValCon f-row-b-c">
              <InputNumber
                class="formBite"
                :min="1"
                v-model="biteUnitSize"
                v-show="isEdit"
                placeholder="请输入硬盘大小"
              ></InputNumber>
              <Select v-model="biteUnit" class="formUnit" v-show="isEdit">
                <Option
                  :value="item.value"
                  :key="index"
                  v-for="(item, index) in biteUnitArr"
                >
                  {{ item.name }}
                </Option>
              </Select>
              <div class="formVal" v-show="!isEdit">
                <Text
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  {{ computedHardDiskSize }}
                </Text>
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
      <h3 class="titleTxt">鼠标配置</h3>
      <div class="mouseBox" v-show="mouseDeviceList.length > 0">
        <div
          class="mouseItem f-row-b-c"
          v-for="(item, index) in mouseDeviceList"
          :key="index"
        >
          <!-- class="mItemLeft" -->
          <Text
            :ellipsis-config="{ tooltip: true }"
            ellipsis
            placement="bottom-start"
          >
            {{ item.name }}鼠标
          </Text>
          <div class="mItemOpt f-row-c-c">
            <Poptip placement="top" width="280" trigger="hover">
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
                  <Slider
                    :model-value="item.brushSize"
                    class="slider"
                    :min="1"
                    :step="1"
                    :max="5"
                    :marks="sliderMarks"
                    show-tip="never"
                  ></Slider>
                </div>
              </template>
            </Poptip>
            <div class="mItemOptIcon colorSelect">
              <ColorPicker :model-value="item.color"></ColorPicker>
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
      <div class="noDataCon f-col-s-c" v-show="mouseDeviceList.length <= 0">
        <img src="@/assets/images/no_data.png" alt="" />
        <span>当前暂无鼠标设备</span>
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
const handleChange = () => {
  isEdit.value = !isEdit.value;
};
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
let fontSize = ref<number>(1);
const sliderMarks = { 1: "1", 2: "3", 3: "5", 4: "7", 5: "9" };
let mouseDeviceList = ref<any[]>([]);
const computedHardDiskSize = computed(() => {
  if (form.hardDiskSize) {
    return useBytesUnit(form.hardDiskSize);
  }
  return 0;
});
const computedRemainderDisk = computed(() => {
  if (detailDate.hardDiskSize && detailDate.localStoreUseSize) {
    return useBytesUnit(detailDate.hardDiskSize - detailDate.localStoreUseSize);
  }
  return 0;
});
let percent = ref<number>(0);
let detailDate = reactive<any>({});
const getData = (item: any) => {
  getDeviceDetail(item.id).then((res) => {
    Object.assign(
      form,
      _.pick(res.data, [
        "name",
        "code",
        "hardDiskSize",
        "mouseNum",
        "productionDate",
        "softwareVersion",
      ])
    );
    percent.value =
      ((res.data.hardDiskSize - res.data.localStoreUseSize) /
        res.data.hardDiskSize) *
      100;

    Object.assign(detailDate, res.data);
    form.status = res.data.status.toString();
  });
  getMouseByDevice({ deviceCode: item.code }).then((res) => {
    mouseDeviceList.value = res.data;
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
  .noDataCon {
    .size(100%,auto);
    img {
      .size(200px,200px);
      margin-bottom: 10px;
    }
    span {
      font-size: 14px;
      color: @fontColor;
    }
  }
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
            width: 90%;
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
              .size(100%,32px);
              padding: 0px 7px;
              .ivu-typography {
                color: @f_color_h3;
              }
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
          padding-right: 20px;
        }
        &:nth-child(2n) {
          padding-left: 20px;
        }
        .mItemLeft {
          display: inline-block;
          .size(100%,auto);
        }
        .mItemOpt {
          flex-shrink: 0;
          .mItemOptIcon {
            margin-left: 10px;
            cursor: pointer;
          }
          .fSizeBox {
            .size(100%,100%);
            h3 {
              font-size: 14px;
              color: #333;
            }
            .slider {
              .size(100%,60px);
              padding: 10px;
              box-sizing: border-box;
              .ivu-slider-stop {
                .size(8px,8px);
                top: -2px;
                border: 1px solid @meet_summary_icon_time;
              }
            }
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
