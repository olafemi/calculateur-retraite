/**
 * ResultsBreakdown — "Comment ca marche ?" summary table.
 *
 * Displays 5 rows of savings breakdown data in a definition-list style layout.
 * Conditionally shows savings rate percentage (hidden when > 100%).
 */

interface ResultsBreakdownProps {
  epargneMensuelle: number;
  yearsToRetirement: number;
  totalContributions: number;
  totalInterestEarned: number;
  capitalCible: number;
  savingsRatePercent: number;
  capitalDisponible: number;
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

interface BreakdownRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
  isLast?: boolean;
}

function BreakdownRow({ label, value, isTotal, isLast }: BreakdownRowProps) {
  if (isTotal) {
    return (
      <div className="flex justify-between items-baseline py-2.5 border-t-2 border-primary-700/20 pt-3 mt-1">
        <span className="text-sm text-neutral-900 font-semibold">{label}</span>
        <span className="text-base text-primary-700 font-bold tabular-nums">
          {value}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-between items-baseline py-2.5 ${
        !isLast ? "border-b border-neutral-100" : ""
      }`}
    >
      <span className="text-sm text-neutral-700 font-normal">{label}</span>
      <span className="text-sm text-neutral-900 font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function ResultsBreakdown({
  epargneMensuelle,
  yearsToRetirement,
  totalContributions,
  totalInterestEarned,
  capitalCible,
  savingsRatePercent,
  capitalDisponible,
}: ResultsBreakdownProps) {
  return (
    <div className="border border-neutral-200 rounded-lg px-6 py-5 mt-4">
      <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-4">
        Comment ca marche ?
      </h3>

      <div>
        <BreakdownRow
          label="Vous epargnez"
          value={`${formatAmount(epargneMensuelle)} FCFA/mois`}
        />
        <BreakdownRow
          label="Pendant"
          value={`${yearsToRetirement} ans`}
        />
        <BreakdownRow
          label="Total de vos versements"
          value={`${formatAmount(totalContributions)} FCFA`}
        />
        {capitalDisponible > 0 && (
          <BreakdownRow
            label="Capital deja disponible"
            value={`${formatAmount(capitalDisponible)} FCFA`}
          />
        )}
        <BreakdownRow
          label="Les interets generes"
          value={`${formatAmount(totalInterestEarned)} FCFA`}
          isLast
        />
        <BreakdownRow
          label="Vous accumulez"
          value={`${formatAmount(capitalCible)} FCFA`}
          isTotal
        />
      </div>

      {/* Savings rate — only shown if salary provided and <= 100% */}
      {savingsRatePercent > 0 && savingsRatePercent <= 100 && (
        <div className="mt-4 pt-3 border-t border-neutral-200">
          <p className="text-sm text-neutral-500 font-normal">
            Le taux d&apos;effort :{" "}
            <span className="font-semibold text-neutral-700">
              {savingsRatePercent.toFixed(1).replace(".", ",")}%
            </span>{" "}
            de votre salaire actuel
          </p>
        </div>
      )}
    </div>
  );
}
