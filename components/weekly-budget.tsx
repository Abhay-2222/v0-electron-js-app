"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, ChevronDown, ChevronUp, Edit2, Trash2, Check, X, Sparkles } from "lucide-react"

interface WeeklyBudgetProps {
  budget?: number
  spent?: number
  onSetBudget?: (amount: number) => void
  onRemoveBudget?: () => void
}

export function WeeklyBudget({ budget, spent = 0, onSetBudget, onRemoveBudget }: WeeklyBudgetProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(!budget)
  const [budgetInput, setBudgetInput] = useState(budget?.toString() || "")

  const handleSaveBudget = () => {
    console.log("[v0] Weekly budget save clicked, input value:", budgetInput)
    const amount = Number.parseFloat(budgetInput)
    console.log("[v0] Parsed amount:", amount)

    if (!isNaN(amount) && amount > 0) {
      console.log("[v0] Amount is valid, calling onSetBudget")
      onSetBudget?.(amount)
      setIsEditing(false)
    } else {
      console.log("[v0] Amount is invalid (must be greater than 0)")
    }
  }

  const handleCancelEdit = () => {
    if (budget) {
      setBudgetInput(budget.toString())
      setIsEditing(false)
    }
  }

  const handleEdit = () => {
    setBudgetInput(budget?.toString() || "")
    setIsEditing(true)
  }

  const handleRemove = () => {
    onRemoveBudget?.()
    setBudgetInput("")
    setIsEditing(true)
  }

  // Editing/Setting budget state
  if (isEditing) {
    return (
      <Card className="shadow-xl border-[3px] border-blue-500 bg-gradient-to-br from-blue-50 via-background to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 animate-pulse-subtle relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse-subtle">
          <Sparkles className="h-3.5 w-3.5" />
          Start Here
        </div>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <DollarSign className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold mb-1 text-blue-900 dark:text-blue-100">Set Your Weekly Budget</p>
              <p className="text-xs text-muted-foreground">Start planning your meals and save money</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                $
              </span>
              <Input
                type="number"
                placeholder="100.00"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="pl-7 h-11 text-base font-medium border-2 focus:border-blue-500"
                aria-label="Budget amount"
                min="0.01"
                step="0.01"
              />
            </div>
            <Button
              size="icon"
              onClick={handleSaveBudget}
              disabled={!budgetInput || Number.parseFloat(budgetInput) <= 0}
              aria-label="Save budget"
              className="h-11 w-11 shadow-lg bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-5 w-5" aria-hidden="true" />
            </Button>
            {budget && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEdit}
                aria-label="Cancel editing"
                className="h-11 w-11"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Budget display state
  const percentUsed = (spent / budget!) * 100
  const remaining = budget! - spent
  const isOverBudget = spent > budget!
  const overAmount = isOverBudget ? spent - budget! : 0

  // Cap progress bar at 100% but keep actual percentage for display logic
  const progressBarWidth = Math.min(percentUsed, 100)

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-3 pb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-expanded={isExpanded}
              aria-label={`Weekly budget: $${budget}, ${isOverBudget ? "over budget" : `${Math.min(percentUsed, 100).toFixed(0)}% used`}, ${isExpanded ? "collapse" : "expand"} details`}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Weekly Budget</p>
                <p className="text-xl">${budget}</p>
              </div>
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
            </button>
            <div className="flex gap-1 ml-2">
              <Button size="icon" variant="ghost" onClick={handleEdit} className="h-7 w-7" aria-label="Edit budget">
                <Edit2 className="h-3 w-3" aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRemove}
                className="h-7 w-7 text-destructive hover:text-destructive"
                aria-label="Remove budget"
              >
                <Trash2 className="h-3 w-3" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-2" role="region" aria-label="Budget details">
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                    isOverBudget ? "bg-destructive" : "bg-primary"
                  }`}
                  style={{ width: `${progressBarWidth}%` }}
                  role="progressbar"
                  aria-valuenow={progressBarWidth}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${progressBarWidth.toFixed(0)}% of budget used`}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className={`${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}>
                  {percentUsed.toFixed(0)}% used
                </span>
                <span className={`${isOverBudget ? "text-destructive" : "text-primary"}`}>
                  {isOverBudget ? `$${overAmount.toFixed(2)} over` : `$${remaining.toFixed(2)} left`}
                </span>
              </div>

              {isOverBudget && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2">
                  <p className="text-[10px] text-destructive">
                    You're over budget! Consider choosing more affordable meals.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
