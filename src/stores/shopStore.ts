import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShopItem } from '@/types'
import { saveData, loadData } from '@/services/storageService'

const STORAGE_KEY = 'shop'

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  { id: '1', name: '小型生命药水', icon: '🧪', price: 50, description: '恢复少量生命值', stock: 10, rarity: 'common', itemType: 'consumable' },
  { id: '2', name: '中型生命药水', icon: '🧪', price: 150, description: '恢复中等生命值', stock: 5, rarity: 'rare', itemType: 'consumable' },
  { id: '3', name: '大型生命药水', icon: '🧪', price: 400, description: '恢复大量生命值', stock: 2, rarity: 'epic', itemType: 'consumable' },
  { id: '4', name: '铁矿石', icon: '🪨', price: 20, description: '常见的铁矿石，可用于打造基础装备', stock: 50, rarity: 'common', itemType: 'material' },
  { id: '5', name: '精钢锭', icon: '🔩', price: 80, description: '精炼的钢材，可用于打造精良装备', stock: 20, rarity: 'rare', itemType: 'material' },
  { id: '6', name: '秘银矿', icon: '✨', price: 300, description: '稀有的秘银矿，可用于打造史诗装备', stock: 10, rarity: 'epic', itemType: 'material' },
  { id: '7', name: '龙鳞碎片', icon: '🐉', price: 500, description: '龙鳞的碎片，蕴含强大力量', stock: 5, rarity: 'epic', itemType: 'material' },
  { id: '8', name: '贤者之石', icon: '🔮', price: 1000, description: '传说中的炼金术至宝', stock: 1, rarity: 'legendary', itemType: 'material' }
]

export const useShopStore = defineStore('shop', () => {
  const items = ref<ShopItem[]>([])
  const loading = ref(false)

  function loadShop(): void {
    loading.value = true
    try {
      const saved = loadData<ShopItem[]>(STORAGE_KEY, [])
      if (saved.length > 0) {
        items.value = saved
      } else {
        items.value = DEFAULT_SHOP_ITEMS
        saveShop()
      }
    } catch {
      items.value = DEFAULT_SHOP_ITEMS
      saveShop()
    } finally {
      loading.value = false
    }
  }

  function saveShop(): void {
    saveData(STORAGE_KEY, items.value)
  }

  function buyItem(shopItem: ShopItem, characterStore: ReturnType<typeof import('@/stores/characterStore')['useCharacterStore']>): boolean {
    if (shopItem.stock <= 0) return false
    if (!characterStore.spendGold(shopItem.price)) return false
    
    shopItem.stock--
    saveShop()
    return true
  }

  function getItemById(id: string): ShopItem | undefined {
    return items.value.find(i => i.id === id)
  }

  return {
    items,
    loading,
    loadShop,
    saveShop,
    buyItem,
    getItemById
  }
})
