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
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        {/* App Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse" />
          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center shadow-2xl shadow-primary/30 animate-scale-in">
            <Leaf className="w-16 h-16 text-primary-foreground" strokeWidth={1.5} />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-2xl text-foreground tracking-tight animate-slide-up-delayed">MealPlanner</h1>
      </div>
    </div>
  )
}
