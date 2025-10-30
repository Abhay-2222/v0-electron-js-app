import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, validateRequestBody, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

interface OrderItem {
  name: string
  quantity: number
  unit: string
}

interface CreateOrderRequest {
  items: OrderItem[]
  userId: string
  storeId: string
  deliverySlotId?: string
  specialInstructions?: string
  country?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      userId,
      storeId,
      deliverySlotId,
      specialInstructions,
      country = "US",
    } = validateRequestBody<CreateOrderRequest>(body, ["items", "userId", "storeId"])

    // Get OAuth token from request headers
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new APIError("Missing or invalid authorization token", 401)
    }

    const accessToken = authHeader.substring(7)

    if (!Array.isArray(items) || items.length === 0) {
      throw new APIError("Items must be a non-empty array", 400)
    }

    console.log("[v0] Creating Instacart Connect order with", items.length, "items for country:", country)

    const environment = getEnvVar("INSTACART_ENVIRONMENT", false) || "development"
    const baseUrl =
      environment === "production" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools"

    // Format items for Connect API
    const orderItems = items.map((item, index) => ({
      retailer_reference_code: `item-${index}`,
      name: item.name,
      quantity: item.quantity,
      unit_of_measurement: item.unit,
    }))

    // Generate unique order ID
    const orderId = `meal-plan-${Date.now()}`

    // Create delivery order using Connect API
    const apiUrl = `${baseUrl}/v2/fulfillment/users/${userId}/orders/delivery`

    const orderPayload = {
      order_id: orderId,
      location_code: storeId,
      locale: country === "CA" ? "en-CA" : "en-US",
      special_instructions: specialInstructions || "Please follow delivery instructions carefully.",
      items: orderItems,
      user: {
        first_name: "Meal",
        last_name: "Planner",
      },
    }

    // Add delivery slot if provided
    if (deliverySlotId) {
      Object.assign(orderPayload, { service_option_hold_id: deliverySlotId })
    }

    console.log("[v0] Sending order to Instacart Connect API")

    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderPayload),
      },
      15000,
    )

    console.log("[v0] Instacart Connect order response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("[v0] Instacart Connect order error:", errorData)
      throw new APIError("Failed to create Instacart order", response.status, errorData)
    }

    const data = await response.json()
    console.log("[v0] Instacart order created successfully:", data.id)

    return NextResponse.json({
      orderId: data.id,
      status: data.status,
      trackingUrl: data.tracking_url,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Instacart Connect order error:", error)
    return handleAPIError(error)
  }
}
