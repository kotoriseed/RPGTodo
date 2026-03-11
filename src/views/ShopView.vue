<script setup lang="ts">
import { ref } from 'vue'
import { useShopStore, useCharacterStore } from '@/stores'
import type { ShopItem } from '@/types'
import { RARITY_COLORS, RARITY_LABELS, ITEM_TYPE_LABELS } from '@/types'
import PixelCard from '@/components/common/PixelCard.vue'
import PixelButton from '@/components/common/PixelButton.vue'
import PixelInput from '@/components/common/PixelInput.vue'
import PixelSelect from '@/components/common/PixelSelect.vue'
import PixelModal from '@/components/common/PixelModal.vue'

const shopStore = useShopStore()
const characterStore = useCharacterStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showBuyModal = ref(false)
const editingItem = ref<ShopItem | null>(null)
const buyingItem = ref<ShopItem | null>(null)
const buyQuantity = ref(1)

const newItemName = ref('')
const newItemIcon = ref('📦')
const newItemPrice = ref('100')
const newItemStock = ref('1')
const newItemDesc = ref('')
const newItemRarity = ref<'common' | 'rare' | 'epic' | 'legendary'>('common')
const newItemType = ref<'material' | 'consumable' | 'equipment'>('material')

const editName = ref('')
const editIcon = ref('')
const editPrice = ref('0')
const editStock = ref('0')
const editDesc = ref('')
const editRarity = ref<'common' | 'rare' | 'epic' | 'legendary'>('common')
const editType = ref<'material' | 'consumable' | 'equipment'>('material')

const rarityOptions = [
  { value: 'common', label: '普通' },
  { value: 'rare', label: '稀有' },
  { value: 'epic', label: '史诗' },
  { value: 'legendary', label: '传说' }
]

const itemTypeOptions = [
  { value: 'material', label: '材料' },
  { value: 'consumable', label: '消耗品' },
  { value: 'equipment', label: '装备' }
]

function resetNewItem() {
  newItemName.value = ''
  newItemIcon.value = '📦'
  newItemPrice.value = '100'
  newItemStock.value = '1'
  newItemDesc.value = ''
  newItemRarity.value = 'common'
  newItemType.value = 'material'
}

function openAddModal() {
  resetNewItem()
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
}

function handleAdd() {
  if (!newItemName.value.trim()) return
  
  const item: ShopItem = {
    id: Date.now().toString(36),
    name: newItemName.value,
    icon: newItemIcon.value,
    price: parseInt(newItemPrice.value) || 0,
    stock: parseInt(newItemStock.value) || 0,
    description: newItemDesc.value,
    rarity: newItemRarity.value,
    itemType: newItemType.value
  }
  shopStore.items.push(item)
  shopStore.saveShop()
  closeAddModal()
}

function openEditModal(item: ShopItem) {
  editingItem.value = item
  editName.value = item.name
  editIcon.value = item.icon
  editPrice.value = String(item.price)
  editStock.value = String(item.stock)
  editDesc.value = item.description
  editRarity.value = item.rarity
  editType.value = item.itemType
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingItem.value = null
}

function handleEdit() {
  if (!editingItem.value) return
  
  const index = shopStore.items.findIndex(i => i.id === editingItem.value!.id)
  if (index !== -1) {
    shopStore.items[index] = {
      ...editingItem.value,
      name: editName.value,
      icon: editIcon.value,
      price: parseInt(editPrice.value) || 0,
      stock: parseInt(editStock.value) || 0,
      description: editDesc.value,
      rarity: editRarity.value,
      itemType: editType.value
    }
    shopStore.saveShop()
  }
  closeEditModal()
}

function handleDelete(id: string) {
  if (confirm('确定要删除这个商品吗？')) {
    const index = shopStore.items.findIndex(i => i.id === id)
    if (index !== -1) {
      shopStore.items.splice(index, 1)
      shopStore.saveShop()
    }
  }
}

function openBuyModal(item: ShopItem) {
  buyingItem.value = item
  buyQuantity.value = 1
  showBuyModal.value = true
}

