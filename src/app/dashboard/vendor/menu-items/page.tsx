import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { VendorMenuItems } from "@/components/vendor/vendor-menu-items";

export const metadata: Metadata = { title: "My Menu Items" };

export default function MyMenuItemsPage() {
  return (
    <>
      <PageHeader
        title="My Menu Items"
        description="Manage your pizzas, sides and drinks. Rejected items are never shown to customers."
      />
      <VendorMenuItems />
    </>
  );
}
