"use client"

import { useState } from "react"
import type { Recipe } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Clock, Users, Flame, DollarSign, ShoppingCart, ChefHat, Leaf, Check, ExternalLink } from "lucide-react"
import Image from "next/image"
import { openMobileFriendlyURL } from "@/lib/mobile-utils"

interface RecipeDetailSheetProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
  onAddToMealPlan: () => void
  currentMeal?: string
}

export function RecipeDetailSheet({ recipe, isOpen, onClose, onAddToMealPlan, currentMeal }: RecipeDetailSheetProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [isOrderingIngredients, setIsOrderingIngredients] = useState(false)
  const { toast } = useToast()

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedIngredients(newChecked)
  }

  const handleOrderIngredients = async () => {
    console.log("[v0] Ordering ingredients for recipe:", recipe.name)
    setIsOrderingIngredients(true)

    try {
      // Get unchecked ingredients (ones user doesn't have)
      const missingIngredients = recipe.ingredients.filter((_, idx) => !checkedIngredients.has(idx))

      if (missingIngredients.length === 0) {
        toast({
          title: "All ingredients checked",
          description: "You've marked all ingredients as available. Uncheck items you need to order.",
        })
        setIsOrderingIngredients(false)
        return
      }

      const response = await fetch("/api/instacart/create-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recipe.name,
          ingredients: missingIngredients.map((ing) => `${ing.amount} ${ing.unit} ${ing.name}`),
          image_url: recipe.image,
          servings: recipe.servings,
          cooking_time: recipe.prepTime + recipe.cookTime,
          instructions: recipe.instructions || [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create Instacart recipe")
      }

      const data = await response.json()
      console.log("[v0] Instacart recipe created:", data)

      if (data.url) {
        toast({
          title: "Opening Instacart",
          description: `Ordering ${missingIngredients.length} ingredients for ${recipe.name}`,
        })
        openMobileFriendlyURL(data.url)
      } else {
        throw new Error("No URL returned from Instacart")
      }
    } catch (error) {
      console.error("[v0] Error ordering ingredients:", error)
      toast({
        title: "Failed to order ingredients",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsOrderingIngredients(false)
    }
  }

  const uncheckedCount = recipe.ingredients.length - checkedIngredients.size

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-4 pb-3 flex-shrink-0 border-b">
          <DialogTitle className="text-xl">{recipe.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Recipe Image */}
            <div className="relative h-64 w-full overflow-hidden rounded-xl">
              <Image
                src={recipe.image || "/placeholder.svg?height=400&width=600"}
                alt={recipe.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Recipe Metadata */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-sm px-3 py-1.5 capitalize">
                <ChefHat className="h-4 w-4 mr-1.5" />
                {recipe.category}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1.5 capitalize">
                <Leaf className="h-4 w-4 mr-1.5" />
                {recipe.diet}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              {recipe.nutrition && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Flame className="h-4 w-4" />
                  <span>{recipe.nutrition.calories} cal</span>
                </div>
              )}
              {recipe.cost && (
                <Badge variant="secondary" className="text-sm px-3 py-1.5">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {recipe.cost.toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Nutrition Info */}
            {recipe.nutrition && (
              <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-muted/50 border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recipe.nutrition.calories}</p>
                  <p className="text-xs text-muted-foreground mt-1">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{recipe.nutrition.protein}g</p>
                  <p className="text-xs text-muted-foreground mt-1">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{recipe.nutrition.carbs}g</p>
                  <p className="text-xs text-muted-foreground mt-1">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{recipe.nutrition.fat}g</p>
                  <p className="text-xs text-muted-foreground mt-1">Fat</p>
                </div>
              </div>
            )}

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Ingredients</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (checkedIngredients.size === recipe.ingredients.length) {
                      setCheckedIngredients(new Set())
                    } else {
                      setCheckedIngredients(new Set(recipe.ingredients.map((_, idx) => idx)))
                    }
                  }}
                  className="text-xs"
                >
                  {checkedIngredients.size === recipe.ingredients.length ? "Uncheck All" : "Check All"}
                </Button>
              </div>
              <div className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      id={`ingredient-${idx}`}
                      checked={checkedIngredients.has(idx)}
                      onCheckedChange={() => toggleIngredient(idx)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`ingredient-${idx}`}
                      className={`flex-1 text-sm cursor-pointer ${checkedIngredients.has(idx) ? "line-through text-muted-foreground" : ""}`}
                    >
                      <span className="font-medium">
                        {ing.amount} {ing.unit}
                      </span>{" "}
                      {ing.name}
                    </label>
                  </div>
                ))}
              </div>
              {uncheckedCount > 0 && (
                <p className="text-xs text-muted-foreground mt-3 italic">
                  {uncheckedCount} ingredient{uncheckedCount !== 1 ? "s" : ""} needed
                </p>
              )}
            </div>

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <p className="flex-1 text-sm leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t flex-shrink-0 space-y-2 bg-background">
          {uncheckedCount > 0 && (
            <Button
              onClick={handleOrderIngredients}
              disabled={isOrderingIngredients}
              variant="outline"
              className="w-full rounded-xl h-12 text-base font-semibold bg-transparent"
              size="lg"
            >
              {isOrderingIngredients ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order {uncheckedCount} Ingredient{uncheckedCount !== 1 ? "s" : ""} with Instacart
                  <ExternalLink className="h-3.5 w-3.5 ml-2" />
                </>
              )}
            </Button>
          )}
          <Button
            onClick={onAddToMealPlan}
            className="w-full rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            Add to {currentMeal || "Meal Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
