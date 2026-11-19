import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware, getOAuthState } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { getPasswordProblem } from "./password-rules";
import { getProfileProblem } from "./profile-rules";
import { db } from "./mongodb";

// Only these roles can be chosen at sign up. Admin is assigned by a seed script.
const SIGNUP_ROLES = ["vendor", "customer"];

// Requests that carry a new password, and the body field that holds it.
const PASSWORD_FIELDS: Record<string, string> = {
  "/sign-up/email": "password",
  "/change-password": "newPassword",
  "/reset-password": "newPassword",
};

// Fields a user must never change on their own account.
const PROTECTED_FIELDS = [
  "role",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      businessName: { type: "string", required: false },
      phone: { type: "string", required: false },
      // Stored as YYYY-MM-DD.
      dateOfBirth: { type: "string", required: false },
      subscriptionPlan: { type: "string", defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  hooks: {
    // The same rules as the forms, enforced on the server so they cannot be skipped.
    before: createAuthMiddleware(async (ctx) => {
      const passwordField = PASSWORD_FIELDS[ctx.path];

      if (passwordField) {
        const problem = getPasswordProblem(ctx.body?.[passwordField]);
        if (problem) throw new APIError("BAD_REQUEST", { message: problem });
        return;
      }

      if (ctx.path === "/update-user") {
        const problem = getProfileProblem(ctx.body);
        if (problem) throw new APIError("BAD_REQUEST", { message: problem });
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Email sign up sends the role with the form. For Google sign up the
          // choice travels through the OAuth state instead.
          let requested: unknown = user.role;
          if (ctx?.path === "/callback/:id") {
            try {
              const state = await getOAuthState<{ role?: string }>();
              requested = state?.role;
            } catch {
              requested = undefined;
            }
          }

          // Anything other than vendor/customer falls back to customer,
          // so nobody can register as admin through the public form.
          const role = SIGNUP_ROLES.includes(requested as string)
            ? (requested as string)
            : "customer";
          return { data: { ...user, role } };
        },
      },
      update: {
        before: async (data) => {
          // Strip protected fields so profile updates cannot escalate privileges.
          const safe: Record<string, unknown> = { ...data };
          for (const field of PROTECTED_FIELDS) {
            delete safe[field];
          }
          return { data: safe };
        },
      },
    },
  },
  // nextCookies must stay the last plugin.
  session: {
    // Keep the session in an HTTP-only cookie so reloads and getSession() stay fast.
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 5 * 24 * 60 * 60,
    },
  },
  plugins: [jwt(), nextCookies()],
});
