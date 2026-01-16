import log from 'electron-log'
import { app, ipcMain, dialog } from 'electron'
import { mainWindow } from './index'
import { version } from '../../package.json'
import { isDev } from './debug'

const LogTitle = '[init]'

async function onV2exDauResult(): Promise<void> {
  log.info(LogTitle, 'onDauResult called')
}

async function onV2exBackground(): Promise<void> {
  log.info(LogTitle, 'onV2exBackground called')
}

async function onV2exCheck(): Promise<void> {
  log.info(LogTitle, 'onV2exCheck called')
}

export async function electronMain(): Promise<void> {
  log.info(LogTitle, 'electronMain called')

  // 防止渲染进程（HTML title标签）覆盖窗口标题
  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault()
  })
  mainWindow.setTitle(`V2EX DAU Refresh v${version}`)

  ipcMain.on('onV2exDauResult', onV2exDauResult)
  ipcMain.on('onV2exBackground', onV2exBackground)
  ipcMain.on('onV2exCheck', onV2exCheck)

  // 程序退出时，发消息给前端执行退出逻辑
  if (!isDev) {
    mainWindow.on('close', (e) => {
      e.preventDefault()
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: '退出程序', // 可能不显示
          message: '确定要退出程序吗？',
          buttons: ['确定', '取消']
        })
        .then((it) => {
          if (it.response === 0) {
            app.exit()
          }
        })
    })
  }
}
