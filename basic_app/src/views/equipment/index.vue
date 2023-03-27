<!--
 * @Author: fg
 * @Date: 2022-12-16 15:13:52
 * @LastEditors: fg
 * @LastEditTime: 2023-03-27 10:55:45
 * @Description: content
-->
<template>
  <div class="equipment">
    <div class="header f-row-b-c">
      <div class="hLeft">
        <h1>设备列表</h1>
      </div>
      <div class="hRight f-row-c-c">
        <!-- search -->
        <div class="searchBox f-row-c-c">
          <Tooltip placement="bottom-end" content="搜索设备">
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
              v-model="listParams.name"
              type="text"
              ref="refSearchInput"
              placeholder="设备名称搜索"
              clearable
              @on-change="onSearchNameChange"
            ></Input>
            <span @click="showSearch(false)">取消</span>
          </div>
        </div>
        <div class="optLine"></div>
        <Tooltip placement="bottom-end" content="新增设备">
          <div class="optItem f-row-c-c" v-debounce="showAdd">
            <svg-icon
              iconName="icon-icon-xinzeng"
              className="optIcon"
              size="24"
              color="var(--fontColor)"
            ></svg-icon>
            <!-- <span>新增</span> -->
          </div>
        </Tooltip>

        <Tooltip placement="bottom-end" content="删除设备">
          <Badge :count="delBadgeNum">
            <div class="optItem f-row-c-c" v-debounce="onDelEquip">
              <svg-icon
                iconName="icon-shanchu1"
                className="optIcon"
                size="22"
                color="var(--fontColor)"
              ></svg-icon>
            </div>
          </Badge>
        </Tooltip>
        <div class="optLine"></div>
        <Dropdown placement="bottom-start" trigger="click">
          <div class="optItem f-row-c-c">
            <svg-icon
              iconName="icon-gengduo"
              className="optIcon"
              size="24"
              color="var(--fontColor)"
            ></svg-icon>
          </div>
          <!-- <div class="moreItem f-row-c-c">
            <svg-icon
              iconName="icon-gengduo"
              className="optIcon"
              size="20"
              color="var(--bg)"
            ></svg-icon>
            <span>更多</span>
          </div> -->
          <template #list>
            <div class="menuTitle">
              <p>导入设备</p>
            </div>
            <DropdownMenu>
              <DropdownItem v-debounce="onDownloadTemplate">
                下载模板
              </DropdownItem>
              <DropdownItem>
                <Upload
                  action="/"
                  accept=".xls, .xlsx"
                  :show-upload-list="false"
                  :before-upload="handleUpload"
                >
                  导入设备
                </Upload>
              </DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="content">
      <ETable
        ref="refETable"
        @onSelectChange="onETableSChange"
        @onDel="delEquip"
        @onDetail="onDetail"
      ></ETable>
    </div>
    <div class="footer f-row-e-c">
      <Page
        show-sizer
        show-total
        :total="pageTotal"
        :page-size="listParams.pageSize"
        :page-size-opts="[8, 16, 24]"
        @on-page-size-change="pSizeChange"
        @on-change="pageChange"
      />
    </div>
    <!-- 新增设备modal -->
    <EquipAdd ref="refEquipAdd" @on-success="getTableData"></EquipAdd>
    <!-- 导入设备列表modal -->
    <ImportList ref="refImportList"></ImportList>
    <!-- 设备详情 -->
    <EquipDetail ref="refEquipDetail" @on-success="getTableData"></EquipDetail>
  </div>
</template>
<script setup lang="ts">
// TODO: 列表添加模式 列表加载更多 底部分页模式

import { Input, Modal, Notice, Message } from "view-ui-plus";
import ETable, { ParamsType } from "./comps/equipList/eTable.vue";
import _ from "lodash";
import { getDownloadTemplate, postUploadDeviceFile } from "@/apis/equipment";
import { ipcRenderer, shell } from "electron";
import { useNodeStreamDownload } from "@/hooks/useElectronDownload";
import { withDirectives, resolveDirective } from "vue";
import EquipAdd from "./comps/modal/equipAdd.vue";
import ImportList from "./comps/modal/importList.vue";
import EquipDetail from "./comps/modal/equipDetail.vue";

