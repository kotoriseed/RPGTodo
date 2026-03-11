export interface ShopItem {
  id: string
  name: string
  icon: string
  price: number
  description: string
  stock: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  itemType: 'material' | 'consumable' | 'equipment'
}

export interface CreateShopItemDTO {
  name: string
  icon: string
  price: number
  description: string
  stock: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  itemType: 'material' | 'consumable' | 'equipment'
}
