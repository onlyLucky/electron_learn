<!--
 * @Author: fg
 * @Date: 2022-12-15 16:22:27
 * @LastEditors: fg
 * @LastEditTime: 2023-03-15 19:43:33
 * @Description: content
-->
<template>
  <div class="equipment">
    <div class="header f-row-b-c">
      <div class="hLeft f-row-s-c">
        <!-- <h1>设备列表</h1> -->
        <div class="hLeftItem f-row-c-c">
          <p class="label">设备</p>
          <Select
            width="120"
            class="hLItemValue"
            v-model="searchForm.deviceId"
            clearable
            filterable
            placeholder="请选择"
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
        <div class="hLeftItem f-row-c-c">
          <p class="label">会议时间</p>
          <DatePicker
            :clearable="true"
            :model-value="searchForm.dataValue"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="请选择"
            style="width: 200px"
            @on-change="timeValueChange"
          ></DatePicker>
        </div>
        <div class="hLeftItem f-row-c-c">
          <p class="label">会议名称</p>
          <Input
            placeholder="请输入"
            clearable
            v-model="searchForm.name"
            @on-change="searchNameChange"
          ></Input>
        </div>
      </div>
      <div class="hRight f-row-c-c">
        <Tooltip placement="bottom-end" content="重置筛选">
          <div class="optItem f-row-c-c" v-debounce="resetSearch">
            <svg-icon
              iconName="icon-reset"
              className="optIcon"
              size="24"
              color="var(--fontColor)"
            ></svg-icon>
          </div>
        </Tooltip>

        <Tooltip placement="bottom-end" content="删除会议">
          <Badge :count="delBadgeNum">
            <div class="optItem f-row-c-c" v-debounce="delMeeting">
              <svg-icon
                iconName="icon-shanchu1"
                className="optIcon"
                size="22"
                color="var(--fontColor)"
              ></svg-icon>
            </div>
          </Badge>
        </Tooltip>
        <!-- <div class="optLine"></div> -->
        <!-- <Dropdown placement="bottom-start" trigger="click">
          <div class="optItem f-row-c-c">
            <svg-icon
              iconName="icon-gengduo"
              className="optIcon"
              size="24"
              color="var(--fontColor)"
            ></svg-icon>
          </div>
          <template #list>
            <div class="menuTitle">
              <p>导入设备</p>
            </div>
            <DropdownMenu>
              <DropdownItem> 下载模板 </DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown> -->
      </div>
    </div>
    <div class="content">
      <mTable
        ref="mtable"
        :search="searchForm"
        @uploadData="uploadTableData"
        @delChange="delChange"
        @detail="handleDetail"
      ></mTable>
    </div>
    <div class="footer f-row-e-c">
      <Page
        show-sizer
        show-total
        :total="total"
        :page-size="searchForm.pageSize"
        :page-size-opts="[8, 16, 24]"
        @on-page-size-change="pSizeChange"
        @on-change="pageChange"
      />
    </div>
    <!-- 详情 -->
    <MDetail
      v-model="isShowDetail"
      :mId="refMeetProps.id"
      :deviceName="refMeetProps.deviceName"
      :mName="refMeetProps.mName"
      :mask="false"
      :isEdit="isEditFlag"
      @uploadTable="onUploadTable"
    ></MDetail>
  </div>
</template>
<script setup lang="ts">
import { Message, Modal } from "view-ui-plus";
import { getDeviceList } from "@/apis/meet";
import mTable, { SearchType, SizeType } from "./comps/mListTable/index.vue";
import MDetail from "./comps/mListDetail/index.vue";
import _ from "lodash";

let deviceList = reactive<any[]>([]);

let searchForm = reactive<SearchType>({
  name: "",
  dataValue: [],
  deviceId: "",
  pageNum: 1,
  isDel: 0,
  pageSize: 8,
});

// 设备 TODO: 可选为多个设备
const equipmentChange = (date?: any) => {
  searchForm.pageNum = 1;
  searchForm.deviceId = date || "";
};
const timeValueChange = (date?: any) => {
  searchForm.pageNum = 1;
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
    pageSize: 8,
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
  // searchForm.pageNum = 1;
  mtable.value?.getTableData(searchForm);
}, 500);

