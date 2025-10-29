"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"

interface BudgetInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBudget: number
  onSave: (budget: number) => void
}

export function BudgetInputDialog({ open, onOpenChange, currentBudget, onSave }: BudgetInputDialogProps) {
  const [budget, setBudget] = useState(currentBudget.toString())

  const handleSave = () => {
    const parsedBudget = Number.parseFloat(budget)
    if (!Number.isNaN(parsedBudget) && parsedBudget >= 0) {
      onSave(parsedBudget)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Weekly Budget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Weekly Budget Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0.00"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Set your weekly grocery budget to get spending insights and recommendations
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Budget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
