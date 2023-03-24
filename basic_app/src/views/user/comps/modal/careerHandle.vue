<!--
 * @Author: fg
 * @Date: 2023-03-24 10:15:52
 * @LastEditors: fg
 * @LastEditTime: 2023-03-24 16:44:14
 * @Description: 职位管理
-->
<template>
  <Modal
    v-model="isShow"
    :width="520"
    class-name="careerModal f-row-c-c"
    :mask-closable="!loading"
  >
    <template #header>
      <h1 class="mTitle">职位管理</h1>
    </template>
    <div class="content">
      <!-- <h1 class="cTitle">基本信息</h1> -->
      <div class="optBox f-row-e-c">
        <Tooltip placement="bottom-end" content="新增职位">
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
      </div>

      <div class="listBox" ref="refScroll">
        <div
          class="listItem f-row-b-c"
          v-for="(item, index) in caeerData"
          :key="index"
          @click="onItemTap(index)"
        >
          <div class="careerName">
            <Text
              v-show="!item.isEdit"
              :ellipsis-config="{ tooltip: true }"
              ellipsis
              placement="bottom-start"
            >
              {{ item.caeerName }}
            </Text>
            <Input
              v-show="item.isEdit"
              :border="false"
              type="text"
              v-model="item.caeerNameCopy"
              placeholder="请输入职称"
            ></Input>
          </div>
          <div class="optBox f-row-c-c" v-show="item.id && item.isEdit">
            <Button
              type="text"
              size="small"
              style="color: var(--fontColor)"
              @click="onEditCancel(index)"
              >取消</Button
            >
            <Button
              type="text"
              size="small"
              style="color: var(--f_color_active)"
              :loading="loading"
              @click="onEditHandle(index)"
              >修改</Button
            >
          </div>
          <div class="optBox f-row-c-c" v-show="item.id && !item.isEdit">
            <Button
              type="text"
              size="small"
              style="color: var(--f_color_active)"
              @click="onEdit(index)"
              >编辑</Button
            >
            <Button
              type="text"
              size="small"
              style="color: var(--error)"
              @click="onDel(index)"
              >删除</Button
            >
          </div>
          <div class="optBox f-row-c-c" v-show="!item.id">
            <Button
              type="text"
              size="small"
              v-debounce="onAddCancel"
              style="color: var(--fontColor)"
              >取消</Button
            >
            <Button
              type="text"
              size="small"
              style="color: var(--f_color_active)"
              :loading="loading"
              v-debounce="onAddHandle"
              >新增</Button
            >
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
import { Message, Modal } from "view-ui-plus";
import {
  getUserCareer,
  deleteCareer,
  addCareer,
  uploadCareer,
} from "@/apis/user";
let emit = defineEmits<{
  (e: "onSuccess"): void;
}>();
// 加载
let loading = ref<boolean>(false);
let isShow = ref<boolean>(false);
let caeerData = ref<any[]>([]);
let refScroll = ref<HTMLDivElement>();
const handleShow = () => {
  isShow.value = true;
  getData();
};
const getData = () => {
  loading.value = true;
  getUserCareer({})
    .then((res) => {
      res.data.map((item: any) => {
        item.isEdit = false;
        item.caeerNameCopy = item.caeerName;
      });
      caeerData.value = res.data;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};

// 添加新增
const showAdd = () => {
  let temp = caeerData.value;
  // 进行添加
  temp.map((item: any) => {
    item.isEdit = false;
  });
  if (temp[temp.length - 1].id) {
    temp.push({
      isEdit: true,
      caeerName: "",
      caeerNameCopy: "",
    });
  }
  scrollToBottom();
};
// 添加取消
const onAddCancel = () => {
  let temp = caeerData.value;
  temp.pop();
  caeerData.value = temp;
};
// 添加处理
const onAddHandle = () => {
  let temp = caeerData.value[caeerData.value.length - 1].caeerNameCopy;
  if (temp) {
    loading.value = true;
    addCareer({ caeerName: temp })
      .then((res) => {
        Message.success("新增职位操作成功");
        getData();
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};
// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    refScroll.value?.scrollTo({
      top: refScroll.value?.scrollHeight - refScroll.value?.clientHeight,
      behavior: "smooth",
    });
  });
};
// 删除
const onDel = (index: number) => {
  Modal.confirm({
    title: "是否确认删除当前职位",
    loading: true,
    onOk: () => {
      deleteCareer({ id: caeerData.value[index].id }).then((res) => {
        if (res.data) {
          Modal.remove();
          Message.success("删除当前职位操作成功");
          getData();
        }
      });
    },
  });
};
// 编辑
const onEdit = (index: number) => {
  let temp = caeerData.value;
  temp[index].isEdit = true;
  caeerData.value = temp;
  setTimeout(() => {
    (document.querySelectorAll(".careerName input")[index] as any).focus();
  }, 100);
};
// 取消编辑
const onEditCancel = (index: number) => {
  let temp = caeerData.value;
  temp[index].isEdit = false;
  temp[index].caeerNameCopy = temp[index].caeerName;
  caeerData.value = temp;
};
// 修改
const onEditHandle = (index: number) => {
  let temp = caeerData.value[index];
  if (
    temp.caeerNameCopy &&
    caeerData.value[index].caeerName != temp.caeerNameCopy
  ) {
    loading.value = true;
    uploadCareer({ caeerName: temp.caeerNameCopy, id: temp.id })
      .then((res) => {
        Message.success("修改当前职位操作成功");
        getData();
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};
// 单个点击
const onItemTap = (index: number) => {};

// 操作
const onCancel = () => {
  isShow.value = false;
  loading.value = false;
};
const onConfirm = () => {};

defineExpose({
  handleShow,
});
</script>
<style lang="less">
.careerModal {
  user-select: none;
  .mTitle {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    // @fontColor
    color: @f_color_h6;
  }
  .content {
    max-height: 500px;
    .size(100%,auto);
    /* overflow-y: scroll;
    overflow-x: hidden; */
    box-sizing: border-box;
    .cTitle {
      .size(100%,24px);
      line-height: 24px;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .optBox {
      .size(100%, 40px);
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
    .listBox {
      .size(100%, 350px);
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 0px 20px;
      box-sizing: border-box;
      margin-top: 10px;
      .ivu-scroll-container {
        height: 100% !important;
      }
      .listItem {
        .size(100%, 42px);
        .careerName {
          .size(100%, 100%);
          line-height: 42px;
          font-size: 16px;
          color: @f_color_h3;
          text-align: center;
          &:hover {
            background-color: @menu_hover;
          }
          .ivu-input {
            padding: 0;
            .size(100%, 43px);
            font-size: 16px;
            text-align: center;
          }
        }
        .optBox {
          width: auto;
          flex-shrink: 1;
          button {
            margin-left: 6px;
          }
          .ivu-btn-text:focus {
            box-shadow: none;
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
