import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus, Reward } from '@/types'
import { saveData, loadData } from '@/services/storageService'
import { calculateReward } from '@/services/rewardService'
import { generateId, isThisWeek } from '@/utils/dateUtils'

const STORAGE_KEY = 'tasks'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const rootTasks = computed(() => 
    tasks.value.filter(t => t.parentTaskId === null)
  )

  const pendingTasks = computed(() =>
    tasks.value.filter(t => t.status === 'pending' || t.status === 'in_progress')
  )

  const completedTasks = computed(() =>
    tasks.value.filter(t => t.status === 'completed')
  )

  const dailyTasks = computed(() =>
    tasks.value.filter(t => t.type === 'daily')
  )

  const weeklyTasks = computed(() =>
    tasks.value.filter(t => t.type === 'weekly')
  )

  function getTaskById(id: string): Task | undefined {
    return tasks.value.find(t => t.id === id)
  }

  function getSubtasks(parentId: string): Task[] {
    return tasks.value.filter(t => t.parentTaskId === parentId)
  }

  function loadTasks(): void {
    loading.value = true
    error.value = null
    try {
      const savedTasks = loadData<Task[]>(STORAGE_KEY, [])
      tasks.value = savedTasks
      checkAndResetTasks()
    } catch (e) {
      error.value = 'Failed to load tasks'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  function saveTasks(): void {
    saveData(STORAGE_KEY, tasks.value)
  }

  function checkAndResetTasks(): void {
    const now = new Date()
    const lastResetKey = 'last_reset'
    const lastReset = loadData<string>(lastResetKey, '')

    const todayStr = now.toDateString()

    let needsSave = false

    if (lastReset !== todayStr) {
      tasks.value.forEach(task => {
        if (task.type === 'daily' && task.status === 'completed') {
          task.status = 'pending'
          task.completedAt = null
          needsSave = true
        }
      })

      if (lastReset && !isThisWeek(lastReset)) {
        tasks.value.forEach(task => {
          if (task.type === 'weekly' && task.status === 'completed') {
            task.status = 'pending'
            task.completedAt = null
            needsSave = true
          }
        })
      }

      saveData(lastResetKey, todayStr)
    }

    if (needsSave) {
      saveTasks()
    }
  }

  function createTask(dto: CreateTaskDTO): Task {
    const now = new Date().toISOString()
    const task: Task = {
      id: generateId(),
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      type: dto.type,
      status: 'pending',
      reward: calculateReward(dto.difficulty),
      deadline: dto.deadline,
      parentTaskId: dto.parentTaskId || null,
      subtaskIds: [],
      createdAt: now,
      updatedAt: now,
      completedAt: null
    }

    if (dto.parentTaskId) {
      const parent = getTaskById(dto.parentTaskId)
      if (parent) {
        parent.subtaskIds.push(task.id)
        parent.updatedAt = now
      }
    }

    tasks.value.push(task)
    saveTasks()
    return task
  }

  function updateTask(id: string, updates: UpdateTaskDTO): Task | null {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return null

    const task = tasks.value[index]
    Object.assign(task, updates, { updatedAt: new Date().toISOString() })

    if (updates.difficulty) {
      task.reward = calculateReward(updates.difficulty)
    }

    saveTasks()
    return task
  }

  function deleteTask(id: string): void {
    const task = getTaskById(id)
    if (!task) return

    task.subtaskIds.forEach(subtaskId => {
      deleteTask(subtaskId)
    })

    if (task.parentTaskId) {
      const parent = getTaskById(task.parentTaskId)
      if (parent) {
        parent.subtaskIds = parent.subtaskIds.filter(sid => sid !== id)
      }
    }

    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }

    saveTasks()
  }

  function completeTask(id: string): Reward | null {
    const task = getTaskById(id)
    if (!task || task.status === 'completed') return null

    const subtasks = getSubtasks(id)
    const incompleteSubtasks = subtasks.filter(s => s.status !== 'completed')
    if (incompleteSubtasks.length > 0) return null

    const now = new Date().toISOString()
    task.status = 'completed'
    task.completedAt = now
    task.updatedAt = now

    if (task.parentTaskId) {
      checkParentCompletion(task.parentTaskId)
    }

    saveTasks()
    return task.reward
  }

  function checkParentCompletion(parentId: string): void {
    const parent = getTaskById(parentId)
    if (!parent) return

    const subtasks = getSubtasks(parentId)
    const allCompleted = subtasks.every(s => s.status === 'completed')

    if (allCompleted && subtasks.length > 0) {
      parent.status = 'completed'
      parent.completedAt = new Date().toISOString()
      parent.updatedAt = new Date().toISOString()

      if (parent.parentTaskId) {
        checkParentCompletion(parent.parentTaskId)
      }
    }
  }

  function startTask(id: string): void {
    updateTask(id, { status: 'in_progress' })
  }

  function getTasksByStatus(status: TaskStatus): Task[] {
    return tasks.value.filter(t => t.status === status)
  }

  function getCompletedTasksCount(): number {
    return completedTasks.value.length
  }

  function getWeeklyCompletedCount(): number {
    return completedTasks.value.filter(t => {
      if (!t.completedAt) return false
      return isThisWeek(t.completedAt)
    }).length
  }

  return {
    tasks,
    loading,
    error,
    rootTasks,
    pendingTasks,
    completedTasks,
    dailyTasks,
    weeklyTasks,
    getTaskById,
    getSubtasks,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    startTask,
    getTasksByStatus,
    getCompletedTasksCount,
    getWeeklyCompletedCount
  }
})
