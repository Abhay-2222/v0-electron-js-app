import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, validateRequestBody, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

interface LineItem {
  name: string
  quantity: number
  unit: string
}

interface CreateListRequest {
  items: Array<{
    name: string
    amount: number
    unit: string
  }>
  title?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { items, title } = validateRequestBody<CreateListRequest>(body, ["items"])

    if (!Array.isArray(items) || items.length === 0) {
      throw new APIError("Items must be a non-empty array", 400)
    }

    const apiKey = getEnvVar("INSTACART_API_KEY")

    // Format items for Instacart API
    const lineItems: LineItem[] = items.map((item) => ({
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
    }))

    const listTitle = title || `Meal Plan Shopping List - ${new Date().toLocaleDateString()}`

    console.log("[v0] Creating Instacart shopping list:", listTitle, "with", lineItems.length, "items")

    const environment = getEnvVar("INSTACART_ENVIRONMENT", false) || "development"
    const baseUrl =
      environment === "production" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools"

    const response = await fetchWithTimeout(
      `${baseUrl}/idp/v1/products/products_link`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          title: listTitle,
          line_items: lineItems,
        }),
      },
      15000,
    )

    console.log("[v0] Instacart create list response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log("[v0] Instacart create list error:", errorData)
      throw new APIError("Failed to create Instacart shopping list", response.status, errorData)
    }

    const data = await response.json()
    console.log("[v0] Instacart shopping list created successfully")

    return NextResponse.json({
      url: data.url || data.shopping_list_url || data.products_link_url,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Instacart create list error:", error)
    return handleAPIError(error)
  }
}
