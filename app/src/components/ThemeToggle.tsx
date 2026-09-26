"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * Subscribe to `data-theme` changes on <html>. Uses a MutationObserver so any
 * code that flips the attribute (this component, the boot script in layout.tsx,
 * a future per-page override) re-renders consumers without manual setState.
 */
const themeSubscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => obs.disconnect();
};

const getThemeSnapshot = (): Theme =>
  typeof document !== "undefined" && document.documentElement.dataset.theme === "dark"
    ? "dark"
    : "light";

const mountSubscribe = () => () => {};

/** Round icon button that flips light/dark and remembers the choice. */
export const ThemeToggle = () => {
  const mounted = useSyncExternalStore(
    mountSubscribe,
    () => true,
    () => false
  );
  const theme = useSyncExternalStore(themeSubscribe, getThemeSnapshot, () => "light" as Theme);

  // Don't render until mounted so SSR markup matches the client's first paint.
  if (!mounted) return null;

  const isDark = theme === "dark";
  const toggle = () => {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("pb-theme", next);
    } catch {
      /* private mode */
    }
  };

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button type="button" onClick={toggle} className="pb-lg-iconbtn" aria-label={label}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
};
