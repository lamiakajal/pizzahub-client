import { requireRole } from "@/lib/session";

// Only an admin may open this area. Anyone else is sent to their own dashboard.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");
  return children;
}
