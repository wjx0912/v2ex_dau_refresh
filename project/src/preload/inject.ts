import { ipcRenderer } from 'electron'
import { auto_sign, refresh } from './v2ex'
import { api } from './common'

//////////////////////////////////////////////////////////////////////////////
// 以下是注入到网页中的脚本内容
//////////////////////////////////////////////////////////////////////////////
console.log('This is inject.ts api: ', api)
console.log('This is inject.ts auto_sign: ', !!auto_sign)
console.log('This is inject.ts refresh: ', !!refresh)

const injectInit = async (flag: boolean): Promise<void> => {
  console.log('injectInit（1签到成功，2已签到，3未登录，4加载网页超时，其它是错误码），参数：', flag)
  const config = await api.readConfig()
  console.log('injectInit config:', config)
  if (!flag) {
    ipcRenderer.send('V2exLoginStatus', 4) // 4是加载网页超时
    return
  }

  // 自动签到
  const result = await auto_sign() // 自动登录
  console.log('auto_sign result:', result)
  ipcRenderer.send('V2exLoginStatus', result)

  // 刷新活跃度
  if (1 === result || 2 === result) {
    refresh(config.dau_threshold, config.refresh_interval)
  }
  //   //////////////////////////////////////////////////////////////
  //   // 用户执行
  //   //////////////////////////////////////////////////////////////
  //   // 第一个参数是用户名，第二个参数是需要的活跃度阈值，第三个参数是休眠时间值越大越好以免意外封号（单位秒）
  //   // dau排行榜： https://www.v2ex.com/top/dau
  //   //   refresh('datadump', 3, 30)
  //   //
  //   const username = 'datadump'
  //   const threshold = 3
  //   const sleep = 30
  //   await refresh(username, threshold, sleep)
}

// document.addEventListener('DOMContentLoaded', injectInit)
// window.addEventListener('load', injectInit)
// setTimeout(injectInit, 15 * 1000)

// 当网页加载成功时执行injectInit(true)，如果失败或者15秒超时执行injectInit(false)
let isLoaded = false
window.addEventListener('load', () => {
  if (!isLoaded) {
    isLoaded = true
    injectInit(true)
  }
})
setTimeout(() => {
  if (!isLoaded) {
    isLoaded = true
    injectInit(false)
  }
}, 15 * 1000)