// 顶部搜索部分
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
//
let refETable = ref<InstanceType<typeof ETable>>();
let delBadgeNum = ref<number>(0); // 删除选中的角标
const onETableSChange = (len: number) => {
  delBadgeNum.value = len;
};
// 删除
const onDelEquip = () => {
  if (delBadgeNum.value > 0) {
    delEquip();
  }
};
const delEquip = () => {
  Modal.confirm({
    title: "是否确认删除设备",
    loading: true,
    onOk: () => {
      refETable.value?.onDel(() => {
        Modal.remove();
        getTableData();
      });
    },
  });
};
// 新增设备
const refEquipAdd = ref<InstanceType<typeof EquipAdd>>();
const showAdd = () => {
  refEquipAdd.value?.handleShow();
};

// 设备详情
const refEquipDetail = ref<InstanceType<typeof EquipDetail>>();
const onDetail = (item: any, flag: boolean) => {
  refEquipDetail.value?.handleShow();
  refEquipDetail.value?.getData(item);
  refEquipDetail.value?.exportEditModal(flag);
};

// 模板下载
const onDownloadTemplate = () => {
  ipcRenderer.send("showSaveFile", {
    name: "设备导入模板.xlsx",
    filters: [{ name: "xlsx", extensions: ["xlsx"] }],
  });
  /* getDownloadTemplate().then((res: any) => {
    let blob = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    blob.arrayBuffer().then((res) => {
      console.log(res instanceof ArrayBuffer, "res instanceof ArrayBuffer");
    });
    console.log(blob instanceof Blob, "blob instanceof Blob");
  }); */
};
// 模板文件上传
const refImportList = ref<InstanceType<typeof ImportList>>();
const handleUpload = (file: any) => {
  postUploadDeviceFile({ file: file })
    .then((res) => {
      if (res.data.length > 0) {
        refImportList.value?.handleShow();
        refImportList.value?.handleData(res.data);
      } else {
        Message.info("暂无解析人员数据");
      }
    })
    .catch((err) => {
      console.log(err, "err");
      Message.error(err || "解析表格数据失败");
    });
  return false;
};
let listParams = reactive<ParamsType>({
  pageSize: 8,
  pageNum: 1,
  name: "",
});
let pageTotal = ref<number>(0);
const getTableData = () => {
  refETable.value?.getData(listParams, (res: any) => {
    pageTotal.value = res.data.total;
  });
};
const pSizeChange = (size: number) => {
  listParams.pageSize = size;
  getTableData();
};
const pageChange = (page: number) => {
  listParams.pageNum = page;
  getTableData();
};
const onSearchNameChange = (e: any) => {
  _.debounce(() => {
    listParams.name = e.target.value;
    listParams.pageNum = 1;
    getTableData();
  }, 400)();
};
// 自定义指令获取
const vDebounce = resolveDirective("debounce");
const handleNotice = (data: any) => {
  let fileName = _.last(data.filePath.split("\\"));
  Notice.success({
    title: "下载成功",
    desc: `${fileName}, 打开文件`,
    duration: 6,
    render: (h: any) => {
      return h(
        "p",
        {
          class: "fileLink",
          style: { color: "var(--fontColor)", userSelect: "none" },
        },
        [
          `${fileName}，`,
          h(
            "span",
            {
              style: {
                color: "var(--f_color_active)",
                cursor: "pointer",
                borderBottom: "1px solid var(--f_color_active)",
              },
              onclick: () => {
                shell.openPath(data.filePath);
              },
            },
            "打开文件"
          ),
        ]
      );
    },
  });
};
onMounted(() => {
  nextTick(() => {
    getTableData();
    // 监听主程序返回文件保存地址

    ipcRenderer.on("sendSaveFileResult", (e, data) => {
      console.log(data, "data");

      getDownloadTemplate().then((res: any) => {
        // fs.writeFileSync(data.filePath, res, { encoding: "UTF8" });
        // console.log(res);
        let blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        blob.arrayBuffer().then((buf) => {
          console.log(buf instanceof ArrayBuffer, "res instanceof ArrayBuffer");
          const buffer = Buffer.from(buf);
          useNodeStreamDownload(
            {
              path: data.filePath,
              streamContent: buffer,
            },
            () => {
              handleNotice(data);
            },
            () => {}
          );
        });
      });
    });
  });
});
</script>
<style scoped lang="less">
:deep(.ivu-input) {
  border-radius: 50px;
}
:deep(.fileLink) {
  color: pink;
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
      font-size: 16px;
      color: @f_color_h3;
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
