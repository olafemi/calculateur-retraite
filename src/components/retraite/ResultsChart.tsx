/**
 * ResultsChart — "Evolution de votre epargne" stacked area chart.
 *
 * Uses Recharts with isAnimationActive={false} for slider performance.
 * Wrapped in a <figure> with accessible description.
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "../../types/retraiteResults.ts";

interface ResultsChartProps {
  chartData: ChartDataPoint[];
  currentAge: number;
  retirementAge: number;
  capitalCible: number;
  totalContributions: number;
  totalInterestEarned: number;
}

/** Abbreviate large numbers for Y-axis ticks. */
function formatYAxisTick(value: number): string {
  if (value >= 1_000_000_000)
    return `${(value / 1_000_000_000).toFixed(0)}Md`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return new Intl.NumberFormat("fr-FR").format(value);
}

/** Custom tooltip matching the design system. */
function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const fmt = (v: number) => new Intl.NumberFormat("fr-FR").format(v);

  return (
    <div className="bg-white border border-neutral-200 shadow-card rounded-md px-4 py-3">
      <p className="text-xs md:text-sm text-neutral-500 mb-1.5">
        Age : <span className="font-semibold text-neutral-900">{data.age} ans</span>
      </p>
      <p className="text-xs md:text-sm text-neutral-500">
        Vos versements :{" "}
        <span className="font-semibold text-neutral-900">{fmt(data.contributions)}</span>
      </p>
      <p className="text-xs md:text-sm text-neutral-500">
        Interets cumules :{" "}
        <span className="font-semibold text-neutral-900">{fmt(data.interest)}</span>
      </p>
      <p className="text-xs md:text-sm text-primary-700 font-bold border-t border-neutral-100 pt-1.5 mt-1.5">
        Total : {fmt(data.total)} FCFA
      </p>
    </div>
  );
}

export function ResultsChart({
  chartData,
  currentAge,
  retirementAge,
  capitalCible,
  totalContributions,
  totalInterestEarned,
}: ResultsChartProps) {
  const fmtFCFA = (v: number) => new Intl.NumberFormat("fr-FR").format(v);

  return (
    <div className="border border-neutral-200 rounded-lg px-4 py-5 md:px-6 mt-4">
      <figure
        role="img"
        aria-label={`Graphique : evolution de votre epargne de ${currentAge} a ${retirementAge} ans, total ${fmtFCFA(capitalCible)} FCFA dont ${fmtFCFA(totalContributions)} FCFA de versements et ${fmtFCFA(totalInterestEarned)} FCFA d'interets.`}
      >
        <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-4">
          Evolution de votre epargne
        </h3>

        <div aria-hidden="true" className="h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="age"
                type="number"
                domain={["dataMin", "dataMax"]}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tickFormatter={formatYAxisTick}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="contributions"
                stackId="1"
                fill="#1A6B5E"
                stroke="#1A6B5E"
                fillOpacity={0.7}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="interest"
                stackId="1"
                fill="#E6F4F1"
                stroke="#21856F"
                fillOpacity={0.8}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-700 flex-shrink-0" />
            Vos versements
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-100 border border-primary-600 flex-shrink-0" />
            Interets cumules
          </div>
        </div>
      </figure>
    </div>
  );
}
