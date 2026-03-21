import { Link } from "react-router";

interface FooterLinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

const LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: "Outils",
    links: [
      { label: "Calculateur de Retraite", href: "/outils/retraite" },
      { label: "Road to Millions", href: "/outils/millions" },
    ],
  },
  {
    heading: "Compte",
    links: [
      { label: "Se connecter", href: "/connexion" },
      { label: "Créer un compte", href: "/connexion" },
    ],
  },
  {
    heading: "Légal",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-primary-900 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Logo + tagline */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 rounded-md"
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
              <span className="font-extrabold text-xl text-white leading-none">
                WealthPlan
              </span>
            </Link>
            <p className="mt-4 text-sm text-primary-100 leading-relaxed max-w-xs">
              Des outils simples pour planifier votre avenir financier en
              Afrique de l'Ouest.
            </p>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
                {group.heading}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-primary-100 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-primary-900 rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright bar */}
        <div className="border-t border-primary-800 mt-10 pt-6">
          <p className="text-xs text-primary-100 text-center">
            &copy; 2026 WealthPlan &mdash; Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
