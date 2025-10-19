"use client"

import { useState, useEffect, useCallback } from "react"
import { ingredientPrices } from "@/lib/ingredient-prices"
import type { Ingredient } from "@/lib/types"

export interface DynamicIngredient {
  value: string
  label: string
  unit: string
  pricePerUnit: number
}

export function useDynamicIngredients() {
  const [customIngredients, setCustomIngredients] = useState<Record<string, { pricePerUnit: number; unit: string }>>({})

  // Load custom ingredients from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("custom-ingredients")
      if (stored) {
        const parsed = JSON.parse(stored)
        setCustomIngredients(parsed)
        console.log("[v0] Loaded custom ingredients from localStorage:", Object.keys(parsed))
      } else {
        console.log("[v0] No custom ingredients in localStorage")
      }
    } catch (error) {
      console.error("[v0] Error loading custom ingredients:", error)
    }
  }, [])

  // Combine static and custom ingredients
  const allIngredients: DynamicIngredient[] = Object.entries({
    ...ingredientPrices,
    ...customIngredients,
  }).map(([key, value]) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    unit: value.unit,
    pricePerUnit: value.pricePerUnit,
  }))

  console.log("[v0] Total ingredients available:", allIngredients.length)
  console.log("[v0] Static ingredients:", Object.keys(ingredientPrices).length)
  console.log("[v0] Custom ingredients:", Object.keys(customIngredients).length)

  // Add new ingredients from recipes
  const addIngredientsFromRecipe = useCallback(
    (ingredients: Ingredient[]) => {
      console.log("[v0] addIngredientsFromRecipe called with:", ingredients.length, "ingredients")
      console.log("[v0] Ingredients:", ingredients.map((i) => i.name).join(", "))

      const newIngredients: Record<string, { pricePerUnit: number; unit: string }> = {}
      let hasNewIngredients = false

      ingredients.forEach((ingredient) => {
        const key = ingredient.name.toLowerCase()
        console.log("[v0] Processing ingredient:", key)

        // Check if ingredient already exists in static or custom database
        if (!ingredientPrices[key] && !customIngredients[key]) {
          const estimatedPrice = estimatePriceByCategory(ingredient.category)
          newIngredients[key] = {
            pricePerUnit: estimatedPrice,
            unit: ingredient.unit,
          }
          hasNewIngredients = true
          console.log("[v0] New ingredient added:", key, "with price:", estimatedPrice, "and unit:", ingredient.unit)
        } else {
          console.log("[v0] Ingredient already exists:", key)
        }
      })

      if (hasNewIngredients) {
        const updated = { ...customIngredients, ...newIngredients }
        setCustomIngredients(updated)

        // Persist to localStorage
        try {
          window.localStorage.setItem("custom-ingredients", JSON.stringify(updated))
          console.log("[v0] Added new ingredients to database:", Object.keys(newIngredients))
          console.log("[v0] Total custom ingredients now:", Object.keys(updated).length)
        } catch (error) {
          console.error("[v0] Error saving custom ingredients:", error)
        }
      } else {
        console.log("[v0] No new ingredients to add")
      }
    },
    [customIngredients],
  )

  return {
    allIngredients,
    addIngredientsFromRecipe,
  }
}

function estimatePriceByCategory(category: string): number {
  switch (category) {
    case "produce":
      return 0.3 // $0.30 per unit for produce
    case "meat":
      return 3.0 // $3.00 per unit for meat
    case "dairy":
      return 0.4 // $0.40 per unit for dairy
    case "grains":
      return 0.2 // $0.20 per unit for grains
    case "spices":
      return 0.1 // $0.10 per unit for spices
    default:
      return 0.5 // $0.50 per unit for other
  }
}
