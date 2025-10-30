export async function detectUserCountry(): Promise<"US" | "CA"> {
  // Check if already saved
  const saved = localStorage.getItem("instacart_country")
  if (saved === "US" || saved === "CA") {
    return saved
  }

  try {
    // Try geolocation API first
    if ("geolocation" in navigator) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000, // Cache for 5 minutes
        })
      })

      // Use reverse geocoding to determine country
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
      )
      const data = await response.json()

      if (data.address?.country_code === "ca") {
        localStorage.setItem("instacart_country", "CA")
        return "CA"
      }
    }
  } catch (error) {
    console.log("[v0] Geolocation detection failed, trying timezone fallback:", error)
  }

  // Fallback: Use timezone to guess country
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const canadianTimezones = [
      "America/Toronto",
      "America/Vancouver",
      "America/Edmonton",
      "America/Winnipeg",
      "America/Halifax",
      "America/St_Johns",
    ]

    if (canadianTimezones.some((tz) => timezone.includes(tz))) {
      localStorage.setItem("instacart_country", "CA")
      return "CA"
    }
  } catch (error) {
    console.log("[v0] Timezone detection failed:", error)
  }

  // Default to US
  localStorage.setItem("instacart_country", "US")
  return "US"
}
