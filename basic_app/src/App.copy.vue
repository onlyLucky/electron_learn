<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup ./components/HelloWorld.vue
import { ipcRenderer } from "electron";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const addWindows = async () => {
  const result = await ipcRenderer.invoke("open-win");
  console.log(result);
};
const sharkFlag = ref<boolean>(false);
const handleSharkChange = () => {
  sharkFlag.value = !sharkFlag.value;
  ipcRenderer.send("icon_shake", sharkFlag.value);
};

const { locale } = useI18n();

const changeLang = (lang: string) => {
  locale.value = lang;
  localStorage.setItem("lang", lang); // 重要！下面遇到问题里解释
};
</script>

<template>
  <div class="logo-box">
    <img class="logo vite" src="./assets/vite.svg" />
    <img class="logo electron" src="./assets/electron.svg" />
    <img class="logo vue" src="./assets/vue.svg" />
  </div>
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite hello world" /> -->
  <div class="optBox">
    <button @click="addWindows">新增一个窗口</button>
    <button v-show="!sharkFlag" @click="handleSharkChange">图标闪动</button>
    <button v-show="sharkFlag" @click="handleSharkChange">取消闪动</button>
  </div>
  <div class="static-public">
    Place static files into the <code>/public</code> folder
    <img style="width: 77px" :src="'./node.png'" />
  </div>

  <Button>Default</Button>
  <Input placeholder="Enter something..." style="width: 300px" />
  <div class="menu">
    <Button class="menu-item" @click="changeLang('en-US')">English</Button>
    <Button class="menu-item" @click="changeLang('zh-CN')">中文</Button>
  </div>
  <div v-t="'home'"></div>
  <Tag>标签一</Tag>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.vite:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.optBox button {
  margin-right: 10px;
}
</style>
