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
      duration={2800}
      visibleToasts={3}
      style={
        {
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--text)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--width": "320px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!shadow-lg !font-sans !gap-2.5 !px-3.5 !py-2.5 !text-[13px]",
          title: "!text-[13px] !font-semibold",
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
