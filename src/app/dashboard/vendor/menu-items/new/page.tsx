import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { MenuItemForm } from "@/components/vendor/menu-item-form";

export const metadata: Metadata = { title: "Add Menu Item" };

export default function AddMenuItemPage() {
  return (
    <>
      <PageHeader
        title="Add Menu Item"
        description="New items are reviewed by an admin before customers can see them."
      />
      <MenuItemForm mode="create" />
    </>
  );
}
