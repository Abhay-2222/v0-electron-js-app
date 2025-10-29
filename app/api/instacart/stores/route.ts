import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const { zipCode, latitude, longitude } = await request.json()

    if (!zipCode && (!latitude || !longitude)) {
      throw new APIError("Either zipCode or coordinates (latitude, longitude) are required", 400)
    }

    const apiKey = getEnvVar("INSTACART_API_KEY")

    const params = new URLSearchParams()
    if (zipCode) {
      params.append("zip_code", zipCode)
    } else {
      params.append("latitude", latitude.toString())
      params.append("longitude", longitude.toString())
    }

    const response = await fetchWithTimeout(
      `https://api.instacart.com/v2/fulfillment/stores?${params.toString()}`,
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
      throw new APIError("Failed to fetch stores", response.status, errorData)
    }

    const data = await response.json()

    return NextResponse.json({
      stores: data.stores || [],
      success: true,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
