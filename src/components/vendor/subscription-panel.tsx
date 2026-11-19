"use client";

import { useState } from "react";
import { Check, Crown, LoaderCircle, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { PizzaLoader } from "@/components/brand/pizza-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, errorMessage } from "@/lib/api-client";
import { formatLongDate, formatPlanPrice, type SubscriptionData } from "@/lib/subscription";
import { useApiData } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium badge on your restaurant",
  "Featured placement on the homepage",
  "Everything in Free",
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm">
      {items.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5">
          <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={3} />
          {feature}
        </li>
      ))}
    </ul>
  );
}

export function SubscriptionPanel() {
  const { data, error, loading, reload } = useApiData<SubscriptionData>("/api/vendor/subscription");
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function upgrade() {
    setBusy(true);
    try {
      // The server creates the Checkout Session. We only follow the link it returns.
      const { data: session } = await apiRequest<{ url: string }>(
        "/api/vendor/subscription/checkout",
        { method: "POST" }
      );
      window.location.assign(session.url);
    } catch (failure) {
      toast.error(errorMessage(failure));
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      await apiRequest("/api/vendor/subscription/cancel", { method: "POST" });
      toast.success("Cancellation scheduled. Premium stays active until the period ends.");
      setConfirmCancel(false);
      reload();
    } catch (failure) {
      toast.error(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  if (loading && !data && !error) {
    return <PizzaLoader label="Loading your plan" className="py-20" />;
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <TriangleAlert className="size-10 text-error" />
          <p className="max-w-sm text-sm text-muted-foreground">
            {error ?? "Could not load your subscription."}
          </p>
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const premium = data.premium;
  const price = formatPlanPrice(data.price);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Your current plan</p>
            <p className="flex items-center gap-2 text-2xl font-bold">
              {premium ? "Premium" : "Free"}
              {premium && <Badge variant="brand">Premium</Badge>}
            </p>
            {premium && data.expiresAt && (
              <p className="text-sm text-muted-foreground">
                {data.cancelAtPeriodEnd
                  ? `Premium ends on ${formatLongDate(data.expiresAt)}. It will not renew.`
                  : `Renews on ${formatLongDate(data.expiresAt)}.`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className={cn(!premium && "border-primary")}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xl">Free</CardTitle>
              {!premium && <Badge>Current plan</Badge>}
            </div>
            <CardDescription>Everything you need to start selling.</CardDescription>
            <p className="pt-2 text-3xl font-extrabold">
              $0 <span className="text-sm font-medium text-muted-foreground">forever</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <FeatureList items={FREE_FEATURES} />
          </CardContent>
        </Card>

        <Card className={cn(premium && "border-primary")}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Crown className="size-5 text-primary" /> Premium
              </CardTitle>
              {premium && <Badge variant="brand">Current plan</Badge>}
            </div>
            <CardDescription>Grow faster with unlimited items and better visibility.</CardDescription>
            <p className="pt-2 text-3xl font-extrabold">{price ?? "Premium"}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <FeatureList items={PREMIUM_FEATURES} />

            {!premium && (
              <div className="space-y-2">
                <Button size="lg" className="w-full" disabled={busy} onClick={upgrade}>
                  {busy ? <LoaderCircle className="animate-spin" /> : <Crown />}
                  {busy ? "Opening secure checkout..." : "Upgrade to Premium"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure payment by Stripe. Cancel any time.
                </p>
              </div>
            )}

            {premium && !data.cancelAtPeriodEnd && (
              <div className="space-y-2">
                {confirmCancel ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">Cancel Premium at the end of the period?</span>
                    <Button size="sm" variant="destructive" disabled={busy} onClick={cancel}>
                      {busy && <LoaderCircle className="animate-spin" />} Yes, cancel
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirmCancel(false)}>
                      Keep Premium
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setConfirmCancel(true)}>
                    Cancel Premium
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
