"use client";

import { useSession } from "@/hooks/useSession";
import CookieBanner from "@/components/CookieBanner";
import SignUpScreen from "@/components/SignUpScreen";

export default function SessionGate({ children }: { children: React.ReactNode }) {
  const { isReady, hasConsent, user, acceptCookies, signUp } = useSession();

  if (!isReady) return <div className="min-h-screen" aria-busy="true" />;

  return (
    <>
      {user ? children : <SignUpScreen hasConsent={hasConsent} onSignUp={signUp} />}
      {!hasConsent && <CookieBanner onAccept={acceptCookies} />}
    </>
  );
}
