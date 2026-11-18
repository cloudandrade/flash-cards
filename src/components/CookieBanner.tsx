"use client";

interface CookieBannerProps {
  onAccept: () => void;
}

export default function CookieBanner({ onAccept }: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 p-4"
      style={{ animation: "alertIn 0.2s ease-out both" }}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-slate-600 leading-relaxed flex-1">
          Este site usa cookies para salvar os seus dados de acesso (nome e email) neste navegador. Eles não são
          enviados para nenhum servidor. Para continuar, confirme que está de acordo.
        </p>
        <button
          type="button"
          onClick={onAccept}
          className="flex-shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow shadow-indigo-200"
        >
          Aceitar cookies
        </button>
      </div>
    </div>
  );
}
