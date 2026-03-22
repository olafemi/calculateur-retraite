/**
 * YearsRemainingBanner — Info/warning banner for Step 3.
 *
 * Shows "Il vous reste X ans pour preparer votre retraite."
 * Changes to warning style when years remaining <= 5.
 */

interface YearsRemainingBannerProps {
  yearsRemaining: number;
  warningMessage?: string;
}

export function YearsRemainingBanner({
  yearsRemaining,
  warningMessage,
}: YearsRemainingBannerProps) {
  const isWarning = yearsRemaining <= 5;

  const containerClasses = isWarning
    ? "bg-warning-100 border border-warning-500/20"
    : "bg-primary-50 border border-primary-700/10";

  const numberClasses = isWarning
    ? "font-bold text-warning-500"
    : "font-bold text-primary-700";

  return (
    <div className={`${containerClasses} rounded-lg px-4 py-3`}>
      <p className="text-sm md:text-base text-neutral-700">
        Il vous reste{" "}
        <span className={numberClasses}>{yearsRemaining} ans</span>{" "}
        pour preparer votre retraite.
      </p>
      {warningMessage && (
        <p className="text-sm font-medium text-warning-500 mt-1">
          {warningMessage}
        </p>
      )}
    </div>
  );
}
