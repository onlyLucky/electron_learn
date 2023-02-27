<template>
  <div class="share">
    <div class="header f-row-b-c">
      <h1>分享列表</h1>
      <SystemOpt
        :isShowChangeSize="false"
        color="var(--bg)"
        :isShowMinSize="false"
      ></SystemOpt>
    </div>
    <div class="content">
      <div class="conHeader f-row-b-c">
        <div class="conTitle">
          <Text
            :ellipsis-config="{ tooltip: true }"
            ellipsis
            placement="bottom-start"
            >{{ queryParams.name }}</Text
          >
        </div>
        <div class="optBox">
          <Dropdown placement="bottom-end" trigger="click">
            <div class="optItem f-row-c-c">
              <svg-icon
                iconName="icon-gengduo"
                className="optIcon"
                size="24"
                color="var(--fontColor)"
              ></svg-icon>
            </div>
            <template #list>
              <DropdownMenu>
                <DropdownItem>更多设置</DropdownItem>
                <DropdownItem>
                  <div class="menuItem f-row-b-c">
                    <p class="label">仅查看我分享</p>
                    <Switch
                      :model-value="switchValue"
                      size="small"
                      :loading="loading"
                      :true-value="1"
                      :false-value="0"
                      @on-change="onSwitchChange"
                    ></Switch>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="tableBox" ref="refTable">
        <Table
          :columns="columns"
          :data="tData"
          :height="tableHeight"
          :loading="loading"
        >
          <template #loading>
            <Spin :show="loading" fix size="large" class="loading">
              <Icon
                type="ios-loading"
                size="26"
                class="conLoading iconLoading"
              ></Icon>
              <div class="conLoadingTxt">加载中...</div>
            </Spin>
          </template>
        </Table>
      </div>
      <div class="footer f-row-e-c">
        <Page
          show-sizer
          show-total
          :total="total"
          :page-size="params.pageSize"
          :page-size-opts="[8, 16, 24]"
          @on-page-size-change="pSizeChange"
          @on-change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import { getMeetShareByMeetId } from "@/apis/meet";
import { useRoute } from "vue-router";
import _ from "lodash";
const route = useRoute();
const queryParams = reactive<FileQPType>(route.query as FileQPType);

const columns = reactive<any[]>([
  {
    title: "分享者",
    key: "shareName",
  },
  {
    title: "接收人",
    key: "receiveName",
  },
  {
    title: "时间",
    key: "createTime",
  },
  {
    title: "状态",
    key: "status",
    width: 150,
    render: (h: any, params: any) => {
      return h(
        "div",
        {
          style: {
            color:
              params.row.status == 0
                ? "var(--f_color_active)"
                : "var(--fontColor)",
          },
        },
        params.row.status == 0 ? "有效" : "失效"
      );
    },
  },
]);
let tData = reactive<any[]>([]);

let loading = ref<boolean>(false);
let tableHeight = ref<number>();
const refTable = ref<HTMLElement>();
let switchValue = ref<0 | 1>(0);
let params = reactive<any>({
  pageSize: 8,
  pageNum: 1,
  type: switchValue.value,
  meetId: queryParams.id,
});
let total = ref<number>(0);
const getData = () => {
  loading.value = true;
  tData.length = 0;
  getMeetShareByMeetId(params)
    .then((res) => {
      loading.value = false;
      total.value = res.data.total;
      tData = [...res.data.records];
      console.log(tData, res.data.records, "res.data.records");
    })
    .catch((err) => {
      loading.value = false;
    });
};
const pSizeChange = (size: number) => {
  params.pageSize = size;
  getData();
};
const pageChange = (page: number) => {
  params.pageNum = page;
  getData();
};
const onSwitchChange = (val: 0 | 1) => {
  switchValue.value = val;
  params.type = switchValue.value;
  if (val) {
    columns.shift();
    columns.push({
      title: "操作",
      key: "status",
      width: 150,
      render: (h: any, params: any) => {
        return h(
          "div",
          {
            style: {
              cursor: "pointer",
              color:
                params.row.status == 0
                  ? "var(--f_color_active)"
                  : "var(--fontColor)",
            },
            onclick: _.debounce(function () {
              console.log("tap");
            }, 300),
          },
          params.row.status == 0 ? "撤回" : "已撤回"
        );
      },
    });
  } else {
    columns.pop();
    columns.unshift({
      title: "分享者",
      key: "shareName",
    });
  }
  getData();
};
onMounted(() => {
  getData();
  tableHeight.value = refTable.value?.clientHeight;
  window.onresize = () => {
    tableHeight.value = refTable.value?.clientHeight;
  };
});
</script>
<style scoped lang="less">
:deep(.ivu-table th) {
  background-color: @bg;
  border-bottom: none;
  color: @fontColor;
  font-weight: 400;
  height: 50px;
}
:deep(.ivu-table td) {
  border-bottom: none;
}
:deep(.ivu-table:before) {
  display: none;
}
:deep(.ivu-typography) {
  color: @f_color_h3;
}
:deep(.ivu-dropdown-item) {
  .menuItem {
    .size(140px,100%);
    .label {
      font-size: 14px;
    }
  }
}
.share {
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
    height: calc(100% - 48px);
    padding: 16px;
    box-sizing: border-box;
    .conHeader {
      .size(100%, 50px);
      padding-bottom: 10px;
      border-bottom: 1px solid @search_bottom_border;
      box-sizing: border-box;
      .conTitle {
        .size(100%,100%);
        font-size: 16px;
        color: @f_color_h3;
        line-height: 40px;
        font-weight: bold;
      }
      .optBox {
        flex-shrink: 0;
        margin-left: 10px;
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
    .tableBox {
      .size(100%,calc(100% - 100px));
    }
    .footer {
      .size(100%,50px);
      border-top: 1px solid @search_bottom_border;
    }
  }
}
.conLoadingTxt {
  margin-top: 10px;
  white-space: nowrap;
}
</style>
