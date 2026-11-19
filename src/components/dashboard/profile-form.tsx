"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { FieldError } from "@/components/auth/form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { ROLE_LABELS } from "@/lib/dashboard-nav";
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
  };
};

type FieldErrors = Partial<Record<"name" | "image" | "businessName", string>>;

export function ProfileForm({ role, initial }: ProfileFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();
    const file = form.get("image");
    const imageFile = file instanceof File && file.size > 0 ? file : null;

    const nextErrors: FieldErrors = {};
    const nameError = validateName(name);
    const imageError = imageFile ? validateImageFile(imageFile) : null;
    if (nameError) nextErrors.name = nameError;
    if (imageError) nextErrors.image = imageError;
    if (role === "vendor" && businessName.length > 80) {
      nextErrors.businessName = "Restaurant name must be 80 characters or fewer";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const image = imageFile ? await uploadImage(imageFile) : undefined;

      // Role and subscription fields are never sent. The server ignores them anyway.
      const { error } = await authClient.updateUser({
        name,
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={initial.email} disabled readOnly />
          <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
        </div>

        {role === "vendor" && (
          <div className="space-y-2 sm:col-span-2">
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

      <Button type="submit" disabled={loading}>
        {loading && <LoaderCircle className="animate-spin" />}
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
