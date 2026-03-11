<script setup lang="ts">
defineProps<{
  type?: 'default' | 'primary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="pixel-btn"
    :class="[
      type ? `pixel-btn--${type}` : '',
      size ? `pixel-btn--${size}` : ''
    ]"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
@import '@/assets/styles/components.css';
</style>
