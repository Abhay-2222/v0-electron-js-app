"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, DollarSign, UtensilsCrossed } from "lucide-react"
import { formatWeekRange } from "@/lib/date-utils"
import type { WeekHistory } from "@/lib/types"

interface WeekHistoryProps {
  history: WeekHistory[]
  onClose: () => void
}

export function WeekHistoryView({ history, onClose }: WeekHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Go back">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-medium">Week History</h2>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No history available yet</p>
            <p className="text-sm text-muted-foreground mt-2">Start planning meals to see your weekly history here</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Go back">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-medium">Week History</h2>
      </div>

      <p className="text-sm text-muted-foreground">View your meal planning history from the past 4 weeks</p>

      <div className="space-y-3">
        {history.map((week) => {
          const isOverBudget = week.budget > 0 && week.spent > week.budget
          const percentUsed = week.budget > 0 ? (week.spent / week.budget) * 100 : 0

          return (
            <Card key={week.weekKey} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{formatWeekRange(week.weekStart)}</CardTitle>
                  {week.mealCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {week.mealCount} meal{week.mealCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                      <UtensilsCrossed className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Meals</p>
                      <p className="text-sm font-medium">{week.mealCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Spent</p>
                      <p className="text-sm font-medium">${week.spent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {week.budget > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Budget: ${week.budget.toFixed(0)}</span>
                      <span className={isOverBudget ? "text-destructive font-medium" : "text-primary font-medium"}>
                        {isOverBudget
                          ? `$${(week.spent - week.budget).toFixed(2)} over`
                          : `$${(week.budget - week.spent).toFixed(2)} left`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isOverBudget ? "bg-destructive" : percentUsed > 80 ? "bg-orange-500" : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
