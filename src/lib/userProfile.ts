export interface UserProfile {
  name: string;
  email: string;
}

export interface UserProfileErrors {
  name?: string;
  email?: string;
}

export type UserProfileValidation =
  | { isValid: true; profile: UserProfile }
  | { isValid: false; errors: UserProfileErrors };

export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 60;
export const MAX_EMAIL_LENGTH = 254;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(name: string): string | undefined {
  if (name.length < MIN_NAME_LENGTH) return `Informe pelo menos ${MIN_NAME_LENGTH} caracteres.`;
  if (name.length > MAX_NAME_LENGTH) return `Use no máximo ${MAX_NAME_LENGTH} caracteres.`;
  return undefined;
}

function validateEmail(email: string): string | undefined {
  if (email.length === 0) return "Informe o seu email.";
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) return "Email inválido.";
  return undefined;
}

export function validateUserProfile(rawName: string, rawEmail: string): UserProfileValidation {
  const name = rawName.trim().replace(/\s+/g, " ");
  const email = rawEmail.trim().toLowerCase();
  const errors: UserProfileErrors = {
    name: validateName(name),
    email: validateEmail(email),
  };
  if (errors.name || errors.email) return { isValid: false, errors };
  return { isValid: true, profile: { name, email } };
}

export function parseUserProfile(serialized: string | null): UserProfile | null {
  if (!serialized) return null;
  try {
    const candidate: unknown = JSON.parse(serialized);
    if (typeof candidate !== "object" || candidate === null) return null;
    const { name, email } = candidate as Record<string, unknown>;
    if (typeof name !== "string" || typeof email !== "string") return null;
    const validation = validateUserProfile(name, email);
    return validation.isValid ? validation.profile : null;
  } catch {
    return null;
  }
}

export function serializeUserProfile(profile: UserProfile): string {
  return JSON.stringify({ name: profile.name, email: profile.email });
}
