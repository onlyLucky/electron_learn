<!--
 * @Author: fg
 * @Date: 2023-01-09 10:39:59
 * @LastEditors: fg
 * @LastEditTime: 2023-04-10 18:03:34
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
          <div
            :class="['meetName', downloadDocStatus == 4 ? 'meetDownload' : '']"
            v-debounce="goReadFile"
          >
            <Text
              :ellipsis-config="{ tooltip: true }"
              ellipsis
              placement="bottom-start"
            >
              {{ queryParams.name }}
            </Text>
          </div>

          <div class="timeCon f-row-s-c">
            <SvgIcon
              iconName="icon-shijian-xianxing"
              :style="{ width: '18px', height: '18px' }"
              color="var(--meet_summary_icon_time)"
            ></SvgIcon>
            <span>{{ detail.createTime }}</span>
          </div>
        </div>
        <div class="cHRight download f-row-c-c" v-debounce="goDownloadDoc">
          <!-- <div class="downloadBg"></div> -->
          <!-- 未下载 -->
          <SvgIcon
            v-show="downloadDocStatus == 0 && downloadStatus == 2"
            iconName="icon-yunxiazai-"
            className="cHRightIcon"
            size="20"
            :style="{ width: '20px', height: '20px', marginRight: '5px' }"
            color="var(--bg)"
          ></SvgIcon>
          <!-- 加载中 -->
          <svg-icon
            v-show="downloadStatus != 2 || downloadDocStatus == 1"
            iconName="icon-jiazaizhong"
            className="cHRightIcon iconLoading"
            size="20"
            color="var(--bg)"
          ></svg-icon>
          <!-- 已下载 -->
          <svg-icon
            v-show="downloadDocStatus == 2 || downloadDocStatus == 4"
            iconName="icon-duihao"
            className="cHRightIcon"
            size="20"
            color="var(--bg)"
          ></svg-icon>
          <!-- 下载失败 -->
          <svg-icon
            v-show="downloadDocStatus == 3"
            iconName="icon-shibai"
            className="cHRightIcon"
            size="20"
            color="var(--bg)"
          ></svg-icon>
          <span>{{
            downloadDocStatus == 0
              ? "下载"
              : downloadDocStatus == 1
              ? "下载中"
              : downloadDocStatus == 2
              ? "已下载"
              : downloadDocStatus == 4
              ? "查看文件"
              : "下载失败"
          }}</span>
        </div>
      </div>
      <div class="conCon">
        <div class="conBox" v-show="pageList.length > 0" @scroll="onConScroll">
          <div
            :class="
              audioTxtIndex == index
                ? 'conItem active f-row-b-c'
                : 'conItem f-row-b-c'
            "
            v-for="(item, index) in pageList"
            :key="index"
          >
            <span>{{ item.text }}</span>
            <SvgIcon
              iconName="icon-Wi-Fi1"
              :className="
                audioTxtIndex == index ? 'conIcon iconShark' : 'conIcon'
              "
              :color="
                audioTxtIndex == index
                  ? 'var(--f_color_active)'
                  : 'var(--meet_summary_icon_time)'
              "
            ></SvgIcon>
          </div>

          <div class="conFooter f-row-c-c">
            <span
              class="conFooterLink"
              v-debounce="goNextPage"
              v-show="pageTotal > pageList.length"
              >查看更多</span
            >
            <span class="conFooterTxt" v-show="pageTotal == pageList.length"
              >已经到底了哦</span
            >
          </div>
        </div>
        <!-- 加载 -->
        <Spin :show="loading" fix size="large" class="loading">
          <Icon
            type="ios-loading"
            size="26"
            class="conLoading iconLoading"
          ></Icon>
          <div class="conLoadingTxt">加载中...</div>
        </Spin>

        <div class="noDataCon f-col-s-c" v-show="pageList.length <= 0">
          <img src="@/assets/images/no_data.png" alt="" />
          <span>当前暂无会议纪要</span>
        </div>
      </div>
    </div>
    <div class="footer f-col-c-c">
      <p class="fTotal f-row-c-e">
        <span v-show="audioSrc.length > 0"
          >({{ audioCurrent }}/{{ audioSrc.length }})</span
        >
      </p>
      <div class="audioCtl f-row-b-c">
        <div class="ctlLeft f-row-b-c">
          <svg-icon
            iconName="icon-48shangyishou"
            v-debounce="handlePrevious"
            :className="audioCurrent == 1 ? 'audioIcon disabled' : 'audioIcon'"
            size="24"
            color="var(--f_color_active)"
          ></svg-icon>
          <div class="iconCtrl">
            <div
              class="ctrlBtn f-row-c-c"
              @click="audioCtrl"
              v-show="downloadStatus == 2"
            >
              <svg-icon
                v-show="!audioInfo.playing"
                iconName="icon-zanting"
                className="ctrlItem"
                size="34"
                color="var(--f_color_active)"
              ></svg-icon>
              <svg-icon
                v-show="audioInfo.playing"
                iconName="icon-zanting1"
                className="ctrlItem"
                size="36"
                color="var(--f_color_active)"
              ></svg-icon>
            </div>
            <svg-icon
              v-show="downloadStatus != 2"
              iconName="icon-jiazaizhong"
              className="ctrlItem iconLoading"
              size="36"
              color="var(--f_color_active)"
            ></svg-icon>
          </div>
          <svg-icon
            iconName="icon-49xiayishou"
            :className="
              audioCurrent == audioSrc.length
                ? 'audioIcon disabled'
                : 'audioIcon'
            "
            v-debounce="handleNext"
            size="24"
            color="var(--f_color_active)"
          ></svg-icon>
        </div>
        <div class="ctlCenter f-row-c-c">
          <slider
            :model-value="audioInfo.progress"
            class="cenSlider"
            show-tip="never"
            backgroundColor="#e9e9e9"
            block-size="40"
            block-color="#ffffff"
            @on-change="onSliderChange"
          >
          </slider>
        </div>
        <div class="ctlRight f-row-e-c">
          <p>
            {{ audioInfo.currentTimeTxt || "00:00" }} /
            {{ audioInfo.durationTxt || "00:00" }}
          </p>
        </div>
      </div>
    </div>
    <!-- 音频播放组件 -->
    <AudioComps
      :src="audioSrc"
      ref="refAudioComps"
      @change="onAudioChange"
    ></AudioComps>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import SvgIcon from "@/commons/SvgIcon/index.vue";
