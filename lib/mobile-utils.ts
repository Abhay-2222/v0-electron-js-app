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
 * Opens a URL in a mobile-friendly way that allows apps to intercept
 * On mobile: Uses window.location.href to allow app deep linking
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
