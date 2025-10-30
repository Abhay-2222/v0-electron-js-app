import { type NextRequest, NextResponse } from "next/server"

const INSTACART_API_KEY = process.env.INSTACART_API_KEY

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    if (!INSTACART_API_KEY) {
      return NextResponse.json({ error: "Instacart API key is not configured" }, { status: 500 })
    }

    // Call Instacart API to search for products
    const response = await fetch(`https://api.instacart.com/v2/products/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${INSTACART_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Instacart API error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      products: data.products || [],
    })
  } catch (error) {
    console.error("[v0] Instacart search error:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
