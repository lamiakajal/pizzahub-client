import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | PizzaHub Dashboard" },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Signed-out visitors go to Sign In, blocked users to the blocked page.
  const { user, role } = await requireUser();

  return (
    <DashboardShell
      role={role}
      user={{ name: user.name, email: user.email, image: user.image }}
    >
      {children}
    </DashboardShell>
  );
}
