"use client"

import { useState } from "react"
import type { Recipe, WeeklyMealPlans } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Clock,
  Users,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Sparkles,
  DollarSign,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getSuggestedRecipes, wasRecentlyEaten, getMealEatenCount } from "@/lib/meal-utils"
import { Badge } from "@/components/ui/badge"
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

interface RecipeSelectorSheetProps {
  recipes: Recipe[]
  isOpen: boolean
  onClose: () => void
  onSelectRecipe: (recipe: Recipe) => void
  currentMeal?: string
  allMealPlans: WeeklyMealPlans
  weeklyBudget?: number
}

export function RecipeSelectorSheet({
  recipes,
  isOpen,
  onClose,
  onSelectRecipe,
  currentMeal,
  allMealPlans,
  weeklyBudget,
}: RecipeSelectorSheetProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDiet, setSelectedDiet] = useState<string>("all")
  const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [confirmRecipe, setConfirmRecipe] = useState<{
    recipe: Recipe
    recentInfo: { eaten: boolean; daysAgo?: number }
  } | null>(null)

  const categories = ["all", ...Array.from(new Set(recipes.map((r) => r.category)))]
  const diets = ["all", "classic", "low-carb", "keto", "flexitarian", "paleo", "vegetarian", "pescatarian", "vegan"]

  const mealType = currentMeal?.split(" ")[0]?.toLowerCase()

  const suggestedRecipes = getSuggestedRecipes(
    recipes,
    allMealPlans,
    showSuggestions ? mealType : undefined,
    weeklyBudget,
  )

  const filteredRecipes = (showSuggestions ? suggestedRecipes : recipes).filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
    const matchesDiet = selectedDiet === "all" || recipe.diet === selectedDiet
    return matchesSearch && matchesCategory && matchesDiet
  })

  const handleSelectRecipe = (recipe: Recipe) => {
    const recentlyEaten = wasRecentlyEaten(recipe.id, allMealPlans, 3)

    if (recentlyEaten.eaten) {
      setConfirmRecipe({ recipe, recentInfo: recentlyEaten })
      return
    }

    onSelectRecipe(recipe)
    onClose()
    setSearchQuery("")
    setPreviewRecipe(null)
    setShowSuggestions(false)
  }

  const handleConfirmSelection = () => {
    if (confirmRecipe) {
      onSelectRecipe(confirmRecipe.recipe)
      onClose()
      setSearchQuery("")
      setPreviewRecipe(null)
      setShowSuggestions(false)
      setConfirmRecipe(null)
    }
  }

  const handleRecipeClick = (recipe: Recipe) => {
    if (previewRecipe?.id === recipe.id) {
      setPreviewRecipe(null)
    } else {
      setPreviewRecipe(recipe)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breakfast":
        return "bg-[var(--wheat-l)] text-[var(--wheat-d)] border-[#e8c87a]"
      case "lunch":
        return "bg-[var(--sky-l)] text-[var(--sky)] border-[#a8c8dc]"
      case "dinner":
        return "bg-[var(--plum-l)] text-[var(--plum)] border-[#c8a8c8]"
      case "snack":
        return "bg-[var(--sage-l)] text-[var(--sage-d)] border-[#b8d6ba]"
      default:
        return "bg-[var(--cream-100)] text-[var(--stone-600)] border-[var(--cream-300)]"
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[85vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 pt-4 pb-2 flex-shrink-0">
            <DialogTitle className="font-serif text-lg italic text-foreground">{currentMeal ? `Select ${currentMeal}` : "Select Recipe"}</DialogTitle>
          </DialogHeader>

          <div className="px-6 space-y-3 flex-shrink-0">
            <Button
              variant={showSuggestions ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="w-full"
              aria-pressed={showSuggestions}
            >
              <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" />
              {showSuggestions ? "Showing Smart Suggestions" : "Show Smart Suggestions"}
            </Button>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search recipes"
              />
            </div>

            <div
              className="flex gap-2 overflow-x-auto pb-2 px-1 hide-scrollbar"
              role="group"
              aria-label="Filter by diet"
            >
              {diets.map((diet) => (
                <Button
                  key={diet}
                  variant={selectedDiet === diet ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDiet(diet)}
                  className="capitalize whitespace-nowrap flex-shrink-0"
                  aria-pressed={selectedDiet === diet}
                  aria-label={`Filter by ${diet}`}
                >
                  {diet}
                </Button>
              ))}
            </div>

            <div
              className="flex gap-2 overflow-x-auto pb-2 px-1 hide-scrollbar"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize whitespace-nowrap flex-shrink-0"
                  aria-pressed={selectedCategory === category}
                  aria-label={`Filter by ${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 px-5 overflow-y-auto">
            <div className="space-y-2 pb-4 px-2 py-1" role="list" aria-label="Available recipes">
              {filteredRecipes.map((recipe) => {
                const recentlyEaten = wasRecentlyEaten(recipe.id, allMealPlans, 3)
                const eatenCount = getMealEatenCount(recipe.id, allMealPlans)

                return (
                  <div key={recipe.id} className="space-y-2" role="listitem">
                    <button
                      onClick={() => handleRecipeClick(recipe)}
                      className={`w-full flex gap-2.5 p-2.5 rounded-lg border bg-card hover:bg-accent transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[88px] mx-1 ${
                        previewRecipe?.id === recipe.id ? "ring-2 ring-primary" : ""
                      } ${recentlyEaten.eaten ? "border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20" : ""}`}
                      aria-expanded={previewRecipe?.id === recipe.id}
                      aria-label={`${recipe.name}, ${recipe.diet} ${recipe.category}, ${recipe.prepTime + recipe.cookTime} minutes, ${recipe.servings} servings${recipe.nutrition ? `, ${recipe.nutrition.calories} calories` : ""}${recipe.cost ? `, $${recipe.cost.toFixed(2)} per serving` : ""}. Click to ${previewRecipe?.id === recipe.id ? "collapse" : "expand"} details.`}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={recipe.image || "/placeholder.svg?height=64&width=64"}
                          alt={recipe.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-base text-balance line-clamp-2">{recipe.name}</p>
                          {recipe.cost && (
                            <Badge variant="secondary" className="flex-shrink-0 text-sm">
                              <DollarSign className="h-3 w-3 mr-0.5" aria-hidden="true" />
                              {recipe.cost.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 capitalize ${getCategoryColor(recipe.category)}`}
                          >
                            {recipe.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 capitalize">
                            {recipe.diet}
                          </Badge>
                          {recentlyEaten.eaten && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              <AlertCircle className="h-3 w-3 mr-0.5" aria-hidden="true" />
                              {recentlyEaten.daysAgo === 0 ? "Eaten today" : `Eaten ${recentlyEaten.daysAgo}d ago`}
                            </Badge>
                          )}
                          {eatenCount > 0 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              <TrendingUp className="h-3 w-3 mr-0.5" aria-hidden="true" />
                              Eaten {eatenCount}x
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <span>{recipe.prepTime + recipe.cookTime}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" aria-hidden="true" />
                            <span>{recipe.servings}</span>
                          </div>
                          {recipe.nutrition && (
                            <div className="flex items-center gap-1">
                              <Flame className="h-3 w-3" aria-hidden="true" />
                              <span>{recipe.nutrition.calories} cal</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {previewRecipe?.id === recipe.id && (
                      <div
                        className="border rounded-lg p-3 bg-muted/50 space-y-2.5 animate-in slide-in-from-top-2 max-h-[400px] overflow-y-auto mx-1"
                        role="region"
                        aria-label="Recipe details"
                      >
                        <Button
                          onClick={() => handleSelectRecipe(recipe)}
                          className="w-full sticky top-0 z-10 bg-primary"
                          size="lg"
                          aria-label={`Add ${recipe.name} to ${currentMeal || "meal plan"}`}
                        >
                          {currentMeal ? `Add to ${currentMeal.split(" ")[0]}` : "Add to Meal Plan"}
                        </Button>

                        <Separator />

                        {recipe.nutrition && (
                          <div>
                            <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--stone-500)] mb-2">Nutrition per serving</p>
                            <div className="flex bg-card border border-[var(--cream-300)] rounded-lg overflow-hidden">
                              {[
                                { val: recipe.nutrition.calories, unit: "kcal", label: "Cal" },
                                { val: `${recipe.nutrition.protein}g`, unit: "protein", label: "Pro" },
                                { val: `${recipe.nutrition.carbs}g`, unit: "carbs", label: "Carb" },
                                { val: `${recipe.nutrition.fat}g`, unit: "fat", label: "Fat" },
                              ].map((n, i) => (
                                <div key={n.label} className={`flex-1 py-2 px-2 text-center ${i < 3 ? "border-r border-[var(--cream-200)]" : ""}`}>
                                  <span className="text-[14px] text-foreground block">{n.val}</span>
                                  <span className="font-mono text-[7px] tracking-wider uppercase text-[var(--stone-500)]">{n.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div>
                          <p className="text-xs font-medium mb-2">Ingredients</p>
                          <ul className="text-xs text-muted-foreground space-y-1" aria-label="Recipe ingredients">
                            {recipe.ingredients.map((ing) => (
                              <li key={ing.id}>
                                • {ing.amount} {ing.unit} {ing.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmRecipe} onOpenChange={() => setConfirmRecipe(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Recently Eaten Meal
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You ate <span className="font-semibold">{confirmRecipe?.recipe.name}</span>{" "}
                {confirmRecipe?.recentInfo.daysAgo === 0
                  ? "today"
                  : `${confirmRecipe?.recentInfo.daysAgo} day${confirmRecipe?.recentInfo.daysAgo === 1 ? "" : "s"} ago`}
                .
              </p>
              <p className="text-sm">
                To maintain variety in your diet, it's recommended to wait at least 3 days before repeating a meal.
              </p>
              <p className="text-sm font-medium">Do you still want to add this meal?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Choose Different Meal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSelection}>Add Anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
