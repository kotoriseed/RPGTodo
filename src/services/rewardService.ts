import type { TaskDifficulty, Reward, InventoryItem, ItemRarity } from '@/types'

const REWARD_TABLE: Record<TaskDifficulty, Reward> = {
  easy: { experience: 10, gold: 5 },
  normal: { experience: 25, gold: 15 },
  hard: { experience: 50, gold: 30 },
  epic: { experience: 100, gold: 60 },
  legendary: { experience: 200, gold: 120 }
}

const ITEM_POOL: Record<ItemRarity, Omit<InventoryItem, 'id' | 'quantity'>[]> = {
  common: [
    { name: '铁矿石', type: 'material', rarity: 'common', description: '常见的铁矿石，可用于打造基础装备', icon: '🪨', maxStack: 99 },
    { name: '草药', type: 'material', rarity: 'common', description: '普通的草药，可用于炼制药剂', icon: '🌿', maxStack: 99 },
    { name: '小型生命药水', type: 'consumable', rarity: 'common', description: '恢复少量生命值', icon: '🧪', maxStack: 20 }
  ],
  rare: [
    { name: '精钢锭', type: 'material', rarity: 'rare', description: '精炼的钢材，可用于打造精良装备', icon: '🔩', maxStack: 50 },
    { name: '魔法水晶', type: 'material', rarity: 'rare', description: '蕴含魔力的水晶，可用于附魔', icon: '💎', maxStack: 50 },
    { name: '中型生命药水', type: 'consumable', rarity: 'rare', description: '恢复中等生命值', icon: '🧪', maxStack: 10 }
  ],
  epic: [
    { name: '秘银矿', type: 'material', rarity: 'epic', description: '稀有的秘银矿，可用于打造史诗装备', icon: '✨', maxStack: 30 },
    { name: '龙鳞碎片', type: 'material', rarity: 'epic', description: '龙鳞的碎片，蕴含强大力量', icon: '🐉', maxStack: 30 },
    { name: '大型生命药水', type: 'consumable', rarity: 'epic', description: '恢复大量生命值', icon: '🧪', maxStack: 5 }
  ],
  legendary: [
    { name: '贤者之石', type: 'material', rarity: 'legendary', description: '传说中的炼金术至宝', icon: '🔮', maxStack: 10 },
    { name: '龙心', type: 'material', rarity: 'legendary', description: '巨龙的心脏，蕴含无尽魔力', icon: '❤️‍🔥', maxStack: 10 },
    { name: '传说武器碎片', type: 'material', rarity: 'legendary', description: '传说武器的碎片，集齐可合成神兵', icon: '⚔️', maxStack: 5 }
  ]
}

const DROP_RATES: Record<TaskDifficulty, Record<ItemRarity, number>> = {
  easy: { common: 0.3, rare: 0.05, epic: 0, legendary: 0 },
  normal: { common: 0.4, rare: 0.1, epic: 0.02, legendary: 0 },
  hard: { common: 0.3, rare: 0.2, epic: 0.05, legendary: 0.01 },
  epic: { common: 0.2, rare: 0.3, epic: 0.1, legendary: 0.03 },
  legendary: { common: 0.1, rare: 0.3, epic: 0.2, legendary: 0.05 }
}

export function calculateReward(difficulty: TaskDifficulty): Reward {
  return { ...REWARD_TABLE[difficulty] }
}

export function generateItemDrops(difficulty: TaskDifficulty): InventoryItem[] {
  const drops: InventoryItem[] = []
  const rates = DROP_RATES[difficulty]

  for (const [rarity, rate] of Object.entries(rates)) {
    if (Math.random() < rate) {
      const itemRarity = rarity as ItemRarity
      const pool = ITEM_POOL[itemRarity]
      const randomItem = pool[Math.floor(Math.random() * pool.length)]
      
      drops.push({
        ...randomItem,
        id: '',
        quantity: 1
      })
    }
  }

  return drops
}

export function calculateExperienceToNextLevel(level: number): number {
  return 100 * level * level
}

export function checkLevelUp(
  currentLevel: number,
  currentExperience: number,
  gainedExperience: number
): { newLevel: number; newExperience: number; leveledUp: boolean } {
  let newLevel = currentLevel
  let newExperience = currentExperience + gainedExperience
  let leveledUp = false

  const maxLevel = 99

  while (newLevel < maxLevel) {
    const requiredExp = calculateExperienceToNextLevel(newLevel)
    if (newExperience >= requiredExp) {
      newExperience -= requiredExp
      newLevel++
      leveledUp = true
    } else {
      break
    }
  }

  if (newLevel >= maxLevel) {
    newExperience = 0
  }

  return { newLevel, newExperience, leveledUp }
}

export function calculateBattleDamage(
  tasksCompleted: number,
  totalTasks: number
): number {
  if (totalTasks === 0) return 0
  const baseDamage = tasksCompleted * 10
  const bonusMultiplier = 1 + (tasksCompleted / totalTasks) * 0.5
  return Math.floor(baseDamage * bonusMultiplier)
}
