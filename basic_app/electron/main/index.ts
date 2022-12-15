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

import { app, BrowserWindow, shell, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { release } from 'os'
import { join } from 'path'

// Disable GPU Acceleration for Windows 7
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

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
async function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 640,
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'logo.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    // 去掉最顶部的导航，以及最大化、最小化、关闭按钮
    frame: false
  })
  win.setMenu(null)
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
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
}
// 托盘对象
let tray;
app.whenReady().then(() => {
  createWindow()
  // 创建托盘
  const icon = nativeImage.createFromPath('resources/logo.png')
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开应用',
      icon: 'resources/icons/icon1.png',
      click: () => {
      }
    },
    {
      label: '退出',
      icon: 'resources/icons/icon1.png',
      click: () => {
      }
    },
    {
      label: '退出应用',
      icon: 'resources/icons/icon1.png',
      click: () => {
      }
    },
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('basic app')
  tray.setTitle('This is my title')

})
// 当所有的窗口都被关闭时触发
app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
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
  BrowserWindow.getAllWindows().forEach(v => {
    v.send('num_change', arg)
  })
})

// 窗口最小化
ipcMain.on('window_min', (event, arg) => {
  win.minimize();
})
// 窗口 最大化、恢复
ipcMain.on('window_max', function () {
  if (win.isMaximized()) { // 为true表示窗口已最大化
    win.restore();// 将窗口恢复为之前的状态.
  } else {
    win.maximize();
  }
})
// 关闭窗口
ipcMain.on('window_close', function () {
  win.close();
})


// 监听图标闪动事件
let iconShakeTimer = null;
ipcMain.on('icon_shake', (event, arg: boolean) => {
  console.log(arg, 'icon_shake')
  if (arg) {
    let icon_space = nativeImage.createFromPath('resources/logo_space.png')
    let icon_active = nativeImage.createFromPath('resources/logo_active.png')
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
    let icon_logo = nativeImage.createFromPath('resources/logo.png')
    clearInterval(iconShakeTimer)
    tray.setImage(icon_logo)
  }
  // event.sender.send('icon_shake_suc')
})

// New window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  console.log('new win ++')
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
