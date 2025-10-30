import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(new URL(`/?instacart_error=${encodeURIComponent(error)}`, request.url))
  }

  // Validate code exists
  if (!code) {
    return NextResponse.redirect(new URL("/?instacart_error=missing_code", request.url))
  }

  try {
    // Exchange code for token (this will be done client-side)
    // Redirect back to app with code
    return NextResponse.redirect(
      new URL(`/?instacart_code=${encodeURIComponent(code)}&state=${state || ""}`, request.url),
    )
  } catch (error) {
    console.error("[v0] OAuth callback error:", error)
    return NextResponse.redirect(new URL("/?instacart_error=token_exchange_failed", request.url))
  }
}
