<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharacterStore } from '@/stores'
import type { InventoryItem } from '@/types'
import { RARITY_COLORS } from '@/types'
import PixelCard from '@/components/common/PixelCard.vue'
import PixelButton from '@/components/common/PixelButton.vue'
import PixelInput from '@/components/common/PixelInput.vue'
import PixelProgressBar from '@/components/common/PixelProgressBar.vue'
import PixelModal from '@/components/common/PixelModal.vue'
import ItemDetail from '@/components/character/ItemDetail.vue'

const characterStore = useCharacterStore()

const isEditingName = ref(false)
const newName = ref('')
const showItemModal = ref(false)
const showExpandModal = ref(false)
const selectedItem = ref<InventoryItem | null>(null)

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

function openItemDetail(item: InventoryItem) {
  if (item.type === 'gold') return
  selectedItem.value = item
  showItemModal.value = true
}

function closeItemModal() {
  showItemModal.value = false
  selectedItem.value = null
}

function handleUseItem(item: InventoryItem) {
  console.log('使用物品:', item.name)
  closeItemModal()
}

function handleDropItem(item: InventoryItem) {
  if (confirm(`确定要丢弃 ${item.name} x${item.quantity} 吗？`)) {
    characterStore.removeItem(item.id, item.quantity)
    closeItemModal()
  }
}

function openExpandModal() {
  showExpandModal.value = true
}

function closeExpandModal() {
  showExpandModal.value = false
}

function handleExpand() {
  if (characterStore.expandBackpack()) {
    closeExpandModal()
  } else {
    alert('金币不足！')
  }
}

const expansionCost = computed(() => characterStore.getExpansionCost())
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
      
      <PixelCard class="backpack-card">
        <template #default>
          <div class="backpack-header">
            <h3 class="backpack-title">背包</h3>
            <div class="backpack-info">
              <span>{{ characterStore.usedSlots }} / {{ characterStore.backpackSlots }} 格</span>
              <PixelButton size="small" @click="openExpandModal">扩展</PixelButton>
            </div>
          </div>
          
          <div class="backpack-grid">
            <div
              v-for="item in character?.inventory"
              :key="item.id"
              class="backpack-slot backpack-slot--filled"
              :class="{ 'backpack-slot--gold': item.type === 'gold' }"
              @click="openItemDetail(item)"
            >
              <span class="slot-icon">{{ item.icon }}</span>
              <span v-if="item.quantity > 1" class="slot-quantity">{{ item.quantity }}</span>
              <span 
                class="slot-rarity" 
                :style="{ backgroundColor: RARITY_COLORS[item.rarity] }"
              ></span>
            </div>
            
            <div
              v-for="n in (characterStore.backpackSlots - characterStore.usedSlots)"
              :key="'empty-' + n"
              class="backpack-slot backpack-slot--empty"
            >
              <span class="slot-empty">+</span>
            </div>
          </div>
        </template>
      </PixelCard>
    </div>
    
    <PixelModal v-model:show="showItemModal" title="物品详情">
      <ItemDetail
        v-if="selectedItem"
        :item="selectedItem"
        @close="closeItemModal"
        @use="handleUseItem"
        @drop="handleDropItem"
      />
    </PixelModal>
    
    <PixelModal v-model:show="showExpandModal" title="扩展背包">
      <div class="expand-modal">
        <p>扩展 {{ 6 }} 格背包空间</p>
        <p class="expand-cost">花费: 💰 {{ expansionCost }} G</p>
        <p class="expand-current">当前金币: 💰 {{ characterStore.gold }} G</p>
        <div class="expand-actions">
          <PixelButton
            type="primary"
            :disabled="characterStore.gold < expansionCost"
            @click="handleExpand"
          >
            确认扩展
          </PixelButton>
          <PixelButton @click="closeExpandModal">取消</PixelButton>
        </div>
      </div>
    </PixelModal>
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
  
  .backpack-card {
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

.backpack-card {
  padding: 0;
}

.backpack-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--color-bg-tertiary);
  border-bottom: 4px solid var(--color-text);
}

.backpack-title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.backpack-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
}

.backpack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 8px;
  padding: 16px;
}

.backpack-slot {
  width: 64px;
  height: 64px;
  background-color: var(--color-bg);
  border: 4px solid var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.1s ease;
}

.backpack-slot--empty {
  cursor: default;
  border-style: dashed;
}

.backpack-slot--empty:hover {
  border-color: var(--color-text);
}

.backpack-slot--filled {
  border-style: solid;
}

.backpack-slot--filled:hover {
  transform: translate(-2px, -2px);
  border-color: var(--color-primary);
}

.backpack-slot--gold {
  background-color: rgba(251, 191, 36, 0.1);
  border-color: var(--color-accent);
}

.slot-icon {
  font-size: 28px;
}

.slot-quantity {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 10px;
  color: var(--color-text);
  text-shadow: 1px 1px 0 var(--color-bg);
}

.slot-rarity {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
}

.slot-empty {
  font-size: 24px;
  color: var(--color-text-muted);
}

.expand-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.expand-cost {
  font-size: 14px;
  color: var(--color-accent);
}

.expand-current {
  font-size: 11px;
  color: var(--color-text-muted);
}

.expand-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}
</style>
