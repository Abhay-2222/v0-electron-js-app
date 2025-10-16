"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MealPlan } from "@/lib/types"
import { Flame, Beef, Wheat, Droplet } from "lucide-react"

interface DailyNutritionProps {
  mealPlan: MealPlan
  currentDay: string
}

export function DailyNutrition({ mealPlan, currentDay }: DailyNutritionProps) {
  const dayMeals = mealPlan[currentDay] || {}
  const meals = Object.values(dayMeals)

  // Calculate total nutrition for the day
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

  // If no meals planned, don't show the card
  if (meals.length === 0) {
    return null
  }

  const nutritionItems = [
    {
      label: "Calories",
      value: totals.calories,
      unit: "kcal",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Protein",
      value: totals.protein,
      unit: "g",
      icon: Beef,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Carbs",
      value: totals.carbs,
      unit: "g",
      icon: Wheat,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Fat",
      value: totals.fat,
      unit: "g",
      icon: Droplet,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <Card className="shadow-lg border border-border/50 bg-gradient-to-br from-background via-background to-muted/20">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm">Daily Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3 px-4">
        <div className="grid grid-cols-2 gap-2" role="list" aria-label="Daily nutrition totals">
          {nutritionItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={`flex items-center gap-2 p-2 rounded-lg ${item.bgColor} transition-all hover:scale-[1.02]`}
                role="listitem"
              >
                <div className={`${item.color}`} aria-hidden="true">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground leading-tight">{item.label}</p>
                  <p className="text-base leading-none mt-0.5">
                    {Math.round(item.value)}
                    <span className="text-[10px] text-muted-foreground ml-0.5">{item.unit}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center" role="note">
          Based on {meals.length} meal{meals.length > 1 ? "s" : ""} planned for today
        </p>
      </CardContent>
    </Card>
  )
}
