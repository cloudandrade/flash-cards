"use client";

import { useState } from "react";
import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  UserProfile,
  UserProfileErrors,
  validateUserProfile,
} from "@/lib/userProfile";

interface SignUpScreenProps {
  hasConsent: boolean;
  onSignUp: (profile: UserProfile) => void;
}

const inputClassName =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-700 placeholder:text-slate-300";

export default function SignUpScreen({ hasConsent, onSignUp }: SignUpScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<UserProfileErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasConsent) return;
    const validation = validateUserProfile(name, email);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    onSignUp(validation.profile);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <h1 className="text-white font-semibold text-lg">Bem-vindo ao Flash Cards</h1>
          <p className="text-indigo-100 text-sm mt-1">Informe seu nome e email para começar.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Nome
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "signup-name-error" : undefined}
              placeholder="Ex: Maria Silva"
              className={inputClassName}
            />
            {errors.name && (
              <p id="signup-name-error" role="alert" className="text-xs text-red-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              maxLength={MAX_EMAIL_LENGTH}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
              placeholder="Ex: maria@email.com"
              className={inputClassName}
            />
            {errors.email && (
              <p id="signup-email-error" role="alert" className="text-xs text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {!hasConsent && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              Aceite os cookies no aviso abaixo para conseguir entrar.
            </p>
          )}

          <button
            type="submit"
            disabled={!hasConsent}
            className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
