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
- [配置](#配置)
  - [托盘部分](#托盘部分)
  - [通信](#通信)
  - [路径别名](#路径别名)
  - [UI 框架引入](#ui-框架引入)
  - [国际化配置](#国际化配置)
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

- [Electron failed to install correctly, please delete node_modules/electron and try installing again](https://blog.csdn.net/qq_42789068/article/details/106401830)

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

[UI 框架国际化](https://www.iviewui.com/view-ui-plus/guide/i18n)

[vue3 vue-i18n](https://blog.csdn.net/laishaojiang/article/details/124634764)

具体参考`src/locale`文件下面的配置

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
