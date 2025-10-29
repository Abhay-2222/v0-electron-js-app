"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, ChefHat, Clock, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Recipe } from "@/lib/types"

interface GeneratedRecipe {
  title: string
  description: string
  servings: number
  cooking_time: number
  difficulty: string
  cuisine: string
  ingredients: Array<{
    name: string
    amount: number
    unit: string
  }>
  instructions: string[]
  tags: string[]
  nutrition: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
}

interface AIRecipeGeneratorProps {
  onRecipeGenerated?: (recipe: Recipe) => void
  initialPrompt?: string
  mealType?: string
}

export function AIRecipeGenerator({ onRecipeGenerated, initialPrompt = "", mealType }: AIRecipeGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a recipe request",
        description: "Describe what kind of recipe you'd like to create",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const enhancedPrompt = mealType ? `${mealType} recipe: ${prompt}` : prompt

      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate recipe")
      }

      const data = await response.json()
      setGeneratedRecipe(data.recipe)

      toast({
        title: "Recipe generated!",
        description: `Created "${data.recipe.title}" with AI`,
      })

      if (onRecipeGenerated) {
        const recipe: Recipe = {
          id: `ai-${Date.now()}`,
          name: data.recipe.title,
          category: (mealType as any) || "dinner",
          diet: "classic",
          prepTime: Math.floor(data.recipe.cooking_time * 0.3),
          cookTime: Math.floor(data.recipe.cooking_time * 0.7),
          servings: data.recipe.servings,
          ingredients: data.recipe.ingredients.map((ing: any, idx: number) => ({
            id: `ai-ing-${Date.now()}-${idx}`,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            category: "other" as const,
          })),
          instructions: data.recipe.instructions,
          image: "/handwritten-recipe.png",
          nutrition: {
            calories: data.recipe.nutrition.calories,
            protein: Number.parseFloat(data.recipe.nutrition.protein) || 0,
            carbs: Number.parseFloat(data.recipe.nutrition.carbs) || 0,
            fat: Number.parseFloat(data.recipe.nutrition.fat) || 0,
          },
        }
        onRecipeGenerated(recipe)
      }
    } catch (error) {
      console.error("[v0] Recipe generation error:", error)
      toast({
        title: "Failed to generate recipe",
        description: error instanceof Error ? error.message : "Please try again or rephrase your request",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateInstacartRecipe = async () => {
    if (!generatedRecipe) return

    try {
      const response = await fetch("/api/instacart/create-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedRecipe.title,
          servings: generatedRecipe.servings,
          cooking_time: generatedRecipe.cooking_time,
          instructions: generatedRecipe.instructions,
          ingredients: generatedRecipe.ingredients,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create Instacart recipe")
      }

      const data = await response.json()
      window.open(data.url, "_blank")

      toast({
        title: "Recipe created on Instacart!",
        description: "Opening in a new tab...",
      })
    } catch (error) {
      console.error("[v0] Instacart recipe creation error:", error)
      toast({
        title: "Failed to create Instacart recipe",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">AI Recipe Generator</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipe-prompt">What would you like to cook?</Label>
            <Textarea
              id="recipe-prompt"
              placeholder="E.g., 'A healthy vegetarian pasta dish with lots of vegetables' or 'Quick 20-minute chicken dinner for 4 people'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Recipe with AI
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedRecipe && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xl">{generatedRecipe.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{generatedRecipe.description}</p>
              </div>
              <Badge variant="secondary">{generatedRecipe.difficulty}</Badge>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {generatedRecipe.cooking_time} min
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {generatedRecipe.servings} servings
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                {generatedRecipe.cuisine}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {generatedRecipe.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Ingredients</h4>
              <ul className="space-y-1 text-sm">
                {generatedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.amount} {ing.unit} {ing.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Instructions</h4>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                {generatedRecipe.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Nutrition (per serving)</h4>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Calories</div>
                  <div className="font-medium">{generatedRecipe.nutrition.calories}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Protein</div>
                  <div className="font-medium">{generatedRecipe.nutrition.protein}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Carbs</div>
                  <div className="font-medium">{generatedRecipe.nutrition.carbs}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fat</div>
                  <div className="font-medium">{generatedRecipe.nutrition.fat}</div>
                </div>
              </div>
            </div>

            <Button onClick={handleCreateInstacartRecipe} className="w-full" variant="default">
              <ChefHat className="mr-2 h-4 w-4" />
              Order Ingredients on Instacart
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

// Default export for compatibility
export default AIRecipeGenerator
