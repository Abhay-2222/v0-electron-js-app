import type { Recipe, Ingredient, PantryItem } from "./types"

export function validateRecipe(recipe: any): recipe is Recipe {
  return (
    typeof recipe === "object" &&
    typeof recipe.id === "string" &&
    typeof recipe.name === "string" &&
    typeof recipe.category === "string" &&
    typeof recipe.diet === "string" &&
    typeof recipe.prepTime === "number" &&
    typeof recipe.cookTime === "number" &&
    typeof recipe.servings === "number" &&
    Array.isArray(recipe.ingredients) &&
    Array.isArray(recipe.instructions)
  )
}

export function validateIngredient(ingredient: any): ingredient is Ingredient {
  return (
    typeof ingredient === "object" &&
    typeof ingredient.id === "string" &&
    typeof ingredient.name === "string" &&
    typeof ingredient.amount === "number" &&
    typeof ingredient.unit === "string" &&
    typeof ingredient.category === "string"
  )
}

export function validatePantryItem(item: any): item is PantryItem {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.amount === "number" &&
    typeof item.unit === "string" &&
    typeof item.category === "string" &&
    typeof item.addedDate === "string"
  )
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, "")
}

export function sanitizeNumber(num: any, defaultValue = 0): number {
  const parsed = Number(num)
  return isNaN(parsed) ? defaultValue : parsed
}
