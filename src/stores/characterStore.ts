import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character, RewardResult, InventoryItem } from '@/types'
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
  equipment: {
    weapon: null,
    armor: null,
    accessory: null
  },
  inventory: [],
  stats: {
    totalTasksCompleted: 0,
    longestStreak: 0,
    currentStreak: 0
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

  function loadCharacter(): void {
    loading.value = true
    try {
      const saved = loadData<Character | null>(STORAGE_KEY, null)
      if (saved) {
        character.value = saved
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

  function addReward(experience: number, gold: number): RewardResult {
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
    character.value.gold += gold
    character.value.stats.totalTasksCompleted++

    saveCharacter()

    return {
      experience,
      gold,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel
    }
  }

  function spendGold(amount: number): boolean {
    if (!character.value || character.value.gold < amount) {
      return false
    }
    character.value.gold -= amount
    saveCharacter()
    return true
  }

  function addItem(item: InventoryItem): void {
    if (!character.value) return
    character.value.inventory.push(item)
    saveCharacter()
  }

  function equipItem(itemId: string): boolean {
    if (!character.value) return false

    const itemIndex = character.value.inventory.findIndex(i => i.id === itemId)
    if (itemIndex === -1) return false

    const item = character.value.inventory[itemIndex]
    
    if (item.type === 'weapon') {
      if (character.value.equipment.weapon) {
        const oldItem = character.value.inventory.find(
          i => i.name === character.value!.equipment.weapon
        )
        if (oldItem) oldItem.equipped = false
      }
      character.value.equipment.weapon = item.name
    } else if (item.type === 'armor') {
      if (character.value.equipment.armor) {
        const oldItem = character.value.inventory.find(
          i => i.name === character.value!.equipment.armor
        )
        if (oldItem) oldItem.equipped = false
      }
      character.value.equipment.armor = item.name
    } else if (item.type === 'accessory') {
      if (character.value.equipment.accessory) {
        const oldItem = character.value.inventory.find(
          i => i.name === character.value!.equipment.accessory
        )
        if (oldItem) oldItem.equipped = false
      }
      character.value.equipment.accessory = item.name
    }

    item.equipped = true
    saveCharacter()
    return true
  }

  function updateStreak(completed: boolean): void {
    if (!character.value) return

    if (completed) {
      character.value.stats.currentStreak++
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
    loadCharacter,
    initCharacter,
    addReward,
    spendGold,
    addItem,
    equipItem,
    updateStreak,
    renameCharacter
  }
})
