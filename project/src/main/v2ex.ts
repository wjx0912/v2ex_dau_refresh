import log from 'electron-log'
import { BrowserWindow } from 'electron'
import { join } from 'path'

const LogTitle = '[v2ex]'

let v2exBrowserWindow: BrowserWindow = null as unknown as BrowserWindow

export async function v2exInit(): Promise<void> {
  log.info(LogTitle, 'v2exInit called')
  if (v2exBrowserWindow) {
    v2exBrowserWindow.destroy()
    v2exBrowserWindow = null as unknown as BrowserWindow
  }

  v2exBrowserWindow = new BrowserWindow({
    x: 30,
    y: 30,
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

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

  await v2exBrowserWindow.loadURL('https://www.v2ex.com/')
  // 以toggle方式打开devtools
  v2exBrowserWindow.webContents.openDevTools({ mode: 'right' })
}

export async function onV2exBackground(): Promise<void> {
  log.info(LogTitle, 'onV2exBackground called')
  // 如果v2exBrowserWindow隐藏就显示，如果显示就隐藏
  if (!v2exBrowserWindow) {
    await v2exInit()
  }
  if (v2exBrowserWindow.isVisible()) {
    v2exBrowserWindow.hide()
  } else {
    v2exBrowserWindow.show()
  }
}

export async function onV2exCheck(): Promise<void> {
  log.info(LogTitle, 'onV2exCheck called')
}

export async function onV2exDauResult(): Promise<void> {
  log.info(LogTitle, 'onV2exDauResult called')
}

export async function onV2exLoginStatus(): Promise<void> {
  log.info(LogTitle, 'onV2exLoginStatus called')
}
