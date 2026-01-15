import log from 'electron-log'
import { app, ipcMain } from 'electron'
import * as path from 'path'
import * as fse from 'fs-extra'
import { isDev } from './debug'

const LogTitle = '[init]'

export const config = {
  dau_threshold: 20,
  refresh_interval: 60 * 1000
}

export async function initConfig(): Promise<void> {
  log.info(LogTitle, 'initConfig called')

  log.info(LogTitle, 'electronMain entry: ', isDev)
  const appRootPath = app.getAppPath()
  const appDataPath = app.getPath('userData')
  log.info(LogTitle, 'appRootPath: ', appRootPath)
  log.info(LogTitle, 'appDataPath: ', appDataPath)

  try {
    // 配置文件的路径
    const configFilePath = path.join(appDataPath, 'config.json')
    const configContent = fse.readFileSync(configFilePath, { encoding: 'utf-8' }).toString().trim()
    const j = JSON.parse(configContent)
    j.dau_threshold && (config.dau_threshold = j.dau_threshold)
    j.refresh_interval && (config.refresh_interval = j.refresh_interval)
    log.info(LogTitle, 'Loaded config: ', config)
  } catch (error) {
    log.warn(LogTitle, 'initConfig error: ', error)
  }

  // 处理vue的配置：读取，保存
  ipcMain.handle('vueReadConfig', async () => {
    return { config, isDev }
  })
  ipcMain.handle('vueSaveConfig', async (j) => {
    log.info(LogTitle, 'vueSaveConfig called: ', j)
    fse.writeFileSync(path.join(appDataPath, 'config.json'), JSON.stringify(j, null, 2), {
      encoding: 'utf-8'
    })
  })
}
