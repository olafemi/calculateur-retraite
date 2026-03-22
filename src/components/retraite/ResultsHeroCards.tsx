/**
 * ResultsHeroCards — Primary hero card + secondary capital target card.
 *
 * Combines ResultsPrimaryCard ("Votre effort mensuel") and
 * ResultsSecondaryCard ("Ce qu'il vous faut") into a single component
 * to reduce file count without changing any visual output.
 */

interface ResultsHeroCardsProps {
  epargneMensuelle: number;
  capitalCible: number;
  retirementAge: number;
}

export function ResultsHeroCards({
  epargneMensuelle,
  capitalCible,
  retirementAge,
}: ResultsHeroCardsProps) {
  const formattedEpargne = new Intl.NumberFormat("fr-FR").format(epargneMensuelle);
  const formattedCapital = new Intl.NumberFormat("fr-FR").format(capitalCible);

  return (
    <>
      {/* Primary card — "Votre effort mensuel" */}
      <div className="bg-primary-50 border border-primary-700/20 rounded-lg px-6 py-6 md:py-8 text-center">
        <p className="text-sm md:text-base font-medium text-primary-800 uppercase tracking-wide">
          Votre effort mensuel
        </p>
        <div aria-live="polite" aria-atomic="true">
          <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-700 mt-3 tabular-nums">
            {formattedEpargne}{" "}
            <span className="text-2xl md:text-3xl font-bold">FCFA</span>
          </p>
          <p className="text-base md:text-lg font-normal text-primary-700/70 mt-1">
            / mois
          </p>
        </div>
      </div>

      {/* Secondary card — "Ce qu'il vous faut" */}
      <div className="border border-neutral-200 rounded-lg px-6 py-5 mt-4">
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
          Ce qu&apos;il vous faut
        </p>
        <p className="text-2xl md:text-3xl font-bold text-neutral-900 mt-2 tabular-nums">
          {formattedCapital}&nbsp;FCFA
        </p>
        <p className="text-sm font-normal text-neutral-500 mt-1">
          Capital a accumuler d&apos;ici vos {retirementAge} ans
        </p>
      </div>
    </>
  );
}
