"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/lib/use-theme";

export function Toaster(props: ToasterProps) {
  const theme = useTheme();

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
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
          "--width": "auto",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!shadow-lg !font-sans !gap-3 !px-4 !py-3.5 !text-sm !w-fit !min-w-[230px] !max-w-[350px]",
          title: "!text-sm !font-semibold",
          description: "!text-xs !text-muted-foreground",
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
