<!--
 * @Author: fg
 * @Date: 2022-12-16 17:43:05
 * @LastEditors: fg
 * @LastEditTime: 2023-04-26 13:38:59
 * @Description: content
-->
<template>
  <div class="login">
    <div class="f-row-e-c loginHeader">
      <SystemOpt :isShowChangeSize="isShowChangeSize"></SystemOpt>
    </div>
    <div class="loginContent f-row-b">
      <div class="loginLeft">
        <img class="logo" src="@/assets/images/login/logo.png" alt="" />
        <h3>{{ t("login.h1_title") }}</h3>
        <img class="imgCon" src="@/assets/images/login/login_img.png" alt="" />
      </div>
      <div class="loginLine"></div>
      <div class="loginRight">
        <div class="rHeader">
          <h1>{{ t("login.h3_title") }}</h1>
        </div>
        <div class="loginItem">
          <div class="labelTitle f-row-s-c">
            <img src="@/assets/icons/login/icon_username.png" alt="" />
            <span>{{ t("login.username_t") }}</span>
          </div>
          <Input
            :placeholder="t('login.user_placeholder')"
            v-model="userName"
            clearable
          ></Input>
        </div>
        <div class="loginItem">
          <div class="labelTitle f-row-b-c">
            <div class="f-row-s-c">
              <img src="@/assets/icons/login/icon_pwa.png" alt="" />
              <span>{{ t("login.password_t") }}</span>
            </div>
            <div class="rightBox f-row-c-c" v-debounce="changePasFlag">
              <Icon
                v-show="!pasFlag"
                size="16"
                type="md-eye-off"
                color="var(--fontColor)"
              />
              <Icon
                v-show="pasFlag"
                size="16"
                type="md-eye"
                color="var(--fontColor)"
              />
            </div>
          </div>
          <!-- :placeholder="请输入密码" -->
          <Input
            :placeholder="t('login.psw_placeholder')"
            :type="pasFlag ? 'password' : 'text'"
            v-model="password"
            clearable
          ></Input>
        </div>
        <div class="remember rememberMe f-row-s-c" v-show="isRememberMe">
          <img
            @click="isRememberMe = !isRememberMe"
            src="@/assets/icons/login/icon_rememberme.png"
            alt=""
          />
          <span>{{ t("login.remember") }}</span>
        </div>
        <div class="remember noRememberMe f-row-s-c" v-show="!isRememberMe">
          <img
            @click="isRememberMe = !isRememberMe"
            src="@/assets/icons/login/icon_unselector.png"
            alt=""
          />
          <span>{{ t("login.remember") }}</span>
        </div>
        <!--  @click="loginTo" -->
        <div class="loginBtn f-row-c-c" v-debounce="loginTo">
          {{ t("login.name") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SystemOpt from "@/commons/system_opt/index";
import { onMounted, ref } from "vue";
// import { goLogin, getFileIp } from "@/apis/login";
import { ipcRenderer } from "electron";
import { useI18n } from "vue-i18n";
import { Message } from "view-ui-plus";
import { useRouter } from "vue-router";
import { anyTypeAnnotation } from "@babel/types";

let goLogin: Function;
let getFileIp: Function;
ipcRenderer.send("get_app");
ipcRenderer.on("set_url", (e, url, lang) => {
  localStorage.setItem("app_url", url);
  // Config.json 读取的地址找不到， 项目进入先运行App.vue => main.ts
  import("@/apis/login").then((res) => {
    goLogin = res.goLogin;
    getFileIp = res.getFileIp;
  });
});

console.log("login.vue");
const { t } = useI18n();

const isShowChangeSize = false;
const isRememberMe = ref<boolean>(true);

const userName = ref<string>("");
const password = ref<string>("");
let pasFlag = ref<boolean>(true);

const router = useRouter();

type RmeType = {
  isRememberMe: boolean;
  userName?: string;
  password?: string;
};

const changePasFlag = () => {
  pasFlag.value = !pasFlag.value;
};

const loginTo = async () => {
  // localStorage.setItem("token", "test")
  // ipcRenderer.send("on_login", "test");

  if (userName.value == "" || password.value == "") {
    Message.error("请补全用户名或密码");
    return false;
  }
  goLogin({
    userName: userName.value,
    password: password.value,
  })
    .then((res: any) => {
      let userInfo = {
        avatarPath: res.data?.avatarPath,
        deptName: res.data?.deptName,
        nickname: res.data?.nickname,
        phone: res.data?.phone,
        id: res.data?.id,
        deptId: res.data?.deptId,
        userName: res.data?.userName,
        mobileType: res.data?.mobileType,
        userSex: res.data?.userSex,
      };
      localStorage.setItem("token", res.data!.token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // 判断当前是否记住我
      let tempRme: RmeType = {
        isRememberMe: isRememberMe.value,
      };
      if (isRememberMe.value) {
        tempRme.userName = userName.value;
        tempRme.password = password.value;
      }
      getFileIp({}).then((res: any) => {
        localStorage.setItem("staticPath", res.data);
      });
      localStorage.setItem("remember", JSON.stringify(tempRme));
      ipcRenderer.send("on_login");
    })
    .catch((err: any) => {});
};

onMounted(() => {
  if (localStorage.getItem("remember")) {
    const tempRem: RmeType = JSON.parse(localStorage.getItem("remember")!);
    isRememberMe.value = tempRem.isRememberMe;
    // 空值合并，可选链的写法
    userName.value = tempRem.userName ?? "";
    password.value = tempRem.password || "";
  }
  document.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      loginTo();
    }
  });
});
</script>
<style scoped lang="less">
:deep(.ivu-input) {
  height: 40px;
  .fontSizePx2Em(16);
}
:deep(.ivu-input-wrapper) {
  display: flex;
  align-items: center;
}
.login {
  .size(100%,100%);
  border-radius: 4px;
  // box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.302);
  -webkit-app-region: drag;
  user-select: none;
  background-color: @bg;
  .loginHeader {
    padding: 0 15px;
    box-sizing: border-box;
  }
  .loginContent {
    width: 100%;
    height: calc(100% - 40px);
    padding: 0 48px 0 40px;
    box-sizing: border-box;
    .loginLeft {
      .logo {
        width: 99px;
        height: auto;
        margin-bottom: 8px;
      }
      h3 {
        .fontSizePx2Em(16);
        color: @f_color_h3;
        margin-bottom: 8px;
      }
      .imgCon {
        width: 200px;
        height: auto;
        margin-left: 27px;
      }
    }
    .loginLine {
      width: 1px;
      height: 307px;
      margin-top: 50px;
      background: linear-gradient(
        180deg,
        rgba(39, 106, 245, 0) 0%,
        #286bf6 49%,
        rgba(39, 106, 245, 0) 100%
      );
      opacity: 0.2;
    }
    .loginRight {
      width: 280px;
      height: auto;
      -webkit-app-region: no-drag;
      .rHeader {
        .fontSizePx2Em(20);
        color: @f_color_h3;
        font-weight: 500;
        margin-bottom: 30px;
        position: relative;
        &::after {
          content: "";
          display: block;
          position: absolute;
          bottom: -4px;
          left: -6px;
          width: 80px;
          height: 20px;
          background: linear-gradient(
            45deg,
            #0096ff 0%,
            rgba(0, 150, 255, 0) 100%
          );
          opacity: 0.2;
        }
      }
      .loginItem {
        margin-bottom: 25px;
        .labelTitle {
          margin-bottom: 10px;
          img {
            .size(20px, 20px);
            margin-right: 10px;
          }
          span {
            .fontSizePx2Em(16);
            color: @f_color_h3;
            font-weight: 400;
            line-height: 20px;
          }
          .rightBox {
            .size(40px,40px);
            cursor: pointer;
          }
        }
        &:last-child {
          margin-bottom: 16px;
        }
      }
      .remember {
        margin-bottom: 40px;
        img {
          .size(20px,20px);
          margin-right: 8px;
        }
        span {
          .fontSizePx2Em(14);
          color: @fontColor;
          line-height: 20px;
        }
      }
      .rememberMe span {
        color: @f_color_active;
      }
      .loginBtn {
        width: 100%;
        height: 42px;
        border-radius: 21px;
        background-color: @f_color_active;
        color: @bg;
        .fontSizePx2Em(16);
        font-weight: 500;
        cursor: pointer;
      }
    }
  }
}
</style>
