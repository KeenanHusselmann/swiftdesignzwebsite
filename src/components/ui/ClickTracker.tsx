"use client";

import { useEffect } from "react";

/**
 * Attaches a single document-level click listener that tracks every
 * button and link click across the whole site via GA4.
 * No need to manually add onClick to individual components.
 */
export default function ClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeof window === "undefined" || typeof window.gtag !== "function") return;

      // Walk up the DOM from the clicked element to find the nearest a or button
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        const tag = el.tagName.toLowerCase();
        if (tag === "a" || tag === "button") {
          // Build a human-readable label
          const label =
            el.getAttribute("aria-label") ||
            el.getAttribute("data-track") ||
            el.textContent?.trim().slice(0, 60) ||
            el.getAttribute("href") ||
            tag;

          // Category = page path + element type
          const category = `${window.location.pathname} / ${tag}`;

          window.gtag("event", "click", {
            event_category: category,
            event_label: label,
          });

          break;
        }
        el = el.parentElement;
      }
    }

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
