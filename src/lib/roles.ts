export const ROLES = ["customer", "vendor", "admin"] as const;
export type Role = (typeof ROLES)[number];

// Roles a visitor may pick on the public sign up form. Admin is never listed.
export const SIGNUP_ROLES = ["customer", "vendor"] as const;
export type SignupRole = (typeof SIGNUP_ROLES)[number];

export function isRole(value: unknown): value is Role {
  return ROLES.includes(value as Role);
}

// Unknown or missing roles are treated as the least privileged one.
export function toRole(value: unknown): Role {
  return isRole(value) ? value : "customer";
}
