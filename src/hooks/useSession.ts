"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { readCookie } from "@/lib/cookies";
import {
  getCookieSnapshot,
  getServerCookieSnapshot,
  removeCookie,
  subscribeToCookies,
  writeCookie,
} from "@/lib/cookieStore";
import { parseUserProfile, serializeUserProfile, UserProfile } from "@/lib/userProfile";

const CONSENT_COOKIE = "flashcards_cookie_consent";
const USER_COOKIE = "flashcards_user";
const CONSENT_ACCEPTED = "accepted";

export function useSession() {
  const cookieHeader = useSyncExternalStore(subscribeToCookies, getCookieSnapshot, getServerCookieSnapshot);

  const session = useMemo(() => {
    if (cookieHeader === null) return { isReady: false, hasConsent: false, user: null };
    return {
      isReady: true,
      hasConsent: readCookie(cookieHeader, CONSENT_COOKIE) === CONSENT_ACCEPTED,
      user: parseUserProfile(readCookie(cookieHeader, USER_COOKIE)),
    };
  }, [cookieHeader]);

  const acceptCookies = useCallback(() => writeCookie(CONSENT_COOKIE, CONSENT_ACCEPTED), []);

  const signUp = useCallback((profile: UserProfile) => {
    writeCookie(USER_COOKIE, serializeUserProfile(profile));
  }, []);

  const signOut = useCallback(() => removeCookie(USER_COOKIE), []);

  return { ...session, acceptCookies, signUp, signOut };
}
