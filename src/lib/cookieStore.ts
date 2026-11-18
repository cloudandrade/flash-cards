import { serializeCookie } from "@/lib/cookies";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const EXPIRED_MAX_AGE = 0;

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function isSecureContext(): boolean {
  return window.location.protocol === "https:";
}

export function subscribeToCookies(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCookieSnapshot(): string {
  return document.cookie;
}

export function getServerCookieSnapshot(): null {
  return null;
}

export function writeCookie(name: string, value: string): void {
  document.cookie = serializeCookie(name, value, {
    maxAgeSeconds: ONE_YEAR_IN_SECONDS,
    isSecure: isSecureContext(),
  });
  notifyListeners();
}

export function removeCookie(name: string): void {
  document.cookie = serializeCookie(name, "", {
    maxAgeSeconds: EXPIRED_MAX_AGE,
    isSecure: isSecureContext(),
  });
  notifyListeners();
}
