<script setup lang="ts">
import { ref } from 'vue'
import { useCharacterStore } from '@/stores'
import PixelCard from '@/components/common/PixelCard.vue'
import PixelButton from '@/components/common/PixelButton.vue'
import PixelInput from '@/components/common/PixelInput.vue'
import PixelProgressBar from '@/components/common/PixelProgressBar.vue'

const characterStore = useCharacterStore()

const isEditingName = ref(false)
const newName = ref('')

const character = characterStore.character

function startEditName() {
  newName.value = character?.name || ''
  isEditingName.value = true
}

function saveName() {
  if (newName.value.trim()) {
    characterStore.renameCharacter(newName.value.trim())
  }
  isEditingName.value = false
}

function cancelEdit() {
  isEditingName.value = false
}
</script>

<template>
  <div class="character-view">
    <h1 class="page-title">角色信息</h1>
    
    <div class="character-layout">
      <PixelCard class="character-card" variant="primary">
        <div class="character-avatar">
          <div class="avatar-frame">
            <span class="avatar-icon">🧙</span>
          </div>
          <div v-if="isEditingName" class="name-edit">
            <PixelInput v-model="newName" placeholder="输入新名称" />
            <div class="name-edit__actions">
              <PixelButton size="small" type="success" @click="saveName">保存</PixelButton>
              <PixelButton size="small" @click="cancelEdit">取消</PixelButton>
            </div>
          </div>
          <div v-else class="character-name" @click="startEditName">
            {{ character?.name }}
            <span class="edit-hint">✎</span>
          </div>
          <div class="character-level">Lv.{{ character?.level }}</div>
        </div>
      </PixelCard>
      
      <div class="stats-section">
        <PixelCard title="经验值">
          <div class="exp-info">
            <div class="exp-numbers">
              {{ character?.experience }} / {{ character?.experienceToNextLevel }}
            </div>
            <PixelProgressBar
              :percent="characterStore.experiencePercent"
              color="var(--color-accent)"
            />
          </div>
        </PixelCard>
        
        <PixelCard title="金币">
          <div class="gold-display">
            <span class="gold-icon">💰</span>
            <span class="gold-value">{{ character?.gold }}</span>
            <span class="gold-label">G</span>
          </div>
        </PixelCard>
        
        <PixelCard title="统计数据">
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-label">完成任务总数</span>
              <span class="stat-value">{{ character?.stats.totalTasksCompleted }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">当前连续天数</span>
              <span class="stat-value">{{ character?.stats.currentStreak }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">最长连续天数</span>
              <span class="stat-value">{{ character?.stats.longestStreak }}</span>
            </div>
          </div>
        </PixelCard>
      </div>
      
      <PixelCard title="装备" class="equipment-card">
        <div class="equipment-slots">
          <div class="equipment-slot">
            <span class="slot-icon">⚔️</span>
            <span class="slot-label">武器</span>
            <span class="slot-value">{{ character?.equipment.weapon || '无' }}</span>
          </div>
          <div class="equipment-slot">
            <span class="slot-icon">🛡️</span>
            <span class="slot-label">护甲</span>
            <span class="slot-value">{{ character?.equipment.armor || '无' }}</span>
          </div>
          <div class="equipment-slot">
            <span class="slot-icon">💍</span>
            <span class="slot-label">饰品</span>
            <span class="slot-value">{{ character?.equipment.accessory || '无' }}</span>
          </div>
        </div>
      </PixelCard>
    </div>
  </div>
</template>

<style scoped>
.character-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-title {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.character-layout {
  display: grid;
  gap: 24px;
}

@media (min-width: 768px) {
  .character-layout {
    grid-template-columns: 300px 1fr;
    grid-template-rows: auto auto;
  }
  
  .equipment-card {
    grid-column: span 2;
  }
}

.character-card {
  text-align: center;
}

.character-avatar {
  padding: 20px;
}

.avatar-frame {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  background-color: var(--color-bg);
  border: 4px solid var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.avatar-frame::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: -4px;
  bottom: -4px;
  border: 4px solid rgba(233, 69, 96, 0.3);
}

.avatar-icon {
  font-size: 60px;
}

.character-name {
  font-size: 18px;
  margin-bottom: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.edit-hint {
  font-size: 12px;
  opacity: 0.5;
}

.character-name:hover .edit-hint {
  opacity: 1;
}

.name-edit {
  margin-bottom: 12px;
}

.name-edit__actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.character-level {
  font-size: 14px;
  color: var(--color-accent);
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exp-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exp-numbers {
  font-size: 12px;
  text-align: center;
}

.gold-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
}

.gold-icon {
  font-size: 32px;
}

.gold-value {
  font-size: 28px;
  font-weight: bold;
}

.gold-label {
  font-size: 14px;
  color: var(--color-text-muted);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 2px solid var(--color-bg);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.stat-value {
  font-size: 14px;
}

.equipment-slots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.equipment-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
}

.slot-icon {
  font-size: 28px;
}

.slot-label {
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.slot-value {
  font-size: 12px;
  text-align: center;
}
</style>
