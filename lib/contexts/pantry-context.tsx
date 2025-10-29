"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { PantryItem } from "@/lib/types"

interface PantryContextType {
  pantryItems: PantryItem[]
  addPantryItem: (item: PantryItem) => void
  updatePantryItem: (id: string, item: PantryItem) => void
  removePantryItem: (id: string) => void
  setPantryItems: (items: PantryItem[]) => void
}

const PantryContext = createContext<PantryContextType | undefined>(undefined)

export function PantryProvider({ children }: { children: ReactNode }) {
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>("pantry-inventory", [])

  const addPantryItem = (item: PantryItem) => {
    setPantryItems([...pantryItems, item])
  }

  const updatePantryItem = (id: string, item: PantryItem) => {
    setPantryItems(pantryItems.map((i) => (i.id === id ? item : i)))
  }

  const removePantryItem = (id: string) => {
    setPantryItems(pantryItems.filter((i) => i.id !== id))
  }

  return (
    <PantryContext.Provider
      value={{
        pantryItems,
        addPantryItem,
        updatePantryItem,
        removePantryItem,
        setPantryItems,
      }}
    >
      {children}
    </PantryContext.Provider>
  )
}

export function usePantry() {
  const context = useContext(PantryContext)
  if (!context) {
    throw new Error("usePantry must be used within PantryProvider")
  }
  return context
}
