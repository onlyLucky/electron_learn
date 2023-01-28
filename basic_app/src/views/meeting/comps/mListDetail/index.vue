<!--
 * @Author: fg
 * @Date: 2023-01-05 17:47:11
 * @LastEditors: fg
 * @LastEditTime: 2023-01-28 10:27:57
 * @Description: 会议详情
-->
<template>
  <teleport to="#DetailModel">
    <div class="modelBox" v-show="modelValue">
      <div class="detailModel" v-show="mask"></div>
      <transition name="move-right">
        <div class="detail" v-show="modelValue">
          <div class="detailHeader f-row-b-c">
            <h1>会议详情</h1>
            <Icon size="34" type="ios-close" @click="onClose" />
          </div>
          <div class="contentBox">
            <div class="meetInfo">
              <div class="mainInfo">
                <div class="mainTitle f-row-b-c">
                  <Text
                    className="meetName"
                    :ellipsis-config="{ tooltip: true }"
                    ellipsis
                    placement="bottom-start"
                  >
                    可立即批注简称可立批，PC端界面设计讨论会议
                  </Text>
                  <div class="meetOptBox f-row-b-c">
                    <Tooltip placement="bottom-end" content="编辑">
                      <svg-icon
                        iconName="icon-bianji"
                        className="mInfoIcon"
                        color="var(--fontColor)"
                      ></svg-icon>
                    </Tooltip>
                  </div>
                </div>
                <Text
                  className="meetEq"
                  :ellipsis-config="{ tooltip: true }"
                  ellipsis
                  placement="bottom-start"
                >
                  创建于
                  <span @click="goEquip">xxxxxxxxxxxxxxxxxxxxxxxxxx设备</span>
                </Text>
              </div>
              <div class="otherInfo">
                <div class="itemOInfo">
                  <h3>创建人</h3>
                  <Text
                    className="itemValue"
                    :ellipsis-config="{ tooltip: true }"
                    ellipsis
                    placement="bottom-start"
                  >
                    白居易
                  </Text>
                </div>
                <div class="itemOInfo">
                  <h3>会议时间</h3>
                  <Text
                    className="itemValue"
                    :ellipsis-config="{ tooltip: true }"
                    ellipsis
                    placement="bottom-start"
                  >
                    2022-12-12 10:30
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div class="footBox f-row-e-c">
            <Button>退出会议</Button>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
withDefaults(
  defineProps<{
    modelValue: boolean;
    mask?: boolean;
  }>(),
  {
    modelValue: false,
    mask: false,
  }
);
let emit = defineEmits<{
  (e: "update:modelValue", flag: boolean): void;
}>();
const onClose = () => {
  emit("update:modelValue", false);
};
const goEquip = () => {
  router.push({ name: "equipment", params: { username: "post" } });
};
</script>
<style lang="less" scoped>
.modelBox {
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  pointer-events: none;
  .detailModel {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: auto;
  }
  .detail {
    position: absolute;
    background-color: @bg;
    bottom: 0px;
    right: 0;
    .size(450px,100%);
    pointer-events: auto;
    box-shadow: -3px 0px 12px -5px @fontColor,
      inset 0px 27px 17px -35px @fontColor;
    .detailHeader {
      padding: 0 10px;
      box-sizing: border-box;
      .size(100%, 45px);
      h1 {
        font-size: 18px;
        font-weight: 400;
      }
    }
    .contentBox {
      width: 100%;
      height: calc(100% - 95px);
      background-color: @content_bg;
      overflow: auto;
    }
    .footBox {
      width: 100%;
      height: 50px;
      padding: 0 10px;
      box-sizing: border-box;
      box-shadow: 0px -3px 19px -12px @fontColor;
    }
    .meetInfo {
      .size(100%,auto);
      padding: 10px;
      box-sizing: border-box;
      user-select: none;
      background-color: @bg;
      .mainInfo {
        .size(100%,60px);
        border-bottom: 1px solid @search_bottom_border;
        .mainTitle {
          .size(100%,30px);
          .meetName {
            width: calc(100% - 30px);
            height: 100%;
            line-height: 30px;
            font-size: 16px;
            font-weight: 600;
          }
          .meetOptBox {
            .size(30px,100%);
            background: pink;
            .mInfoIcon {
              .size(18px,18px);
              margin-left: 8px;
              cursor: pointer;
              font-weight: 500;
            }
          }
        }
        .meetEq {
          .size(100%,20px);
          line-height: 20px;
          font-size: 14px;
          color: @f_color_h3;
          span {
            color: @f_color_active;
            cursor: pointer;
          }
        }
      }
      .otherInfo {
        padding: 10px 0;
        .itemOInfo {
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0px;
          }
          h3 {
            font-size: 14px;
            height: 24px;
            line-height: 24px;
            margin-bottom: 6px;
          }
          .itemValue {
            .size(100%, 20px);
            font-size: 14px;
            color: @fontColor;
          }
        }
      }
    }
  }
}
</style>
