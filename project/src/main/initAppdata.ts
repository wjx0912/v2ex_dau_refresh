import * as path from 'path'
import { app } from 'electron'
import * as fse from 'fs-extra'
import log from 'electron-log'

// 软件名称
const _appName = 'V2EX DAU Refresh'

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
