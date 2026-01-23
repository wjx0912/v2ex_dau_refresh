import { ipcRenderer } from 'electron'

async function fetch_wrap(url): Promise<string> {
  try {
    const html = await (
      await fetch(url, {
        method: 'GET',
        credentials: 'same-origin' // 确保请求携带当前浏览器的 cookies
      })
    ).text()
    return html
  } catch (error) {
    console.error('Error fetch_wrap:', error)
    return ''
  }
}

// 刷dau相关的函数
function formatDate(date): string {
  const pad = (n: number): string => n.toString().padStart(2, '0')

  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-') +
    ' ' +
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':')
  )
}

async function get_dau(username: string): Promise<number> {
  try {
    const html = await fetch_wrap('https://www.v2ex.com/member/' + username)
    const match = html.match(/今日活跃度排名\s*<a[^>]*>(\d+)<\/a>/)
    if (match) {
      const dau = parseInt(match[1], 10)
      console.log('当前活跃度排名: ', dau)
      return dau
    }
  } catch (error) {
    console.error('Error refreshing DAU:', error)
  }

  return 0
}

export async function refresh(threshold: number, sleep: number): Promise<void> {
  if (!login_username) {
    console.log('请先登录后再刷新活跃度')
  }
  console.log(
    `开始刷新活跃度，用户名：${login_username}，目标阈值为 ${threshold}，休眠时间为 ${sleep} 秒`
  )

  while (true) {
    const username = login_username
    const dau = await get_dau(login_username)
    if (dau && dau > 0 && dau <= threshold) {
      console.log(`活跃度排名已达到 ${dau}，停止刷新。`)
      ipcRenderer.send('V2exDAUMessage', { isFinish: true, dau, threshold, username })
      break
    } else {
      ipcRenderer.send('V2exDAUMessage', { isFinish: false, dau, threshold, username })
      console.log(
        formatDate(new Date()) +
          `：当前用户 ${login_username} 活跃度为 ${dau}，未达到阈值 ${threshold}，休眠${sleep}秒继续刷新...`
      )
    }
    await new Promise((resolve) => setTimeout(resolve, sleep * 1000))
  }
}

// 自动签到相关的函数
// 参考 https://github.com/abusizhishen/chrome_ext_v2ex/blob/main/script/background.js
function extractMissionURL(str: string): { url: string; onceValue: string } | null {
  // 正则表达式，匹配 '/mission/daily/redeem?once=' 后面的数字
  const regex = /\/mission\/daily\/redeem\?once=(\d+)/

  // 使用正则表达式匹配
  const match = str.match(regex)

  if (match) {
    // 返回匹配到的 URL 和数字
    return {
      url: match[0], // 匹配到的完整 URL，如 '/mission/daily/redeem?once=80870'
      onceValue: match[1] // 匹配到的数字部分，如 '80870'
    }
  } else {
    // 如果没有匹配到，返回 null
    return null
  }
}

let login_username = ''
// 1签到成功，2已签到，3未登录，4加载网页超时，其它是错误码
export async function auto_sign(): Promise<number> {
  try {
    console.log('auto_sign() 开始自动签到')
    login_username = ''
    // 休眠3秒
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const html = await fetch_wrap('https://www.v2ex.com/mission/daily')
    if (html) {
      const match = html.match(/"\/member\/([^"]+)"/)
      login_username = match ? match[1] : ''

      const result = extractMissionURL(html)
      if (result) {
        const url = 'https://www.v2ex.com' + result.url // 拼接完整的 URL

        // 调用函数进行金币领取
        const html = await fetch_wrap(url)
        if (html) {
          console.log('签到成功')
          return 1
        } else {
          return 101
        }
      } else {
        if (html.includes('member-activity-bar') && html.includes('/member/')) {
          console.log('已签到')
          return 2
        } else {
          console.log('未登录')
          return 3
        }
      }
    } else {
      return 102
    }
  } catch (error) {
    console.error('Error auto sign:', error)
    return 103
  }

  console.log('签到失败')
  return 199
}
