// Password rules shared by the forms and the Better Auth server hook.
// Keep this file free of React so both sides can import it.

export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 6 characters",
    message: "Password must be at least 6 characters",
    test: (password: string) => password.length >= 6,
  },
  {
    id: "lower",
    label: "One lowercase letter",
    message: "Password needs at least one lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "upper",
    label: "One uppercase letter",
    message: "Password needs at least one uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    message: "Password needs at least one number",
    test: (password: string) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "One special symbol (@ # $ ! and similar)",
    message: "Password needs at least one special symbol such as @ # $ !",
    test: (password: string) => /[^A-Za-z0-9\s]/.test(password),
  },
] as const;

export function checkPassword(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    ok: rule.test(password),
  }));
}

// Returns the first broken rule as a message, or null when the password is fine.
export function getPasswordProblem(password: unknown): string | null {
  if (typeof password !== "string") return "Password is required";

  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return rule.message;
  }
  return null;
}

export type PasswordStrength = {
  level: "weak" | "medium" | "strong";
  label: string;
  // Filled segments of the meter, 0 to 3.
  score: number;
};

// Strong needs every rule and a length of 10 or more. Medium means the
// password is valid or close to it. Everything else is weak.
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: "weak", label: "Weak", score: 0 };

  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length;

  if (passed === PASSWORD_RULES.length && password.length >= 10) {
    return { level: "strong", label: "Strong", score: 3 };
  }
  if (passed >= PASSWORD_RULES.length - 1) {
    return { level: "medium", label: "Medium", score: 2 };
  }
  return { level: "weak", label: "Weak", score: 1 };
}
