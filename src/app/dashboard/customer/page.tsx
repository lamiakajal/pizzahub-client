import type { Metadata } from "next";
import { CustomerOverview } from "@/components/customer/customer-overview";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function CustomerOverviewPage() {
  const { user } = await requireUser();
  const firstName = user.name.split(" ")[0] || "there";

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} description="Here is a quick look at your orders." />
      <CustomerOverview />
    </>
  );
}
