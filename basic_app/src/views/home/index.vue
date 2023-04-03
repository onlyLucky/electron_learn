<!--
 * @Author: fg
 * @Date: 2023-03-30 10:14:25
 * @LastEditors: fg
 * @LastEditTime: 2023-04-03 18:00:11
 * @Description: 首页
-->
<template>
  <div class="Home f-row">
    <div class="HomeUser">
      <div class="topTip f-row-c-c">
        <div class="con f-row-s-c">
          <div class="conTip f-row-c-c">
            【参会通知】今日您有一个会议参加，最近一次会议【这是一个会议名称】将于12分钟后开始，请留意参会时间及时做好会议准备。
          </div>
        </div>
      </div>
      <div class="userInfo">
        <div class="optBox f-row-b-c">
          <Tooltip placement="bottom" content="退出登录">
            <div class="optLeft optItem f-row-c-c" v-debounce="loginOut">
              <svg-icon
                iconName="icon-tuichudenglu"
                className="optIcon"
                size="16"
                color="var(--fontColor)"
              ></svg-icon>
              <!-- <span>新增</span> -->
            </div>
          </Tooltip>
          <Dropdown placement="bottom-start" trigger="contextMenu">
            <div class="optItem f-row-c-c">
              <svg-icon
                iconName="icon-gengduo1"
                className="optIcon"
                size="20"
                color="var(--fontColor)"
              ></svg-icon>
            </div>
            <template #list>
              <DropdownMenu>
                <DropdownItem>
                  <div class="optMenuItem f-row-s-c">
                    <svg-icon
                      iconName="icon-bianji"
                      className="optIcon"
                      size="20"
                      color="var(--fontColor)"
                    ></svg-icon>
                    <span>编辑信息</span>
                  </div>
                </DropdownItem>
                <DropdownItem>
                  <div class="optMenuItem f-row-s-c">
                    <svg-icon
                      iconName="icon-Union-32"
                      className="optIcon"
                      size="20"
                      color="var(--fontColor)"
                    ></svg-icon>
                    <span>退出应用</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </div>
        <div class="userAvatar f-row-c-c">
          <div class="avatar">
            <img
              :src="computedAvatarPath"
              alt=""
              v-show="userInfo.avatarPath"
            />
            <div class="infoAva f-row-c-c" v-show="!userInfo.avatarPath">
              <span v-show="userInfo.nickname">{{
                userInfo?.nickname?.slice(-2)
              }}</span>
            </div>
            <div class="avaHover" v-show="isEdit">
              <Upload
                action="/"
                accept=".jpg, .jpeg, .png"
                :show-upload-list="false"
                :before-upload="handleUpload"
              >
                <div class="uploadAvatar f-row-c-c">
                  <Icon
                    type="ios-camera"
                    size="30"
                    color="var(--meet_summary_icon_time)"
                  ></Icon>
                </div>
              </Upload>
            </div>
            <div
              class="genderBox f-row-c-c"
              v-show="userInfo.userSex == 1 || userInfo.userSex == 2"
            >
              <svg-icon
                iconName="icon-nan"
                className="iconGender"
                v-show="userInfo.userSex == 1"
                size="16"
                color="var(--f_color_active)"
              ></svg-icon>
              <svg-icon
                iconName="icon-nv"
                v-show="userInfo.userSex == 2"
                className="iconGender"
                size="16"
                color="var(--error)"
              ></svg-icon>
            </div>
          </div>
        </div>
        <div class="userName f-row-c-c">
          <Text
            :ellipsis-config="{ tooltip: true }"
            ellipsis
            placement="bottom-start"
          >
            {{ userInfo.nickname }}
          </Text>
        </div>
        <div class="deptName f-row-c-c">
          <Text
            :ellipsis-config="{ tooltip: true }"
            ellipsis
            placement="bottom-start"
          >
            {{ userInfo.deptName }}
          </Text>
        </div>
        <div class="msgBox f-row-c-c">
          <div class="msgItem f-col-c-c">
            <CountUp
              :start="0"
              :duration="numDuration"
              :end="totalData.MeetNum || 0"
            ></CountUp>
            <span class="msgItemTitle">参加会议数</span>
          </div>
          <div class="msgItem f-col-c-c">
            <CountUp
              :start="0"
              :duration="numDuration"
              :end="totalData.DeviceNum || 0"
            ></CountUp>
            <span class="msgItemTitle">绑定设备数</span>
          </div>
        </div>
      </div>
      <div class="history">
        <div class="hTitle f-row-s-c">
          <span class="hTitleTxt f-row-s-c">播放历史</span>
        </div>
        <div class="historyBox">
          <!-- <div class="historyItem f-row-b-c">
            <div class="historyTxt f-row-b-c">
              <svg-icon
                iconName="icon-zanting"
                className="optIcon"
                size="26"
                color="var(--f_color_active)"
              ></svg-icon>
              <Text
                :ellipsis-config="{ tooltip: true }"
                ellipsis
                placement="bottom-start"
              >
                融合视频会议-20221027-1172-测试版本v1.42_beta会议
              </Text>
            </div>
            <div class="historyProgress">观看至<span>22</span>%</div>
          </div> -->
          <div class="noDataCon f-col-s-c">
            <img src="@/assets/images/no_data.png" alt="" />
            <span>当前暂无播放历史</span>
          </div>
        </div>
      </div>
    </div>
    <div class="HomeMeet">
      <div class="HomeMeetBox">
        <div class="hTitle f-row-b-c">
          <span class="hTitleTxt f-row-s-c">数据总览</span>
        </div>
        <div class="totalBox f-row-b-c">
          <div class="totalItem f-col-c-c">
            <div class="totalItemTop f-row-s-c">
              <CountUp
                :start="0"
                :duration="numDuration"
                :end="totalData.MeetAllNum || 0"
              ></CountUp>
            </div>
            <span class="labelTitle">会议总数</span>
          </div>
          <div class="totalItem f-col-c-c">
            <div class="totalItemTop f-row-s-c">
              <CountUp
                :start="0"
                :duration="numDuration"
                :end="totalData.DeviceAllNum || 0"
              ></CountUp>
            </div>
            <span class="labelTitle">设备总数</span>
          </div>
          <div class="totalItem f-col-c-c">
            <div class="totalItemTop f-row-s-c">
              <CountUp
                :start="0"
                :duration="numDuration"
                :end="totalData.UserNum || 0"
              ></CountUp>
            </div>
            <span class="labelTitle">人员总数</span>
          </div>
          <div class="totalItem f-col-c-c">
            <div class="totalItemTop f-row-s-c">
              <CountUp
                :start="0"
                :duration="numDuration"
                :end="totalData.DownMeetNum || 0"
              ></CountUp>
            </div>
            <span class="labelTitle">可下载会议数</span>
          </div>
        </div>
        <div class="circleBox f-row-b-c">
          <div class="circleItem f-col-c-c">
            <Circle
              :percent="totalData.downRatio"
              :size="100"
              :strokeWidth="7"
              :trailWidth="7"
              stroke-color="var(--home_color2)"
            >
              <div class="circleCon">
                <CountUp :duration="numDuration" :end="12"></CountUp>
              </div>
            </Circle>
            <div class="circleLabel">
              <span>本地下载</span>
            </div>
          </div>
          <div class="circleItem f-col-c-c">
            <Circle
              :percent="totalData.useDeviceRatio"
              :size="100"
              :strokeWidth="7"
              :trailWidth="7"
              stroke-color="var(--f_color_active)"
            >
              <div class="circleCon">
                <CountUp
                  :start="0"
                  :duration="numDuration"
                  :end="totalData.UseDeviceNum || 0"
                ></CountUp>
              </div>
            </Circle>
            <div class="circleLabel">
              <span>使用中设备</span>
            </div>
          </div>
          <div class="circleItem f-col-c-c">
            <Circle
              :percent="totalData.secretRatio"
              :size="100"
              :strokeWidth="7"
              :trailWidth="7"
              stroke-color="var(--home_color1)"
            >
              <div class="circleCon">
                <CountUp
                  :start="0"
                  :duration="numDuration"
                  :end="totalData.SecretMeetNum || 0"
                ></CountUp>
              </div>
            </Circle>
            <div class="circleLabel">
              <span>保密会议</span>
            </div>
          </div>
        </div>

        <div class="chartBox">
          <div class="hTitle f-row-b-c">
            <span class="hTitleTxt f-row-s-c">会议图表</span>
            <div class="filterBox">
              <div class="filterItem">
                <Select v-model="meetType" size="small" style="width: 88px">
                  <Option
                    v-for="(item, index) in timeType"
                    :value="item.value"
                    :key="index"
                    >{{ item.name }}</Option
                  >
                </Select>
              </div>
            </div>
          </div>
          <div class="conEcharts">
            <MeetEcharts :type="meetType" ref="refMeetEcharts"></MeetEcharts>
          </div>
        </div>
      </div>
    </div>
    <div class="HomeEquip">
      <div class="equipTop">
        <div class="hTitle f-row-b-c">
          <span class="hTitleTxt f-row-s-c">设备图表</span>
          <div class="filterBox">
            <div class="filterItem">
              <Select v-model="equipType" size="small" style="width: 88px">
                <Option
                  v-for="(item, index) in timeType"
                  :value="item.value"
                  :key="index"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
          </div>
        </div>
        <div class="equipEcharts">
          <EquipEcharts :type="equipType" ref="refEquipEcharts"></EquipEcharts>
        </div>
      </div>
      <div class="equipBottom">
        <div class="hTitle f-row-b-c">
          <span class="hTitleTxt f-row-s-c">今日会议</span>
        </div>
        <div class="todayCon">
          <!-- <Timeline>
            <TimelineItem>
              <p class="meetTime">下午 3:00</p>
              <p class="meetName">
                融合视频会议-20221027-1172-测试版本v1.42_beta会议
              </p>
            </TimelineItem>
            <TimelineItem>
              <p class="meetTime">下午 3:00</p>
              <p class="meetName">
                融合视频会议-20221027-1172-测试版本v1.42_beta会议
              </p>
            </TimelineItem>
            <TimelineItem>
              <p class="meetTime">下午 3:00</p>
              <p class="meetName">
                融合视频会议-20221027-1172-测试版本v1.42_beta会议
              </p>
            </TimelineItem>
            <TimelineItem>
              <p class="meetTime">下午 3:00</p>
              <p class="meetName">
                融合视频会议-20221027-1172-测试版本v1.42_beta会议
              </p>
            </TimelineItem>
            <TimelineItem>
              <p class="meetTime">下午 3:00</p>
              <p class="meetName">
                融合视频会议-20221027-1172-测试版本v1.42_beta会议
              </p>
            </TimelineItem>
          </Timeline> -->
          <div class="noDataCon f-col-s-c">
            <img src="@/assets/images/no_data.png" alt="" />
            <span>今天没有会议耶</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <h1>meet index</h1>
    <Button @click="loginOut">退出登录</Button> -->
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from "electron";
import useUserInfo from "./hooks/useUserInfo";
import { CountUp, Timeline, TimelineItem, Time } from "view-ui-plus";
import MeetEcharts from "./comps/meetEcharts.vue";
import EquipEcharts from "./comps/equipEcharts.vue";
const {
  isEdit,
  userInfo,
  totalData,
  numDuration,
  handleUpload,
  computedAvatarPath,
} = useUserInfo();

