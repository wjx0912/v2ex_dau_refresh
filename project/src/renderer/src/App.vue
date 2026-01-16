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
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
    <div class="section-content">
      <div>V2EX登录状态： 2026.1.15 12:13:13</div>
      <div>
        <el-button type="primary">登录</el-button>
        <el-button>登出</el-button>
      </div>
    </div>
    <div class="section-content history-section">
      <el-input v-model="textarea" type="textarea" placeholder="历史记录" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { sleep } from './util'

const textarea = ref('')
const threshold = ref(50)
const interval = ref(120)
const autoStart = ref(false)
// await sleep(3000)
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
  width: 100px;
}
</style>
