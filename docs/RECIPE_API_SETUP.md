# Recipe API Setup

This app uses **TheMealDB API** for searching recipes online - it's completely free and requires no API key! For better search results and support for any cuisine, you can optionally add **OpenAI API** integration.

## Quick Start (No Setup Required)

TheMealDB works out of the box with no configuration needed. Just click "Search Online" and start finding recipes!

## Optional: OpenAI Integration (Recommended)

For significantly better search results, add OpenAI API support:

### Why Use OpenAI?

- **Better Search Understanding**: Understands queries like "healthy chicken dinner" or "quick breakfast"
- **Any Cuisine**: Full support for Indian, Asian, Middle Eastern, and all world cuisines
- **Recipe Generation**: Creates recipes for dishes not in TheMealDB (like "dal makhni", "bhindi masala")
- **Accurate Ingredients**: Better ingredient parsing and measurements
- **Smart Suggestions**: Understands dietary preferences and meal types

### Setup Steps

1. **Get API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Add to Environment**:
   - Go to the **Vars** section in the v0 sidebar
   - Add: `OPENAI_API_KEY` = `your_api_key_here`
   - Save changes

3. **Cost**: 
   - OpenAI charges per request (~$0.001-0.01 per search)
   - Free tier includes $5 credit for new accounts
   - Very affordable for personal use

### How It Works

When you search for a recipe:
1. If OpenAI API key is set → Uses OpenAI for intelligent search
2. If no OpenAI key → Falls back to TheMealDB (still works great!)

## Features

- Search thousands of recipes from around the world
- Automatic ingredient parsing and grocery list generation
- Save API recipes to your local library
- Build ingredient database over time
- Smart fallback system (OpenAI → TheMealDB)

## How It Works

1. **Search Online**: Click the "Search Online" button in the recipe selector
2. **Find Recipes**: Search for any dish (e.g., "chicken curry", "pasta", "dal makhni")
3. **Auto-Save**: Selected recipes are automatically saved to your local library
4. **Grocery Lists**: Ingredients are automatically added to your grocery list
5. **Pantry Tracking**: New ingredients are tracked for pantry management

## API Details

### TheMealDB (Default - Free)
- **Provider**: TheMealDB (www.themealdb.com)
- **Cost**: Completely free
- **API Key**: Not required
- **Rate Limits**: None for basic usage
- **Recipe Count**: 280+ recipes with more added regularly
- **Best For**: Western and international cuisines

### OpenAI (Optional - Paid)
- **Provider**: OpenAI (platform.openai.com)
- **Cost**: ~$0.001-0.01 per search
- **API Key**: Required
- **Rate Limits**: Based on your plan
- **Recipe Count**: Unlimited (generates recipes)
- **Best For**: Any cuisine, custom recipes, intelligent search

## Usage Tips

- Search by dish name (e.g., "spaghetti", "dal makhni", "pad thai")
- Try international cuisines (e.g., "indian curry", "mexican tacos")
- Search by main ingredient (e.g., "chicken", "paneer", "tofu")
- Use descriptive queries with OpenAI (e.g., "healthy vegetarian dinner under 30 minutes")
- All found recipes are automatically formatted to match your app's structure

## Troubleshooting

**No results found?**
- TheMealDB has limited coverage for some cuisines (especially Indian, Asian)
- Add OpenAI API key for better results
- Try simpler search terms (e.g., "chicken" instead of "chicken tikka masala")

**OpenAI not working?**
- Check that `OPENAI_API_KEY` is set in environment variables
- Verify the API key is valid and has credits
- Check browser console for error messages

For now, TheMealDB provides a great free option to get started, and OpenAI takes it to the next level!
