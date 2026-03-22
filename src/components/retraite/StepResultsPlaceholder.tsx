/**
 * StepResultsPlaceholder — Temporary M4-only placeholder view.
 *
 * Shown after Step 4 validation passes (wizard completed).
 * Displays a spinner and "Vos resultats sont en cours de preparation..."
 * Includes a "Recommencer" button to reset the wizard.
 */
import { useRetraiteStore } from "../../stores/retraiteStore.ts";
import { Button } from "../ui/Button.tsx";

export function StepResultsPlaceholder() {
  const reset = useRetraiteStore((s) => s.reset);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Success checkmark */}
      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M8 16L14 22L24 10"
            stroke="var(--color-primary-700)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
        Formulaire complete !
      </h2>
      <p className="text-base text-neutral-500 max-w-xs">
        Le calcul de vos resultats sera disponible dans une prochaine mise a jour.
      </p>

      <div className="mt-8">
        <Button variant="primary" size="md" onClick={reset} type="button">
          Recommencer une simulation
        </Button>
      </div>
    </div>
  );
}
