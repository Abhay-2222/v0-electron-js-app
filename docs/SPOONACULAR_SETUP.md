# Spoonacular API Integration Setup

This guide will help you set up the Spoonacular API integration to search for recipes, auto-generate grocery lists, and build an ingredient database.

## What is Spoonacular?

Spoonacular is a comprehensive food and recipe API that provides:
- 365,000+ recipes with detailed ingredients
- Nutrition information
- Ingredient parsing and categorization
- Cost estimation
- Diet and allergen filtering

## Getting Your API Key

### Step 1: Sign Up

1. Go to [Spoonacular Food API](https://spoonacular.com/food-api)
2. Click "Get Started" or "Sign Up"
3. Create a free account

### Step 2: Access Dashboard

1. Log in to your account
2. Navigate to [API Console Dashboard](https://spoonacular.com/food-api/console#Dashboard)
3. Your API key will be displayed on the dashboard

### Step 3: Choose Your Plan

**Free Tier (Recommended for Testing):**
- 50 points per day
- 1 recipe search = 1 point
- Perfect for development and testing
- No credit card required

**Paid Plans (For Production):**
- Mega: $49/month - 5,000 points/day
- Ultra: $149/month - 50,000 points/day
- Custom: Contact for enterprise needs

## Setup Instructions

### 1. Add API Key to Environment Variables

Add your Spoonacular API key to your environment variables:

\`\`\`env
SPOONACULAR_API_KEY=your_api_key_here
\`\`\`

### 2. Test the Integration

1. Open your meal planner app
2. Click "Add Meal" on any day
3. In the recipe selector, use the search bar
4. Click "Search Online" button
5. You should see recipes from Spoonacular API

## Features

### Recipe Search
- Search for any dish or cuisine
- Filter by meal type (breakfast, lunch, dinner, snack)
- Filter by diet (vegetarian, vegan, keto, etc.)
- Get detailed nutrition information

### Auto-Generated Grocery Lists
- Recipes from API include parsed ingredients
- Ingredients automatically added to grocery list
- Real-time cost estimation
- Categorized by aisle (produce, dairy, meat, etc.)

### Ingredient Database Building
- New ingredients from API recipes are tracked
- Builds your pantry options over time
- Learns your cooking patterns
- Suggests ingredients you commonly use

## API Limits & Best Practices

### Free Tier Limits
- 50 points/day = ~50 recipe searches
- Resets daily at midnight UTC
- No rollover of unused points

### Optimization Tips
1. **Cache Results**: Recipes are automatically saved to your local library
2. **Batch Searches**: Search once, browse multiple recipes
3. **Use Filters**: Narrow down results before searching
4. **Local First**: Check your saved recipes before searching online

## Troubleshooting

### "API key not configured" Error
- Make sure `SPOONACULAR_API_KEY` is set in your environment variables
- Restart your development server after adding the key

### "Failed to search recipes" Error
- Check if you've exceeded your daily point limit
- Verify your API key is correct
- Check your internet connection

### No Results Found
- Try broader search terms
- Remove diet/category filters
- Check if the API is responding (visit Spoonacular status page)

## Cost Management

### Monitoring Usage
- Check your dashboard at [Spoonacular Console](https://spoonacular.com/food-api/console#Dashboard)
- View daily point usage
- Set up usage alerts

### Staying Within Free Tier
- Limit searches to essential queries
- Use local recipe library when possible
- Cache API results (done automatically)
- Consider upgrading if you need more searches

## Support

- **Spoonacular Docs**: https://spoonacular.com/food-api/docs
- **API Status**: https://status.spoonacular.com
- **Support Email**: support@spoonacular.com

## Next Steps

Once set up, you can:
1. Search for any recipe worldwide
2. Automatically generate grocery lists
3. Build a comprehensive ingredient database
4. Track nutrition across all meals
5. Discover new cuisines and dishes
