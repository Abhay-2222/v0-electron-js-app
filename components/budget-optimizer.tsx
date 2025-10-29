"use client"

import { useMemo, useState } from "react"
import type { MealPlan } from "@/lib/types"
import { TrendingUp, AlertCircle, Lightbulb, X, Sparkles } from "lucide-react"
import { getBudgetOptimizationSuggestions } from "@/lib/smart-recommendations"
import { Button } from "@/components/ui/button"

interface BudgetOptimizerProps {
  currentSpending: number
  weeklyBudget: number
  mealPlan: MealPlan
}

export function BudgetOptimizer({ currentSpending, weeklyBudget, mealPlan }: BudgetOptimizerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const optimization = useMemo(
    () => getBudgetOptimizationSuggestions(currentSpending, weeklyBudget, mealPlan),
    [currentSpending, weeklyBudget, mealPlan],
  )

  const remainingBudget = weeklyBudget - currentSpending

  const getStatusConfig = () => {
    switch (optimization.status) {
      case "over":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          iconBg: "bg-red-100 dark:bg-red-950",
          iconColor: "text-red-600 dark:text-red-400",
          message: "Over budget",
          messageColor: "text-red-700 dark:text-red-300",
          bg: "bg-red-50 dark:bg-red-950/30",
          border: "border-red-200 dark:border-red-900",
        }
      case "on-track":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          iconBg: "bg-yellow-100 dark:bg-yellow-950",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          message: "Close to budget",
          messageColor: "text-yellow-700 dark:text-yellow-300",
          bg: "bg-yellow-50 dark:bg-yellow-950/30",
          border: "border-yellow-200 dark:border-yellow-900",
        }
      case "under":
        return {
          icon: <Sparkles className="h-4 w-4" />,
          iconBg: "bg-green-100 dark:bg-green-950",
          iconColor: "text-green-600 dark:text-green-400",
          message: "Great savings!",
          messageColor: "text-green-700 dark:text-green-300",
          bg: "bg-green-50 dark:bg-green-950/30",
          border: "border-green-200 dark:border-green-900",
        }
    }
  }

  if (optimization.suggestions.length === 0) {
    return null
  }

  if (isDismissed) {
    return null
  }

  const statusConfig = getStatusConfig()

  return (
    <div className={`p-2.5 rounded-lg ${statusConfig.bg} border ${statusConfig.border} relative`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        onClick={() => setIsDismissed(true)}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Dismiss</span>
      </Button>

      <div className="flex items-start gap-2 pr-6">
        <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${statusConfig.iconBg}`}>
          <div className={statusConfig.iconColor}>{statusConfig.icon}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-xs ${statusConfig.messageColor}`}>{statusConfig.message}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {remainingBudget >= 0
                ? `$${remainingBudget.toFixed(2)} left`
                : `$${Math.abs(remainingBudget).toFixed(2)} over`}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Lightbulb className="h-3 w-3" />
            <span>{optimization.suggestions.length} money-saving tips</span>
          </button>

          {isExpanded && (
            <ul className="mt-1.5 space-y-1 pl-4">
              {optimization.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <span className="text-muted-foreground shrink-0">•</span>
                  <span className="text-balance">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
