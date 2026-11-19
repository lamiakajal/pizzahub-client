"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
import { FieldError } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ApiRequestError } from "@/lib/api";
import { apiRequest, errorMessage } from "@/lib/api-client";
import { MAX_MENU_IMAGES, MENU_CATEGORIES, type MenuItem } from "@/lib/menu";
import { uploadImage } from "@/lib/upload";
import { validateImageFile } from "@/lib/validation";

type FormValues = {
  itemName: string;
  category: string;
  description: string;
  price: string;
  location: string;
};

type FieldErrors = Partial<Record<keyof FormValues | "images", string>>;
type NewImage = { file: File; preview: string };

type MenuItemFormProps = {
  mode: "create" | "edit";
  itemId?: string;
  initial?: MenuItem;
};

export function MenuItemForm({ mode, itemId, initial }: MenuItemFormProps) {
  const router = useRouter();
  const [existing, setExisting] = useState<string[]>(initial?.images ?? []);
  const [added, setAdded] = useState<NewImage[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addedRef = useRef<NewImage[]>([]);

  // Free the temporary preview URLs when the form closes.
  useEffect(() => {
    return () => addedRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
  }, []);

  function updateAdded(next: NewImage[]) {
    addedRef.current = next;
    setAdded(next);
  }

  const totalImages = existing.length + added.length;

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";

    let message: string | undefined;
    const accepted: NewImage[] = [];

    for (const file of picked) {
      if (totalImages + accepted.length >= MAX_MENU_IMAGES) {
        message = `You can add up to ${MAX_MENU_IMAGES} images`;
        break;
      }
      const problem = validateImageFile(file);
      if (problem) {
        message = problem;
        continue;
      }
      accepted.push({ file, preview: URL.createObjectURL(file) });
    }

    updateAdded([...addedRef.current, ...accepted]);
    setErrors((current) => ({ ...current, images: message }));
  }

  function removeAdded(index: number) {
    const next = [...addedRef.current];
    const [removed] = next.splice(index, 1);
    if (removed) URL.revokeObjectURL(removed.preview);
    updateAdded(next);
  }

  function readValues(form: FormData): FormValues {
    const text = (key: keyof FormValues) => String(form.get(key) ?? "").trim();
    return {
      itemName: text("itemName"),
      category: text("category"),
      description: text("description"),
      price: text("price"),
      location: text("location"),
    };
  }

  function validate(values: FormValues): FieldErrors {
    const next: FieldErrors = {};
    if (values.itemName.length < 2 || values.itemName.length > 80) {
      next.itemName = "Item name must be 2 to 80 characters";
    }
    if (!MENU_CATEGORIES.includes(values.category as (typeof MENU_CATEGORIES)[number])) {
      next.category = "Please choose a category";
    }
    if (values.description.length < 10 || values.description.length > 1000) {
      next.description = "Description must be 10 to 1000 characters";
    }
    const price = Number(values.price);
    if (!values.price || !Number.isFinite(price) || price <= 0 || price > 10000) {
      next.price = "Enter a price above 0 and up to 10000";
    }
    if (values.location.length < 2 || values.location.length > 100) {
      next.location = "Location must be 2 to 100 characters";
    }
    if (totalImages < 1) {
      next.images = "Add at least one image of the item";
    }
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = readValues(new FormData(event.currentTarget));
    const nextErrors = validate(values);

    setErrors(nextErrors);
    setLimitMessage(null);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const uploaded = await Promise.all(added.map((image) => uploadImage(image.file)));

      const body = {
        itemName: values.itemName,
        category: values.category,
        description: values.description,
        price: Number(values.price),
        location: values.location,
        images: [...existing, ...uploaded],
      };

      if (mode === "create") {
        await apiRequest("/api/vendor/menu-items", { method: "POST", body });
        toast.success("Menu item submitted. It will appear after an admin approves it.");
      } else {
        await apiRequest(`/api/vendor/menu-items/${itemId}`, { method: "PATCH", body });
        toast.success("Menu item updated");
      }

      router.push("/dashboard/vendor/menu-items");
      router.refresh();
    } catch (error) {
      const message = errorMessage(error);
      if (error instanceof ApiRequestError && error.status === 403) {
        setLimitMessage(message);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {limitMessage && (
        <Card className="border-warning/50 bg-warning/10">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {limitMessage}
            </p>
            <Button asChild size="sm">
              <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              name="itemName"
              defaultValue={initial?.itemName}
              placeholder="e.g. Smoky Pepperoni"
              aria-invalid={Boolean(errors.itemName)}
            />
            <FieldError message={errors.itemName} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <NativeSelect
              id="category"
              name="category"
              defaultValue={initial?.category ?? ""}
              aria-invalid={Boolean(errors.category)}
            >
              <option value="" disabled>
                Choose a category
              </option>
              {MENU_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </NativeSelect>
            <FieldError message={errors.category} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initial?.description}
              placeholder="Describe the toppings, size and taste"
              aria-invalid={Boolean(errors.description)}
            />
            <FieldError message={errors.description} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              defaultValue={initial?.price}
              placeholder="12.99"
              aria-invalid={Boolean(errors.price)}
            />
            <FieldError message={errors.price} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (area / city)</Label>
            <Input
              id="location"
              name="location"
              defaultValue={initial?.location}
              placeholder="e.g. Dhanmondi, Dhaka"
              aria-invalid={Boolean(errors.location)}
            />
            <FieldError message={errors.location} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div>
            <h2 className="font-semibold">Item Images</h2>
            <p className="text-sm text-muted-foreground">
              Upload 1 to {MAX_MENU_IMAGES} photos (JPG, PNG, WebP or GIF, up to 5 MB each).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {existing.map((src, index) => (
              <div
                key={src}
                className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image src={src} alt={`Item photo ${index + 1}`} fill sizes="200px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setExisting(existing.filter((_, i) => i !== index))}
                  aria-label="Remove image"
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-foreground/70 text-background hover:bg-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}

            {added.map((image, index) => (
              <div
                key={image.preview}
                className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.preview} alt="New upload preview" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAdded(index)}
                  aria-label="Remove image"
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-foreground/70 text-background hover:bg-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}

            {totalImages < MAX_MENU_IMAGES && (
              <label className="flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <ImagePlus className="size-6" />
                Add photo
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFiles}
                  className="sr-only"
                />
              </label>
            )}
          </div>
          <FieldError message={errors.images} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          {loading
            ? mode === "create"
              ? "Submitting..."
              : "Saving..."
            : mode === "create"
              ? "Submit for Approval"
              : "Save Changes"}
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/dashboard/vendor/menu-items">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

// Loads one of the vendor's own items, then shows the edit form.
export function EditMenuItemLoader({ itemId }: { itemId: string }) {
  const [state, setState] = useState<{ item?: MenuItem; error?: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiRequest<MenuItem>(`/api/vendor/menu-items/${itemId}`)
      .then((result) => !cancelled && setState({ item: result.data }))
      .catch((error) => !cancelled && setState({ error: errorMessage(error) }));

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (!state) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (state.error || !state.item) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <TriangleAlert className="size-10 text-error" />
          <p className="max-w-sm text-sm text-muted-foreground">
            {state.error ?? "This menu item could not be loaded."}
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard/vendor/menu-items">Back to my menu items</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <MenuItemForm mode="edit" itemId={itemId} initial={state.item} />;
}
