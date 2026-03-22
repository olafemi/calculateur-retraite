import { useState } from "react";
import { Link } from "react-router";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Nos outils", href: "/#outils" },
  { label: "Tarifs", href: "/#tarifs" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function toggleMobileMenu() {
    setIsMobileMenuOpen((prev) => !prev);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 rounded-md"
          onClick={closeMobileMenu}
          aria-label="WealthPlan — Accueil"
        >
          <span
            className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
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
          <span className="font-extrabold text-xl text-primary-800 leading-none">
            WealthPlan
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Navigation principale"
          className="hidden md:flex items-center gap-6"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <Link
            to="/outils/retraite"
            className="inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-accent-500 text-white hover:bg-accent-400 active:bg-accent-500 shadow-sm hover:shadow focus-visible:ring-accent-500 px-4 py-2 text-sm"
          >
            Commencer
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            /* X icon */
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 4 L16 16 M16 4 L4 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 5 H17 M3 10 H17 M3 15 H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-menu"
          role="navigation"
          aria-label="Menu mobile"
          className="md:hidden bg-white border-b border-neutral-200 px-4 py-4"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="block py-3 px-4 text-base font-medium text-neutral-700 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 px-4">
            <Link
              to="/outils/retraite"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-accent-500 text-white hover:bg-accent-400 shadow-sm hover:shadow focus-visible:ring-accent-500 px-5 py-2.5 text-base"
              onClick={closeMobileMenu}
            >
              Commencer gratuitement
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
