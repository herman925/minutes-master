import { useEffect, useState } from 'react'

function readFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeToLocalStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage write errors
  }
}

export function useKV<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readFromLocalStorage<T>(key, initialValue))

  // Persist on change
  useEffect(() => {
    writeToLocalStorage<T>(key, value)
  }, [key, value])

  // Sync across tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== key) return
      setValue(readFromLocalStorage<T>(key, initialValue))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, initialValue])

  return [value, setValue] as const
}



