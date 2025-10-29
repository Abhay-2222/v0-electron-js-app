"use client"

import { Calendar, ShoppingCart, Package, SettingsIcon } from "lucide-react"

type TabType = "planner" | "grocery" | "pantry" | "settings" | "history"

interface AppNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function AppNavigation({ activeTab, onTabChange }: AppNavigationProps) {
  const tabs = [
    { id: "planner" as const, label: "Planner", icon: Calendar },
    { id: "grocery" as const, label: "Grocery", icon: ShoppingCart },
    { id: "pantry" as const, label: "Pantry", icon: Package },
    { id: "settings" as const, label: "Settings", icon: SettingsIcon },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 glass-effect border-t border-border/50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-around py-3 gap-2 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center gap-2 py-3 px-5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
