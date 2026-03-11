const STORAGE_PREFIX = 'rpgtodo_'

export function saveData<T>(key: string, data: T): boolean {
  try {
    const json = JSON.stringify(data)
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
