import type { Metadata } from "next";
import Link from "next/link";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default async function PaymentCancelPage() {
  // Private page, for vendors only.
  await requireRole("vendor");

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 px-4 pb-16 sm:px-6">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <CircleX className="size-14 text-muted-foreground" />
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Payment cancelled</h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              No worries, you have not been charged. You can upgrade whenever you are ready.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard/vendor/subscription">Back to subscription</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/vendor">Go to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
