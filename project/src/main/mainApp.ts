import log from 'electron-log'
import { ipcMain } from 'electron'
import { mainWindow } from './index'
import { version } from '../../package.json'
import { isDev } from './debug'
import {
  v2exInit,
  onV2exBackground,
  onV2exCheck,
  onV2exDauResult,
  onV2exLoginStatus,
  onV2exDAUStatus,
  v2exUninit,
  onV2exRestart
} from './v2ex'
import { createTrayIcon } from './initApp'

const LogTitle = '[mainApp]'

export async function electronMain(): Promise<void> {
  log.info(LogTitle, 'electronMain called')

  // 防止渲染进程（HTML title标签）覆盖窗口标题
  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault()
  })
  mainWindow.setTitle(`DAU Refresh v${version}`)

  ipcMain.on('V2exBackground', onV2exBackground)
  ipcMain.on('V2exDauResult', onV2exCheck)
  ipcMain.on('V2exDauResult', onV2exDauResult)
  ipcMain.on('V2exLoginStatus', onV2exLoginStatus)
  ipcMain.on('V2exDAUMessage', onV2exDAUStatus)
  ipcMain.on('V2exRestart', onV2exRestart)
  //   Menu.setApplicationMenu(null)

  // 程序退出时，发消息给前端执行退出逻辑
  if (!isDev) {
    mainWindow.on('close', (e) => {
      e.preventDefault()
      mainWindow.hide()
      //   dialog
      //     .showMessageBox(mainWindow, {
      //       type: 'info',
      //       title: '退出程序', // 可能不显示
      //       message: '确定要退出程序吗？',
      //       buttons: ['确定', '取消']
      //     })
      //     .then((it) => {
      //       if (it.response === 0) {
      //         app.exit()
      //       }
      //     })
    })
  }

  await createTrayIcon()
  await v2exInit()
  setInterval(
    async () => {
      await v2exUninit()
      await v2exInit()
    },
    2 * 3600 * 1000
  ) // 每2小时重启一次浏览器窗口
}
