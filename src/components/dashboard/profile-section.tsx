import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export async function ProfileSection() {
  const { user, role } = await requireUser();

  return (
    <>
      <PageHeader
        title="Profile Settings"
        description="Update your details and keep your account secure."
      />
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardContent>
            <ProfileForm
              role={role}
              initial={{
                name: user.name,
                email: user.email,
                image: user.image,
                businessName: user.businessName,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                subscriptionPlan: user.subscriptionPlan,
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Use a strong password you do not use anywhere else.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
