"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { sampleRecipes } from "@/lib/sample-recipes"
import type { Recipe } from "@/lib/types"

interface RecipeContextType {
  recipes: Recipe[]
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: string, recipe: Recipe) => void
  deleteRecipe: (id: string) => void
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>("meal-planner-recipes", sampleRecipes)

  const addRecipe = (recipe: Recipe) => {
    const exists = recipes.some((r) => r.id === recipe.id)
    if (!exists) {
      setRecipes([...recipes, recipe])
    }
  }

  const updateRecipe = (id: string, recipe: Recipe) => {
    setRecipes(recipes.map((r) => (r.id === id ? recipe : r)))
  }

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter((r) => r.id !== id))
  }

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe }}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipes() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error("useRecipes must be used within RecipeProvider")
  }
  return context
}
