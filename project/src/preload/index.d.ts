import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  readConfig: () => Promise<{
    dau_threshold: number
    refresh_interval: number
    show_mainwindow: boolean
  }>
  saveConfig: (config) => Promise<void>
  v2exBackground: () => Promise<void>
  v2exCheck: () => Promise<void>
  v2exRestart: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
