import { NextResponse } from "next/server"

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public details?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown) {
  console.error("[v0] API Error:", error)

  if (error instanceof APIError) {
    return NextResponse.json({ error: error.message, details: error.details }, { status: error.statusCode })
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

export function validateRequestBody<T>(body: any, requiredFields: string[]): T {
  for (const field of requiredFields) {
    if (!(field in body)) {
      throw new APIError(`Missing required field: ${field}`, 400)
    }
  }
  return body as T
}

export function getEnvVar(key: string, required = true): string | undefined {
  const value = process.env[key]

  if (required && !value) {
    throw new APIError(`Environment variable ${key} is not configured`, 500)
  }

  return value
}

export async function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new APIError("Request timeout", 408)
    }
    throw error
  }
}
