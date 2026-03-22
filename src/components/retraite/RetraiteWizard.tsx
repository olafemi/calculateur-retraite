/**
 * RetraiteWizard — Main wizard container.
 *
 * Orchestrates:
 * - Progress indicator (top)
 * - Current step content (middle) OR results display
 * - Navigation buttons (bottom, sticky on mobile)
 *
 * Manages validation on "Suivant" click, error state distribution to steps,
 * and focus management on step transitions.
 */
import { useState, useCallback, useRef } from "react";
import { ProgressIndicator } from "./ProgressIndicator.tsx";
import { WizardNavigation } from "./WizardNavigation.tsx";
import { StepIdentite } from "./StepIdentite.tsx";
import { StepSituation } from "./StepSituation.tsx";
import { StepObjectif } from "./StepObjectif.tsx";
import { StepRevenus } from "./StepRevenus.tsx";
import { StepResults } from "./StepResults.tsx";
import { useRetraiteStore, useWizardNav } from "../../stores/retraiteStore.ts";
import { STEP_LABELS } from "../../types/retraite.ts";
import type { WizardStep, StepStatus, ValidationErrors } from "../../types/retraite.ts";

export function RetraiteWizard() {
  const nav = useWizardNav();
  const store = useRetraiteStore();
  const contentRef = useRef<HTMLDivElement>(null);

  // Validation errors for the current step (set on "Suivant" click)
  const [stepErrors, setStepErrors] = useState<ValidationErrors>({});

  // Build progress indicator step configs
  const progressSteps = ([1, 2, 3, 4] as WizardStep[]).map((step) => {
    let status: StepStatus;
    if (nav.wizardCompleted) {
      // All steps completed when showing results
      status = "completed";
    } else if (step === nav.currentStep) {
      status = "active";
    } else if (nav.completedSteps.includes(step)) {
      status = "completed";
    } else {
      status = "disabled";
    }
    return {
      step,
      label: STEP_LABELS[step],
      status,
    };
  });

  // Handle step indicator click (jump to completed step)
  const handleStepClick = useCallback(
    (step: WizardStep) => {
      if (nav.wizardCompleted) {
        // From results, go back to wizard at the clicked step
        store.setWizardCompleted(false);
        store.goToStep(step);
      } else {
        store.goToStep(step);
      }
      setStepErrors({});
    },
    [store, nav.wizardCompleted]
  );

  // Handle "Suivant" click
  const handleNext = useCallback(() => {
    const result = store.nextStep();

    if (!result.valid) {
      setStepErrors(result.errors);

      // Focus the first field with an error
      requestAnimationFrame(() => {
        const firstErrorField = contentRef.current?.querySelector(
          '[aria-invalid="true"]'
        ) as HTMLElement | null;
        if (firstErrorField) {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    } else {
      setStepErrors({});
    }
  }, [store]);

  // Handle "Retour" click
  const handlePrev = useCallback(() => {
    store.prevStep();
    setStepErrors({});
  }, [store]);

  // Handle clearing a specific error (called by step components on value change)
  const handleClearError = useCallback((field: string) => {
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // If wizard is completed, show results
  if (nav.wizardCompleted) {
    return (
      <div role="form" aria-label="Calculateur de retraite">
        <ProgressIndicator
          steps={progressSteps}
          onStepClick={handleStepClick}
        />
        <StepResults />
      </div>
    );
  }

  // Render current step content
  const renderStep = () => {
    switch (nav.currentStep) {
      case 1:
        return (
          <StepIdentite
            errors={stepErrors}
            onClearError={handleClearError}
          />
        );
      case 2:
        return (
          <StepSituation
            errors={stepErrors}
            onClearError={handleClearError}
          />
        );
      case 3:
        return (
          <StepObjectif
            errors={stepErrors}
            onClearError={handleClearError}
          />
        );
      case 4:
        return (
          <StepRevenus
            errors={stepErrors}
            onClearError={handleClearError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div role="form" aria-label="Calculateur de retraite">
      {/* Progress indicator */}
      <ProgressIndicator
        steps={progressSteps}
        onStepClick={handleStepClick}
      />

      {/* Step content */}
      <div ref={contentRef} key={nav.currentStep}>
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <WizardNavigation
        currentStep={nav.currentStep}
        onNext={handleNext}
        onPrev={handlePrev}
        isLastStep={nav.currentStep === 4}
      />
    </div>
  );
}
