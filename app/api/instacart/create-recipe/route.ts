import { type NextRequest, NextResponse } from "next/server"
import { handleAPIError, validateRequestBody, getEnvVar, fetchWithTimeout, APIError } from "@/lib/api-utils"

interface Measurement {
  quantity: number
  unit: string
}

interface Filter {
  brand_filters?: string[]
  health_filters?: string[]
}

interface Ingredient {
  name: string
  display_text?: string
  measurements?: Measurement[]
  filters?: Filter
}

interface CreateRecipeRequest {
  title: string
  image_url?: string
  author?: string
  servings?: number
  cooking_time?: number
  instructions?: string[]
  ingredients: Array<{
    name: string
    amount?: number
    unit?: string
    filters?: {
      organic?: boolean
      gluten_free?: boolean
      vegan?: boolean
    }
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { title, ingredients, image_url, author, servings, cooking_time, instructions } =
      validateRequestBody<CreateRecipeRequest>(body, ["title", "ingredients"])

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new APIError("Ingredients must be a non-empty array", 400)
    }

    const apiKey = getEnvVar("INSTACART_API_KEY")

    const formattedIngredients: Ingredient[] = ingredients.map((item) => {
      const ingredient: Ingredient = {
        name: item.name,
        display_text: item.name,
      }

      // Add measurements if provided
      if (item.amount && item.unit) {
        ingredient.measurements = [
          {
            quantity: item.amount,
            unit: item.unit,
          },
        ]
      }

      // Add health filters if provided
      if (item.filters) {
        const healthFilters: string[] = []
        if (item.filters.organic) healthFilters.push("ORGANIC")
        if (item.filters.gluten_free) healthFilters.push("GLUTEN_FREE")
        if (item.filters.vegan) healthFilters.push("VEGAN")

        if (healthFilters.length > 0) {
          ingredient.filters = { health_filters: healthFilters }
        }
      }

      return ingredient
    })

    console.log("[v0] Creating Instacart recipe page:", title, "with", formattedIngredients.length, "ingredients")

    const environment = getEnvVar("INSTACART_ENVIRONMENT", false) || "development"
    const baseUrl =
      environment === "production" ? "https://connect.instacart.com" : "https://connect.dev.instacart.tools"

    const requestBody = {
      title,
      ...(image_url && { image_url }),
      ...(author && { author }),
      ...(servings && { servings }),
      ...(cooking_time && { cooking_time }),
      ...(instructions && { instructions }),
      ingredients: formattedIngredients,
      landing_page_configuration: {
        enable_pantry_items: true,
        partner_linkback_url: process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app",
      },
      expires_in: 365, // Cache for 1 year as recommended
    }

    console.log("[v0] Recipe request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetchWithTimeout(
      `${baseUrl}/idp/v1/products/recipe`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      },
      15000,
    )

    console.log("[v0] Instacart create recipe response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Instacart create recipe error:", errorText)
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      throw new APIError("Failed to create Instacart recipe page", response.status, errorData)
    }

    const data = await response.json()
    console.log("[v0] Instacart recipe page created successfully:", data.products_link_url)

    return NextResponse.json({
      url: data.products_link_url,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Instacart create recipe error:", error)
    return handleAPIError(error)
  }
}
