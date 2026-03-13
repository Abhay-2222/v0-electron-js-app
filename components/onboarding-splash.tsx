"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface OnboardingSplashProps {
  onComplete: (prefs: OnboardingPrefs) => void
}

export interface OnboardingPrefs {
  householdSize: number
  weeklyBudget: number
  dietGoal: string
  hearAboutUs: string
}

const GOALS = [
  { id: "balanced", label: "Eat balanced" },
  { id: "save-money", label: "Save money" },
  { id: "lose-weight", label: "Lose weight" },
  { id: "build-muscle", label: "Build muscle" },
  { id: "save-time", label: "Save time" },
  { id: "reduce-waste", label: "Reduce waste" },
]

const HEAR_OPTIONS = [
  "App Store",
  "Instagram / Facebook",
  "TikTok",
  "Friend or family",
  "Google search",
  "Other",
]

// Step components are inline below
export function OnboardingSplash({ onComplete }: OnboardingSplashProps) {
  const [step, setStep] = useState(0)
  const [householdSize, setHouseholdSize] = useState(2)
  const [weeklyBudget, setWeeklyBudget] = useState(150)
  const [dietGoal, setDietGoal] = useState("balanced")
  const [hearAboutUs, setHearAboutUs] = useState("")

  const totalSteps = 4

  const handleFinish = () => {
    onComplete({ householdSize, weeklyBudget, dietGoal, hearAboutUs })
  }

  const canContinue = () => {
    if (step === 3) return hearAboutUs !== ""
    return true
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-[2px] bg-[var(--cream-200)]">
        <div
          className="h-full bg-[var(--sage)] transition-all duration-500"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Header nav */}
      <div className="flex items-center justify-between px-5 py-3">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 text-[var(--stone-600)] hover:text-foreground transition-colors min-h-[44px] px-1"
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-[12px]">Back</span>
          </button>
        ) : (
          <div />
        )}
        <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--stone-500)]">
          {step + 1} / {totalSteps}
        </span>
        {step < totalSteps - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="text-[12px] text-[var(--stone-500)] hover:text-foreground min-h-[44px] px-1"
          >
            Skip
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 pb-4">

        {/* ── Step 0: Goal ── */}
        {step === 0 && (
          <div className="flex flex-col gap-6 animate-slide-up">
            <div>
              <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--stone-500)] mb-2">Your goal</p>
              <h1 className="font-serif text-[26px] italic text-foreground leading-tight">
                What brings you here?
              </h1>
              <p className="text-[13px] text-[var(--stone-600)] mt-2 leading-relaxed">
                We'll tailor your meal suggestions around what matters most to you.
              </p>
            </div>
            <div className="relative w-full max-w-[240px] mx-auto aspect-square">
              <Image
                src="/splash-meal-planning.jpg"
                alt="Meal planning"
                width={240}
                height={240}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setDietGoal(g.id)}
                  className={`py-3 px-3 rounded-xl border-[1.5px] text-[13px] text-left transition-all ${
                    dietGoal === g.id
                      ? "bg-[var(--sage-l)] border-[var(--sage)] text-[var(--sage-d)]"
                      : "bg-card border-[var(--cream-300)] text-foreground hover:border-[var(--cream-400)]"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Household size ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-slide-up">
            <div>
              <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--stone-500)] mb-2">Household</p>
              <h1 className="font-serif text-[26px] italic text-foreground leading-tight">
                How many people are you cooking for?
              </h1>
              <p className="text-[13px] text-[var(--stone-600)] mt-2 leading-relaxed">
                We'll scale recipe servings and grocery quantities to match.
              </p>
            </div>
            <div className="relative w-full max-w-[240px] mx-auto aspect-square">
              <Image
                src="/splash-healthy-cooking.jpg"
                alt="Cooking for family"
                width={240}
                height={240}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="flex items-center justify-center gap-6 py-4">
              <button
                onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                className="h-12 w-12 rounded-full bg-card border-[1.5px] border-[var(--cream-300)] text-[22px] hover:border-[var(--sage)] hover:bg-[var(--sage-l)] transition-all flex items-center justify-center"
                aria-label="Decrease"
              >
                −
              </button>
              <div className="text-center">
                <span className="font-serif text-[52px] italic text-foreground leading-none">{householdSize}</span>
                <p className="font-mono text-[8px] tracking-widest uppercase text-[var(--stone-500)] mt-1">
                  {householdSize === 1 ? "person" : "people"}
                </p>
              </div>
              <button
                onClick={() => setHouseholdSize(Math.min(10, householdSize + 1))}
                className="h-12 w-12 rounded-full bg-card border-[1.5px] border-[var(--cream-300)] text-[22px] hover:border-[var(--sage)] hover:bg-[var(--sage-l)] transition-all flex items-center justify-center"
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Weekly budget ── */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-slide-up">
            <div>
              <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--stone-500)] mb-2">Budget</p>
              <h1 className="font-serif text-[26px] italic text-foreground leading-tight">
                What's your weekly grocery budget?
              </h1>
              <p className="text-[13px] text-[var(--stone-600)] mt-2 leading-relaxed">
                MealPlan tracks every dollar. You can always change this later.
              </p>
            </div>
            <div className="relative w-full max-w-[240px] mx-auto aspect-square">
              <Image
                src="/splash-grocery-shopping.jpg"
                alt="Grocery shopping"
                width={240}
                height={240}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-card border-[1.5px] border-[var(--cream-300)] rounded-xl px-4 h-14 focus-within:border-[var(--sage)] transition-colors">
                <span className="text-[22px] text-[var(--stone-500)]">$</span>
                <input
                  type="number"
                  value={weeklyBudget}
                  min={0}
                  max={9999}
                  onChange={(e) => setWeeklyBudget(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-transparent text-[22px] text-foreground outline-none"
                  aria-label="Weekly budget"
                />
                <span className="font-mono text-[9px] tracking-widest uppercase text-[var(--stone-500)]">/ week</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[75, 100, 150, 200].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setWeeklyBudget(preset)}
                    className={`py-2 rounded-lg border-[1.5px] text-[12px] transition-all ${
                      weeklyBudget === preset
                        ? "bg-[var(--sage-l)] border-[var(--sage)] text-[var(--sage-d)]"
                        : "bg-card border-[var(--cream-300)] text-[var(--stone-600)] hover:border-[var(--cream-400)]"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Attribution ── */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-slide-up">
            <div>
              <p className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--stone-500)] mb-2">Almost there</p>
              <h1 className="font-serif text-[26px] italic text-foreground leading-tight">
                How did you hear about MealPlan?
              </h1>
              <p className="text-[13px] text-[var(--stone-600)] mt-2 leading-relaxed">
                Just one last question — this helps us understand where to invest.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {HEAR_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setHearAboutUs(opt)}
                  className={`py-3.5 px-4 rounded-xl border-[1.5px] text-[13px] text-left transition-all ${
                    hearAboutUs === opt
                      ? "bg-[var(--sage-l)] border-[var(--sage)] text-[var(--sage-d)]"
                      : "bg-card border-[var(--cream-300)] text-foreground hover:border-[var(--cream-400)]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-8 pt-3 border-t border-[var(--cream-200)]">
        <Button
          onClick={step < totalSteps - 1 ? () => setStep(step + 1) : handleFinish}
          disabled={!canContinue()}
          className="w-full h-12 text-[13px] bg-[var(--sage-d)] hover:bg-[var(--sage)] text-white rounded-xl border-0 transition-all disabled:opacity-40"
        >
          {step < totalSteps - 1 ? (
            <span className="flex items-center gap-2">Continue <ChevronRight className="h-4 w-4" /></span>
          ) : (
            "Start planning"
          )}
        </Button>
      </div>
    </div>
  )
}
