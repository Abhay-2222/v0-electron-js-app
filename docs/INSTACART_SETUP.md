# Instacart Integration Setup Guide

This guide will help you set up the Instacart Developer Platform API integration for your meal planner app.

## Overview

The app uses the **Instacart Developer Platform API** to create shoppable grocery lists. When users click "Order on Instacart", their unchecked grocery items are sent to Instacart, creating a shopping list that opens in a new tab where they can select a store and checkout.

## Getting Started

### 1. Create an Instacart Developer Account

1. Visit [Instacart Developer Platform](https://www.instacart.com/developer)
2. Sign up for a developer account
3. Complete the registration process

### 2. Get Your Sandbox API Key

For development and testing:

1. Log in to your Instacart Developer account
2. Navigate to the API Keys section
3. Generate a **Sandbox API Key** for testing
4. Copy the API key

### 3. Configure Environment Variables

Add your API key to your environment variables:

\`\`\`bash
# For local development, create a .env.local file
INSTACART_API_KEY=your_sandbox_api_key_here
\`\`\`

For Vercel deployment:
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `INSTACART_API_KEY` with your sandbox key

### 4. Testing in Sandbox Mode

The sandbox environment allows you to:
- Test the shopping list creation flow
- Verify item formatting and API responses
- Debug integration issues without affecting real orders

**Note:** Sandbox orders won't create real Instacart orders or charge customers.

## API Endpoints Used

### Create Shopping List
- **Endpoint:** `POST /idp/v1/products/products_link`
- **Purpose:** Creates a shopping list URL from line items
- **Response:** Returns a URL to the Instacart shopping list page

## How It Works

1. User clicks "Order on Instacart" button in the Grocery tab
2. App sends unchecked grocery items to `/api/instacart/create-list`
3. API route formats items and calls Instacart API
4. Instacart returns a shopping list URL
5. URL opens in new tab, showing items ready to add to cart
6. User selects store, adds items, and proceeds to checkout on Instacart

## Production Deployment

When ready to go live:

1. Complete your app in the Instacart Developer Portal
2. Submit for review and approval
3. Request a **Production API Key**
4. Replace sandbox key with production key in environment variables
5. Test thoroughly before launching

## Troubleshooting

### "API key not configured" error
- Ensure `INSTACART_API_KEY` is set in your environment variables
- Restart your development server after adding the key

### "Failed to create shopping list" error
- Check that your API key is valid and not expired
- Verify you're using the correct API endpoint
- Check the browser console for detailed error messages

### Items not appearing correctly
- Ensure items have valid `name`, `quantity`, and `unit` fields
- Check that quantities are positive numbers
- Verify unit strings are recognized (e.g., "lb", "oz", "count")

## API Rate Limits

Sandbox environment:
- 100 requests per minute
- 1000 requests per day

Production environment:
- Contact Instacart for production rate limits

## Support

For API issues or questions:
- Visit [Instacart Developer Documentation](https://docs.instacart.com)
- Contact Instacart Developer Support
- Check the [Developer Community Forum](https://community.instacart.com)
