/**
 * =============================================================================
 * Retirement Calculator — Calculation Engine
 * =============================================================================
 *
 * Pure calculation functions for the retirement planning tool.
 * These functions are framework-agnostic: no React, no Zustand, no DOM access.
 * All inputs are passed as parameters; all outputs are return values.
 *
 * Formulas are documented in: docs/specs/milestone-5-calculation.md
 *
 * Key design decisions:
 * - Default annual return rate: 0% (worst case, user adjusts via slider)
 * - Default annual inflation rate: 3% (UEMOA target)
 * - Default life expectancy: 75 years
 * - Retirement duration: lifeExpectancy - retirementAge (dynamic)
 * - All rates handled as decimals (0.08 = 8%)
 * - Edge cases for 0% rates use simplified formulas (no division by zero)
 *
 * =============================================================================
 */

import type {
  CalculationParams,
  ResultsData,
  ChartDataPoint,
  AlertDefinition,
} from "../types/retraiteResults";

import { CALCULATION_PARAM_DEFAULTS } from "../types/retraiteResults";

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/**
 * Compute the real (inflation-adjusted) annual return rate.
 * Formula: ((1 + nominalRate) / (1 + inflationRate)) - 1
 *
 * Can be negative if inflation exceeds the nominal return.
 */
function computeRealReturnRate(
  annualReturnRate: number,
  annualInflationRate: number
): number {
  return ((1 + annualReturnRate) / (1 + annualInflationRate)) - 1;
}

/**
 * Convert an annual rate to a monthly rate.
 * Formula: (1 + annualRate)^(1/12) - 1
 *
 * Handles zero rate (returns 0) and negative rates correctly.
 */
