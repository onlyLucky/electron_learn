<!--
 * @Author: fg
 * @Date: 2022-12-15 16:22:27
 * @LastEditors: fg
 * @LastEditTime: 2023-01-28 14:45:59
 * @Description: content
-->
<template>
  <div class="meeting" ref="refMeet">
    <div ref="refTHeader" class="searchBox f-w f-row-e-c">
      <div class="formItem formInput f-row-c-c">
        <!-- <span class="label">会议名称</span> -->
        <Input
          placeholder="请输入会议名称"
          clearable
          v-model="searchForm.name"
        ></Input>
      </div>
      <div class="formItem f-row-c-c">
        <!-- <span class="label">会议时间</span> -->
        <DatePicker
          :clearable="true"
          :model-value="searchForm.dataValue"
          format="yyyy/MM/dd"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择会议起止时间"
          style="width: 200px"
          @on-change="timeValueChange"
        ></DatePicker>
      </div>
      <div class="formItem f-row-c-c">
        <!-- <span class="label">设备</span> -->
        <Select
          v-model="searchForm.deviceId"
          clearable
          filterable
          placeholder="请选择设备"
          @on-change="equipmentChange"
        >
          <Option
            v-for="(item, index) in deviceList"
            :value="item.id"
            :key="index"
            >{{ item.name }}</Option
          >
        </Select>
      </div>
      <Button class="optBtn" icon="ios-refresh" v-debounce="resetSearch"
        >重置</Button
      >
    </div>
    <div
      class="listBox"
      :style="{ height: 'calc(100% - ' + refHeaderHeight + 'px)' }"
    >
      <Row justify="center" class="contentBody">
        <div class="tableBox" ref="refTable">
          <MListTable
            ref="mtable"
            :size="refTableSize"
            :search="searchForm"
            @uploadData="uploadTableData"
            @delChange="delChange"
            @detail="handleDetail"
          ></MListTable>
        </div>
        <!-- 底部 -->
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          class="footerBox"
        >
          <Col span="4">
            <Row type="flex" justify="start" class="mainFooterL">
              <Poptip
                confirm
                title="是否删除所选会议？"
                @on-ok="delMeeting"
                @on-cancel="onDelCancel"
                placement="top-start"
                :disabled="delDisabledFlag"
              >
                <Button
                  type="error"
                  class="meetingListDelete"
                  v-debounce="delTap"
                  icon="trash-a"
                  >删除</Button
                >
              </Poptip>
            </Row>
          </Col>
          <!--  <Col span="10">
            <Row type="flex" justify="center" class="mainFooterC">
              文字描述
            </Row>
          </Col> -->
          <Col span="20">
            <Row type="flex" justify="end" class="mainFooterR">
              <Page
                show-sizer
                show-total
                :total="total"
                :page-size="searchForm.pageSize"
                :page-size-opts="[9, 16, 24]"
                @on-page-size-change="pSizeChange"
                @on-change="pageChange"
              ></Page>
            </Row>
          </Col>
        </Row>
      </Row>
    </div>
    <!-- 详情 -->
    <MDetail v-model="isShowDetail" :mId="refMeetId" :mask="false"></MDetail>
  </div>
</template>
<script setup lang="ts">
import { Message } from "view-ui-plus";
import { getDeviceList } from "@/apis/meet";
import { MListTable, SearchType, SizeType } from "./comps/mListTable/index";
import MDetail from "./comps/mListDetail/index.vue";
import _ from "lodash";

const refTHeader = ref<HTMLElement>();
const refTable = ref<HTMLElement>();
const refMeet = ref<HTMLElement>();

let refMeetHeight = ref<number>(0);
let refHeaderHeight = ref<number>(0);
let refTableSize = reactive<SizeType>({
  width: 0,
  height: 0,
});
let deviceList = reactive<any[]>([]);

let searchForm = reactive<SearchType>({
  name: "",
  dataValue: [],
  deviceId: "",
  pageNum: 1,
  isDel: 0,
  pageSize: 9,
});

// 设备 TODO: 可选为多个设备
const equipmentChange = (date?: any) => {
  searchForm.deviceId = date || "";
};
const timeValueChange = (date?: any) => {
  searchForm.dataValue = date || [];
};

