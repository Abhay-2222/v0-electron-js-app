import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { handleAPIError, validateRequestBody, getEnvVar, APIError } from "@/lib/api-utils"

interface SubstitutionRequest {
  ingredient: string
  dietary_restrictions?: string[]
  reason?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { ingredient, dietary_restrictions, reason } = validateRequestBody<SubstitutionRequest>(body, ["ingredient"])

    console.log("[v0] Finding substitutions for:", ingredient)

    const apiKey = getEnvVar("OPENAI_API_KEY")

    let prompt = `Suggest 3-5 practical substitutions for "${ingredient}" in cooking.`

    if (dietary_restrictions && dietary_restrictions.length > 0) {
      prompt += ` Consider these dietary restrictions: ${dietary_restrictions.join(", ")}.`
    }

    if (reason) {
      prompt += ` Reason for substitution: ${reason}.`
    }

    prompt += `\n\nReturn the response in JSON format:
{
  "substitutions": [
    {
      "name": "substitute ingredient name",
      "ratio": "1:1 or other ratio",
      "notes": "any important notes about using this substitute"
    }
  ]
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a culinary expert who helps people find ingredient substitutions. Provide practical, commonly available alternatives.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
    })

    console.log("[v0] AI substitution suggestions:", text)

    let result
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = JSON.parse(text)
      }
    } catch (parseError) {
      console.error("[v0] Failed to parse substitution response:", parseError)
      throw new APIError("Failed to parse substitution suggestions", 500)
    }

    return NextResponse.json({
      ...result,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Substitution suggestion error:", error)
    return handleAPIError(error)
  }
}
