import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import type { Role } from "@/lib/roles";

// Renders the placeholder for any dashboard route that has no page yet.
// Real pages added later take priority over this catch-all.
export function RoleSection({
  role,
  slug,
}: {
  role: Role;
  slug?: string[];
}) {
  const path = ["/dashboard", role, ...(slug ?? [])].join("/");
  const item = DASHBOARD_NAV[role].find((entry) => entry.href === path);

  if (!item) {
    notFound();
  }

  return (
    <>
      <PageHeader title={item.label} />
      <ComingSoon name={item.label} />
    </>
  );
}
