<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import TaskCard from './TaskCard.vue'

const props = defineProps<{
  tasks: Task[]
  title?: string
}>()

const emit = defineEmits<{
  complete: [id: string]
  edit: [id: string]
  delete: [id: string]
  click: [id: string]
}>()

const sortedTasks = computed(() => {
  return [...props.tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1
    if (a.status !== 'completed' && b.status === 'completed') return -1
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (a.deadline) return -1
    if (b.deadline) return 1
    return 0
  })
})
</script>

<template>
  <div class="task-list">
    <h3 v-if="title" class="task-list__title">{{ title }}</h3>
    
    <div v-if="sortedTasks.length === 0" class="task-list__empty">
      <span class="empty-icon">📜</span>
      <span class="empty-text">暂无任务</span>
    </div>
    
    <div v-else class="task-list__items">
      <TaskCard
        v-for="task in sortedTasks"
        :key="task.id"
        :task="task"
        @complete="emit('complete', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @click="emit('click', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-list__title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding-bottom: 12px;
  border-bottom: 4px solid var(--color-text);
}

.task-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background-color: var(--color-bg-secondary);
  border: 4px dashed var(--color-text-muted);
  gap: 16px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 12px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.task-list__items {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .task-list__items {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
</style>
