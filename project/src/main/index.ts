import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { isDev, isDevEx } from './debug'
import { checkRunOnce, initAppData, initLog } from './initApp'
import { initConfig } from './config'
import { electronMain } from './mainApp'
import { createTray, setupTrayListeners, destroyTray } from './tray'

export let mainWindow: BrowserWindow

async function createWindow(): Promise<BrowserWindow> {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 1200,
    minWidth: 600,
    minHeight: 800,
    maxWidth: 1200,
    maxHeight: 1200,
    show: false,
    autoHideMenuBar: true,
    skipTaskbar: true, // 不在任务栏显示
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', (event) => {
    // 点击关闭按钮时隐藏窗口而不是退出
    event.preventDefault()
    mainWindow.hide()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  if (isDev || isDevEx()) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong: ', isDev))

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })

  await checkRunOnce()
  await initAppData()
  await initLog()
  await initConfig()
  mainWindow = await createWindow() // 以上执行完了后再创建窗口，因为里面有些初始化要invoke主进程函数
  await electronMain()

  // 创建托盘
  createTray()
  setupTrayListeners()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  destroyTray()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
