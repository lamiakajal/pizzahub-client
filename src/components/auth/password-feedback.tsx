"use client";

import { Check, Circle } from "lucide-react";
import { checkPassword, getPasswordStrength } from "@/lib/password-rules";
import { cn } from "@/lib/utils";

const LEVEL_STYLES = {
  weak: { bar: "bg-error", text: "text-error" },
  medium: { bar: "bg-warning", text: "text-foreground" },
  strong: { bar: "bg-success", text: "text-success" },
} as const;

// Live checklist and strength meter that sit under a password field.
export function PasswordFeedback({ password }: { password: string }) {
  const rules = checkPassword(password);
  const strength = getPasswordStrength(password);
  const styles = LEVEL_STYLES[strength.level];

  return (
    <div className="space-y-3 rounded-lg bg-surface-2 p-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          {password && <span className={cn("font-semibold", styles.text)}>{strength.label}</span>}
        </div>
        <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((segment) => (
            <span
              key={segment}
              className={cn(
                "h-1.5 rounded-full transition-colors",
                segment <= strength.score ? styles.bar : "bg-border"
              )}
            />
          ))}
        </div>
      </div>

      <ul className="space-y-1.5 text-xs" aria-label="Password requirements">
        {rules.map((rule) => (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-2 transition-colors",
              rule.ok ? "text-success" : "text-muted-foreground"
            )}
          >
            {rule.ok ? (
              <Check className="size-3.5 shrink-0" strokeWidth={3} />
            ) : (
              <Circle className="size-3.5 shrink-0" />
            )}
            <span>{rule.label}</span>
            <span className="sr-only">{rule.ok ? "(done)" : "(not yet)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
