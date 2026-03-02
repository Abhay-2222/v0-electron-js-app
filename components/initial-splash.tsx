"use client"

import { useEffect } from "react"

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
    <div className="fixed inset-0 z-50 bg-[var(--stone-900)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        {/* Wordmark — Lora serif italic, the brand identity */}
        <h1 className="font-serif text-[42px] italic text-[#f5ede2] tracking-tight animate-scale-in">
          MealPlan
        </h1>
        <p className="font-mono text-[8px] tracking-[0.16em] uppercase text-[rgba(255,255,255,0.28)] animate-slide-up-delayed">
          Plan smart, eat well
        </p>
      </div>
    </div>
  )
}
