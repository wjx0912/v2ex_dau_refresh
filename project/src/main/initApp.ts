import * as path from 'path'
import { app, dialog } from 'electron'
import * as fse from 'fs-extra'
import log from 'electron-log'

// 软件名称
const _appName = 'V2EX DAU Refresh'

// 如果重新已经运行，弹窗对话框，确认后退出
export async function checkRunOnce(): Promise<void> {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    // log.info('Another instance is already running. Exiting this instance.')
    // 弹窗对话框确认
    await dialog.showMessageBox({
      type: 'info',
      title: '程序已运行',
      message: '程序已经在运行中，不能重复启动。',
      buttons: ['确定']
    })
    app.exit(0)
  }
}

// 设置app名称和appdata
export async function initAppData(): Promise<void> {
  app.setPath('userData', path.join(app.getPath('appData'), _appName))
  const appRootPath = app.getAppPath()
  const appDataPath = app.getPath('userData')
  console.log('appRootPath: ', appRootPath)
  console.log('appDataPath: ', appDataPath)
  fse.ensureDirSync(appDataPath)
  fse.ensureDirSync(path.join(appDataPath, 'logs'))
  fse.ensureDirSync(path.join(appDataPath, 'error'))
}

export async function initLog(): Promise<void> {
  // 日志
  const logPath = path.join(app.getPath('appData'), _appName, 'Logs', 'main.log')
  const logFormat = '{y}-{m}-{d} {h}:{i}:{s}:{ms} {level}:{text}'
  log.transports.file.fileName = `main.log`
  log.transports.file.level = 'debug'
  log.transports.file.format = logFormat
  log.transports.file.maxSize = 10 * 1024 * 1024
  log.transports.file.resolvePathFn = () => logPath
  log.transports.file.writeOptions = { encoding: 'utf8', flag: 'a+', mode: 0o666 }
  log.transports.console.format = logFormat
  log.transports.console.level = 'debug'
  log.initialize()
}

export async function createTrayIcon(): Promise<void> {
  // TODO
}
