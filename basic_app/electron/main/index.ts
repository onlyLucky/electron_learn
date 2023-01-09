// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { app, BrowserWindow, shell, ipcMain, Tray, Menu, nativeImage, webFrame } from 'electron'
import { release } from 'os'
import { join } from 'path'
const url = require("url")
const Config = require("../../src/config/index.json")
// Disable GPU Acceleration for Windowsb 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// 主窗口
let win: BrowserWindow | null = null
// 登录窗口
let loginWin: BrowserWindow | null = null
// 弹出层窗口
let modelWins = new Set();
// 当前聚焦的窗口
let focusWin: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const urlPath = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
let loadPath = process.env.VITE_DEV_SERVER_URL ? urlPath : indexHtml
function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 700,
    minWidth: 1024,
    minHeight: 700,
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'logo.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    // 去掉最顶部的导航，以及最大化、最小化、关闭按钮
    frame: false
  })
  win.setMenu(null)
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(urlPath + '#/meeting')
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadURL(url.format({
      pathname: indexHtml,
      protocol: 'file:',
      slashes: true,
      hash: "meeting"
    }))
  }
  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  win.on('close', (e) => {
    e.preventDefault();  //阻止窗口的关闭事件
    focusWin = win
    win.hide();
  })
}

function createLoginWin() {
  loginWin = new BrowserWindow({
    width: 710,
    height: 426,
    resizable: false,
    title: 'login',
    icon: join(process.env.PUBLIC, 'logo.ico'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    // 去掉最顶部的导航，以及最大化、最小化、关闭按钮
    frame: false
  })
  loginWin.setMenu(null)
  console.log(process.env.VITE_DEV_SERVER_URL, 'process.env.VITE_DEV_SERVER_URL')
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    loginWin.loadURL(urlPath)
    // Open devTool if the app is not packaged
    // loginWin.webContents.openDevTools()
  } else {
    loginWin.loadFile(indexHtml)
  }

  loginWin.focus()
  loginWin.on('close', (e) => {
    e.preventDefault();  //阻止窗口的关闭事件
    focusWin = loginWin
    loginWin.hide();
  })
}
// 托盘对象
let tray;
app.whenReady().then(() => {
  // createWindow()
  createLoginWin()
  // 创建托盘
  const icon = nativeImage.createFromPath(join(process.env.PUBLIC, 'resources/logo.png'))
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开应用',
      icon: join(process.env.PUBLIC, 'resources/icons/icon1.png'),
      click: () => {
      }
    },
    {
      label: '退出',
      icon: join(process.env.PUBLIC, 'resources/icons/icon1.png'),
      click: () => {
      }
    },
    {
      label: '退出应用',
      icon: join(process.env.PUBLIC, 'resources/icons/icon1.png'),
      click: () => {
        if (process.platform !== 'darwin') {
          loginWin = null;
          win = null
          app.exit(0);
        }
      }
    },
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('basic app')
  tray.setTitle('This is my title')
  //监听任务栏图标的点击事件
  /* tray.on('double-click', function () {
    focusWin.show();
    console.log('double-click')
  })
  tray.on('click', function () {
    console.log('click')
  }) */
  // 任务栏点击事件
  let timeCount = 0
  tray.on('click', function (Event) {
    setTimeout(() => {
      if (timeCount === 0) {
        focusWin.show();
        timeCount = 0
      }
    }, 300)
  })
  // 任务栏双击点击事件
  tray.on('double-click', function () {
    timeCount = 1
    setTimeout(() => {
      timeCount = 0
    }, 300)
  })
})
// 当所有的窗口都被关闭时触发
app.on('window-all-closed', (e) => {
  console.log('window-all-closed', BrowserWindow.getAllWindows().length)
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})
// 当应用被激活时发出。
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})


// 接收num change改变的通信
ipcMain.on('num_change', (event, arg) => {
  console.log(arg, 'num_change')
  /* BrowserWindow.getAllWindows().forEach(v => {
    v.send('num_change', arg)
  }) */
})

