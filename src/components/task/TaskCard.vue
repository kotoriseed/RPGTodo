<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import { DIFFICULTY_STARS, DIFFICULTY_COLORS, TYPE_LABELS, STATUS_LABELS } from '@/types'
import { isOverdue, getDaysUntilDeadline } from '@/utils/dateUtils'
import PixelButton from '@/components/common/PixelButton.vue'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  complete: [id: string]
  edit: [id: string]
  delete: [id: string]
  click: [id: string]
}>()

const stars = computed(() => DIFFICULTY_STARS[props.task.difficulty])
const difficultyColor = computed(() => DIFFICULTY_COLORS[props.task.difficulty])
const isTaskOverdue = computed(() => isOverdue(props.task.deadline))
const daysUntil = computed(() => getDaysUntilDeadline(props.task.deadline))
const isSubtask = computed(() => props.task.parentTaskId !== null)

function renderStars(count: number, color: string): string {
  return '★'.repeat(count).split('').map(() => `<span style="color: ${color}">★</span>`).join('')
}
</script>

<template>
  <div
    class="task-card"
    :class="{
      'task-card--completed': task.status === 'completed',
      'task-card--overdue': isTaskOverdue && task.status !== 'completed',
      'task-card--subtask': isSubtask
    }"
    @click="emit('click', task.id)"
  >
    <div class="task-card__header">
      <div class="task-difficulty" :style="{ color: difficultyColor }">
        <span v-html="renderStars(stars, difficultyColor)" />
      </div>
      <div class="task-type">
        <span v-if="isSubtask" class="subtask-badge">子任务</span>
        {{ TYPE_LABELS[task.type] }}
      </div>
    </div>
    
    <h4 class="task-card__title">{{ task.title }}</h4>
    
    <p v-if="task.description" class="task-card__desc">{{ task.description }}</p>
    
    <div class="task-card__reward">
      <span class="reward-item">
        <span class="reward-icon">✨</span>
        {{ task.reward.experience }} EXP
      </span>
      <span class="reward-item">
        <span class="reward-icon">💰</span>
        {{ task.reward.gold }} G
      </span>
    </div>
    
    <div v-if="task.deadline" class="task-card__deadline">
      <span v-if="isTaskOverdue && task.status !== 'completed'" class="deadline-overdue">
        ⚠ 已过期
      </span>
      <span v-else-if="daysUntil !== null && daysUntil <= 1 && daysUntil >= 0" class="deadline-soon">
        ⏰ {{ daysUntil === 0 ? '今天' : '明天' }}截止
      </span>
      <span v-else class="deadline-normal">
        📅 {{ new Date(task.deadline).toLocaleDateString('zh-CN') }}
      </span>
    </div>
    
    <div v-if="task.subtaskIds.length > 0" class="task-card__subtasks">
      📋 {{ task.subtaskIds.length }} 个子任务
    </div>
    
    <div class="task-card__status">
      <span class="status-badge" :class="`status-badge--${task.status}`">
        {{ STATUS_LABELS[task.status] }}
      </span>
    </div>
    
    <div class="task-card__actions" @click.stop>
      <PixelButton
        v-if="task.status !== 'completed'"
        size="small"
        type="success"
        @click="emit('complete', task.id)"
      >
        完成
      </PixelButton>
      <PixelButton
        size="small"
        @click="emit('edit', task.id)"
      >
        编辑
      </PixelButton>
      <PixelButton
        size="small"
        type="danger"
        @click="emit('delete', task.id)"
      >
        删除
      </PixelButton>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background-color: var(--color-bg-secondary);
  border: 4px solid var(--color-text);
  padding: 16px;
  cursor: pointer;
  transition: all 0.1s ease;
  position: relative;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: -4px;
  bottom: -4px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
}

.task-card:hover {
  transform: translate(-2px, -2px);
  border-color: var(--color-primary);
}

.task-card--completed {
  opacity: 0.6;
  border-color: var(--color-success);
}

.task-card--overdue {
  border-color: var(--color-danger);
}

.task-card--subtask {
  margin-left: 16px;
  border-left: 4px solid var(--color-info);
}

.subtask-badge {
  font-size: 9px;
  color: var(--color-info);
  margin-right: 4px;
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-difficulty {
  font-size: 14px;
  letter-spacing: 2px;
}

.task-type {
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  padding: 4px 8px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text-muted);
}

.task-card__title {
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: none;
}

.task-card__desc {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
  line-height: 1.5;
}

.task-card__reward {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.reward-icon {
  font-size: 12px;
}

.task-card__deadline {
  margin-bottom: 12px;
  font-size: 11px;
}

.deadline-overdue {
  color: var(--color-danger);
}

.deadline-soon {
  color: var(--color-warning);
}

.deadline-normal {
  color: var(--color-text-muted);
}

.task-card__subtasks {
  font-size: 11px;
  color: var(--color-info);
  margin-bottom: 12px;
}

.task-card__status {
  margin-bottom: 12px;
}

.status-badge {
  font-size: 10px;
  padding: 4px 8px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text-muted);
  text-transform: uppercase;
}

.status-badge--pending {
  border-color: var(--color-text-muted);
  color: var(--color-text-muted);
}

.status-badge--in_progress {
  border-color: var(--color-info);
  color: var(--color-info);
}

.status-badge--completed {
  border-color: var(--color-success);
  color: var(--color-success);
}

.status-badge--failed {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.task-card__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
