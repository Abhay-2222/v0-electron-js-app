import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, validateRequestBody, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

interface CreateOrderRequest {
  items: Array<{
    name: string
    amount: number
    unit: string
  }>
  storeId: string
  deliverySlotId: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { items, storeId, deliverySlotId, address } = validateRequestBody<CreateOrderRequest>(body, [
      "items",
      "storeId",
      "deliverySlotId",
    ])

    if (!Array.isArray(items) || items.length === 0) {
      throw new APIError("Items must be a non-empty array", 400)
    }

    const apiKey = getEnvVar("INSTACART_API_KEY")

    const lineItems = items.map((item) => ({
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
    }))

    const response = await fetchWithTimeout(
      "https://connect.instacart.com/v2/fulfillment/orders",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          store_id: storeId,
          service_option_id: deliverySlotId,
          line_items: lineItems,
          ...(address && {
            delivery_address: {
              street_address: address.street,
              city: address.city,
              state: address.state,
              zip_code: address.zipCode,
            },
          }),
        }),
      },
      15000,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError("Failed to create order", response.status, errorData)
    }

    const data = await response.json()

    return NextResponse.json({
      order: data,
      success: true,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