const searchNameChange = () => {
  searchForm.pageNum = 1;
};

// table ref object
const mtable = ref<InstanceType<typeof mTable>>();
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
let delBadgeNum = ref<number>(0);
let delDisabledFlag = ref<boolean>(true);
const delMeeting = () => {
  if (delBadgeNum.value == 0) {
    Message.info("暂未选择需要删除的会议");
    return false;
  }
  Modal.confirm({
    title: "是否确认删除已选择的会议",
    loading: true,
    onOk: () => {
      mtable.value?.delFun();
    },
  });
};
const delChange = () => {
  delBadgeNum.value = mtable.value!.selectNum;
  delDisabledFlag.value = mtable.value?.selectNum! == 0;
};

// 详情功能
let isShowDetail = ref<boolean>(false);
let refMeetProps = reactive<{
  id: String | null;
  deviceName: String | null;
  mName: String | null;
}>({
  id: null,
  deviceName: null,
  mName: null,
});
let isEditFlag = ref<boolean>(false);
const handleDetail = (row: any, isEdit: boolean) => {
  console.log(isEdit, "isEdit");
  isEditFlag.value = isEdit;
  refMeetProps.id = row.id;
  refMeetProps.deviceName = row.deviceName;
  refMeetProps.mName = row.name;
  if (!isShowDetail.value) {
    isShowDetail.value = true;
  }
};
// 更新表格
const onUploadTable = () => {
  mtable.value?.getTableData(searchForm);
};

onMounted(() => {
  mtable.value?.getTableData(searchForm);
  // 设置总页
  total.value = mtable.value?.total || 0;
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
:deep(.ivu-input) {
  border-radius: 50px;
}
:deep(.fileLink) {
  color: pink;
}
:deep(.hLeftItem) {
  .ivu-select {
    width: 140px;
  }
  .ivu-select-selection {
    border: none;
    border-radius: 4px;
    background-color: @menu_item_hover;
    /* &:hover {
      background-color: @menu_item_hover;
    } */
    .ivu-select-input {
      font-size: 14px;
    }
  }
  .ivu-select-visible .ivu-select-selection {
    box-shadow: none;
    border: none;
  }
  .ivu-input {
    border: none;
    border-radius: 4px;
    background-color: @menu_item_hover;
    cursor: pointer;
    /* &:hover {
      background-color: @menu_item_hover;
    } */
  }
  .ivu-date-picker-focused input:not([disabled]),
  .ivu-input:focus {
    box-shadow: none;
  }
}
.equipment {
  .size(100%,100%);
  padding: 10px;
  box-sizing: border-box;
  .header {
    .size(100%, 46px);
    padding-bottom: 6px;
    border-bottom: 1px solid @search_bottom_border;
    box-sizing: border-box;
    .hLeft {
      .hLeftItem {
        margin-right: 20px;
        .label {
          flex-shrink: 0;
          font-size: 14px;
          color: @fontColor;
          margin-right: 12px;
        }
        .hLItemValue {
          font-size: 16px;
          cursor: pointer;
          color: @f_color_h3;
        }
      }
    }
    .hRight {
      .size(auto,100%);
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
      .optLine {
        .size(2px, 46%);
        border-radius: 2px;
        background-color: @fontColor;
        opacity: 0.5;
        margin-left: 10px;
      }
      .searchBox {
        margin-right: 10px;
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
      .moreItem {
        padding: 6px 10px;
        border-radius: 4px;
        background-color: @f_color_active;
        cursor: pointer;
        margin-left: 10px;
        span {
          margin-left: 4px;
          font-size: 14px;
          color: @bg;
        }
      }
    }
  }
  .content {
    .size(100%, calc(100% - 96px));
  }
  .footer {
    .size(100%,50px);
    border-top: 1px solid @search_bottom_border;
  }
}
.menuTitle {
  .size(100%,32px);
  font-size: 12px;
  padding: 0px 18px 2px;
  box-sizing: border-box;
  line-height: 30px;
  color: @fontColor;
  border-bottom: 1px solid @search_bottom_border;
}
</style>
