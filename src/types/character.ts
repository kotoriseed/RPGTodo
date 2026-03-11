export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type ItemType = 'material' | 'consumable' | 'equipment' | 'gold'

export interface InventoryItem {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  description: string
  icon: string
  quantity: number
  maxStack: number
}

export interface CharacterStats {
  totalTasksCompleted: number
  longestStreak: number
  currentStreak: number
}

export interface Character {
  id: string
  name: string
  level: number
  experience: number
  experienceToNextLevel: number
  gold: number
  inventory: InventoryItem[]
  backpackSlots: number
  stats: CharacterStats
  createdAt: string
}

export interface RewardResult {
  experience: number
  gold: number
  leveledUp: boolean
  newLevel?: number
  items?: InventoryItem[]
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#ffffff',
  rare: '#60a5fa',
  epic: '#a78bfa',
  legendary: '#fbbf24'
}

export const RARITY_LABELS: Record<ItemRarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
}

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  material: '材料',
  consumable: '消耗品',
  equipment: '装备',
  gold: '金币'
}

export const DEFAULT_BACKPACK_SLOTS = 24
export const SLOTS_PER_EXPANSION = 6
export const BASE_EXPANSION_COST = 100
