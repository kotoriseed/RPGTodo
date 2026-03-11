export type TaskDifficulty = 'easy' | 'normal' | 'hard' | 'epic' | 'legendary'
export type TaskType = 'daily' | 'weekly' | 'custom'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed'

export interface Reward {
  experience: number
  gold: number
  items?: string[]
}

export interface Task {
  id: string
  title: string
  description: string
  difficulty: TaskDifficulty
  type: TaskType
  status: TaskStatus
  reward: Reward
  deadline: string | null
  parentTaskId: string | null
  subtaskIds: string[]
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface CreateTaskDTO {
  title: string
  description: string
  difficulty: TaskDifficulty
  type: TaskType
  deadline: string | null
  parentTaskId?: string
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  difficulty?: TaskDifficulty
  type?: TaskType
  deadline?: string | null
  status?: TaskStatus
}

export const DIFFICULTY_STARS: Record<TaskDifficulty, number> = {
  easy: 1,
  normal: 2,
  hard: 3,
  epic: 4,
  legendary: 5
}

export const DIFFICULTY_COLORS: Record<TaskDifficulty, string> = {
  easy: '#4ade80',
  normal: '#60a5fa',
  hard: '#f472b6',
  epic: '#a78bfa',
  legendary: '#fbbf24'
}

export const DIFFICULTY_LABELS: Record<TaskDifficulty, string> = {
  easy: '简单',
  normal: '普通',
  hard: '困难',
  epic: '史诗',
  legendary: '传说'
}

export const TYPE_LABELS: Record<TaskType, string> = {
  daily: '每日任务',
  weekly: '每周任务',
  custom: '自定义任务'
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: '待完成',
  in_progress: '进行中',
  completed: '已完成',
  failed: '已失败'
}
