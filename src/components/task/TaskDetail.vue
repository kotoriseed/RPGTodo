<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import { DIFFICULTY_LABELS, TYPE_LABELS, STATUS_LABELS, DIFFICULTY_COLORS } from '@/types'
import { formatDateTime } from '@/utils/dateUtils'
import PixelButton from '@/components/common/PixelButton.vue'

const props = defineProps<{
  task: Task
  subtasks: Task[]
}>()

const emit = defineEmits<{
  close: []
  complete: [id: string]
  edit: [id: string]
  addSubtask: [parentId: string]
}>()

const difficultyColor = computed(() => DIFFICULTY_COLORS[props.task.difficulty])

function formatDate(date: string): string {
  return formatDateTime(date)
}
</script>

<template>
  <div class="task-detail">
    <div class="task-detail__header">
      <div class="task-status">
        <span class="status-badge" :class="`status-badge--${task.status}`">
          {{ STATUS_LABELS[task.status] }}
        </span>
      </div>
      <div class="task-meta">
        <span class="meta-item">
          <span class="meta-label">难度:</span>
          <span :style="{ color: difficultyColor }">{{ DIFFICULTY_LABELS[task.difficulty] }}</span>
        </span>
        <span class="meta-item">
          <span class="meta-label">类型:</span>
          {{ TYPE_LABELS[task.type] }}
        </span>
      </div>
    </div>
    
    <h2 class="task-detail__title">{{ task.title }}</h2>
    
    <div v-if="task.description" class="task-detail__desc">
      {{ task.description }}
    </div>
    
    <div class="task-detail__reward">
      <h4 class="reward-title">任务奖励</h4>
      <div class="reward-items">
        <div class="reward-item">
          <span class="reward-icon">✨</span>
          <span class="reward-value">{{ task.reward.experience }}</span>
          <span class="reward-label">EXP</span>
        </div>
        <div class="reward-item">
          <span class="reward-icon">💰</span>
          <span class="reward-value">{{ task.reward.gold }}</span>
          <span class="reward-label">G</span>
        </div>
      </div>
    </div>
    
    <div v-if="task.deadline" class="task-detail__deadline">
      <span class="deadline-label">截止日期:</span>
      <span class="deadline-value">{{ new Date(task.deadline).toLocaleDateString('zh-CN') }}</span>
    </div>
    
    <div v-if="subtasks.length > 0" class="task-detail__subtasks">
      <h4 class="subtasks-title">子任务 ({{ subtasks.filter(s => s.status === 'completed').length }}/{{ subtasks.length }})</h4>
      <div class="subtasks-list">
        <div
          v-for="subtask in subtasks"
          :key="subtask.id"
          class="subtask-item"
          :class="{ 'subtask-item--completed': subtask.status === 'completed' }"
        >
          <span class="subtask-status">{{ subtask.status === 'completed' ? '✓' : '○' }}</span>
          <span class="subtask-title">{{ subtask.title }}</span>
        </div>
      </div>
    </div>
    
    <div class="task-detail__timestamps">
      <span class="timestamp">创建: {{ formatDate(task.createdAt) }}</span>
      <span v-if="task.completedAt" class="timestamp">
        完成: {{ formatDate(task.completedAt) }}
      </span>
    </div>
    
    <div class="task-detail__actions">
      <PixelButton
        v-if="task.status !== 'completed'"
        type="success"
        @click="emit('complete', task.id)"
      >
        完成任务
      </PixelButton>
      <PixelButton @click="emit('edit', task.id)">
        编辑
      </PixelButton>
      <PixelButton @click="emit('addSubtask', task.id)">
        添加子任务
      </PixelButton>
      <PixelButton @click="emit('close')">
        关闭
      </PixelButton>
    </div>
  </div>
</template>

<style scoped>
.task-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.status-badge {
  font-size: 10px;
  padding: 6px 12px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
  text-transform: uppercase;
}

.status-badge--pending { border-color: var(--color-text-muted); color: var(--color-text-muted); }
.status-badge--in_progress { border-color: var(--color-info); color: var(--color-info); }
.status-badge--completed { border-color: var(--color-success); color: var(--color-success); }
.status-badge--failed { border-color: var(--color-danger); color: var(--color-danger); }

.task-meta {
  display: flex;
  gap: 16px;
  font-size: 11px;
}

.meta-label {
  color: var(--color-text-muted);
  margin-right: 4px;
}

.task-detail__title {
  font-size: 18px;
  text-transform: none;
}

.task-detail__desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-muted);
  padding: 12px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
}

.task-detail__reward {
  padding: 16px;
  background-color: var(--color-bg);
  border: 4px solid var(--color-accent);
}

.reward-title {
  font-size: 12px;
  margin-bottom: 12px;
  color: var(--color-accent);
}

.reward-items {
  display: flex;
  gap: 24px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reward-icon {
  font-size: 20px;
}

.reward-value {
  font-size: 20px;
  font-weight: bold;
}

.reward-label {
  font-size: 10px;
  color: var(--color-text-muted);
}

.task-detail__deadline {
  font-size: 12px;
  padding: 12px;
  background-color: var(--color-bg-tertiary);
  border: 2px solid var(--color-text);
}

.deadline-label {
  color: var(--color-text-muted);
  margin-right: 8px;
}

.task-detail__subtasks {
  padding: 16px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
}

.subtasks-title {
  font-size: 12px;
  margin-bottom: 12px;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-text-muted);
}

.subtask-item--completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.subtask-status {
  font-size: 14px;
}

.subtask-title {
  font-size: 12px;
}

.task-detail__timestamps {
  display: flex;
  gap: 16px;
  font-size: 10px;
  color: var(--color-text-muted);
}

.task-detail__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 2px solid var(--color-text);
}
</style>
