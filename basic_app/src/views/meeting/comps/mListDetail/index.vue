<!--
 * @Author: fg
 * @Date: 2023-01-05 17:47:11
 * @LastEditors: fg
 * @LastEditTime: 2023-04-07 16:10:23
 * @Description: 会议详情
-->
<template>
  <teleport to="#DetailModel">
    <div class="modelBox" v-show="modelValue">
      <div class="detailModel" :style="maskStyle" @click="onClose"></div>
      <transition name="move-right">
        <div class="detail" v-show="modelValue">
          <div class="detailHeader f-row-b-c">
            <h1>会议详情</h1>
            <Icon size="34" type="ios-close" @click="onClose" />
          </div>
          <div
            class="contentBox"
            :style="{
              height: isShowBottomOpt
                ? 'calc(100% - 115px)'
                : 'calc(100% - 45px)',
            }"
          >
            <div class="meetInfo">
              <div class="mainInfo">
                <div class="mainTitle f-row-b-c">
                  <Skeleton :loading="loading" animated>
                    <template #template>
                      <SkeletonItem block width="300px" height="22px" />
                    </template>
                    <template #default>
                      <Text
                        v-show="!isEditStatus"
                        className="meetName"
                        :ellipsis-config="{ tooltip: true }"
                        ellipsis
                        placement="bottom-start"
                      >
                        {{ detail.name }}
                      </Text>
                      <Input
                        v-model="editDetail.name"
                        placeholder="请输入会议名称"
                        clearable
                        class="meetInput"
                        v-show="isEditStatus"
                      ></Input>
                    </template>
                  </Skeleton>

                  <div class="meetOptBox f-row-b-c" v-show="!isEditStatus">
                    <Tooltip placement="bottom-end" content="编辑">
                      <svg-icon
                        iconName="icon-bianji"
                        className="mInfoIcon"
                        color="var(--fontColor)"
                        @click="handleEdit"
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
                  <div class="f">
                    <div style="flex-shrink: 0">创建人：</div>
                    <Skeleton :loading="loading" animated>
                      <template #template>
                        <SkeletonItem block width="50px" height="22px" />
                      </template>
                      <template #default>
                        {{
                          detail.createUserName ? detail.createUserName : "无"
                        }}
                      </template>
                    </Skeleton>
                  </div>
                </Text>
              </div>
              <div class="otherInfo">
                <div class="itemOInfo">
                  <h3>设备名称</h3>
                  <Skeleton :loading="loading" animated>
                    <template #template>
                      <SkeletonItem block width="50%" height="22px" />
                    </template>
                    <template #default>
                      <Text
                        v-show="!isEditStatus"
                        className="itemValue jumpTxt"
                        :ellipsis-config="{ tooltip: true }"
                        ellipsis
                        placement="bottom-start"
                        @click="goEquip"
                      >
                        {{ detail.deviceName ? detail.deviceName : "无" }}
                      </Text>
                      <Select
                        style="width: 220px"
                        v-show="isEditStatus"
                        v-model="editDetail.deviceId"
                        filterable
                      >
                        <Option
                          v-for="(item, index) in deviceList"
                          :key="index"
                          :value="item.id"
                          >{{ item.name }}</Option
                        >
                      </Select>
                    </template>
                  </Skeleton>
                </div>
                <div class="itemOInfo">
                  <h3>会议时间</h3>
                  <Skeleton :loading="loading" animated>
                    <template #template>
                      <SkeletonItem block width="50%" height="22px" />
                    </template>
                    <template #default>
                      <Text
                        v-show="!isEditStatus"
                        className="itemValue"
                        :ellipsis-config="{ tooltip: true }"
                        ellipsis
                        placement="bottom-start"
                      >
                        {{ detail.createTime }}
                      </Text>
                      <!-- v-model="editDetail.createTime" -->
                      <DatePicker
                        :model-value="editDetail.createTime"
                        style="width: 220px"
                        v-show="isEditStatus"
                        type="datetime"
                        placeholder="请选择会议时间"
                        format="yyyy-MM-dd HH:mm"
                        @on-change="editDetail.createTime = $event"
                      ></DatePicker>
                    </template>
                  </Skeleton>
                </div>
              </div>
            </div>
            <div class="switchInfo partInfo">
              <div class="switchItem partInfoItem f-row-b-c">
                <h3>会议保密</h3>
                <Skeleton :loading="loading" animated>
                  <template #template>
                    <SkeletonItem block width="60px" height="22px" />
                  </template>
                  <template #default>
                    <Switch
                      :model-value="detail.secrecy"
                      size="large"
                      :true-value="1"
                      :false-value="0"
                      :loading="isSecrecyLoading"
                      @on-change="switchChange"
                      :before-change="
                        () => {
                          return useSecrecy({
                            id: mId,
                            secrecy: detail.secrecy ? 0 : 1,
                          });
                        }
                      "
                    >
                      <template #open>
                        <span>保密</span>
                      </template>
                      <template #close>
                        <span>公开</span>
                      </template>
                    </Switch>
                  </template>
                </Skeleton>
              </div>
              <div class="switchItem partInfoItem f-row-b-c">
                <h3>会议分享</h3>

                <Skeleton :loading="loading" animated>
                  <template #template>
                    <SkeletonItem block width="60px" height="22px" />
                  </template>
                  <template #default>
                    <Switch
                      :model-value="detail.meetShare"
                      size="large"
                      :true-value="0"
                      :false-value="1"
                      :loading="isShareLoading"
                      @on-change="switchChange"
                      :before-change="
                        () => {
                          return useShare({
                            id: mId,
                            meetShare: detail.meetShare ? 0 : 1,
                          });
                        }
                      "
                    >
                      <template #open>
                        <span>允许</span>
                      </template>
                      <template #close>
                        <span>禁止</span>
                      </template>
                    </Switch>
                  </template>
                </Skeleton>
              </div>
            </div>
            <div class="linkInfo partInfo">
              <div class="linkInfoItem partInfoItem f-row-b-c">
                <h3>会议文件</h3>
                <div
                  class="noFile"
                  v-if="
                    downloadUse.fileList && downloadUse.fileList.length <= 0
                  "
                >
                  <span>暂无文件</span>
                </div>
                <!-- v-else -->
                <div v-else>
                  <div
                    class="download f-row-e-c"
                    v-if="downloadUse.isNeedDownload"
                  >
                    <Progress
                      v-show="downloadUse.status == 1"
                      :percent="downloadUse.progress"
                      :stroke-width="6"
                      status="active"
                    >
                      <span class="proTxt"> {{ downloadUse.progress }}% </span>
                    </Progress>
                    <div
                      class="f-row-c-c"
                      v-show="downloadUse.status != 1"
                      @click="handleDownload"
                    >
                      <svg-icon
                        size="18"
                        iconName="icon-yunxiazai-"
                        color="var(--f_color_active)"
                      ></svg-icon>
                      <span>下载</span>
                    </div>
                  </div>
                  <span v-show="!downloadUse.isNeedDownload" @click="goFileWin"
                    >查看</span
                  >
                </div>
              </div>
              <div
                class="linkInfoItem partInfoItem f-row-b-c"
                v-show="detail.fileUpload == 1"
              >
                <h3>分享列表</h3>
                <span @click="goShareWin">查看</span>
              </div>
              <div
                class="linkInfoItem partInfoItem f-row-b-c"
                v-show="detail.fileUpload == 1"
              >
                <h3>会议纪要</h3>
                <span @click="goSummaryWin">查看</span>
              </div>
            </div>
            <div class="useInfo partInfo">
              <div class="userHeader f-row-b-c">
                <h3>
                  参会人员
                  <span v-if="page.total > 0">（{{ page.total }}人）</span>
                </h3>
                <Icon class="iconUseSearch" type="ios-search" size="20" />
              </div>

              <Skeleton :loading="loading" animated>
                <template #template>
                  <Space wrap :size="[8, 16]" style="padding-bottom: 10px">
                    <div
                      class="f-col-c-c"
                      style="width: 60px; height: 60px"
                      v-for="i in 3"
                      :key="i"
                    >
                      <SkeletonItem type="circle" width="36px" height="36px" />
                      <SkeletonItem
                        block
                        style="margin-top: 4px"
                        width="50px"
                        height="14px"
                      />
                    </div>
                  </Space>
                </template>
                <template #default>
                  <div class="useCon">
                    <div class="useList" v-if="userList.length > 0">
                      <Space wrap :size="[8, 16]">
                        <div
                          class="useItem"
                          v-for="(item, index) in userList"
                          :key="index"
                        >
                          <ddAvatar
                            :nickname="item.nickname"
                            :avatar="item.imageurl"
                          ></ddAvatar>
                        </div>
                      </Space>
                      <div
                        class="pageTap f-row-c-c"
                        v-show="userList.length < page.total"
                      >
                        <span>查看更多</span>
                      </div>
                    </div>
                    <div v-if="userList.length <= 0" class="noData f-col-c-c">
                      ———— 暂无参会人员数据 ————
                    </div>
                  </div>
                </template>
              </Skeleton>
            </div>
          </div>
          <!-- 
            退出会议： 正在进行中，自己再参会中的
            结束会议： 正在进行中，自己创建的
            删除： 已结束
           -->
          <div class="footBox f-row-e-c" v-show="isShowBottomOpt">
            <Space wrap v-show="!isEditStatus">
              <Poptip
                confirm
                title="是否删除当前会议？"
                @on-ok="delMeeting"
                placement="top-end"
                :disabled="detail.state == 0"
              >
                <Button v-show="detail.state == 1" type="error">删除</Button>
              </Poptip>
              <!-- <Button type="error">删除</Button> -->
              <Button v-show="detail.state == 0">结束会议</Button>
              <Button
                v-show="detail.state == 0 && isShowBottomOpt"
                v-debounce="outMeet"
                >退出会议</Button
              >
            </Space>
            <Space wrap v-show="isEditStatus">
              <Button v-debounce="editSave" type="primary">保存</Button>
              <Button v-debounce="editCancel">取消</Button>
            </Space>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
