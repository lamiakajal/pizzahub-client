import { RoleSection } from "@/components/dashboard/role-section";

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <RoleSection role="admin" slug={slug} />;
}
