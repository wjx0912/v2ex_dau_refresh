import * as inspector from 'inspector'
import * as fse from 'fs-extra'
import * as path from 'path'
import { app } from 'electron'

// 是否调试状态
function _isInDebugMode(): boolean {
  return inspector.url() !== undefined
}

export function isDevEx(): boolean {
  const debugFilePath = path.join(app.getPath('userData'), 'debug')
  return fse.existsSync(debugFilePath)
}

export const isDev = _isInDebugMode()
