export function AuthPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="14" cy="10" r="5" stroke="var(--color-primary-700)" strokeWidth="2" />
          <path
            d="M4 24 C4 18.477 8.477 14 14 14 C19.523 14 24 18.477 24 24"
            stroke="var(--color-primary-700)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
        Connexion / Inscription
      </h1>
      <p className="text-base text-neutral-500 max-w-sm">
        L'authentification sera disponible prochainement.
      </p>
    </div>
  );
}
