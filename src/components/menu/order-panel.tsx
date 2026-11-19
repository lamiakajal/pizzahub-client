"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Info, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { FieldError } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, errorMessage } from "@/lib/api-client";
import { formatPrice } from "@/lib/menu";
import { todayInputValue } from "@/lib/orders";
import type { Role } from "@/lib/roles";

type OrderPanelProps = {
  role: Role;
  isOwnItem: boolean;
  itemId: string;
  itemName: string;
  price: number;
};

type FieldErrors = Partial<Record<"deliveryDate" | "deliveryAddress" | "message", string>>;

// Only customers can order. Vendors and admins see why they cannot.
export function OrderPanel({ role, isOwnItem, itemId, itemName, price }: OrderPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  if (role !== "customer") {
    const message = isOwnItem
      ? "This is your own menu item. Vendors cannot order their own items."
      : role === "admin"
        ? "Admins manage the platform and cannot place customer orders."
        : "Vendors cannot place orders. Sign in with a customer account to order.";

    return (
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>{message}</p>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const deliveryDate = String(form.get("deliveryDate") ?? "");
    const deliveryAddress = String(form.get("deliveryAddress") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const next: FieldErrors = {};
    if (!deliveryDate) next.deliveryDate = "Choose a delivery date";
    else if (deliveryDate < todayInputValue()) next.deliveryDate = "Delivery date cannot be in the past";
    if (deliveryAddress.length < 5 || deliveryAddress.length > 300) {
      next.deliveryAddress = "Enter an address of 5 to 300 characters";
    }
    if (message.length > 500) next.message = "Message must be 500 characters or fewer";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await apiRequest("/api/customer/orders", {
        method: "POST",
        body: { itemId, deliveryDate, deliveryAddress, message },
      });
      toast.success("Order placed. The restaurant will review it soon.");
      router.push("/dashboard/customer/orders");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button size="lg" className="h-12 w-full text-base sm:w-auto sm:px-10" onClick={() => setOpen(true)}>
        Order Now
      </Button>
    );
  }

  return (
    <Card id="order">
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">Order {itemName}</h2>
            <p className="text-sm text-muted-foreground">
              Price {formatPrice(price)}. No online payment is needed to place an order.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Delivery date</Label>
            <Input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              min={todayInputValue()}
              suppressHydrationWarning
              aria-invalid={Boolean(errors.deliveryDate)}
            />
            <FieldError message={errors.deliveryDate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery address</Label>
            <Textarea
              id="deliveryAddress"
              name="deliveryAddress"
              className="min-h-20"
              placeholder="Street, building, area and city"
              aria-invalid={Boolean(errors.deliveryAddress)}
            />
            <FieldError message={errors.deliveryAddress} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Special instructions <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              className="min-h-20"
              placeholder="Anything the restaurant should know"
              aria-invalid={Boolean(errors.message)}
            />
            <FieldError message={errors.message} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={loading}>
              {loading && <LoaderCircle className="animate-spin" />}
              {loading ? "Placing order..." : "Place Order"}
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
