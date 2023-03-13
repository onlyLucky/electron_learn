<!--
 * @Author: fg
 * @Date: 2023-02-28 15:18:11
 * @LastEditors: fg
 * @LastEditTime: 2023-03-13 14:29:24
 * @Description: 右侧展示tab
-->
<template>
  <div class="rightTab" v-show="show">
    <div class="tabHeader f-row-c-c">
      <div
        :class="['tHItem', index == tabIndex ? 'active' : '']"
        v-for="(item, index) in tabData"
        :key="index"
        @click="onTabHeaderTap(index)"
      >
        {{ item.name }}{{ vConfig.current }}
      </div>
      <div class="line" :style="{ left: tabData[tabIndex].left + 'px' }"></div>
    </div>
    <transition name="fade">
      <div class="tabCon f-row">
        <div class="tConItem analecta f-w" v-show="tabIndex == 0">
          <div
            :class="[
              'anaItem',
              'f-row-c-c',
              index == vConfig.current ? 'active' : '',
            ]"
            v-for="(item, index) in files"
            :key="index"
            @click="onAnalectaChange(index)"
          >
            {{ index + 1 }}
            <svg-icon
              v-show="index == vConfig.current && vConfig?.playing"
              iconName="icon-shengyin"
              className="playIcon iconFloat"
              size="20"
              color="var(--f_color_active)"
            ></svg-icon>
          </div>
        </div>
        <div class="tConItem useDraw f-w" v-show="tabIndex == 1">
          <div class="useDrawBox">
            <div class="optBox f-row-e-c">
              <div class="optItem">
                <Checkbox :model-value="selectAll" @on-change="onAllChange">{{
                  selectAll ? "全部选择" : "取消全部"
                }}</Checkbox>
              </div>
            </div>
            <div class="userBox f-w">
              <div
                class="userItem f-col-c-c"
                v-for="(item, index) in user"
                :key="index"
              >
                <div class="avatar f-row-c-c">
                  <span>{{ item.username.slice(-2) }}</span>
                  <Checkbox
                    class="userSelect"
                    :model-value="item.active"
                    @on-change="onCheckItemChange($event, index)"
                  ></Checkbox>
                </div>
                <div class="userName">
                  <Text
                    :ellipsis-config="{ tooltip: true }"
                    ellipsis
                    placement="bottom-start"
                    >{{ item.username }}</Text
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
let props = withDefaults(
  defineProps<{
    show: boolean;
    files: any[];
    user: any[];
    vConfig: any;
  }>(),
  {
    show: false,
    files: () => [],
    user: () => [],
    vConfig: {
      current: 0,
      playing: false,
    },
  }
);
let emit = defineEmits<{
  (e: "onUseChange", userList: any[]): void;
  (e: "onAnalectaChange", index: number): void;
}>();
let tabData = [
  {
    name: "选集列表",
    left: 100,
  },
  {
    name: "用户批注",
    left: 256,
  },
];
watch(
  () => props.user,
  (val) => {
    let temp = val.every((item: any, index: number, array: any[]) => {
      return item.active;
    });
    selectAll.value = temp;
  },
  {
    deep: true,
  }
);
let tabIndex = ref<number>(0);
const onTabHeaderTap = (index: number) => {
  tabIndex.value = index;
};
// 用户批注
let selectAll = ref<boolean>(false);
const onAllChange = (val: boolean) => {
  selectAll.value = val;
  let temp: any[] = [];
  props.user.map((item: any) => {
    item.active = val;
  });
  emit("onUseChange", temp);
};
// 选择用户批注修改
const onCheckItemChange = (flag: boolean, index: number) => {
  let temp: any[] = props.user;
  temp[index].active = flag;
  emit("onUseChange", temp);
};
// 选集切换
const onAnalectaChange = (index: number) => {
  if (props.vConfig.current != index) {
    emit("onAnalectaChange", index);
  }
};
</script>
<style scoped lang="less">
:deep(.useDraw .optBox .optItem) {
  .ivu-checkbox-inner {
    // .size(20px,20px);
    border-radius: 20px;
    margin-right: 4px;
    background-color: transparent;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: @f_color_active;
    background-color: @f_color_active;
  }
  .ivu-checkbox-wrapper {
    margin-right: 0;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner:after {
    .size(5px,9px);
  }
}
:deep(.userItem) {
  .ivu-typography {
    color: @fontColor;
  }
}
:deep(.userBox .userSelect) {
  .ivu-checkbox-inner {
    // .size(20px,20px);
    border-radius: 20px;
    margin-right: 4px;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: @f_color_active;
    background-color: @bg;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner:after {
    .size(5px,9px);
    border-color: @f_color_active;
  }
  .ivu-checkbox-wrapper {
    margin-right: 0px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.rightTab {
  .size(100%,100%);
  .tabHeader {
    .size(100%, 60px);
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 10px;
    .tHItem {
      padding: 10px 40px;
      margin-right: 20px;
      font-size: 14px;
      border-radius: 6px;
      color: @fontColor;
      font-weight: bold;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.6);
      }
    }
    .tHItem.active {
      color: @bg;
      opacity: 0.9;
    }
    .line {
      .size(30px,4px);
      border-radius: 4px;
      background-color: @bg;
      opacity: 0.8;
      position: absolute;
      bottom: 4px;
      left: 100px;
      transition: left 0.25s ease-in-out;
    }
  }
  .tabCon {
    .size(100%, calc(100% - 80px));
    overflow: auto;
    padding: 0px 10px;
    box-sizing: border-box;
    .tConItem {
      .size(100%,100%);
      padding-left: 2px;
      box-sizing: border-box;
      .anaItem {
        .size(45px,45px);
        border-radius: 4px;
        box-sizing: border-box;
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 18px;
        color: @fontColor;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        &:nth-child(7n) {
          margin-right: 0px;
        }
      }
      .anaItem.active {
        background: rgba(0, 0, 0, 0.8);
        color: @f_color_active;
        position: relative;
        .playIcon {
          position: absolute;
          bottom: -6px;
          right: -6px;
        }
      }
    }
    .useDraw {
      .useDrawBox {
        .size(100%,100%);
        .optBox {
          .size(100%,40px);
          .optItem {
            color: @fontColor;
          }
        }
        .userBox {
          .size(100%, calc(100% - 40px));
          align-content: baseline;
          .userItem {
            .size(84px,84px);
            margin-right: 10px;
            margin-bottom: 10px;
            // background-color: pink;
            .avatar {
              position: relative;
              .size(46px,46px);
              border-radius: 4px;
              background-color: @f_color_active;
              margin-bottom: 8px;
              span {
                font-size: 16px;
                color: @bg;
              }
              .userSelect {
                position: absolute;
                bottom: -8px;
                right: -8px;
                margin-right: 0px;
              }
            }
            .userName {
              width: 100%;
              text-align: center;
              color: @fontColor;
              font-size: 16px;
            }
          }
        }
      }
    }
    .tConItem.analecta,
    .tConItem.useDraw {
      align-content: baseline;
    }
  }
  h1 {
    font-size: 30px;
  }
}
</style>
