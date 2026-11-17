"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

// Thin wrapper so every toast in the app shares the same defaults.
export function Toaster(props: ToasterProps) {
  return <Sonner className="toaster group" {...props} />;
}
