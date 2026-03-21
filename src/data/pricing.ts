import type { PricingPlan } from "../types/pricing";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "one_shot",
    name: "Ponctuel",
    priceFCFA: 500,
    billingLabel: "une seule fois",
    features: ["Voir les résultats d'une simulation"],
    recommended: false,
  },
  {
    id: "daily",
    name: "Pass Journalier",
    priceFCFA: 500,
    billingLabel: "par jour",
    features: [
      "Ajustements illimités pendant 24h",
      "Accès à tous les outils",
    ],
    recommended: false,
  },
  {
    id: "monthly",
    name: "Mensuel",
    priceFCFA: 1000,
    billingLabel: "par mois",
    features: [
      "Accès illimité pendant 30 jours",
      "Accès à tous les outils",
      "Historique des simulations",
    ],
    recommended: true,
  },
  {
    id: "yearly",
    name: "Annuel",
    priceFCFA: 5000,
    billingLabel: "par an",
    features: [
      "Accès illimité pendant 365 jours",
      "Accès à tous les outils",
      "Historique des simulations",
      "Meilleur rapport qualité-prix",
    ],
    recommended: false,
  },
];
