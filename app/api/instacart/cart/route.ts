import { type NextRequest, NextResponse } from "next/server"

const INSTACART_API_KEY = process.env.INSTACART_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 })
    }

    if (!INSTACART_API_KEY) {
      return NextResponse.json({ error: "Instacart API key is not configured" }, { status: 500 })
    }

    // Call Instacart API to create a cart
    const response = await fetch("https://api.instacart.com/v2/carts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${INSTACART_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((item: any) => ({
          product_id: item.productId,
          quantity: item.quantity || 1,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error(`Instacart API error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      cart: data,
      checkoutUrl: data.checkout_url,
    })
  } catch (error) {
    console.error("[v0] Instacart cart error:", error)
    return NextResponse.json({ error: "Failed to create cart" }, { status: 500 })
  }
}
