"use client"

import { useState } from "react"
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

  const currentSplash = splashScreens[currentScreen]

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Title */}
        <h1 className="text-2xl text-center text-foreground mb-8 max-w-sm leading-tight">{currentSplash.title}</h1>

        {/* Illustration */}
        <div className="relative w-full max-w-[280px] aspect-square mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-muted/20 rounded-full blur-3xl scale-75" />
          <Image
            src={currentSplash.image || "/placeholder.svg"}
            alt={currentSplash.title}
            width={280}
            height={280}
            className="relative z-10 w-full h-full object-contain"
          />
        </div>

        {/* Description */}
        <p className="text-center text-muted-foreground text-sm max-w-sm leading-relaxed">
          {currentSplash.description}
        </p>
      </div>

      {/* Footer with pagination and button */}
      <div className="container mx-auto px-6 pb-8 space-y-6">
        <div className="flex items-center justify-center gap-2">
          {splashScreens.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentScreen ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to screen ${index + 1}`}
              aria-current={index === currentScreen ? "true" : "false"}
            />
          ))}
        </div>

        {/* Continue button */}
        <Button
          onClick={handleNext}
          className="w-full max-w-sm mx-auto h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
          size="lg"
        >
          {currentScreen < splashScreens.length - 1 ? "Continue" : "Get Started"}
        </Button>
      </div>
    </div>
  )
}
