import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { handleAPIError, validateRequestBody, getEnvVar, APIError } from "@/lib/api-utils"

interface GenerateRecipeRequest {
  prompt: string
  dietary_preferences?: string[]
  cuisine?: string
  cooking_time?: number
  servings?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { prompt, dietary_preferences, cuisine, cooking_time, servings } = validateRequestBody<GenerateRecipeRequest>(
      body,
      ["prompt"],
    )

    console.log("[v0] Generating recipe with AI for prompt:", prompt)

    const apiKey = getEnvVar("OPENAI_API_KEY")

    let systemPrompt = `You are a professional chef and recipe creator. Generate a detailed, practical recipe based on the user's request.

Return the recipe in the following JSON format:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "servings": 4,
  "cooking_time": 30,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine type",
  "ingredients": [
    {
      "name": "ingredient name (just the ingredient, no quantities)",
      "amount": 2,
      "unit": "cups"
    }
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tags": ["tag1", "tag2"],
  "nutrition": {
    "calories": 350,
    "protein": "25g",
    "carbs": "40g",
    "fat": "10g"
  }
}

Important:
- For ingredients, put ONLY the ingredient name in the "name" field (e.g., "chicken breast", "olive oil", "salt")
- Put quantities in the "amount" field and units in the "unit" field
- Use standard units: cup, tablespoon, teaspoon, ounce, pound, gram, each, package
- Make instructions clear and numbered
- Include realistic cooking times and nutrition estimates`

    if (dietary_preferences && dietary_preferences.length > 0) {
      systemPrompt += `\n- Follow these dietary preferences: ${dietary_preferences.join(", ")}`
    }

    if (cuisine) {
      systemPrompt += `\n- Cuisine style: ${cuisine}`
    }

    if (cooking_time) {
      systemPrompt += `\n- Target cooking time: around ${cooking_time} minutes`
    }

    if (servings) {
      systemPrompt += `\n- Number of servings: ${servings}`
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    console.log("[v0] AI generated recipe text:", text)

    let recipe
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recipe = JSON.parse(jsonMatch[0])
      } else {
        recipe = JSON.parse(text)
      }
    } catch (parseError) {
      console.error("[v0] Failed to parse AI response as JSON:", parseError)
      throw new APIError("Failed to parse AI-generated recipe", 500)
    }

    console.log("[v0] Successfully generated recipe:", recipe.title)

    return NextResponse.json({
      recipe,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Recipe generation error:", error)
    return handleAPIError(error)
  }
}
