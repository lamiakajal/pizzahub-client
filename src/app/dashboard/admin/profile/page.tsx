import type { Metadata } from "next";
import { ProfileSection } from "@/components/dashboard/profile-section";

export const metadata: Metadata = { title: "Profile Settings" };

export default function ProfilePage() {
  return <ProfileSection />;
}
