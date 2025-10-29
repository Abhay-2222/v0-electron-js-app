import { NextResponse } from "next/server"
import { z } from "zod"

const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"
const MEALDB_V2_BASE_URL = "https://themealdb.com/api/json/v2/1"
const RECIPE_PUPPY_BASE_URL = "http://www.recipepuppy.com/api"

const recipeSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["breakfast", "lunch", "dinner", "snack"]),
      prepTime: z.number(),
      cookTime: z.number(),
      servings: z.number(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.number(),
          unit: z.string(),
          category: z.enum(["produce", "meat", "dairy", "grains", "spices", "other"]),
        }),
      ),
      instructions: z.array(z.string()),
      nutrition: z.object({
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
      }),
    }),
  ),
})

export async function GET(request: Request) {
  console.log("[v0] Recipe search API called")

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const diet = searchParams.get("diet")
  const type = searchParams.get("type")
  const diverse = searchParams.get("diverse") === "true"
  const mealType = searchParams.get("mealType")

  console.log("[v0] Search params:", { query, diet, type, diverse, mealType })

  if (diverse && !query) {
    try {
      const diverseRecipes = await fetchDiverseRecipes(mealType || undefined)
      console.log("[v0] Diverse recipes found:", diverseRecipes.length)

      return NextResponse.json({
        recipes: diverseRecipes,
        isSuggestion: false,
      })
    } catch (error) {
      console.error("[v0] Diverse recipe fetch error:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch diverse recipes. Please try again.",
        },
        { status: 500 },
      )
    }
  }

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const [mealDBResults, categoryResults, recipePuppyResults] = await Promise.all([
      searchTheMealDB(query),
      searchByCategory(query),
      searchRecipePuppy(query),
    ])

    const allMeals = [...mealDBResults, ...categoryResults, ...recipePuppyResults]
    const uniqueMeals = deduplicateMeals(allMeals)

    const isSuggestion = mealDBResults.length === 0 && recipePuppyResults.length === 0

    const recipes = uniqueMeals.map((meal: any) => {
      if (meal.source === "recipepuppy") {
        return {
          id: `recipepuppy-${meal.href}`,
          name: meal.title,
          category: mapMealCategory(type || "dinner"),
          diet: "classic" as const,
          prepTime: 15,
          cookTime: 30,
          servings: 4,
          ingredients: meal.ingredients.split(",").map((ing: string, idx: number) => ({
            id: `ing-${meal.href}-${idx}`,
            name: ing.trim(),
            amount: 1,
            unit: "unit",
            category: categorizeIngredient(ing.trim()),
          })),
          instructions: [`Visit ${meal.href} for full instructions`],
          image: meal.thumbnail || "/handwritten-recipe.png",
          nutrition: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
        }
      }

      const ingredients = []
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]
        const measure = meal[`strMeasure${i}`]
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            id: `ing-${meal.idMeal}-${i}`,
            name: ingredient.trim(),
            amount: Number.parseFloat(measure) || 1,
            unit: measure?.replace(/[0-9.]/g, "").trim() || "unit",
            category: categorizeIngredient(ingredient.trim()),
          })
        }
      }

      return {
        id: `mealdb-${meal.idMeal}`,
        name: meal.strMeal,
        category: mapMealCategory(meal.strCategory),
        diet: "classic" as const,
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        ingredients,
        instructions: meal.strInstructions?.split("\n").filter((s: string) => s.trim()) || [],
        image: meal.strMealThumb,
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      }
    })

    console.log("[v0] Total recipes found:", recipes.length)
    console.log("[v0] TheMealDB:", mealDBResults.length, "Recipe Puppy:", recipePuppyResults.length)

    return NextResponse.json({
      recipes,
      isSuggestion,
    })
  } catch (error) {
    console.error("[v0] Recipe search error:", error)
    return NextResponse.json(
      {
        error: "Failed to search recipes. Please try again.",
      },
      { status: 500 },
    )
  }
}

