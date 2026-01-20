import log from 'electron-log'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import { isDev, isDevEx } from './debug'
import { mainWindow } from './index'

const LogTitle = '[v2ex]'

let v2exBrowserWindow: BrowserWindow | null = null

export async function v2exUninit(): Promise<void> {
  log.info(LogTitle, 'v2exUninit called')
  if (v2exBrowserWindow) {
    v2exBrowserWindow.destroy()
    v2exBrowserWindow = null
  }
}

export async function v2exInit(): Promise<void> {
  log.info(LogTitle, 'v2exInit called')
  v2exBrowserWindow = new BrowserWindow({
    x: 30,
    y: 30,
    width: 1800,
    height: 900,
    show: isDev || isDevEx(),
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/inject.js'),
      sandbox: false
    }
  })

  const formatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  const windowTitle = formatter.format(new Date())

  // 防止渲染进程（HTML title标签）覆盖窗口标题
  v2exBrowserWindow.on('page-title-updated', (e) => {
    e.preventDefault()
  })
  v2exBrowserWindow.setTitle(`window create at ${windowTitle}`)
  //   v2exBrowserWindow.webContents.on('will-navigate', (event, url) => {
  //     log.info(LogTitle, 'v2ex will-navigate to url: ', url)
  //     if (!url.startsWith('https://www.v2ex.com/')) {
  //       event.preventDefault()
  //       shell.openExternal(url)
  //     }
  //   })

  //   v2exBrowserWindow.on('closed', () => {
  //     v2exBrowserWindow = null as unknown as BrowserWindow
  //   })

  v2exBrowserWindow.loadURL('https://www.v2ex.com/')
  // 以toggle方式打开devtools (仅开发模式)
  if (isDev || isDevEx()) {
    v2exBrowserWindow.webContents.openDevTools({ mode: 'right' })
  }
}

export async function onV2exBackground(): Promise<void> {
  log.info(LogTitle, 'onV2exBackground called')
  if (v2exBrowserWindow && v2exBrowserWindow.isVisible()) {
    v2exBrowserWindow.hide()
  } else if (v2exBrowserWindow) {
    v2exBrowserWindow.show()
  }
}

export async function onV2exCheck(): Promise<void> {
  log.info(LogTitle, 'onV2exCheck called')
}

export async function onV2exDauResult(): Promise<void> {
  log.info(LogTitle, 'onV2exDauResult called')
}

export async function onV2exLoginStatus(_e, data: number): Promise<void> {
  log.info(LogTitle, 'onV2exLoginStatus called with status:', data)

  // 0失败，1签到成功，2已签到，3未登录，4加载网页超时
  let msgStr = ''
  if (data === 1) {
    msgStr = '签到成功'
  } else if (data === 2) {
    msgStr = '已签到'
  } else if (data === 3) {
    msgStr = '未登录'
  } else if (data === 4) {
    msgStr = '加载网页超时'
  } else {
    msgStr = '错误码：' + data + ', 时间：'
  }
  if (mainWindow) {
    mainWindow.webContents.send('V2exStatusMessage', msgStr)
  }
}

export async function onV2exDAUStatus(_e, data): Promise<void> {
  log.info(LogTitle, 'onV2exDAUStatus called with data:', data)

  if (mainWindow) {
    mainWindow.webContents.send('V2exDAUMessage', data)
  }
}

export async function onV2exRestart(): Promise<void> {
  log.info(LogTitle, 'onV2exRestart called')
  await v2exUninit()
  await v2exInit()
}
