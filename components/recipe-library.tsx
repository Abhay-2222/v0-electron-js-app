"use client"

import type React from "react"
import { useState } from "react"
import type { Recipe } from "@/lib/types"
import { RecipeCard } from "./recipe-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2, Globe } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface RecipeLibraryProps {
  recipes: Recipe[]
  onDragStart: (e: React.DragEvent, recipe: Recipe) => void
  onAddRecipe?: (recipe: Recipe) => void
}

export function RecipeLibrary({ recipes, onDragStart, onAddRecipe }: RecipeLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isSearchingAPI, setIsSearchingAPI] = useState(false)
  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([])
  const [showAPIResults, setShowAPIResults] = useState(false)
  const { toast } = useToast()

  const filteredLocalRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || recipe.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const filteredAPIRecipes = apiRecipes.filter((recipe) => {
    const matchesCategory = activeCategory === "all" || recipe.category === activeCategory
    return matchesCategory
  })

  const handleAPISearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter a search term",
        description: "Please type something to search for recipes",
      })
      return
    }

    setIsSearchingAPI(true)
    setShowAPIResults(true)

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(activeCategory !== "all" && { type: activeCategory }),
      })

      const response = await fetch(`/api/recipes/search?${params}`)

      if (!response.ok) {
        throw new Error("Failed to search recipes")
      }

      const data = await response.json()
      setApiRecipes(data.recipes || [])

      toast({
        title: "Search complete",
        description: `Found ${data.recipes?.length || 0} recipes from around the world`,
      })
    } catch (error) {
      console.error("API search error:", error)
      toast({
        title: "Search failed",
        description: "Could not search recipes. Please check your API key.",
        variant: "destructive",
      })
      setApiRecipes([])
    } finally {
      setIsSearchingAPI(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAPISearch()
    }
  }

  const displayRecipes = showAPIResults ? filteredAPIRecipes : filteredLocalRecipes

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes or discover new dishes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (!e.target.value.trim()) {
                setShowAPIResults(false)
                setApiRecipes([])
              }
            }}
            onKeyPress={handleKeyPress}
            className="pl-9"
          />
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
          <span className="text-muted-foreground">Showing {apiRecipes.length} online results</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowAPIResults(false)
              setApiRecipes([])
              setSearchQuery("")
            }}
          >
            Back to My Recipes
          </Button>
        </div>
      )}

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snack">Snack</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value={activeCategory} className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onDragStart={onDragStart} draggable />
            ))}
          </div>
          {displayRecipes.length === 0 && !isSearchingAPI && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {showAPIResults
                ? "No recipes found. Try a different search term."
                : "No recipes found. Try searching online for new dishes!"}
            </div>
          )}
          {isSearchingAPI && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-4">Searching for delicious recipes...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