/* TODO: 结束会议添加 */
import { useRouter } from "vue-router";
import {
  getMeetDetailById,
  getMeetingUserBymeetId,
  getDeviceList,
  reviseMeetDetail,
  deleteByIds,
  deleteMeetConf,
  getAllFileByMeetId,
} from "@/apis/meet";
import ddAvatar from "@/components/ddAvatar.vue";
import {
  isSecrecyLoading,
  isShareLoading,
  useShare,
  useSecrecy,
} from "@/hooks/useMeetSwitch";
import { useDownload, DownloadType } from "./useDownload";
import _ from "lodash";
import { ipcRenderer } from "electron";
let loading = ref(false);
const router = useRouter();
let props = withDefaults(
  defineProps<{
    modelValue: boolean;
    mask?: boolean;
    mId: any;
    mName: any;
    deviceName?: any;
    isEdit: boolean;
  }>(),
  {
    modelValue: false,
    mask: false,
    mId: null,
    deviceName: null,
    isEdit: false,
    mName: null,
  }
);
let isShowBottomOpt = ref<boolean>(false);
// 下载模块导出变量函数操作
let downloadUse = reactive<DownloadType>({} as DownloadType);
let handleDownload = () => {};
watch(
  () => props.modelValue,
  async (val: boolean) => {
    console.log(props.modelValue, "props.modelValue");
    if (val) {
      initData();
      loading.value = true;
      await getData(props.mId);
      await getUserList(props.mId);
      await nextTick();
      let temp = useDownload(props.mId, props.mName) as any;
      downloadUse = temp.downloadUse;
      handleDownload = temp.handleDownload;
      loading.value = false;
      handleBHeight();
      if (props.isEdit) {
        handleEdit();
      }
    }
  }
);
let refUserName = ref<string>(
  JSON.parse(localStorage.getItem("userInfo")!).nickname
);
const handleBHeight = () => {
  if (detail.state) {
    isShowBottomOpt.value = true;
  } else {
    isShowBottomOpt.value = userList.some((item) => {
      return item.nickname == refUserName.value;
    });
  }
};

