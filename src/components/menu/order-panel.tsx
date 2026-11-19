"use client";

import { Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Role } from "@/lib/roles";

// Only customers can order. Vendors and admins see why they cannot.
export function OrderPanel({ role, isOwnItem }: { role: Role; isOwnItem: boolean }) {
  if (role !== "customer") {
    const message = isOwnItem
      ? "This is your own menu item. Vendors cannot order their own items."
      : role === "admin"
        ? "Admins manage the platform and cannot place customer orders."
        : "Vendors cannot place orders. Sign in with a customer account to order.";

    return (
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>{message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      size="lg"
      className="h-12 w-full text-base sm:w-auto sm:px-10"
      onClick={() => toast.info("The order form is arriving in the next update")}
    >
      Order Now
    </Button>
  );
}
