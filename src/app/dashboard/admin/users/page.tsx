import type { Metadata } from "next";
import { AdminUsers } from "@/components/admin/admin-users";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Manage Users" };

export default async function ManageUsersPage() {
  const { user } = await requireRole("admin");

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="Find accounts, check their details and block anyone who breaks the rules."
      />
      <AdminUsers currentUserId={user.id} />
    </>
  );
}
