"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/lib/use-theme";

// Thin wrapper so every toast shares the same defaults and follows the site theme.
export function Toaster(props: ToasterProps) {
  const theme = useTheme();
  return <Sonner theme={theme} className="toaster group" {...props} />;
}
