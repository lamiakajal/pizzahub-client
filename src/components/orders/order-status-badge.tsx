import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders";

const VARIANTS: Record<OrderStatus, BadgeVariant> = {
  pending: "warning",
  accepted: "success",
  rejected: "error",
  cancelled: "muted",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANTS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
