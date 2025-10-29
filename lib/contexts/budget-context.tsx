"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { getWeekKey } from "@/lib/date-utils"
import { calculateGroceryListCost } from "@/lib/meal-utils"
import type { WeeklyBudgets, MealPlan, PantryItem } from "@/lib/types"

interface BudgetContextType {
  weeklyBudgets: WeeklyBudgets
  getCurrentBudget: (weekStart: Date) => number
  setWeekBudget: (weekStart: Date, budget: number) => void
  calculateSpending: (mealPlan: MealPlan, pantryItems: PantryItem[]) => number
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [weeklyBudgets, setWeeklyBudgets] = useLocalStorage<WeeklyBudgets>("weekly-budgets", {})

  const getCurrentBudget = (weekStart: Date) => {
    const weekKey = getWeekKey(weekStart)
    return weeklyBudgets[weekKey] || 0
  }

  const setWeekBudget = (weekStart: Date, budget: number) => {
    const weekKey = getWeekKey(weekStart)
    const newBudgets = { ...weeklyBudgets }
    newBudgets[weekKey] = budget
    setWeeklyBudgets(newBudgets)
  }

  const calculateSpending = (mealPlan: MealPlan, pantryItems: PantryItem[]) => {
    return calculateGroceryListCost(mealPlan, pantryItems)
  }

  return (
    <BudgetContext.Provider
      value={{
        weeklyBudgets,
        getCurrentBudget,
        setWeekBudget,
        calculateSpending,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error("useBudget must be used within BudgetProvider")
  }
  return context
}
