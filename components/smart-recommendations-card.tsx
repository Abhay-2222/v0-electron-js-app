"use client"

import { useMemo, useState } from "react"
import type { Recipe, PantryItem, WeeklyMealPlans } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ChefHat, Clock, Users } from "lucide-react"
import Image from "next/image"
import { getRecipeRecommendationsFromPantry } from "@/lib/smart-recommendations"
import { MealSlotSelectorDialog } from "@/components/meal-slot-selector-dialog"
import { useMealPlan } from "@/lib/contexts/meal-plan-context"
import { useToast } from "@/hooks/use-toast"

interface SmartRecommendationsCardProps {
  recipes: Recipe[]
  pantryItems: PantryItem[]
  allMealPlans: WeeklyMealPlans
  onSelectRecipe: (recipe: Recipe) => void
  compact?: boolean
}

export function SmartRecommendationsCard({
  recipes,
  pantryItems,
  allMealPlans,
  onSelectRecipe,
  compact = false,
}: SmartRecommendationsCardProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [missingIngredients, setMissingIngredients] = useState<Array<{ name: string; amount: number; unit: string }>>(
    [],
  )
  const { addMeal } = useMealPlan()
  const { toast } = useToast()

  const recommendations = useMemo(
    () => getRecipeRecommendationsFromPantry(recipes, pantryItems, allMealPlans, compact ? 3 : 5),
    [recipes, pantryItems, allMealPlans, compact],
  )

  const calculateMissingIngredients = (recipe: Recipe) => {
    const missing: Array<{ name: string; amount: number; unit: string }> = []

    recipe.ingredients.forEach((ingredient) => {
      const pantryItem = pantryItems.find((item) => item.name.toLowerCase() === ingredient.name.toLowerCase())

      if (!pantryItem) {
        missing.push({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })
      } else if (pantryItem.amount < ingredient.amount) {
        missing.push({
          name: ingredient.name,
          amount: ingredient.amount - pantryItem.amount,
          unit: ingredient.unit,
        })
      }
    })

    return missing
  }

  const handleAddClick = (recipe: Recipe) => {
    const missing = calculateMissingIngredients(recipe)
    setSelectedRecipe(recipe)
    setMissingIngredients(missing)
    setDialogOpen(true)
  }

  const handleSelectSlot = (day: string, mealType: string) => {
    if (!selectedRecipe) return

    addMeal(day, mealType, selectedRecipe)

    toast({
      title: "Meal Added!",
      description: `${selectedRecipe.name} added to ${day} ${mealType}${missingIngredients.length > 0 ? `. ${missingIngredients.length} ingredients added to grocery list.` : ""}`,
    })

    setSelectedRecipe(null)
    setMissingIngredients([])
  }

  if (recommendations.length === 0 || pantryItems.length === 0) {
    return null
  }

  if (compact) {
    return (
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm">Smart Recommendations</h3>
              <p className="text-xs text-muted-foreground truncate">
                {recommendations.length} recipes you can make with your pantry
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {recommendations.length}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="shadow-md border-0 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg">Smart Recommendations</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Recipes you can make with your pantry items</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {recommendations.map((rec) => (
              <div
                key={rec.recipe.id}
                className="flex gap-3 p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all group"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={rec.recipe.image || "/placeholder.svg?height=56&width=56"}
                    alt={rec.recipe.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm leading-snug line-clamp-1 flex-1">{rec.recipe.name}</h4>
                    <Badge
                      variant={rec.matchScore === 100 ? "default" : "secondary"}
                      className="text-xs shrink-0 rounded-full h-5 px-2 ml-2"
                    >
                      {Math.round(rec.matchScore)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{rec.reason}</p>
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{rec.recipe.prepTime + rec.recipe.cookTime}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{rec.recipe.servings}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddClick(rec.recipe)}
                      className="shrink-0 h-7 px-3 rounded-lg text-xs"
                    >
                      <ChefHat className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedRecipe && (
        <MealSlotSelectorDialog
          recipe={selectedRecipe}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSelectSlot={handleSelectSlot}
          missingIngredients={missingIngredients}
        />
      )}
    </>
  )
}

export default SmartRecommendationsCard
