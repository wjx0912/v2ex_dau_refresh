import log from 'electron-log'
import { app, ipcMain, dialog } from 'electron'
import { mainWindow } from './index'
import { version } from '../../package.json'

const LogTitle = '[init]'

async function onDauResult(): Promise<void> {
  log.info(LogTitle, 'onDauResult called')
}

export async function electronMain(): Promise<void> {
  log.info(LogTitle, 'electronMain called')
  mainWindow.setTitle(`V2EX DAU Refresh v${version}`)

  ipcMain.on('onTest', onDauResult)

  // 程序退出时，发消息给前端执行退出逻辑
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
