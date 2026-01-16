import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  readConfig: () => ipcRenderer.invoke('ReadConfig'),
  saveConfig: (config) => ipcRenderer.invoke('SaveConfig', config),
  v2exBackground: () => ipcRenderer.invoke('V2exBackground'),
  v2exCheck: () => ipcRenderer.invoke('V2exCheck')
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
