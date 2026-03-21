/**
 * Billing frequency for subscription plans.
 */
export type BillingPeriod = "one_shot" | "daily" | "monthly" | "yearly";

/**
 * A pricing plan displayed on the landing page.
 */
export interface PricingPlan {
  /** Unique identifier */
  id: BillingPeriod;

  /** Display name (French) */
  name: string;

  /** Price in FCFA (integer — no decimals in XOF) */
  priceFCFA: number;

  /** Human-readable billing description (e.g. "par mois") */
  billingLabel: string;

  /** List of features / benefits (French strings) */
  features: string[];

  /** Whether this plan is visually highlighted as recommended */
  recommended: boolean;
}
