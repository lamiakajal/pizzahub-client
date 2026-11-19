"use client";

import { useEffect, useState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { FieldError } from "@/components/auth/form-field";
import { PasswordFeedback } from "@/components/auth/password-feedback";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { validatePassword } from "@/lib/validation";

type FieldErrors = Partial<Record<"current" | "next" | "confirm", string>>;

// Only accounts that sign in with a password have one to change.
// Google-only accounts see a short note instead.
export function ChangePasswordForm() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    authClient
      .listAccounts()
      .then(({ data }) => {
        if (!cancelled) {
          setHasPassword(Boolean(data?.some((account) => account.providerId === "credential")));
        }
      })
      // If the list cannot load, show the form. The server still checks everything.
      .catch(() => !cancelled && setHasPassword(true));

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const current = String(form.get("currentPassword") ?? "");
    const next = String(form.get("newPassword") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");

    const nextErrors: FieldErrors = {};
    if (!current) nextErrors.current = "Enter your current password";
    const rule = validatePassword(next);
    if (rule) nextErrors.next = rule;
    else if (next === current) nextErrors.next = "Choose a password different from the current one";
    if (confirm !== next) nextErrors.confirm = "Passwords do not match";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message ?? "Could not change your password");
        return;
      }

      toast.success("Password changed. Other devices have been signed out.");
      formElement.reset();
      setNewPassword("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (hasPassword === null) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" aria-busy="true" />;
  }

  if (!hasPassword) {
    return (
      <p className="text-sm text-muted-foreground">
        You signed in with Google, so there is no PizzaHub password to change. Manage your
        password from your Google account.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.current)}
        />
        <FieldError message={errors.current} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          aria-invalid={Boolean(errors.next)}
        />
        <PasswordFeedback password={newPassword} />
        <FieldError message={errors.next} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirm)}
        />
        <FieldError message={errors.confirm} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="animate-spin" /> : <KeyRound />}
        {loading ? "Updating..." : "Change Password"}
      </Button>
    </form>
  );
}
