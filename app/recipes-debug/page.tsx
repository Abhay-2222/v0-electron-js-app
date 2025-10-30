"use client"

import { useState, useMemo } from "react"
import { sampleRecipes } from "@/lib/sample-recipes"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronUp } from "lucide-react"

export default function RecipesDebugPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set())

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return sampleRecipes
    const query = searchQuery.toLowerCase()
    return sampleRecipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query)),
    )
  }, [searchQuery])

  const toggleRecipe = (id: string) => {
    const newExpanded = new Set(expandedRecipes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRecipes(newExpanded)
  }

  const expandAll = () => {
    setExpandedRecipes(new Set(filteredRecipes.map((r) => r.id)))
  }

  const collapseAll = () => {
    setExpandedRecipes(new Set())
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Recipe Database Debug</h1>
          <p className="text-muted-foreground">
            Total recipes: {sampleRecipes.length} | Showing: {filteredRecipes.length}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>

        <div className="space-y-3">
          {filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipes.has(recipe.id)
            return (
              <Card key={recipe.id} className="p-4">
                <button
                  onClick={() => toggleRecipe(recipe.id)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{recipe.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {recipe.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {recipe.diet}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Prep: {recipe.prepTime}m</span>
                      <span>Cook: {recipe.cookTime}m</span>
                      <span>Servings: {recipe.servings}</span>
                      <span>Ingredients: {recipe.ingredients.length}</span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div>
                      <h4 className="mb-2 font-medium">Ingredients:</h4>
                      <ul className="space-y-1">
                        {recipe.ingredients.map((ing) => (
                          <li key={ing.id} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {ing.category}
                            </Badge>
                            <span>
                              {ing.name} - {ing.amount} {ing.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Instructions:</h4>
                      <ol className="list-inside list-decimal space-y-1 text-sm">
                        {recipe.instructions.map((instruction, idx) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                      </ol>
                    </div>

                    {recipe.nutrition && (
                      <div>
                        <h4 className="mb-2 font-medium">Nutrition (per serving):</h4>
                        <div className="flex gap-4 text-sm">
                          <span>Calories: {recipe.nutrition.calories}</span>
                          <span>Protein: {recipe.nutrition.protein}g</span>
                          <span>Carbs: {recipe.nutrition.carbs}g</span>
                          <span>Fat: {recipe.nutrition.fat}g</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