const maskStyle = computed(() => {
  return {
    backgroundColor: props.mask ? "rgba(0, 0, 0, 0.3)" : "transparent",
  };
});

let userList = reactive<any[]>([]);
let page = reactive({
  total: 0,
  pageSize: 18,
  pageNum: 1,
});
let detail = reactive<MeetDetailType>({} as MeetDetailType);

let emit = defineEmits<{
  (e: "update:modelValue", flag: boolean): void;
  (e: "uploadTable"): void;
}>();
const onClose = () => {
  // 关闭的时候查看数据是否更新了，列表更新数据
  if (dataNeedChange.value) {
    emit("uploadTable");
  }
  emit("update:modelValue", false);
  // 初始化数据
  initData();
};
const goEquip = () => {
  if (detail.deviceId) {
    router.push({ name: "equipment", params: { username: "post" } });
  }
};

const initData = () => {
  // 初始化
  userList = [];
  dataNeedChange.value = false;
  isEditStatus.value = false;
};

const getData = (id: number) => {
  return getMeetDetailById(id).then((res) => {
    Object.assign(detail, res.data);
  });
};
// 获取用户列表
const getUserList = (id: number) => {
  return getMeetingUserBymeetId({
    meetId: id,
    pageSize: page.pageSize,
    pageNum: page.pageNum,
  }).then((res) => {
    let temp = res.data?.records!;
    temp.map((item: any) => {
      item.imageurl = localStorage.getItem("staticPath") + item.imageurl;
    });
    Object.assign(userList, temp);
    page.total = res.data?.total!;
  });
};

