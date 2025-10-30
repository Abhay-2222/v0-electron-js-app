"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { instacartOAuth } from "@/lib/instacart-oauth"
import { useToast } from "@/hooks/use-toast"

export function InstacartOAuthHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const code = searchParams.get("instacart_code")
    const error = searchParams.get("instacart_error")

    if (error) {
      toast({
        title: "Instacart Connection Failed",
        description: `Failed to connect to Instacart: ${error}`,
        variant: "destructive",
      })
      // Clean up URL
      router.replace("/")
      return
    }

    if (code) {
      // Exchange code for token
      instacartOAuth
        .exchangeCodeForToken(code)
        .then(() => {
          toast({
            title: "Connected to Instacart",
            description: "Your Instacart account has been connected successfully!",
          })
          // Clean up URL
          router.replace("/")
        })
        .catch((err) => {
          console.error("[v0] Token exchange error:", err)
          toast({
            title: "Connection Failed",
            description: "Failed to complete Instacart connection. Please try again.",
            variant: "destructive",
          })
          router.replace("/")
        })
    }
  }, [searchParams, router, toast])

  return null
}
