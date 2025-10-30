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

  buildDeepLink(url: string): string {
    try {
      const urlObj = new URL(url)
      // Extract the path and query from the web URL
      // Convert https://www.instacart.com/store/shopping_lists/123
      // to instacart://store/shopping_lists/123
      const path = urlObj.pathname + urlObj.search
      return `instacart:/${path}` // Note: single slash after scheme
    } catch {
      return `instacart://store`
    }
  }

  async openOnIOS(url: string): Promise<void> {
    const deepLink = this.buildDeepLink(url)

    console.log("[v0] iOS - Attempting to open Instacart app")
    console.log("[v0] Deep link:", deepLink)

    // Try deep link
    window.location.href = deepLink
  }

  async openOnAndroid(url: string): Promise<void> {
    const deepLink = this.buildDeepLink(url)

    console.log("[v0] Android - Attempting to open Instacart app")
    console.log("[v0] Deep link:", deepLink)

    // Try deep link first
    window.location.href = deepLink
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

// Helper function to build universal link
function buildUniversalLink(url: string): string {
  // The Instacart API returns URLs that work for both web and mobile
  // Converting to customers.instacart.com causes DNS errors since that domain doesn't exist
  console.log("[v0] Using Instacart URL as-is:", url)
  return url
}