// 会议时间计算
/* const meetTimeStr = computed(() => {
  if (detail.endTime) {
    return `${detail.createTime} - ${detail.endTime.substring(
      detail.endTime.length - 5
    )}`;
  } else {
    return detail.createTime;
  }
}); */

//数据更新修改
let dataNeedChange = ref<boolean>(false);
const switchChange = (val: number) => {
  dataNeedChange.value = true;
};
// 编辑处理
let isEditStatus = ref<boolean>(props.isEdit);
let editDetail = reactive({
  name: "",
  deviceName: "",
  deviceId: 0,
  createTime: "",
});
const handleEdit = () => {
  Object.assign(
    editDetail,
    _.pick(detail, ["name", "deviceName", "deviceId", "createTime"])
  );
  isEditStatus.value = true;
  isShowBottomOpt.value = true;
  console.log(isEditStatus.value, "isEditStatus");
};

let deviceList = reactive<any[]>([]);
onMounted(() => {
  // 获取设备列表
  getDeviceList().then((res) => {
    deviceList = res.data || [];
  });
});
const editSave = () => {
  reviseMeetDetail({
    id: props.mId,
    ...editDetail,
  }).then((res) => {
    isEditStatus.value = false;
    dataNeedChange.value = true;
    getData(props.mId);
    handleBHeight();
  });
};
const editCancel = () => {
  isEditStatus.value = false;
  handleBHeight();
};
// 删除处理
const delMeeting = () => {
  deleteByIds({
    ids: props.mId + "",
  }).then((res) => {
    isEditStatus.value = false;
    dataNeedChange.value = true;
    onClose();
  });
};

// 退出会议
const outMeet = () => {
  deleteMeetConf({
    meetId: props.mId,
  }).then((res) => {
    isEditStatus.value = false;
    dataNeedChange.value = true;
    onClose();
  });
};

// 下载

/* const download = () => {
  ipcRenderer.send("download", {
    path: "http://192.168.10.215:8080/china/M00/00/08/wKgK12NaSbqAV5USCLLhJNUn4WM121.mp4",
    directory: "test",
    fileName: "test.mp4",
  });
}; */

