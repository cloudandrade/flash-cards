"use client";

import { useSession } from "@/hooks/useSession";

export default function UserMenu() {
  const { user, signOut } = useSession();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden lg:block text-sm text-slate-600 max-w-40 truncate" title={user.email}>
        Olá, <span className="font-semibold text-slate-800">{user.name}</span>
      </span>
      <button
        type="button"
        onClick={signOut}
        className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
      >
        Sair
      </button>
    </div>
  );
}
