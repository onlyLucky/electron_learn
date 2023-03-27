<!--
 * @Author: fg
 * @Date: 2023-03-16 16:03:18
 * @LastEditors: fg
 * @LastEditTime: 2023-03-27 10:55:53
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
            :model-value="deptId"
            :change-on-select="true"
            :render-format="handleFormat"
            clearable
            filterable
            placeholder="请选择"
            @on-change="onDeptChange"
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
            @on-change="onNickNameChange"
          ></Input>
        </div>
        <div class="hLeftItem f-row-c-c">
          <p class="label">登录账号</p>
          <Input
            placeholder="请输入"
            clearable
            v-model="searchForm.userName"
            @on-change="onUseNameChange"
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

        <Tooltip placement="bottom-end" content="新增人员">
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

        <Tooltip placement="bottom-end" content="删除用户">
          <Badge :count="refUserTable?.selectArr.length">
            <div class="optItem f-row-c-c" v-debounce="delUser">
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
            <!-- <div class="menuTitle">
              <p>导入设备</p>
            </div> -->
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
                导入人员
              </Upload>
            </DropdownItem>
            <DropdownItem v-debounce="handleCareer"> 职位管理 </DropdownItem>
            <DropdownItem v-debounce="handleGroup"> 部门管理 </DropdownItem>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="content">
      <UserTable
        ref="refUserTable"
        @onDel="singDelUser"
        @onDetail="onDetail"
        @upload="getUserList"
        @onResetPwa="onResetPwa"
      ></UserTable>
    </div>
    <div class="footer f-row-e-c">
      <Page
        show-sizer
        show-total
        :total="refUserTable?.pageTotal"
        :page-size="page.pageSize"
        :page-size-opts="pageSizeArr"
        @on-page-size-change="pSizeChange"
        @on-change="pageChange"
      />
    </div>
    <!-- modal -->
    <ResetPwa ref="refResetPwa"></ResetPwa>
    <UserAdd ref="refUserAdd" @onSuccess="getUserList"></UserAdd>
    <UserDetail ref="refUserDetail" @onSuccess="getUserList"></UserDetail>
    <CareerHandler ref="refCareerHandler"></CareerHandler>
    <DepartmentHandle ref="refDepartmentHandle"></DepartmentHandle>
    <ImportList ref="refImportList"></ImportList>
  </div>
</template>
<script setup lang="ts">
import { getDept } from "@/apis/user";
import { Cascader, Message, Notice, Modal } from "view-ui-plus";
import { ipcRenderer, shell } from "electron";
import _ from "lodash";
import { useNodeStreamDownload } from "@/hooks/useElectronDownload";
import { getDownloadTemplate, parseXlsxUser } from "@/apis/user";
import UserTable from "./comps/useTable.vue";
import ResetPwa from "./comps/modal/resetPwa.vue";
import UserAdd from "./comps/modal/userAdd.vue";
import UserDetail from "./comps/modal/userDetail.vue";
import CareerHandler from "./comps/modal/careerHandle.vue";
import DepartmentHandle from "./comps/modal/departmentHandle.vue";
import ImportList from "./comps/modal/importList.vue";
let searchForm = reactive<any>({
  nickname: "",
  status: "",
  userName: "",
});

// 分页
let pageSizeArr = [8, 16, 24];
type PageType = {
  pageSize: number;
  pageNum: number;
};
let page = reactive<PageType>({
  pageSize: pageSizeArr[0],
  pageNum: 1,
});
const pSizeChange = (size: number) => {
  page.pageSize = size;
  getUserList();
};
const pageChange = (p: number) => {
  page.pageNum = p;
  getUserList();
};
// 部门查询
const deptId = ref<any[]>([]);