async function searchTheMealDB(query: string): Promise<any[]> {
  let meals: any[] = []

  const searchUrl = `${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
  console.log("[v0] TheMealDB - Searching by name")
  const searchResponse = await fetch(searchUrl)

  if (searchResponse.ok) {
    const searchData = await searchResponse.json()
    meals = searchData.meals || []
    console.log("[v0] TheMealDB - Found by name:", meals.length)
  }

  if (meals.length === 0 && query.length > 0) {
    const firstLetter = query.charAt(0).toLowerCase()
    const letterUrl = `${MEALDB_BASE_URL}/search.php?f=${firstLetter}`
    console.log("[v0] TheMealDB - Searching by first letter")
    const letterResponse = await fetch(letterUrl)

    if (letterResponse.ok) {
      const letterData = await letterResponse.json()
      const allMeals = letterData.meals || []
      meals = allMeals.filter((meal: any) => meal.strMeal.toLowerCase().includes(query.toLowerCase()))
      console.log("[v0] TheMealDB - Found by letter:", meals.length)
    }
  }

  return meals
}

async function searchByCategory(query: string): Promise<any[]> {
  const meals: any[] = []

  const categories = [
    "Chicken",
    "Beef",
    "Vegetarian",
    "Pasta",
    "Seafood",
    "Dessert",
    "Lamb",
    "Pork",
    "Side",
    "Starter",
    "Vegan",
    "Breakfast",
  ]
  const areas = [
    "Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Japanese",
    "Thai",
    "American",
    "British",
    "French",
    "Greek",
  ]

  const queryLower = query.toLowerCase()

  const matchedCategory = categories.find(
    (cat) => queryLower.includes(cat.toLowerCase()) || cat.toLowerCase().includes(queryLower),
  )

  const matchedArea = areas.find(
    (area) => queryLower.includes(area.toLowerCase()) || area.toLowerCase().includes(queryLower),
  )

  const searches: Promise<any[]>[] = []

  if (matchedCategory) {
    console.log("[v0] Searching by category:", matchedCategory)
    searches.push(fetchByCategory(matchedCategory))
  }

  if (matchedArea) {
    console.log("[v0] Searching by area:", matchedArea)
    searches.push(fetchByArea(matchedArea))
  }

  if (searches.length === 0) {
    const randomCategories = ["Chicken", "Vegetarian", "Pasta"].slice(0, 2)
    searches.push(...randomCategories.map((cat) => fetchByCategory(cat)))
  }

  const results = await Promise.all(searches)
  return results.flat().slice(0, 10)
}

async function fetchByCategory(category: string): Promise<any[]> {
  const categoryUrl = `${MEALDB_BASE_URL}/filter.php?c=${category}`
  const categoryResponse = await fetch(categoryUrl)

  if (categoryResponse.ok) {
    const categoryData = await categoryResponse.json()
    const simpleMeals = categoryData.meals || []

    const detailedMeals = await Promise.all(
      simpleMeals.slice(0, 3).map(async (meal: any) => {
        const detailUrl = `${MEALDB_BASE_URL}/lookup.php?i=${meal.idMeal}`
        const detailResponse = await fetch(detailUrl)
        const detailData = await detailResponse.json()
        return detailData.meals?.[0]
      }),
    )

    return detailedMeals.filter(Boolean)
  }

  return []
}

async function fetchByArea(area: string): Promise<any[]> {
  const areaUrl = `${MEALDB_BASE_URL}/filter.php?a=${area}`
  const areaResponse = await fetch(areaUrl)

  if (areaResponse.ok) {
    const areaData = await areaResponse.json()
    const simpleMeals = areaData.meals || []

    const detailedMeals = await Promise.all(
      simpleMeals.slice(0, 3).map(async (meal: any) => {
        const detailUrl = `${MEALDB_BASE_URL}/lookup.php?i=${meal.idMeal}`
        const detailResponse = await fetch(detailUrl)
        const detailData = await detailResponse.json()
        return detailData.meals?.[0]
      }),
    )

    return detailedMeals.filter(Boolean)
  }

  return []
}

async function searchRecipePuppy(query: string): Promise<any[]> {
  try {
    console.log("[v0] Recipe Puppy - Searching for:", query)
    const searchUrl = `${RECIPE_PUPPY_BASE_URL}/?q=${encodeURIComponent(query)}`
    const response = await fetch(searchUrl)

    if (!response.ok) {
      console.log("[v0] Recipe Puppy - Request failed with status:", response.status)
      return []
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.log("[v0] Recipe Puppy - Response is not JSON, content-type:", contentType)
      return []
    }

    const text = await response.text()

    // Check if the response looks like JSON
    if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
      console.log("[v0] Recipe Puppy - Response is not valid JSON format")
      return []
    }

    const data = JSON.parse(text)
    const results = data.results || []

    console.log("[v0] Recipe Puppy - Found:", results.length)

    return results.slice(0, 10).map((recipe: any) => ({
      ...recipe,
      source: "recipepuppy",
    }))
  } catch (error) {
    console.error("[v0] Recipe Puppy search error:", error)
    return []
  }
}

function deduplicateMeals(meals: any[]): any[] {
  const seen = new Set()
  return meals.filter((meal) => {
    const id = meal.idMeal || meal.href
    if (!meal || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

function categorizeIngredient(ingredient: string): "produce" | "meat" | "dairy" | "grains" | "spices" | "other" {
  const lower = ingredient.toLowerCase()

  if (
    lower.match(
      /tomato|onion|garlic|pepper|carrot|potato|lettuce|spinach|broccoli|cauliflower|cabbage|celery|cucumber|mushroom|peas|corn|bean|lentil|chickpea|vegetable|fruit|apple|banana|lemon|lime|orange/,
    )
  ) {
    return "produce"
  }

  if (lower.match(/chicken|beef|pork|lamb|turkey|fish|salmon|tuna|shrimp|prawn|meat|bacon|sausage|ham/)) {
    return "meat"
  }

  if (lower.match(/milk|cream|cheese|butter|yogurt|yoghurt|egg|dairy/)) {
    return "dairy"
  }

  if (lower.match(/rice|pasta|bread|flour|oat|wheat|quinoa|barley|noodle|tortilla|grain/)) {
    return "grains"
  }

  if (
    lower.match(
      /salt|pepper|spice|herb|cumin|coriander|turmeric|paprika|chili|cinnamon|ginger|garlic powder|onion powder|oregano|basil|thyme|rosemary|parsley|bay|cardamom|clove|nutmeg|saffron|curry/,
    )
  ) {
    return "spices"
  }

  return "other"
}

function mapMealCategory(category: string): "breakfast" | "lunch" | "dinner" | "snack" {
  const lower = category?.toLowerCase() || ""
  if (lower.includes("breakfast")) return "breakfast"
  if (lower.includes("dessert") || lower.includes("starter")) return "snack"
  return "dinner"
}

async function fetchDiverseRecipes(mealType?: string): Promise<any[]> {
  console.log("[v0] Fetching 50 healthy recipes for meal type:", mealType || "all")

  // Define healthy categories - 70% of our mix
  const healthyCategories = ["Vegetarian", "Seafood", "Chicken", "Vegan"]

  // Define healthy areas/cuisines
  const healthyAreas = ["Japanese", "Thai", "Mediterranean", "Greek", "Vietnamese"]

  // Define breakfast-specific searches
  const breakfastSearches = ["oatmeal", "eggs", "smoothie", "yogurt", "avocado toast", "granola"]

  const searches: Promise<any[]>[] = []

  // Fetch based on meal type
  if (mealType === "breakfast") {
    // For breakfast, search for breakfast-specific healthy items
    for (const term of breakfastSearches) {
      searches.push(searchTheMealDB(term))
    }
    // Also get some vegetarian breakfast options
    searches.push(fetchByCategory("Breakfast"))
    searches.push(fetchByCategory("Vegetarian"))
  } else {
    // For lunch/dinner, focus on healthy categories
    for (const category of healthyCategories) {
      searches.push(fetchByCategory(category))
    }

    // Add some healthy cuisine areas
    for (const area of healthyAreas.slice(0, 3)) {
      searches.push(fetchByArea(area))
    }
  }

  const results = await Promise.all(searches)
  const allMeals = results.flat()

  // Deduplicate
  const uniqueMeals = deduplicateMeals(allMeals)

  // Shuffle for variety
  const shuffled = uniqueMeals.sort(() => Math.random() - 0.5)

  // Return up to 50 healthy recipes
  const selectedMeals = shuffled.slice(0, 50)

  console.log("[v0] Selected", selectedMeals.length, "healthy recipes for", mealType || "all meals")

  // Convert to recipe format
  return selectedMeals.map((meal: any) => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`]
      const measure = meal[`strMeasure${i}`]
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          id: `ing-${meal.idMeal}-${i}`,
          name: ingredient.trim(),
          amount: Number.parseFloat(measure) || 1,
          unit: measure?.replace(/[0-9.]/g, "").trim() || "unit",
          category: categorizeIngredient(ingredient.trim()),
        })
      }
    }

    return {
      id: `mealdb-${meal.idMeal}`,
      name: meal.strMeal,
      category: mapMealCategory(meal.strCategory),
      diet: "classic" as const,
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      ingredients,
      instructions: meal.strInstructions?.split("\n").filter((s: string) => s.trim()) || [],
      image: meal.strMealThumb,
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    }
  })
}