function closeBuyModal() {
  showBuyModal.value = false
  buyingItem.value = null
}

function handleBuy() {
  if (!buyingItem.value) return
  
  const totalCost = buyingItem.value.price * buyQuantity.value
  if (buyingItem.value.stock < buyQuantity.value) {
    alert('库存不足！')
    return
  }
  if (characterStore.gold < totalCost) {
    alert('金币不足！')
    return
  }
  
  characterStore.spendGold(totalCost)
  buyingItem.value.stock -= buyQuantity.value
  shopStore.saveShop()
  
  const inventoryItem = {
    id: Date.now().toString(36),
    name: buyingItem.value.name,
    type: buyingItem.value.itemType,
    rarity: buyingItem.value.rarity,
    description: buyingItem.value.description,
    icon: buyingItem.value.icon,
    quantity: buyQuantity.value,
    maxStack: buyingItem.value.itemType === 'consumable' ? 20 : 99
  }
  characterStore.addItem(inventoryItem)
  
  closeBuyModal()
}

function getTotalCost(): number {
  if (!buyingItem.value) return 0
  return buyingItem.value.price * buyQuantity.value
}

function canBuy(): boolean {
  if (!buyingItem.value) return false
  return getTotalCost() <= characterStore.gold && buyQuantity.value <= buyingItem.value.stock
}
</script>

<template>
  <div class="shop-view">
    <div class="shop-header">
      <h1 class="page-title">商店</h1>
      <div class="shop-gold">
        <span class="gold-icon">💰</span>
        <span class="gold-value">{{ characterStore.gold }} G</span>
      </div>
    </div>
    
    <PixelCard title="商品列表">
      <div class="shop-actions">
        <PixelButton type="primary" size="small" @click="openAddModal">
          + 添加商品
        </PixelButton>
      </div>
      
      <div v-if="shopStore.items.length === 0" class="shop-empty">
        <span>暂无商品</span>
      </div>
      
      <div v-else class="shop-grid">
        <div
          v-for="item in shopStore.items"
          :key="item.id"
          class="shop-item"
          :class="{ 'shop-item--out-of-stock': item.stock <= 0 }"
        >
          <div class="item-icon">{{ item.icon }}</div>
          <div class="item-info">
            <h4 class="item-name" :style="{ color: RARITY_COLORS[item.rarity] }">
              {{ item.name }}
            </h4>
            <p class="item-desc">{{ item.description }}</p>
            <div class="item-meta">
              <span class="item-price">💰 {{ item.price }} G</span>
              <span class="item-stock">库存: {{ item.stock }}</span>
            </div>
            <div class="item-tags">
              <span class="item-tag">{{ RARITY_LABELS[item.rarity] }}</span>
              <span class="item-tag">{{ ITEM_TYPE_LABELS[item.itemType] }}</span>
            </div>
          </div>
          <div class="item-actions">
            <PixelButton
              size="small"
              type="primary"
              :disabled="item.stock <= 0 || characterStore.gold < item.price"
              @click="openBuyModal(item)"
            >
              购买
            </PixelButton>
            <PixelButton size="small" @click="openEditModal(item)">编辑</PixelButton>
            <PixelButton size="small" type="danger" @click="handleDelete(item.id)">删除</PixelButton>
          </div>
        </div>
      </div>
    </PixelCard>
    
    <PixelModal v-model:show="showAddModal" title="添加商品">
      <div class="modal-form">
        <PixelInput v-model="newItemName" label="商品名称" placeholder="输入名称" />
        <PixelInput v-model="newItemIcon" label="图标(emoji)" placeholder="如: 🧪" />
        <PixelInput v-model="newItemPrice" label="价格" placeholder="输入金币数" />
        <PixelInput v-model="newItemStock" label="库存" placeholder="输入数量" />
        <PixelSelect v-model="newItemRarity" label="稀有度" :options="rarityOptions" />
        <PixelSelect v-model="newItemType" label="类型" :options="itemTypeOptions" />
        <PixelInput v-model="newItemDesc" label="描述" type="textarea" placeholder="商品描述" />
        <div class="modal-actions">
          <PixelButton type="primary" @click="handleAdd">添加</PixelButton>
          <PixelButton @click="closeAddModal">取消</PixelButton>
        </div>
      </div>
    </PixelModal>
    
    <PixelModal v-model:show="showEditModal" title="编辑商品">
      <div class="modal-form">
        <PixelInput v-model="editName" label="商品名称" />
        <PixelInput v-model="editIcon" label="图标" />
        <PixelInput v-model="editPrice" label="价格" />
        <PixelInput v-model="editStock" label="库存" />
        <PixelSelect v-model="editRarity" label="稀有度" :options="rarityOptions" />
        <PixelSelect v-model="editType" label="类型" :options="itemTypeOptions" />
        <PixelInput v-model="editDesc" label="描述" type="textarea" />
        <div class="modal-actions">
          <PixelButton type="primary" @click="handleEdit">保存</PixelButton>
          <PixelButton @click="closeEditModal">取消</PixelButton>
        </div>
      </div>
    </PixelModal>
    
    <PixelModal v-model:show="showBuyModal" title="购买商品">
      <div v-if="buyingItem" class="buy-modal">
        <div class="buy-preview">
          <span class="buy-icon">{{ buyingItem.icon }}</span>
          <span class="buy-name" :style="{ color: RARITY_COLORS[buyingItem.rarity] }">
            {{ buyingItem.name }}
          </span>
        </div>
        <div class="buy-info">
          <p>单价: {{ buyingItem.price }} G</p>
          <p>库存: {{ buyingItem.stock }}</p>
        </div>
        <div class="buy-quantity">
          <span>购买数量:</span>
          <button @click="buyQuantity = Math.max(1, buyQuantity - 1)">-</button>
          <span class="quantity-value">{{ buyQuantity }}</span>
          <button @click="buyQuantity = Math.min(buyingItem.stock, buyQuantity + 1)">+</button>
        </div>
        <div class="buy-total">
          总计: <span class="total-cost">{{ getTotalCost() }} G</span>
        </div>
        <div class="buy-actions">
          <PixelButton type="primary" :disabled="!canBuy()" @click="handleBuy">
            确认购买
          </PixelButton>
          <PixelButton @click="closeBuyModal">取消</PixelButton>
        </div>
      </div>
    </PixelModal>
  </div>
