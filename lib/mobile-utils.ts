/**
 * Utility functions for mobile device detection and app deep linking
 */

/**
 * Detects if the user is on a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detects if the user is on iOS
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * Detects if the user is on Android
 */
export function isAndroid(): boolean {
  if (typeof window === "undefined") return false
  return /Android/i.test(navigator.userAgent)
}

/**
 * Opens a URL in a mobile-friendly way that allows apps to intercept
 * On mobile: Uses window.location.href to allow the OS to intercept
 * and open the native app if installed (universal links/app links)
 * On desktop: Opens in a new tab
 */
export function openMobileFriendlyURL(url: string) {
  if (isMobileDevice()) {
    // On mobile, navigate in the same window to allow the OS to intercept
    // and open the native app if installed (universal links/app links)
    window.location.href = url
  } else {
    // On desktop, open in a new tab
    window.open(url, "_blank")
  }
}

/**
 * Attempts to open a deep link with fallback to web URL
 * Useful for apps that support custom URL schemes
 */
export function openDeepLinkWithFallback(deepLink: string, webUrl: string, timeout = 2000) {
  if (!isMobileDevice()) {
    // On desktop, just open the web URL
    window.open(webUrl, "_blank")
    return
  }

  // Try to open the deep link
  const start = Date.now()
  window.location.href = deepLink

  // Set a timeout to fallback to web URL if app didn't open
  setTimeout(() => {
    // If we're still on the page after timeout, the app probably didn't open
    if (Date.now() - start < timeout + 100) {
      window.location.href = webUrl
    }
  }, timeout)
}

interface PlatformInfo {
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  isDesktop: boolean
  isInAppBrowser: boolean
  isSafari: boolean
  isChrome: boolean
  isFirefox: boolean
}

class InstacartDeepLinker {
  private config = {
    iosAppStoreId: "545599256",
    androidPackage: "com.instacart.client",
    urlScheme: "instacart://",
    universalLinkDomain: "www.instacart.com",
    timeout: 2500,
  }

  detectPlatform(): PlatformInfo {
    if (typeof window === "undefined") {
      return {
        isIOS: false,
        isAndroid: false,
        isMobile: false,
        isDesktop: true,
        isInAppBrowser: false,
        isSafari: false,
        isChrome: false,
        isFirefox: false,
      }
    }

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera

    // Detailed iOS detection (including iPad on iOS 13+)
    const isIOS =
      (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

    // Android detection
    const isAndroid = /android/i.test(ua)

    // Check if in-app browser (Facebook, Instagram, etc.)
    const isInAppBrowser = /FBAN|FBAV|Instagram/i.test(ua)

    // Mobile check
    const isMobile = isIOS || isAndroid

    return {
      isIOS,
      isAndroid,
      isMobile,
      isDesktop: !isMobile,
      isInAppBrowser,
      // Specific browser detection
      isSafari: /^((?!chrome|android).)*safari/i.test(ua),
      isChrome: /chrome/i.test(ua) && !/edge/i.test(ua),
      isFirefox: /firefox/i.test(ua),
    }
  }

  buildUniversalLink(url: string): string {
    // The Instacart API returns URLs that work for both web and mobile
    // Converting to customers.instacart.com causes DNS errors since that domain doesn't exist
    console.log("[v0] Using Instacart URL as-is:", url)
    return url
  }

  buildURLScheme(url: string): string {
    // Extract path from URL and build custom scheme
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname + urlObj.search
      return `${this.config.urlScheme}${path.replace(/^\//, "")}`
    } catch {
      return `${this.config.urlScheme}checkout`
    }
  }

