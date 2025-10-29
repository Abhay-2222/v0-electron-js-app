"use client"

import { useState } from "react"
import type { PantryItem, DynamicIngredient, Recipe, WeeklyMealPlans } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Trash2, AlertCircle, Search, Check, ChevronsUpDown } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ingredientPrices } from "@/lib/ingredient-prices"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SmartRecommendationsCard } from "@/components/smart-recommendations-card"

interface PantryInventoryProps {
  onPantryChange?: (items: PantryItem[]) => void
  availableIngredients?: DynamicIngredient[]
  recipes?: Recipe[]
  allMealPlans?: WeeklyMealPlans
  onSelectRecipe?: (recipe: Recipe) => void
}

export function PantryInventory({
  onPantryChange,
  availableIngredients,
  recipes,
  allMealPlans,
  onSelectRecipe,
}: PantryInventoryProps) {
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>("pantry-inventory", [])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [ingredientOpen, setIngredientOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    amount: "",
    unit: "",
    category: "pantry" as const,
    expirationDate: "",
    lowStockThreshold: "",
  })

  const ingredientsList =
    availableIngredients ||
    Object.keys(ingredientPrices).map((key) => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      unit: ingredientPrices[key].unit,
      pricePerUnit: ingredientPrices[key].pricePerUnit,
    }))

  const handleIngredientSelect = (ingredientKey: string) => {
    const ingredient = ingredientsList.find((i) => i.value === ingredientKey)
    if (ingredient) {
      setNewItem({
        ...newItem,
        name: ingredient.label,
        unit: ingredient.unit,
      })
    }
    setIngredientOpen(false)
  }

  const handleAddItem = () => {
    const trimmedName = newItem.name.trim()
    const trimmedUnit = newItem.unit.trim()
    const parsedAmount = Number.parseFloat(newItem.amount)

    if (!trimmedName || !trimmedUnit || !parsedAmount || Number.isNaN(parsedAmount)) {
      alert("Please fill in all required fields: Item Name, Amount, and Unit")
      return
    }

    const item: PantryItem = {
      id: `pantry-${Date.now()}`,
      name: trimmedName,
      amount: parsedAmount,
      unit: trimmedUnit,
      category: newItem.category,
      expirationDate: newItem.expirationDate || undefined,
      lowStockThreshold: newItem.lowStockThreshold ? Number.parseFloat(newItem.lowStockThreshold) : undefined,
      addedDate: new Date().toISOString(),
    }

    const updatedItems = [...pantryItems, item]
    setPantryItems(updatedItems)
    onPantryChange?.(updatedItems)

    setNewItem({
      name: "",
      amount: "",
      unit: "",
      category: "pantry",
      expirationDate: "",
      lowStockThreshold: "",
    })
    setDialogOpen(false)
  }

  const handleRemoveItem = (id: string) => {
    const updatedItems = pantryItems.filter((item) => item.id !== id)
    setPantryItems(updatedItems)
    onPantryChange?.(updatedItems)
  }

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false
    const daysUntilExpiry = Math.ceil(
      (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
  }

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false
    return new Date(expirationDate) < new Date()
  }

  const isLowStock = (item: PantryItem) => {
    if (!item.lowStockThreshold) return false
    return item.amount <= item.lowStockThreshold
  }

  const filteredItems = pantryItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, PantryItem[]>,
  )

  return (
    <Card className="shadow-md border-0 bg-gradient-to-br from-background to-muted/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl">Pantry</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl shadow-sm" aria-label="Add pantry item">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Pantry Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Popover open={ingredientOpen} onOpenChange={setIngredientOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={ingredientOpen}
                        className="w-full justify-between font-normal bg-transparent"
                      >
                        {newItem.name || "Search ingredients..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search ingredients..." />
                        <CommandList>
                          <CommandEmpty>No ingredient found.</CommandEmpty>
                          <CommandGroup>
                            {ingredientsList.map((ingredient) => (
                              <CommandItem
                                key={ingredient.value}
                                value={ingredient.value}
                                onSelect={handleIngredientSelect}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newItem.name.toLowerCase() === ingredient.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {ingredient.label}
                                <span className="ml-auto text-xs text-muted-foreground">({ingredient.unit})</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">or</span>
                    <Input
                      placeholder="Enter custom ingredient name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-amount">Amount *</Label>
                    <Input
                      id="item-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.amount}
                      onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                      placeholder="2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-unit">Unit *</Label>
                    <Input
                      id="item-unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="lbs"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value: any) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger id="item-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="meat">Meat</SelectItem>
                      <SelectItem value="pantry">Pantry</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiration-date">Expiration Date (Optional)</Label>
                  <Input
                    id="expiration-date"
                    type="date"
                    value={newItem.expirationDate}
                    onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="low-stock">Low Stock Alert (Optional)</Label>
                  <Input
                    id="low-stock"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.lowStockThreshold}
                    onChange={(e) => setNewItem({ ...newItem, lowStockThreshold: e.target.value })}
                    placeholder="Alert when below this amount"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddItem}>
                  Add to Pantry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {pantryItems.length > 0 && (
          <div className="relative mt-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Search pantry items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search pantry items"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {pantryItems.length > 0 && recipes && allMealPlans && onSelectRecipe && (
          <div className="mb-4">
            <SmartRecommendationsCard
              recipes={recipes}
              pantryItems={pantryItems}
              allMealPlans={allMealPlans}
              onSelectRecipe={onSelectRecipe}
              compact={false}
            />
          </div>
        )}

        {pantryItems.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p className="text-sm">No items in pantry. Add items to track your inventory.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p className="text-sm">No items match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <Badge variant="secondary" className="mb-2 capitalize text-xs">
                  {category}
                </Badge>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg shadow-sm bg-gradient-to-br from-background to-muted/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.name}</span>
                          {isExpired(item.expirationDate) && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                          {!isExpired(item.expirationDate) && isExpiringSoon(item.expirationDate) && (
                            <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                              <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                              Expiring Soon
                            </Badge>
                          )}
                          {isLowStock(item) && (
                            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.amount} {item.unit}
                          {item.expirationDate && ` • Expires ${new Date(item.expirationDate).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from pantry`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
