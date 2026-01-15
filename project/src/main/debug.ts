import * as inspector from 'inspector'

// 是否调试状态
function _isInDebugMode(): boolean {
  return inspector.url() !== undefined
}

export const isDev = _isInDebugMode()
