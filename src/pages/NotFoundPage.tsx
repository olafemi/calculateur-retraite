import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-primary-100 mb-4" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
        Page introuvable
      </h1>
      <p className="text-base text-neutral-500 max-w-sm mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800 focus-visible:ring-primary-700 px-5 py-2.5 text-base"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
