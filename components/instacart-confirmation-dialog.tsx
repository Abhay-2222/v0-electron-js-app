"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Store } from "@/components/icons"
import { ExternalLink } from "lucide-react"

interface InstacartConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemCount: number
}

export function InstacartConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  itemCount,
}: InstacartConfirmationDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem("instacart_skip_confirmation", "true")
    }
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-[#0AAD0A]" />
            Open Instacart
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2 text-sm text-muted-foreground">
          <p>
            We'll open Instacart with your {itemCount} grocery {itemCount === 1 ? "item" : "items"}.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
            <p className="font-medium text-foreground">What happens next:</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-[#0AAD0A] mt-0.5">✓</span>
                <span>If you're logged in to Instacart, you'll see your items ready to order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0AAD0A] mt-0.5">✓</span>
                <span>If not, you'll be asked to sign in to your Instacart account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0AAD0A] mt-0.5">✓</span>
                <span>Select your store, review items, and checkout</span>
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-col gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <label
              htmlFor="dont-show"
              className="text-sm text-muted-foreground cursor-pointer select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't show this again
            </label>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1 bg-[#0AAD0A] hover:bg-[#099209]">
              Open Instacart
              <ExternalLink className="h-3.5 w-3.5 ml-2" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
