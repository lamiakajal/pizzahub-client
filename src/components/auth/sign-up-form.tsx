"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";
import { FieldError, OrDivider } from "@/components/auth/form-field";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import type { SignupRole } from "@/lib/roles";
import { uploadImage } from "@/lib/upload";
import {
  validateEmail,
  validateImageFile,
  validateName,
  validatePassword,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: {
  value: SignupRole;
  title: string;
  hint: string;
  Icon: typeof Store;
}[] = [
  { value: "customer", title: "Customer", hint: "Order pizza", Icon: ShoppingBag },
  { value: "vendor", title: "Vendor", hint: "Restaurant owner", Icon: Store },
];

type FieldErrors = Partial<Record<"name" | "email" | "password" | "image", string>>;

export function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const file = form.get("image");
    const imageFile = file instanceof File && file.size > 0 ? file : null;

    const nextErrors: FieldErrors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const imageError = imageFile ? validateImageFile(imageFile) : null;
    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (imageError) nextErrors.image = imageError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      // The profile image is optional. Upload it first so we can save its URL.
      const image = imageFile ? await uploadImage(imageFile) : undefined;

      const { error } = await signUp.email({ name, email, password, image, role });
      if (error) {
        toast.error(error.message ?? "Could not create your account");
        return;
      }

      toast.success("Account created. Welcome to PizzaHub!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    // The chosen role travels through the OAuth flow and is applied on the server.
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      additionalData: { role },
    });
    if (error) {
      toast.error(error.message ?? "Google sign up failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium">I want to join as</legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account role">
            {ROLE_OPTIONS.map(({ value, title, hint, Icon }) => {
              const selected = role === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setRole(value)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    selected
                      ? "border-primary bg-surface-2"
                      : "border-border bg-surface hover:bg-surface-2"
                  )}
                >
                  <Icon className={cn("size-5", selected ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm font-semibold">{title}</span>
                  <span className="text-xs text-muted-foreground">{hint}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError message={errors.email} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="pr-10"
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use 6 or more characters with one uppercase and one lowercase letter.
          </p>
          <FieldError message={errors.password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">
            Profile Image <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-invalid={Boolean(errors.image)}
          />
          <FieldError message={errors.image} />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading || googleLoading}>
          {loading && <LoaderCircle className="animate-spin" />}
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <OrDivider />

      <GoogleButton
        label="Sign up with Google"
        loading={googleLoading}
        disabled={loading}
        onClick={handleGoogle}
      />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
