"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Pager } from "@/components/dashboard/pager";
import { OrderCard } from "@/components/orders/order-card";
import { StatusFilter } from "@/components/orders/status-filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, errorMessage } from "@/lib/api-client";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import { useApiList } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "" as const, label: "All" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
];

// Order list for one side of the marketplace.
// "customer" lists my own orders, "vendor" lists orders for my menu items.
export function OrderList({ variant }: { variant: "customer" | "vendor" }) {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const base = variant === "customer" ? "/api/customer/orders" : "/api/vendor/orders";
  const { items, meta, error, ready, loading, reload } = useApiList<Order>(base, {
    status,
    page,
    limit: 8,
  });

  async function update(order: Order, path: string, body: unknown, success: string) {
    setBusyId(order._id);
    try {
      await apiRequest(`${base}/${order._id}/${path}`, { method: "PATCH", body });
      toast.success(success);
      reload();
    } catch (failure) {
      toast.error(errorMessage(failure));
      // The order may have changed elsewhere, so show the latest state.
      reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <StatusFilter
        value={status}
        options={FILTERS}
        onChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {!ready ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <TriangleAlert className="size-10 text-error" />
            <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={reload}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No orders here yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {status
                ? "No orders match this filter."
                : variant === "customer"
                  ? "Find something tasty and place your first order."
                  : "Orders from customers will show up here."}
            </p>
            {variant === "customer" && !status && (
              <Button asChild>
                <Link href="/menu">Browse Menu</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={cn("space-y-3 transition-opacity", loading && "opacity-60")}>
          {items.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              variant={variant}
              busy={busyId === order._id}
              onCancel={(target) => update(target, "cancel", undefined, "Order cancelled")}
              onAccept={(target) => update(target, "status", { status: "accepted" }, "Order accepted")}
              onReject={(target) => update(target, "status", { status: "rejected" }, "Order rejected")}
            />
          ))}
        </div>
      )}

      {meta && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} disabled={loading} />}
    </div>
  );
}
