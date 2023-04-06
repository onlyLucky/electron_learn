<!--
 * @Author: fg
 * @Date: 2023-04-06 10:34:03
 * @LastEditors: fg
 * @LastEditTime: 2023-04-06 17:41:48
 * @Description: 消息列表
-->
<template>
  <Modal
    v-model="isShow"
    :width="520"
    class-name="msgModal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <!-- <Badge :count="total" class="headerBadge">
        <h1 class="mTitle">我的消息</h1>
      </Badge> -->
      <h1 class="mTitle">我的消息</h1>
    </template>
    <div class="content">
      <!-- <h1 class="cTitle">基本信息</h1> -->
      <div class="conBox">
        <div class="conBoxHeader f-row-e-c">
          <div class="conHRight f-row-c-c">
            <div class="searchBox f-row-b-c">
              <Tooltip placement="bottom-end" content="搜索消息">
                <div class="optItem f-row-c-c" v-show="!searchFlag">
                  <svg-icon
                    iconName="icon-sousuo1"
                    className="optIcon"
                    size="20"
                    color="var(--fontColor)"
                    @click="showSearch(true)"
                  ></svg-icon>
                </div>
              </Tooltip>
              <div class="searchCon f-row-c-c" v-show="searchFlag">
                <Input
                  v-model="searchName"
                  type="text"
                  ref="refSearchInput"
                  placeholder="消息搜索"
                  clearable
                  @on-change="onSearchNameChange"
                ></Input>
                <span @click="showSearch(false)">取消</span>
              </div>
            </div>
            <Tooltip placement="bottom-end" content="删除消息">
              <Badge :count="delBadgeNum">
                <div class="optItem f-row-c-c" v-debounce="onDelMsg">
                  <svg-icon
                    iconName="icon-shanchu1"
                    className="optIcon"
                    size="22"
                    color="var(--fontColor)"
                  ></svg-icon>
                </div>
              </Badge>
            </Tooltip>
            <Tooltip placement="bottom-end" content="全部已读">
              <div class="optItem f-row-c-c" v-debounce="onAllRead">
                <svg-icon
                  iconName="icon-xiaoxiquanbuyidu"
                  className="optIcon"
                  size="22"
                  color="var(--fontColor)"
                ></svg-icon>
              </div>
            </Tooltip>
          </div>
        </div>
        <div class="conTable" v-show="msgList.length > 0" @scroll="onConScroll">
          <div
            class="msgItem f-row-s"
            v-for="(item, index) in msgList"
            :key="index"
          >
            <Checkbox
              v-model="item.select"
              @on-change="onSelectChange"
            ></Checkbox>
            <div class="msgBox f-row-s">
              <img
                :src="`/src/assets/icons/message/icon_message${item.type}.png`"
                alt=""
              />
              <div class="imgRight">
                <div class="msgHeader f-row-b-c">
                  <div class="msgTitle">
                    <h1>{{ item.title }}</h1>
                    <span class="tRead" v-show="item.readSign == 0"></span>
                  </div>
                  <span class="msgTime">{{
                    updateTimeShow(item.createTime)
                  }}</span>
                </div>
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
          <div class="conFooter f-row-c-c" v-show="msgList.length >= 8">
            <span
              class="conFooterLink"
              v-debounce="goNextPage"
              v-show="total > msgList.length"
              >查看更多</span
            >
            <span class="conFooterTxt" v-show="total == msgList.length"
              >已经到底了哦</span
            >
          </div>
          <div class="loading f-col-c" v-show="loading">
            <Icon
              type="ios-loading"
              size="26"
              color="var(--f_color_active)"
              class="conLoading iconLoading"
            ></Icon>
            <div class="conLoadingTxt">加载中...</div>
          </div>
        </div>
        <div class="conTable" v-show="msgList.length <= 0">
          <div class="noDataCon f-col-s-c">
            <img src="@/assets/images/no_data.png" alt="" />
            <span>没有消息哦</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div></div>
      <!-- <Button type="text" v-debounce="onCancel">取消</Button>
      <Button type="primary" :loading="loading" v-debounce="onConfirm"
        >重置</Button
      > -->
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Message, Input, Modal } from "view-ui-plus";
import { updateTimeShow } from "@/libs/messageTime.js";
import {
  getDictItem,
  getMyNotice,
  setReadSignAll,
  deleteBatchNotice,
} from "@/apis/home";
import _ from "lodash";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
let isShow = ref<boolean>(false);

const handleShow = () => {
  isShow.value = true;
};
// 表单加载
let loading = ref<boolean>(false);

// 顶部搜索部分
type TypePage = {
  pageNum: number;
  pageSize: number;
};
let page = reactive<TypePage>({
  pageNum: 1,
  pageSize: 15,
});
// 删除消息
const delBadgeNum = ref<number>(0);
let total = ref<number>(0);
let searchName = ref<string>("");
let refSearchInput = ref<InstanceType<typeof Input>>();
let searchFlag = ref<boolean>(false);
const showSearch = (flag: boolean) => {
  searchFlag.value = flag;
  nextTick(() => {
    if (flag) {
      (refSearchInput.value as any).focus();
    }
  });
};

