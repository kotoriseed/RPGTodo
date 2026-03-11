<script setup lang="ts">
import type { InventoryItem } from '@/types'
import { RARITY_COLORS, RARITY_LABELS, ITEM_TYPE_LABELS } from '@/types'
import PixelButton from '@/components/common/PixelButton.vue'

defineProps<{
  item: InventoryItem
}>()

const emit = defineEmits<{
  close: []
  use: [item: InventoryItem]
  drop: [item: InventoryItem]
}>()
</script>

<template>
  <div class="item-detail">
    <div class="item-header">
      <span class="item-icon">{{ item.icon }}</span>
      <div class="item-info">
        <h3 class="item-name" :style="{ color: RARITY_COLORS[item.rarity] }">
          {{ item.name }}
        </h3>
        <div class="item-meta">
          <span class="item-rarity" :style="{ color: RARITY_COLORS[item.rarity] }">
            {{ RARITY_LABELS[item.rarity] }}
          </span>
          <span class="item-type">{{ ITEM_TYPE_LABELS[item.type] }}</span>
        </div>
      </div>
    </div>
    
    <div class="item-description">
      {{ item.description }}
    </div>
    
    <div class="item-quantity">
      数量: {{ item.quantity }} / {{ item.maxStack }}
    </div>
    
    <div class="item-actions">
      <PixelButton
        v-if="item.type === 'consumable'"
        type="primary"
        size="small"
        @click="emit('use', item)"
      >
        使用
      </PixelButton>
      <PixelButton
        type="danger"
        size="small"
        @click="emit('drop', item)"
      >
        丢弃
      </PixelButton>
      <PixelButton size="small" @click="emit('close')">
        关闭
      </PixelButton>
    </div>
  </div>
</template>

<style scoped>
.item-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.item-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  border: 4px solid var(--color-text);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  margin-bottom: 8px;
  text-transform: none;
}

.item-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
}

.item-rarity {
  font-weight: bold;
}

.item-type {
  color: var(--color-text-muted);
}

.item-description {
  padding: 12px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.item-quantity {
  font-size: 11px;
  color: var(--color-text-muted);
}

.item-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
