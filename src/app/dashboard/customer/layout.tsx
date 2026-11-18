import { requireRole } from "@/lib/session";

// Only a customer may open this area. Anyone else is sent to their own dashboard.
export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");
  return children;
}
