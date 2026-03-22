/**
 * ResultsHeader — Back link + personalized greeting.
 *
 * Combines the "Modifier mes informations" back link and
 * the "Bonjour {prenom}" greeting into a single header component.
 */

interface ResultsHeaderProps {
  prenom: string;
  onBack: () => void;
}

export function ResultsHeader({ prenom, onBack }: ResultsHeaderProps) {
  return (
    <div>
      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
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
          Bonjour {prenom},
        </h2>
        <p className="text-sm md:text-base font-normal text-neutral-500 mt-1">
          Voici votre plan de retraite.
        </p>
      </div>
    </div>
  );
}
