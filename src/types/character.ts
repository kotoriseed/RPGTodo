export interface Equipment {
  weapon: string | null
  armor: string | null
  accessory: string | null
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
  equipment: Equipment
  inventory: InventoryItem[]
  stats: CharacterStats
  createdAt: string
}

export interface InventoryItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'accessory' | 'consumable'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  description: string
  equipped: boolean
}

export interface RewardResult {
  experience: number
  gold: number
  leveledUp: boolean
  newLevel?: number
}
