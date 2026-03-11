<script setup lang="ts">
defineProps<{
  title?: string
  variant?: 'default' | 'primary' | 'secondary'
}>()
</script>

<template>
  <div class="pixel-card" :class="`pixel-card--${variant || 'default'}`">
    <div v-if="title" class="pixel-card__header">
      <span class="pixel-card__title">{{ title }}</span>
    </div>
    <div class="pixel-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pixel-card {
  background-color: var(--color-bg-secondary);
  border: 4px solid var(--color-text);
  position: relative;
}

.pixel-card::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  right: -6px;
  bottom: -6px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: -1;
}

.pixel-card--primary {
  border-color: var(--color-primary);
}

.pixel-card--primary .pixel-card__header {
  background-color: var(--color-primary);
  color: var(--color-text);
}

.pixel-card--secondary {
  border-color: var(--color-secondary);
}

.pixel-card--secondary .pixel-card__header {
  background-color: var(--color-secondary);
}

.pixel-card__header {
  padding: 12px 16px;
  background-color: var(--color-bg-tertiary);
  border-bottom: 4px solid var(--color-text);
  display: flex;
  align-items: center;
}

.pixel-card__title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pixel-card__body {
  padding: 16px;
}
</style>
