<template>
  <div class="main-container">
    <div class="section-content">
      <div>活跃度阈值（数值输入框）</div>
      <div>刷新间隔（数值输入框）</div>
      <div>开机启动（checkbox）</div>
      <div>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
    <div class="section-content">
      <div>已登录 2026.1.15 12:13:13</div>
      <div>
        <el-button type="primary">登录</el-button>
        <el-button>登出</el-button>
      </div>
    </div>
    <div class="section-content">
      <el-input
        v-model="textarea"
        style="width: 100%"
        :rows="10"
        type="textarea"
        placeholder="历史记录"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const textarea = ref('')
// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
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
</style>
