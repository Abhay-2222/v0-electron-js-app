import { sampleRecipes } from "../lib/sample-recipes"
import fs from "fs"
import path from "path"

console.log("[v0] Starting recipe image fetching...")
console.log(`[v0] Total recipes to process: ${sampleRecipes.length}`)

async function fetchRecipeImage(recipeName: string): Promise<string | null> {
  try {
    // Search TheMealDB for the recipe
    const searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(recipeName)}`
    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data.meals && data.meals.length > 0) {
      // Return the first match's image
      return data.meals[0].strMealThumb
    }

    return null
  } catch (error) {
    console.error(`[v0] Error fetching image for ${recipeName}:`, error)
    return null
  }
}

async function updateRecipeImages() {
  const updatedRecipes = []
  let successCount = 0
  let failCount = 0

  // Process recipes in batches of 10 with delays
  const batchSize = 10
  for (let i = 0; i < sampleRecipes.length; i += batchSize) {
    const batch = sampleRecipes.slice(i, i + batchSize)

    console.log(`[v0] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleRecipes.length / batchSize)}`)

    const batchPromises = batch.map(async (recipe) => {
      const imageUrl = await fetchRecipeImage(recipe.name)

      if (imageUrl) {
        successCount++
        return { ...recipe, image: imageUrl }
      } else {
        failCount++
        // Use a generic food image placeholder with recipe name
        return { ...recipe, image: `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(recipe.name)}` }
      }
    })

    const batchResults = await Promise.all(batchPromises)
    updatedRecipes.push(...batchResults)

    // Add delay between batches to respect rate limits
    if (i + batchSize < sampleRecipes.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  console.log(`[v0] Image fetching complete!`)
  console.log(`[v0] Successfully fetched: ${successCount} images`)
  console.log(`[v0] Failed to fetch: ${failCount} images`)

  // Generate the updated file content
  const fileContent = `import type { Recipe } from "./types"
import { calculateRecipeCost } from "./ingredient-prices"

// This file contains ${updatedRecipes.length} recipes with images fetched from TheMealDB

export const sampleRecipes: Recipe[] = ${JSON.stringify(updatedRecipes, null, 2)}
`

  // Write to a new file
  const outputPath = path.join(process.cwd(), "lib", "sample-recipes-with-images.ts")
  fs.writeFileSync(outputPath, fileContent, "utf-8")

  console.log(`[v0] Updated recipes written to: ${outputPath}`)
  console.log(`[v0] Review the file and replace sample-recipes.ts if satisfied`)
}

updateRecipeImages()
