import { app, Tray, Menu, nativeImage, dialog } from 'electron'
import icon from '../../resources/icon.png?asset'
import { mainWindow } from './index'

let tray: Tray | null = null

export function createTray(): void {
  // 创建托盘图标
  const trayIcon = nativeImage.createFromPath(icon)
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }))

  tray.setToolTip('V2EX DAU Refresh')

  // 更新托盘菜单
  updateTrayMenu()

  // 双击托盘图标显示/隐藏窗口
  tray.on('double-click', () => {
    toggleWindow()
  })
}

function toggleWindow(): void {
  if (!mainWindow) return

  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }

  // 更新菜单状态
  updateTrayMenu()
}

function updateTrayMenu(): void {
  if (!tray || !mainWindow) return

  const isVisible = mainWindow.isVisible()

  const contextMenu = Menu.buildFromTemplate([
    {
      label: isVisible ? '隐藏' : '显示',
      type: 'checkbox',
      //   checked: isVisible,
      click: () => {
        toggleWindow()
      }
    },
    {
      type: 'separator'
    },
    {
      label: '关于',
      click: () => {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: '关于',
          message: 'V2EX DAU Refresh',
          detail: `版本: ${app.getVersion()}\n\n一个 V2EX DAU 刷新工具\n基于 Electron + Vite + Vue3 + TypeScript 构建\n\nhttps://github.com/wjx0912/v2ex_dau_refresh`,
          buttons: ['确定']
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: '退出',
      click: () => {
        // app.quit()
        app.exit(0)
      }
    }
  ])

  tray.setContextMenu(contextMenu)
}

// 监听窗口显示/隐藏事件，更新托盘菜单
export function setupTrayListeners(): void {
  if (!mainWindow) return

  mainWindow.on('show', () => {
    updateTrayMenu()
  })

  mainWindow.on('hide', () => {
    updateTrayMenu()
  })
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
