<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CreateTaskDTO, TaskDifficulty, TaskType } from '@/types'
import { DIFFICULTY_LABELS, TYPE_LABELS } from '@/types'
import PixelInput from '@/components/common/PixelInput.vue'
import PixelSelect from '@/components/common/PixelSelect.vue'
import PixelButton from '@/components/common/PixelButton.vue'

const props = defineProps<{
  initialData?: Partial<CreateTaskDTO>
  parentId?: string
}>()

const emit = defineEmits<{
  submit: [data: CreateTaskDTO]
  cancel: []
}>()

const title = ref(props.initialData?.title || '')
const description = ref(props.initialData?.description || '')
const difficulty = ref<TaskDifficulty>(props.initialData?.difficulty || 'normal')
const type = ref<TaskType>(props.initialData?.type || 'custom')
const deadline = ref(props.initialData?.deadline || '')

const difficultyOptions = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({
  value,
  label
}))

const typeOptions = Object.entries(TYPE_LABELS).map(([value, label]) => ({
  value,
  label
}))

const isValid = computed(() => title.value.trim().length > 0)

function handleSubmit() {
  if (!isValid.value) return
  
  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    difficulty: difficulty.value,
    type: type.value,
    deadline: deadline.value || null,
    parentTaskId: props.parentId
  })
}
</script>

<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <PixelInput
      v-model="title"
      label="任务标题"
      placeholder="输入任务标题..."
    />
    
    <PixelInput
      v-model="description"
      label="任务描述"
      type="textarea"
      :rows="3"
      placeholder="描述任务详情..."
    />
    
    <div class="task-form__row">
      <PixelSelect
        v-model="difficulty"
        label="难度"
        :options="difficultyOptions"
      />
      
      <PixelSelect
        v-model="type"
        label="类型"
        :options="typeOptions"
      />
    </div>
    
    <PixelInput
      v-model="deadline"
      label="截止日期"
      type="date"
    />
    
    <div class="task-form__actions">
      <PixelButton type="primary" :disabled="!isValid" @click="handleSubmit">
        {{ initialData ? '保存' : '创建任务' }}
      </PixelButton>
      <PixelButton @click="emit('cancel')">
        取消
      </PixelButton>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.task-form__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .task-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
