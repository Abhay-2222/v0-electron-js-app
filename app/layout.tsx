import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

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
    <html lang="en" className={`${geistMono.variable}`}>
      <body className="font-sans antialiased overflow-y-auto">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
