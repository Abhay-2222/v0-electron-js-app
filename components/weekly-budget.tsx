"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, ChevronDown, ChevronUp, Edit2, Trash2, Check, X } from "lucide-react"

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
    const amount = Number.parseFloat(budgetInput)
    if (!isNaN(amount) && amount > 0) {
      onSetBudget?.(amount)
      setIsEditing(false)
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
      <Card className="shadow-sm border-2 border-dashed">
        <CardContent className="pt-3 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium mb-1">Weekly Budget</p>
              <p className="text-[10px] text-muted-foreground">Set your weekly meal spending limit</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="pl-6 h-8 text-sm"
                aria-label="Budget amount"
              />
            </div>
            <Button
              size="icon"
              onClick={handleSaveBudget}
              disabled={!budgetInput || Number.parseFloat(budgetInput) <= 0}
              aria-label="Save budget"
              className="h-8 w-8"
            >
              <Check className="h-3 w-3" aria-hidden="true" />
            </Button>
            {budget && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEdit}
                aria-label="Cancel editing"
                className="h-8 w-8"
              >
                <X className="h-3 w-3" aria-hidden="true" />
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
    <Card className="shadow-sm relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none animate-gradient-shift"
        style={{
          background:
            "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.25) 25%, rgba(34, 197, 94, 0.3) 50%, rgba(16, 185, 129, 0.25) 75%, rgba(34, 197, 94, 0.15) 100%)",
          backgroundSize: "300% 300%",
        }}
      />

      <CardContent className="pt-3 pb-3 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-expanded={isExpanded}
              aria-label={`Weekly budget: $${budget}, ${isOverBudget ? "over budget" : `${Math.min(percentUsed, 100).toFixed(0)}% used`}, ${isExpanded ? "collapse" : "expand"} details`}
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-medium text-muted-foreground">Weekly Budget</p>
                <p className="text-base font-bold">${budget}</p>
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
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
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
                <span className={`font-semibold ${isOverBudget ? "text-destructive" : "text-primary"}`}>
                  {isOverBudget ? `$${overAmount.toFixed(2)} over` : `$${remaining.toFixed(2)} left`}
                </span>
              </div>

              {isOverBudget && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2">
                  <p className="text-[10px] text-destructive font-medium">
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
