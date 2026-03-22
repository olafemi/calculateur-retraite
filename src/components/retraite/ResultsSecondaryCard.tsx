/**
 * ResultsSecondaryCard — "Ce qu'il vous faut" capital target card.
 */

interface ResultsSecondaryCardProps {
  capitalCible: number;
  retirementAge: number;
}

export function ResultsSecondaryCard({
  capitalCible,
  retirementAge,
}: ResultsSecondaryCardProps) {
  const formatted = new Intl.NumberFormat("fr-FR").format(capitalCible);

  return (
    <div className="border border-neutral-200 rounded-lg px-6 py-5 mt-4">
      <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
        Ce qu&apos;il vous faut
      </p>
      <p className="text-2xl md:text-3xl font-bold text-neutral-900 mt-2 tabular-nums">
        {formatted}&nbsp;FCFA
      </p>
      <p className="text-sm font-normal text-neutral-500 mt-1">
        Capital a accumuler d&apos;ici vos {retirementAge} ans
      </p>
    </div>
  );
}
