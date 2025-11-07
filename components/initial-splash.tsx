"use client"

import { useEffect } from "react"
import { Leaf } from "lucide-react"

interface InitialSplashProps {
  onComplete: () => void
}

export function InitialSplash({ onComplete }: InitialSplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* App Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-150 animate-pulse" />
          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/40 animate-scale-in">
            <Leaf className="w-16 h-16 text-primary-foreground" strokeWidth={1.5} />
          </div>
        </div>

        {/* App Name */}
        <div className="flex flex-col items-center gap-2 animate-slide-up-delayed">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">MealPlanner</h1>
          <p className="text-sm text-muted-foreground">Plan, Shop, Cook</p>
        </div>
      </div>
    </div>
  )
}
