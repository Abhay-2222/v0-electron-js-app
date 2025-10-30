"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Store } from "@/components/icons"
import { LogOut } from "lucide-react"
import { instacartOAuth } from "@/lib/instacart-oauth"

interface InstacartOAuthButtonProps {
  onAuthChange?: (isAuthenticated: boolean) => void
}

export function InstacartOAuthButton({ onAuthChange }: InstacartOAuthButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const authenticated = instacartOAuth.isAuthenticated()
    setIsAuthenticated(authenticated)
    onAuthChange?.(authenticated)
  }, [onAuthChange])

  const handleLogin = () => {
    setIsLoading(true)
    const authUrl = instacartOAuth.getAuthorizationUrl()
    window.location.href = authUrl
  }

  const handleLogout = () => {
    instacartOAuth.logout()
    setIsAuthenticated(false)
    onAuthChange?.(false)
  }

  if (isAuthenticated) {
    return (
      <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
        <Store className="h-4 w-4" />
        Disconnect Instacart
        <LogOut className="h-3.5 w-3.5" />
      </Button>
    )
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading} className="gap-2 bg-[#0AAD0A] hover:bg-[#099209]">
      <Store className="h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Instacart Account"}
    </Button>
  )
}