function annualToMonthlyRate(annualRate: number): number {
  if (annualRate === 0) return 0;
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

// ---------------------------------------------------------------------------
// Core Calculation Functions
// ---------------------------------------------------------------------------

/**
 * Compute the Capital Cible (target capital at retirement).
 *
 * This is the present value (at retirement date) of a stream of monthly
 * income payments over the retirement duration, adjusted for inflation.
 *
 * Uses the present value of an annuity formula with the real return rate:
 *
 *   Capital Cible = monthlyIncome * [(1 - (1 + rm)^(-M)) / rm]
 *
 * Where:
 *   rm = monthly real return rate
 *   M  = retirement duration in months
 *
 * Edge cases:
 *   - rm = 0  =>  Capital Cible = monthlyIncome * M
 *   - M  = 0  =>  Capital Cible = 0
 *
 * @param monthlyRetirementIncome - Desired monthly income during retirement (FCFA)
 * @param retirementDurationYears - Number of years in retirement
 * @param annualReturnRate        - Annual nominal return rate (decimal, e.g., 0.08)
 * @param annualInflationRate     - Annual inflation rate (decimal, e.g., 0.03)
 * @returns Capital Cible in FCFA (rounded to nearest integer)
 */
export function computeCapitalCible(
  monthlyRetirementIncome: number,
  retirementDurationYears: number,
  annualReturnRate: number,
  annualInflationRate: number
): number {
  const retirementMonths = retirementDurationYears * 12;

  if (retirementMonths <= 0) return 0;

  const realAnnualRate = computeRealReturnRate(annualReturnRate, annualInflationRate);
  const rm = annualToMonthlyRate(realAnnualRate);

  if (Math.abs(rm) < 1e-10) {
    // Real rate is effectively zero: simple multiplication
    return Math.round(monthlyRetirementIncome * retirementMonths);
  }

  // Present value of annuity: PV = PMT * [(1 - (1 + r)^(-n)) / r]
  const presentValueFactor = (1 - Math.pow(1 + rm, -retirementMonths)) / rm;
  return Math.round(monthlyRetirementIncome * presentValueFactor);
}

/**
 * Compute the Epargne Mensuelle (monthly savings required).
 *
 * Uses the sinking fund (future value of annuity) formula:
 *
 *   Epargne Mensuelle = capitalCible * [rn / ((1 + rn)^N - 1)]
 *
 * Where:
 *   rn = monthly nominal return rate
 *   N  = months to retirement
 *
 * Edge cases:
 *   - rn = 0  =>  Epargne = capitalCible / N
 *   - N  = 0  =>  Epargne = capitalCible (need full amount immediately)
 *   - capitalCible = 0  =>  Epargne = 0
 *
 * @param capitalCible      - Target capital at retirement (FCFA)
 * @param monthsToRetirement - Number of months until retirement
 * @param annualReturnRate   - Annual nominal return rate (decimal, e.g., 0.08)
 * @returns Monthly savings amount in FCFA (rounded to nearest integer)
 */
export function computeEpargneMensuelle(
  capitalCible: number,
  monthsToRetirement: number,
  annualReturnRate: number
): number {
  if (capitalCible <= 0) return 0;

  if (monthsToRetirement <= 0) {
    // User needs the full amount immediately
    return capitalCible;
  }

  const rn = annualToMonthlyRate(annualReturnRate);

  if (Math.abs(rn) < 1e-10) {
    // Nominal rate is zero: simple division
    return Math.round(capitalCible / monthsToRetirement);
  }

  // Sinking fund factor: PMT = FV * [r / ((1 + r)^n - 1)]
  const fvFactor = Math.pow(1 + rn, monthsToRetirement) - 1;
  const sinkingFundFactor = rn / fvFactor;
  return Math.round(capitalCible * sinkingFundFactor);
}

// ---------------------------------------------------------------------------
// Chart Data Generation
// ---------------------------------------------------------------------------

/**
 * Generate data points for the stacked area chart.
 *
 * Produces one data point per year from currentAge to retirementAge.
 * Each point contains cumulative contributions and cumulative interest.
 *
 * For short timeframes (1 year), produces monthly data points (12 points)
 * to ensure the chart has enough resolution.
 *
 * @param currentAge       - User's current age
 * @param retirementAge    - Target retirement age
 * @param epargneMensuelle - Monthly savings amount (FCFA)
 * @param annualReturnRate - Annual nominal return rate (decimal)
 * @returns Array of ChartDataPoint objects
 */
export function generateChartData(
  currentAge: number,
  retirementAge: number,
  epargneMensuelle: number,
  annualReturnRate: number
): ChartDataPoint[] {
  const yearsToRetirement = retirementAge - currentAge;
  const data: ChartDataPoint[] = [];

  if (yearsToRetirement <= 0) return data;

  const rn = annualToMonthlyRate(annualReturnRate);

  // For short timeframes (1-2 years), use monthly granularity
  if (yearsToRetirement <= 2) {
    const totalMonths = yearsToRetirement * 12;
    for (let m = 0; m <= totalMonths; m++) {
      const fractionalAge = currentAge + m / 12;
      const contributions = Math.round(epargneMensuelle * m);

      let totalAccumulated: number;
      if (Math.abs(rn) < 1e-10) {
        totalAccumulated = contributions;
      } else {
        // FV of annuity: PMT * [((1+r)^n - 1) / r]
        totalAccumulated = Math.round(
          epargneMensuelle * ((Math.pow(1 + rn, m) - 1) / rn)
        );
      }

      const interest = Math.max(0, totalAccumulated - contributions);

      data.push({
        age: Math.round(fractionalAge * 10) / 10, // one decimal for monthly
        contributions,
        interest,
        total: totalAccumulated,
      });
    }
    return data;
  }

  // Standard: one data point per year
  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = currentAge + year;
    const months = year * 12;
    const contributions = Math.round(epargneMensuelle * months);

    let totalAccumulated: number;
    if (months === 0) {
      totalAccumulated = 0;
    } else if (Math.abs(rn) < 1e-10) {
      totalAccumulated = contributions;
    } else {
      // FV of annuity: PMT * [((1+r)^n - 1) / r]
      totalAccumulated = Math.round(
        epargneMensuelle * ((Math.pow(1 + rn, months) - 1) / rn)
      );
    }

    const interest = Math.max(0, totalAccumulated - contributions);

    data.push({
      age,
      contributions,
      interest,
      total: totalAccumulated,
    });
  }

  return data;
}

// ---------------------------------------------------------------------------
// Contextual Alert Evaluation
// ---------------------------------------------------------------------------

/**
 * Alert definitions with their conditions, ordered by priority (highest first).
 * Maximum 2 alerts are returned to avoid overwhelming the user.
 */

interface AlertRule {
  id: string;
  severity: AlertDefinition["severity"];
  message: string;
  condition: (yearsToRetirement: number, savingsRatePercent: number) => boolean;
}

