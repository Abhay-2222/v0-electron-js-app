"use client"

import { useMemo } from "react"
import type { WeeklyMealPlans } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, DollarSign, Flame, Activity } from "lucide-react"

interface AnalyticsDashboardProps {
  allMealPlans: WeeklyMealPlans
  weeklyBudget: number
}

export function AnalyticsDashboard({ allMealPlans, weeklyBudget }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const weeks = Object.keys(allMealPlans).sort().reverse().slice(0, 4)

    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalSpent = 0
    let mealCount = 0
    const recipeCounts: Record<string, number> = {}

    weeks.forEach((weekKey) => {
      const weekPlan = allMealPlans[weekKey]
      Object.values(weekPlan).forEach((dayMeals) => {
        Object.values(dayMeals).forEach((recipe) => {
          mealCount++
          if (recipe.nutrition) {
            totalCalories += recipe.nutrition.calories
            totalProtein += recipe.nutrition.protein
            totalCarbs += recipe.nutrition.carbs
            totalFat += recipe.nutrition.fat
          }
          if (recipe.cost) {
            totalSpent += recipe.cost
          }
          recipeCounts[recipe.name] = (recipeCounts[recipe.name] || 0) + 1
        })
      })
    })

    const avgCalories = mealCount > 0 ? Math.round(totalCalories / mealCount) : 0
    const avgProtein = mealCount > 0 ? Math.round(totalProtein / mealCount) : 0
    const avgCarbs = mealCount > 0 ? Math.round(totalCarbs / mealCount) : 0
    const avgFat = mealCount > 0 ? Math.round(totalFat / mealCount) : 0
    const avgWeeklySpend = weeks.length > 0 ? totalSpent / weeks.length : 0
    const budgetAdherence = weeklyBudget > 0 ? ((weeklyBudget - avgWeeklySpend) / weeklyBudget) * 100 : 0

    const topRecipes = Object.entries(recipeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return {
      avgCalories,
      avgProtein,
      avgCarbs,
      avgFat,
      avgWeeklySpend,
      budgetAdherence,
      topRecipes,
      weeksAnalyzed: weeks.length,
      totalMeals: mealCount,
    }
  }, [allMealPlans, weeklyBudget])

  if (analytics.totalMeals === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
          <p className="text-sm">Plan some meals to see your analytics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
            Analytics Dashboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Last {analytics.weeksAnalyzed} weeks • {analytics.totalMeals} meals
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" aria-hidden="true" />
              Average Nutrition per Meal
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">Calories</span>
                </div>
                <p className="text-2xl font-bold">{analytics.avgCalories}</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">Protein</span>
                </div>
                <p className="text-2xl font-bold">{analytics.avgProtein}g</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">Carbs</span>
                </div>
                <p className="text-2xl font-bold">{analytics.avgCarbs}g</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">Fat</span>
                </div>
                <p className="text-2xl font-bold">{analytics.avgFat}g</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" aria-hidden="true" />
              Spending Analytics
            </h3>
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Weekly Spend</span>
                <span className="text-2xl font-bold">${analytics.avgWeeklySpend.toFixed(2)}</span>
              </div>
              {weeklyBudget > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
                  <span className="text-sm">
                    {analytics.budgetAdherence >= 0 ? (
                      <span className="text-green-600">
                        ${(weeklyBudget - analytics.avgWeeklySpend).toFixed(2)} under budget
                      </span>
                    ) : (
                      <span className="text-red-600">
                        ${Math.abs(weeklyBudget - analytics.avgWeeklySpend).toFixed(2)} over budget
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Top 5 Most Cooked Recipes</h3>
            <div className="space-y-2">
              {analytics.topRecipes.map((recipe, index) => (
                <div key={recipe.name} className="flex items-center justify-between p-2 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm">{recipe.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{recipe.count}x</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
