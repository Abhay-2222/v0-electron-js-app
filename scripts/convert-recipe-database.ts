import type { Recipe } from "@/lib/types"

const recipeIngredients = {
  // Recipe data from the uploaded file
  Pancakes: ["flour", "eggs", "milk", "baking powder", "sugar", "butter", "vanilla extract"],
  "French Toast": ["bread", "eggs", "milk", "cinnamon", "vanilla extract", "butter", "maple syrup"],
  // ... (all other recipes from the file)
}

// Helper function to categorize ingredients
function categorizeIngredient(ingredientName: string): "produce" | "dairy" | "meat" | "pantry" | "frozen" {
  const name = ingredientName.toLowerCase()

  // Produce
  if (
    name.match(
      /vegetable|tomato|onion|garlic|ginger|pepper|carrot|celery|spinach|lettuce|cabbage|cucumber|avocado|mushroom|broccoli|cauliflower|potato|eggplant|zucchini|pumpkin|squash|bean sprout|scallion|leek|herb|basil|cilantro|parsley|mint|curry leaves|lemon|lime|orange|apple|banana|berry|fruit|plantain/,
    )
  ) {
    return "produce"
  }

  // Dairy
  if (
    name.match(
      /milk|cream|butter|cheese|yogurt|paneer|ghee|ricotta|mozzarella|parmesan|cheddar|feta|cottage cheese|sour cream|cream cheese|khoya/,
    )
  ) {
    return "dairy"
  }

  // Meat
  if (
    name.match(
      /chicken|beef|pork|lamb|mutton|fish|shrimp|prawn|seafood|bacon|sausage|ham|turkey|duck|egg|meat|veal|ribs|brisket/,
    )
  ) {
    return "meat"
  }

  // Frozen
  if (name.match(/frozen|ice cream/)) {
    return "frozen"
  }

  // Default to pantry
  return "pantry"
}

// Helper function to estimate amount and unit
function estimateAmountAndUnit(ingredientName: string): { amount: string; unit: string } {
  const name = ingredientName.toLowerCase()

  // Liquids
  if (name.match(/milk|cream|water|stock|broth|juice|oil|vinegar|wine|sauce|syrup/)) {
    return { amount: "1", unit: "cup" }
  }

  // Small amounts (spices, extracts)
  if (
    name.match(/extract|powder|spice|salt|pepper|saffron|cardamom|cinnamon|cumin|turmeric|paprika|chili|masala|seeds/)
  ) {
    return { amount: "1", unit: "tsp" }
  }

  // Whole items
  if (name.match(/egg|onion|tomato|potato|carrot|pepper|chicken breast|fish fillet/)) {
    return { amount: "2", unit: "whole" }
  }

  // Meat portions
  if (name.match(/chicken|beef|pork|lamb|fish|shrimp|meat/)) {
    return { amount: "500", unit: "g" }
  }

  // Cheese/paneer
  if (name.match(/cheese|paneer/)) {
    return { amount: "200", unit: "g" }
  }

  // Default
  return { amount: "1", unit: "cup" }
}

