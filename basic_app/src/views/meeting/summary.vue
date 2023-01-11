<!--
 * @Author: fg
 * @Date: 2023-01-09 10:39:59
 * @LastEditors: fg
 * @LastEditTime: 2023-01-11 14:12:31
 * @Description: content
-->
<template>
  <div class="summary">
    <div class="header f-row-b-c">
      <h1>会议纪要</h1>
      <SystemOpt
        :isShowChangeSize="false"
        color="var(--bg)"
        :isShowMinSize="false"
      ></SystemOpt>
    </div>
    <div class="content">
      <div class="conHeader f-row-b-c">
        <div class="cHLeft">
          <Text
            class="meetName"
            :ellipsis-config="{ tooltip: true }"
            ellipsis
            placement="bottom-start"
          >
            可立即批注简称可立批，PC端界面设计讨论会议可立即批注简称可立
          </Text>
          <div class="timeCon f-row-s-c">
            <SvgIcon
              iconName="icon-shijian-xianxing"
              :style="{ width: '18px', height: '18px' }"
              color="var(--meet_summary_icon_time)"
            ></SvgIcon>
            <span>2022-12-12 11:30-14:00</span>
          </div>
        </div>
        <div class="cHRight download f-row-c-c">
          <SvgIcon
            iconName="icon-yunxiazai-"
            :style="{ width: '20px', height: '20px', marginRight: '5px' }"
            color="var(--bg)"
          ></SvgIcon>
          <span>下载</span>
        </div>
      </div>
      <div class="conCon">
        <div class="conItem active f-row-b-c">
          <span
            >可立即批注简称可立批，PC端界面设计讨论会议可立即批注简称可立批，PC端界面设计讨论会议可立即批注简称可立批，PC端界面设计讨论会议可立即批注简称可立批，PC端界面设计讨论会议可立即批注简称可立批，PC端界面设计讨论会议</span
          >
          <SvgIcon
            iconName="icon-Wi-Fi1"
            className="conIcon"
            color="var(--meet_summary_icon_time)"
          ></SvgIcon>
        </div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import SvgIcon from "@/commons/SvgIcon/index.vue";
import { transform } from "lodash";
</script>
<style scoped lang="less">
.summary {
  .size(100vw,100vh);

  .header {
    .size(100%,48px);
    padding: 0 8px 0 16px;
    box-sizing: border-box;
    background-color: @f_color_active;
    -webkit-app-region: drag;
    h1 {
      font-size: 16px;
      color: @bg;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 121px);
    padding: 20px;
    box-sizing: border-box;
    .conHeader {
      .size(100%,74px);
      .cHLeft {
        width: calc(100% - 100px);
        .meetName {
          .size(100%,26px);
          line-height: 26px;
          font-size: 18px;
          font-weight: bold;
          color: @f_color_h3;
          margin-bottom: 6px;
        }
        .timeCon {
          span {
            font-size: 14px;
            color: @fontColor;
            margin-left: 5px;
          }
        }
      }
      .cHRight {
        .size(96px, 36px);
        border-radius: 18px;
        span {
          font-size: 16px;
        }
      }
      .download {
        background-color: @f_color_active;
        span {
          color: @bg;
        }
      }
    }
    .conCon {
      width: 100%;
      height: calc(100% - 74px);
      overflow: auto;
      .conItem {
        .size(100%,auto);
        padding: 12px 16px;
        box-sizing: border-box;
        border: 1px solid @meet_summary_item_bc;
        border-radius: 6px;
        span {
          font-size: 16px;
          color: @fontColor;
          margin-right: 20px;
        }
        .conIcon {
          .size(20px,20px);
          flex-shrink: 0;
          transform: rotate(90deg);
        }
      }
      .active {
        span {
          color: @f_color_active;
        }
      }
    }
  }
  .footer {
    .size(100%, 73px);
    border-top: 1px solid @meet_summary_bbc;
    background: url("@/assets/images/meet/summary_bbg.png") no-repeat;
  }
}
</style>
