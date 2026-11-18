import { cn } from "@/lib/utils";

// Small helpers shared by the sign in and sign up forms.

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs font-medium text-error">
      {message}
    </p>
  );
}

export function OrDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)}>
      <span className="h-px flex-1 bg-border" />
      or
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
