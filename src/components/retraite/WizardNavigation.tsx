/**
 * WizardNavigation — Bottom bar with Retour / Suivant buttons.
 *
 * Mobile: sticky at bottom with white bg and top border.
 * Desktop: inside the card, not sticky.
 * Step 1: no Retour button, Suivant is full-width on mobile.
 * Step 4: "Voir mes resultats" in accent variant + lg size.
 */
import { Button } from "../ui/Button.tsx";

interface WizardNavigationProps {
  currentStep: 1 | 2 | 3 | 4;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
}

export function WizardNavigation({
  currentStep,
  onNext,
  onPrev,
  isLastStep,
}: WizardNavigationProps) {
  const showRetour = currentStep > 1;

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-neutral-200 px-4 py-3",
        "flex items-center",
        showRetour ? "justify-between" : "justify-end",
        "md:static md:border-t-0 md:px-0 md:pt-8 md:pb-0 md:z-auto",
      ].join(" ")}
    >
      {showRetour && (
        <Button
          variant="ghost"
          size="md"
          onClick={onPrev}
          type="button"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Retour
        </Button>
      )}

      {isLastStep ? (
        <Button
          variant="accent"
          size="lg"
          onClick={onNext}
          type="button"
        >
          Voir mes resultats
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      ) : (
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          type="button"
          className={!showRetour ? "w-full sm:w-auto" : ""}
        >
          Suivant
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      )}
    </div>
  );
}
