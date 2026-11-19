import { cn } from "@/lib/utils";

// Pill buttons that filter a list by status.
export function StatusFilter<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | "";
  options: { value: T | ""; label: string }[];
  onChange: (value: T | "") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "border-primary bg-primary text-on-primary"
              : "border-border bg-surface hover:bg-surface-2"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
