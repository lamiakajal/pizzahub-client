import { RoleSection } from "@/components/dashboard/role-section";

export default async function VendorSectionPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <RoleSection role="vendor" slug={slug} />;
}
