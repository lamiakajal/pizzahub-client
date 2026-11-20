import { Check, Clock, X, type LucideIcon } from "lucide-react";
import { formatRequestedAt, type Order, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

type Step = {
  key: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  // Dot colors come from tokens only.
  tone: "primary" | "success" | "error" | "muted" | "warning";
};

const TONES: Record<Step["tone"], string> = {
  primary: "border-primary bg-primary text-on-primary",
  success: "border-success bg-success text-white",
  error: "border-error bg-error text-white",
  muted: "border-border bg-muted text-muted-foreground",
  warning: "border-warning bg-surface text-warning",
};

const FINAL: Record<Exclude<OrderStatus, "pending">, Omit<Step, "key" | "detail">> = {
  accepted: { title: "Accepted", icon: Check, tone: "success" },
  rejected: { title: "Rejected", icon: X, tone: "error" },
  cancelled: { title: "Cancelled", icon: X, tone: "muted" },
};

function buildSteps(order: Order, variant: "customer" | "vendor"): Step[] {
  const steps: Step[] = [
    {
      key: "placed",
      title: "Order placed",
      detail: formatRequestedAt(order.createdAt),
      icon: Check,
      tone: "primary",
    },
  ];

  if (order.status === "pending") {
    steps.push({
      key: "waiting",
      title: variant === "customer" ? "Waiting for the restaurant" : "Waiting for your answer",
      detail: "The order has not been answered yet",
      icon: Clock,
      tone: "warning",
    });
  } else {
    const final = FINAL[order.status];
    steps.push({ key: order.status, detail: formatRequestedAt(order.updatedAt), ...final });
  }

  return steps;
}

// Vertical timeline of an order: placed, then waiting or the final answer.
export function OrderTimeline({ order, variant }: { order: Order; variant: "customer" | "vendor" }) {
  const steps = buildSteps(order, variant);

  return (
    <ol className="space-y-0" aria-label="Order status timeline">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const last = index === steps.length - 1;
        return (
          <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span className="absolute top-8 bottom-0 left-4 w-0.5 -translate-x-1/2 bg-border" aria-hidden="true" />
            )}
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                TONES[step.tone]
              )}
              aria-hidden="true"
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
