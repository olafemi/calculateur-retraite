/**
 * ResultsPrimaryCard — Hero card displaying "Votre effort mensuel".
 *
 * The most visually prominent element on the results page.
 * Uses aria-live for screen reader announcements on recalculation.
 */

interface ResultsPrimaryCardProps {
  epargneMensuelle: number;
}

export function ResultsPrimaryCard({ epargneMensuelle }: ResultsPrimaryCardProps) {
  // Format number with French locale thousand separators
  const formatted = new Intl.NumberFormat("fr-FR").format(epargneMensuelle);

  return (
    <div className="bg-primary-50 border border-primary-700/20 rounded-lg px-6 py-6 md:py-8 text-center">
      <p className="text-sm md:text-base font-medium text-primary-800 uppercase tracking-wide">
        Votre effort mensuel
      </p>
      <div aria-live="polite" aria-atomic="true">
        <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-700 mt-3 tabular-nums">
          {formatted}{" "}
          <span className="text-2xl md:text-3xl font-bold">FCFA</span>
        </p>
        <p className="text-base md:text-lg font-normal text-primary-700/70 mt-1">
          / mois
        </p>
      </div>
    </div>
  );
}
