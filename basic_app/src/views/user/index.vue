<!--
 * @Author: fg
 * @Date: 2023-03-16 16:03:18
 * @LastEditors: fg
 * @LastEditTime: 2023-03-17 14:45:47
 * @Description: 用户模块
-->
<template>
  <div class="User">
    <div class="header f-row-b-c">
      <div class="hLeft f-row-s-c">
        <!-- <h1>设备列表</h1> -->
        <div class="hLeftItem f-row-c-c">
          <p class="label">部门</p>
          <Cascader
            style="width: 140px"
            :data="deptList"
            class="hLItemValue"
            v-model="deptId"
            :render-format="handleFormat"
            clearable
            filterable
            placeholder="请选择"
          >
            <!-- <Option
              v-for="(item, index) in deviceList"
              :value="item.id"
              :key="index"
              >{{ item.name }}</Option
            > -->
          </Cascader>
        </div>
        <div class="hLeftItem f-row-c-c">
          <p class="label">状态</p>
          <Select
            style="width: 80px"
            class="hLItemValue"
            v-model="searchForm.status"
            clearable
            filterable
            placeholder="请选择"
            @on-change="onStatusChange"
          >
            <Option
              v-for="(item, index) in statusData"
              :value="item.value"
              :key="index"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <div class="hLeftItem f-row-c-c">
          <p class="label">用户昵称</p>
          <Input
            placeholder="请输入"
            clearable
            v-model="searchForm.nickname"
          ></Input>
        </div>
        <div class="hLeftItem f-row-c-c">
          <p class="label">登录账号</p>
          <Input
            placeholder="请输入"
            clearable
            v-model="searchForm.userName"
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
          <template #list>
            <div class="menuTitle">
              <p>导入设备</p>
            </div>
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
          </template>
        </Dropdown>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getDept } from "@/apis/user";
import { Cascader, Message, Notice } from "view-ui-plus";
import { ipcRenderer, shell } from "electron";
import _ from "lodash";
import { useNodeStreamDownload } from "@/hooks/useElectronDownload";
import { getDownloadTemplate } from "@/apis/user";
let searchForm = reactive<any>({
  nickname: "",
  status: "",
  userName: "",
});
// 分页
let page = reactive<any>({
  pageSize: 8,
  pageNum: 1,
});
let total = ref<number>(0);
// 部门查询
const deptId = ref<any>("");

// 职工状态
let statusData = [
  {
    value: 0,
    label: "在职",
  },
  {
    value: 1,
    label: "离职",
  },
];
const onStatusChange = (e: any) => {
  if (!e) {
    searchForm.status = "";
  }
  console.log(searchForm, e);
};
let delBadgeNum = ref<number>(0);
const delMeeting = () => {};
const resetSearch = () => {};

let deptList = ref<any[]>([]);
const getDeptData = () => {
  deptList.value = [];
  getDept().then((res) => {
    deptList.value = handleDeptData(res.data);
  });
};
// 处理部门数据
const handleDeptData = (arr: any[]) => {
  let tempArr: any[] = [];
  arr.map((item: any) => {
    let temp = {
      value: item.id,
      label: item.deptName,
      children: [] as any[],
    };
    if (item.children && item.children.length > 0) {
      temp.children = handleDeptData(item.children) as any[];
    }
    tempArr.push(temp);
  });
  return tempArr;
};

// 处理级联选择器展示数据
const handleFormat = (labels: any[], selectedData: any[]) => {
  let index = labels.length - 1;
  return labels[index];
};
getDeptData();

// 下载模板
const onDownloadTemplate = () => {
  ipcRenderer.send("showSaveFile", {
    name: "人员导入模板.xlsx",
    filters: [{ name: "xlsx", extensions: ["xlsx"] }],
  });
};
// 处理上传
const handleUpload = (file: any) => {
  /* postUploadDeviceFile({ file: file })
    .then((res) => {
      refImportList.value?.handleShow();
      refImportList.value?.handleData(res.data);
    })
    .catch((err) => {
      console.log(err, "err");
    });
  return false; */
};
// 处理下载消息通知
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
// 新增设备
const showAdd = () => {};
onMounted(() => {
  nextTick(() => {
    // 监听主程序返回文件保存地址

    ipcRenderer.on("sendSaveFileResult", (e, data) => {
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
            (err: any) => {
              Message.error(err || "人员模板下载失败");
            }
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
.User {
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
  h1 {
    font-size: 30px;
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
