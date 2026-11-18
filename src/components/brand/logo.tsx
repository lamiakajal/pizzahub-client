import { cn } from "@/lib/utils";

type PizzaIconProps = {
  size?: number;
  animated?: boolean;
  className?: string;
};

// Colors come from the design tokens so the icon follows light and dark themes.
export function PizzaIcon({ size = 36, animated = true, className }: PizzaIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn(animated && "logo-icon", className)}
    >
      {/* crust */}
      <circle
        cx="32"
        cy="32"
        r="30"
        className="fill-action"
        style={{ stroke: "color-mix(in srgb, var(--accent) 65%, black)" }}
        strokeWidth="1.5"
      />
      {/* cheese */}
      <circle cx="32" cy="32" r="24.5" className="fill-warning" />
      {/* slice lines */}
      <g
        strokeWidth="1.2"
        strokeLinecap="round"
        style={{ stroke: "color-mix(in srgb, var(--accent) 80%, black)" }}
        opacity="0.55"
      >
        <line x1="32" y1="7.5" x2="32" y2="56.5" />
        <line x1="7.5" y1="32" x2="56.5" y2="32" />
        <line x1="14.7" y1="14.7" x2="49.3" y2="49.3" />
        <line x1="49.3" y1="14.7" x2="14.7" y2="49.3" />
      </g>
      {/* pepperoni */}
      <g className="fill-primary">
        <circle cx="24" cy="22" r="4.6" />
        <circle cx="41" cy="25" r="4.2" />
        <circle cx="22" cy="39" r="4.4" />
        <circle cx="36" cy="41" r="4.6" />
        <circle cx="45" cy="40" r="3.4" />
        <circle cx="32" cy="14.5" r="3.2" />
      </g>
      {/* basil */}
      <g className="fill-success">
        <ellipse cx="31" cy="29.5" rx="3.6" ry="1.9" transform="rotate(-30 31 29.5)" />
        <ellipse cx="14.5" cy="31" rx="3" ry="1.6" transform="rotate(35 14.5 31)" />
        <ellipse cx="49.5" cy="31.5" rx="3" ry="1.6" transform="rotate(-40 49.5 31.5)" />
      </g>
    </svg>
  );
}

type LogoProps = {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  animated?: boolean;
};

const BRAND_PARTS = [
  { text: "Pizza", className: "text-primary" },
  { text: "Hub", className: "text-foreground" },
];

export function Logo({
  className,
  iconSize = 36,
  showText = true,
  animated = true,
}: LogoProps) {
  let index = 0;

  return (
    <span
      className={cn("inline-flex items-center gap-2 select-none", className)}
      aria-label="PizzaHub"
    >
      <PizzaIcon size={iconSize} animated={animated} />
      {showText && (
        <span
          aria-hidden="true"
          className="text-2xl leading-none font-extrabold tracking-tight"
        >
          {BRAND_PARTS.map((part) => (
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
