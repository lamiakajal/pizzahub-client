import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { toRole, type Role } from "@/lib/roles";

// One session lookup per request. The cookie cache is skipped so role and
// block status always come fresh from the database.
export const getSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  })
);

// Use in server components that need a signed-in, non-blocked user.
// nextPath is where the user returns to after signing in.
export async function requireUser(nextPath = "/dashboard") {
  const session = await getSession();

  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  if (session.user.isBlocked) {
    redirect("/account-blocked");
  }

  return { session, user: session.user, role: toRole(session.user.role) };
}

// Sends users who open another role's area back to their own dashboard.
export async function requireRole(role: Role) {
  const result = await requireUser();

  if (result.role !== role) {
    redirect(`/dashboard/${result.role}`);
  }

  return result;
}
