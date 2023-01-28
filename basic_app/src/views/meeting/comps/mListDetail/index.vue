<!--
 * @Author: fg
 * @Date: 2023-01-05 17:47:11
 * @LastEditors: fg
 * @LastEditTime: 2023-01-28 18:02:13
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
                  创建人： 张三
                </Text>
              </div>
              <div class="otherInfo">
                <div class="itemOInfo">
                  <h3>设备名称</h3>
                  <Text
                    className="itemValue jumpTxt"
                    :ellipsis-config="{ tooltip: true }"
                    ellipsis
                    placement="bottom-start"
                    @click="goEquip"
                  >
                    测试设备
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
            <div class="switchInfo partInfo">
              <div class="switchItem partInfoItem f-row-b-c">
                <h3>会议分享</h3>
                <Switch
                  :model-value="true"
                  size="large"
                  :true-value="0"
                  :false-value="1"
                >
                  <template #open>
                    <span>允许</span>
                  </template>
                  <template #close>
                    <span>禁止</span>
                  </template>
                </Switch>
              </div>
              <div class="switchItem partInfoItem f-row-b-c">
                <h3>会议保密</h3>
                <Switch
                  :model-value="true"
                  size="large"
                  :true-value="1"
                  :false-value="0"
                >
                  <template #open>
                    <span>保密</span>
                  </template>
                  <template #close>
                    <span>公开</span>
                  </template>
                </Switch>
              </div>
            </div>
            <div class="useInfo">
              <div class="userHeader f-row-b-c">
                <h3>参会人员 <span>（20人）</span></h3>
                <Icon class="iconUseSearch" type="ios-search" size="20" />
              </div>
              <div class="useCon">
                <div class="useList">
                  <Space wrap :size="[8, 16]">
                    <div class="useItem f-col-b-c" v-for="i in 18" :key="i">
                      <div class="avatar f-col-c-c">张</div>
                      <Text
                        className="userName"
                        :ellipsis-config="{ tooltip: true }"
                        ellipsis
                        placement="bottom-start"
                        >张三张三张三张三</Text
                      >
                    </div>
                  </Space>
                  <span class="pageTap">查看更多</span>
                </div>
                <div v-show="false" class="noData f-col-c-c">
                  暂无参会人员数据
                </div>
              </div>
            </div>
            <div class="linkInfo partInfo">
              <div class="linkInfoItem partInfoItem f-row-b-c">
                <h3>会议文件</h3>
                <span>查看</span>
              </div>
              <div class="linkInfoItem partInfoItem f-row-b-c">
                <h3>分享列表</h3>
                <span>查看</span>
              </div>
              <div class="linkInfoItem partInfoItem f-row-b-c">
                <h3>会议纪要</h3>
                <span>查看</span>
              </div>
            </div>
          </div>
          <div class="footBox f-row-e-c">
            <Space wrap>
              <Button type="error">删除</Button>
              <Button>退出会议</Button>
            </Space>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import { getMeetDetailById } from "@/apis/meet";
import { Switch } from "view-ui-plus";

const router = useRouter();
let props = withDefaults(
  defineProps<{
    modelValue: boolean;
    mask?: boolean;
    mId: number | null;
  }>(),
  {
    modelValue: false,
    mask: false,
    mId: null,
  }
);
watch(
  () => props.mId,
  (val: number | null) => {
    console.log(val);
    if (val != null) getData(val);
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

onMounted(() => {});

const getData = (id: number) => {
  getMeetDetailById(id).then((res) => {
    console.log(res, "res");
  });
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
      height: calc(100% - 115px);
      background-color: @content_bg;
      overflow: auto;
      .meetInfo {
        .size(100%,auto);
        padding: 10px 20px;
        box-sizing: border-box;
        user-select: none;
        background-color: @bg;
        .mainInfo {
          .size(100%,70px);
          border-bottom: 1px solid @search_bottom_border;
          .mainTitle {
            .size(100%,40px);
            .meetName {
              width: calc(100% - 30px);
              height: 100%;
              line-height: 30px;
              font-size: 16px;
              font-weight: 600;
            }
            .meetOptBox {
              .size(30px,100%);
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
          padding-top: 10px;
          .itemOInfo {
            margin-bottom: 14px;
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
              display: inline-block;
              .size(100%, 30px);
              line-height: 30px;
              font-size: 14px;
              color: @fontColor;
            }
            .itemValue.jumpTxt {
              color: @f_color_active;
              cursor: pointer;
            }
          }
        }
      }
      .switchInfo {
        .switchItem {
        }
      }
      .partInfo {
        .size(100%, auto);
        background: @bg;
        margin-top: 10px;
        padding: 0 20px;
        box-sizing: border-box;
        .partInfoItem {
          .size(100%, 52px);
          border-bottom: 1px solid @search_bottom_border;
          &:last-child {
            border-bottom: none;
          }
          h3 {
            font-size: 14px;
          }
        }
      }
      .linkInfo {
        .linkInfoItem {
          span {
            font-size: 14px;
            color: @f_color_active;
            cursor: pointer;
          }
        }
      }
      .useInfo {
        .size(100%,auto);
        min-height: 100px;
        background: @bg;
        margin-top: 10px;
        padding: 0 20px;
        box-sizing: border-box;
        .userHeader {
          .size(100%,50px);
          h3 {
            font-size: 14px;
          }
          .iconUseSearch {
            cursor: pointer;
          }
        }
        .useCon {
          .size(100%,auto);
          .useList {
            .size(100%,auto);
            // padding-left: 4px;
            padding-bottom: 12px;
            box-sizing: border-box;
            .useItem {
              .size(60px,60px);
              .avatar {
                .size(40px,40px);
                background-color: @f_color_active;
                border-radius: 4px;
                font-size: 14px;
                color: @bg;
                flex-shrink: 0;
              }
              .userName {
                .size(60px,20px);
                line-height: 20px;
                font-size: 12px;
                text-align: center;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .footBox {
      width: 100%;
      height: 70px;
      padding: 0 10px;
      box-sizing: border-box;
      box-shadow: 0px -3px 19px -12px @fontColor;
    }
  }
}
</style>
