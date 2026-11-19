"use client";

import Link from "next/link";
import { Check, ClipboardList, Clock, Crown, TriangleAlert, UtensilsCrossed } from "lucide-react";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiData } from "@/lib/use-api";

type VendorStats = {
  totalItems: number;
  activeItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  plan: "free" | "premium";
  subscriptionExpiresAt: string | null;
};

export function VendorOverview() {
  const { data, error, loading, reload } = useApiData<VendorStats>("/api/vendor/overview");

  if (loading && !data && !error) return <StatCardSkeleton count={5} />;

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <TriangleAlert className="size-10 text-error" />
          <p className="max-w-sm text-sm text-muted-foreground">
            {error ?? "Could not load your overview."}
          </p>
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const premium = data.plan === "premium";
  const renews = data.subscriptionExpiresAt
    ? new Date(data.subscriptionExpiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total menu items" value={data.totalItems} icon={UtensilsCrossed} />
        <StatCard
          label="Active menu items"
          value={data.activeItems}
          icon={Check}
          hint="Approved and visible to customers"
        />
        <StatCard label="Pending orders" value={data.pendingOrders} icon={Clock} hint="Waiting for your answer" />
        <StatCard label="Accepted orders" value={data.acceptedOrders} icon={ClipboardList} />
        <StatCard
          label="Current plan"
          value={
            <span className="flex items-center gap-2">
              {premium ? "Premium" : "Free"}
              {premium && <Badge variant="brand">Premium</Badge>}
            </span>
          }
          icon={Crown}
          hint={premium ? (renews ? `Active until ${renews}` : "Unlimited active items") : "Up to 3 active items"}
        />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold">Keep your menu fresh</h2>
            <p className="text-sm text-muted-foreground">
              Add new items, answer orders and manage your plan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/vendor/menu-items/new">Add Menu Item</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/vendor/orders">Customer orders</Link>
            </Button>
            {!premium && (
              <Button asChild variant="outline">
                <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
