import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/admin-overview";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = { title: "Admin Overview" };

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader
        title="Admin Overview"
        description="Users, menu items and subscription payments at a glance."
      />
      <AdminOverview />
    </>
  );
}
