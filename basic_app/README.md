<div align="center">
  <h1>electron-vite-vue</h1>
  <p>🥳 Really simple `Electron` + `Vue` + `Vite` boilerplate.</p>
</div>

## 目录

- [目录](#目录)
- [Features](#features)
- [Quick Start](#quick-start)
- [Debug](#debug)
- [Directory](#directory)
- [FAQ](#faq)
  - [开发中遇到的问题](#开发中遇到的问题)
    - [Q1. Electron failed to install correctly, please delete node\_modules/electron and try installing again](#q1-electron-failed-to-install-correctly-please-delete-node_moduleselectron-and-try-installing-again)
    - [Q2. tsx 写法引用样式文件没有样式隔离，可以使用 vite 内部的 css module css-in-js 的解决方法](#q2-tsx-写法引用样式文件没有样式隔离可以使用-vite-内部的-css-module-css-in-js-的解决方法)
    - [Q3: electron 顶部允许拖动，hover 等 css 样式效果失效](#q3-electron-顶部允许拖动hover-等-css-样式效果失效)
    - [Q4: \[tsx\]的写法对于目前的问题总结，或许是自己未找到解决的方案或配置（后面使用 react 的格式会进行解决）](#q4-tsx的写法对于目前的问题总结或许是自己未找到解决的方案或配置后面使用-react-的格式会进行解决)
    - [Q5: document.getElementById("app").className = "test" 编译器报错](#q5-documentgetelementbyidappclassname--test-编译器报错)
    - [Q6: \[@vue/compiler-sfc\] the ＞＞＞ and /deep/ combinators have been deprecated. Use :deep() instead.](#q6-vuecompiler-sfc-the--and-deep-combinators-have-been-deprecated-use-deep-instead)
    - [Q7: 安装 electron 项目的时候，在下载包的时候报错](#q7-安装-electron-项目的时候在下载包的时候报错)
    - [Q8：vue3 项目中 less 函数无法全局使用，如何解决？](#q8vue3-项目中-less-函数无法全局使用如何解决)
    - [Q9: vue 项目 electron 打包后多个窗口为为其他路由](#q9-vue-项目-electron-打包后多个窗口为为其他路由)
    - [Q10: iconfont 图标 symbol 引用方式，有的图标不能通过设置 color 样式来修改颜色的解决办法](#q10-iconfont-图标-symbol-引用方式有的图标不能通过设置-color-样式来修改颜色的解决办法)
  - [vue3 的问题](#vue3-的问题)
    - [Q1 vue3 reactive 对象数组重置，dom 不更新问题](#q1-vue3-reactive-对象数组重置dom-不更新问题)
    - [Q2: vue setup props 中 withDefaults 设置默认值的时候如果为复合对象类型，报错处理](#q2-vue-setup-props-中-withdefaults-设置默认值的时候如果为复合对象类型报错处理)
  - [TS 问题](#ts-问题)
    - [Q1: ts 中引入 js 文件未找到，怎么解决](#q1-ts-中引入-js-文件未找到怎么解决)
    - [Q2: tsconfig.json 文件报错 JSON schema for the TypeScript compiler‘s configuration file](#q2-tsconfigjson-文件报错-json-schema-for-the-typescript-compilers-configuration-file)
    - [Q3: ts 忽略报错](#q3-ts-忽略报错)
  - [报错处理](#报错处理)
    - [E1: 控制台： \[Violation\] Added non-passive event listener to a scroll-blocking 'mousewheel' event](#e1-控制台-violation-added-non-passive-event-listener-to-a-scroll-blocking-mousewheel-event)
- [配置](#配置)
  - [托盘部分](#托盘部分)
  - [通信](#通信)
  - [路径别名](#路径别名)
  - [UI 框架引入](#ui-框架引入)
  - [国际化配置](#国际化配置)
  - [rem 适配](#rem-适配)
  - [iconfont 引入(未尝试)](#iconfont-引入未尝试)
  - [自定义顶部菜单栏开关等](#自定义顶部菜单栏开关等)
  - [vite vue3 主题切换功能配置](#vite-vue3-主题切换功能配置)
  - [vue3 自定义指令尝试](#vue3-自定义指令尝试)
  - [Vue3 自动引入插件](#vue3-自动引入插件)
  - [electron 底部工具栏预览窗口标题配置](#electron-底部工具栏预览窗口标题配置)
  - [electron 创建全局快捷键配置](#electron-创建全局快捷键配置)
  - [electron 调用打开第三方 exe 应用配置](#electron-调用打开第三方-exe-应用配置)
- [技术点总结](#技术点总结)
  - [T1: vue3 使用 render 函数 h](#t1-vue3-使用-render-函数-h)
- [提交规范](#提交规范)
- [参考链接](#参考链接)

## Features

📦 Out of the box  
🎯 Based on the official [template-vue-ts](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-vue-ts), less invasive  
🌱 Extensible, really simple directory structure  
💪 Support using Node.js API in Electron-Renderer  
🔩 Support C/C++ native addons  
🖥 It's easy to implement multiple windows

## Quick Start

```sh
npm create electron-vite
```

<!-- [![quick-start](https://asciinema.org/a/483731.svg)](https://asciinema.org/a/483731) -->

![electron-vite-vue.gif](https://github.com/electron-vite/electron-vite-vue/blob/main/public/electron-vite-vue.gif?raw=true)

## Debug

![electron-vite-react-debug.gif](https://github.com/electron-vite/electron-vite-react/blob/main/public/electron-vite-react-debug.gif?raw=true)

## Directory

```diff
+ ├─┬ electron
+ │ ├─┬ main
+ │ │ └── index.ts    entry of Electron-Main
+ │ └─┬ preload
+ │   └── index.ts    entry of Preload-Scripts
  ├─┬ src
  │ └── main.ts       entry of Electron-Renderer
  ├── index.html
  ├── package.json
  └── vite.config.ts
```

## FAQ

1. 第一次进行 electron 进行打包，需要下载几个包，而这个包的链接在 github 上，所以下载很慢

下面是解决问题的参考链接

[解决 electron 下载慢的问题](https://zhuanlan.zhihu.com/p/110448415)

[解决 electron 打包慢，卡](http://www.javashuo.com/article/p-szqueuwb-cx.html)

[淘宝镜像 electron 多版本包](https://registry.npmmirror.com/binary.html?path=electron/)

最大的是 electron 版本包，其他的都比较小

1. 打包之后点击 exe 文件，项目页面是空白的。是因为 前端代码没有注入 dist\win-unpacked\resources\app.asar\ asar 为特殊的压缩类型
   Not allowed to load local resource: file://D:\coder\@running\electron_learn\basic_app\dist\win-unpacked\resources\app.asar\build\index.html

[参考链接](https://blog.csdn.net/weixin_42826294/article/details/113595030)

3. [Electron 打包优化](https://cloud.tencent.com/developer/article/1547891)

### 开发中遇到的问题

#### Q1. [Electron failed to install correctly, please delete node_modules/electron and try installing again](https://blog.csdn.net/qq_42789068/article/details/106401830)

#### Q2. tsx 写法引用样式文件没有样式隔离，可以使用 vite 内部的 css module css-in-js 的解决方法

```tsx
// index.tsx
import { ref } from "vue";
import style from "./style.module.less";

type Props = {
  isShowChangeSize: boolean;
};

console.log(style, "style");

const SystemOpt = (props: Props) => {
  return (
    <div class={style.tss}>
      123
      <p>SystemOpt</p>
    </div>
  );
};

export default SystemOpt;
```

```less
// style.module.less
.tss {
  color: pink;
  p {
    color: lightblue;
  }
}
```

#### Q3: electron 顶部允许拖动，hover 等 css 样式效果失效

解决方法是在点击 hover 的 dom 添加 不允许拖拽

```less
-webkit-app-region: no-drag;
```

#### Q4: [tsx]的写法对于目前的问题总结，或许是自己未找到解决的方案或配置（后面使用 react 的格式会进行解决）

- class 的绑定如果是多个怎么办
- 外部引用的 less class 怎么调用
- 样式隔离虽然有解决方案，但是感觉好麻烦
- 多种其他事件绑定，冒泡处理，事件监听等，好麻烦
- 引用外部图片资源对路径别名的处理会找不到，只能使用 import 的形式去引入。

#### Q5: document.getElementById("app").className = "test" 编译器报错

!非 null 断言操作符，可以使用（document.getElementById("app")可能为空）

```ts
document.getElementById("app")!.className = "test";
```

#### Q6: [@vue/compiler-sfc] the ＞＞＞ and /deep/ combinators have been deprecated. Use :deep() instead.

使用原本的样式穿透写法会报 warning

原本的写法，也能实现

```less
/deep/ .ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 14px;
}
```

更改后的

```less
:deep(.ivu-menu-vertical .ivu-menu-submenu-title) {
  padding: 14px;
}
```

#### Q7: 安装 electron 项目的时候，在下载包的时候报错

错误 1：socket hang up

```txt
error D:\coder\@running\electron_learn\basic_app\node_modules\electron: Command failed.
Exit code: 1
Command: node install.js
Arguments:
Directory: D:\coder\@running\electron_learn\basic_app\node_modules\electron
Output:
RequestError: socket hang up
...
...

```

错误 2： Client network socket disconnected before secure TLS connection was established

```txt
error D:\coder\@running\electron_learn\basic_app\node_modules\electron: Command failed.
Exit code: 1
Command: node install.js
Arguments:
Directory: D:\coder\@running\electron_learn\basic_app\node_modules\electron
Output:
RequestError: Client network socket disconnected before secure TLS connection was established
...
...

```

错误 3： connect ETIMEDOUT 20.205.243.166:443

```txt
error D:\coder\@running\electron_learn\basic_app\node_modules\electron: Command failed.
Exit code: 1
Command: node install.js
Arguments:
Directory: D:\coder\@running\electron_learn\basic_app\node_modules\electron
Output:
RequestError: connect ETIMEDOUT 20.205.243.166:443
...
...

```

大概率是镜像问题，通过设置 electron 代理解决,终端执行下面的代码

```shell
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
```

yarn 的话可以使用

```shell
yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/
```

[解决安装 electron 卡在 node install.js 不动问题](https://www.jianshu.com/p/28a0305ac187)

#### Q8：vue3 项目中 less 函数无法全局使用，如何解决？

之前配置过全局的变量文件`variables.less`,将 less 函数文件引入进入`variables.less`中，可以全局使用

```less
// 主题函数
@import "./theme.less";
// 全局less函数处理
@import "./global.less";

// 默认主题
.theme_basic {
  .theme_basic();
}
```

#### Q9: vue 项目 electron 打包后多个窗口为为其他路由

首先默认情况下这里有个一个误区，就是默认路由为 history，开发环境中的路径配置是可以完全 OK 的，但是在打包的时候，官方要求用 hash 模式。

- 首先我们要将路由模式更改为 hash 模式（vue-router4x 为主）

```ts
// router/index.ts
const router = createRouter({
  routes,
  // 这里需要将createWebHistory更改为createWebHashHistory
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
});
```

- 之后能够加载到文件，但是发生了上面 FAQ 中的第一个问题，尝试了一下以下的配置，解决

```ts
// electron/main/index.ts
new BrowserWindow({
  width: 710,
  height: 426,
  resizable: false,
  title: "login",
  icon: join(process.env.PUBLIC, "logo.ico"),
  webPreferences: {
    preload,
    nodeIntegration: true,
    contextIsolation: false,
    // 所有窗口添加这个配置
    webSecurity: false,
  },
  // 去掉最顶部的导航，以及最大化、最小化、关闭按钮
  frame: false,
});
```

- 最后根据下面的链接配置跳转文件转地址链接(下面代码摘抄自官网)

```js
const url = require("url").format({
  protocol: "file",
  slashes: true,
  pathname: require("path").join(__dirname, "index.html"),
});

win.loadURL(url);
```

[electron 官网 win.loadURL(url[, options])](https://www.electronjs.org/zh/docs/latest/api/browser-window#winloadurlurl-options)

#### Q10: iconfont 图标 symbol 引用方式，有的图标不能通过设置 color 样式来修改颜色的解决办法

原因：

> 当从阿里图库中图标被添加至项目，如果编辑过项目图标的颜色或者图标本身是有颜色的，那么在通过 symbol 获取图标时会在 svg 的 path 中增加 fill 属性，导致无法更改颜色，如果需要动态修改颜色，需要从新添加该图标(本身图标无色)，获取在 symbol 的 js 文件中程序删除 fill 属性。

解决方法：

下载 Js 文件后，用编译器打开，然后用正则表达式查找：fill="#......" ，替换为""。

### vue3 的问题

#### Q1 vue3 reactive 对象数组重置，dom 不更新问题

```ts
// 数组，处理方案1 push
let tempArr1 = reactive<number[]>([]);
let arr = [1, 2, 3, 0, 0, 0];
tempArr1.push(...arr);

// 处理方案2 包裹一个属性
type TempArr = {
  list?: Array<number>;
};
let tempArr2 = reactive<TempArr>({
  list: [],
});
tempArr2.list = [1, 2, 3, 4, 5, 6];

// 对象类型处理
let searchForm = reactive<SearchType>({
  name: "",
  dataValue: [],
  deviceId: "",
});

let temp = {
  name: "",
  dataValue: [],
  deviceId: "",
};
Object.assign(searchForm, temp);
```

#### Q2: vue setup props 中 withDefaults 设置默认值的时候如果为复合对象类型，报错处理

可以将属性对象赋值为一个函数，return 对象默认值

```ts
interface Props {
  either: "必传且限定" | "其中一个" | "值"; // 利用TS：限定父组件传 either 的值
  child: string | number;
  sda?: string; // 未设置默认值，为 undefined
  strData: string;
  msg?: string;
  labels?: string[];
  obj?: { a: number };
}
const props = withDefaults(defineProps<Props>(), {
  msg: "hello",
  labels: () => ["one", "two"],
  obj: () => {
    return { a: 2 };
  },
});
```

### TS 问题

#### Q1: ts 中引入 js 文件未找到，怎么解决

- `const xx:any = require('package')` 当 js 来写，弹警告就屏蔽警告
- 或者自己写声明文件 xxx.d.ts（仅限目标模块是自己写的情况，xxx 必须和目标文件同名）

#### Q2: tsconfig.json 文件报错 JSON schema for the TypeScript compiler‘s configuration file

> 在 tsconfig.json 文件的配置中添加配置保存以后问题就解决了

```json
"compilerOptions": {
	"outDir":"./",
}
```

[参考链接](https://blog.csdn.net/H1519223775/article/details/126846569)

#### Q3: ts 忽略报错

在报错的代码上面添加下面的注释

```ts
// @ts-ignore
title: i18n.global.t('login.name'),
```

这是我是再 main process 中配置国际化，遇到了一个报错`类型实例化过深，且可能无限。ts(2589)`,外部的对象无法处理,不影响代码运行

### 报错处理

#### E1: [控制台： [Violation] Added non-passive event listener to a scroll-blocking 'mousewheel' event](https://blog.csdn.net/weixin_34403976/article/details/102900928)

Chrome51 版本以后，Chrome 增加了新的事件捕获机制－Passive Event Listeners；

解决方案：

1. npm i default-passive-events -S
2. main.js 中加入

```ts
import "default-passive-events";
```

## 配置

### 托盘部分

- 托盘右击菜单的 icon 的大小尺寸规范： 20 \* 20 左右
- 托盘资源地址默认引用的是项目根目录,如下

```ts
let icon_space = nativeImage.createFromPath("resources/logo_space.png");
let icon_active = nativeImage.createFromPath("resources/logo_active.png");
```

### 通信

vue 项目中不需要预加载的时候向渲染层页面 window 环境中暴露 electron 调用对象

1. 主程序进行监听

```javascript
// 主程序监听窗口改变数据传过来的数据
ipcMain.on("num_change", (event, arg) => {
  console.log(arg, "num_change");
  // 这里是便利所有窗口发送num_change的时间
  BrowserWindow.getAllWindows().forEach((v) => {
    v.send("num_change", arg);
  });
  // 这里监听到之后发送给渲染层数据
  event.sender.send("num_change_suc", arg);
});
```

2. 主程序发送通讯

```javascript
const { app, BrowserWindow } = require("electron");
let win = null;

app.whenReady().then(() => {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.on("did-finish-load", () => {
    win.webContents.send("ping", "whoooooooh!");
  });
});
```

3. 渲染页面发送监听的实践

```ts
// HelloWorld.vue
<script setup lang="ts">
import { ref } from "vue";
// const electron = require("electron");
import { ipcRenderer } from "electron";

defineProps<{ msg: string }>();

const count = ref(0);

const add = () => {
  count.value++;
  ipcRenderer.send("num_change", count.value);
};

//获取主进程返回的数据
ipcRenderer.on("num_change", (e, data) => {
  count.value = data;
  console.log(data, "data");
});
</script>
```

4. 双向通信

下面是主程序进行创建新子窗口

```ts
ipcMain.handle("open-win", (event, arg) => {
  console.log("new win ++");
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
```

```ts
const addWindows = async () => {
  const result = await ipcRenderer.invoke("open-win");
  console.log(result);
};
```

### 路径别名

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // ...
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 设置@指向src
      _c: path.resolve(__dirname, "src/components"),
      _v: path.resolve(__dirname, "src/views"),
    },
  },
  //...
});
```

修改 tsconfig.json，输入@/ 之后就会有补充提示了

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"],
      "_c/*": ["./src/components/*"],
      "_v/*": ["./src/views/*"]
    }
  }
  // ...
}
```

后面在页面中引入试一下就可以了。

### UI 框架引入

[view-ui-plus](http://v4.iviewui.com/docs/guide/start)

### 国际化配置

vue3 i18n 在 ts/js 文件中使用

```ts
// 这里在主程序中使用的话，需要在tsconfig.node.json 中 include 里面添加 './src/locale/index.ts' 去除路径报错
import i18n from "../../src/locale/index"
...
// @ts-ignore
title: i18n.global.t('login.name'),
```

[UI 框架国际化](https://www.iviewui.com/view-ui-plus/guide/i18n)

[vue3 vue-i18n](https://blog.csdn.net/laishaojiang/article/details/124634764)

具体参考`src/locale`文件下面的配置

### rem 适配

[Vue3+Vite 利用 postcss-pxtorem 移动端适配](https://blog.csdn.net/m0_54089303/article/details/128100595)

TODO: 这里貌似不需要适配像素，直接检测设备的像素比进行缩放展示

[electron-vue 打包后样式变大以及不同分辨率屏幕适配问题](https://blog.csdn.net/Zx_SSSS/article/details/82286503)

### iconfont 引入(未尝试)

[Vue3 + Vite + TS 项目引入 iconfont 图标](https://developer.aliyun.com/article/975701)

### 自定义顶部菜单栏开关等

[Electron 中自定义窗口导航条](https://blog.csdn.net/weixin_40629244/article/details/116332270)

### vite vue3 主题切换功能配置

[vue3+vite+less 实现简单换肤](https://juejin.cn/post/7032175248355115015)

实现的原理：主要通过切换 class 改变全局变量，实现更换变量

1. 实现主题函数的编写
2. 全局变量文件,将变量文件导入 main.ts 中。
3. vite 配置全局变量
4. 通过修改#app 的 class 修改全局变量

详细内容参考 `theme.less` `variables.less` `vite.config.less`

### vue3 自定义指令尝试

下面以一个防抖的指令配置，vue3 自定义指令的生命周期函数，传参不再进行介绍(原本的想法是为了统一一个地方进行处理点击等操作的防抖，每个地方都写太多太乱了 --- 重复的问题，我们需要找出统一的解决方法来处理)（vueRequest 优缺点）

```ts
// v-debounce.ts
import _ from "lodash";

import { App, Directive, DirectiveBinding } from "vue";

const vDebounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.addEventListener(
      "click",
      _.debounce(function () {
        binding.value();
      }, 300)
    );
  },
};

// 定义的名称为debounce 使用方式为v-debounce
export default (app: App<Element>) => {
  app.directive("debounce", vDebounce);
};
```

在 main.ts 中进行引入 使用 app.use(vDebounce) 使用，项目中我使用了一个 index.ts 文件将所有的自定义指令引入

```ts
import { vDebounce } from "./directive/index"
...
app.use(vDebounce)
```

在 vue 页面中使用`v-debounce="loginTo"` 进行调用，推荐一个 js 的库，lodash,不错的函数拓展工具库

### Vue3 自动引入插件

需要安装插件 `unplugin-auto-import` -D

文件配置如下

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import DefineOptions from 'unplugin-vue-define-options/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    DefineOptions(),
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue'],
      dts: "src/auto-import.d.ts"
    })
  ],
  ...
})
```

配置完成之后使用 ref reactive watch 等 无须 import 导入 可以直接使用

### electron 底部工具栏预览窗口标题配置

在官方 API 文档中`BrowserWindow`,`new BrowserWindow([options])`options 的 title 说明中

> title string(可选) - 默认窗口标题 默认为"Electron"。 如果由 loadURL()加载的 HTML 文件中含有标签`<title>`，此属性将被忽略。

所以去除过 html 中的 title 标签，新建窗口对象中添加 title 的配置

- [x] ~~TODO: 底部预览窗口标题国际化~~

### electron 创建全局快捷键配置

- [ ] TODO: 创建全局快捷键配置

[vue+electron 快捷键设置](https://juejin.cn/post/7139137295214444551)

### electron 调用打开第三方 exe 应用配置

- [ ] TODO: 调用打开第三方 exe 应用配置

## 技术点总结

### T1: vue3 使用 render 函数 h

这个是我在配置`view-ui-plus` Table 组件的时候遇到的，顺便做了个总结，后续的话会增加补充

下面是简单的函数结构，以`view-ui-plus`UI 框架为例设置

```ts
render: (h: any, params: any) => {
  return h(
    "div", //html 标签

    {
      //这里可以为html标签上面的属性值
      style: {
        //样式遇到中间有-的，下面两种都可，驼峰也即可
        color: "pink",
        backgroundColor: "pink",
        "background-color": "pink",
      },
      "data-index": 1,
    },
    [h('span',{},'文字')]
    "文字" //这里是标签里面展示的文字
  );
};
```

tips: 这里渲染出来的组件可以在开发者工具里面细看

如何你想渲染内部组件的话，可以用下面的栗子 🌰 ,以 Switch 组件为例

```ts
import { resolveComponent } from "vue";

// ...

render: (h: any, params: any) => {
  return h(
    resolveComponent("Switch"), //组件引入
    {
      //组件属性使用
      "model-value": params.row.meetShare,
      size: "large",
      "true-value": 0,
      "false-value": 1,
      on: {
        change: () => {},
      },
    },
    {
      //插槽配置
      open: () => h("span", {}, "允许"),
      close: () => h("span", {}, "禁止"),
    }
  );
};
```

tip [解决控制台黄色警告: Non-function value encountered for default slot. Prefer function slots](https://blog.csdn.net/weixin_45743541/article/details/126640335)

Vue3 使用 h 函数 推荐使用函数式插槽，以便获得更佳的性能。

- 第一种
  return h(xxx, { xxx }, { default: () => xxx });
- 第二种：多个插槽
  return h( xxx, { xxx }, { default: () => [xxx, xxx], });

## 提交规范

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `build` 对构建系统或者外部依赖项进行了修改
- `chore` 依赖更新/脚手架配置修改等
- `workflow` 工作流改进
- `ci` 持续集成
- `types` 类型定义文件更改
- `wip` 开发中

## 参考链接

[封装 flex 布局（Less）](https://blog.csdn.net/zxBlogs/article/details/125127322)
[Lodash,个人感觉一个不错的前端库](https://www.lodashjs.com/)
[处理多窗口](https://juejin.cn/post/6844903910436519949)
