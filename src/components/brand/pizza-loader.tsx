import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = { sm: 40, md: 64, lg: 96 } as const;

// Branded loading indicator: a pizza slice that spins and bobs.
export function PizzaLoader({
  size = "md",
  label = "Loading",
  className,
}: {
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <Image
        src="/images/loader-icon.png"
        alt=""
        width={SIZES[size]}
        height={SIZES[size]}
        className="pizza-loader"
      />
      <p className="text-sm font-medium text-muted-foreground">{label}...</p>
    </div>
  );
}