const ALERT_RULES: readonly AlertRule[] = [
  {
    id: "impossible-savings",
    severity: "error",
    message:
      "Le montant mensuel depasse votre salaire actuel. Cet objectif n'est pas atteignable avec vos revenus actuels. Ajustez votre revenu souhaite ou votre age de depart.",
    condition: (_years, rate) => rate > 100,
  },
  {
    id: "unrealistic-savings",
    severity: "warning",
    message:
      "L'effort d'epargne represente plus de la moitie de votre salaire actuel. Envisagez de reduire votre objectif de revenu a la retraite ou de repousser l'age de depart.",
    condition: (_years, rate) => rate > 50 && rate <= 100,
  },
  {
    id: "time-very-short",
    severity: "warning",
    message:
      "Vous etes tres proche de la retraite. L'effort d'epargne mensuel est tres eleve. Consultez un conseiller financier pour explorer vos options.",
    condition: (years) => years <= 2,
  },
  {
    id: "time-short",
    severity: "info",
    message:
      "Il vous reste peu de temps. Chaque mois compte ! Commencez le plus tot possible.",
    condition: (years) => years > 2 && years <= 5,
  },
  {
    id: "on-track",
    severity: "success",
    message:
      "Bonne nouvelle ! Avec un effort modere, vous pouvez atteindre votre objectif. La cle : commencer maintenant et rester regulier.",
    condition: (years, rate) => rate <= 20 && years >= 10,
  },
  {
    id: "moderate-effort",
    severity: "info",
    message:
      "Votre objectif est ambitieux mais realiste. Mettez en place un virement automatique pour ne jamais oublier.",
    condition: (years, rate) => rate > 20 && rate <= 50 && years >= 5,
  },
] as const;

/**
 * Evaluate which contextual alerts should be shown based on the user's results.
 *
 * Returns at most 2 alerts, ordered by priority (highest first).
 * Priority order is defined by the ALERT_RULES array order.
 *
 * @param yearsToRetirement  - Number of years until retirement
 * @param savingsRatePercent - Monthly savings as a percentage of current salary
 * @returns Array of matching AlertDefinition objects (max 2)
 */
export function evaluateAlerts(
  yearsToRetirement: number,
  savingsRatePercent: number
): AlertDefinition[] {
  const MAX_ALERTS = 2;
  const matching: AlertDefinition[] = [];

  for (const rule of ALERT_RULES) {
    if (matching.length >= MAX_ALERTS) break;
    if (rule.condition(yearsToRetirement, savingsRatePercent)) {
      matching.push({
        id: rule.id,
        severity: rule.severity,
        message: rule.message,
      });
    }
  }

  return matching;
}

// ---------------------------------------------------------------------------
// Full Results Computation
// ---------------------------------------------------------------------------

/**
 * Compute the complete retirement calculation results.
 *
 * This is the main entry point for the calculation engine. It takes all
 * user inputs and adjustable parameters, and returns the full ResultsData
 * object containing core results, supporting metrics, chart data, and alerts.
 *
 * This function is PURE: no side effects, no store access, no DOM interaction.
 * It is designed to be called on every render (or via useMemo) when any
 * input or parameter changes, enabling fully reactive results.
 *
 * @param currentAge              - User's current age in full years
 * @param retirementAge           - Desired retirement age
 * @param monthlyRetirementIncome - Desired monthly income during retirement (FCFA)
 * @param currentSalary           - Current monthly salary (FCFA, for savings rate)
 * @param params                  - Adjustable calculation parameters (optional, uses defaults)
 * @returns Full ResultsData object
 */
export function computeRetirementResults(
  currentAge: number,
  retirementAge: number,
  monthlyRetirementIncome: number,
  currentSalary: number,
  params?: Partial<CalculationParams>
): ResultsData {
  // Merge provided params with defaults
  const fullParams: CalculationParams = {
    ...CALCULATION_PARAM_DEFAULTS,
    ...params,
  };

  const { annualReturnRate, annualInflationRate, lifeExpectancy } = fullParams;

  // Derived variables
  const yearsToRetirement = retirementAge - currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const retirementDurationYears = lifeExpectancy - retirementAge;
  const realReturnRate = computeRealReturnRate(annualReturnRate, annualInflationRate);

  // Core calculations
  const capitalCible = computeCapitalCible(
    monthlyRetirementIncome,
    retirementDurationYears,
    annualReturnRate,
    annualInflationRate
  );

  const epargneMensuelle = computeEpargneMensuelle(
    capitalCible,
    monthsToRetirement,
    annualReturnRate
  );

  // Supporting metrics
  const totalContributions = epargneMensuelle * monthsToRetirement;
  const totalInterestEarned = Math.max(0, capitalCible - totalContributions);
  const savingsRatePercent =
    currentSalary > 0 ? (epargneMensuelle / currentSalary) * 100 : 0;

  // Chart data
  const chartData = generateChartData(
    currentAge,
    retirementAge,
    epargneMensuelle,
    annualReturnRate
  );

  // Contextual alerts
  const alerts = evaluateAlerts(yearsToRetirement, savingsRatePercent);

  return {
    capitalCible,
    epargneMensuelle,
    yearsToRetirement,
    monthsToRetirement,
    totalContributions,
    totalInterestEarned,
    savingsRatePercent,
    retirementDurationYears,
    params: {
      annualReturnRate,
      annualInflationRate,
      lifeExpectancy,
      retirementDurationYears,
      realReturnRate,
    },
    chartData,
    alerts,
  };
}