let staticPath = localStorage.getItem("staticPath");

const loginOut = () => {
  // on_login_out
  console.log("on_login_out");
  ipcRenderer.send("on_login_out");
};
// echarts ref
const refMeetEcharts = ref<InstanceType<typeof MeetEcharts>>();
const refEquipEcharts = ref<InstanceType<typeof EquipEcharts>>();
let meetType = ref<1 | 2 | 3>(1);
let equipType = ref<1 | 2 | 3>(1);
let timeType = [
  {
    name: "最近一周",
    value: 1,
    times: [],
  },
  {
    name: "最近一月",
    value: 2,
    times: [],
  },
  {
    name: "最近一年",
    value: 3,
    times: [],
  },
];
onMounted(() => {
  window.onresize = () => {
    refMeetEcharts.value?.onResize();
    refEquipEcharts.value?.onResize();
  };
});
</script>
<style scoped lang="less">
:deep(.HomeUser) {
  .userName .ivu-typography {
    color: @f_color_h3;
    font-size: 16px;
  }
  .deptName .ivu-typography {
    font-size: 14px;
    color: @fontColor;
  }
  .msgBox .msgItem {
    .ivu-count-up {
      font-size: 28px;
      color: @home_num_t;
    }
  }

  .history {
    .historyTxt {
      .ivu-typography {
        color: @home_num_t;
        font-size: 16px;
      }
    }
  }
}
:deep(.HomeMeet) {
  .totalBox {
    .ivu-count-up {
      font-size: 30px;
      color: @home_num_t;
    }
  }
}
:deep(.ivu-select-selection) {
  color: @fontColor;
  border: none;
}
:deep(.ivu-select-visible .ivu-select-selection) {
  box-shadow: none;
}
:deep(.circleCon) {
  .ivu-count-up {
    font-size: 30px;
    color: @home_num_t;
  }
}
.Home {
  .size(100%,100%);
  .hTitle {
    .size(100%, 50px);
    padding-right: 20px;
    box-sizing: border-box;
    .hTitleTxt {
      .size(120px, 40px);
      font-weight: bold;
      font-size: 14px;
      color: @fontColor;
      padding-left: 20px;
      box-sizing: border-box;
      // background-color: @f_color_active;
      border-radius: 0% 20px 20px 0%;
    }
  }
  .HomeUser {
    .size(27%,100%);
    flex-shrink: 0;
    box-sizing: border-box;
    background-color: @home_user_bg;
    .topTip {
      .size(100%,40px);
      background: @home_tip;
      padding: 0 20px;
      box-sizing: border-box;
      .con {
        .size(100%,100%);
        overflow: hidden;
        .conTip {
          white-space: nowrap;
          width: max-content;
          font-size: 14px;
          color: @f_color_h3;
          animation: roll 18s infinite linear;
        }
      }
    }
    .userInfo {
      .size(100%,324px);
      padding: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid @home_b_color;
      .optBox {
        .size(100%, 40px);
        // background: pink;
        // margin-bottom: 10px;
        .optItem {
          padding: 6px;
          cursor: pointer;
          /* &:hover {
            background-color: @search_bottom_border;
          } */
          span {
            margin-left: 4px;
            font-size: 14px;
            color: @f_color_h3;
            border: 1px solid @fontColor;
          }
        }
        .optItem.optLeft {
          border-radius: 50%;
          border: 1px solid @fontColor;
        }
      }
      .userAvatar {
        .size(100%,80px);
        margin-bottom: 10px;
        .avatar {
          .size(80px, 80px);
          border-radius: 50%;
          position: relative;
          &:hover {
            .avaHover {
              display: block;
            }
          }
          img {
            .size(100%, 100%);
            border-radius: 50%;
          }
          .infoAva {
            .size(100%, 100%);
            border-radius: 50%;
            background-color: @f_color_active;
            span {
              font-size: 18px;
              color: @bg;
            }
          }
          .avaHover {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            cursor: pointer;
            .size(100%, 100%);
            border-radius: 6px;
            overflow: hidden;
            background-color: rgba(0, 0, 0, 0.4);
            .uploadAvatar {
              .size(74px, 74px);
            }
          }
          .genderBox {
            position: absolute;
            bottom: -4px;
            right: -4px;
            background: @bg;
            padding: 2px;
            border-radius: 20px;
            border: 1px solid @search_bottom_border;
            cursor: pointer;
            span.noGender {
              display: inline-block;
              font-size: 12px;
              width: 30px;
              text-align: center;
              color: @fontColor;
            }
            .iconEditGender {
              margin-left: 10px;
            }
          }
        }
      }
      .userName {
        .size(100%,30px);
      }
      .deptName {
        .size(100%,20px);
      }
      .msgBox {
        .size(100%,80px);
        margin-top: 20px;
        margin-bottom: 20px;
        .msgItem {
          .size(50%,100%);
          border-right: 1px solid @search_bottom_border;
          &:last-child {
            border-right: none;
          }
          .msgItemTitle {
            font-size: 14px;
            color: @fontColor;
          }
        }
      }
    }
    .history {
      .size(100%, calc(100% - 374px));
      margin-top: 10px;

      .historyBox {
        .size(100%, calc(100% - 50px));
        overflow: auto;
        .historyItem {
          .size(100%, 50px);
          padding: 0 20px;
          box-sizing: border-box;
          cursor: pointer;
          // border-bottom: 1px solid @search_bottom_border;
          .historyTxt {
            .size(100%, auto);
            font-size: 16px;
            .optIcon {
              flex-shrink: 0;
              margin-right: 10px;
            }
          }
          .historyProgress {
            .size(auto,auto);
            flex-shrink: 0;
            margin-left: 10px;
            font-size: 14px;
            color: @fontColor;
            span {
              color: @f_color_active;
            }
          }
        }
      }
    }
  }
  .HomeMeet {
    .size(46%,100%);
    padding: 0px 50px;
    box-sizing: border-box;
    border-right: 1px solid @home_b_color;
    .HomeMeetBox {
      .size(100%,100%);
      .hTitle {
        padding: 0px;
        span {
          padding: 0px;
        }
      }
      .totalBox {
        .size(100%, 80px);
        margin-bottom: 20px;
        .totalItem {
          .totalItemTop {
            .optIcon {
              margin-right: 10px;
            }
          }
          .labelTitle {
            font-size: 12px;
            color: @fontColor;
          }
        }
      }
      .circleBox {
        .size(100%,180px);
        padding-bottom: 30px;
        border-bottom: 1px solid @home_b_color;
        box-sizing: border-box;
        .circleItem {
          .size(100px,auto);
          .circleLabel {
            font-size: 14px;
            margin-top: 4px;
            color: @fontColor;
          }
        }
      }
      .chartBox {
        .size(100%,calc(100% - 370px));
        margin-top: 30px;

        .hTitle {
          padding: 0px;
          span {
            padding: 0px;
          }
        }
        .conEcharts {
          .size(100%, calc(100% - 50px));
        }
      }
    }
  }
  .HomeEquip {
    .size(27%,100%);
    flex-shrink: 0;
    .equipTop {
      .size(100%,45%);
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom: 1px solid @home_b_color;
      .hTitle {
        padding: 0px;
        span {
          padding: 0px;
        }
      }
      .equipEcharts {
        .size(100%, calc(100% - 50px));
        padding-bottom: 20px;
        box-sizing: border-box;
      }
    }
    .equipBottom {
      .size(100%,55%);
      padding: 20px 20px 0px;
      box-sizing: border-box;
      .hTitle {
        padding: 0px;
        margin-bottom: 10px;
        span {
          padding: 0px;
        }
      }
      .todayCon {
        .size(100%,calc(100% - 60px));
        overflow: auto;
        .meetTime {
          font-size: 14px;
          color: @f_color_active;
        }
        .meetName {
          font-size: 14px;
          color: @fontColor;
        }
      }
    }
  }
  .optMenuItem {
    .optIcon {
      margin-right: 14px;
    }
    span {
      font-size: 14px;
      color: @f_color_h3;
    }
  }
  .noDataCon {
    .size(auto,auto);
    img {
      .size(200px,200px);
      margin-top: 10px;
      margin-bottom: 10px;
    }
    span {
      font-size: 14px;
      color: @fontColor;
    }
  }
}
@keyframes roll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}
/* @media screen and (min-width: 1500px) {
  .Home .HomeUser {
    width: 500px;
  }
  .Home .HomeEquip {
    width: 500px;
  }
} */
</style>