// 删除消息
//
const onDelMsg = () => {
  if (delBadgeNum.value > 0) {
    Modal.confirm({
      title: "是否确认删除消息吗？",
      loading: true,
      onOk: () => {
        let ids: any[] = [];
        msgList.value.map((item) => {
          if (item.select) {
            ids.push(item.id);
          }
        });
        deleteBatchNotice({ ids: ids.toString() })
          .then((res) => {
            Modal.remove();
            Message.success("所选的消息删除完成");
            page.pageNum = 1;
            delBadgeNum.value = 0;
            getData();
          })
          .catch((err) => {
            Modal.remove();
          });
      },
    });
  }
};

// 全部已读
const onAllRead = () => {
  setReadSignAll().then((res) => {
    page.pageNum = 1;
    getData();
    Message.success("消息已全部已读");
  });
};

const onSearchNameChange = (e: any) => {
  _.debounce(() => {
    searchName.value = e.target.value;
    page.pageNum = 1;
    getData();
  }, 400)();
};

let msgList = ref<any[]>([]);
const getData = () => {
  loading.value = true;
  let params: any = {
    ...page,
  };
  if (searchName.value) {
    params.content = searchName.value;
  }
  if (page.pageNum == 1) {
    msgList.value = [];
  }
  getMyNotice(params)
    .then((res) => {
      loading.value = false;
      total.value = res.data.total;
      res.data.records.map((item: any) => {
        item.select = false;
      });
      msgList.value = [...msgList.value, ...res.data.records];
    })
    .catch((err) => {
      // 数据加载失败之后 页面减一
      if (page.pageNum !== 1) {
        page.pageNum = page.pageNum - 1;
      }
      loading.value = false;
    });
};
// 字典数据
let msgType = ref<any[]>([]);
let msgReadStatus = ref<any[]>([]);
const getDicData = async () => {
  const msgTypeRes = await getDictItem({ itemNo: "MSG_TYPE" });
  const msgReadStatusRes = await getDictItem({ itemNo: "MSG_READ_STATUS" });
  msgType.value = msgTypeRes.data;
  msgReadStatus.value = msgReadStatusRes.data;
  getData();
};

// 滚动区域监听
const onConScroll = (e: any) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target;
  if (scrollTop + clientHeight === scrollHeight) {
    // console.log("滚动到底部");
    if (total.value > msgList.value.length) {
      goNextPage();
    }
  }
};
// 下一页
const goNextPage = () => {
  if (!loading.value) {
    page.pageNum = page.pageNum + 1;
    getData();
  }
};

const onSelectChange = () => {
  let temp = 0;
  msgList.value.map((item) => {
    if (item.select) {
      temp++;
    }
  });
  delBadgeNum.value = temp;
};
// 操作
const onCancel = () => {
  isShow.value = false;
  loading.value = false;
};
const onConfirm = () => {};
onMounted(() => {
  // console.log(
  //   "updateTimeShow-----",
  //   require("@/assets/icons/message/icon_message4.png")
  // );
  console.log(updateTimeShow("2023-4-6 15:00:00"));
  getDicData();
});
defineExpose({
  handleShow,
});
</script>
<style lang="less">
.msgModal {
  user-select: none;
  .headerBadge {
    .ivu-badge-count {
      top: 6px;
      right: -10px;
    }
  }
  .mTitle {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    // @fontColor
    color: @f_color_h6;
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
      padding: 0px 10px;
      .conBoxHeader {
        .size(100%, 40px);
        .conHRight {
          .searchBox {
            .optItem {
              padding: 8px;
              border-radius: 50%;
            }
            .searchCon {
              span {
                margin-left: 10px;
                flex-shrink: 0;
                font-size: 14px;
                color: @fontColor;
                cursor: pointer;
              }
            }
          }
          .optItem {
            padding: 6px;
            border-radius: 4px;
            background-color: @bg;
            cursor: pointer;
            margin-left: 10px;
            &:hover {
              background-color: @search_bottom_border;
            }
            span {
              margin-left: 4px;
              font-size: 14px;
              color: @f_color_h3;
            }
          }
        }
      }
      .conTable {
        margin-top: 10px;
        .size(100%, 500px);
        overflow: auto;
        .ivu-checkbox {
          margin-top: 23px;
        }
        .msgItem {
          .size(100%, auto);
          padding: 8px 10px;
          box-sizing: border-box;
          .msgBox {
            .size(100%,auto);
            img {
              .size(60px,60px);
              margin-right: 10px;
            }
            .imgRight {
              width: 100%;
              .msgHeader {
                .msgTitle {
                  position: relative;
                  margin-bottom: 6px;
                  margin-left: 24px;
                  h1 {
                    font-size: 16px;
                  }
                  .tRead {
                    position: absolute;
                    .size(7px,7px);
                    background: @error;
                    border-radius: 8px;
                    top: 8px;
                    left: -18px;
                  }
                }

                span {
                  font-size: 14px;
                  color: @fontColor;
                  opacity: 0.8;
                }
              }
              p {
                font-size: 14px;
                color: @fontColor;
                text-indent: 2em;
              }
            }
          }
        }
        .loading {
          .size(100%,100%);
          position: absolute;
          top: 0px;
          left: 0px;
          background-color: rgba(255, 255, 255, 0.7);
          .conLoading {
            margin-bottom: 10px;
          }
          .conLoadingTxt {
            text-align: center;
            font-size: 14px;
            color: @f_color_active;
          }
        }
        .noDataCon {
          .size(auto,auto);
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
            opacity: 0.8;
          }
        }
      }
    }
  }
  .ivu-modal {
    top: 0px;
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
        // border: none;
        border-radius: 30px;
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
    }
    .ivu-modal-footer {
      border-top: none;
    }
  }
}
</style>
