import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";

// The navbar links here. Send each user to the profile page of their own role.
export default async function ProfileRedirectPage() {
  const { role } = await requireUser();
  redirect(`/dashboard/${role}/profile`);
}
