"use client";

import { Clock, CreditCard, Store, TriangleAlert, UserRound, Users, UtensilsCrossed } from "lucide-react";
import { AdminCharts } from "@/components/admin/admin-charts";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminOverviewData } from "@/lib/admin";
import { useApiData } from "@/lib/use-api";

export function AdminOverview() {
  const { data, error, loading, reload } = useApiData<AdminOverviewData>("/api/admin/overview");

  if (loading && !data && !error) {
    return (
      <div className="space-y-8">
        <StatCardSkeleton count={6} />
        <div className="grid gap-4 lg:grid-cols-2" aria-busy="true">
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <TriangleAlert className="size-10 text-error" />
          <p className="max-w-sm text-sm text-muted-foreground">
            {error ?? "Could not load the overview."}
          </p>
          <Button variant="outline" onClick={reload}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { totals } = data;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Registered users" value={totals.users} icon={Users} />
        <StatCard label="Vendors" value={totals.vendors} icon={Store} />
        <StatCard label="Customers" value={totals.customers} icon={UserRound} />
        <StatCard label="Menu items" value={totals.menuItems} icon={UtensilsCrossed} />
        <StatCard
          label="Pending menu items"
          value={totals.pendingMenuItems}
          icon={Clock}
          hint="Waiting for a review"
        />
        <StatCard label="Transactions" value={totals.transactions} icon={CreditCard} />
      </div>

      <AdminCharts data={data} />
    </div>
  );
}
