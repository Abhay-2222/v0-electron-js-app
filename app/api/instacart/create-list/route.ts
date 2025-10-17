import { type NextRequest, NextResponse } from "next/server"

interface LineItem {
  name: string
  quantity: number
  unit: string
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    const apiKey = process.env.INSTACART_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Instacart API key not configured. Please add INSTACART_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    // Format items for Instacart API
    const lineItems: LineItem[] = items.map((item: any) => ({
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
    }))

    const apiEndpoint = "https://api.instacart.com/idp/v1/products/products_link"

    // Call Instacart API to create shopping list
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(process.env.INSTACART_PARTNER_ID && {
          "X-Instacart-Partner-Id": process.env.INSTACART_PARTNER_ID,
        }),
      },
      body: JSON.stringify({
        line_items: lineItems,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Instacart API error:", errorData)
      return NextResponse.json(
        { error: "Failed to create Instacart shopping list", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Return the shopping list URL
    return NextResponse.json({
      url: data.url || data.shopping_list_url,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Error creating Instacart list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
