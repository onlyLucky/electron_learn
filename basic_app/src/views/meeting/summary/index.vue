<!--
 * @Author: fg
 * @Date: 2023-01-09 10:39:59
 * @LastEditors: fg
 * @LastEditTime: 2023-02-08 16:41:53
 * @Description: 会议纪要
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
            className="meetName"
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
    <div class="footer f-col-c-c">
      <p class="fTotal f-row-c-e">(1/2)</p>
      <div class="audioCtl f-row-b-c">
        <div class="ctlLeft f-row-b-c">
          <svg-icon
            iconName="icon-48shangyishou"
            className="audioIcon"
            size="24"
            color="var(--f_color_active)"
          ></svg-icon>
          <div class="iconCtrl">
            <!-- <svg-icon
              iconName="icon-zanting"
              className="ctrlItem"
              size="36"
              color="var(--f_color_active)"
            ></svg-icon> -->
            <svg-icon
              iconName="icon-jiazaizhong"
              className="ctrlItem ctrlItemLoading"
              size="36"
              color="var(--f_color_active)"
            ></svg-icon>
          </div>
          <svg-icon
            iconName="icon-49xiayishou"
            className="audioIcon"
            size="24"
            color="var(--f_color_active)"
          ></svg-icon>
        </div>
        <div class="ctlCenter f-row-c-c">
          <slider
            class="cenSlider"
            value=""
            show-tip="never"
            backgroundColor="#e9e9e9"
            block-size="40"
            block-color="#ffffff"
          >
          </slider>
        </div>
        <div class="ctlRight f-row-e-c">
          <p>00:40 / 08:00</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import SvgIcon from "@/commons/SvgIcon/index.vue";
import { getMTListByMeetId, getAudioByMeetId } from "@/apis/meet";
import { useRoute } from "vue-router";
import { useHasFiles } from "../comps/mListDetail/useDownload";
const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
let pageNum = ref<number>(1);
const getData = () => {
  return getMTListByMeetId({
    pageSize: 20,
    pageNum: pageNum.value,
    meetId: queryParams.id,
  }).then((res) => {
    console.log(res, "res");
  });
};
// 音频列表
let audioList = reactive<any[]>([]);
const getAudioInfo = () => {
  return getAudioByMeetId({
    meetId: queryParams.id,
  }).then((res) => {
    // 获取音频列表 下载音频
    res.data.map((item: any, index: number) => {
      if (
        !useHasFiles(`/${queryParams.name}.${queryParams.id}/${item.realName}`)
      ) {
      }

      audioList.push(item);
    });
    console.log(res, "res");
  });
};
onMounted(() => {
  getData();
  getAudioInfo();
});
</script>
<style scoped lang="less">
:deep(.ivu-slider-wrap),
:deep(.ivu-slider-bar) {
  height: 6px;
  border-radius: 8px;
}
:deep(.ivu-slider-bar) {
  background: @f_color_active;
}
:deep(.ivu-slider-button) {
  .size(16px,16px);
  border-color: @f_color_active;
}
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
    height: calc(100% - 124px);
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
    .size(100%, 76px);
    border-top: 1px solid @meet_summary_bbc;
    background: url("@/assets/images/meet/summary_bbg.png") no-repeat;
    background-size: 100% 100%;
    .fTotal {
      .size(100%,20px);
      font-size: 14px;
      line-height: 4px;
      color: @f_color_active;
    }
    .audioCtl {
      .size(100%,50px);
      padding: 0 20px;
      box-sizing: border-box;
      .ctlLeft {
        .size(120px, 100%);
        flex-shrink: 0;
        margin-right: 36px;
        .audioIcon,
        .ctrlItem {
          cursor: pointer;
        }
        .ctrlItemLoading {
          animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
          from {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
      .ctlCenter {
        .size(100%,100%);
        .cenSlider {
          width: 100%;
        }
      }
      .ctlRight {
        .size(100px,100%);
        margin-left: 10px;
        flex-shrink: 0;
        font-size: 14px;
        color: @f_color_active;
      }
    }
  }
}
</style>
