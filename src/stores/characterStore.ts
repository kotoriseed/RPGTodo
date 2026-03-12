import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character, RewardResult, InventoryItem } from '@/types'
import { DEFAULT_BACKPACK_SLOTS, SLOTS_PER_EXPANSION, BASE_EXPANSION_COST } from '@/types'
import { saveData, loadData } from '@/services/storageService'
import { checkLevelUp, calculateExperienceToNextLevel } from '@/services/rewardService'
import { generateId } from '@/utils/dateUtils'

const STORAGE_KEY = 'character'

const DEFAULT_CHARACTER: Character = {
  id: '',
  name: '勇者',
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  gold: 0,
  inventory: [],
  backpackSlots: DEFAULT_BACKPACK_SLOTS,
  stats: {
    totalTasksCompleted: 0,
    longestStreak: 0,
    currentStreak: 0,
    lastCompletedDate: null as string | null
  },
  createdAt: new Date().toISOString()
}

export const useCharacterStore = defineStore('character', () => {
  const character = ref<Character | null>(null)
  const loading = ref(false)

  const level = computed(() => character.value?.level ?? 1)
  const experience = computed(() => character.value?.experience ?? 0)
  const gold = computed(() => character.value?.gold ?? 0)
  const experiencePercent = computed(() => {
    if (!character.value) return 0
    return (character.value.experience / character.value.experienceToNextLevel) * 100
  })

  const backpackSlots = computed(() => character.value?.backpackSlots ?? DEFAULT_BACKPACK_SLOTS)
  const usedSlots = computed(() => character.value?.inventory.length ?? 0)
  const hasAvailableSlots = computed(() => usedSlots.value < backpackSlots.value)

  const goldItem = computed(() => {
    const gold = character.value?.inventory.find(item => item.type === 'gold')
    return gold
  })

  function loadCharacter(): void {
    loading.value = true
    try {
      const saved = loadData<Character | null>(STORAGE_KEY, null)
      if (saved) {
        character.value = {
          ...saved,
          backpackSlots: saved.backpackSlots ?? DEFAULT_BACKPACK_SLOTS
        }
      } else {
        initCharacter()
      }
    } catch (e) {
      console.error('Failed to load character:', e)
      initCharacter()
    } finally {
      loading.value = false
    }
  }

  function initCharacter(): void {
    character.value = {
      ...DEFAULT_CHARACTER,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    saveCharacter()
  }

  function saveCharacter(): void {
    if (character.value) {
      saveData(STORAGE_KEY, character.value)
    }
  }

  function addReward(experience: number, gold: number, items: InventoryItem[] = []): RewardResult {
    if (!character.value) {
      return { experience: 0, gold: 0, leveledUp: false }
    }

    const result = checkLevelUp(
      character.value.level,
      character.value.experience,
      experience
    )

    character.value.level = result.newLevel
    character.value.experience = result.newExperience
    character.value.experienceToNextLevel = calculateExperienceToNextLevel(result.newLevel)
    character.value.stats.totalTasksCompleted++

    addGold(gold)

    const addedItems: InventoryItem[] = []
    items.forEach(item => {
      if (addItem(item)) {
        addedItems.push(item)
      }
    })

    saveCharacter()

    return {
      experience,
      gold,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      items: addedItems
    }
  }

  function addGold(amount: number): void {
    if (!character.value) return

    character.value.gold += amount

    const existingGold = character.value.inventory.find(item => item.type === 'gold')
    if (existingGold) {
      existingGold.quantity += amount
    } else {
      character.value.inventory.unshift({
        id: generateId(),
        name: '金币',
        type: 'gold',
        rarity: 'common',
        description: '通用货币，可用于购买物品和扩展背包',
        icon: '💰',
        quantity: amount,
        maxStack: 999999
      })
    }
  }

  function spendGold(amount: number): boolean {
    if (!character.value || character.value.gold < amount) {
      return false
    }
    character.value.gold -= amount

    const goldItem = character.value.inventory.find(item => item.type === 'gold')
    if (goldItem) {
      goldItem.quantity -= amount
      if (goldItem.quantity <= 0) {
        const index = character.value.inventory.findIndex(item => item.type === 'gold')
        if (index !== -1) {
          character.value.inventory.splice(index, 1)
        }
      }
    }

    saveCharacter()
    return true
  }

  function getExpansionCost(): number {
    const currentSlots = character.value?.backpackSlots ?? DEFAULT_BACKPACK_SLOTS
    const expansions = (currentSlots - DEFAULT_BACKPACK_SLOTS) / SLOTS_PER_EXPANSION
    return BASE_EXPANSION_COST * Math.pow(2, expansions)
  }

  function expandBackpack(): boolean {
    if (!character.value) return false

    const cost = getExpansionCost()
    if (!spendGold(cost)) return false

    character.value.backpackSlots += SLOTS_PER_EXPANSION
    saveCharacter()
    return true
  }

  function addItem(item: InventoryItem): boolean {
    if (!character.value) return false

    if (item.type === 'gold') {
      addGold(item.quantity)
      return true
    }

    const existingItem = character.value.inventory.find(
      i => i.name === item.name && i.type === item.type && i.quantity < i.maxStack
    )

    if (existingItem) {
      const space = existingItem.maxStack - existingItem.quantity
      const toAdd = Math.min(space, item.quantity)
      existingItem.quantity += toAdd
      
      if (toAdd < item.quantity) {
        if (!hasAvailableSlots.value) return false
        const remainingItem: InventoryItem = {
          ...item,
          id: generateId(),
          quantity: item.quantity - toAdd
        }
        character.value.inventory.push(remainingItem)
      }
    } else {
      if (!hasAvailableSlots.value) return false
      character.value.inventory.push({
        ...item,
        id: generateId()
      })
    }

    saveCharacter()
    return true
  }

  function removeItem(itemId: string, quantity: number = 1): boolean {
    if (!character.value) return false

    const index = character.value.inventory.findIndex(i => i.id === itemId)
    if (index === -1) return false

    const item = character.value.inventory[index]
    if (item.quantity <= quantity) {
      character.value.inventory.splice(index, 1)
    } else {
      item.quantity -= quantity
    }

    saveCharacter()
    return true
  }

  function getItemById(itemId: string): InventoryItem | undefined {
    return character.value?.inventory.find(i => i.id === itemId)
  }

  function updateStreak(completed: boolean): void {
    if (!character.value) return

    const today = new Date().toDateString()
    const lastCompletedDate = character.value.stats.lastCompletedDate

    if (completed) {
      if (lastCompletedDate === today) {
        return
      }

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()

      if (lastCompletedDate === yesterdayStr) {
        character.value.stats.currentStreak++
      } else if (lastCompletedDate === null || lastCompletedDate !== yesterdayStr) {
        character.value.stats.currentStreak = 1
      }

      character.value.stats.lastCompletedDate = today

      if (character.value.stats.currentStreak > character.value.stats.longestStreak) {
        character.value.stats.longestStreak = character.value.stats.currentStreak
      }
    } else {
      character.value.stats.currentStreak = 0
    }

    saveCharacter()
  }

  function renameCharacter(newName: string): void {
    if (!character.value) return
    character.value.name = newName
    saveCharacter()
  }

  return {
    character,
    loading,
    level,
    experience,
    gold,
    experiencePercent,
    backpackSlots,
    usedSlots,
    hasAvailableSlots,
    goldItem,
    loadCharacter,
    initCharacter,
    addReward,
    addGold,
    spendGold,
    getExpansionCost,
    expandBackpack,
    addItem,
    removeItem,
    getItemById,
    updateStreak,
    renameCharacter
  }
})