// 窗口最小化
ipcMain.on('window_min', (event, arg) => {
  BrowserWindow.getFocusedWindow().minimize();
})
// 窗口 最大化、恢复
ipcMain.on('window_max', function () {
  if (BrowserWindow.getFocusedWindow().isMaximized()) { // 为true表示窗口已最大化
    BrowserWindow.getFocusedWindow().restore();// 将窗口恢复为之前的状态.
  } else {
    BrowserWindow.getFocusedWindow().maximize();
  }
})

ipcMain.on('on_login', (event, arg) => {
  BrowserWindow.getFocusedWindow().close();
  loginWin = null;
  createWindow()
})
// 关闭窗口
ipcMain.on('window_close', function (e) {
  focusWin = BrowserWindow.getFocusedWindow()
  if (!focusWin.isFocused()) {
    focusWin = null;
  } else {
    e.preventDefault();  //阻止窗口的关闭事件
    focusWin.hide();
  }
  // BrowserWindow.getFocusedWindow().close();
})

ipcMain.on('win_size', function (event, arg) {
  // console.log(url, arg)
  createLoginWin()
})


// 监听图标闪动事件
let iconShakeTimer = null;
ipcMain.on('icon_shake', (event, arg: boolean) => {
  console.log(arg, 'icon_shake')
  if (arg) {
    let icon_space = nativeImage.createFromPath(join(process.env.PUBLIC, 'resources/logo_space.png'))
    let icon_active = nativeImage.createFromPath(join(process.env.PUBLIC, 'resources/logo_active.png'))
    let flag = true;
    iconShakeTimer = setInterval(() => {
      if (flag) {
        tray.setImage(icon_active);
        flag = false;
      } else {
        tray.setImage(icon_space);
        flag = true;
      }
    }, 500)
  } else {
    let icon_logo = nativeImage.createFromPath(join(process.env.PUBLIC, 'resources/logo.png'))
    clearInterval(iconShakeTimer)
    tray.setImage(icon_logo)
  }
  // event.sender.send('icon_shake_suc')
})

// New window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  console.log('new win ++', arg)
  createModelWin(arg)
})

// 创建model窗口
type OptType = {
  type?: 0 | 1 | 2 | 3,// 窗口类型
  url: string,

}
function createModelWin(opt: OptType) {
  // 判断当前窗口配置
  if (modelWins.size >= Config.modelConfig.length) {
    let tempArr: any = Array.from(modelWins)
    let curWin: any = tempArr[tempArr.length - 1].win
    if (process.env.VITE_DEV_SERVER_URL) {
      curWin.loadURL(`${urlPath}#/${opt.url}`)
      curWin.webContents.openDevTools()
    } else {
      curWin.loadURL(url.format({
        pathname: indexHtml,
        protocol: 'file:',
        slashes: true,
        hash: opt.url
      }))
    }
    curWin.focus()
    return curWin
  }
  let modelWin = new BrowserWindow({
    width: 1024,
    height: 700,
    minWidth: 1024,
    minHeight: 700,
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'logo.ico'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    // 去掉最顶部的导航，以及最大化、最小化、关闭按钮
    frame: false
  });

  modelWin.setMenu(null)

  if (process.env.VITE_DEV_SERVER_URL) {

    modelWin.loadURL(`${urlPath}#/${opt.url}`)
    modelWin.webContents.openDevTools()
  } else {
    modelWin.loadURL(url.format({
      pathname: indexHtml,
      protocol: 'file:',
      slashes: true,
      hash: opt.url
    }))
  }

  modelWin.once('ready-to-show', () => {
    modelWin.show();
  });

  modelWin.on('closed', () => {
    modelWins.delete(modelWin); //从已关闭的窗口Set中移除引用
    modelWin = null;
  });

  modelWins.add({
    win: modelWin,
    time: new Date(),
    type: opt.type,
    url: opt.url,
  }); //将窗口添加到已打开时设置的窗口
  return modelWin;
}