// 重置功能
const resetSearch = () => {
  let temp = {
    name: "",
    dataValue: [],
    deviceId: "",
    pageNum: 1,
    isDel: 0,
    pageSize: 9,
  };
  Object.assign(searchForm, temp);
  console.log(searchForm, "searchForm");
};
watch(
  () => searchForm,
  (value) => {
    if (searchForm.dataValue?.length == 2 && searchForm.dataValue[0] == "") {
      searchForm.dataValue = [];
    }
    // 添加防抖使用
    watchSearchForm();
  },
  { deep: true }
);
const watchSearchForm = _.debounce(function () {
  mtable.value?.getTableData(searchForm);
}, 500);

// table ref object
const mtable = ref<InstanceType<typeof MListTable>>();
let total = ref<number>(0);
const uploadTableData = () => {
  // 设置总页
  total.value = mtable.value?.total || 0;
};
// 分页更改
const pageChange = (page: number) => {
  searchForm.pageNum = page;
};
const pSizeChange = (size: number) => {
  searchForm.pageSize = size;
};

// 表格删除，取消
let delDisabledFlag = ref<boolean>(true);
const delMeeting = () => {
  mtable.value?.delFun();
};
const onDelCancel = () => {};
const delTap = () => {
  if (mtable.value?.selectNum! <= 0) {
    Message.info("暂未选择需要删除的会议");
  }
};
const delChange = () => {
  delDisabledFlag.value = mtable.value?.selectNum! == 0;
};

// 详情功能
let isShowDetail = ref<boolean>(false);
let refMeetId = ref<number | null>(null);
const handleDetail = (row: any) => {
  refMeetId.value = row.id;
  if (!isShowDetail.value) {
    isShowDetail.value = true;
  }
};

onMounted(() => {
  // 获取顶部的高度
  refHeaderHeight.value = refTHeader.value?.clientHeight || 0;
  refMeetHeight.value = refMeet.value?.clientHeight! + 20 || 0;
  setTimeout(() => {
    // 获取表格的宽高
    refTableSize.width = refTable.value?.clientWidth || 0;
    refTableSize.height = refTable.value?.clientHeight || 0;
  });
  // 设置总页
  total.value = mtable.value?.total || 0;

  console.log(total.value, "total.value");

  window.onresize = () => {
    refHeaderHeight.value = refTHeader.value?.clientHeight || 0;
    refTableSize.width = refTable.value?.clientWidth || 0;
    refTableSize.height = refTable.value?.clientHeight || 0;
    refMeetHeight.value = refMeet.value?.clientHeight! + 20 || 0;
  };
  getDeviceList().then((res) => {
    deviceList = res.data || [];
  });
});
onUnmounted(() => {
  // 取消防抖
  watchSearchForm.cancel();
});
/* onUpdated(() => {
  console.log("onUpdated");
}); */
</script>
<style scoped lang="less">
:deep(.formInput .ivu-input) {
  width: 160px;
}
:deep(.mainFooterL .ivu-poptip-popper) {
  min-width: 180px;
}
:deep(.ivu-table-cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.ivu-table-header thead tr th) {
  color: @tHeader_color;
  cursor: default;
}
:deep(.ivu-table:before) {
  display: none;
}
:deep(.ivu-table-fixed-right::before) {
  display: none;
}
:deep(.ivu-table-header) {
  height: 40px;
}
.meeting {
  .size(100%,100%);
  user-select: none;
  .searchBox {
    width: 100%;
    padding: 10px;
    padding-bottom: 0;
    box-sizing: border-box;
    .formItem {
      flex-shrink: 0;
      margin-right: 10px;
      margin-bottom: 10px;
      &:last-of-type {
        margin-right: 0;
      }
      .label {
        flex-shrink: 0;
        font-size: 14px;
        margin-right: 6px;
        color: @f_color_h3;
      }
    }
    .optBtn {
      margin-bottom: 10px;
      margin-left: 10px;
    }
  }
  .listBox {
    width: 100%;
    border-top: 1px solid @search_bottom_border;
    box-sizing: border-box;
    padding: 10px;
    .contentBody {
      .size(100%,100%);
      .tableBox {
        width: 100%;
        height: calc(100% - 60px);
        user-select: none;
      }
      .footerBox {
        .size(100%, 60px);
        border-top: 1px solid @search_bottom_border;
      }
    }
  }
}
</style>
