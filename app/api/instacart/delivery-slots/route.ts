import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const { storeId, date } = await request.json()

    if (!storeId) {
      throw new APIError("Store ID is required", 400)
    }

    const apiKey = getEnvVar("INSTACART_API_KEY")

    const params = new URLSearchParams({
      store_id: storeId,
      ...(date && { date }),
    })

    const response = await fetchWithTimeout(
      `https://connect.instacart.com/v2/fulfillment/service_options?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
      10000,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError("Failed to fetch delivery slots", response.status, errorData)
    }

    const data = await response.json()

    return NextResponse.json({
      slots: data.service_options || [],
      success: true,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
