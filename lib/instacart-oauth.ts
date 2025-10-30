// Instacart OAuth 2.0 authentication utilities

interface InstacartTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  created_at: number
}

interface InstacartTokenData {
  accessToken: string
  expiresAt: number
  scope: string
}

const INSTACART_AUTH_URL = "https://connect.instacart.com/oauth/authorize"
const INSTACART_TOKEN_URL = "https://connect.instacart.com/v2/oauth/token"
const TOKEN_STORAGE_KEY = "instacart_oauth_token"

export class InstacartOAuth {
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_INSTACART_CLIENT_ID || ""
    this.clientSecret = process.env.INSTACART_CLIENT_SECRET || ""
    this.redirectUri = process.env.NEXT_PUBLIC_INSTACART_REDIRECT_URI || ""
  }

  /**
   * Generate the OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "delivery_orders:write delivery_orders:read",
      state: state || this.generateState(),
    })

    return `${INSTACART_AUTH_URL}?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<InstacartTokenData> {
    const response = await fetch(INSTACART_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.statusText}`)
    }

    const data: InstacartTokenResponse = await response.json()

    const tokenData: InstacartTokenData = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      scope: data.scope,
    }

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData))
    }

    return tokenData
  }

  /**
   * Get stored access token if valid
   */
  getStoredToken(): InstacartTokenData | null {
    if (typeof window === "undefined") {
      return null
    }

    const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!stored) {
      return null
    }

    try {
      const tokenData: InstacartTokenData = JSON.parse(stored)

      // Check if token is expired (with 5 minute buffer)
      if (Date.now() >= tokenData.expiresAt - 5 * 60 * 1000) {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        return null
      }

      return tokenData
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getStoredToken() !== null
  }

  /**
   * Clear stored token (logout)
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  /**
   * Generate a random state parameter for CSRF protection
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}

// Singleton instance
export const instacartOAuth = new InstacartOAuth()