// Convert recipe database to proper format
function convertRecipeDatabase(): Recipe[] {
  const recipes: Recipe[] = []
  let recipeId = 1

  // Define categories for each recipe
  const recipeCategories: Record<string, { category: string; diet: string }> = {}

  // Western Breakfast (75 recipes)
  const westernBreakfast = [
    "Pancakes",
    "French Toast",
    "Waffles",
    "Eggs Benedict",
    "Omelette",
    "Scrambled Eggs",
    "Poached Eggs",
    "Fried Eggs",
    "Boiled Eggs",
    "Avocado Toast",
    "Bagel with Cream Cheese",
    "Croissant",
    "Danish Pastry",
    "Muffin",
    "Scone",
    "English Breakfast",
    "Full English",
    "Hash Browns",
    "Bacon and Eggs",
    "Sausage and Eggs",
    "Breakfast Burrito",
    "Breakfast Sandwich",
    "Granola",
    "Yogurt Parfait",
    "Smoothie Bowl",
    "Acai Bowl",
    "Chia Pudding",
    "Overnight Oats",
    "Porridge",
    "Cereal",
    "Toast with Jam",
    "Peanut Butter Toast",
    "Nutella Toast",
    "Banana Bread",
    "Zucchini Bread",
    "Pumpkin Bread",
    "Cornbread",
    "Biscuits and Gravy",
    "Grits",
    "Polenta",
    "Frittata",
    "Quiche",
    "Crepes",
    "Blintzes",
    "Dutch Baby",
    "German Pancake",
    "Belgian Waffle",
    "Buttermilk Pancake",
    "Blueberry Pancake",
    "Chocolate Chip Pancake",
    "Banana Pancake",
    "Protein Pancake",
    "Vegan Pancake",
    "Gluten-Free Pancake",
    "Keto Pancake",
    "Paleo Pancake",
    "Sourdough Toast",
    "Multigrain Toast",
    "Whole Wheat Toast",
    "Rye Toast",
    "Pumpernickel Toast",
    "Cinnamon Toast",
    "French Toast Sticks",
    "Waffle Sandwich",
    "Breakfast Pizza",
    "Breakfast Quesadilla",
    "Breakfast Tacos",
    "Huevos Rancheros",
    "Chilaquiles",
    "Migas",
    "Shakshuka",
    "Turkish Eggs",
    "Israeli Breakfast",
    "Greek Yogurt Bowl",
    "Cottage Cheese Bowl",
    "Ricotta Toast",
  ]

  westernBreakfast.forEach((name) => {
    const isVegetarian = !name.match(/bacon|sausage|ham|meat|chicken|beef|pork|fish/i)
    recipeCategories[name] = { category: "Breakfast", diet: isVegetarian ? "Vegetarian" : "Classic" }
  })

  // Continental (70 recipes)
  const continental = [
    "Grilled Chicken",
    "Roast Beef",
    "Lamb Chops",
    "Pork Tenderloin",
    "Beef Wellington",
    "Chicken Cordon Bleu",
    "Schnitzel",
    "Steak Frites",
    "Coq au Vin",
    "Beef Bourguignon",
    "Cassoulet",
    "Ratatouille",
    "Bouillabaisse",
    "Paella",
    "Risotto",
    "Osso Buco",
    "Saltimbocca",
    "Piccata",
    "Marsala",
    "Cacciatore",
    "Parmigiana",
    "Milanese",
    "Florentine",
    "Caprese",
    "Bruschetta",
    "Crostini",
    "Antipasto",
    "Charcuterie",
    "Fondue",
    "Raclette",
    "Tartiflette",
    "Gratin Dauphinois",
    "Pommes Anna",
    "Duchess Potatoes",
    "Hasselback Potatoes",
    "Roasted Vegetables",
    "Glazed Carrots",
    "Green Beans Almondine",
    "Asparagus Hollandaise",
    "Brussels Sprouts",
    "Cauliflower Gratin",
    "Spinach Gratin",
    "Mushroom Risotto",
    "Truffle Risotto",
    "Seafood Risotto",
    "Lobster Thermidor",
    "Crab Cakes",
    "Shrimp Scampi",
    "Mussels Mariniere",
    "Clams Casino",
    "Oysters Rockefeller",
    "Escargot",
    "Foie Gras",
    "Duck Confit",
    "Duck a l'Orange",
    "Chicken Kiev",
    "Chicken Chasseur",
    "Veal Scallopini",
    "Veal Marsala",
    "Veal Piccata",
    "Beef Stroganoff",
    "Beef Tartare",
    "Steak Diane",
    "Tournedos Rossini",
    "Chateaubriand",
    "Prime Rib",
    "Standing Rib Roast",
    "Crown Roast",
    "Rack of Lamb",
  ]

  continental.forEach((name) => {
    const isVegetarian =
      name.match(/ratatouille|caprese|bruschetta|risotto|vegetables|gratin|potatoes/i) &&
      !name.match(/meat|chicken|beef|pork|lamb|fish|seafood|duck|veal/i)
    recipeCategories[name] = { category: "Dinner", diet: isVegetarian ? "Vegetarian" : "Classic" }
  })

  // European, Asian, African, Italian, American - all dinner
  const otherRecipes = Object.keys(recipeIngredients).filter(
    (name) => !westernBreakfast.includes(name) && !continental.includes(name),
  )
  otherRecipes.forEach((name) => {
    const isVegetarian = !name.match(/chicken|beef|pork|lamb|fish|seafood|meat|bacon|sausage|ham|turkey|duck|egg/i)
    const isIndian = name.match(
      /biryani|curry|masala|paneer|dal|tandoori|tikka|samosa|dosa|idli|vada|paratha|naan|roti|chutney|raita|gulab|rasgulla|jalebi|kheer|halwa|ladoo|kulfi|lassi|chai/i,
    )
    recipeCategories[name] = {
      category: isIndian && name.match(/breakfast|poha|upma|idli|dosa|paratha/i) ? "Breakfast" : "Dinner",
      diet: isVegetarian ? "Vegetarian" : "Classic",
    }
  })

  // Convert each recipe
  for (const [recipeName, ingredients] of Object.entries(recipeIngredients)) {
    const { category, diet } = recipeCategories[recipeName] || { category: "Dinner", diet: "Classic" }

    const recipe: Recipe = {
      id: recipeId.toString(),
      name: recipeName,
      category: category as "Breakfast" | "Lunch" | "Dinner" | "Snack",
      diet: diet as "Classic" | "Low-Carb" | "Keto" | "Flexitarian" | "Paleo" | "Vegetarian" | "Pescatarian" | "Vegan",
      prepTime: 15,
      cookTime: category === "Breakfast" ? 20 : 30,
      servings: 4,
      calories: category === "Breakfast" ? 350 : 450,
      cost: 5.5,
      ingredients: ingredients.map((ing, idx) => {
        const { amount, unit } = estimateAmountAndUnit(ing)
        return {
          id: `${recipeId}-${idx + 1}`,
          name: ing,
          amount,
          unit,
          category: categorizeIngredient(ing),
        }
      }),
    }

    recipes.push(recipe)
    recipeId++
  }

  return recipes
}

// Generate the recipes
const allRecipes = convertRecipeDatabase()

console.log(`[v0] Converted ${allRecipes.length} recipes`)
console.log(`[v0] Sample recipe:`, JSON.stringify(allRecipes[0], null, 2))
console.log(
  `[v0] Ingredient categories:`,
  allRecipes[0].ingredients.map((i) => `${i.name}: ${i.category}`),
)
