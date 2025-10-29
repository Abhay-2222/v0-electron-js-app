import type { Recipe, PantryItem, MealPlan, WeeklyMealPlans } from "./types"
import { getRecentlyEatenRecipes } from "./meal-utils"

export interface RecipeRecommendation {
  recipe: Recipe
  matchScore: number
  matchedIngredients: string[]
  missingIngredients: string[]
  reason: string
}

export function getRecipeRecommendationsFromPantry(
  recipes: Recipe[],
  pantryItems: PantryItem[],
  allMealPlans: WeeklyMealPlans,
  limit = 5,
): RecipeRecommendation[] {
  const recentlyEaten = getRecentlyEatenRecipes(allMealPlans, 7)
  const pantryIngredientNames = new Set(pantryItems.map((item) => item.name.toLowerCase()))

  const recommendations = recipes
    .filter((recipe) => !recentlyEaten.has(recipe.id))
    .map((recipe) => {
      const matchedIngredients: string[] = []
      const missingIngredients: string[] = []

      recipe.ingredients.forEach((ingredient) => {
        if (pantryIngredientNames.has(ingredient.name.toLowerCase())) {
          matchedIngredients.push(ingredient.name)
        } else {
          missingIngredients.push(ingredient.name)
        }
      })

      const matchScore = (matchedIngredients.length / recipe.ingredients.length) * 100

      let reason = ""
      if (matchScore === 100) {
        reason = "You have all ingredients!"
      } else if (matchScore >= 75) {
        reason = `You have ${matchedIngredients.length} of ${recipe.ingredients.length} ingredients`
      } else if (matchScore >= 50) {
        reason = `Only ${missingIngredients.length} ingredients needed`
      } else {
        reason = `${matchedIngredients.length} ingredients available`
      }

      return {
        recipe,
        matchScore,
        matchedIngredients,
        missingIngredients,
        reason,
      }
    })
    .filter((rec) => rec.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)

  return recommendations
}

export function getExpiringIngredientsAlerts(pantryItems: PantryItem[]): {
  expiringSoon: PantryItem[]
  expired: PantryItem[]
  lowStock: PantryItem[]
} {
  const today = new Date()
  const expiringSoon: PantryItem[] = []
  const expired: PantryItem[] = []
  const lowStock: PantryItem[] = []

  pantryItems.forEach((item) => {
    // Check expiration
    if (item.expirationDate) {
      const expirationDate = new Date(item.expirationDate)
      const daysUntilExpiry = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilExpiry < 0) {
        expired.push(item)
      } else if (daysUntilExpiry <= 3) {
        expiringSoon.push(item)
      }
    }

    // Check low stock
    if (item.lowStockThreshold && item.amount <= item.lowStockThreshold) {
      lowStock.push(item)
    }
  })

  return { expiringSoon, expired, lowStock }
}

export function getRecipesUsingExpiringIngredients(
  recipes: Recipe[],
  expiringItems: PantryItem[],
  allMealPlans: WeeklyMealPlans,
): Recipe[] {
  const recentlyEaten = getRecentlyEatenRecipes(allMealPlans, 7)
  const expiringIngredientNames = new Set(expiringItems.map((item) => item.name.toLowerCase()))

  return recipes
    .filter((recipe) => {
      if (recentlyEaten.has(recipe.id)) return false

      return recipe.ingredients.some((ingredient) => expiringIngredientNames.has(ingredient.name.toLowerCase()))
    })
    .slice(0, 5)
}

export function getBudgetOptimizationSuggestions(
  currentSpending: number,
  weeklyBudget: number,
  mealPlan: MealPlan,
): {
  status: "under" | "on-track" | "over"
  message: string
  suggestions: string[]
} {
  const percentageUsed = (currentSpending / weeklyBudget) * 100
  const remaining = weeklyBudget - currentSpending

  let status: "under" | "on-track" | "over"
  let message: string
  const suggestions: string[] = []

  if (percentageUsed > 100) {
    status = "over"
    message = `You're $${Math.abs(remaining).toFixed(2)} over budget`
    suggestions.push("Consider replacing expensive meals with budget-friendly alternatives")
    suggestions.push("Look for recipes with common, affordable ingredients")
    suggestions.push("Plan meals that use ingredients you already have in your pantry")
  } else if (percentageUsed > 80) {
    status = "on-track"
    message = `You have $${remaining.toFixed(2)} left for this week`
    suggestions.push("You're close to your budget limit - plan carefully for remaining meals")
    suggestions.push("Consider using pantry staples for your next meals")
  } else {
    status = "under"
    message = `You're doing great! $${remaining.toFixed(2)} under budget`
    suggestions.push("You have room to try a special recipe this week")
    suggestions.push("Consider stocking up on pantry essentials")
  }

  return { status, message, suggestions }
}
