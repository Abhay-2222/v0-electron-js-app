"use client"

import { useState, useEffect } from "react"
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
  Globe,
  Loader2,
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
import { useToast } from "@/hooks/use-toast"

interface RecipeSelectorSheetProps {
  recipes: Recipe[]
  isOpen: boolean
  onClose: () => void
  onSelectRecipe: (recipe: Recipe) => void
  onAddRecipeToLibrary?: (recipe: Recipe) => void
  currentMeal?: string
  allMealPlans: WeeklyMealPlans
  weeklyBudget?: number
}

export function RecipeSelectorSheet({
  recipes,
  isOpen,
  onClose,
  onSelectRecipe,
  onAddRecipeToLibrary,
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
  const [isSearchingAPI, setIsSearchingAPI] = useState(false)
  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([])
  const [showAPIResults, setShowAPIResults] = useState(false)
  const [showingSuggestions, setShowingSuggestions] = useState(false)
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()

  const categories = ["all", ...Array.from(new Set(recipes.map((r) => r.category)))]
  const diets = ["all", "classic", "low-carb", "keto", "flexitarian", "paleo", "vegetarian", "pescatarian", "vegan"]

  const mealType = currentMeal?.split(" ")[0]?.toLowerCase()

  const suggestedRecipes = getSuggestedRecipes(
    recipes,
    allMealPlans,
    showSuggestions ? mealType : undefined,
    weeklyBudget,
  )

  const baseRecipes = showAPIResults ? apiRecipes : showSuggestions ? suggestedRecipes : recipes

  const filteredRecipes = baseRecipes.filter((recipe) => {
    // For API results, if we're showing suggestions, don't filter by search query
    if (showAPIResults && showingSuggestions) {
      // Only apply diet/category filters if they're set
      const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
      const matchesDiet = selectedDiet === "all" || recipe.diet === selectedDiet
      return matchesCategory && matchesDiet
    }

    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Only apply filters to local recipes, not exact API matches
    if (showAPIResults) {
      return matchesSearch
    }

    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory
    const matchesDiet = selectedDiet === "all" || recipe.diet === selectedDiet
    return matchesSearch && matchesCategory && matchesDiet
  })

  console.log("[v0] Filtered recipes count:", filteredRecipes.length)
  console.log("[v0] Base recipes count:", baseRecipes.length)
  console.log("[v0] showAPIResults:", showAPIResults)
  console.log("[v0] showingSuggestions:", showingSuggestions)

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      return
    }

    const timer = setTimeout(() => {
      // Auto-trigger API search after 1 second of no typing
      handleAPISearch()
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleAPISearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a search term",
        description: "Please type something to search for recipes",
      })
      return
    }

    console.log("[v0] Starting API search for:", searchQuery)
    setIsSearchingAPI(true)
    setShowAPIResults(true)
    setShowingSuggestions(false)
    setApiErrorMessage(null)

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(selectedDiet !== "all" && { diet: selectedDiet }),
        ...(selectedCategory !== "all" && { type: selectedCategory }),
      })

      console.log("[v0] Fetching with params:", params.toString())
      const response = await fetch(`/api/recipes/search?${params}`)

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error response:", errorData)
        throw new Error(errorData.error || "Failed to search recipes")
      }

      const data = await response.json()
      console.log("[v0] Received recipes:", data.recipes?.length || 0)
      setApiRecipes(data.recipes || [])
      setShowingSuggestions(data.isSuggestion && data.recipes?.length > 0)

      if (data.recipes?.length > 0) {
        if (data.isSuggestion) {
          toast({
            title: "No exact matches found",
            description: `Showing ${data.recipes.length} similar recipes you might like`,
          })
        } else {
          toast({
            title: "Search complete",
            description: `Found ${data.recipes.length} recipes`,
          })
        }
      } else {
        toast({
          title: "No recipes found",
          description: "Try a different search term or browse your saved recipes",
        })
      }
    } catch (error) {
      console.error("[v0] API search error:", error)
      const errorMessage = error instanceof Error ? error.message : "Could not search recipes"

      if (errorMessage.includes("quota") || errorMessage.includes("OpenAI")) {
        setApiErrorMessage(
          "OpenAI API quota exceeded. Using free recipe database (limited results). Add credits at platform.openai.com to unlock AI-powered recipe search.",
        )
        toast({
          title: "Using free recipe database",
          description: "OpenAI quota exceeded. Results may be limited.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Search failed",
          description: errorMessage,
          variant: "destructive",
        })
      }

      setApiRecipes([])
      setShowingSuggestions(false)
    } finally {
      setIsSearchingAPI(false)
    }
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    const recentlyEaten = wasRecentlyEaten(recipe.id, allMealPlans, 3)

    if (recentlyEaten.eaten) {
      setConfirmRecipe({ recipe, recentInfo: recentlyEaten })
      return
    }

    if (onAddRecipeToLibrary) {
      onAddRecipeToLibrary(recipe)
    }

    onSelectRecipe(recipe)
    onClose()
    setSearchQuery("")
    setPreviewRecipe(null)
    setShowSuggestions(false)
    setShowAPIResults(false)
    setApiRecipes([])
  }

  const handleConfirmSelection = () => {
    if (confirmRecipe) {
      if (onAddRecipeToLibrary) {
        onAddRecipeToLibrary(confirmRecipe.recipe)
      }

      onSelectRecipe(confirmRecipe.recipe)
      onClose()
      setSearchQuery("")
      setPreviewRecipe(null)
      setShowSuggestions(false)
      setShowAPIResults(false)
      setApiRecipes([])
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
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
      case "lunch":
        return "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800"
      case "dinner":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
      case "snack":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[85vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 pt-4 pb-2 flex-shrink-0">
            <DialogTitle className="text-lg">{currentMeal ? `Select ${currentMeal}` : "Select Recipe"}</DialogTitle>
          </DialogHeader>

          <div className="px-6 space-y-3 flex-shrink-0">
            {apiErrorMessage && (
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{apiErrorMessage}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  placeholder="Search recipes or discover new dishes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (!e.target.value.trim()) {
                      setShowAPIResults(false)
                      setApiRecipes([])
                      setShowingSuggestions(false)
                      setApiErrorMessage(null)
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAPISearch()
                    }
                  }}
                  className="pl-9"
                  aria-label="Search recipes"
                />
                {isSearchingAPI && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                )}
              </div>
              <Button
                onClick={handleAPISearch}
                disabled={isSearchingAPI || !searchQuery.trim()}
                variant="outline"
                className="shrink-0 bg-transparent"
              >
                {isSearchingAPI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Search Online</span>
              </Button>
            </div>

            {showAPIResults && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {showingSuggestions
                    ? `Showing ${apiRecipes.length} similar recipes`
                    : `Showing ${apiRecipes.length} online results`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAPIResults(false)
                    setApiRecipes([])
                    setSearchQuery("")
                    setShowingSuggestions(false)
                    setApiErrorMessage(null)
                  }}
                >
                  Back to My Recipes
                </Button>
              </div>
            )}

            {!showAPIResults && (
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
            )}

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
                            <p className="text-xs font-medium mb-2">Nutrition (per serving)</p>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="flex flex-col items-center gap-1 p-2 bg-background rounded">
                                <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
                                <span className="text-xs font-medium">{recipe.nutrition.calories}</span>
                                <span className="text-xs text-muted-foreground">cal</span>
                              </div>
                              <div className="flex flex-col items-center gap-1 p-2 bg-background rounded">
                                <Beef className="h-4 w-4 text-red-500" aria-hidden="true" />
                                <span className="text-xs font-medium">{recipe.nutrition.protein}g</span>
                                <span className="text-xs text-muted-foreground">protein</span>
                              </div>
                              <div className="flex flex-col items-center gap-1 p-2 bg-background rounded">
                                <Wheat className="h-4 w-4 text-amber-500" aria-hidden="true" />
                                <span className="text-xs font-medium">{recipe.nutrition.carbs}g</span>
                                <span className="text-xs text-muted-foreground">carbs</span>
                              </div>
                              <div className="flex flex-col items-center gap-1 p-2 bg-background rounded">
                                <Droplet className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                                <span className="text-xs font-medium">{recipe.nutrition.fat}g</span>
                                <span className="text-xs text-muted-foreground">fat</span>
                              </div>
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
              {isSearchingAPI && (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground mt-4">Searching for delicious recipes...</p>
                </div>
              )}
              {filteredRecipes.length === 0 && !isSearchingAPI && (
                <div className="text-center py-12 space-y-3">
                  <p className="text-muted-foreground text-sm">
                    {showAPIResults
                      ? showingSuggestions
                        ? "No similar recipes found. Try a different search term."
                        : "No recipes found. Try a different search term."
                      : "No recipes found. Try searching online for new dishes!"}
                  </p>
                  {showAPIResults && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAPIResults(false)
                        setApiRecipes([])
                        setSearchQuery("")
                        setShowingSuggestions(false)
                        setApiErrorMessage(null)
                      }}
                    >
                      Browse My Recipes
                    </Button>
                  )}
                </div>
              )}
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
