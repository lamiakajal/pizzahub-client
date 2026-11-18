import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";

// /dashboard sends each user to the dashboard for their own role.
export default async function DashboardIndexPage() {
  const { role } = await requireUser();
  redirect(`/dashboard/${role}`);
}
