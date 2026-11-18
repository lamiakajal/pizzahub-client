import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware, getOAuthState } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { db } from "./mongodb";

// Only these roles can be chosen at sign up. Admin is assigned by a seed script.
const SIGNUP_ROLES = ["vendor", "customer"];

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
      subscriptionPlan: { type: "string", defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  hooks: {
    // Enforce password rules on the server too, not only in the form.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const password = ctx.body?.password;
      if (
        typeof password !== "string" ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must include at least one uppercase and one lowercase letter",
        });
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
  plugins: [jwt(), nextCookies()],
});
