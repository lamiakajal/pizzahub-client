import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export async function ProfileSection() {
  const { user, role } = await requireUser();

  return (
    <>
      <PageHeader
        title="Profile Settings"
        description="Update your name, photo and other details."
      />
      <Card className="max-w-2xl">
        <CardContent>
          <ProfileForm
            role={role}
            initial={{
              name: user.name,
              email: user.email,
              image: user.image,
              businessName: user.businessName,
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
