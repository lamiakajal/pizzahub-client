import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "border-border bg-surface-2 text-foreground",
  brand: "border-transparent bg-primary text-on-primary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/15 text-foreground",
  error: "border-error/30 bg-error/10 text-error",
  muted: "border-border bg-muted text-muted-foreground",
} as const;

export type BadgeVariant = keyof typeof VARIANTS;

export function Badge({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
