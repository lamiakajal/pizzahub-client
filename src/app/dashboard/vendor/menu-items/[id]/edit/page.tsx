import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { EditMenuItemLoader } from "@/components/vendor/menu-item-form";

export const metadata: Metadata = { title: "Edit Menu Item" };

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageHeader title="Edit Menu Item" description="Update details, photos or the price." />
      <EditMenuItemLoader itemId={id} />
    </>
  );
}
