import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { PremiumStatus } from "@/components/vendor/premium-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStripe } from "@/lib/stripe";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Successful" };

function Problem({ title, message }: { title: string; message: string }) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 px-4 pb-16 sm:px-6">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <TriangleAlert className="size-10 text-error" />
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/vendor/subscription">Back to subscription</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Private page, for vendors only.
  const { user } = await requireRole("vendor");
  const { session_id: sessionId } = await searchParams;

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return <Problem title="No payment found" message="This page needs a valid checkout session." />;
  }

  // Never trust the redirect alone: ask Stripe what really happened.
  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return (
      <Problem
        title="We could not verify this payment"
        message="Stripe did not recognize this checkout session. If you were charged, contact support."
      />
    );
  }

  // A vendor may only see their own payment.
  if (session.client_reference_id !== user.id) {
    return (
      <Problem title="This payment is not yours" message="You can only view your own payments." />
    );
  }

  if (session.status !== "complete") {
    return (
      <Problem
        title="Payment not completed"
        message="Your checkout was not finished, so you have not been charged. You can try again."
      />
    );
  }

  const amount =
    session.amount_total !== null && session.currency
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: session.currency.toUpperCase(),
        }).format(session.amount_total / 100)
      : null;

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 px-4 pb-16 sm:px-6">
      <Card className="w-full">
        <CardContent className="space-y-6 py-10 text-center">
          <CircleCheck className="mx-auto size-14 text-success" />
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Payment successful</h1>
            <p className="text-sm text-muted-foreground">
              Thank you! Your payment for the PizzaHub Premium plan has been received.
            </p>
          </div>

          <dl className="space-y-3 rounded-lg bg-surface-2 p-4 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="font-semibold">Premium</dd>
            </div>
            {amount && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount paid</dt>
                <dd className="font-semibold">{amount}</dd>
              </div>
            )}
            {session.customer_details?.email && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Receipt sent to</dt>
                <dd className="truncate font-semibold">{session.customer_details.email}</dd>
              </div>
            )}
          </dl>

          <PremiumStatus />
        </CardContent>
      </Card>
    </section>
  );
}
