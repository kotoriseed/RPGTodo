export type BattleStatus = 'pending' | 'active' | 'completed'

export interface Boss {
  id: string
  name: string
  maxHp: number
  currentHp: number
  spriteUrl: string
}

export interface BattleResult {
  victory: boolean
  totalDamageDealt: number
  tasksCompleted: number
  experienceEarned: number
  goldEarned: number
}

export interface BossBattle {
  id: string
  boss: Boss
  playerDamage: number
  status: BattleStatus
  startTime: string
  endTime: string | null
  result: BattleResult | null
}

export interface BattleStats {
  tasksCompleted: number
  tasksTotal: number
  completionRate: number
}
