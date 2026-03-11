<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  options: { value: string; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="pixel-select">
    <label v-if="label" class="pixel-select__label">{{ label }}</label>
    <div class="pixel-select__wrapper">
      <select
        class="pixel-select__field"
        :value="modelValue"
        @change="handleChange"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="pixel-select__arrow">▼</span>
    </div>
  </div>
</template>

<style scoped>
.pixel-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pixel-select__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

.pixel-select__wrapper {
  position: relative;
}

.pixel-select__field {
  background-color: var(--color-bg);
  border: 4px solid var(--color-text);
  color: var(--color-text);
  font-family: var(--font-pixel);
  font-size: 12px;
  padding: 12px 36px 12px 12px;
  width: 100%;
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: all 0.1s ease;
}

.pixel-select__field:focus {
  border-color: var(--color-primary);
}

.pixel-select__arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: var(--color-text);
  pointer-events: none;
}
</style>
