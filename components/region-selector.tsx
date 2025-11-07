"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

function USFlag() {
  return (
    <svg viewBox="0 0 24 18" className="w-6 h-5 rounded-sm">
      <rect width="24" height="18" fill="#B22234" />
      <path d="M0,2h24M0,4h24M0,6h24M0,8h24M0,10h24M0,12h24M0,14h24M0,16h24" stroke="#fff" strokeWidth="2" />
      <rect width="10" height="8" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="2" cy="1.5" r="0.4" />
        <circle cx="4" cy="1.5" r="0.4" />
        <circle cx="6" cy="1.5" r="0.4" />
        <circle cx="8" cy="1.5" r="0.4" />
        <circle cx="3" cy="3" r="0.4" />
        <circle cx="5" cy="3" r="0.4" />
        <circle cx="7" cy="3" r="0.4" />
        <circle cx="2" cy="4.5" r="0.4" />
        <circle cx="4" cy="4.5" r="0.4" />
        <circle cx="6" cy="4.5" r="0.4" />
        <circle cx="8" cy="4.5" r="0.4" />
        <circle cx="3" cy="6" r="0.4" />
        <circle cx="5" cy="6" r="0.4" />
        <circle cx="7" cy="6" r="0.4" />
      </g>
    </svg>
  )
}

function CanadaFlag() {
  return (
    <svg viewBox="0 0 24 18" className="w-6 h-5 rounded-sm">
      <rect width="24" height="18" fill="#fff" />
      <rect width="6" height="18" fill="#FF0000" />
      <rect x="18" width="6" height="18" fill="#FF0000" />
      <path
        d="M12,5 L11.5,7.5 L9.5,7 L10.5,8.5 L8.5,9.5 L10.5,9.5 L10,11.5 L12,10.5 L14,11.5 L13.5,9.5 L15.5,9.5 L13.5,8.5 L14.5,7 L12.5,7.5 Z"
        fill="#FF0000"
        stroke="#FF0000"
        strokeWidth="0.3"
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
