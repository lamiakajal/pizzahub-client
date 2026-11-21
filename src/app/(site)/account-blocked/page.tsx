import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = { title: "Account Blocked" };

export default function AccountBlockedPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <ShieldAlert className="size-12 text-error" />
      <h1 className="text-3xl font-extrabold tracking-tight">Your account has been blocked</h1>
      <p className="max-w-md text-muted-foreground">
        You can no longer use ordering, dashboards or any other protected
        feature. If you think this is a mistake, please contact PizzaHub
        support.
      </p>
      <SignOutButton />
    </section>
  );
}
