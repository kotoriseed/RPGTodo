import type { TaskDifficulty, Reward } from '@/types'

const REWARD_TABLE: Record<TaskDifficulty, Reward> = {
  easy: { experience: 10, gold: 5 },
  normal: { experience: 25, gold: 15 },
  hard: { experience: 50, gold: 30 },
  epic: { experience: 100, gold: 60 },
  legendary: { experience: 200, gold: 120 }
}

export function calculateReward(difficulty: TaskDifficulty): Reward {
  return { ...REWARD_TABLE[difficulty] }
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
