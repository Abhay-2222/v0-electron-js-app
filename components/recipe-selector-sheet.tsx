"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Recipe, WeeklyMealPlans } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Clock,
  Users,
  Flame,
  Sparkles,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Globe,
  Loader2,
  Filter,
  X,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSuggestedRecipes, wasRecentlyEaten, getMealEatenCount } from "@/lib/meal-utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { RecipeDetailSheet } from "@/components/recipe-detail-sheet"
import { isMobileDevice } from "@/lib/mobile-utils"

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
  const [showFilters, setShowFilters] = useState(false)
  const [diverseRecipesLoaded, setDiverseRecipesLoaded] = useState(false)
  const { toast } = useToast()
  const [selectedRecipeForDetail, setSelectedRecipeForDetail] = useState<Recipe | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const suggestionStats = showSuggestions
    ? {
        total: suggestedRecipes.length,
        filtered: filteredRecipes.length,
        excluded: recipes.length - suggestedRecipes.length,
      }
    : null

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) + (selectedDiet !== "all" ? 1 : 0) + (showSuggestions ? 1 : 0)

  console.log("[v0] Filtered recipes count:", filteredRecipes.length)
  console.log("[v0] Base recipes count:", baseRecipes.length)
  console.log("[v0] showAPIResults:", showAPIResults)
  console.log("[v0] showingSuggestions:", showingSuggestions)
  if (suggestionStats) {
    console.log("[v0] Smart suggestions active:", suggestionStats)
  }

  useEffect(() => {
    if (isOpen && !diverseRecipesLoaded && !searchQuery.trim()) {
      loadDiverseRecipes()
    }
  }, [isOpen])

  const loadDiverseRecipes = async () => {
    console.log("[v0] Loading diverse recipes on open")
    setIsSearchingAPI(true)
    setShowAPIResults(true)
    setDiverseRecipesLoaded(true)

    try {
      const params = new URLSearchParams({ diverse: "true" })
      if (mealType) {
        params.append("mealType", mealType)
      }

      const response = await fetch(`/api/recipes/search?${params}`)

      if (!response.ok) {
        throw new Error("Failed to load diverse recipes")
      }

      const data = await response.json()
      console.log("[v0] Diverse recipes loaded:", data.recipes?.length || 0)
      setApiRecipes(data.recipes || [])
    } catch (error) {
      console.error("[v0] Failed to load diverse recipes:", error)
      // Silently fail and show user's saved recipes instead
      setShowAPIResults(false)
      setDiverseRecipesLoaded(false)
    } finally {
      setIsSearchingAPI(false)
    }
  }

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

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Only autofocus on desktop, not mobile
      if (!isMobileDevice()) {
        searchInputRef.current.focus()
      } else {
        // On mobile, explicitly blur to prevent keyboard popup
        searchInputRef.current.blur()
      }
    }
  }, [isOpen])

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

      if (data.recipes?.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try a different search term or adjust your filters",
        })
      } else if (data.isSuggestion) {
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
    } catch (error) {
      console.error("[v0] API search error:", error)
      const errorMessage = error instanceof Error ? error.message : "Could not search recipes"

      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      })

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

  const clearAllFilters = () => {
    setSelectedCategory("all")
    setSelectedDiet("all")
    setShowSuggestions(false)
    toast({
      title: "Filters cleared",
      description: "Showing all recipes",
    })
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

  const handleQuickAdd = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] Quick add clicked for recipe:", recipe.name)
    handleSelectRecipe(recipe)
  }

  const handleViewFullRecipe = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] View full recipe clicked for:", recipe.name)
    setSelectedRecipeForDetail(recipe)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[85vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <DialogTitle className="text-xl font-semibold">
              {currentMeal ? `Select ${currentMeal}` : "Select Recipe"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-3 space-y-3 flex-shrink-0 border-b bg-muted/30">
            {apiErrorMessage && (
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{apiErrorMessage}</p>
                </div>
              </div>
            )}

            {showSuggestions && suggestionStats && (
              <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary animate-pulse" />
                  <div className="flex-1">
                    <p className="font-medium text-primary">Smart Suggestions Active</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing {suggestionStats.filtered} recipes that you haven't eaten recently
                      {suggestionStats.excluded > 0 && ` (${suggestionStats.excluded} excluded)`}
                      {mealType && ` for ${mealType}`}
                      {weeklyBudget && ` within your budget`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  ref={searchInputRef}
                  placeholder="Search recipes..."
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
                  className="pl-9 h-11 rounded-xl border-2 focus:border-primary transition-colors"
                  aria-label="Search recipes"
                  inputMode="search"
                  autoFocus={false}
                />
                {isSearchingAPI && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary pointer-events-none" />
                )}
              </div>
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button size="lg" variant="outline" className="shrink-0 rounded-xl px-4 relative bg-transparent">
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[75vh] flex flex-col px-6 pb-8">
                  <SheetHeader className="flex-shrink-0 pb-6 pt-2">
                    <SheetTitle className="text-xl font-semibold">Filters & Options</SheetTitle>
                    <SheetDescription className="text-sm">Customize your recipe search</SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto -mx-6 px-6 min-h-0">
                    <div className="space-y-6 pb-6">
                      {/* Smart Suggestions */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Smart Features
                        </h3>
                        <Button
                          variant={showSuggestions ? "default" : "outline"}
                          size="lg"
                          onClick={() => {
                            const newState = !showSuggestions
                            setShowSuggestions(newState)
                            console.log("[v0] Smart suggestions toggled:", newState)
                            if (newState) {
                              toast({
                                title: "Smart Suggestions Enabled",
                                description: "Showing recipes you haven't eaten recently, sorted by cost",
                              })
                            }
                          }}
                          className="w-full rounded-xl h-12 justify-start"
                        >
                          <Sparkles className={`h-4 w-4 mr-2 ${showSuggestions ? "animate-pulse" : ""}`} />
                          {showSuggestions ? "Smart Suggestions On" : "Enable Smart Suggestions"}
                        </Button>
                      </div>

                      {/* Diet Filters */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Diet Type
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {diets.map((diet) => (
                            <Button
                              key={diet}
                              variant={selectedDiet === diet ? "default" : "outline"}
                              size="lg"
                              onClick={() => setSelectedDiet(diet)}
                              className="capitalize rounded-xl h-11 justify-start"
                            >
                              {diet}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Category Filters */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Meal Type
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <Button
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              size="lg"
                              onClick={() => setSelectedCategory(category)}
                              className="capitalize rounded-xl h-11 justify-start"
                            >
                              {category}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-6 border-t flex-shrink-0 bg-background">
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="flex-1 rounded-xl h-12 bg-transparent"
                      disabled={activeFiltersCount === 0}
                    >
                      Clear All
                    </Button>
                    <Button onClick={() => setShowFilters(false)} className="flex-1 rounded-xl h-12">
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              {!showAPIResults && searchQuery.trim().length >= 3 && (
                <Button
                  onClick={handleAPISearch}
                  disabled={isSearchingAPI}
                  size="lg"
                  className="shrink-0 rounded-xl px-4"
                >
                  {isSearchingAPI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                </Button>
              )}
            </div>

            {/* Active filters display */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Active filters:</span>
                {showSuggestions && (
                  <Badge variant="secondary" className="rounded-full">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="ml-1 hover:bg-background/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedDiet !== "all" && (
                  <Badge variant="secondary" className="rounded-full capitalize">
                    {selectedDiet}
                    <button
                      onClick={() => setSelectedDiet("all")}
                      className="ml-1 hover:bg-background/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="rounded-full capitalize">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:bg-background/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
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
                      className={`w-full flex gap-3 p-3 rounded-xl border-2 bg-card hover:bg-accent transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[88px] mx-1 relative ${
                        previewRecipe?.id === recipe.id ? "ring-2 ring-primary shadow-lg" : "shadow-sm"
                      } ${recentlyEaten.eaten ? "border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20" : ""}`}
                      aria-expanded={previewRecipe?.id === recipe.id}
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-border/20">
                        <Image
                          src={recipe.image || "/placeholder.svg?height=80&width=80"}
                          alt={recipe.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-semibold text-base text-balance line-clamp-2">{recipe.name}</p>
                          {recipe.cost && (
                            <Badge variant="secondary" className="flex-shrink-0 text-sm rounded-full">
                              <DollarSign className="h-3 w-3 mr-0.5" aria-hidden="true" />
                              {recipe.cost.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-xs px-2 py-0.5 capitalize rounded-full ${getCategoryColor(recipe.category)}`}
                          >
                            {recipe.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0.5 capitalize rounded-full">
                            {recipe.diet}
                          </Badge>
                          {recentlyEaten.eaten && (
                            <Badge variant="destructive" className="text-xs px-2 py-0.5 rounded-full">
                              <AlertCircle className="h-3 w-3 mr-0.5" aria-hidden="true" />
                              {recentlyEaten.daysAgo === 0 ? "Today" : `${recentlyEaten.daysAgo}d ago`}
                            </Badge>
                          )}
                          {eatenCount > 0 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                              <TrendingUp className="h-3 w-3 mr-0.5" aria-hidden="true" />
                              {eatenCount}x
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{recipe.prepTime + recipe.cookTime}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{recipe.servings}</span>
                          </div>
                          {recipe.nutrition && (
                            <div className="flex items-center gap-1">
                              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{recipe.nutrition.calories} cal</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {previewRecipe?.id === recipe.id && (
                      <div className="w-full max-w-full p-4 rounded-xl border-2 border-primary/20 bg-accent/50 space-y-4">
                        <div className="flex flex-col gap-2 w-full">
                          <Button
                            onClick={(e) => handleViewFullRecipe(recipe, e)}
                            variant="outline"
                            className="w-full rounded-xl h-11 text-base font-semibold"
                            size="lg"
                          >
                            View Full Recipe
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                          <Button
                            onClick={() => {
                              console.log("[v0] Add button clicked for recipe:", recipe.name)
                              handleSelectRecipe(recipe)
                            }}
                            className="w-full rounded-xl h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                            size="lg"
                          >
                            {currentMeal ? `Add to ${currentMeal}` : "Add to Plan"}
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Key Ingredients</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-primary mt-0.5">•</span>
                                  <span>
                                    {ing.amount} {ing.unit} {ing.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {recipe.ingredients.length > 4 && (
                              <p className="text-xs text-muted-foreground mt-2 italic">
                                +{recipe.ingredients.length - 4} more ingredients
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {isSearchingAPI && (
                <div className="text-center py-16">
                  <div className="relative inline-block">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary/20" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 font-medium">Searching for delicious recipes...</p>
                </div>
              )}
              {filteredRecipes.length === 0 && !isSearchingAPI && (
                <div className="text-center py-16 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-medium">
                      {showAPIResults
                        ? showingSuggestions
                          ? "No similar recipes found"
                          : "No recipes found"
                        : "No recipes match your filters"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {showAPIResults
                        ? "Try a different search term or browse your saved recipes"
                        : "Try adjusting your filters or search online for new dishes"}
                    </p>
                  </div>
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
                      className="rounded-xl"
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

      {selectedRecipeForDetail && (
        <RecipeDetailSheet
          recipe={selectedRecipeForDetail}
          isOpen={!!selectedRecipeForDetail}
          onClose={() => setSelectedRecipeForDetail(null)}
          onAddToMealPlan={() => {
            handleSelectRecipe(selectedRecipeForDetail)
            setSelectedRecipeForDetail(null)
          }}
          currentMeal={currentMeal}
        />
      )}
    </>
  )
}
