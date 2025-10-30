import OpenAI from "openai"
import { sampleRecipes } from "../lib/sample-recipes"
import fs from "fs"
import path from "path"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface EnhancedIngredient {
  name: string
  amount: number
  unit: string
  category: "produce" | "meat" | "dairy" | "grains" | "spices" | "pantry" | "other"
}

async function enhanceRecipeIngredients(recipeName: string, currentIngredients: any[]): Promise<EnhancedIngredient[]> {
  const ingredientList = currentIngredients.map((ing) => `${ing.amount} ${ing.unit} ${ing.name}`).join(", ")

  const prompt = `You are a professional chef. Given the recipe "${recipeName}" with current ingredients: ${ingredientList}

Please provide a COMPLETE and ACCURATE ingredient list for this dish. Include ALL essential ingredients that are typically needed, including:
- All spices and seasonings
- Cooking oils/fats
- Aromatics (onions, garlic, ginger, etc.)
- Any missing main ingredients
- Garnishes if traditional

Return ONLY a JSON array of ingredients in this exact format:
[
  {
    "name": "ingredient name",
    "amount": number,
    "unit": "cup/tbsp/tsp/lb/oz/whole/clove/etc",
    "category": "produce/meat/dairy/grains/spices/pantry/other"
  }
]

Be specific with measurements. Use standard cooking units. Ensure the recipe is complete and authentic.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef who provides complete, accurate ingredient lists. Always return valid JSON arrays only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    })

    const content = response.choices[0].message.content
    if (!content) {
      console.log(`[v0] No response for ${recipeName}, keeping original ingredients`)
      return currentIngredients
    }

    // Parse the response - it might be wrapped in an object
    let parsed = JSON.parse(content)

    // If it's an object with an ingredients key, extract that
    if (parsed.ingredients && Array.isArray(parsed.ingredients)) {
      parsed = parsed.ingredients
    }

    // If it's still not an array, try to find the array
    if (!Array.isArray(parsed)) {
      const keys = Object.keys(parsed)
      const arrayKey = keys.find((key) => Array.isArray(parsed[key]))
      if (arrayKey) {
        parsed = parsed[arrayKey]
      } else {
        console.log(`[v0] Invalid response format for ${recipeName}, keeping original`)
        return currentIngredients
      }
    }

    console.log(`[v0] Enhanced ${recipeName}: ${currentIngredients.length} → ${parsed.length} ingredients`)
    return parsed
  } catch (error) {
    console.error(`[v0] Error enhancing ${recipeName}:`, error)
    return currentIngredients
  }
}

async function enhanceAllRecipes() {
  console.log(`[v0] Starting enhancement of ${sampleRecipes.length} recipes...`)
  console.log(`[v0] This will take approximately ${Math.ceil(sampleRecipes.length / 5)} minutes`)

  const enhancedRecipes = []
  let enhancedCount = 0

  const batchSize = 5
  for (let i = 0; i < sampleRecipes.length; i += batchSize) {
    const batch = sampleRecipes.slice(i, i + batchSize)
    console.log(
      `\n[v0] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleRecipes.length / batchSize)} (recipes ${i + 1}-${Math.min(i + batchSize, sampleRecipes.length)})`,
    )

    const batchPromises = batch.map(async (recipe) => {
      console.log(`[v0] Enhancing ${recipe.name} (current: ${recipe.ingredients.length} ingredients)...`)
      const enhancedIngredients = await enhanceRecipeIngredients(recipe.name, recipe.ingredients)

      enhancedCount++
      return {
        ...recipe,
        ingredients: enhancedIngredients.map((ing, idx) => ({
          id: `${recipe.id}-ing-${idx + 1}`,
          ...ing,
        })),
      }
    })

    const batchResults = await Promise.all(batchPromises)
    enhancedRecipes.push(...batchResults)

    // Add a small delay between batches to respect rate limits
    if (i + batchSize < sampleRecipes.length) {
      console.log(`[v0] Waiting 2 seconds before next batch...`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  console.log(`\n[v0] Enhancement complete!`)
  console.log(`[v0] Enhanced: ${enhancedCount} recipes`)
  console.log(`[v0] Total: ${enhancedRecipes.length} recipes`)

  // Generate the new TypeScript file content
  const fileContent = `import type { Recipe } from "./types"
import { calculateRecipeCost } from "./ingredient-prices"

// This file contains ${enhancedRecipes.length} recipes with enhanced, complete ingredient lists
// Enhanced using AI to ensure all recipes have comprehensive ingredients

export const sampleRecipes: Recipe[] = ${JSON.stringify(enhancedRecipes, null, 2)
    .replace(/"get cost$$$$"/g, "get cost()")
    .replace(/: "function cost$$$$ \{[^}]+\}"/g, "() {\n      return calculateRecipeCost(this.ingredients)\n    }")
    .replace(/"cost": \{[^}]+\}/g, "get cost() {\n      return calculateRecipeCost(this.ingredients)\n    }")}
`

  // Write to a new file first (backup)
  const outputPath = path.join(process.cwd(), "lib", "sample-recipes-enhanced.ts")
  fs.writeFileSync(outputPath, fileContent, "utf-8")
  console.log(`\n[v0] Enhanced recipes written to: lib/sample-recipes-enhanced.ts`)
  console.log(`[v0] Review the file, then rename it to sample-recipes.ts to use the enhanced recipes`)

  return enhancedRecipes
}

// Run the enhancement
enhanceAllRecipes()
  .then(() => {
    console.log("\n[v0] ✅ Recipe enhancement completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n[v0] ❌ Recipe enhancement failed:", error)
    process.exit(1)
  })
