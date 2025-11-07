# Instacart OAuth Account Connection Guide

This guide explains how to set up OAuth 2.0 to allow users to connect their personal Instacart accounts.

## Overview

There are two ways to integrate with Instacart:

1. **IDP API** (Currently Active)
   - Creates anonymous shopping lists
   - No account connection required
   - Users manually add items to cart on Instacart
   - Already working with `INSTACART_API_KEY`

2. **OAuth Connect API** (Account Connection)
   - Links user's personal Instacart account
   - Places orders directly to their account
   - Access to saved stores, payment methods
   - Requires OAuth credentials

## Setting Up OAuth

### Step 1: Configure in Instacart Developer Portal

1. Log in to [Instacart Developer Platform](https://www.instacart.com/developer)
2. Navigate to your app
3. Go to OAuth/API settings
4. Click "Create OAuth Application"

### Step 2: Get Your Credentials

You'll receive:
- **Client ID** (public, safe for frontend)
- **Client Secret** (private, server-side only)

### Step 3: Set Redirect URIs

Add these authorized redirect URIs in Instacart:

**Development:**
\`\`\`
http://localhost:3000/api/instacart/oauth/callback
\`\`\`

**Production:**
\`\`\`
https://your-app.vercel.app/api/instacart/oauth/callback
\`\`\`

### Step 4: Add Environment Variables

Add to your `.env.local` (development) or Vercel (production):

\`\`\`bash
# Existing IDP API Key
INSTACART_API_KEY=your_existing_api_key

# New OAuth Credentials
NEXT_PUBLIC_INSTACART_CLIENT_ID=your_client_id_here
INSTACART_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_INSTACART_REDIRECT_URI=http://localhost:3000/api/instacart/oauth/callback
\`\`\`

For production, update the redirect URI:
\`\`\`bash
NEXT_PUBLIC_INSTACART_REDIRECT_URI=https://your-app.vercel.app/api/instacart/oauth/callback
\`\`\`

### Step 5: Test the Connection

1. Start your app: `npm run dev`
2. Go to Settings tab
3. Under Profile section, click **"Connect Instacart Account"**
4. You'll be redirected to Instacart login
5. Log in with your Instacart credentials
6. Authorize the app
7. You'll be redirected back with connected status

## User Flow

### Connecting Account

\`\`\`
User clicks "Connect Instacart Account"
    ↓
Redirects to Instacart OAuth page
    ↓
User logs in to Instacart
    ↓
User authorizes app permissions
    ↓
Instacart redirects to /api/instacart/oauth/callback
    ↓
App exchanges authorization code for access token
    ↓
Token stored in localStorage
    ↓
Button shows "Disconnect Instacart"
\`\`\`

### Using Connected Account

With a connected account, your app can:

1. **Place Orders Directly**
   - Use `/api/instacart/connect/create-order` endpoint
   - Order goes to user's actual Instacart account
   - Uses their saved payment method and delivery address

2. **Access User Data**
   - Get user's preferred stores
   - Retrieve order history
   - Access saved addresses

3. **Better UX**
   - One-click checkout
   - No manual cart transfer
   - Order confirmation in app

## OAuth Scopes

The app requests these permissions:
- `delivery_orders:write` - Create and place orders
- `delivery_orders:read` - Read order history and status

## Security

- **Client Secret** is never exposed to frontend
- **Access tokens** stored securely in localStorage
- **Token expiration** automatically handled (1 hour typically)
- **Logout** clears all stored credentials
- **CSRF protection** via state parameter

## Troubleshooting

### "Client ID not configured" error
- Check `NEXT_PUBLIC_INSTACART_CLIENT_ID` is set
- Restart dev server after adding env vars

### "Redirect URI mismatch" error
- Verify redirect URI in code matches Instacart portal exactly
- Check for trailing slashes (they matter!)
- Ensure http vs https matches

### "Invalid client credentials" error
- Double-check `INSTACART_CLIENT_SECRET` value
- Ensure no extra spaces in env var

### Token expires too quickly
- Tokens typically last 1 hour
- App automatically handles expiration
- Implement refresh token flow for longer sessions

## Production Checklist

Before going live:

- [ ] OAuth app approved by Instacart
- [ ] Production credentials obtained
- [ ] Redirect URIs updated to production domain
- [ ] Environment variables set in Vercel
- [ ] Privacy policy includes Instacart data usage
- [ ] Terms of service mentions third-party integration
- [ ] Error handling for auth failures
- [ ] User-friendly disconnect flow

## Alternative: Keep Using IDP API

If OAuth setup is too complex, you can continue using the existing IDP API:

**Pros:**
- Already working
- No account connection needed
- Simpler setup

**Cons:**
- Users manually add items on Instacart
- No access to user preferences
- Can't place orders directly

The choice depends on your desired user experience!
