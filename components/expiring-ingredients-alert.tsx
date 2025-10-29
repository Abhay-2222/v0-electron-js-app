"use client"

import { useMemo } from "react"
import type { PantryItem, Recipe, WeeklyMealPlans } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock } from "lucide-react"
import { getExpiringIngredientsAlerts } from "@/lib/smart-recommendations"

interface ExpiringIngredientsAlertProps {
  pantryItems: PantryItem[]
  recipes: Recipe[]
  allMealPlans: WeeklyMealPlans
  onSelectRecipe: (recipe: Recipe) => void
}

export function ExpiringIngredientsAlert({
  pantryItems,
  recipes,
  allMealPlans,
  onSelectRecipe,
}: ExpiringIngredientsAlertProps) {
  const alerts = useMemo(() => getExpiringIngredientsAlerts(pantryItems), [pantryItems])

  const totalAlerts = alerts.expiringSoon.length + alerts.expired.length + alerts.lowStock.length

  if (totalAlerts === 0) {
    return null
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-background border border-orange-500/20">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">Pantry Alerts</h3>
            <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
              {totalAlerts}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {alerts.expired.length > 0 && `${alerts.expired.length} expired`}
            {alerts.expired.length > 0 && alerts.expiringSoon.length > 0 && ", "}
            {alerts.expiringSoon.length > 0 && `${alerts.expiringSoon.length} expiring soon`}
            {(alerts.expired.length > 0 || alerts.expiringSoon.length > 0) && alerts.lowStock.length > 0 && ", "}
            {alerts.lowStock.length > 0 && `${alerts.lowStock.length} low stock`}
          </p>
          <details className="group">
            <summary className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1 hover:text-foreground transition-colors">
              <Clock className="h-3 w-3" />
              <span>View details</span>
            </summary>
            <div className="mt-2 space-y-2">
              {alerts.expired.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-destructive">Expired:</p>
                  <div className="flex flex-wrap gap-1">
                    {alerts.expired.map((item) => (
                      <Badge key={item.id} variant="destructive" className="text-xs">
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {alerts.expiringSoon.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-orange-600">Expiring Soon:</p>
                  <div className="flex flex-wrap gap-1">
                    {alerts.expiringSoon.map((item) => (
                      <Badge key={item.id} variant="outline" className="text-xs border-orange-500 text-orange-600">
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {alerts.lowStock.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-yellow-600">Low Stock:</p>
                  <div className="flex flex-wrap gap-1">
                    {alerts.lowStock.map((item) => (
                      <Badge key={item.id} variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
