"use client"

import { useState, useMemo } from "react"
import type { Recipe } from "@/lib/types"
import { WeeklyPlanner } from "@/components/weekly-planner"
import { GroceryList } from "@/components/grocery-list"
import { RecipeSelectorSheet } from "@/components/recipe-selector-sheet"
import { PantryInventory } from "@/components/pantry-inventory"
import { Settings } from "@/components/settings"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { InitialSplash } from "@/components/initial-splash"
import { AuthScreen } from "@/components/auth-screen"
import { OnboardingSplash } from "@/components/onboarding-splash"
import { WeekHistoryView } from "@/components/week-history"
import { AppHeader } from "@/components/layout/app-header"
import { AppNavigation } from "@/components/layout/app-navigation"
import { getWeekKey, getWeekEnd } from "@/lib/date-utils"
import { useDynamicIngredients } from "@/hooks/use-dynamic-ingredients"
import { useAppState } from "@/hooks/use-app-state"
import { useRecipes } from "@/lib/contexts/recipe-context"
import { useMealPlan } from "@/lib/contexts/meal-plan-context"
import { usePantry } from "@/lib/contexts/pantry-context"
import { useBudget } from "@/lib/contexts/budget-context"
import { SmartRecommendationsCard } from "@/components/smart-recommendations-card"
import { ExpiringIngredientsAlert } from "@/components/expiring-ingredients-alert"
import { BudgetOptimizer } from "@/components/budget-optimizer"
import { BudgetInputDialog } from "@/components/budget-input-dialog"
import type { WeekHistory } from "@/lib/types"

type TabType = "planner" | "grocery" | "pantry" | "settings" | "history"

