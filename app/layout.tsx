import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AppProviders } from "@/lib/contexts/app-providers"

export const metadata: Metadata = {
  title: "Meal Planner - Plan Smart, Eat Well",
  description: "Advanced meal planning with pantry management, budget tracking, and analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased overflow-y-auto">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
