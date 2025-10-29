"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "./use-local-storage"

type AppState = "initial-splash" | "auth" | "onboarding" | "main"

export function useAppState() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage("onboarding-completed", false)
  const [hasAuthenticated, setHasAuthenticated] = useLocalStorage("authenticated", false)
  const [isClient, setIsClient] = useState(false)
  const [appState, setAppState] = useState<AppState>("initial-splash")

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      if (!hasAuthenticated) {
        setAppState("initial-splash")
      } else if (!hasCompletedOnboarding) {
        setAppState("onboarding")
      } else {
        setAppState("main")
      }
    }
  }, [isClient, hasAuthenticated, hasCompletedOnboarding])

  const completeAuth = () => {
    setHasAuthenticated(true)
    setAppState("onboarding")
  }

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true)
    setAppState("main")
  }

  const signOut = () => {
    setHasAuthenticated(false)
    setHasCompletedOnboarding(false)
    setAppState("initial-splash")
  }

  return {
    appState,
    isClient,
    completeAuth,
    completeOnboarding,
    signOut,
  }
}
