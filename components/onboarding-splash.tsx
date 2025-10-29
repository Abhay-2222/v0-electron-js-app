"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"

interface SplashScreen {
  title: string
  description: string
  image: string
}

const splashScreens: SplashScreen[] = [
  {
    title: "Plan your meals with ease",
    description: "Pick your week's meals in minutes. Organize breakfast, lunch, and dinner for the entire week.",
    image: "/splash-meal-planning.jpg",
  },
  {
    title: "Smart grocery shopping",
    description: "Get an organized shopping list automatically generated from your meal plan. Shop once per week.",
    image: "/splash-grocery-shopping.jpg",
  },
  {
    title: "Cook healthy, delicious meals",
    description: "Easily cook healthy meals in about 30 minutes. Track nutrition and manage your pantry inventory.",
    image: "/splash-healthy-cooking.jpg",
  },
]

interface OnboardingSplashProps {
  onComplete: () => void
}

export function OnboardingSplash({ onComplete }: OnboardingSplashProps) {
  const [currentScreen, setCurrentScreen] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 50

  const handleNext = () => {
    if (currentScreen < splashScreens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null
    touchStartX.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentScreen < splashScreens.length - 1) {
      handleNext()
    }
    if (isRightSwipe && currentScreen > 0) {
      handleBack()
    }
  }

  const currentSplash = splashScreens[currentScreen]

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header with Back button */}
      <div className="container mx-auto px-4 py-3">
        {currentScreen > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">Back</span>
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl text-center text-foreground mb-6 leading-tight font-normal">
          {currentSplash.title}
        </h1>

        {/* Illustration */}
        <div className="relative w-full max-w-[320px] md:max-w-[400px] aspect-square mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-muted/20 rounded-full blur-3xl scale-75" />
          <Image
            src={currentSplash.image || "/placeholder.svg"}
            alt={currentSplash.title}
            width={400}
            height={400}
            className="relative z-10 w-full h-full object-contain"
          />
        </div>

        {/* Description */}
        <p className="text-center text-muted-foreground text-base md:text-lg max-w-md leading-relaxed font-normal">
          {currentSplash.description}
        </p>
      </div>

      {/* Footer with pagination and button */}
      <div className="container mx-auto px-6 pb-8 space-y-5 max-w-2xl">
        <div className="flex items-center justify-center gap-2">
          {splashScreens.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? "bg-primary w-2.5 h-2.5"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2 h-2"
              }`}
              aria-label={`Go to screen ${index + 1}`}
              aria-current={index === currentScreen ? "true" : "false"}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-normal"
          size="lg"
        >
          {currentScreen < splashScreens.length - 1 ? "Continue" : "Get Started"}
        </Button>
      </div>
    </div>
  )
}
