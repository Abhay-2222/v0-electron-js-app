import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const apiKey = getEnvVar("INSTACART_API_KEY")

    // Test connection by fetching stores for a common ZIP code (New York)
    const response = await fetchWithTimeout(
      `https://api.instacart.com/v2/fulfillment/stores?zip_code=10001`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
      10000,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError("API key is invalid or connection failed", response.status, errorData)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "Instacart API connection successful",
      storesFound: data.stores?.length || 0,
      apiKeyConfigured: true,
    })
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 401) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid API key. Please check your INSTACART_API_KEY.",
          apiKeyConfigured: true,
        },
        { status: 401 },
      )
    }

    return handleAPIError(error)
  }
}
