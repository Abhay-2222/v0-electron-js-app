"use client"

import { useMemo } from "react"
import type { MealPlan, Ingredient, PantryItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Download, Share2, MessageCircle, Mail } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { calculateIngredientCost } from "@/lib/ingredient-prices"

interface GroceryListProps {
  mealPlan: MealPlan
  pantryItems?: PantryItem[]
}

interface ConsolidatedIngredient extends Ingredient {
  checked: boolean
  estimatedCost: number
}

export function GroceryList({ mealPlan, pantryItems = [] }: GroceryListProps) {
  const [checkedItems, setCheckedItems] = useLocalStorage<Set<string>>("grocery-checked-items", new Set())

  const groceryList = useMemo(() => {
    const ingredientMap = new Map<string, ConsolidatedIngredient>()

    Object.values(mealPlan).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`

          const pantryItem = pantryItems.find(
            (p) => p.name.toLowerCase() === ingredient.name.toLowerCase() && p.unit === ingredient.unit,
          )

          const neededAmount = pantryItem ? Math.max(0, ingredient.amount - pantryItem.amount) : ingredient.amount

          if (neededAmount > 0) {
            if (ingredientMap.has(key)) {
              const existing = ingredientMap.get(key)!
              existing.amount += neededAmount
              existing.estimatedCost = calculateIngredientCost(existing.name, existing.amount, existing.unit)
            } else {
              ingredientMap.set(key, {
                ...ingredient,
                amount: neededAmount,
                checked: checkedItems.has(ingredient.id),
                estimatedCost: calculateIngredientCost(ingredient.name, neededAmount, ingredient.unit),
              })
            }
          }
        })
      })
    })

    const grouped: Record<string, ConsolidatedIngredient[]> = {}
    ingredientMap.forEach((ingredient) => {
      if (!grouped[ingredient.category]) {
        grouped[ingredient.category] = []
      }
      grouped[ingredient.category].push(ingredient)
    })

    const categoryOrder = ["produce", "meat", "dairy", "pantry", "frozen", "other"]
    return categoryOrder
      .filter((cat) => grouped[cat])
      .map((cat) => ({
        category: cat,
        items: grouped[cat].sort((a, b) => a.name.localeCompare(b.name)),
      }))
  }, [mealPlan, checkedItems, pantryItems])

  const handleToggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const generateGroceryText = () => {
    return groceryList
      .map((group) => {
        const items = group.items
          .map((item) => `  ${item.checked ? "✓" : "○"} ${item.amount} ${item.unit} ${item.name}`)
          .join("\n")
        return `${group.category.toUpperCase()}\n${items}`
      })
      .join("\n\n")
  }

  const handleExport = () => {
    const text = generateGroceryText()
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "grocery-list.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = (method: "whatsapp" | "sms" | "email") => {
    const text = generateGroceryText()
    const encodedText = encodeURIComponent(text)

    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodedText}`, "_blank")
        break
      case "sms":
        window.open(`sms:?body=${encodedText}`, "_blank")
        break
      case "email":
        window.open(`mailto:?subject=Grocery List&body=${encodedText}`, "_blank")
        break
    }
  }

  const totalItems = groceryList.reduce((sum, group) => sum + group.items.length, 0)
  const checkedCount = checkedItems.size
  const completionPercentage = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0
  const totalEstimatedCost = groceryList.reduce(
    (sum, group) => sum + group.items.reduce((groupSum, item) => groupSum + item.estimatedCost, 0),
    0,
  )

  if (totalItems === 0) {
    return (
      <div className="py-16 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-[var(--cream-400)]" aria-hidden="true" />
        <p className="text-[13px] text-[var(--stone-600)] px-4">Add recipes to your meal plan to generate a grocery list</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[22px] italic text-foreground">Grocery List</h2>
          <div className="flex gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-[var(--stone-600)] hover:bg-[var(--cream-100)]"
                  aria-label="Share grocery list"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                  <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("sms")}>
                  <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  SMS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("email")}>
                  <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                  Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="h-8 px-2.5 text-[var(--stone-600)] hover:bg-[var(--cream-100)]"
              aria-label="Export grocery list"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Summary bar */}
        <div className="bg-card border border-[var(--cream-300)] rounded-xl p-4 shadow-warm-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[var(--stone-700)]">Estimated total</span>
            <span className="font-mono text-[13px] text-foreground">${totalEstimatedCost.toFixed(2)}</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--cream-200)] rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full bg-[var(--sage)] transition-all"
              style={{ width: `${completionPercentage}%` }}
              role="progressbar"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${Math.round(completionPercentage)}% complete`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[var(--stone-600)]">
            <span>{checkedCount} of {totalItems} items</span>
            <span className="font-mono">{Math.round(completionPercentage)}%</span>
          </div>
        </div>
      </div>

      {/* Grocery items */}
      <div className="space-y-5" role="region" aria-label="Grocery items by category">
        {groceryList.map((group) => (
          <div key={group.category}>
            <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--stone-500)] mb-2 pb-2 border-b border-[var(--cream-200)]">
              {group.category}
            </p>
            <div className="space-y-1" role="group" aria-label={`${group.category} items`}>
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 bg-card border border-[var(--cream-300)] rounded-xl transition-all ${
                    checkedItems.has(item.id) ? "opacity-45" : ""
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex-shrink-0 border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                      checkedItems.has(item.id)
                        ? "bg-[var(--sage)] border-[var(--sage)] text-white"
                        : "border-[var(--cream-400)]"
                    }`}
                    onClick={() => handleToggleItem(item.id)}
                    role="checkbox"
                    aria-checked={checkedItems.has(item.id)}
                    aria-label={`${checkedItems.has(item.id) ? "Uncheck" : "Check"} ${item.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleToggleItem(item.id) }}
                  >
                    {checkedItems.has(item.id) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[13px] ${checkedItems.has(item.id) ? "line-through text-[var(--stone-500)]" : "text-foreground"}`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[var(--stone-500)] ml-1.5">
                      {group.category}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--stone-600)] flex-shrink-0">
                    {item.amount} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
