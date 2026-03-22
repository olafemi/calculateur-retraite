/**
 * ResultsAssumptions — "Ajustez vos hypotheses" adjustable sliders section.
 *
 * Contains 3 sliders (rendement, inflation, esperance de vie),
 * derived values display, optional high-return-rate warning, and disclaimer.
 *
 * Reads adjustable params from the store via useResultsParams().
 *
 * The life expectancy section exposes two complementary controls:
 *   - A RangeSlider for "Esperance de vie" (how long will I live?)
 *   - A NumberInput for "Duree de votre retraite" (how many years of retirement?)
 * Both controls stay in sync: editing one updates the other.
 * The NumberInput uses local state with commit-on-blur to avoid mid-type clamping.
 */
import { useRetraiteStore, useResultsParams } from "../../stores/retraiteStore.ts";
import { CALCULATION_PARAM_CONSTRAINTS } from "../../types/retraiteResults.ts";
import { RangeSlider } from "../ui/RangeSlider.tsx";
import { FieldMessage } from "../ui/FieldMessage.tsx";

interface ResultsAssumptionsProps {
  retirementAge: number;
  retirementDurationYears: number;
  realReturnRate: number;
}

/** Format a decimal as a percentage string with given decimal places, French separator. */
function formatPercent(decimal: number, decimals: number = 0): string {
  return (decimal * 100).toFixed(decimals).replace(".", ",");
}

export function ResultsAssumptions({
  retirementAge,
  retirementDurationYears,
  realReturnRate,
}: ResultsAssumptionsProps) {
  const params = useResultsParams();
  const setAnnualReturnRate = useRetraiteStore((s) => s.setAnnualReturnRate);
  const setAnnualInflationRate = useRetraiteStore(
    (s) => s.setAnnualInflationRate
  );
  const setLifeExpectancy = useRetraiteStore((s) => s.setLifeExpectancy);

  const maxDuration = 100 - retirementAge;
  const showReturnWarning = params.annualReturnRate > 0.15;

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-6 py-6 mt-6">
      <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-6">
        Ajustez vos hypotheses
      </h3>

      <div className="space-y-6">
        {/* Slider 1: Rendement annuel estime */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label
              htmlFor="rendement-slider"
              className="text-sm font-medium text-neutral-700"
            >
              Rendement annuel estime
            </label>
            <span className="text-sm font-semibold text-primary-700">
              {formatPercent(params.annualReturnRate)} % par an
            </span>
          </div>
          <RangeSlider
            id="rendement-slider"
            value={params.annualReturnRate}
            min={CALCULATION_PARAM_CONSTRAINTS.annualReturnRate.min}
            max={CALCULATION_PARAM_CONSTRAINTS.annualReturnRate.max}
            step={CALCULATION_PARAM_CONSTRAINTS.annualReturnRate.step}
            minLabel="0%"
            maxLabel="20%"
            ariaValueText={`${formatPercent(params.annualReturnRate)} pourcent par an`}
            ariaDescribedBy={showReturnWarning ? "rendement-warning" : undefined}
            onChange={setAnnualReturnRate}
          />
          {showReturnWarning && (
            <div className="mt-2">
              <FieldMessage
                id="rendement-warning"
                type="warning"
                message="Un rendement superieur a 15% est tres rare sur le long terme. Soyez prudent dans vos projections."
              />
            </div>
          )}
        </div>

        {/* Slider 2: Inflation annuelle estimee */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label
              htmlFor="inflation-slider"
              className="text-sm font-medium text-neutral-700"
            >
              Inflation annuelle estimee
            </label>
            <span className="text-sm font-semibold text-primary-700">
              {formatPercent(params.annualInflationRate)} % par an
            </span>
          </div>
          <RangeSlider
            id="inflation-slider"
            value={params.annualInflationRate}
            min={CALCULATION_PARAM_CONSTRAINTS.annualInflationRate.min}
            max={CALCULATION_PARAM_CONSTRAINTS.annualInflationRate.max}
            step={CALCULATION_PARAM_CONSTRAINTS.annualInflationRate.step}
            minLabel="0%"
            maxLabel="10%"
            ariaValueText={`${formatPercent(params.annualInflationRate)} pourcent par an`}
            onChange={setAnnualInflationRate}
          />
        </div>

        {/* Slider 3: Duree de retraite (contrôle principal) */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label
              htmlFor="duree-retraite-slider"
              className="text-sm font-medium text-neutral-700"
            >
              Duree de la retraite
            </label>
            <span className="text-sm font-semibold text-primary-700">
              {retirementDurationYears} ans
            </span>
          </div>
          <RangeSlider
            id="duree-retraite-slider"
            value={retirementDurationYears}
            min={1}
            max={maxDuration}
            step={1}
            minLabel="1 an"
            maxLabel={`${maxDuration} ans`}
            ariaValueText={`${retirementDurationYears} ans de retraite`}
            onChange={(val) => setLifeExpectancy(retirementAge + val)}
          />
          <p className="text-xs text-neutral-400 mt-1.5">
            Esperance de vie correspondante : {params.lifeExpectancy} ans
          </p>
        </div>
      </div>

      {/* Derived values */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="bg-white border border-neutral-200 rounded-md px-4 py-3 mt-6"
      >
        <div className="flex justify-between items-baseline py-1.5">
          <span className="text-sm text-neutral-500 font-normal">
            Rendement reel (apres inflation)
          </span>
          <span className="text-sm text-neutral-900 font-semibold tabular-nums">
            ~{formatPercent(realReturnRate, 1)} % par an
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
        Ces projections sont basees sur des hypotheses et ne constituent pas un
        conseil financier. Les rendements passes ne garantissent pas les
        rendements futurs.
      </p>
    </div>
  );
}
