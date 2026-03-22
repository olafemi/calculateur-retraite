/**
 * StepObjectif — Step 3: Retirement age slider + numeric input.
 *
 * Shows large value display, range slider, manual input, and years remaining banner.
 * Warnings for low years remaining.
 */
import { useCallback, useEffect, useRef } from "react";
import { RetirementAgeControl } from "./RetirementAgeControl.tsx";
import { YearsRemainingBanner } from "./YearsRemainingBanner.tsx";
import { useStep3Data, useRetraiteStore } from "../../stores/retraiteStore.ts";
import { getStep3Warnings } from "../../utils/validation.ts";
import { AGE_CONSTRAINTS } from "../../types/retraite.ts";
import type { Step3Errors } from "../../types/retraite.ts";

interface StepObjectifProps {
  errors: Step3Errors;
  onClearError: (field: string) => void;
}

export function StepObjectif({ errors, onClearError }: StepObjectifProps) {
  const data = useStep3Data();
  const store = useRetraiteStore();
  const currentAge = store.getCurrentAge();
  const minRetirementAge = store.getMinRetirementAge();
  const yearsUntilRetirement = store.getYearsUntilRetirement();
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the slider on mount
  useEffect(() => {
    const slider = containerRef.current?.querySelector("input[type=range]");
    (slider as HTMLElement | null)?.focus();
  }, []);

  const handleChange = useCallback(
    (value: number) => {
      store.setAgeRetraite(value);
      if (errors.ageRetraite) {
        onClearError("ageRetraite");
      }
    },
    [store, errors.ageRetraite, onClearError]
  );

  // Get warnings
  const warnings = getStep3Warnings(currentAge, data.ageRetraite);
  const warningMessage = warnings.length > 0 ? warnings[0].message : undefined;

  return (
    <div ref={containerRef}>
      {/* Step title */}
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
        A quel age souhaitez-vous partir a la retraite ?
      </h2>
      <p className="mt-1 text-sm md:text-base text-neutral-500">
        Choisissez l&apos;age auquel vous aimeriez arreter de travailler.
      </p>

      {/* Retirement age control */}
      <div className="mt-6">
        <RetirementAgeControl
          value={data.ageRetraite}
          min={minRetirementAge}
          max={AGE_CONSTRAINTS.maxRetirementAge}
          error={errors.ageRetraite}
          onChange={handleChange}
        />
      </div>

      {/* Years remaining banner */}
      {yearsUntilRetirement !== null && (
        <div className="mt-4">
          <YearsRemainingBanner
            yearsRemaining={yearsUntilRetirement}
            warningMessage={warningMessage}
          />
        </div>
      )}
    </div>
  );
}
