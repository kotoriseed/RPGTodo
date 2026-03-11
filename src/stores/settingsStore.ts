import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveData, loadData } from '@/services/storageService'

const STORAGE_KEY = 'settings'

export interface AppSettings {
  soundEnabled: boolean
  animationsEnabled: boolean
  theme: 'light' | 'dark'
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  theme: 'dark'
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })

  function loadSettings(): void {
    const saved = loadData<AppSettings>(STORAGE_KEY, DEFAULT_SETTINGS)
    settings.value = { ...DEFAULT_SETTINGS, ...saved }
  }

  function saveSettings(): void {
    saveData(STORAGE_KEY, settings.value)
  }

  function updateSettings(updates: Partial<AppSettings>): void {
    settings.value = { ...settings.value, ...updates }
    saveSettings()
  }

  function toggleSound(): void {
    settings.value.soundEnabled = !settings.value.soundEnabled
    saveSettings()
  }

  function toggleAnimations(): void {
    settings.value.animationsEnabled = !settings.value.animationsEnabled
    saveSettings()
  }

  function toggleTheme(): void {
    settings.value.theme = settings.value.theme === 'dark' ? 'light' : 'dark'
    saveSettings()
  }

  return {
    settings,
    loadSettings,
    updateSettings,
    toggleSound,
    toggleAnimations,
    toggleTheme
  }
})