export default function MealPlannerPage() {
  const { recipes, addRecipe } = useRecipes()
  const { allMealPlans, currentWeekStart, currentMealPlan, setCurrentWeekStart, addMeal, updateMealPlan } =
    useMealPlan()
  const { pantryItems, setPantryItems } = usePantry()
  const { weeklyBudgets, getCurrentBudget, setWeekBudget, calculateSpending } = useBudget()

  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; mealType: string } | null>(null)
  const [highContrast, setHighContrast] = useLocalStorage("high-contrast-mode", false)
  const [activeTab, setActiveTab] = useState<TabType>("planner")
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false)
  const { allIngredients, addIngredientsFromRecipe } = useDynamicIngredients()
  const { appState, isClient, completeAuth, completeOnboarding, signOut } = useAppState()

  const currentWeekBudget = getCurrentBudget(currentWeekStart)
  const actualSpending = useMemo(() => {
    return calculateSpending(currentMealPlan, pantryItems)
  }, [currentMealPlan, pantryItems, calculateSpending])

  const handleAddMeal = (day: string, mealType: string) => {
    setSelectedSlot({ day, mealType })
    setSelectorOpen(true)
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!selectedSlot) return
    const { day, mealType } = selectedSlot
    addMeal(day, mealType, recipe)
  }

  const handleSmartRecipeSelect = (recipe: Recipe) => {
    setSelectorOpen(true)
  }

  const handleAddRecipeToLibrary = (recipe: Recipe) => {
    addIngredientsFromRecipe(recipe.ingredients)
    addRecipe(recipe)
  }

  const handleViewRecommendations = () => {
    setActiveTab("pantry")
  }

  const weekHistory = useMemo((): WeekHistory[] => {
    const history: WeekHistory[] = []
    const today = new Date()

    for (let i = 1; i <= 4; i++) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - i * 7)
      const weekKey = getWeekKey(weekStart)

      const mealPlan = allMealPlans[weekKey] || {}
      const budget = weeklyBudgets[weekKey] || 0
      const spent = calculateSpending(mealPlan, pantryItems)

      let mealCount = 0
      Object.values(mealPlan).forEach((dayMeals) => {
        mealCount += Object.keys(dayMeals).length
      })

      if (mealCount > 0 || budget > 0) {
        history.push({
          weekKey,
          weekStart,
          weekEnd: getWeekEnd(weekStart),
          mealPlan,
          budget,
          spent,
          mealCount,
        })
      }
    }

    return history
  }, [allMealPlans, weeklyBudgets, pantryItems, calculateSpending])

  if (!isClient) return null

  if (appState === "initial-splash") {
    return <InitialSplash onComplete={() => completeAuth()} />
  }

  if (appState === "auth") {
    return <AuthScreen onComplete={completeAuth} />
  }

  if (appState === "onboarding") {
    return <OnboardingSplash onComplete={completeOnboarding} />
  }

  return (
    <div className={`min-h-screen bg-background ${highContrast ? "high-contrast" : ""}`}>
      <AppHeader
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(!highContrast)}
        onSettingsClick={() => setActiveTab("settings")}
        onSignOut={signOut}
      />

      <main className="container mx-auto px-5 sm:px-6 md:px-8 py-6 pb-32 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          {activeTab === "planner" && (
            <div className="space-y-4 animate-scale-in">
              <div className="space-y-3">
                <ExpiringIngredientsAlert
                  pantryItems={pantryItems}
                  recipes={recipes}
                  allMealPlans={allMealPlans}
                  onSelectRecipe={handleSmartRecipeSelect}
                />
                <BudgetOptimizer
                  currentSpending={actualSpending}
                  weeklyBudget={currentWeekBudget}
                  mealPlan={currentMealPlan}
                />
                <button onClick={handleViewRecommendations} className="w-full">
                  <SmartRecommendationsCard
                    recipes={recipes}
                    pantryItems={pantryItems}
                    allMealPlans={allMealPlans}
                    onSelectRecipe={handleSmartRecipeSelect}
                    compact={true}
                  />
                </button>
              </div>

              <WeeklyPlanner
                mealPlan={currentMealPlan}
                onUpdateMealPlan={updateMealPlan}
                onAddMeal={handleAddMeal}
                currentWeekStart={currentWeekStart}
                onWeekChange={setCurrentWeekStart}
                weeklyBudget={currentWeekBudget}
                onBudgetChange={() => setBudgetDialogOpen(true)}
                actualSpending={actualSpending}
              />
            </div>
          )}

          {activeTab === "grocery" && (
            <div className="animate-scale-in">
              <GroceryList mealPlan={currentMealPlan} pantryItems={pantryItems} />
            </div>
          )}

          {activeTab === "pantry" && (
            <div className="space-y-4 animate-scale-in">
              <SmartRecommendationsCard
                recipes={recipes}
                pantryItems={pantryItems}
                allMealPlans={allMealPlans}
                onSelectRecipe={handleSmartRecipeSelect}
                compact={false}
              />
              <PantryInventory onPantryChange={setPantryItems} availableIngredients={allIngredients} />
            </div>
          )}

          {activeTab === "history" && (
            <div className="animate-scale-in">
              <WeekHistoryView history={weekHistory} onClose={() => setActiveTab("planner")} />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-scale-in">
              <Settings
                highContrast={highContrast}
                onHighContrastChange={setHighContrast}
                allMealPlans={allMealPlans}
                weeklyBudget={currentWeekBudget}
                onViewHistory={() => setActiveTab("history")}
              />
            </div>
          )}
        </div>
      </main>

      <AppNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <RecipeSelectorSheet
        recipes={recipes}
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelectRecipe={handleSelectRecipe}
        onAddRecipeToLibrary={handleAddRecipeToLibrary}
        currentMeal={selectedSlot ? `${selectedSlot.mealType} for ${selectedSlot.day}` : undefined}
        allMealPlans={allMealPlans}
        weeklyBudget={currentWeekBudget}
      />

      <BudgetInputDialog
        open={budgetDialogOpen}
        onOpenChange={setBudgetDialogOpen}
        currentBudget={currentWeekBudget}
        onSave={(budget) => setWeekBudget(currentWeekStart, budget)}
      />
    </div>
  )
}
