<!--
 * @Author: fg
 * @Date: 2023-03-24 17:05:17
 * @LastEditors: fg
 * @LastEditTime: 2023-03-27 15:31:36
 * @Description: 部门管理
-->
<template>
  <Modal
    v-model="isShow"
    :width="80"
    class-name="departmentModal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">部门管理</h1>
    </template>
    <div class="content" :style="{ height: contentHeight + 'px' }">
      <div class="header f-row-b-c">
        <div class="hLeft f-row-s-c">
          <div class="hLeftItem f-row-c-c">
            <p class="label">筛选</p>
            <Input
              placeholder="请输入部门关键词"
              clearable
              v-model="depConf.searchName"
              @on-change="onTreeNameChange"
            ></Input>
          </div>
        </div>
        <div class="hRight f-row-c-c">
          <!-- <Tooltip placement="bottom-end" content="新增职位">
            <div class="optItem f-row-c-c" v-debounce="showAdd">
              <svg-icon
                iconName="icon-icon-xinzeng"
                className="optIcon"
                size="24"
                color="var(--fontColor)"
              ></svg-icon>
            </div>
          </Tooltip> -->
        </div>
      </div>
      <div class="contentBox">
        <vue3-tree-org
          ref="refTreeOrg"
          :data="depConf.data"
          :node-draggable="false"
          :center="depConf.center"
          :horizontal="depConf.horizontal"
          :label-style="depConf.style"
          :tool-bar="depConf.toolBar"
          :define-menus="[]"
          :filter-node-method="filterNodeMethod"
          @on-node-click="onNodeTap"
        >
          <!-- 自定义节点内容 -->
          <template v-slot="{ node }">
            <Dropdown trigger="contextMenu">
              <div class="deptNodeBox">
                <h3>{{ node.label }}</h3>
                <!-- <p>负责人：{{ node.label }}</p> -->
              </div>
              <template #list>
                <DropdownMenu>
                  <DropdownItem @click="onDeptDetail(node)">
                    查看
                  </DropdownItem>
                  <DropdownItem @click="onDeptAdd(node)"> 新增 </DropdownItem>
                  <DropdownItem
                    v-show="node.pid"
                    style="color: var(--error)"
                    @click="onDeptDeleted(node)"
                  >
                    删除
                  </DropdownItem>
                  <DropdownItem @click="onDeptEdit(node)">编辑</DropdownItem>
                </DropdownMenu>
              </template>
            </Dropdown>
          </template>
        </vue3-tree-org>
        <Spin :show="loading" size="large" class="loading f-row-c-c">
          <Icon
            type="ios-loading"
            size="26"
            class="conLoading iconLoading"
          ></Icon>
          <div class="conLoadingTxt">加载中...</div>
        </Spin>
        <div class="noDataCon f-col-s-c" v-show="false">
          <img src="@/assets/images/no_data.png" alt="" />
          <p>当前暂无部门结构数据，现在去<span>新增部门</span></p>
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
  <Modal
    v-model="isShowModal"
    :width="400"
    class-name="departmentModal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">
        {{ !isEdit ? "部门详情" : !isAdd ? "编辑部门" : "新增部门" }}
      </h1>
    </template>
    <div class="contentForm">
      <div class="conBox">
        <Form :model="form" class="conForm" :rules="ruleForm" ref="refForm">
          <FormItem label="" prop="deptName" class="formItem">
            <div class="formLabel f-row-s-c">
              <span class="labelTag">*</span>
              <p>部门名称</p>
            </div>
            <div class="formValCon">
              <Input
                v-show="isEdit"
                :border="false"
                type="text"
                v-model="form.deptName"
                placeholder="请输入部门名称"
              ></Input>
              <Text
                v-show="!isEdit"
                class="equipNameTxt"
                :ellipsis-config="{ tooltip: true }"
                ellipsis
                placement="bottom-start"
                >{{ form.deptName || "暂无部门名称" }}</Text
              >
            </div>
          </FormItem>
          <FormItem label="" prop="leader" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>部门负责人</p>
            </div>
            <div class="formValCon">
              <Select
                v-show="isEdit"
                v-model="form.leader"
                placeholder="请选择负责人"
                @on-change="onLeaderChange"
              >
                <Option
                  :value="item.id"
                  :key="index"
                  v-for="(item, index) in userList"
                >
                  {{ item.nickname }}
                </Option>
              </Select>
              <Text
                v-show="!isEdit"
                class="equipNameTxt"
                :ellipsis-config="{ tooltip: true }"
                ellipsis
                placement="bottom-start"
                >{{ form.leaderName || "暂无负责人" }}</Text
              >
            </div>
          </FormItem>
          <FormItem label="" prop="phone" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>电话</p>
            </div>
            <div class="formValCon">
              <Input
                v-show="isEdit"
                :border="false"
                type="tel"
                v-model="form.phone"
                placeholder="请输入联系电话"
              ></Input>
              <Text
                v-show="!isEdit"
                class="equipNameTxt"
                :ellipsis-config="{ tooltip: true }"
                ellipsis
                placement="bottom-start"
                >{{ form.phone || "暂无联系电话" }}</Text
              >
            </div>
          </FormItem>
          <FormItem label="" prop="email" class="formItem">
            <div class="formLabel f-row-s-c">
              <p>邮箱</p>
            </div>
            <div class="formValCon has">
              <Input
                v-show="isEdit"
                :border="false"
                type="email"
                v-model="form.email"
                placeholder="请输入邮箱"
              ></Input>
              <Text
                v-show="!isEdit"
                class="equipNameTxt"
                :ellipsis-config="{ tooltip: true }"
                ellipsis
                placement="bottom-start"
                >{{ form.email || "暂无邮箱" }}</Text
              >
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <template #footer>
      <div v-show="!isEdit"></div>
      <Button v-show="isEdit" type="text" v-debounce="onCancel">取消</Button>
      <Button
        v-show="isEdit"
        type="primary"
        :loading="editLoading"
        v-debounce="onConfirm"
        >{{ !isAdd ? "确定" : "新增" }}</Button
      >
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Message, Modal, Form } from "view-ui-plus";
import {
  getDept,
  getParUserByDeptId,
  deletedDept,
  uploadDept,
  addDept,
} from "@/apis/user";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
// 加载
let loading = ref<boolean>(false);
let isShow = ref<boolean>(false);

