// Optional profile fields, validated the same way in the form and on the server.

export function validatePhone(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return "Enter a valid phone number";

  const text = value.trim();
  const digits = text.replace(/\D/g, "");
  if (!/^\+?[0-9\s().-]{7,20}$/.test(text) || digits.length < 7 || digits.length > 15) {
    return "Enter a valid phone number, for example +1 (555) 000-0000";
  }
  return null;
}

export function validateDateOfBirth(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Enter a valid date of birth";
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return "Enter a valid date of birth";
  }

  const now = Date.now();
  if (date.getTime() > now) return "Date of birth cannot be in the future";
  if (date.getTime() < now - 120 * 365 * 24 * 60 * 60 * 1000) {
    return "Enter a valid date of birth";
  }
  return null;
}

// Used by the server hook on the update-user request.
export function getProfileProblem(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  if (data.name !== undefined) {
    const name = typeof data.name === "string" ? data.name.trim() : "";
    if (name.length < 2 || name.length > 80) return "Name must be 2 to 80 characters";
  }
  if (data.businessName !== undefined && typeof data.businessName === "string") {
    if (data.businessName.trim().length > 80) {
      return "Restaurant name must be 80 characters or fewer";
    }
  }
  return validatePhone(data.phone) ?? validateDateOfBirth(data.dateOfBirth);
}
