import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  readConfig: () => Promise<{ config; isDev: boolean }>
  saveConfig: (config) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
