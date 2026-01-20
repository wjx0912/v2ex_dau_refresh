import log from 'electron-log'
import { app, ipcMain } from 'electron'
import * as path from 'path'
import * as fse from 'fs-extra'
import { isDev, isDevEx } from './debug'
import { v2exInit, v2exUninit } from './v2ex'

const LogTitle = '[config]'

export const config = {
  dau_threshold: 20,
  refresh_interval: 60,
  show_mainwindow: false
}

export async function _saveConfig(data: typeof config): Promise<void> {
  const appDataPath = app.getPath('userData')
  const configFilePath = path.join(appDataPath, 'config.json')
  await fse.writeJson(configFilePath, data, { spaces: 2 })
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
    const j = await fse.readJson(configFilePath)
    if (j.dau_threshold !== undefined) config.dau_threshold = j.dau_threshold
    if (j.refresh_interval !== undefined) config.refresh_interval = j.refresh_interval
    if (j.show_mainwindow !== undefined) config.show_mainwindow = j.show_mainwindow
    if (!isDev && !isDevEx()) {
      if (config.refresh_interval < 30) {
        config.refresh_interval = 30
      }
    }
    log.info(LogTitle, 'Loaded config: ', config)
  } catch (error) {
    log.warn(LogTitle, 'initConfig error: ', error)
    await _saveConfig(config)
  }

  // 处理vue的配置：读取，保存
  ipcMain.handle('ReadConfig', async () => {
    return config
  })
  ipcMain.handle('SaveConfig', async (_e, j) => {
    log.info(LogTitle, 'SaveConfig called: ', j)
    Object.assign(config, j)
    if (!isDev && !isDevEx()) {
      if (config.refresh_interval < 30) {
        config.refresh_interval = 30
      }
    }
    await _saveConfig(config)
    await v2exUninit()
    await v2exInit()
  })
}
