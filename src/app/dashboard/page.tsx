import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard" };

// Temporary landing page. Role dashboards replace it in the next step.
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?next=/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo animated={false} />
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
      <p className="text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{session.user.role}</span>.
        Your dashboard is coming next.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
