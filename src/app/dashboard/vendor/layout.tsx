import { requireRole } from "@/lib/session";

// Only a vendor may open this area. Anyone else is sent to their own dashboard.
export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("vendor");
  return children;
}
