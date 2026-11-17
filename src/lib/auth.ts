import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Anything other than vendor/customer falls back to customer,
          // so nobody can register as admin through the public form.
          const role = SIGNUP_ROLES.includes(user.role as string)
            ? (user.role as string)
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
