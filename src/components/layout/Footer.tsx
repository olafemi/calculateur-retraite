import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-primary-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 rounded-md"
            aria-label="Assu — Accueil"
          >
            <span
              className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 12 L6 7 L10 9 L14 3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-extrabold text-lg text-white leading-none">
              Assu
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-xs text-primary-100">
            &copy; 2026 Assu &mdash; Planificateur de retraite
          </p>
        </div>
      </div>
    </footer>
  );
}
