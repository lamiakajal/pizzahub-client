"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { FieldError } from "@/components/auth/form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { ROLE_LABELS } from "@/lib/dashboard-nav";
import { validateDateOfBirth, validatePhone } from "@/lib/profile-rules";
import type { Role } from "@/lib/roles";
import { uploadImage } from "@/lib/upload";
import { validateImageFile, validateName } from "@/lib/validation";

type ProfileFormProps = {
  role: Role;
  initial: {
    name: string;
    email: string;
    image?: string | null;
    businessName?: string | null;
    phone?: string | null;
    dateOfBirth?: string | null;
    subscriptionPlan?: string | null;
  };
};

type FieldErrors = Partial<
  Record<"name" | "image" | "businessName" | "phone" | "dateOfBirth", string>
>;

function LockedField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        {label} <Lock className="size-3 text-muted-foreground" aria-hidden="true" />
      </Label>
      <Input id={id} value={value} disabled readOnly />
    </div>
  );
}

export function ProfileForm({ role, initial }: ProfileFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const dateOfBirth = String(form.get("dateOfBirth") ?? "").trim();
    const file = form.get("image");
    const imageFile = file instanceof File && file.size > 0 ? file : null;

    const nextErrors: FieldErrors = {};
    const nameError = validateName(name);
    const imageError = imageFile ? validateImageFile(imageFile) : null;
    const phoneError = validatePhone(phone);
    const dobError = validateDateOfBirth(dateOfBirth);
    if (nameError) nextErrors.name = nameError;
    if (imageError) nextErrors.image = imageError;
    if (phoneError) nextErrors.phone = phoneError;
    if (dobError) nextErrors.dateOfBirth = dobError;
    if (role === "vendor" && businessName.length > 80) {
      nextErrors.businessName = "Restaurant name must be 80 characters or fewer";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const image = imageFile ? await uploadImage(imageFile) : undefined;

      // Email, role and plan are never sent. The server ignores them anyway.
      const { error } = await authClient.updateUser({
        name,
        phone,
        dateOfBirth,
        ...(image ? { image } : {}),
        ...(role === "vendor" ? { businessName } : {}),
      });

      if (error) {
        toast.error(error.message ?? "Could not update your profile");
        return;
      }

      toast.success("Profile updated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={initial.image ?? undefined} alt={initial.name} />
          <AvatarFallback className="text-lg">
            {initial.name.slice(0, 1).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{initial.name}</p>
          <p className="text-sm text-muted-foreground">{ROLE_LABELS[role]} account</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={initial.name}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={initial.phone ?? ""}
            placeholder="+1 (555) 000-0000"
            aria-invalid={Boolean(errors.phone)}
          />
          <FieldError message={errors.phone} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of birth <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            autoComplete="bday"
            defaultValue={initial.dateOfBirth ?? ""}
            aria-invalid={Boolean(errors.dateOfBirth)}
          />
          <FieldError message={errors.dateOfBirth} />
        </div>

        {role === "vendor" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Restaurant Name</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={initial.businessName ?? ""}
              placeholder="e.g. Your Restaurant Name"
              aria-invalid={Boolean(errors.businessName)}
            />
            <FieldError message={errors.businessName} />
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
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
      </div>

      <div className="space-y-3 rounded-xl border border-dashed border-border p-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="size-4 text-muted-foreground" aria-hidden="true" />
          Account details you cannot change here
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <LockedField id="email" label="Email" value={initial.email} />
          <LockedField id="role" label="Role" value={ROLE_LABELS[role]} />
          {role === "vendor" && (
            <LockedField
              id="plan"
              label="Subscription plan"
              value={initial.subscriptionPlan === "premium" ? "Premium" : "Free"}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          These are managed by PizzaHub for your security. Vendors change plan from the
          Subscription page.
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <LoaderCircle className="animate-spin" />}
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
