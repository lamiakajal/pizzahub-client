import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { VendorOverview } from "@/components/vendor/vendor-overview";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function VendorOverviewPage() {
  const { user } = await requireUser();
  const firstName = user.name.split(" ")[0] || "there";

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} description="Here is how your restaurant is doing." />
      <VendorOverview />
    </>
  );
}
