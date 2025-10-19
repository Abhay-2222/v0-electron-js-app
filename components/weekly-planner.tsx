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
  DropdownMenuLabel,
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <BudgetTracker actualSpending={actualSpending} weeklyBudget={weeklyBudget} onBudgetChange={onBudgetChange} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousWeek}
          aria-label="Go to previous week"
          className="h-10 w-10 flex-shrink-0 rounded-xl hover:bg-muted/60 hover-scale hover:rotate-[-5deg] transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="flex-1 min-w-0 flex items-center justify-center">
          <p
            className={`text-sm font-medium whitespace-nowrap transition-all ${
              isCurrentWeek ? "text-primary bg-primary/10 px-4 py-2 rounded-full" : "text-foreground"
            }`}
            aria-live="polite"
          >
            {formatWeekRange(currentWeekStart)}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode(viewMode === "single" ? "grid" : "single")}
            aria-label={viewMode === "single" ? "Switch to grid view" : "Switch to single day view"}
            title={viewMode === "single" ? "Grid view" : "Single day view"}
            className="h-10 w-10 rounded-xl hover:bg-muted/60 hover-scale hover:rotate-[5deg] transition-all duration-300"
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
                className="h-10 w-10 rounded-xl hover:bg-muted/60 hover-scale hover:rotate-[5deg] transition-all duration-300"
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!isCurrentWeek && (
                <>
                  <DropdownMenuItem onClick={goToCurrentWeek} className="cursor-pointer">
                    <Calendar className="h-4 w-4 mr-3" aria-hidden="true" />
                    Go to Current Week
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleCopyLastWeek} disabled={!lastWeekMealPlan} className="cursor-pointer">
                <Calendar className="h-4 w-4 mr-3" aria-hidden="true" />
                Copy Last Week
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowClearConfirm(true)}
                disabled={!hasMeals}
                className="text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-3" aria-hidden="true" />
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
          className="h-10 w-10 flex-shrink-0 rounded-xl hover:bg-muted/60 hover-scale hover:rotate-[5deg] transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>

      {viewMode === "single" ? (
        <>
          <div className="flex gap-2 justify-between px-1" role="tablist" aria-label="Days of the week">
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
                  className={`flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-2xl transition-all w-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover-scale animate-scale-in animate-stagger-${index + 1} ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-muted/50 hover:bg-muted"
                  } ${isToday && !isActive ? "ring-2 ring-primary/40" : ""}`}
                >
                  <span className="text-[10px] leading-none opacity-90 font-medium">{getAbbreviatedDay(date)}</span>
                  <span className="text-base leading-none font-semibold">{getDayNumber(date)}</span>
                  {mealCount > 0 && (
                    <div
                      className={`h-1.5 w-1.5 rounded-full animate-pulse-ring ${isActive ? "bg-primary-foreground" : "bg-primary"}`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div
            className="space-y-4 animate-slide-up-delayed"
            role="region"
            aria-label={`Meals for ${formatDayWithDate(currentDate)}`}
          >
            {MEAL_TYPES.map((mealType, index) => {
              const meal = mealPlan[currentDay]?.[mealType]

              return (
                <Card key={mealType} className="card-elevated overflow-hidden border-border/40 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="text-lg capitalize tracking-tight font-semibold">{mealType}</h4>
                      {meal && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 flex-shrink-0 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all hover-scale"
                          onClick={() => handleRemoveMeal(currentDay, mealType)}
                          aria-label={`Remove ${meal.name} from ${mealType}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>

                    {meal ? (
                      <div className="flex gap-4 overflow-hidden">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-border/20">
                          <Image
                            src={meal.image || "/placeholder.svg?height=80&width=80"}
                            alt={`${meal.name} - ${mealType} meal`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="font-medium text-base text-balance line-clamp-2 break-words mb-3">
                            {meal.name}
                          </p>
                          <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Clock className="h-4 w-4" aria-hidden="true" />
                              <span>{meal.prepTime + meal.cookTime}m</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Users className="h-4 w-4" aria-hidden="true" />
                              <span>{meal.servings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-20 border-2 border-dashed bg-transparent rounded-2xl hover:bg-muted/50 hover:border-primary/50 transition-all hover-lift"
                        onClick={() => onAddMeal(currentDay, mealType)}
                        aria-label={`Add ${mealType} for ${formatDayWithDate(currentDate)}`}
                      >
                        <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                        <span className="font-medium">Add {mealType}</span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div>
            <DailyNutrition mealPlan={mealPlan} currentDay={currentDay} />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-4" role="region" aria-label="Week overview">
          {daysOfWeek.map((date, index) => {
            const dayKey = getDayKey(date)
            const dayMeals = mealPlan[dayKey] || {}
            const mealCount = Object.keys(dayMeals).length
            const isToday = date.toDateString() === new Date().toDateString()

            return (
              <Card key={index} className={`card-elevated ${isToday ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">
                      {formatDayWithDate(date)}
                      {isToday && <span className="sr-only"> (today)</span>}
                    </h3>
                    {mealCount > 0 && (
                      <span
                        className="text-xs text-muted-foreground font-medium"
                        aria-label={`${mealCount} meal${mealCount > 1 ? "s" : ""} planned`}
                      >
                        {mealCount} meal{mealCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {MEAL_TYPES.map((mealType) => {
                      const meal = dayMeals[mealType]
                      return (
                        <div key={mealType} className="space-y-2">
                          <p className="text-xs text-muted-foreground capitalize font-medium">{mealType}</p>
                          {meal ? (
                            <div className="relative aspect-square rounded-xl overflow-hidden group">
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
                                  className="h-9 w-9 text-white hover:bg-white/20 rounded-xl"
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
                              className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center hover:bg-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover-lift"
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
