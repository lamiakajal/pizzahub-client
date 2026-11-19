"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { PizzaLoader } from "@/components/brand/pizza-loader";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { formatLongDate, type SubscriptionData } from "@/lib/subscription";

type State =
  | { phase: "waiting" }
  | { phase: "active"; expiresAt: string | null }
  | { phase: "slow" };

const POLL_MS = 2000;
const MAX_ATTEMPTS = 10;

// Premium switches on only when Stripe's webhook reaches our server, which can
// take a few seconds after checkout. This asks the server until it is active.
export function PremiumStatus() {
  const [state, setState] = useState<State>({ phase: "waiting" });

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: number | undefined;

    async function check() {
      attempts += 1;

      try {
        const { data } = await apiRequest<SubscriptionData>("/api/vendor/subscription");
        if (cancelled) return;

        if (data.premium) {
          setState({ phase: "active", expiresAt: data.expiresAt });
          toast.success("Premium is active. Welcome aboard!");
          return;
        }
      } catch {
        // Try again on the next round.
      }

      if (cancelled) return;
      if (attempts >= MAX_ATTEMPTS) {
        setState({ phase: "slow" });
        return;
      }
      timer = window.setTimeout(check, POLL_MS);
    }

    check();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (state.phase === "waiting") {
    return <PizzaLoader size="sm" label="Activating your Premium plan" className="py-4" />;
  }

  if (state.phase === "active") {
    return (
      <div className="space-y-4 text-center">
        <p className="flex items-center justify-center gap-2 font-semibold text-success">
          <Check className="size-5" strokeWidth={3} /> Premium is active
        </p>
        {state.expiresAt && (
          <p className="text-sm text-muted-foreground">
            Your plan renews on {formatLongDate(state.expiresAt)}.
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard/vendor/menu-items/new">Add Menu Item</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/vendor/subscription">
              <Crown /> View subscription
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        Your payment went through. Premium is taking a little longer than usual to switch on.
        It will activate as soon as Stripe confirms the payment.
      </p>
      <Button asChild variant="outline">
        <Link href="/dashboard/vendor/subscription">Check my subscription</Link>
      </Button>
    </div>
  );
}
