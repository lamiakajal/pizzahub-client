"use client";

import Link from "next/link";
import { ClipboardList, Clock, ShoppingBag, TriangleAlert, Check, X } from "lucide-react";
import { OrdersByMonthChart, OrdersByStatusChart, type OrdersByMonth, type OrdersByStatus } from "@/components/charts/overview-charts";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiData } from "@/lib/use-api";

type CustomerStats = {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
  ordersByStatus: OrdersByStatus;
  ordersByMonth: OrdersByMonth;
};

export function CustomerOverview() {
  const { data, error, loading, reload } = useApiData<CustomerStats>("/api/customer/overview");

  if (loading && !data && !error) return <StatCardSkeleton count={4} />;

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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={data.total} icon={ClipboardList} />
        <StatCard label="Pending orders" value={data.pending} icon={Clock} hint="Waiting for the restaurant" />
        <StatCard label="Accepted orders" value={data.accepted} icon={Check} />
        <StatCard label="Rejected orders" value={data.rejected} icon={X} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OrdersByStatusChart data={data.ordersByStatus} />
        <OrdersByMonthChart data={data.ordersByMonth} />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold">Hungry for something new?</h2>
            <p className="text-sm text-muted-foreground">
              Browse pizzas, sides and drinks from local shops.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/menu">
                <ShoppingBag /> Browse Menu
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/customer/orders">View my orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
