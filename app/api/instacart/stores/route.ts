import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zipCode = searchParams.get("postal_code")
    const countryCode = searchParams.get("country_code") || "US"

    if (!zipCode) {
      throw new APIError("postal_code is required", 400)
    }

    console.log("[v0] Fetching Instacart retailers for:", { zipCode, countryCode })

    const apiKey = getEnvVar("INSTACART_API_KEY")

    const environment = getEnvVar("INSTACART_ENVIRONMENT", false) || "development"
    const baseUrl =
      environment === "production" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools"

    const response = await fetchWithTimeout(
      `${baseUrl}/idp/v1/retailers?postal_code=${zipCode}&country_code=${countryCode}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
      10000,
    )

    console.log("[v0] Instacart retailers API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("[v0] Instacart retailers API error:", errorData)
      throw new APIError("Failed to fetch retailers", response.status, errorData)
    }

    const data = await response.json()
    console.log("[v0] Instacart retailers found:", data.retailers?.length || 0)

    return NextResponse.json({
      retailers: data.retailers || [],
      success: true,
    })
  } catch (error) {
    console.error("[v0] Instacart retailers API error:", error)
    return handleAPIError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { zipCode, countryCode = "US" } = await request.json()

    if (!zipCode) {
      throw new APIError("zipCode is required", 400)
    }

    console.log("[v0] Fetching Instacart retailers for:", { zipCode, countryCode })

    const apiKey = getEnvVar("INSTACART_API_KEY")

    const environment = getEnvVar("INSTACART_ENVIRONMENT", false) || "development"
    const baseUrl =
      environment === "production" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools"

    const response = await fetchWithTimeout(
      `${baseUrl}/idp/v1/retailers?postal_code=${zipCode}&country_code=${countryCode}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
      10000,
    )

    console.log("[v0] Instacart retailers API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("[v0] Instacart retailers API error:", errorData)
      throw new APIError("Failed to fetch retailers", response.status, errorData)
    }

    const data = await response.json()
    console.log("[v0] Instacart retailers found:", data.retailers?.length || 0)

    const stores = (data.retailers || []).map((retailer: any) => ({
      id: retailer.id,
      name: retailer.name,
      logo_url: retailer.logo_url,
      location: retailer.location,
    }))

    return NextResponse.json({
      stores,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Instacart retailers API error:", error)
    return handleAPIError(error)
  }
}