// 文件查看
const goFileWin = () => {
  ipcRenderer.invoke("open-win", {
    type: 0,
    urlName: `models/meet/file?name=${detail.name}&id=${props.mId}`,
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    resizable: true,
    title: `${detail.name}_文件列表`,
  });
};
// 会议纪要
const goSummaryWin = () => {
  ipcRenderer.invoke("open-win", {
    type: 0,
    urlName: `models/meet/summary?name=${detail.name}&id=${props.mId}`,
    width: 1024,
    height: 700,
    minWidth: 1024,
    minHeight: 700,
    resizable: false,
    title: `${detail.name}_会议纪要`,
  });
};

// 会议分享列表
const goShareWin = () => {
  ipcRenderer.invoke("open-win", {
    type: 0,
    urlName: `models/meet/share?name=${detail.name}&id=${props.mId}`,
    width: 800,
    height: 700,
    minWidth: 800,
    minHeight: 700,
    resizable: false,
    title: `${detail.name}_分享列表`,
  });
};

defineExpose({
  handleEdit,
});
</script>
<style lang="less" scoped>
:deep(.useItem .ivu-skeleton .ivu-skeleton-item) {
  margin-top: 4px;
}
:deep(.ivu-progress) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.ivu-progress-show-info .ivu-progress-outer) {
  padding-right: 40px;
}
:deep(.mainTitle) {
  .ivu-input {
    border: none;
    font-weight: 600;
    padding: 4px 0px;
    .fontSizePx2Em(16);
  }
  .ivu-input:focus {
    box-shadow: none;
  }
}
:deep(.itemOInfo) {
  .ivu-select-selection {
    border: none;
  }
  .ivu-select-visible .ivu-select-selection {
    box-shadow: none;
  }
  .ivu-date-picker-focused input:not([disabled]),
  .ivu-input:focus {
    box-shadow: none;
  }
  .ivu-input {
    border: none;
  }
}
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
      background-color: @bg;
      .size(100%, 45px);
      border-bottom: 1px solid @search_bottom_border;
      h1 {
        .fontSizePx2Em(18);
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
              .fontSizePx2Em(16);
              font-weight: 600;
            }
            .meetInput {
              width: calc(100% - 30px);
              height: 100%;
              border: none;
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
            .fontSizePx2Em(14);
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
              .fontSizePx2Em(14);
              height: 24px;
              line-height: 24px;
              margin-bottom: 6px;
            }
            .itemValue {
              display: inline-block;
              .size(100%, 30px);
              line-height: 30px;
              .fontSizePx2Em(14);
              color: @fontColor;
            }
            .itemValue.jumpTxt {
              color: @f_color_active;
              cursor: pointer;
            }
          }
        }
      }
      .partInfo {
        .size(100%, auto);
        background: @bg;
        margin-top: 10px;
        padding: 0 20px;
        box-sizing: border-box;
        &:last-child {
          margin-bottom: 10px;
        }
        .partInfoItem {
          .size(100%, 52px);
          border-bottom: 1px solid @search_bottom_border;
          &:last-child {
            border-bottom: none;
          }
          h3 {
            .fontSizePx2Em(14);
          }
        }
      }
      .linkInfo {
        .linkInfoItem {
          span {
            .fontSizePx2Em(14);
            color: @f_color_active;
            cursor: pointer;
          }
          .noFile {
            span {
              color: @fontColor;
              cursor: default;
            }
          }
          .download {
            width: 260px;
            cursor: pointer;
            .proTxt {
              .fontSizePx2Em(14);
              color: @fontColor;
            }
            span {
              margin-left: 4px;
            }
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
            .fontSizePx2Em(14);
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
                .fontSizePx2Em(14);
                color: @bg;
                flex-shrink: 0;
              }
              .userName {
                .size(60px,20px);
                line-height: 20px;
                .fontSizePx2Em(12);
                text-align: center;
                cursor: pointer;
              }
            }
          }
          .noData {
            .fontSizePx2Em(14);
            color: @fontColor;
          }
          .pageTap {
            margin-top: 10px;
            .size(100%, auto);
            .fontSizePx2Em(14);
            color: @f_color_active;
            span {
              padding: 0 14px;
              cursor: pointer;
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
