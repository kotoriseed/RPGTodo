<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

watch(() => props.show, (show) => {
  if (show) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="pixel-modal-overlay" @click.self="emit('close')">
        <div class="pixel-modal">
          <div class="pixel-modal__header">
            <h3 class="pixel-modal__title">{{ title }}</h3>
            <button class="pixel-modal__close" @click="emit('close')">×</button>
          </div>
          <div class="pixel-modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pixel-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.pixel-modal {
  background-color: var(--color-bg-secondary);
  border: 4px solid var(--color-text);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.pixel-modal::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  right: -6px;
  bottom: -6px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: -1;
}

.pixel-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--color-bg-tertiary);
  border-bottom: 4px solid var(--color-text);
}

.pixel-modal__title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pixel-modal__close {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.pixel-modal__close:hover {
  color: var(--color-primary);
}

.pixel-modal__body {
  padding: 20px;
  overflow-y: auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .pixel-modal,
.modal-leave-active .pixel-modal {
  transition: transform 0.2s ease;
}

.modal-enter-from .pixel-modal,
.modal-leave-to .pixel-modal {
  transform: translateY(20px);
}
</style>
