/**
 * ResultsEducationalNote — Plain-French narrative explaining the calculation.
 *
 * Renders as an info-callout card with a left blue/teal border accent.
 * All amounts are formatted with formatFCFA from src/utils/format.ts.
 *
 * Narrative logic:
 *   - Zero return rate   => no "avec un rendement de X%" mention; says "sans rendement"
 *   - Interest earned > 0 => adds a sentence about compound interest contribution
 */
import { formatFCFA } from "../../utils/format.ts";

interface ResultsEducationalNoteProps {
  epargneMensuelle: number;
  capitalCible: number;
  yearsToRetirement: number;
  retirementDurationYears: number;
  totalInterestEarned: number;
  totalContributions: number;
  annualReturnRate: number;
  revenuRetraite: number;
}

export function ResultsEducationalNote({
  epargneMensuelle,
  capitalCible,
  yearsToRetirement,
  retirementDurationYears,
  totalInterestEarned,
  totalContributions,
  annualReturnRate,
  revenuRetraite,
}: ResultsEducationalNoteProps) {
  const hasReturn = annualReturnRate > 0;
  const hasInterest = totalInterestEarned > 0;

  // Percentage of the target capital covered by compound interest
  const percentInterest =
    capitalCible > 0
      ? Math.round((totalInterestEarned / capitalCible) * 100)
      : 0;

  // "avec un rendement de X,XX %" — uses French decimal separator
  const returnRateText = hasReturn
    ? ` avec un rendement annuel de ${(annualReturnRate * 100)
        .toFixed(1)
        .replace(".", ",")} %`
    : "";

  // Suffix when return rate is zero
  const noReturnSuffix = !hasReturn
    ? " Sans rendement, chaque franc compte."
    : "";

  // Build the compound-interest sentence only when interest is meaningful
  const interestSentence =
    hasInterest && percentInterest > 0
      ? ` Les interets composes vous rapportent ${formatFCFA(
          totalInterestEarned
        )}, soit ${percentInterest} % de votre objectif.`
      : "";

  // Guard: avoid a nonsensical note when key values are zero
  const allZero =
    epargneMensuelle === 0 && capitalCible === 0 && revenuRetraite === 0;
  if (allZero) return null;

  // Format totalContributions for use in the note when return = 0
  // (not used in the main sentence but kept available for future expansion)
  void totalContributions;

  return (
    <div
      className="border border-neutral-200 border-l-4 border-l-teal-500 rounded-lg px-5 py-4 mt-4 bg-teal-50/40"
      role="note"
      aria-label="Explication du calcul"
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-2">
        {/* Info icon — inline SVG, no external dependency */}
        <span className="mt-0.5 shrink-0 text-teal-600" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="8.01" />
            <line x1="12" y1="11" x2="12" y2="16" />
          </svg>
        </span>

        <h3 className="text-sm font-semibold text-teal-800 leading-snug">
          Comment on calcule
        </h3>
      </div>

      {/* Narrative paragraph */}
      <p className="text-sm text-neutral-700 leading-relaxed pl-7">
        Pour toucher{" "}
        <span className="font-semibold text-neutral-900">
          {formatFCFA(revenuRetraite)}
        </span>{" "}
        par mois pendant{" "}
        <span className="font-semibold text-neutral-900">
          {retirementDurationYears} an{retirementDurationYears > 1 ? "s" : ""}
        </span>{" "}
        de retraite, vous devez avoir accumule{" "}
        <span className="font-semibold text-neutral-900">
          {formatFCFA(capitalCible)}
        </span>
        {". "}
        En epargnant{" "}
        <span className="font-semibold text-neutral-900">
          {formatFCFA(epargneMensuelle)}
        </span>{" "}
        par mois pendant{" "}
        <span className="font-semibold text-neutral-900">
          {yearsToRetirement} an{yearsToRetirement > 1 ? "s" : ""}
        </span>
        {returnRateText}, les interets composes font le reste.
        {noReturnSuffix}
        {interestSentence}
      </p>
    </div>
  );
}
