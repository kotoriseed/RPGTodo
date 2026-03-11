const STORAGE_PREFIX = 'rpgtodo_'

export interface AppData {
  tasks: unknown[]
  character: unknown
  settings: unknown
  shop: unknown[]
  exportedAt: string
  version: string
}

export function saveData<T>(key: string, data: T): boolean {
  try {
    const json = JSON.stringify(data, null, 2)
    localStorage.setItem(STORAGE_PREFIX + key, json)
    return true
  } catch {
    console.error('Failed to save data to localStorage')
    return false
  }
}

export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const json = localStorage.getItem(STORAGE_PREFIX + key)
    if (json === null) {
      return defaultValue
    }
    return JSON.parse(json) as T
  } catch {
    console.error('Failed to load data from localStorage')
    return defaultValue
  }
}

export function removeData(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}

export function clearAllData(): void {
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}

export function exportAllData(): AppData {
  const data: AppData = {
    tasks: loadData('tasks', []),
    character: loadData('character', null),
    settings: loadData('settings', {}),
    shop: loadData('shop', []),
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  }
  return data
}

export function importAllData(data: AppData): boolean {
  try {
    if (!data.version || !data.exportedAt) {
      console.error('Invalid backup data format')
      return false
    }
    
    if (data.tasks !== undefined) {
      saveData('tasks', data.tasks)
    }
    if (data.character !== undefined) {
      saveData('character', data.character)
    }
    if (data.settings !== undefined) {
      saveData('settings', data.settings)
    }
    
    return true
  } catch (e) {
    console.error('Failed to import data:', e)
    return false
  }
}

export function downloadJsonFile(data: AppData, filename: string = 'rpgtodo-backup.json'): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function readJsonFile(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content) as AppData
        resolve(data)
      } catch (e) {
        reject(new Error('Invalid JSON file'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsText(file)
  })
}