import AudioComps, { AudioInfoType } from "@/commons/AudioComps/index.vue";
import {
  getMTListByMeetId,
  getAudioByMeetId,
  getMeetDetailById,
  getMeetSummary,
} from "@/apis/meet";
import { useRoute } from "vue-router";
import {
  useDownload,
  useDownloadOpt,
  useNodeStreamDownload,
} from "@/hooks/useElectronDownload";
import hdObj from "_v/setting/handleData";
import { join } from "path";
import { Message } from "view-ui-plus";
import { shell } from "electron";
const fs = require("fs");

// 文件存在
const downloadPath = hdObj.getConfigItem("download").downloadPath.value;

const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);

// 会议纪要下载
let downloadDocStatus = ref<0 | 1 | 2 | 3 | 4>(0); //0 下载 1下载中 2已下载 3下载失败 4查看文件
const goDownloadDoc = () => {
  let temp = `/${queryParams.name}.${queryParams.id}/${queryParams.name}_${queryParams.id}.docx`;
  if (fs.existsSync(join(downloadPath, temp))) {
    // 查看文件
    goReadFile();
    return false;
  }
  downloadDocStatus.value = 1;
  getMeetSummary({ meetId: queryParams.id }).then((res) => {
    useNodeStreamDownload(
      {
        path: join(downloadPath, temp),
        streamContent: res,
      },
      () => {
        downloadDocStatus.value = 2;
        setTimeout(() => {
          downloadDocStatus.value = 4;
        }, 1200);
      },
      (err: any) => {
        downloadDocStatus.value = 3;
        Message.error(err.stack || "会议纪要文件写入失败");
      }
    );
  });
};

// 查看文件
const goReadFile = () => {
  // 查看文件
  let temp = `/${queryParams.name}.${queryParams.id}/${queryParams.name}_${queryParams.id}.docx`;
  if (downloadDocStatus.value == 4) {
    shell.openPath(join(downloadPath, temp));
  }
};

