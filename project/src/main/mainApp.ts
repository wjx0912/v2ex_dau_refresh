import log from 'electron-log'
import { app, ipcMain, dialog } from 'electron'
import { mainWindow } from './index'
import { version } from '../../package.json'
import { isDev } from './debug'

const LogTitle = '[init]'

async function onDauResult(): Promise<void> {
  log.info(LogTitle, 'onDauResult called')
}

export async function electronMain(): Promise<void> {
  log.info(LogTitle, 'electronMain called')

  // 防止渲染进程（HTML title标签）覆盖窗口标题
  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault()
  })

  mainWindow.setTitle(`V2EX DAU Refresh v${version}`)

  ipcMain.on('onDauResult', onDauResult)

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