  buildAndroidIntent(universalLink: string): string {
    const { androidPackage } = this.config
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${androidPackage}`

    // Remove https:// from universal link
    const intentPath = universalLink.replace(/^https?:\/\//, "")

    return (
      `intent://${intentPath}#Intent;` +
      `scheme=https;` +
      `package=${androidPackage};` +
      `S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};` +
      `end`
    )
  }

  openAppStore(platform: "ios" | "android") {
    if (platform === "ios") {
      const appStoreUrl = `https://apps.apple.com/us/app/instacart/id${this.config.iosAppStoreId}`
      window.location.href = appStoreUrl
    } else if (platform === "android") {
      const playStoreUrl = `https://play.google.com/store/apps/details?id=${this.config.androidPackage}`
      window.location.href = playStoreUrl
    }
  }

  async openOnIOS(url: string): Promise<void> {
    const platform = this.detectPlatform()
    const universalLink = this.buildUniversalLink(url)

    console.log("[v0] iOS deep linking - Universal Link:", universalLink)

    // Track if user left the page (app opened)
    let appOpened = false
    const handleVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true
        console.log("[v0] User left page - app likely opened")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Method 1: Try Universal Link first (works best in Safari)
    if (platform.isSafari) {
      console.log("[v0] Safari detected - using Universal Link directly")
      window.location.href = universalLink

      // Fallback to App Store if app didn't open
      setTimeout(() => {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        if (!appOpened && !document.hidden) {
          console.log("[v0] App didn't open - redirecting to App Store")
          this.openAppStore("ios")
        }
      }, this.config.timeout)

      return
    }

    // Method 2: Try custom URL scheme with iframe (for other browsers)
    console.log("[v0] Non-Safari browser - trying URL scheme with iframe")
    const urlScheme = this.buildURLScheme(url)
    console.log("[v0] URL Scheme:", urlScheme)

    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    iframe.src = urlScheme
    document.body.appendChild(iframe)

    // Cleanup and fallback
    setTimeout(() => {
      document.body.removeChild(iframe)
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      // If user is still on page, app didn't open
      if (!appOpened && document.hasFocus()) {
        console.log("[v0] URL scheme failed - trying Universal Link")
        window.location.href = universalLink

        // Final fallback to App Store
        setTimeout(() => {
          if (!document.hidden) {
            console.log("[v0] Universal Link failed - redirecting to App Store")
            this.openAppStore("ios")
          }
        }, this.config.timeout)
      }
    }, 1500)
  }

  async openOnAndroid(url: string): Promise<void> {
    const universalLink = this.buildUniversalLink(url)
    const intentUrl = this.buildAndroidIntent(universalLink)

    console.log("[v0] Android deep linking - Intent URL:", intentUrl)

    try {
      window.location.href = intentUrl
    } catch (e) {
      console.error("[v0] Intent URL failed:", e)
      // Fallback to Play Store
      this.openAppStore("android")
    }
  }

  openWeb(url: string): void {
    const universalLink = this.buildUniversalLink(url)
    console.log("[v0] Desktop - opening in new tab:", universalLink)
    window.open(universalLink, "_blank", "noopener,noreferrer")
  }

  async openInstacart(url: string): Promise<void> {
    const platform = this.detectPlatform()

    console.log("[v0] Opening Instacart with platform:", {
      isIOS: platform.isIOS,
      isAndroid: platform.isAndroid,
      isMobile: platform.isMobile,
      isDesktop: platform.isDesktop,
      isSafari: platform.isSafari,
      isChrome: platform.isChrome,
      isInAppBrowser: platform.isInAppBrowser,
    })

    if (platform.isDesktop) {
      return this.openWeb(url)
    }

    if (platform.isIOS) {
      return this.openOnIOS(url)
    }

    if (platform.isAndroid) {
      return this.openOnAndroid(url)
    }

    // Fallback
    console.log("[v0] Unknown platform - using fallback")
    window.location.href = this.buildUniversalLink(url)
  }
}

// Create singleton instance
const deepLinker = new InstacartDeepLinker()

/**
 * Opens an Instacart URL with robust mobile deep linking support
 * Automatically detects platform and uses the best method to open the native app
 *
 * @param url - The Instacart web URL (e.g., https://www.instacart.com/store/shopping_lists/123)
 */
export function openInstacartURL(url: string): void {
  deepLinker.openInstacart(url)
}