// 用户列表
let refUserTable = ref<InstanceType<typeof UserTable>>();
// 重置密码modal
let refResetPwa = ref<InstanceType<typeof ResetPwa>>();
// 新增用户modal
let refUserAdd = ref<InstanceType<typeof UserAdd>>();
// 用户详情
let refUserDetail = ref<InstanceType<typeof UserDetail>>();
// 职位管理
let refCareerHandler = ref<InstanceType<typeof CareerHandler>>();
// 部门管理
let refDepartmentHandle = ref<InstanceType<typeof DepartmentHandle>>();
// 解析列表
let refImportList = ref<InstanceType<typeof ImportList>>();

// 详情查看
const onDetail: any = (data: any, flag: boolean) => {
  refUserDetail.value?.handleShow(data, flag);
};

/* 用户搜索项更改 */
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
  page.pageNum = 1;
  if (!e) searchForm.status = "";
  getUserList();
};
// 用户昵称更改
const onNickNameChange = () => {
  page.pageNum = 1;
  getUserList();
};
// 登录账号更改
const onUseNameChange = () => {
  page.pageNum = 1;
  getUserList();
};

// 重置数据
const resetSearch = () => {
  deptId.value = [];
  page.pageSize = pageSizeArr[0];
  page.pageNum = 1;
  let temp = {
    nickname: "",
    status: "",
    userName: "",
  };
  Object.assign(searchForm, temp);
  let params = {
    pageSize: page.pageSize,
    pageNum: page.pageNum,
  };
  refUserTable.value?.getDataByUser(params);
};
// 部门数据更改
const onDeptChange = (value: any): any => {
  console.log(value);
  deptId.value = value;
  let params = {
    params: {
      pageSize: page.pageSize,
      pageNum: page.pageNum,
    },
    deptId: value[value.length - 1],
  };
  if (value <= 0) {
    getUserList();
  } else {
    refUserTable.value?.getDataByDept(params);
  }
};

// 获取用户列表数据
const getUserList = () => {
  let params = {
    pageSize: page.pageSize,
    pageNum: page.pageNum,
  };
  params = _.pickBy({ ...params, ...searchForm });
  refUserTable.value?.getDataByUser(params);
};
// 删除用户
const delUser = () => {
  if (refUserTable.value!.selectArr.length > 0) {
    delOpt();
  }
};
//单个删除
const singDelUser = () => {
  Modal.confirm({
    title: "是否确认删除用户",
    loading: true,
    onOk: () => {
      refUserTable.value?.onDel(() => {
        Modal.remove();
        getUserList();
      });
    },
    onCancel: () => {
      refUserTable.value?.onSingDelCancel();
    },
  });
};
// 重置密码
const onResetPwa = (id: number) => {
  refResetPwa.value?.handleShow(id);
};
const delOpt = () => {
  Modal.confirm({
    title: "是否确认删除用户",
    loading: true,
    onOk: () => {
      refUserTable.value?.onDel(() => {
        Modal.remove();
        getUserList();
      });
    },
  });
};

let deptList = ref<any[]>([]);

const getDeptData = () => {
  deptList.value = [];
  getDept().then((res) => {
    deptList.value = handleDeptData(res.data);
  });
};
// 处理部门数据
const handleDeptData = (arr: any[]): any[] => {
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

// 下载模板
const onDownloadTemplate = () => {
  ipcRenderer.send("showSaveFile", {
    name: "人员导入模板.xlsx",
    filters: [{ name: "xlsx", extensions: ["xlsx"] }],
  });
};
// 处理上传
const handleUpload = (file: any) => {
  parseXlsxUser({ file: file })
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
// 新增用户
const showAdd = () => {
  refUserAdd.value?.handleShow();
};

// 职位管理
const handleCareer = () => {
  refCareerHandler.value?.handleShow();
};

// 部门管理
const handleGroup = () => {
  refDepartmentHandle.value?.handleShow();
};

onMounted(() => {
  nextTick(() => {
    // 获取用户
    getUserList();
    // 获取组织架构数据
    getDeptData();

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
