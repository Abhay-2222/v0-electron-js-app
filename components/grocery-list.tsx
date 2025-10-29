"use client"

import { useMemo, useState } from "react"
import type { MealPlan, Ingredient, PantryItem, InstacartStore, DeliveryTimeSlot } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Download,
  Share2,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  Apple,
  Beef,
  Milk,
  Package,
  Snowflake,
  MoreHorizontal,
  Search,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { openMobileFriendlyURL } from "@/lib/mobile-utils"
import { useToast } from "@/hooks/use-toast"
import { Store, ExternalLink } from "@/components/icons"
import { calculateIngredientCost } from "@/lib/ingredient-utils" // Import calculateIngredientCost

interface GroceryListProps {
  mealPlan: MealPlan
  pantryItems?: PantryItem[]
}

interface ConsolidatedIngredient extends Ingredient {
  checked: boolean
  estimatedCost: number
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "produce":
      return <Apple className="h-4 w-4" />
    case "meat":
      return <Beef className="h-4 w-4" />
    case "dairy":
      return <Milk className="h-4 w-4" />
    case "pantry":
      return <Package className="h-4 w-4" />
    case "frozen":
      return <Snowflake className="h-4 w-4" />
    default:
      return <MoreHorizontal className="h-4 w-4" />
  }
}

export function GroceryList({ mealPlan, pantryItems = [] }: GroceryListProps) {
  const [checkedItems, setCheckedItems] = useLocalStorage<Set<string>>("grocery-checked-items", new Set())
  const [isOrderingInstacart, setIsOrderingInstacart] = useState(false)
  const [showStoreSelector, setShowStoreSelector] = useState(false)
  const [showDeliveryScheduler, setShowDeliveryScheduler] = useState(false)
  const [selectedStore, setSelectedStore] = useState<InstacartStore | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<DeliveryTimeSlot | null>(null)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

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

  const filteredGroceryList = useMemo(() => {
    if (!searchQuery.trim()) return groceryList

    return groceryList
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
      }))
      .filter((group) => group.items.length > 0)
  }, [groceryList, searchQuery])

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

  const handleOrderInstacart = async () => {
    const uncheckedItems = groceryList.flatMap((group) =>
      group.items
        .filter((item) => !checkedItems.has(item.id))
        .map((item) => ({
          name: item.name,
          amount: item.amount,
          unit: item.unit,
        })),
    )

    if (uncheckedItems.length === 0) {
      toast({
        title: "No items to order",
        description: "All items are already checked off!",
      })
      return
    }

    setIsOrderingInstacart(true)

    try {
      console.log("[v0] Creating Instacart shopping list with", uncheckedItems.length, "items")

      const response = await fetch("/api/instacart/create-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: uncheckedItems,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] Failed to create shopping list:", errorData)
        throw new Error(errorData.error || "Failed to create shopping list")
      }

      const data = await response.json()
      console.log("[v0] Shopping list created successfully:", data)

      if (data.url) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        toast({
          title: "Shopping List Created!",
          description: isMobile ? "Opening in Instacart app..." : "Opening Instacart in a new tab...",
        })

        // This will open the Instacart mobile app if installed (via universal links),
        // or fall back to the web version
        openMobileFriendlyURL(data.url)
      } else {
        throw new Error("No URL returned from Instacart")
      }
    } catch (error) {
      console.error("[v0] Instacart order error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create shopping list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsOrderingInstacart(false)
    }
  }

  const totalItems = groceryList.reduce((sum, group) => sum + group.items.length, 0)
  const checkedCount = checkedItems.size
  const completionPercentage = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0
  const totalEstimatedCost = groceryList.reduce(
    (sum, group) => sum + group.items.reduce((groupSum, item) => groupSum + item.estimatedCost, 0),
    0,
  )

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  if (totalItems === 0) {
    return (
      <Card className="shadow-md border-0 bg-gradient-to-br from-background to-muted/30">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">Groceries</CardTitle>
        </CardHeader>
        <CardContent className="py-16 text-center text-muted-foreground">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
          <p className="text-base px-4">Add recipes to your meal plan to generate a grocery list</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md border-0 bg-gradient-to-br from-background to-muted/30 w-full">
      <CardHeader className="pb-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl sm:text-2xl font-bold">Groceries</CardTitle>
          <div className="flex gap-1.5 sm:gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl bg-transparent text-xs sm:text-sm px-2 sm:px-3"
                  aria-label="Share grocery list"
                >
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">Share</span>
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
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="rounded-xl bg-transparent text-xs sm:text-sm px-2 sm:px-3"
              aria-label="Export grocery list as text file"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search ingredients"
          />
        </div>

        <div className="flex items-center justify-between px-1 gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">Estimated Total</span>
          <span className="text-xl sm:text-2xl font-bold text-primary">${totalEstimatedCost.toFixed(2)}</span>
        </div>
        <div className="space-y-2" role="status" aria-label="Shopping progress">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground font-medium">
              {checkedCount} of {totalItems} items
            </span>
            <span className="font-semibold">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-2.5"
            aria-label={`${Math.round(completionPercentage)}% complete`}
          />
        </div>
        <Button
          onClick={handleOrderInstacart}
          disabled={isOrderingInstacart}
          className="w-full rounded-xl bg-[#0AAD0A] hover:bg-[#099209] text-white shadow-md"
          size="lg"
        >
          {isOrderingInstacart ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Order...
            </>
          ) : (
            <>
              <Store className="h-4 w-4 mr-2" aria-hidden="true" />
              Order with Instacart
              <ExternalLink className="h-3.5 w-3.5 ml-2" aria-hidden="true" />
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6" role="region" aria-label="Grocery items by category">
        {filteredGroceryList.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p className="text-sm">No ingredients match your search.</p>
          </div>
        ) : (
          filteredGroceryList.map((group) => {
            const categoryTotal = group.items.reduce((sum, item) => sum + item.estimatedCost, 0)
            const categoryChecked = group.items.filter((item) => checkedItems.has(item.id)).length
            const isCollapsed = collapsedCategories.has(group.category)

            return (
              <Collapsible key={group.category} open={!isCollapsed} onOpenChange={() => toggleCategory(group.category)}>
                <div className="bg-muted/50 rounded-lg p-3 mb-3">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between hover:opacity-80 transition-opacity">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getCategoryIcon(group.category)}
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold capitalize">{group.category}</h3>
                          <p className="text-xs text-muted-foreground">
                            {categoryChecked} of {group.items.length} items • ${categoryTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {isCollapsed ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="space-y-4" role="group" aria-label={`${group.category} items`}>
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 sm:gap-4 py-1">
                        <Checkbox
                          id={item.id}
                          checked={checkedItems.has(item.id)}
                          onCheckedChange={() => handleToggleItem(item.id)}
                          className="h-5 w-5 rounded-full flex-none aspect-square"
                          aria-label={`${item.checked ? "Uncheck" : "Check"} ${item.amount} ${item.unit} ${item.name}`}
                        />
                        <label
                          htmlFor={item.id}
                          className={`flex-1 cursor-pointer text-sm sm:text-base leading-relaxed min-w-0 ${
                            checkedItems.has(item.id) ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs sm:text-sm">
                            {item.amount} {item.unit}
                          </span>
                        </label>
                        <span className="text-xs sm:text-sm text-muted-foreground font-semibold whitespace-nowrap shrink-0">
                          ${item.estimatedCost.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
