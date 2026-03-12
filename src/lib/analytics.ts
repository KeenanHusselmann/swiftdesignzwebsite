declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fire a GA4 custom event.
 * Silently no-ops if GA4 hasn't been loaded (e.g. NEXT_PUBLIC_GA_ID not set).
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}
