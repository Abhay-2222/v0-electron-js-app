"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

function USFlag() {
  return (
    <svg viewBox="0 0 30 20" className="w-7 h-5 rounded-sm border border-gray-200">
      {/* Red stripes */}
      <rect width="30" height="20" fill="#B22234" />
      {/* White stripes */}
      <rect y="2" width="30" height="2" fill="#fff" />
      <rect y="6" width="30" height="2" fill="#fff" />
      <rect y="10" width="30" height="2" fill="#fff" />
      <rect y="14" width="30" height="2" fill="#fff" />
      <rect y="18" width="30" height="2" fill="#fff" />
      {/* Blue canton */}
      <rect width="12" height="10" fill="#3C3B6E" />
      {/* Larger white stars in simplified pattern */}
      <g fill="#fff">
        <circle cx="2" cy="2" r="0.8" />
        <circle cx="5" cy="2" r="0.8" />
        <circle cx="8" cy="2" r="0.8" />
        <circle cx="11" cy="2" r="0.8" />
        <circle cx="3.5" cy="4" r="0.8" />
        <circle cx="6.5" cy="4" r="0.8" />
        <circle cx="9.5" cy="4" r="0.8" />
        <circle cx="2" cy="6" r="0.8" />
        <circle cx="5" cy="6" r="0.8" />
        <circle cx="8" cy="6" r="0.8" />
        <circle cx="11" cy="6" r="0.8" />
        <circle cx="3.5" cy="8" r="0.8" />
        <circle cx="6.5" cy="8" r="0.8" />
        <circle cx="9.5" cy="8" r="0.8" />
      </g>
    </svg>
  )
}

function CanadaFlag() {
  return (
    <svg viewBox="0 0 30 20" className="w-7 h-5 rounded-sm border border-gray-200">
      <rect width="30" height="20" fill="#fff" />
      <rect width="7" height="20" fill="#FF0000" />
      <rect x="23" width="7" height="20" fill="#FF0000" />
      {/* Simplified larger maple leaf */}
      <path
        d="M15,5 L14.5,8 L12,7.5 L13.5,9.5 L11,10.5 L13.5,10.5 L13,13 L15,11.5 L17,13 L16.5,10.5 L19,10.5 L16.5,9.5 L18,7.5 L15.5,8 Z"
        fill="#FF0000"
        stroke="#FF0000"
        strokeWidth="0.5"
      />
    </svg>
  )
}

export function RegionSelector() {
  const [mounted, setMounted] = useState(false)
  const [region, setRegion] = useState<"US" | "CA">("US")
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const savedRegion = localStorage.getItem("instacart_country")
    if (savedRegion === "CA" || savedRegion === "US") {
      setRegion(savedRegion)
    }
  }, [])

  const handleRegionChange = (newRegion: "US" | "CA") => {
    setRegion(newRegion)
    localStorage.setItem("instacart_country", newRegion)

    window.dispatchEvent(new CustomEvent("instacart-region-changed", { detail: { region: newRegion } }))

    toast({
      title: "Region updated",
      description: `Instacart stores will now show ${newRegion === "US" ? "United States" : "Canadian"} locations.`,
    })
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Select region" className="rounded-2xl h-11 w-11" disabled>
        <USFlag />
      </Button>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Select region"
          className="rounded-2xl h-11 w-11 hover:bg-muted/60 transition-all hover-scale"
        >
          {region === "US" ? <USFlag /> : <CanadaFlag />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40" sideOffset={12}>
        <DropdownMenuItem
          onClick={() => handleRegionChange("US")}
          className={`cursor-pointer ${region === "US" ? "bg-accent" : ""}`}
        >
          <span className="mr-2">
            <USFlag />
          </span>
          United States
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRegionChange("CA")}
          className={`cursor-pointer ${region === "CA" ? "bg-accent" : ""}`}
        >
          <span className="mr-2">
            <CanadaFlag />
          </span>
          Canada
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