// 部门数据结构content height
let contentHeight = ref<number>(0);
const handleShow = () => {
  isShow.value = true;
  getData();
};

// 组织结构处理
const depConf = reactive({
  data: {
    id: 1,
    label: "xxx科技有限公司",
    children: [
      {
        id: 2,
        pid: 1,
        label: "产品研发部",
        children: [
          { id: 6, pid: 2, label: "禁止编辑节点" },
          { id: 8, pid: 2, label: "禁止拖拽节点" },
          { id: 10, pid: 2, label: "测试" },
        ],
      },
      {
        id: 3,
        pid: 1,
        label: "客服部",
        children: [
          { id: 11, pid: 3, label: "客服一部" },
          {
            id: 12,
            pid: 3,
            label: "客服二部",
          },
        ],
      },
      { id: 4, pid: 1, label: "业务部" },
    ],
  },
  center: true,
  horizontal: false,
  expandAll: true,
  toolBar: false,
  searchName: "", //搜索名
  style: {
    background: "#fff",
    color: "#5e6d82",
  },
});
const getData = () => {
  loading.value = true;
  let temp = [{}];
  getDept()
    .then((res) => {
      temp = handleDeptData(res.data);
      depConf.data = temp[0] as any;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
// 处理部门数据
const handleDeptData = (arr: any[]): any[] => {
  let tempArr: any[] = [];
  arr.map((item: any) => {
    let temp: any = {
      id: item.id,
      label: item.deptName,
      children: [] as any[],
      leader: item.leader,
      leaderName: item.leaderName,
      phone: item.phone,
      email: item.email,
    };
    if (item.parentId) {
      temp.pid = item.parentId;
    }
    if (item.children && item.children.length > 0) {
      temp.children = handleDeptData(item.children) as any[];
    }
    tempArr.push(temp);
  });
  return tempArr;
};

let refTreeOrg = ref();
// 搜索tree
const onTreeNameChange = () => {
  refTreeOrg.value.filter(depConf.searchName);
};

const filterNodeMethod = (value: any, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

const onNodeTap = (e: any, data: any) => {
  console.log(e, data);
};

// 编辑查看新增modal
let editLoading = ref<boolean>(false);
let isShowModal = ref<boolean>(false);
let isEdit = ref<boolean>(false);
let isAdd = ref<boolean>(false);
let form = reactive<any>({
  id: "",
  deptName: "",
  leader: "",
  leaderName: "",
  phone: "",
  email: "",
  pid: "",
});
let refForm = ref<InstanceType<typeof Form>>();
let ruleForm = {
  deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
};
let userList = ref<any[]>([]);

const getUserList: any = (deptId: number) => {
  return getParUserByDeptId({ deptId }).then((res) => {
    userList.value = res.data;
  });
};
const initForm = () => {
  let temp = {
    id: "",
    deptName: "",
    leader: "",
    leaderName: "",
    phone: "",
    email: "",
    pid: "",
    parentId: "",
  };
  Object.assign(form, temp);
};
// 新增节点
const onDeptAdd = async (node: any) => {
  isEdit.value = true;
  isAdd.value = true;
  initForm();
  form.id = "";
  form.pid = node.id;
  form.parentId = node.id;
  console.log(form, "from");
  await getUserList(node.id);
  isShowModal.value = true;
};
// 查看节点
const onDeptDetail = (node: any) => {
  isEdit.value = false;
  isAdd.value = false;
  isShowModal.value = true;
  Object.assign(form, node.$$data);
  form.parentId = node.pid;
  form.deptName = node.label;
};
// 编辑节点
const onDeptEdit = async (node: any) => {
  isEdit.value = true;
  isAdd.value = false;
  isShowModal.value = true;
  await getUserList(node.id);
  setTimeout(() => {
    Object.assign(form, node.$$data);
    form.parentId = node.pid;
    form.deptName = node.label;
  });
};
// 删除节点
const onDeptDeleted = (node: any) => {
  Modal.confirm({
    title: "是否确认删除当前部门节点",
    loading: true,
    onOk: () => {
      deletedDept({ id: node.id })
        .then((res) => {
          Modal.remove();
          Message.success("删除当前部门节点操作成功");
          getData();
        })
        .catch((err) => {
          Modal.remove();
          Message.success("删除当前部门节点操作失败");
        });
    },
  });
};

// 取消
const onCancel = () => {
  isShowModal.value = false;
  editLoading.value = false;
  initForm();
  (refForm.value?.resetFields as any)();
};
// 提交
const onConfirm = () => {
  (refForm.value?.validate as any)((valid: any) => {
    if (valid) {
      editLoading.value = true;
      if (isAdd.value) {
        handleAdd();
      } else {
        handleEdit();
      }
      initForm();
    }
  });
};

// 部门负责人切换修改
const onLeaderChange = (value: any) => {
  let temp: any = {};
  userList.value.map((item) => {
    if (item.id == value) {
      temp = item;
    }
  });
  form.email = temp.email;
  form.phone = temp.phone;
};

const handleAdd = () => {
  let params = { ...form };
  addDept(params).then((res) => {
    editLoading.value = false;
    isShowModal.value = false;
    getData();
  });
};

const handleEdit = () => {
  let params = { ...form };
  uploadDept(params).then((res) => {
    editLoading.value = false;
    isShowModal.value = false;
    getData();
  });
};

onMounted(() => {
  contentHeight.value = document.body.clientHeight * 0.7;
  window.onresize = () => {
    contentHeight.value = document.body.clientHeight * 0.7;
  };
});
defineExpose({
  handleShow,
});
</script>
<style lang="less">
.deptNodeBox {
  padding: 10px 14px;
  h3 {
    font-size: 18px;
    color: @f_color_h3;
    font-weight: 400;
    text-shadow: 1px 1px 10px #adcff0;
  }
  p {
    margin-top: 5px;
    font-size: 14px;
    color: @fontColor;
  }
}
.departmentModal {
  user-select: none;
  touch-action: none;
  .mTitle {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    // @fontColor
    color: @f_color_h6;
  }
  .content {
    .size(100%,500px);
    /* overflow-y: scroll;
    overflow-x: hidden; */
    box-sizing: border-box;
    .cTitle {
      .size(100%,24px);
      line-height: 24px;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .header {
      .size(100%, 46px);
      padding-bottom: 6px;
      // border-bottom: 1px solid @search_bottom_border;
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
        .ivu-input {
          border: none;
          border-radius: 4px;
          background-color: @menu_item_hover;
          cursor: pointer;
        }
        .ivu-input:focus {
          box-shadow: none;
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
    .contentBox {
      .size(100%, calc(100% - 46px));
      .loading {
        .size(100%,100%);
        .conLoadingTxt {
          margin-top: 10px;
          white-space: nowrap;
        }
      }

      .noDataCon {
        .size(100%,auto);
        margin-top: 60px;
        img {
          .size(200px,200px);
          margin-bottom: 10px;
        }
        p {
          font-size: 14px;
          color: @fontColor;
          span {
            color: @f_color_active;
            cursor: pointer;
          }
        }
      }
      .ivu-dropdown-menu {
        min-width: 70px;
        text-align: left;
      }
      .tree-org-node__inner {
        border-radius: 6px;
      }
    }
  }
  .contentForm {
    .size(100%,auto);
    .conBox {
      .size(100%,calc(100% - 30px));
      border-radius: 6px;
      // border: 1px solid @search_bottom_border;
      padding: 8px 10px;
      .conForm {
        .size(100%,auto);
        display: flex;
        flex-wrap: wrap;
        align-items: self-start;
        .formItem {
          .size(50%,80px);
          flex-shrink: 0;
          margin-bottom: 2px;
          // border-bottom: 1px solid @search_bottom_border;
          box-sizing: border-box;
          .formLabel {
            font-size: 14px;
            color: #666;
            position: relative;
            padding-left: 10px;
            box-sizing: border-box;
            .labelTag {
              position: absolute;
              top: 4px;
              left: 0;
              font-size: 20px;
              color: @error;
            }
            p {
              margin-right: 10px;
            }
            span {
              font-size: 12px;
              color: @fontColor;
            }
          }
          .formValCon {
            width: 100%;
            padding-left: 4px;
            box-sizing: border-box;
            position: relative;
            &::after {
              content: "";
              .size(2px, 20px);
              position: absolute;
              top: 8px;
              left: -14px;
              background-color: @search_bottom_border;
            }
            .ivu-typography {
              color: @f_color_h3;
              width: 90%;
              padding-left: 6px;
            }
            .ivu-input-type-password {
              width: 90%;
              input {
                padding-right: 32px;
              }
            }
            .ivu-input-prefix i,
            .ivu-input-suffix i {
              color: #333 !important;
            }
            .ivu-input-wrapper,
            .ivu-select,
            .ivu-cascader-rel {
              width: 90%;
            }
            .ivu-select-selection {
              border: none;
            }
            .ivu-select-visible .ivu-select-selection {
              box-shadow: none;
            }
          }
          &:nth-child(2n + 1) {
            .formValCon {
              &::after {
                display: none;
              }
            }
          }
          &:nth-child(2n) {
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
        border: none;
      }
      .ivu-input {
        font-size: 14px;
      }
    }
    .ivu-modal-footer {
      border-top: none;
    }
  }
}
</style>
