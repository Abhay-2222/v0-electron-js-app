"use client"

import { useState, useMemo, useEffect } from "react"
import type { Recipe, MealPlan, WeeklyMealPlans, PantryItem, WeeklyBudgets, WeekHistory } from "@/lib/types"
import { sampleRecipes } from "@/lib/sample-recipes"
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
import {
  UtensilsCrossed,
  Calendar,
  ShoppingCart,
  Contrast,
  Package,
  SettingsIcon,
  MoreVertical,
  User,
  LogOut,
} from "lucide-react"
import { getWeekKey, getWeekStart, getWeekEnd } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { calculateGroceryListCost } from "@/lib/meal-utils"

type AppState = "initial-splash" | "auth" | "onboarding" | "main"

export default function MealPlannerPage() {
  const [recipes] = useState<Recipe[]>(sampleRecipes)
  const [allMealPlans, setAllMealPlans] = useLocalStorage<WeeklyMealPlans>("meal-planner-weeks", {})
  const [weeklyBudgets, setWeeklyBudgets] = useLocalStorage<WeeklyBudgets>("weekly-budgets", {})
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>("pantry-inventory", [])
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; mealType: string } | null>(null)
  const [highContrast, setHighContrast] = useLocalStorage("high-contrast-mode", false)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()))
  const [activeTab, setActiveTab] = useState<"planner" | "grocery" | "pantry" | "settings" | "history">("planner")
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage("onboarding-completed", false)
  const [hasAuthenticated, setHasAuthenticated] = useLocalStorage("authenticated", false)
  const [isClient, setIsClient] = useState(false)
  const [appState, setAppState] = useState<AppState>("initial-splash")

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      if (!hasAuthenticated) {
        setAppState("initial-splash")
      } else if (!hasCompletedOnboarding) {
        setAppState("onboarding")
      } else {
        setAppState("main")
      }
    }
  }, [isClient, hasAuthenticated, hasCompletedOnboarding])

  const currentWeekKey = getWeekKey(currentWeekStart)
  const currentMealPlan = allMealPlans[currentWeekKey] || {}
  const currentWeekBudget = weeklyBudgets[currentWeekKey] || 0

  const handleUpdateMealPlan = (mealPlan: MealPlan) => {
    const newAllPlans = { ...allMealPlans }
    newAllPlans[currentWeekKey] = mealPlan
    setAllMealPlans(newAllPlans)
  }

  const handleAddMeal = (day: string, mealType: string) => {
    setSelectedSlot({ day, mealType })
    setSelectorOpen(true)
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!selectedSlot) return

    const { day, mealType } = selectedSlot
    const newMealPlan = { ...currentMealPlan }
    if (!newMealPlan[day]) {
      newMealPlan[day] = {}
    }
    newMealPlan[day][mealType] = recipe
    handleUpdateMealPlan(newMealPlan)
  }

  const handlePantryChange = (items: PantryItem[]) => {
    setPantryItems(items)
  }

  const actualSpending = useMemo(() => {
    return calculateGroceryListCost(currentMealPlan, pantryItems)
  }, [currentMealPlan, pantryItems])

  const handleBudgetChange = (budget: number) => {
    const newBudgets = { ...weeklyBudgets }
    newBudgets[currentWeekKey] = budget
    setWeeklyBudgets(newBudgets)
  }

  const weekHistory = useMemo((): WeekHistory[] => {
    const history: WeekHistory[] = []
    const today = new Date()

    for (let i = 1; i <= 4; i++) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - i * 7)
      const weekStartDate = getWeekStart(weekStart)
      const weekKey = getWeekKey(weekStartDate)

      const mealPlan = allMealPlans[weekKey] || {}
      const budget = weeklyBudgets[weekKey] || 0
      const spent = calculateGroceryListCost(mealPlan, pantryItems)

      let mealCount = 0
      Object.values(mealPlan).forEach((dayMeals) => {
        mealCount += Object.keys(dayMeals).length
      })

      if (mealCount > 0 || budget > 0) {
        history.push({
          weekKey,
          weekStart: weekStartDate,
          weekEnd: getWeekEnd(weekStartDate),
          mealPlan,
          budget,
          spent,
          mealCount,
        })
      }
    }

    return history
  }, [allMealPlans, weeklyBudgets, pantryItems])

  const handleSignOut = () => {
    setHasAuthenticated(false)
    setHasCompletedOnboarding(false)
    setAppState("initial-splash")
  }

  if (!isClient) {
    return null
  }

  if (appState === "initial-splash") {
    return (
      <InitialSplash
        onComplete={() => {
          setAppState("auth")
        }}
      />
    )
  }

  if (appState === "auth") {
    return (
      <AuthScreen
        onComplete={() => {
          setHasAuthenticated(true)
          setAppState("onboarding")
        }}
      />
    )
  }

  if (appState === "onboarding") {
    return (
      <OnboardingSplash
        onComplete={() => {
          setHasCompletedOnboarding(true)
          setAppState("main")
        }}
      />
    )
  }

  return (
    <div className={`min-h-screen bg-background ${highContrast ? "high-contrast" : ""}`}>
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                <UtensilsCrossed className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-xl h-10 w-10 hover:bg-muted/50 transition-colors"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" sideOffset={8}>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setHighContrast(!highContrast)}
                  className={highContrast ? "bg-accent" : ""}
                >
                  <Contrast className="mr-2 h-4 w-4" />
                  High Contrast
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-5 sm:px-6 md:px-8 py-4 pb-32 overflow-y-auto">
        <div className="w-full">
          {activeTab === "planner" && (
            <div className="animate-slide-up">
              <WeeklyPlanner
                mealPlan={currentMealPlan}
                onUpdateMealPlan={handleUpdateMealPlan}
                onAddMeal={handleAddMeal}
                currentWeekStart={currentWeekStart}
                onWeekChange={setCurrentWeekStart}
                weeklyBudget={currentWeekBudget}
                onBudgetChange={handleBudgetChange}
                actualSpending={actualSpending}
              />
            </div>
          )}

          {activeTab === "grocery" && (
            <div className="animate-slide-up">
              <GroceryList mealPlan={currentMealPlan} pantryItems={pantryItems} />
            </div>
          )}

          {activeTab === "pantry" && (
            <div className="animate-slide-up">
              <PantryInventory onPantryChange={handlePantryChange} />
            </div>
          )}

          {activeTab === "history" && (
            <div className="animate-slide-up">
              <WeekHistoryView history={weekHistory} onClose={() => setActiveTab("planner")} />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-slide-up">
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

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-around py-2 gap-2">
            <button
              onClick={() => setActiveTab("planner")}
              className={`flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
                activeTab === "planner"
                  ? "bg-primary/10 text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              aria-label="Planner"
              aria-current={activeTab === "planner" ? "page" : undefined}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  activeTab === "planner"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-transparent"
                }`}
              >
                <Calendar className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-[11px]">Planner</span>
            </button>

            <button
              onClick={() => setActiveTab("grocery")}
              className={`flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
                activeTab === "grocery"
                  ? "bg-primary/10 text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              aria-label="Grocery List"
              aria-current={activeTab === "grocery" ? "page" : undefined}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  activeTab === "grocery"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-transparent"
                }`}
              >
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-[11px]">Grocery</span>
            </button>

            <button
              onClick={() => setActiveTab("pantry")}
              className={`flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
                activeTab === "pantry"
                  ? "bg-primary/10 text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              aria-label="Pantry Inventory"
              aria-current={activeTab === "pantry" ? "page" : undefined}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  activeTab === "pantry"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-transparent"
                }`}
              >
                <Package className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-[11px]">Pantry</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
                activeTab === "settings"
                  ? "bg-primary/10 text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              aria-label="Settings"
              aria-current={activeTab === "settings" ? "page" : undefined}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-transparent"
                }`}
              >
                <SettingsIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-[11px]">Settings</span>
            </button>
          </div>
        </div>
      </nav>

      <RecipeSelectorSheet
        recipes={recipes}
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelectRecipe={handleSelectRecipe}
        currentMeal={selectedSlot ? `${selectedSlot.mealType} for ${selectedSlot.day}` : undefined}
        allMealPlans={allMealPlans}
        weeklyBudget={currentWeekBudget}
      />
    </div>
  )
}
