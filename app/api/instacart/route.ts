import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const apiKey = process.env.INSTACART_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Instacart API key not configured" }, { status: 500 })
  }

  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Build line items for the Instacart shopping list page API
    const lineItems = items.map((item: { name: string; amount: number; unit: string }) => ({
      name: `${item.name}`,
      quantity: Math.ceil(item.amount),
      unit: item.unit || undefined,
    }))

    const response = await fetch("https://connect.instacart.com/idp/v1/products/products_link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        title: "My Meal Plan Grocery List",
        line_items: lineItems,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Instacart API error:", response.status, errorText)
      return NextResponse.json(
        { error: `Instacart API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ url: data.url ?? data.products_link_url ?? data.link })
  } catch (error) {
    console.error("[v0] Instacart route error:", error)
    return NextResponse.json({ error: "Failed to create Instacart list" }, { status: 500 })
  }
}
