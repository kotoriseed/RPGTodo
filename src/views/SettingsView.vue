<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore, useCharacterStore, useTaskStore } from '@/stores'
import PixelCard from '@/components/common/PixelCard.vue'
import PixelButton from '@/components/common/PixelButton.vue'
import PixelModal from '@/components/common/PixelModal.vue'
import { 
  exportAllData, 
  importAllData, 
  downloadJsonFile, 
  readJsonFile,
  clearAllData 
} from '@/services/storageService'

const settingsStore = useSettingsStore()
const characterStore = useCharacterStore()
const taskStore = useTaskStore()

const showImportModal = ref(false)
const importFile = ref<File | null>(null)
const importError = ref('')
const importSuccess = ref(false)

function handleExport() {
  const data = exportAllData()
  const filename = `rpgtodo-backup-${new Date().toISOString().split('T')[0]}.json`
  downloadJsonFile(data, filename)
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    importFile.value = target.files[0]
    importError.value = ''
  }
}

async function handleImport() {
  if (!importFile.value) {
    importError.value = '请先选择文件'
    return
  }

  try {
    const data = await readJsonFile(importFile.value)
    const success = importAllData(data)
    
    if (success) {
      importSuccess.value = true
      importError.value = ''
      setTimeout(() => {
        location.reload()
      }, 1500)
    } else {
      importError.value = '导入失败：数据格式无效'
    }
  } catch {
    importError.value = '导入失败：无法读取文件'
  }
}

function openImportModal() {
  showImportModal.value = true
  importFile.value = null
  importError.value = ''
  importSuccess.value = false
}

function closeImportModal() {
  showImportModal.value = false
}

function handleClearData() {
  if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
    clearAllData()
    location.reload()
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString('zh-CN')
}
</script>

<template>
  <div class="settings-view">
    <h1 class="page-title">设置</h1>
    
    <PixelCard title="数据管理">
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">导出配置</span>
          <span class="setting-desc">将所有数据导出为 JSON 文件</span>
        </div>
        <PixelButton size="small" type="primary" @click="handleExport">
          导出
        </PixelButton>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">导入配置</span>
          <span class="setting-desc">从 JSON 文件恢复数据</span>
        </div>
        <PixelButton size="small" @click="openImportModal">
          导入
        </PixelButton>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">数据统计</span>
          <span class="setting-desc">
            任务: {{ taskStore.tasks.length }} | 
            已完成: {{ taskStore.completedTasks.length }}
          </span>
        </div>
      </div>
    </PixelCard>
    
    <PixelCard title="显示设置">
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">音效</span>
          <span class="setting-desc">启用/禁用游戏音效</span>
        </div>
        <PixelButton
          size="small"
          :type="settingsStore.settings.soundEnabled ? 'success' : 'default'"
          @click="settingsStore.toggleSound"
        >
          {{ settingsStore.settings.soundEnabled ? '开启' : '关闭' }}
        </PixelButton>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">动画效果</span>
          <span class="setting-desc">启用/禁用动画效果</span>
        </div>
        <PixelButton
          size="small"
          :type="settingsStore.settings.animationsEnabled ? 'success' : 'default'"
          @click="settingsStore.toggleAnimations"
        >
          {{ settingsStore.settings.animationsEnabled ? '开启' : '关闭' }}
        </PixelButton>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">主题</span>
          <span class="setting-desc">切换明暗主题</span>
        </div>
        <PixelButton size="small" @click="settingsStore.toggleTheme">
          {{ settingsStore.settings.theme === 'dark' ? '暗色' : '亮色' }}
        </PixelButton>
      </div>
    </PixelCard>
    
    <PixelCard title="角色信息">
      <div class="info-item">
        <span class="info-label">角色ID</span>
        <span class="info-value">{{ characterStore.character?.id }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">创建时间</span>
        <span class="info-value">
          {{ characterStore.character?.createdAt ? formatDate(characterStore.character.createdAt) : '-' }}
        </span>
      </div>
    </PixelCard>
    
    <PixelCard title="危险区域">
      <p class="warning-text">以下操作不可恢复，请谨慎操作！</p>
      <PixelButton type="danger" @click="handleClearData">
        清除所有数据
      </PixelButton>
    </PixelCard>
    
    <PixelCard title="关于">
      <div class="about-content">
        <h3>RPG Todo</h3>
        <p>版本: 1.0.0</p>
        <p>游戏化任务管理应用</p>
        <p class="copyright">2024 RPG Todo</p>
      </div>
    </PixelCard>
    
    <PixelModal v-model:show="showImportModal" title="导入配置">
      <div class="import-modal">
        <div v-if="importSuccess" class="import-success">
          <span class="success-icon">✓</span>
          <p>导入成功！正在刷新页面...</p>
        </div>
        
        <div v-else class="import-form">
          <p class="import-hint">选择之前导出的 JSON 备份文件</p>
          
          <div class="file-input-wrapper">
            <input 
              type="file" 
              accept=".json"
              @change="handleFileSelect"
              class="file-input"
            />
            <div class="file-input-display">
              {{ importFile ? importFile.name : '点击选择文件' }}
            </div>
          </div>
          
          <p v-if="importError" class="import-error">{{ importError }}</p>
          
          <div class="import-actions">
            <PixelButton type="primary" @click="handleImport" :disabled="!importFile">
              确认导入
            </PixelButton>
            <PixelButton @click="closeImportModal">
              取消
            </PixelButton>
          </div>
        </div>
      </div>
    </PixelModal>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
}

.page-title {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 2px solid var(--color-bg);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-label {
  font-size: 12px;
}

.setting-desc {
  font-size: 10px;
  color: var(--color-text-muted);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 2px solid var(--color-bg);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.info-value {
  font-size: 11px;
  font-family: monospace;
}

.warning-text {
  font-size: 11px;
  color: var(--color-danger);
  margin-bottom: 16px;
}

.about-content {
  text-align: center;
  padding: 16px;
}

.about-content h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.about-content p {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.copyright {
  margin-top: 16px;
  font-size: 10px;
}

.import-modal {
  padding: 8px;
}

.import-hint {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.file-input-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-input-display {
  padding: 16px;
  background-color: var(--color-bg);
  border: 4px solid var(--color-text);
  text-align: center;
  font-size: 12px;
  color: var(--color-text-muted);
}

.import-error {
  font-size: 11px;
  color: var(--color-danger);
  margin-bottom: 16px;
}

.import-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.import-success {
  text-align: center;
  padding: 24px;
}

.success-icon {
  display: inline-block;
  font-size: 48px;
  color: var(--color-success);
  margin-bottom: 16px;
}

.import-success p {
  font-size: 12px;
}
</style>
