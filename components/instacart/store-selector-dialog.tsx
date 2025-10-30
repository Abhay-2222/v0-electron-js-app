"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Store, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { InstacartStore } from "@/lib/types"
import { detectUserCountry } from "@/lib/location-utils"

interface StoreSelectorDialogProps {
  open: boolean
  onClose: () => void
  onSelectStore: (store: InstacartStore) => void
}

export function StoreSelectorDialog({ open, onClose, onSelectStore }: StoreSelectorDialogProps) {
  const [country, setCountry] = useState<"US" | "CA">("US")
  const [zipCode, setZipCode] = useState("")
  const [stores, setStores] = useState<InstacartStore[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStore, setSelectedStore] = useState<InstacartStore | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    detectUserCountry().then((detectedCountry) => {
      setCountry(detectedCountry)
      console.log("[v0] Auto-detected country:", detectedCountry)
    })
  }, [])

  const handleCountryChange = (value: "US" | "CA") => {
    setCountry(value)
    localStorage.setItem("instacart_country", value)
    setStores([]) // Clear stores when country changes
    setSelectedStore(null)
  }

  const handleSearch = async () => {
    const isValidZip = country === "US" ? zipCode.length === 5 : zipCode.length >= 6
    if (!zipCode || !isValidZip) {
      toast({
        title: "Invalid postal code",
        description: country === "US" ? "Please enter a valid 5-digit ZIP code" : "Please enter a valid postal code",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Fetching Instacart stores for:", { zipCode, country })

      const response = await fetch(`/api/instacart/stores?postal_code=${zipCode}&country_code=${country}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] Failed to fetch stores:", errorData)
        throw new Error("Failed to fetch stores")
      }

      const data = await response.json()
      console.log("[v0] Received stores:", data.retailers?.length || 0)

      const storeList = data.retailers || []
      setStores(storeList)

      if (storeList.length === 0) {
        toast({
          title: "No stores found",
          description: "No Instacart stores available in your area",
        })
      }
    } catch (error) {
      console.error("[v0] Store fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch stores. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (selectedStore) {
      onSelectStore(selectedStore)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Instacart Store</DialogTitle>
          <DialogDescription>Choose your preferred store for delivery</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger id="country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">{country === "US" ? "ZIP Code" : "Postal Code"}</Label>
            <div className="flex gap-2">
              <Input
                id="zipCode"
                placeholder={country === "US" ? "Enter ZIP code" : "Enter postal code"}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.toUpperCase())}
                maxLength={country === "US" ? 5 : 7}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {stores.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedStore?.id === store.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Store className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{store.name}</h4>
                      <p className="text-sm text-muted-foreground">{store.address}</p>
                      {store.distance && (
                        <p className="text-xs text-muted-foreground mt-1">{store.distance.toFixed(1)} miles away</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedStore}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
