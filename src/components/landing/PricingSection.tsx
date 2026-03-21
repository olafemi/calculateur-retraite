import type { PricingPlan } from "../../types/pricing";
import { PricingCard } from "./PricingCard";

interface PricingSectionProps {
  plans: PricingPlan[];
}

export function PricingSection({ plans }: PricingSectionProps) {
  return (
    <section
      className="bg-primary-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="pricing-heading"
      id="tarifs"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label + heading */}
        <div className="mb-10 md:mb-14 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-700 mb-2">
            Nos tarifs
          </p>
          <h2
            id="pricing-heading"
            className="text-2xl md:text-3xl font-bold text-neutral-900"
          >
            Accédez à vos résultats
          </h2>
          <p className="text-base text-neutral-500 mt-3 max-w-xl mx-auto">
            Premier résultat gratuit. Ensuite, choisissez la formule qui vous
            convient.
          </p>
        </div>

        {/* Pricing cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
