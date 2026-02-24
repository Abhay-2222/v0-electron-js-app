"use client"

import { useState } from "react"
import type { MealPlan } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Clock, Users, Plus, ChevronLeft, ChevronRight, Grid3x3, Calendar, MoreVertical, Trash2 } from "lucide-react"
import Image from "next/image"
import { formatWeekRange, getDaysOfWeek, formatDayWithDate, getDayKey, getWeekStart } from "@/lib/date-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { DailyNutrition } from "./daily-nutrition"
import { BudgetTracker } from "./budget-tracker"

interface WeeklyPlannerProps {
  mealPlan: MealPlan
  onUpdateMealPlan: (mealPlan: MealPlan) => void
  onAddMeal: (day: string, mealType: string) => void
  currentWeekStart: Date
  onWeekChange: (date: Date) => void
  weeklyBudget: number
  onBudgetChange: (budget: number) => void
  actualSpending: number
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const

const getAbbreviatedDay = (date: Date): string => {
  const days = ["S", "M", "T", "W", "T", "F", "S"]
  return days[date.getDay()]
}

const getDayNumber = (date: Date): string => {
  return date.getDate().toString()
}

export function WeeklyPlanner({
  mealPlan,
  onUpdateMealPlan,
  onAddMeal,
  currentWeekStart,
  onWeekChange,
  weeklyBudget,
  onBudgetChange,
  actualSpending,
}: WeeklyPlannerProps) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [viewMode, setViewMode] = useState<"single" | "grid">("single")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [lastWeekMealPlan, setLastWeekMealPlan] = useState<MealPlan | null>(null)