</template>

<style scoped>
.shop-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.shop-gold {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--color-bg-secondary);
  border: 4px solid var(--color-accent);
}

.gold-icon {
  font-size: 20px;
}

.gold-value {
  font-size: 14px;
  color: var(--color-accent);
}

.shop-actions {
  margin-bottom: 16px;
}

.shop-empty {
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
}

.shop-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shop-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-bg);
  border: 4px solid var(--color-text);
}

.shop-item--out-of-stock {
  opacity: 0.5;
  border-color: var(--color-text-muted);
}

.item-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-text);
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: none;
}

.item-desc {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  gap: 16px;
  font-size: 11px;
  margin-bottom: 8px;
}

.item-price {
  color: var(--color-accent);
}

.item-stock {
  color: var(--color-text-muted);
}

.item-tags {
  display: flex;
  gap: 8px;
}

.item-tag {
  font-size: 10px;
  padding: 2px 8px;
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-text-muted);
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.buy-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.buy-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.buy-icon {
  font-size: 40px;
}

.buy-name {
  font-size: 16px;
}

.buy-info {
  font-size: 12px;
  color: var(--color-text-muted);
}

.buy-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.buy-quantity button {
  width: 32px;
  height: 32px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
  color: var(--color-text);
  font-size: 18px;
  cursor: pointer;
}

.buy-quantity button:hover {
  background-color: var(--color-bg-tertiary);
}

.quantity-value {
  font-size: 16px;
  min-width: 40px;
  text-align: center;
}

.buy-total {
  font-size: 14px;
}

.total-cost {
  color: var(--color-accent);
  font-weight: bold;
}

.buy-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .shop-item {
    flex-direction: column;
  }
  
  .item-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
