"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingDown, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface BudgetTrackerProps {
  actualSpending: number
  weeklyBudget: number
  onBudgetChange: (budget: number) => void
}

export function BudgetTracker({ actualSpending, weeklyBudget, onBudgetChange }: BudgetTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalCost = actualSpending
  const remaining = weeklyBudget - totalCost
  const percentUsed = weeklyBudget > 0 ? (totalCost / weeklyBudget) * 100 : 0
  const isOverBudget = remaining < 0

  if (weeklyBudget > 0 && !isExpanded) {
    return (
      <button onClick={() => setIsExpanded(true)} className="w-full text-left group" aria-label="Expand budget details">
        <Card className="hover:shadow-lg transition-all shadow-md border-0 bg-gradient-to-br from-background to-muted/30">
          <CardContent className="py-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-11 w-11 rounded-full bg-primary/10 text-primary">
                    <DollarSign className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Weekly Budget</div>
                    <div className="text-lg">${weeklyBudget.toFixed(0)}</div>
                  </div>
                </div>
                <ChevronDown
                  className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isOverBudget ? "bg-destructive" : percentUsed > 80 ? "bg-orange-500" : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={percentUsed}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${percentUsed.toFixed(0)}% of budget used`}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{percentUsed.toFixed(0)}% used</span>
                  <span className={`${isOverBudget ? "text-destructive" : "text-primary"}`}>
                    ${Math.abs(remaining).toFixed(2)} {isOverBudget ? "over" : "left"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </button>
    )
  }

  return (
    <Card className="shadow-md border-0 bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" aria-hidden="true" />
            Weekly Budget
          </CardTitle>
          {weeklyBudget > 0 && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Collapse budget details"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget-input" className="text-xs text-muted-foreground">
            Set your weekly budget
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input
              id="budget-input"
              type="number"
              min="0"
              step="5"
              value={weeklyBudget || ""}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className="pl-7"
              placeholder="0.00"
              aria-label="Weekly budget amount"
            />
          </div>
        </div>

        {weeklyBudget > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className={`flex items-center gap-1 ${isOverBudget ? "text-destructive" : "text-primary"}`}>
                  {isOverBudget ? (
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="h-3 w-3" aria-hidden="true" />
                  )}
                  ${Math.abs(remaining).toFixed(2)}
                  {isOverBudget && " over"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isOverBudget ? "bg-destructive" : percentUsed > 80 ? "bg-orange-500" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  role="progressbar"
                  aria-valuenow={percentUsed}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${percentUsed.toFixed(0)}% of budget used`}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">{percentUsed.toFixed(0)}% of budget used</p>
            </div>

            {isOverBudget && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded" role="alert">
                You're over budget! Consider choosing more affordable meals.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
