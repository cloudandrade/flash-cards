export interface CookieOptions {
  maxAgeSeconds: number;
  isSecure: boolean;
}

export function readCookie(cookieHeader: string, name: string): string | null {
  const prefix = `${encodeURIComponent(name)}=`;
  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(prefix.length));
  } catch {
    return null;
  }
}

export function serializeCookie(name: string, value: string, options: CookieOptions): string {
  const attributes = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${options.maxAgeSeconds}`,
    "SameSite=Lax",
  ];
  if (options.isSecure) attributes.push("Secure");
  return attributes.join("; ");
}
