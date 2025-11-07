import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Testing Instacart API connection...")

    const apiKey = getEnvVar("INSTACART_API_KEY")

    if (!apiKey) {
      console.log("[v0] INSTACART_API_KEY not found")
      return NextResponse.json(
        {
          success: false,
          message: "API key not configured. Please add INSTACART_API_KEY to your environment variables.",
          apiKeyConfigured: false,
        },
        { status: 400 },
      )
    }

    console.log("[v0] API key found, testing connection...")

    // Use development environment by default (most users will start here)
    const environment = getEnvVar("INSTACART_ENVIRONMENT", false) || "development"
    const baseUrl =
      environment === "production" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools"

    console.log("[v0] Using Instacart environment:", environment)
    console.log("[v0] Base URL:", baseUrl)

    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get("country") === "CA" ? "CA" : "US"
    const testPostalCode = countryCode === "CA" ? "M5H2N2" : "10001"

    console.log("[v0] Testing with country:", countryCode)

    const response = await fetchWithTimeout(
      `${baseUrl}/idp/v1/retailers?postal_code=${testPostalCode}&country_code=${countryCode}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
      10000,
    )

    console.log("[v0] Instacart API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("[v0] Instacart API error:", errorData)

      if (response.status === 401 || response.status === 403) {
        throw new APIError(
          `Invalid API key or unauthorized access. Make sure you're using a valid ${environment} API key.`,
          response.status,
          errorData,
        )
      }

      throw new APIError("API connection failed", response.status, errorData)
    }

    const data = await response.json()
    console.log("[v0] Instacart API success, retailers found:", data.retailers?.length || 0)

    return NextResponse.json({
      success: true,
      message: `Instacart API connection successful (${environment} environment, ${countryCode})`,
      retailersFound: data.retailers?.length || 0,
      apiKeyConfigured: true,
      environment,
      country: countryCode,
    })
  } catch (error) {
    console.error("[v0] Instacart API test error:", error)

    if (error instanceof APIError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
            apiKeyConfigured: true,
          },
          { status: 401 },
        )
      }

      if (error.message.includes("Environment variable")) {
        return NextResponse.json(
          {
            success: false,
            message: "API key not configured. Please add INSTACART_API_KEY to your environment variables.",
            apiKeyConfigured: false,
          },
          { status: 400 },
        )
      }
    }

    return handleAPIError(error)
  }
}
