import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  animated?: boolean;
  // Use on top of dark photos, where the theme text color would be unreadable.
  onDark?: boolean;
};

export function Logo({
  className,
  iconSize = 36,
  showText = true,
  animated = true,
  onDark = false,
}: LogoProps) {
  let index = 0;
  const brandParts = [
    { text: "Pizza", className: "text-primary" },
    { text: "Hub", className: onDark ? "text-white" : "text-foreground" },
  ];

  return (
    <span
      className={cn("inline-flex items-center gap-2 select-none", className)}
      aria-label="PizzaHub"
    >
      <Image
        src="/images/logo-icon.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className={cn("shrink-0", animated && "logo-icon")}
      />
      {showText && (
        <span
          aria-hidden="true"
          className="text-2xl leading-none font-extrabold tracking-tight"
        >
          {brandParts.map((part) => (
            <span key={part.text} className={part.className}>
              {part.text.split("").map((letter) => {
                const i = index++;
                return (
                  <span
                    key={i}
                    className={animated ? "logo-letter" : undefined}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {letter}
                  </span>
                );
              })}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
