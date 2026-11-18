const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Each validator returns an error message, or null when the value is fine.

export function validateName(name: string): string | null {
  if (name.trim().length < 2) return "Please enter your full name";
  return null;
}

export function validateEmail(email: string): string | null {
  if (!EMAIL_PATTERN.test(email.trim())) return "Please enter a valid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter";
  return null;
}

export function validateImageFile(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return "Use a JPG, PNG, WebP or GIF image";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be 5 MB or smaller";
  return null;
}
