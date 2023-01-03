<!--
 * @Author: fg
 * @Date: 2022-12-15 16:22:27
 * @LastEditors: fg
 * @LastEditTime: 2023-01-03 20:00:55
 * @Description: content
-->
<template>
  <div class="meeting">
    <div ref="refTHeader" class="searchBox f-w f-row-e-c">
      <div class="formItem formInput f-row-c-c">
        <!-- <span class="label">会议名称</span> -->
        <Input placeholder="请输入会议名称" v-model="searchForm.name"></Input>
      </div>
      <div class="formItem f-row-c-c">
        <!-- <span class="label">会议时间</span> -->
        <DatePicker
          :clearable="false"
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
      <Button class="optBtn" icon="ios-refresh" @click="resetSearch"
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
            @uploadData="uploadTableData"
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
              >
                <Button type="error" class="meetingListDelete" icon="trash-a"
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
          <Col span="14">
            <Row type="flex" justify="end" class="mainFooterR">
              <Page
                show-sizer
                show-total
                :total="total"
                :page-size-opts="[5, 10, 15, 20]"
              ></Page>
            </Row>
          </Col>
        </Row>
      </Row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Select, Option } from "view-ui-plus";
import { ipcRenderer } from "electron";
import { getDeviceList } from "@/apis/meet";
import { MListTable, SearchType, SizeType } from "./comps/mListTable/index";
import _ from "lodash";

const refTHeader = ref<HTMLElement>();
const refTable = ref<HTMLElement>();
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
  pageSize: 10,
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
    pageSize: 10,
  };
  Object.assign(searchForm, temp);
  console.log(searchForm, "searchForm");
};
watch(
  () => searchForm,
  (value) => {
    _.debounce(() => {}, 300);
    // refTable.value.goDetail();
    mtable.value?.goDetail();
    console.log(value, "&&&&---****");
  },
  { deep: true }
);

// table ref object
const mtable = ref<InstanceType<typeof MListTable>>();
let total = ref<number>(0);
const uploadTableData = async () => {
  // 设置总页
  await nextTick();
  console.log(mtable.value?.total, "mtable.value?.total");
  total.value = mtable.value?.total || 0;
};
// 表格删除，取消
const delMeeting = () => {};
const onDelCancel = () => {};

onMounted(() => {
  // 获取顶部的高度
  refHeaderHeight.value = refTHeader.value?.clientHeight || 0;

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
    console.log(refTableSize);
  };
  getDeviceList().then((res) => {
    deviceList = res.data || [];
  });
});
onUpdated(() => {
  console.log("onUpdated");
});
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
.meeting {
  .size(100%,100%);
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
      }
    }
  }
}
</style>
