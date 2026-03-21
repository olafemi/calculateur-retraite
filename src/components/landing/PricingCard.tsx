import { Link } from "react-router";
import type { PricingPlan } from "../../types/pricing";
import { formatFCFA } from "../../utils/format";

interface PricingCardProps {
  plan: PricingPlan;
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-primary-700 flex-shrink-0 mt-0.5"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8 L6.5 11.5 L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingCard({ plan }: PricingCardProps) {
  const isRecommended = plan.recommended;

  const ariaLabel = `${plan.name}, ${formatFCFA(plan.priceFCFA)}, ${plan.billingLabel}`;

  return (
    <article
      className={[
        "flex flex-col relative",
        isRecommended
          ? "bg-white rounded-xl p-6 md:p-8 border-2 border-primary-700 shadow-pricing"
          : "bg-white rounded-lg p-6 border border-neutral-200 shadow-card",
      ].join(" ")}
      aria-label={ariaLabel}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-700 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap"
          aria-label="Plan recommandé"
        >
          Recommandé
        </div>
      )}

      {/* Plan name */}
      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">
        {plan.name}
      </p>

      {/* Price row */}
      <div className="flex items-end gap-1 mb-1">
        <span
          className="text-3xl md:text-4xl font-extrabold text-neutral-900 tabular-nums"
          aria-hidden="true"
        >
          {new Intl.NumberFormat("fr-FR").format(plan.priceFCFA)}
        </span>
        <span className="text-sm font-medium text-neutral-500 mb-1" aria-hidden="true">
          F CFA
        </span>
      </div>

      {/* Billing label */}
      <p className="text-sm text-neutral-500 mb-6">{plan.billingLabel}</p>

      {/* Divider */}
      <div className="h-px bg-neutral-100 mb-5" aria-hidden="true" />

      {/* Features list */}
      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon />
            <span className="text-sm text-neutral-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <div className="mt-auto">
        <Link
          to="/connexion"
          className={[
            "w-full inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            isRecommended
              ? "bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800 focus-visible:ring-primary-700 px-5 py-2.5 text-base"
              : "border-2 border-primary-700 text-primary-700 bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-700 px-5 py-2.5 text-base",
          ].join(" ")}
          aria-label={
            isRecommended
              ? `Commencer avec le plan ${plan.name} — ${formatFCFA(plan.priceFCFA)}`
              : `Choisir le plan ${plan.name} — ${formatFCFA(plan.priceFCFA)}`
          }
        >
          {isRecommended
            ? `Commencer — ${new Intl.NumberFormat("fr-FR").format(plan.priceFCFA)} F`
            : "Choisir ce plan"}
        </Link>
      </div>
    </article>
  );
}
