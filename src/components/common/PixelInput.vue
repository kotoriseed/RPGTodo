<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: 'text' | 'textarea' | 'date'
  rows?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClasses = computed(() => [
  'pixel-input__field',
  props.type === 'textarea' ? 'pixel-input__field--textarea' : '',
  props.type === 'date' ? 'pixel-input__field--date' : ''
])

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="pixel-input">
    <label v-if="label" class="pixel-input__label">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      :class="inputClasses"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows || 3"
      @input="handleInput"
    />
    <input
      v-else-if="type === 'date'"
      type="date"
      :class="inputClasses"
      :value="modelValue"
      placeholder="选择日期..."
      @input="handleInput"
    />
    <input
      v-else
      type="text"
      :class="inputClasses"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.pixel-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pixel-input__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

.pixel-input__field {
  background-color: var(--color-bg);
  border: 4px solid var(--color-text);
  color: var(--color-text);
  font-family: var(--font-pixel);
  font-size: 12px;
  padding: 12px;
  width: 100%;
  outline: none;
  transition: all 0.1s ease;
}

.pixel-input__field::placeholder {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.pixel-input__field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(233, 69, 96, 0.2);
}

.pixel-input__field--textarea {
  resize: vertical;
  min-height: 80px;
}

.pixel-input__field--date {
  cursor: pointer;
  min-height: 44px;
  -webkit-appearance: none;
  appearance: none;
}

.pixel-input__field--date::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(1);
  opacity: 0.6;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  -webkit-appearance: none;
  appearance: none;
}
</style>
