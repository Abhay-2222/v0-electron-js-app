/**
 * Calculate estimated cost for an ingredient based on name, amount, and unit
 * This is a simplified estimation - in a real app, you'd use actual pricing data
 */
export function calculateIngredientCost(name: string, amount: number, unit: string): number {
  // Base prices per unit (rough estimates in USD)
  const basePrices: Record<string, number> = {
    // Produce (per lb or unit)
    apple: 2.0,
    banana: 0.5,
    tomato: 3.0,
    onion: 1.5,
    garlic: 0.3,
    potato: 1.0,
    carrot: 1.5,
    lettuce: 2.5,
    spinach: 3.0,
    broccoli: 2.5,

    // Meat (per lb)
    chicken: 4.0,
    beef: 8.0,
    pork: 5.0,
    fish: 10.0,
    salmon: 12.0,

    // Dairy (per unit/lb)
    milk: 4.0,
    cheese: 6.0,
    butter: 5.0,
    yogurt: 4.0,
    cream: 5.0,

    // Pantry (per lb or unit)
    rice: 2.0,
    pasta: 2.0,
    flour: 3.0,
    sugar: 3.0,
    salt: 1.0,
    pepper: 5.0,
    oil: 8.0,

    // Default fallback
    default: 3.0,
  }

  // Normalize the ingredient name
  const normalizedName = name.toLowerCase().trim()

  // Find matching base price
  let basePrice = basePrices.default
  for (const [key, price] of Object.entries(basePrices)) {
    if (normalizedName.includes(key)) {
      basePrice = price
      break
    }
  }

  // Unit conversion factors (convert to standard unit for pricing)
  const unitFactors: Record<string, number> = {
    // Weight
    lb: 1.0,
    lbs: 1.0,
    pound: 1.0,
    pounds: 1.0,
    oz: 0.0625, // 1/16 of a pound
    ounce: 0.0625,
    ounces: 0.0625,
    g: 0.0022, // grams to pounds
    gram: 0.0022,
    grams: 0.0022,
    kg: 2.2, // kilograms to pounds
    kilogram: 2.2,
    kilograms: 2.2,

    // Volume (approximate to weight)
    cup: 0.5,
    cups: 0.5,
    tbsp: 0.03,
    tablespoon: 0.03,
    tablespoons: 0.03,
    tsp: 0.01,
    teaspoon: 0.01,
    teaspoons: 0.01,
    ml: 0.002,
    milliliter: 0.002,
    milliliters: 0.002,
    l: 2.0,
    liter: 2.0,
    liters: 2.0,

    // Count
    unit: 1.0,
    units: 1.0,
    piece: 1.0,
    pieces: 1.0,
    item: 1.0,
    items: 1.0,

    // Default
    default: 1.0,
  }

  const normalizedUnit = unit.toLowerCase().trim()
  const unitFactor = unitFactors[normalizedUnit] || unitFactors.default

  // Calculate estimated cost
  const estimatedCost = basePrice * amount * unitFactor

  // Round to 2 decimal places and ensure minimum of $0.10
  return Math.max(0.1, Math.round(estimatedCost * 100) / 100)
}
