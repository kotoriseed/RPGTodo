<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore, useCharacterStore, useSettingsStore, useShopStore } from '@/stores'
import MainLayout from '@/components/layout/MainLayout.vue'

const taskStore = useTaskStore()
const characterStore = useCharacterStore()
const settingsStore = useSettingsStore()
const shopStore = useShopStore()

onMounted(() => {
  taskStore.loadTasks()
  characterStore.loadCharacter()
  settingsStore.loadSettings()
  shopStore.loadShop()
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
