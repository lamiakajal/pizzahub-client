import type { Metadata } from "next";
import { AdminMenuItems } from "@/components/admin/admin-menu-items";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = { title: "Manage Menu Items" };

export default function ManageMenuItemsPage() {
  return (
    <>
      <PageHeader
        title="Manage Menu Items"
        description="Review new items, change the status of published ones, or remove anything inappropriate."
      />
      <AdminMenuItems />
    </>
  );
}