// 会议纪要主体内容列表
let pageNum = ref<number>(1);
let pageTotal = ref<number>(0);
let pageSize = ref<number>(20);
let pageList = reactive<any[]>([]);
let loading = ref<boolean>(false);
const getData = () => {
  loading.value = true;
  return getMTListByMeetId({
    pageSize: pageSize.value,
    pageNum: pageNum.value,
    meetId: queryParams.id,
  })
    .then((res) => {
      loading.value = false;
      if (pageNum.value == 1) {
        pageList = [...res.data.records];
      } else {
        pageList.push(...res.data.records);
      }
      console.log(pageNum.value, "res", res.data.records);
      pageTotal.value = res.data.total;
    })
    .catch((err) => {
      // 数据加载失败之后 页面减一
      if (pageNum.value !== 1) {
        pageNum.value = pageNum.value - 1;
      }
      loading.value = false;
    });
};
//查看下一页
const goNextPage = () => {
  if (!loading.value) {
    pageNum.value = pageNum.value + 1;
    getData();
  }
};
// 滚动区域监听
const onConScroll = (e: any) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target;
  if (scrollTop + clientHeight === scrollHeight) {
    // console.log("滚动到底部");
    if (pageTotal.value > pageList.length) {
      goNextPage();
    }
  }
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
// 音频操作交互
let audioInfo = reactive<AudioInfoType>({} as AudioInfoType);
let audioTxtIndex = ref<number>(-1); // 会议纪要列表active 下标
const refAudioComps = ref<InstanceType<typeof AudioComps>>();
let audioSrc = reactive<string[]>([]);
let audioCurrent = ref<number>(1);
const onSliderChange = (value: number) => {
  refAudioComps.value?.seek(value);
};
const onAudioChange = (info: any, index: number) => {
  // console.log(info.progress);
  audioCurrent.value = index + 1;
  // 处理会议纪要当前第几段
  let tempFlag = pageList.some((item, i) => {
    /* console.log(
      item.paragraph,
      audioCurrent.value,
      info.currentTime * 1000,
      item.bgTime,
      item.edTime,
      "pageList" + i
    ); */
    if (
      item.paragraph == audioCurrent.value &&
      info.currentTime * 1000 >= item.bgTime &&
      info.currentTime * 1000 <= item.edTime
    ) {
      audioTxtIndex.value = i;
    }
    return (
      item.paragraph == audioCurrent.value &&
      info.currentTime * 1000 >= item.bgTime &&
      info.currentTime * 1000 <= item.edTime
    );
  });
  if (!tempFlag) {
    audioTxtIndex.value = -1;
  }
  // console.log(info.currentTime, audioTxtIndex.value, audioCurrent.value);
  Object.assign(audioInfo, info);
};
const audioCtrl = () => {
  refAudioComps.value?.handlePlay();
  Object.assign(audioInfo, refAudioComps.value?.audioInfo);
};
const handlePrevious = () => {
  refAudioComps.value?.previous();
};
const handleNext = () => {
  refAudioComps.value?.next();
};
// 获取会议详情
let detail = reactive<any>({});
const getDetail = () => {
  return getMeetDetailById(queryParams.id).then((res) => {
    Object.assign(detail, res.data);
  });
};
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
      audioList.map((item) => {
        let temp = `/${queryParams.name}.${queryParams.id}/${item.realName}`;
        audioSrc.push(join(downloadPath, temp));
      });
      console.log(audioSrc);
    },
  });
  // 会议纪要文档文件检测
  let temp = `/${queryParams.name}.${queryParams.id}/${queryParams.name}_${queryParams.id}.docx`;
  downloadDocStatus.value = fs.existsSync(join(downloadPath, temp)) ? 4 : 0;
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
:deep(.meetName) {
  .ivu-typography {
    color: @f_color_h3;
  }
}
:deep(.meetName.meetDownload) {
  .ivu-typography {
    color: @f_color_active;
  }
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
      .fontSizePx2Em(16);
      color: @bg;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 124px);
    padding: 10px 20px;
    box-sizing: border-box;
    .conHeader {
      .size(100%,74px);
      margin-bottom: 10px;
      .cHLeft {
        width: calc(100% - 100px);
        .meetName {
          .size(100%,26px);
          line-height: 26px;
          .fontSizePx2Em(18);
          font-weight: bold;
          color: @f_color_h3;
          margin-bottom: 6px;
        }
        .meetName.meetDownload {
          cursor: pointer;
          color: @f_color_active;
        }
        .timeCon {
          span {
            .fontSizePx2Em(14);
            color: @fontColor;
            margin-left: 5px;
          }
        }
      }
      .cHRight {
        .size(96px, 36px);
        border-radius: 18px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        .cHRightIcon {
          margin-right: 5px;
          z-index: 2;
        }
        span {
          .fontSizePx2Em(14);
          z-index: 2;
        }
        .downloadBg {
          .size(50%,100%);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          background-color: rgba(0, 0, 0, 0.4);
        }
      }
      .cHRight.download {
        background-color: @f_color_active;
        span {
          color: @bg;
        }
      }
    }
    .conCon {
      width: 100%;
      height: calc(100% - 84px);
      position: relative;
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
            .fontSizePx2Em(16);
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
            .fontSizePx2Em(14);
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
      .loading {
        .size(100%,100%);
        background-color: rgba(255, 255, 255, 0.7);
        .conLoading {
          margin-bottom: 10px;
        }
        .conLoadingTxt {
          .fontSizePx2Em(14);
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
          .fontSizePx2Em(14);
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
      .fontSizePx2Em(14);
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
        .iconCtrl {
          .size(36px,36px);
          cursor: pointer;
          .ctrlBtn {
            .size(100%,100%);
          }
        }
        .audioIcon.disabled {
          cursor: not-allowed;
        }

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
        .fontSizePx2Em(14);
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
