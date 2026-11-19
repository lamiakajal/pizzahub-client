"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Check, ChevronDown, Store, User, X } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/menu";
import { formatDeliveryDate, formatRequestedAt, type Order } from "@/lib/orders";
import { cn } from "@/lib/utils";

type OrderCardProps = {
  order: Order;
  variant: "customer" | "vendor";
  busy?: boolean;
  onCancel?: (order: Order) => void;
  onAccept?: (order: Order) => void;
  onReject?: (order: Order) => void;
};

// One order for both sides. Customers can cancel pending orders,
// vendors can accept or reject them.
export function OrderCard({ order, variant, busy, onCancel, onAccept, onReject }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState<"cancel" | "reject" | null>(null);

  const item = order.item;
  const pending = order.status === "pending";
  const restaurant = order.vendor?.businessName || order.vendor?.name || "Restaurant";

  return (
    <Card className={cn(busy && "opacity-60")}>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-36">
            {item?.images?.[0] && (
              <Image src={item.images[0]} alt={item.itemName} fill sizes="150px" className="object-cover" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {item ? (
                <Link href={`/menu/${item._id}`} className="truncate font-semibold hover:text-primary">
                  {item.itemName}
                </Link>
              ) : (
                <span className="font-semibold text-muted-foreground">Item no longer available</span>
              )}
              <OrderStatusBadge status={order.status} />
            </div>

            {variant === "customer" ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Store className="size-4 shrink-0" /> {restaurant}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4 shrink-0" />
                <span className="truncate">
                  {order.customer?.name ?? "Customer"}
                  {order.customer?.email ? ` · ${order.customer.email}` : ""}
                </span>
              </p>
            )}

            <p className="flex items-center gap-2 text-sm">
              <CalendarDays className="size-4 shrink-0 text-primary" />
              Delivery on {formatDeliveryDate(order.deliveryDate)}
            </p>
            <p className="text-xs text-muted-foreground">
              Requested {formatRequestedAt(order.createdAt)}
              {item?.price !== undefined && ` · ${formatPrice(item.price)}`}
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-2 sm:flex-col sm:items-stretch">
            {confirming ? (
              <>
                <p className="text-sm font-medium">
                  {confirming === "cancel" ? "Cancel this order?" : "Reject this order?"}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => (confirming === "cancel" ? onCancel?.(order) : onReject?.(order))}
                  >
                    Yes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setConfirming(null)}>
                    No
                  </Button>
                </div>
              </>
            ) : (
              <>
                {variant === "vendor" && pending && (
                  <>
                    <Button size="sm" disabled={busy} onClick={() => onAccept?.(order)}>
                      <Check /> Accept
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirming("reject")}>
                      <X /> Reject
                    </Button>
                  </>
                )}
                {variant === "customer" && pending && (
                  <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirming("cancel")}>
                    <X /> Cancel order
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpanded((value) => !value)}
                  aria-expanded={expanded}
                >
                  Details
                  <ChevronDown className={cn("transition-transform", expanded && "rotate-180")} />
                </Button>
              </>
            )}
          </div>
        </div>

        {expanded && (
          <dl className="grid gap-4 rounded-lg bg-surface-2 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Delivery address
              </dt>
              <dd className="mt-1 whitespace-pre-line">{order.deliveryAddress}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Message
              </dt>
              <dd className="mt-1 whitespace-pre-line">{order.message || "No special instructions"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Order reference
              </dt>
              <dd className="mt-1 font-mono text-xs">{order._id}</dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
