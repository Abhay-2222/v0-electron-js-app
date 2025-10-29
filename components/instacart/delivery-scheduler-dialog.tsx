"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { DeliveryTimeSlot, InstacartStore } from "@/lib/types"

interface DeliverySchedulerDialogProps {
  open: boolean
  onClose: () => void
  store: InstacartStore
  onSelectSlot: (slot: DeliveryTimeSlot) => void
}

export function DeliverySchedulerDialog({ open, onClose, store, onSelectSlot }: DeliverySchedulerDialogProps) {
  const [slots, setSlots] = useState<DeliveryTimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<DeliveryTimeSlot | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open && store) {
      fetchDeliverySlots()
    }
  }, [open, store])

  const fetchDeliverySlots = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/instacart/delivery-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: store.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch delivery slots")
      }

      const data = await response.json()
      setSlots(data.slots.filter((slot: DeliveryTimeSlot) => slot.available))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch delivery slots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (time: string) => {
    return new Date(time).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleConfirm = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Delivery Time</DialogTitle>
          <DialogDescription>Choose when you'd like your groceries delivered</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : slots.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSlot?.id === slot.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{formatDate(slot.start_time)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${slot.fee.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">delivery fee</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No delivery slots available</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedSlot}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
