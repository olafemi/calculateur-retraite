/**
 * ResultsActions — "Recommencer une simulation" reset button.
 *
 * Positioned at the bottom of the results page.
 */
import { Button } from "../ui/Button.tsx";

interface ResultsActionsProps {
  onReset: () => void;
}

export function ResultsActions({ onReset }: ResultsActionsProps) {
  return (
    <div className="mt-8 flex justify-center">
      <Button
        variant="outline"
        size="md"
        type="button"
        onClick={onReset}
        className="w-full sm:w-auto"
      >
        Recommencer une simulation
      </Button>
    </div>
  );
}
