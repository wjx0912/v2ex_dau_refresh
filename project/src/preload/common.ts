import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  readConfig: () => ipcRenderer.invoke('ReadConfig'),
  saveConfig: (config) => ipcRenderer.invoke('SaveConfig', config),
  v2exBackground: () => ipcRenderer.send('V2exBackground'),
  v2exCheck: () => ipcRenderer.send('V2exCheck'),
  V2exDauResult: (result) => ipcRenderer.send('V2exDauResult', result),
  V2exLoginStatus: (status) => ipcRenderer.send('V2exLoginStatus', status),
  V2exDAUMessage: (status) => ipcRenderer.send('V2exDAUMessage', status),
  v2exRestart: () => ipcRenderer.send('V2exRestart')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

console.log('This is common.ts: ', api)
export { api }
