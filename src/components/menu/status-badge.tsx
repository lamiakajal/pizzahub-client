import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { STATUS_LABELS, type MenuStatus } from "@/lib/menu";

const VARIANTS: Record<MenuStatus, BadgeVariant> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  inactive: "muted",
};

export function StatusBadge({ status }: { status: MenuStatus }) {
  return <Badge variant={VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>;
}
