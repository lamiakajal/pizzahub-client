"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/lib/use-theme";

// Toasts use the same surface, border and text colors as the rest of the site,
// in both themes. Only the icon carries the success / error / warning color.
export function Toaster(props: ToasterProps) {
  const theme = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      closeButton
      style={
        {
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--text)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!shadow-lg !font-sans",
          title: "!font-semibold",
          description: "!text-muted-foreground",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-error",
          warning: "[&_[data-icon]]:!text-warning",
          info: "[&_[data-icon]]:!text-primary",
          closeButton: "!bg-surface !border-border !text-foreground",
        },
      }}
      {...props}
    />
  );
}
