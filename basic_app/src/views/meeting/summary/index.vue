<!--
 * @Author: fg
 * @Date: 2023-01-09 10:39:59
 * @LastEditors: fg
 * @LastEditTime: 2023-02-09 15:19:42
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
            {{ queryParams.name }}
          </Text>
          <div class="timeCon f-row-s-c">
            <SvgIcon
              iconName="icon-shijian-xianxing"
              :style="{ width: '18px', height: '18px' }"
              color="var(--meet_summary_icon_time)"
            ></SvgIcon>
            <span>{{ detail.createTime }}</span>
          </div>
        </div>
        <div class="cHRight download f-row-c-c">
          <SvgIcon
            v-show="downloadStatus == 2"
            iconName="icon-yunxiazai-"
            className="cHRightIcon"
            size="20"
            :style="{ width: '20px', height: '20px', marginRight: '5px' }"
            color="var(--bg)"
          ></SvgIcon>
          <svg-icon
            v-show="downloadStatus != 2"
            iconName="icon-jiazaizhong"
            className="cHRightIcon iconLoading"
            size="20"
            color="var(--bg)"
          ></svg-icon>
          <span>下载</span>
        </div>
      </div>
      <div class="conCon">
        <div class="conBox" v-show="pageList.length > 0">
          <div
            class="conItem active f-row-b-c"
            v-for="(item, index) in pageList"
            :key="index"
          >
            <span>{{ item.text }}</span>
            <SvgIcon
              iconName="icon-Wi-Fi1"
              className="conIcon iconShark"
              color="var(--meet_summary_icon_time)"
            ></SvgIcon>
          </div>
          <div class="conFooter f-row-c-c">
            <span
              class="conFooterLink"
              v-show="!(pageTotal - pageList.length < pageSize)"
              >查看更多</span
            >
            <span
              class="conFooterTxt"
              v-show="pageTotal - pageList.length < pageSize"
              >已经到底了哦</span
            >
          </div>
        </div>

        <div class="noDataCon f-col-s-c" v-show="pageList.length <= 0">
          <img src="@/assets/images/no_data.png" alt="" />
          <span>当前暂无会议纪要</span>
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
            <svg-icon
              v-show="downloadStatus == 2"
              iconName="icon-zanting"
              className="ctrlItem"
              size="36"
              color="var(--f_color_active)"
            ></svg-icon>
            <svg-icon
              v-show="downloadStatus != 2 && audioDownloadFlag"
              iconName="icon-jiazaizhong"
              className="ctrlItem iconLoading"
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
          <p>00:00 / 08:00</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import SvgIcon from "@/commons/SvgIcon/index.vue";
import {
  getMTListByMeetId,
  getAudioByMeetId,
  getMeetDetailById,
} from "@/apis/meet";
import { useRoute } from "vue-router";
import { useDownload, useDownloadOpt } from "@/hooks/useElectronDownload";

const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);
// 会议纪要主体内容列表
let pageNum = ref<number>(1);
let pageTotal = ref<number>(0);
let pageSize = ref<number>(20);
let pageList = reactive<any[]>([]);
const getData = () => {
  return getMTListByMeetId({
    pageSize: pageSize.value,
    pageNum: pageNum.value,
    meetId: queryParams.id,
  }).then((res) => {
    if (pageNum.value == 1) {
      pageList = [...res.data.records];
    } else {
      pageList.push(res.data.records);
    }
    console.log(res, "res");
    pageTotal.value = res.data.total;
  });
};
// 音频列表
let audioList = reactive<any[]>([]);
const getAudioInfo = () => {
  return getAudioByMeetId({
    meetId: queryParams.id,
  }).then((res) => {
    // 获取音频列表 下载音频
    audioList = [...res.data];
  });
};
// 获取会议详情
let detail = reactive<any>({});
const getDetail = () => {
  return getMeetDetailById(queryParams.id).then((res) => {
    Object.assign(detail, res.data);
  });
};
let audioDownloadFlag = ref<boolean>(true); // 音频是否正在下载
const { progress, downloadStatus } = useDownload();
onMounted(async () => {
  await getDetail();
  await getData();
  await getAudioInfo();
  // 音频下载处理
  useDownloadOpt({
    list: audioList,
    directory: `${queryParams.name}.${queryParams.id}`,
    onSuccess: () => {
      audioDownloadFlag.value = false;
    },
  });
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
        .cHRightIcon {
          margin-right: 5px;
        }
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
      .conBox {
        .size(100%,100%);
        overflow: auto;
        .conItem {
          .size(100%,auto);
          padding: 12px 16px;
          box-sizing: border-box;
          border: 1px solid @meet_summary_item_bc;
          border-radius: 6px;
          margin-bottom: 12px;
          &:last-child {
            margin-bottom: 0;
          }
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
        .conItem.active {
          span {
            color: @f_color_active;
          }
        }
        .conFooter {
          .size(100%,20px);
          span {
            font-size: 14px;
            padding: 0px 10px;
          }
          span.conFooterLink {
            cursor: pointer;
            color: @f_color_active;
          }
          span.conFooterTxt {
            color: @fontColor;
          }
        }
      }

      .noDataCon {
        .size(100%,100%);
        img {
          .size(200px,200px);
          margin-top: 50px;
          margin-bottom: 10px;
        }
        span {
          font-size: 14px;
          color: @fontColor;
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
.iconLoading {
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
.iconShark {
  animation: blink 0.8s ease-in-out infinite;
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
