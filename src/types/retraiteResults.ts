/**
 * =============================================================================
 * Retirement Calculator — Results Type Definitions
 * =============================================================================
 *
 * Data model for the calculation engine output and results display.
 * These types describe the shape of computed results, chart data points,
 * contextual alerts, and the adjustable calculation parameters.
 *
 * Spec reference: docs/specs/milestone-5-calculation.md
 *
 * =============================================================================
 * FILE STRUCTURE PLAN (for designer / frontend-dev reference)
 * =============================================================================
 *
 * src/
 * ├── types/
 * │   ├── retraite.ts               ← Form wizard types (Milestone 4)
 * │   └── retraiteResults.ts        ← THIS FILE (calculation results types)
 * ├── utils/
 * │   ├── retraite.ts               ← Pure calculation functions
 * │   ├── validation.ts             ← Form validation functions
 * │   └── format.ts                 ← FCFA formatting
 * ├── stores/
 * │   └── retraiteStore.ts          ← Zustand store (form data + adjustable params)
 * └── components/
 *     └── retraite/                 ← Results UI components (Phase D)
 *
 * =============================================================================
 */

// ---------------------------------------------------------------------------
// Calculation Parameters (adjustable by user via sliders on results page)
// ---------------------------------------------------------------------------

/**
 * Parameters that control the calculation engine.
 * These are user-adjustable on the results page via sliders.
 * Each has a default, min, max, and step for the slider.
 */
export interface CalculationParams {
  /** Annual nominal return rate as a decimal (e.g., 0.08 = 8%). Default: 0 (0%). */
  annualReturnRate: number;
  /** Annual inflation rate as a decimal (e.g., 0.03 = 3%). Default: 0.03 (3%). */
  annualInflationRate: number;
  /** Life expectancy in years. Retirement duration = lifeExpectancy - retirementAge. Default: 75. */
  lifeExpectancy: number;
}

/**
 * Default values and slider constraints for each adjustable parameter.
 */
export const CALCULATION_PARAM_DEFAULTS: Readonly<CalculationParams> = {
  annualReturnRate: 0,
  annualInflationRate: 0.03,
  lifeExpectancy: 75,
} as const;

export const CALCULATION_PARAM_CONSTRAINTS = {
  annualReturnRate: { min: 0, max: 0.20, step: 0.005 },   // 0% to 20%, step 0.5%
  annualInflationRate: { min: 0, max: 0.10, step: 0.005 }, // 0% to 10%, step 0.5%
  lifeExpectancy: { min: 0, max: 100, step: 1 },           // min is dynamic (retirementAge + 1), max 100
} as const;

// ---------------------------------------------------------------------------
// Results Data — Full output of the calculation engine
// ---------------------------------------------------------------------------

/**
 * Complete results from a retirement calculation.
 * Produced by `computeRetirementResults()` in src/utils/retraite.ts.
 *
 * This is the single source of truth for all results display components
 * and is structured to support the future paywall overlay (Milestone 6).
 */
export interface ResultsData {
  // -- Core results --

  /** Total capital needed on day one of retirement (FCFA). */
  capitalCible: number;
  /** Monthly savings amount required (FCFA). */
  epargneMensuelle: number;

  // -- Supporting metrics --

  /** Years remaining until retirement. */
  yearsToRetirement: number;
  /** Months remaining until retirement. */
  monthsToRetirement: number;
  /** Total amount the user will deposit (epargneMensuelle * monthsToRetirement). */
  totalContributions: number;
  /** Total gains from compound interest. */
  totalInterestEarned: number;
  /** Existing savings taken into account (FCFA). 0 if not provided. */
  capitalDisponible: number;
  /**
   * Percentage of current salary that goes to savings.
   * Formula: (epargneMensuelle / currentSalary) * 100.
   * Can exceed 100% for unrealistic scenarios.
   */
  savingsRatePercent: number;
  /** Retirement duration in years (lifeExpectancy - retirementAge). */
  retirementDurationYears: number;

  // -- Parameters used (for display in the assumptions section) --

  params: {
    annualReturnRate: number;
    annualInflationRate: number;
    lifeExpectancy: number;
    retirementDurationYears: number;
    /** Real (inflation-adjusted) annual return rate. */
    realReturnRate: number;
  };

  // -- Chart data --

  /** Data points for the Recharts stacked area chart. */
  chartData: ChartDataPoint[];

  // -- Contextual alerts --

  /** Ordered list of alerts to display (max 2, highest priority first). */
  alerts: AlertDefinition[];
}

// ---------------------------------------------------------------------------
// Chart Data
// ---------------------------------------------------------------------------

/**
 * A single data point for the stacked area chart.
 * One point per year from currentAge to retirementAge.
 */
export interface ChartDataPoint {
  /** User's age at this point in time. */
  age: number;
  /** Cumulative deposits up to this age (FCFA). */
  contributions: number;
  /** Cumulative interest earned up to this age (FCFA). */
  interest: number;
  /** Total accumulated amount (contributions + interest) (FCFA). */
  total: number;
}

// ---------------------------------------------------------------------------
// Contextual Alerts
// ---------------------------------------------------------------------------

/**
 * Alert severity levels.
 * Maps to color schemes: success=green, info=blue, warning=amber, error=red.
 */
export type AlertSeverity = "success" | "info" | "warning" | "error";

/**
 * A contextual alert shown on the results page.
 * Provides situational guidance based on the user's inputs and results.
 */
export interface AlertDefinition {
  /** Unique identifier for the alert (e.g., "time-very-short", "on-track"). */
  id: string;
  /** Severity level controlling the visual style. */
  severity: AlertSeverity;
  /** The alert message in French. */
  message: string;
}
