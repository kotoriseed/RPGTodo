<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore, useCharacterStore, useSettingsStore } from '@/stores'
import MainLayout from '@/components/layout/MainLayout.vue'

const taskStore = useTaskStore()
const characterStore = useCharacterStore()
const settingsStore = useSettingsStore()

onMounted(() => {
  taskStore.loadTasks()
  characterStore.loadCharacter()
  settingsStore.loadSettings()
})
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
