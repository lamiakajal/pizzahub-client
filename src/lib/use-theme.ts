"use client";

import { useSyncExternalStore } from "react";
import type { Theme } from "@/lib/theme";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  // Dark is the default, so only an explicit "light" counts as light.
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

// Reads the theme that is currently applied to <html>.
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, () => "dark");
}
