<template>
  <div class="main-container">
    <div class="section-content">
      <div class="config-row">
        <span>活跃度阈值</span>
        <el-input v-model="threshold" type="number" :min="0" :max="999999" style="width: 140px" />
      </div>
      <div class="config-row">
        <span>刷新间隔(s)</span>
        <el-input v-model="interval" type="number" :min="30" :max="999999" style="width: 140px" />
      </div>
      <div class="config-row">
        <span>开机启动</span>
        <el-tooltip placement="top" content="该功能稍后实现">
          <el-checkbox v-model="autoStart" />
        </el-tooltip>
      </div>
      <div>
        <el-button @click="saveConfig">保存</el-button>
        <el-button @click="readConfig">取消</el-button>
      </div>
    </div>
    <div class="section-content">
      <div class="config-row">
        <span>V2EX登录状态</span>
        <div>{{ v2exstatus }}</div>
      </div>
      <div>
        <el-button @click="onV2exBackground">后台</el-button>
        <el-button disabled @click="onV2exCheck">检查</el-button>
        <el-button @click="onV2exRestart">重启后台（调试）</el-button>
      </div>
    </div>
    <div class="section-content history-section">
      <el-input ref="textareaRef" type="textarea" :model-value="displayText" readonly />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
const { ipcRenderer } = window.electron

const threshold = ref(50)
const interval = ref(120)
const autoStart = ref(false)
const v2exstatus = ref('准备中...')
const textareaRef = ref()

// const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const saveConfig = async (): Promise<void> => {
  // 保存配置
  const config = {
    dau_threshold: Number(threshold.value),
    refresh_interval: Number(interval.value),
    show_mainwindow: autoStart.value as boolean
  }
  console.log('SaveConfig config:', config)
  await window.api.saveConfig(config)

  ElMessage({
    message: '保存配置成功',
    type: 'success',
    duration: 3000,
    showClose: true
  })
}

const readConfig = async (tip: boolean = true): Promise<void> => {
  // 读取配置
  const result = await window.api.readConfig()
  console.log('ReadConfig result:', result)
  threshold.value = result.dau_threshold
  interval.value = result.refresh_interval
  autoStart.value = result.show_mainwindow

  if (tip) {
    ElMessage({
      message: '重新读取配置成功',
      type: 'success',
      duration: 3000,
      showClose: true
    })
  }
}

const onV2exBackground = async (): Promise<void> => {
  console.log('onV2exBackground called')
  await window.api.v2exBackground()
}

const onV2exCheck = async (): Promise<void> => {
  console.log('onV2exCheck called')
  await window.api.v2exCheck()
}

const onV2exRestart = async (): Promise<void> => {
  console.log('onV2exRestart called')
  await window.api.v2exRestart()
}

// const _add_line = async (line: string): Promise<void> => {
//   textarea.value += line + '\n'
//   // 滚动到底部
//   const textareaElement = document.querySelector(
//     '.history-section .el-textarea__inner'
//   ) as HTMLElement
//   if (textareaElement) {
//     textareaElement.scrollTop = textareaElement.scrollHeight
//   }
// }

///////////////////////////////////////////////////////////////
// 每一行一条，最新在最前
const lines = ref<string[]>([])

// 最多 100 行
const MAX_LINES = 5

// 展示给 el-input 的内容
const displayText = computed(() => {
  return lines.value.slice().reverse().join('\n')
})

// 添加新行（外部调用）
let debugcnt = 0
function _add_line(_text: string): void {
  const text = '[' + String(++debugcnt).padStart(6, '0') + ']  ' + _text
  lines.value.push(text)

  if (lines.value.length > MAX_LINES) {
    lines.value.shift()
  }

  // 等 DOM 更新后，把滚动条拉回顶部
  nextTick(() => {
    const textarea = textareaRef.value?.textarea || textareaRef.value?.$refs?.textarea

    if (textarea) {
      textarea.scrollTop = 0
    }
  })
}

onMounted(async () => {
  await readConfig(false)

  // 监听主进程的V2exMessage消息
  ipcRenderer.on('V2exStatusMessage', async (_event, message) => {
    // console.log('Received V2exStatusMessage message: ', message)
    _add_line(message)
    v2exstatus.value = message
  })

  // 监听主进程的V2exDAUStatus消息
  ipcRenderer.on('V2exDAUMessage', async (_event, message) => {
    // console.log('Received V2exDAUMessage message: ', message)
    const linestr =
      '[' +
      message.timeStr +
      ']  用户名：' +
      message.username +
      '，当前活跃度：' +
      message.dau +
      '，是否停止：' +
      message.isFinish
    for (let i = 0; i < 1; i++) {
      _add_line(linestr)
    }
  })

  // 隐藏 loading，显示 app
  const loadingOverlay = document.getElementById('loading-overlay')
  const appElement = document.getElementById('app')

  if (loadingOverlay) {
    loadingOverlay.style.display = 'none'
  }
  if (appElement) {
    appElement.style.display = 'block'
  }
})

// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  width: 100%;
}

.section-content {
  padding: 20px;
  border-bottom: 1px solid #eee;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.section-content:last-child {
  flex: 1;
  border-bottom: none;
}

.history-section {
  min-height: 0;
}

.history-section :deep(.el-textarea) {
  height: 100%;
  max-width: 1200px;
  width: 100%;
}

.history-section :deep(.el-textarea__inner) {
  height: 100%;
  resize: none;
  background-color: #f5f5f5;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-row span {
  width: 150px;
}
</style>
