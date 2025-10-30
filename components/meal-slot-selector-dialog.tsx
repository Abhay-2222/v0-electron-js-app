"use client"

import { useState } from "react"
import type { Recipe } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Flame, ShoppingCart, Sparkles } from "lucide-react"
import Image from "next/image"

interface MealSlotSelectorDialogProps {
  recipe: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectSlot: (day: string, mealType: string) => void
  missingIngredients: Array<{ name: string; amount: number; unit: string }>
}

export function MealSlotSelectorDialog({
  recipe,
  open,
  onOpenChange,
  onSelectSlot,
  missingIngredients,
}: MealSlotSelectorDialogProps) {
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedMealType, setSelectedMealType] = useState<string>("")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const suggestedMealType = recipe.category === "snack" ? "snack" : recipe.category
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"]

  const handleConfirm = () => {
    if (selectedDay && selectedMealType) {
      onSelectSlot(selectedDay, selectedMealType)
      onOpenChange(false)
      setSelectedDay("")
      setSelectedMealType("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add to Meal Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recipe Preview */}
          <div className="flex gap-3 p-3 rounded-xl bg-muted/50">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={recipe.image || "/placeholder.svg?height=64&width=64"}
                alt={recipe.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-1">{recipe.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{recipe.prepTime + recipe.cookTime}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{recipe.servings}</span>
                </div>
                {recipe.nutrition && (
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    <span>{recipe.nutrition.calories} cal</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Missing Ingredients Alert */}
          {missingIngredients.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Missing Ingredients</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                    These items will be added to your grocery list:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {missingIngredients.map((ing, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {ing.name} ({ing.amount} {ing.unit})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Day Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Select Day
            </label>
            <div className="grid grid-cols-2 gap-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Meal Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Select Meal Type
              {suggestedMealType && (
                <Badge variant="secondary" className="text-xs ml-auto">
                  Suggested: {suggestedMealType}
                </Badge>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedMealType === type ? "default" : "outline"}
                  className="justify-start capitalize"
                  onClick={() => setSelectedMealType(type)}
                >
                  {type === suggestedMealType && <Sparkles className="h-3.5 w-3.5 mr-2" />}
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDay || !selectedMealType}>
            Add to Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
