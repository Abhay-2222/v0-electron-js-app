"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { getWeekKey, getWeekStart } from "@/lib/date-utils"
import type { MealPlan, WeeklyMealPlans, Recipe } from "@/lib/types"

interface MealPlanContextType {
  allMealPlans: WeeklyMealPlans
  currentWeekStart: Date
  currentMealPlan: MealPlan
  setCurrentWeekStart: (date: Date) => void
  updateMealPlan: (mealPlan: MealPlan) => void
  addMeal: (day: string, mealType: string, recipe: Recipe) => void
  removeMeal: (day: string, mealType: string) => void
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined)

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [allMealPlans, setAllMealPlans] = useLocalStorage<WeeklyMealPlans>("meal-planner-weeks", {})
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()))

  const currentWeekKey = getWeekKey(currentWeekStart)
  const currentMealPlan = allMealPlans[currentWeekKey] || {}

  const updateMealPlan = (mealPlan: MealPlan) => {
    const newAllPlans = { ...allMealPlans }
    newAllPlans[currentWeekKey] = mealPlan
    setAllMealPlans(newAllPlans)
  }

  const addMeal = (day: string, mealType: string, recipe: Recipe) => {
    const newMealPlan = { ...currentMealPlan }
    if (!newMealPlan[day]) {
      newMealPlan[day] = {}
    }
    newMealPlan[day][mealType] = recipe
    updateMealPlan(newMealPlan)
  }

  const removeMeal = (day: string, mealType: string) => {
    const newMealPlan = { ...currentMealPlan }
    if (newMealPlan[day]) {
      delete newMealPlan[day][mealType]
      if (Object.keys(newMealPlan[day]).length === 0) {
        delete newMealPlan[day]
      }
    }
    updateMealPlan(newMealPlan)
  }

  return (
    <MealPlanContext.Provider
      value={{
        allMealPlans,
        currentWeekStart,
        currentMealPlan,
        setCurrentWeekStart,
        updateMealPlan,
        addMeal,
        removeMeal,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  )
}

export function useMealPlan() {
  const context = useContext(MealPlanContext)
  if (!context) {
    throw new Error("useMealPlan must be used within MealPlanProvider")
  }
  return context
}
