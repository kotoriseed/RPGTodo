<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCharacterStore } from '@/stores'

const route = useRoute()
const characterStore = useCharacterStore()

const currentRoute = computed(() => route.name as string)

const menuItems = [
  { name: 'home', label: '任务面板', icon: '⚔' },
  { name: 'character', label: '角色', icon: '👤' },
  { name: 'boss', label: 'Boss战', icon: '🐉' },
  { name: 'settings', label: '设置', icon: '⚙' }
]
</script>

<template>
  <div class="main-layout">
    <header class="main-layout__header">
      <div class="header__logo">
        <span class="logo-icon">⚔</span>
        <span class="logo-text">RPG Todo</span>
      </div>
      <div class="header__stats">
        <div class="stat-item">
          <span class="stat-icon">👤</span>
          <span class="stat-value">Lv.{{ characterStore.level }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💰</span>
          <span class="stat-value">{{ characterStore.gold }}</span>
        </div>
      </div>
    </header>
    
    <div class="main-layout__body">
      <nav class="main-layout__sidebar">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="sidebar-item"
          :class="{ 'sidebar-item--active': currentRoute === item.name }"
        >
          <span class="sidebar-icon">{{ item.icon }}</span>
          <span class="sidebar-label">{{ item.label }}</span>
        </router-link>
      </nav>
      
      <main class="main-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: var(--color-bg-secondary);
  border-bottom: 4px solid var(--color-text);
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.header__stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
}

.stat-icon {
  font-size: 14px;
}

.stat-value {
  font-size: 12px;
}

.main-layout__body {
  flex: 1;
  display: flex;
}

.main-layout__sidebar {
  width: 200px;
  background-color: var(--color-bg-secondary);
  border-right: 4px solid var(--color-text);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--color-text);
  border: 2px solid transparent;
  transition: all 0.1s ease;
}

.sidebar-item:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-text);
}

.sidebar-item--active {
  background-color: var(--color-primary);
  border-color: var(--color-text);
}

.sidebar-icon {
  font-size: 18px;
}

.sidebar-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.main-layout__content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-layout__sidebar {
    width: auto;
    padding: 8px;
  }
  
  .sidebar-label {
    display: none;
  }
  
  .sidebar-item {
    justify-content: center;
    padding: 12px;
  }
  
  .header__stats {
    gap: 12px;
  }
  
  .stat-item {
    padding: 6px 12px;
  }
}
</style>