  const daysOfWeek = getDaysOfWeek(currentWeekStart)
  const currentDate = daysOfWeek[currentDayIndex]
  const currentDay = getDayKey(currentDate)

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() - 7)
    setLastWeekMealPlan(mealPlan)
    onWeekChange(newWeekStart)
    setCurrentDayIndex(0)
  }

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + 7)
    setLastWeekMealPlan(mealPlan)
    onWeekChange(newWeekStart)
    setCurrentDayIndex(0)
  }

  const goToCurrentWeek = () => {
    onWeekChange(getWeekStart(new Date()))
    setCurrentDayIndex(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  }

  const handleRemoveMeal = (day: string, mealType: string) => {
    const newMealPlan = { ...mealPlan }
    if (newMealPlan[day]) {
      delete newMealPlan[day][mealType]
      if (Object.keys(newMealPlan[day]).length === 0) {
        delete newMealPlan[day]
      }
    }
    onUpdateMealPlan(newMealPlan)
  }

  const handleClearAll = () => {
    onUpdateMealPlan({})
    setShowClearConfirm(false)
  }

  const handleCopyLastWeek = () => {
    if (lastWeekMealPlan) {
      onUpdateMealPlan(lastWeekMealPlan)
    }
  }

  const isCurrentWeek = getWeekStart(new Date()).getTime() === currentWeekStart.getTime()
  const hasMeals = Object.keys(mealPlan).length > 0

  return (
    <div className="space-y-5">
      <div className="mb-5">
        <BudgetTracker actualSpending={actualSpending} weeklyBudget={weeklyBudget} onBudgetChange={onBudgetChange} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousWeek}
          aria-label="Go to previous week"
          className="h-9 w-9 flex-shrink-0"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="flex-1 min-w-0 flex items-center justify-center">
          <p
            className={`text-xs whitespace-nowrap transition-all ${
              isCurrentWeek ? "text-primary bg-primary/10 px-3 py-1.5 rounded-full" : "text-foreground"
            }`}
            aria-live="polite"
          >
            {formatWeekRange(currentWeekStart)}
          </p>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === "single" ? "grid" : "single")}
            aria-label={viewMode === "single" ? "Switch to grid view" : "Switch to single day view"}
            title={viewMode === "single" ? "Grid view" : "Single day view"}
            className="h-9 w-9"
          >
            {viewMode === "single" ? (
              <Grid3x3 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Calendar className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Meal plan options"
                className="h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isCurrentWeek && (
                <>
                  <DropdownMenuItem onClick={goToCurrentWeek}>
                    <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                    Go to Current Week
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleCopyLastWeek} disabled={!lastWeekMealPlan}>
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                Copy Last Week
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowClearConfirm(true)}
                disabled={!hasMeals}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Clear All Meals
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextWeek}
          aria-label="Go to next week"
          className="h-9 w-9 flex-shrink-0"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>

      {viewMode === "single" ? (
        <>
          <div className="flex gap-2 justify-between px-2" role="tablist" aria-label="Days of the week">
            {daysOfWeek.map((date, index) => {
              const dayKey = getDayKey(date)
              const dayMeals = mealPlan[dayKey] || {}
              const mealCount = Object.keys(dayMeals).length
              const isActive = index === currentDayIndex
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <button
                  key={index}
                  onClick={() => setCurrentDayIndex(index)}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${formatDayWithDate(date)}${isToday ? " (today)" : ""}${mealCount > 0 ? `, ${mealCount} meal${mealCount > 1 ? "s" : ""} planned` : ""}`}
                  className={`flex flex-col items-center justify-center gap-1 px-1.5 py-2.5 rounded-xl transition-all w-[46px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/60 hover:bg-muted"
                  } ${isToday && !isActive ? "ring-2 ring-primary/30" : ""}`}
                >
                  <span className="text-[10px] leading-none opacity-80">{getAbbreviatedDay(date)}</span>
                  <span className="text-sm leading-none">{getDayNumber(date)}</span>
                  {mealCount > 0 && (
                    <div
                      className={`h-1 w-1 rounded-full ${isActive ? "bg-primary-foreground" : "bg-primary"}`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="space-y-4" role="region" aria-label={`Meals for ${formatDayWithDate(currentDate)}`}>
            {MEAL_TYPES.map((mealType, index) => {
              const meal = mealPlan[currentDay]?.[mealType]

              return (
                <Card
                  key={mealType}
                  className="shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-border/40"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg capitalize tracking-tight">{mealType}</h4>
                      {meal && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                          onClick={() => handleRemoveMeal(currentDay, mealType)}
                          aria-label={`Remove ${meal.name} from ${mealType}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>

                    {meal ? (
                      <div className="flex gap-3 overflow-hidden">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-border/30">
                          <Image
                            src={meal.image || "/placeholder.svg?height=64&width=64"}
                            alt={`${meal.name} - ${mealType} meal`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="font-normal text-base text-balance line-clamp-2 break-words mb-2">
                            {meal.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Clock className="h-4 w-4" aria-hidden="true" />
                              <span>{meal.prepTime + meal.cookTime}m</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Users className="h-4 w-4" aria-hidden="true" />
                              <span>{meal.servings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-16 border-2 border-dashed bg-transparent rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all"
                        onClick={() => onAddMeal(currentDay, mealType)}
                        aria-label={`Add ${mealType} for ${formatDayWithDate(currentDate)}`}
                      >
                        <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                        <span className="font-normal">Add {mealType}</span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-5">
            <DailyNutrition mealPlan={mealPlan} currentDay={currentDay} />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-3" role="region" aria-label="Week overview">
          {daysOfWeek.map((date, index) => {
            const dayKey = getDayKey(date)
            const dayMeals = mealPlan[dayKey] || {}
            const mealCount = Object.keys(dayMeals).length
            const isToday = date.toDateString() === new Date().toDateString()

            return (
              <Card key={index} className={isToday ? "ring-2 ring-primary" : ""}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm">
                      {formatDayWithDate(date)}
                      {isToday && <span className="sr-only"> (today)</span>}
                    </h3>
                    {mealCount > 0 && (
                      <span
                        className="text-xs text-muted-foreground"
                        aria-label={`${mealCount} meal${mealCount > 1 ? "s" : ""} planned`}
                      >
                        {mealCount} meal{mealCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {MEAL_TYPES.map((mealType) => {
                      const meal = dayMeals[mealType]
                      return (
                        <div key={mealType} className="space-y-1">
                          <p className="text-xs text-muted-foreground capitalize">{mealType}</p>
                          {meal ? (
                            <div className="relative aspect-square rounded overflow-hidden group">
                              <Image
                                src={meal.image || "/placeholder.svg?height=100&width=100"}
                                alt={`${meal.name} - ${mealType} for ${formatDayWithDate(date)}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-white hover:bg-white/20"
                                  onClick={() => handleRemoveMeal(dayKey, mealType)}
                                  aria-label={`Remove ${meal.name} from ${mealType}`}
                                >
                                  <X className="h-4 w-4" aria-hidden="true" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => onAddMeal(dayKey, mealType)}
                              className="aspect-square rounded border-2 border-dashed flex items-center justify-center hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              aria-label={`Add ${mealType} for ${formatDayWithDate(date)}`}
                            >
                              <Plus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all meals?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all meals from your current week's plan. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
