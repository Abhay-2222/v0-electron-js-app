import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
