"use client"

import { useState, useEffect } from "react"
import { sanitizeForStorage, safeJSONParse } from "@/lib/security"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = safeJSONParse<T>(item, initialValue)
        setStoredValue(parsed)
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = (value: T) => {
    try {
      const sanitized = sanitizeForStorage(value)
      setStoredValue(sanitized)
      window.localStorage.setItem(key, JSON.stringify(sanitized))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  return [storedValue, setValue]
}
