<script setup lang="ts">
defineProps<{
  percent: number
  label?: string
  showPercent?: boolean
  color?: string
}>()
</script>

<template>
  <div class="pixel-progress">
    <div v-if="label || showPercent" class="pixel-progress__header">
      <span v-if="label" class="pixel-progress__label">{{ label }}</span>
      <span v-if="showPercent" class="pixel-progress__percent">{{ Math.round(percent) }}%</span>
    </div>
    <div class="pixel-progress__track">
      <div
        class="pixel-progress__fill"
        :style="{
          width: `${Math.min(100, Math.max(0, percent))}%`,
          backgroundColor: color || 'var(--color-primary)'
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.pixel-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pixel-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pixel-progress__label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
}

.pixel-progress__percent {
  font-size: 10px;
  color: var(--color-text);
}

.pixel-progress__track {
  height: 16px;
  background-color: var(--color-bg);
  border: 4px solid var(--color-text);
  position: relative;
  overflow: hidden;
}

.pixel-progress__fill {
  height: 100%;
  transition: width 0.3s ease;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 8px,
    rgba(255, 255, 255, 0.1) 8px,
    rgba(255, 255, 255, 0.1) 16px
  );
}
</style>
