import { Link } from "react-router";

/* Inline SVG decorative chart for the desktop right column */
function HeroGraphic() {
  return (
    <div
      className="hidden md:flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative w-full max-w-md">
        {/* Outer glow panel */}
        <div className="absolute inset-0 bg-primary-800/40 rounded-2xl blur-xl" />
        <div className="relative bg-primary-800/60 rounded-2xl p-8 border border-primary-700/50">
          {/* Chart bars */}
          <div className="flex items-end gap-3 h-40 mb-6">
            {[35, 50, 42, 65, 58, 80, 72, 95].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${height}%`,
                  backgroundColor:
                    index === 7
                      ? "var(--color-accent-400)"
                      : `rgba(230, 244, 241, ${0.3 + index * 0.08})`,
                }}
              />
            ))}
          </div>
          {/* Chart label */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-primary-100/70 uppercase tracking-wide font-medium mb-1">
                Patrimoine estimé
              </p>
              <p className="text-2xl font-extrabold text-white tabular-nums">
                45 000 000{" "}
                <span className="text-sm font-medium text-primary-100">
                  F CFA
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary-100/70 uppercase tracking-wide font-medium mb-1">
                À la retraite
              </p>
              <p className="text-2xl font-extrabold text-accent-400 tabular-nums">
                65 ans
              </p>
            </div>
          </div>
          {/* Upward arrow trend */}
          <div className="mt-5 flex items-center gap-2 text-accent-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 12 L8 4 L14 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-semibold">+12% par an en moyenne</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Trust signal items */
interface TrustItem {
  icon: React.ReactNode;
  label: string;
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5 L13.5 4 V8 C13.5 11 11 13.5 8 14.5 C5 13.5 2.5 11 2.5 8 V4 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5.5 8 L7 9.5 L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5 L9.8 6.2 H14.7 L10.9 9 L12.3 13.8 L8 11 L3.7 13.8 L5.1 9 L1.3 6.2 H6.2 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TRUST_ITEMS: TrustItem[] = [
  { icon: <LockIcon />, label: "Paiement sécurisé" },
  { icon: <ShieldIcon />, label: "Vos données protégées" },
  { icon: <StarIcon />, label: "100% gratuit pour commencer" },
];

export function HeroSection() {
  return (
    <section
      className="bg-gradient-to-br from-primary-900 to-primary-700 px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Text column */}
        <div>
          <h1
            id="hero-heading"
            className="text-3xl md:text-5xl font-extrabold text-white leading-tight"
          >
            Prenez le contrôle de votre{" "}
            <span className="text-accent-400">avenir</span> financier
          </h1>

          <p className="text-lg md:text-xl font-normal text-primary-100 mt-4 max-w-xl leading-relaxed">
            Des outils simples pour planifier votre retraite et construire votre
            patrimoine.
          </p>

          <div className="mt-8 md:mt-10">
            <Link
              to="/outils/retraite"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-accent-500 text-white hover:bg-accent-400 active:bg-accent-500 shadow-sm hover:shadow focus-visible:ring-accent-500 focus-visible:ring-offset-primary-900 px-8 py-3.5 text-lg"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>

        {/* Graphic column (desktop only) */}
        <HeroGraphic />
      </div>

      {/* Trust signal strip */}
      <div className="max-w-7xl mx-auto">
        <ul
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 pt-8 border-t border-primary-800"
          aria-label="Garanties"
        >
          {TRUST_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-sm font-medium text-primary-100"
            >
              <span className="text-accent-400 flex-shrink-0">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
