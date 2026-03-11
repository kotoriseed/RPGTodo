<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore, useCharacterStore } from '@/stores'
import type { CreateTaskDTO, Task } from '@/types'
import { generateItemDrops } from '@/services/rewardService'
import PixelButton from '@/components/common/PixelButton.vue'
import PixelModal from '@/components/common/PixelModal.vue'
import PixelCard from '@/components/common/PixelCard.vue'
import PixelProgressBar from '@/components/common/PixelProgressBar.vue'
import TaskList from '@/components/task/TaskList.vue'
import TaskForm from '@/components/task/TaskForm.vue'
import TaskDetail from '@/components/task/TaskDetail.vue'

const taskStore = useTaskStore()
const characterStore = useCharacterStore()

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const showSubtaskModal = ref(false)
const selectedTask = ref<Task | null>(null)
const editingTask = ref<Task | null>(null)
const parentTaskId = ref<string | null>(null)

const filter = ref<'all' | 'pending' | 'completed'>('pending')

const filteredTasks = computed(() => {
  const tasks = taskStore.rootTasks
  if (filter.value === 'pending') {
    return tasks.filter(t => t.status === 'pending' || t.status === 'in_progress')
  }
  if (filter.value === 'completed') {
    return tasks.filter(t => t.status === 'completed')
  }
  return tasks
})

const weeklyProgress = computed(() => {
  const completed = taskStore.getWeeklyCompletedCount()
  const total = taskStore.rootTasks.filter(t => t.type === 'daily' || t.type === 'weekly').length
  return total > 0 ? (completed / total) * 100 : 0
})

function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function handleCreate(data: CreateTaskDTO) {
  taskStore.createTask(data)
  closeCreateModal()
}

function openDetailModal(taskId: string) {
  selectedTask.value = taskStore.getTaskById(taskId) || null
  if (selectedTask.value) {
    showDetailModal.value = true
  }
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedTask.value = null
}

function handleComplete(taskId: string) {
  const task = taskStore.getTaskById(taskId)
  if (!task) return
  
  const reward = taskStore.completeTask(taskId)
  if (reward) {
    const items = generateItemDrops(task.difficulty)
    characterStore.addReward(reward.experience, reward.gold, items)
    characterStore.updateStreak(true)
  }
  closeDetailModal()
}

function openEditModal(taskId: string) {
  editingTask.value = taskStore.getTaskById(taskId) || null
  if (editingTask.value) {
    showEditModal.value = true
    showDetailModal.value = false
  }
}

function closeEditModal() {
  showEditModal.value = false
  editingTask.value = null
}

function handleEdit(data: CreateTaskDTO) {
  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      type: data.type,
      deadline: data.deadline
    })
    closeEditModal()
  }
}

function handleDelete(taskId: string) {
  if (confirm('确定要删除这个任务吗？子任务也会一起删除。')) {
    taskStore.deleteTask(taskId)
    closeDetailModal()
  }
}

function openSubtaskModal(taskId: string) {
  parentTaskId.value = taskId
  showSubtaskModal.value = true
  showDetailModal.value = false
}

function closeSubtaskModal() {
  showSubtaskModal.value = false
  parentTaskId.value = null
}

function handleCreateSubtask(data: CreateTaskDTO) {
  if (parentTaskId.value) {
    taskStore.createTask({ ...data, parentTaskId: parentTaskId.value })
    closeSubtaskModal()
    selectedTask.value = taskStore.getTaskById(parentTaskId.value) || null
    showDetailModal.value = true
  }
}

const selectedSubtasks = computed(() => {
  if (!selectedTask.value) return []
  return taskStore.getSubtasks(selectedTask.value.id)
})
</script>

<template>
  <div class="home-view">
    <div class="home-view__header">
      <h1 class="page-title">任务面板</h1>
      <PixelButton type="primary" @click="openCreateModal">
        + 新建任务
      </PixelButton>
    </div>
    
    <PixelCard class="progress-card">
      <div class="progress-header">
        <span>本周进度</span>
        <span>{{ taskStore.getWeeklyCompletedCount() }} 已完成</span>
      </div>
      <PixelProgressBar :percent="weeklyProgress" show-percent />
    </PixelCard>
    
    <div class="filter-tabs">
      <button
        class="filter-tab"
        :class="{ 'filter-tab--active': filter === 'pending' }"
        @click="filter = 'pending'"
      >
        进行中
      </button>
      <button
        class="filter-tab"
        :class="{ 'filter-tab--active': filter === 'completed' }"
        @click="filter = 'completed'"
      >
        已完成
      </button>
      <button
        class="filter-tab"
        :class="{ 'filter-tab--active': filter === 'all' }"
        @click="filter = 'all'"
      >
        全部
      </button>
    </div>
    
    <TaskList
      :tasks="filteredTasks"
      @complete="handleComplete"
      @edit="openEditModal"
      @delete="handleDelete"
      @click="openDetailModal"
    />
    
    <PixelModal v-model:show="showCreateModal" title="新建任务">
      <TaskForm
        @submit="handleCreate"
        @cancel="closeCreateModal"
      />
    </PixelModal>
    
    <PixelModal v-model:show="showDetailModal" title="任务详情">
      <TaskDetail
        v-if="selectedTask"
        :task="selectedTask"
        :subtasks="selectedSubtasks"
        @close="closeDetailModal"
        @complete="handleComplete"
        @edit="openEditModal"
        @add-subtask="openSubtaskModal"
      />
    </PixelModal>
    
    <PixelModal v-model:show="showEditModal" title="编辑任务">
      <TaskForm
        v-if="editingTask"
        :initial-data="{
          title: editingTask.title,
          description: editingTask.description,
          difficulty: editingTask.difficulty,
          type: editingTask.type,
          deadline: editingTask.deadline
        }"
        @submit="handleEdit"
        @cancel="closeEditModal"
      />
    </PixelModal>
    
    <PixelModal v-model:show="showSubtaskModal" title="添加子任务">
      <TaskForm
        :parent-id="parentTaskId || undefined"
        @submit="handleCreateSubtask"
        @cancel="closeSubtaskModal"
      />
    </PixelModal>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.progress-card {
  margin-bottom: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 11px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 10px 20px;
  background-color: var(--color-bg-secondary);
  border: 4px solid var(--color-text);
  color: var(--color-text);
  font-family: var(--font-pixel);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.filter-tab:hover {
  background-color: var(--color-bg-tertiary);
}

.filter-tab--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}
</style>
