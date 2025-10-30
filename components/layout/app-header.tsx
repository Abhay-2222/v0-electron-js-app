"use client"

import { UtensilsCrossed, MoreVertical, User, Contrast, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RegionSelector } from "@/components/region-selector"

interface AppHeaderProps {
  highContrast: boolean
  onHighContrastToggle: () => void
  onSettingsClick: () => void
  onSignOut: () => void
}

export function AppHeader({ highContrast, onHighContrastToggle, onSettingsClick, onSignOut }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 glass-effect border-b border-border/50">
      <div className="container mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover-scale">
              <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RegionSelector />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-2xl h-11 w-11 hover:bg-muted/60 transition-all hover-scale"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52" sideOffset={12}>
                <DropdownMenuLabel className="text-sm font-medium">Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onHighContrastToggle}
                  className={`cursor-pointer ${highContrast ? "bg-accent" : ""}`}
                >
                  <Contrast className="mr-3 h-4 w-4" />
                  High Contrast
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
