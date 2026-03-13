"use client"

import type { MealPlan } from "@/lib/types"

interface DailyNutritionProps {
  mealPlan: MealPlan
  currentDay: string
}

export function DailyNutrition({ mealPlan, currentDay }: DailyNutritionProps) {
  const dayMeals = mealPlan[currentDay] || {}
  const meals = Object.values(dayMeals)

  const totals = meals.reduce(
    (acc, meal) => {
      if (meal.nutrition) {
        acc.calories += meal.nutrition.calories
        acc.protein += meal.nutrition.protein
        acc.carbs += meal.nutrition.carbs
        acc.fat += meal.nutrition.fat
      }
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  if (meals.length === 0) {
    return null
  }

  const nutritionItems = [
    { label: "Calories", value: Math.round(totals.calories).toLocaleString(), unit: "kcal" },
    { label: "Protein", value: `${Math.round(totals.protein)}g`, unit: "protein" },
    { label: "Carbs", value: `${Math.round(totals.carbs)}g`, unit: "carbs" },
    { label: "Fat", value: `${Math.round(totals.fat)}g`, unit: "fat" },
  ]

  return (
    <div>
      <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--stone-500)] mb-2.5">
        Daily total — {meals.length} meal{meals.length > 1 ? "s" : ""} planned
      </p>
      <div
        className="flex bg-card border border-[var(--cream-300)] rounded-xl overflow-hidden shadow-warm-xs"
        role="list"
        aria-label="Daily nutrition totals"
      >
        {nutritionItems.map((item, index) => (
          <div
            key={item.label}
            className={`flex-1 py-3.5 px-4 flex flex-col gap-0.5 ${
              index < nutritionItems.length - 1 ? "border-r border-[var(--cream-200)]" : ""
            }`}
            role="listitem"
          >
            <span className="text-xl text-foreground leading-none">{item.value}</span>
            <span className="font-mono text-[9px] tracking-wider text-[var(--stone-500)] mt-0.5">{item.unit}</span>
            <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-[var(--stone-500)] mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
