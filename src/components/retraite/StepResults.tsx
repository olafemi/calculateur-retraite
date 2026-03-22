/**
 * StepResults — Main results container (replaces StepResultsPlaceholder).
 *
 * Reads all form data from the store, calls computeRetirementResults()
 * via useMemo, and distributes results to child components.
 *
 * CRITICAL: Uses useShallow for all object-returning selectors
 * to prevent infinite re-render loops with Zustand 5 + React 19.
 *
 * Section order per spec (milestone-5-ui-design.md section 2.2):
 *   1. Back link + Greeting (ResultsHeader)
 *   2. User info summary (ResultsUserSummary) — editable fields
 *   3. Contextual alerts (ResultsAlerts) — 0-2 alerts
 *   4. Paywall-ready container (results-content):
 *      - Primary card ("Votre effort mensuel")
 *      - Secondary card ("Ce qu'il vous faut")
 *      - Breakdown card ("Comment ca marche ?")
 *      - Chart card ("Evolution de votre epargne")
 *   5. Adjustable assumptions ("Ajustez vos hypotheses") — sliders
 *   6. Reset button ("Recommencer une simulation")
 */
import { useMemo, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { useRetraiteStore } from "../../stores/retraiteStore.ts";
import { computeRetirementResults } from "../../utils/retraite.ts";
import { computeAge } from "../../utils/validation.ts";
import { ResultsUserSummary } from "./ResultsUserSummary.tsx";
import { ResultsAlerts } from "./ResultsAlerts.tsx";
import { ResultsHeroCards } from "./ResultsHeroCards.tsx";
import { ResultsBreakdown } from "./ResultsBreakdown.tsx";
import { ResultsEducationalNote } from "./ResultsEducationalNote.tsx";
import { ResultsChart } from "./ResultsChart.tsx";
import { ResultsAssumptions } from "./ResultsAssumptions.tsx";
import { WhatsAppShareButton } from "./WhatsAppShareButton.tsx";
import { Button } from "../ui/Button.tsx";

export function StepResults() {
  const greetingRef = useRef<HTMLDivElement>(null);

  // Read form data with useShallow to avoid re-render loops
  const formData = useRetraiteStore(
    useShallow((s) => ({
      prenom: s.prenom,
      statut: s.statut,
      jourNaissance: s.jourNaissance,
      moisNaissance: s.moisNaissance,
      anneeNaissance: s.anneeNaissance,
      ageRetraite: s.ageRetraite,
      salaireActuel: s.salaireActuel,
      revenuRetraite: s.revenuRetraite,
      capitalDisponible: s.capitalDisponible,
    }))
  );

  // Read adjustable params with useShallow
  const params = useRetraiteStore(
    useShallow((s) => ({
      annualReturnRate: s.annualReturnRate,
      annualInflationRate: s.annualInflationRate,
      lifeExpectancy: s.lifeExpectancy,
    }))
  );

  // Actions (stable references, no useShallow needed)
  const setWizardCompleted = useRetraiteStore((s) => s.setWizardCompleted);
  const reset = useRetraiteStore((s) => s.reset);

  // Compute current age from DOB
  const currentAge = useMemo(
    () =>
      computeAge(
        formData.jourNaissance,
        formData.moisNaissance,
        formData.anneeNaissance
      ),
    [formData.jourNaissance, formData.moisNaissance, formData.anneeNaissance]
  );

  // If DOB data is corrupted (can't compute age), go back to wizard.
  // NOTE: We do NOT redirect when salaireActuel or revenuRetraite are null,
  // because the user can temporarily clear those fields while editing them
  // on the ResultsUserSummary. Only DOB corruption (which cannot be edited
  // on this page) warrants a redirect.
  useEffect(() => {
    if (currentAge === null) {
      setWizardCompleted(false);
    }
  }, [currentAge, setWizardCompleted]);

  // Scroll to top and focus greeting on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Focus the greeting heading for accessibility
    requestAnimationFrame(() => {
      const heading = greetingRef.current?.querySelector("h2");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    });
  }, []);

  // Compute full results via useMemo — reactive to all inputs + params.
  // Uses fallback values (0) when salary/revenu are null (user is mid-edit).
  const results = useMemo(() => {
    if (currentAge === null) {
      return null;
    }

    return computeRetirementResults(
      currentAge,
      formData.ageRetraite,
      formData.revenuRetraite ?? 0,
      formData.salaireActuel ?? 0,
      params,
      formData.capitalDisponible ?? 0
    );
  }, [
    currentAge,
    formData.ageRetraite,
    formData.revenuRetraite,
    formData.salaireActuel,
    formData.capitalDisponible,
    params,
  ]);

  // Guard: if results could not be computed, show nothing (useEffect above will redirect)
  if (!results || currentAge === null) {
    return null;
  }

  const handleBack = () => {
    setWizardCompleted(false);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div
      role="region"
      aria-label="Resultats de votre simulation de retraite"
    >
      {/* 1. Header: back link + greeting */}
      <div ref={greetingRef}>
        <div>
          {/* Back link */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 min-h-[44px] py-2 mb-4
                       text-sm font-medium text-primary-700
                       hover:text-primary-600 hover:underline
                       transition-colors duration-150"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Modifier mes informations
          </button>

          {/* Greeting */}
          <div className="mb-6" style={{ overflowWrap: "break-word" }}>
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
              Bonjour {formData.prenom},
            </h2>
            <p className="text-sm md:text-base font-normal text-neutral-500 mt-1">
              Voici votre plan de retraite.
            </p>
          </div>
        </div>
      </div>

      {/* 2. User information summary (editable age, salary, revenu) */}
      <ResultsUserSummary />

      {/* 3. Adjustable assumptions — sliders (founder decision: right after user info) */}
      <ResultsAssumptions
        retirementAge={formData.ageRetraite}
        retirementDurationYears={results.params.retirementDurationYears}
        realReturnRate={results.params.realReturnRate}
      />

      {/* 4. Contextual alerts */}
      <ResultsAlerts alerts={results.alerts} />

      {/* 5. Paywall-ready content container */}
      <div className="results-content relative" data-paywall="results">
        <ResultsHeroCards
          epargneMensuelle={results.epargneMensuelle}
          capitalCible={results.capitalCible}
          retirementAge={formData.ageRetraite}
        />

        <ResultsBreakdown
          epargneMensuelle={results.epargneMensuelle}
          yearsToRetirement={results.yearsToRetirement}
          totalContributions={results.totalContributions}
          totalInterestEarned={results.totalInterestEarned}
          capitalCible={results.capitalCible}
          savingsRatePercent={results.savingsRatePercent}
          capitalDisponible={results.capitalDisponible}
        />

        <ResultsChart
          chartData={results.chartData}
          currentAge={currentAge}
          retirementAge={formData.ageRetraite}
          capitalCible={results.capitalCible}
          totalContributions={results.totalContributions}
          totalInterestEarned={results.totalInterestEarned}
        />
      </div>

      {/* 6. WhatsApp share button */}
      <div className="mt-6 flex justify-center">
        <WhatsAppShareButton
          prenom={formData.prenom}
          epargneMensuelle={results.epargneMensuelle}
          capitalCible={results.capitalCible}
          yearsToRetirement={results.yearsToRetirement}
          retirementAge={formData.ageRetraite}
          capitalDisponible={results.capitalDisponible}
          retirementDurationYears={results.params.retirementDurationYears}
          revenuRetraite={formData.revenuRetraite ?? 0}
          annualReturnRate={params.annualReturnRate}
          totalContributions={results.totalContributions}
          totalInterestEarned={results.totalInterestEarned}
          savingsRatePercent={results.savingsRatePercent}
          statut={formData.statut}
          currentSalary={formData.salaireActuel ?? 0}
        />
      </div>

      {/* 7. Educational note — "Comment on calcule" */}
      <ResultsEducationalNote
        epargneMensuelle={results.epargneMensuelle}
        capitalCible={results.capitalCible}
        yearsToRetirement={results.yearsToRetirement}
        retirementDurationYears={results.params.retirementDurationYears}
        totalInterestEarned={results.totalInterestEarned}
        totalContributions={results.totalContributions}
        annualReturnRate={params.annualReturnRate}
        revenuRetraite={formData.revenuRetraite ?? 0}
      />

      {/* 7. Reset button */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          size="md"
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          Recommencer une simulation
        </Button>
      </div>
    </div>
  );
}
