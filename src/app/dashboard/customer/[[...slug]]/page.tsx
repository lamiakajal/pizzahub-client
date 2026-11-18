import { RoleSection } from "@/components/dashboard/role-section";

export default async function CustomerSectionPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <RoleSection role="customer" slug={slug} />;
}
