import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postalCode = searchParams.get("postal_code")
    const country = searchParams.get("country") || "US"

    // Get OAuth token from request headers
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new APIError("Missing or invalid authorization token", 401)
    }

    const accessToken = authHeader.substring(7)

    if (!postalCode) {
      throw new APIError("postal_code is required", 400)
    }

    console.log("[v0] Fetching Instacart Connect stores for postal code:", postalCode, "country:", country)

    const environment = getEnvVar("INSTACART_ENVIRONMENT", false) || "development"
    const baseUrl =
      environment === "production" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools"

    const apiUrl = `${baseUrl}/v2/fulfillment/stores?postal_code=${postalCode}&country_code=${country}`

    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
      10000,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("[v0] Instacart Connect stores error:", errorData)
      throw new APIError("Failed to fetch stores", response.status, errorData)
    }

    const data = await response.json()
    console.log("[v0] Found", data.stores?.length || 0, "stores")

    return NextResponse.json({
      stores: data.stores || [],
      success: true,
    })
  } catch (error) {
    console.error("[v0] Instacart Connect stores error:", error)
    return handleAPIError(error)
  }
}
