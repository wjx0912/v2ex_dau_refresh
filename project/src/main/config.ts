import log from 'electron-log'
import { app, ipcMain } from 'electron'
import * as path from 'path'
import * as fse from 'fs-extra'
import { isDev } from './debug'

const LogTitle = '[init]'

export const config = {
  dau_threshold: 20,
  refresh_interval: 60,
  show_mainwindow: false
}

export async function _saveConfig(j): Promise<void> {
  const appDataPath = app.getPath('userData')
  fse.writeFileSync(path.join(appDataPath, 'config.json'), JSON.stringify(j, null, 2), {
    encoding: 'utf-8'
  })
}

export async function initConfig(): Promise<void> {
  log.info(LogTitle, 'initConfig entry: ', isDev)
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
    j.show_mainwindow && (config.show_mainwindow = j.show_mainwindow)
    log.info(LogTitle, 'Loaded config: ', config)
  } catch (error) {
    log.warn(LogTitle, 'initConfig error: ', error)
    await _saveConfig(config)
  }

  // 处理vue的配置：读取，保存
  ipcMain.handle('ReadConfig', async () => {
    return { config, isDev }
  })
  ipcMain.handle('SaveConfig', async (e, j) => {
    log.info(LogTitle, 'SaveConfig called: ', j)
    await _saveConfig(j)
  })
}
