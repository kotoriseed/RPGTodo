<script setup lang="ts">
import { useSettingsStore, useCharacterStore } from '@/stores'
import PixelCard from '@/components/common/PixelCard.vue'
import PixelButton from '@/components/common/PixelButton.vue'

const settingsStore = useSettingsStore()
const characterStore = useCharacterStore()

function clearData() {
  if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
    localStorage.clear()
    location.reload()
  }
}
</script>

<template>
  <div class="settings-view">
    <h1 class="page-title">设置</h1>
    
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
          {{ settingsStore.settings.theme === 'dark' ? '🌙 暗色' : '☀️ 亮色' }}
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
          {{ characterStore.character?.createdAt ? new Date(characterStore.character.createdAt).toLocaleDateString('zh-CN') : '-' }}
        </span>
      </div>
    </PixelCard>
    
    <PixelCard title="危险区域">
      <p class="warning-text">以下操作不可恢复，请谨慎操作！</p>
      <PixelButton type="danger" @click="clearData">
        清除所有数据
      </PixelButton>
    </PixelCard>
    
    <PixelCard title="关于">
      <div class="about-content">
        <h3>RPG Todo</h3>
        <p>版本: 1.0.0</p>
        <p>游戏化任务管理应用</p>
        <p class="copyright">© 2024 RPG Todo</p>
      </div>
    </PixelCard>
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
</style>
