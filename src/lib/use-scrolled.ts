"use client";

import { useSyncExternalStore } from "react";

const SCROLL_THRESHOLD = 24;

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

// True once the page has been scrolled a little from the top.
export function useScrolled() {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false
  );
}
