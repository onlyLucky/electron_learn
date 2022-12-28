<!--
 * @Author: fg
 * @Date: 2022-12-15 16:22:27
 * @LastEditors: fg
 * @LastEditTime: 2022-12-28 17:58:38
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
          :value="searchForm.dataValue"
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
      <Row justify="center" align="middle" class="">
        <Row class="tableBox">
          <Table></Table>
        </Row>
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
                @on-ok="ok"
                @on-cancel="cancel"
                placement="top-start"
              >
                <Button type="error" class="meetingListDelete" icon="trash-a"
                  >删除</Button
                >
              </Poptip>
            </Row>
          </Col>
          <Col span="10">
            <Row type="flex" justify="center" class="mainFooterC">
              <!-- 文字描述 -->
              <!-- -->
            </Row>
          </Col>
          <Col span="4">
            <Row type="flex" justify="end" class="mainFooterR">
              <Page></Page>
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

const refTHeader = ref<HTMLElement>();
let refHeaderHeight = ref<number>(0);
let deviceList = reactive<any[]>([]);
type SearchType = {
  name?: string;
  dataValue?: any[];
  deviceId?: string | number;
};
let searchForm = reactive<SearchType>({
  name: "",
  dataValue: [],
  deviceId: "",
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
  };
  Object.assign(searchForm, temp);
  console.log(searchForm, "searchForm");
};
onMounted(() => {
  refHeaderHeight.value = refTHeader.value?.clientHeight || 0;
  window.onresize = () => {
    refHeaderHeight.value = refTHeader.value?.clientHeight || 0;
  };
  getDeviceList().then((res) => {
    deviceList = res.data || [];
  });
});

const getData = () => {};
</script>
<style scoped lang="less">
:deep(.formInput .ivu-input) {
  width: 160px;
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
  }
}
</style>
