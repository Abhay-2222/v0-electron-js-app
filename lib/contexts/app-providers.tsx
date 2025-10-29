"use client"

import type { ReactNode } from "react"
import { RecipeProvider } from "./recipe-context"
import { MealPlanProvider } from "./meal-plan-context"
import { PantryProvider } from "./pantry-context"
import { BudgetProvider } from "./budget-context"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RecipeProvider>
      <MealPlanProvider>
        <PantryProvider>
          <BudgetProvider>{children}</BudgetProvider>
        </PantryProvider>
      </MealPlanProvider>
    </RecipeProvider>
  )
}
