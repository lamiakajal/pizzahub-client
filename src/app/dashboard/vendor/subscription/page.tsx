import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { SubscriptionPanel } from "@/components/vendor/subscription-panel";

export const metadata: Metadata = { title: "Subscription" };

export default function SubscriptionPage() {
  return (
    <>
      <PageHeader
        title="Subscription"
        description="Choose the plan that fits your restaurant."
      />
      <SubscriptionPanel />
    </>
  );
}
