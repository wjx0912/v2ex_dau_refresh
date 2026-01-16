<template>
  <div class="main-container">
    <div class="section-content">
      <div class="config-row">
        <span>活跃度阈值</span>
        <el-input v-model="threshold" type="number" :min="0" :max="999999" style="width: 140px" />
      </div>
      <div class="config-row">
        <span>刷新间隔</span>
        <el-input v-model="interval" type="number" :min="30" :max="999999" style="width: 140px" />
      </div>
      <div class="config-row">
        <span>开机启动</span>
        <el-checkbox v-model="autoStart" />
      </div>
      <div>
        <el-button @click="saveConfig">保存</el-button>
        <el-button @click="readConfig">取消</el-button>
      </div>
    </div>
    <div class="section-content">
      <div class="config-row">
        <span>V2EX登录状态</span>
        <div>2026.1.15 12:13:13</div>
      </div>
      <div>
        <el-button>后台</el-button>
        <el-button>检查</el-button>
      </div>
    </div>
    <div class="section-content history-section">
      <el-input v-model="textarea" type="textarea" placeholder="历史记录" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const textarea = ref('')
const threshold = ref(50)
const interval = ref(120)
const autoStart = ref(false)

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

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

onMounted(async () => {
  await readConfig(false)

  // 模拟耗时操作
  await sleep(2000)

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
