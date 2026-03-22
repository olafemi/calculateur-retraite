/**
 * ResultsUserSummary — Summary card showing user info on the results page.
 *
 * Read-only: Date de naissance, Statut professionnel
 * Editable:  Age de depart, Salaire actuel, Revenu souhaite
 *
 * Editable fields trigger instant recalculation of results.
 *
 * BUG FIXES:
 * - Age input uses local state so the user can type freely; value is
 *   committed and clamped only on blur (prevents immediate clamping
 *   that made it impossible to type two-digit numbers).
 * - Salary and revenu inputs allow empty state without redirecting
 *   the user back to the wizard (the StepResults guard no longer
 *   checks for null salary/revenu).
 *
 * CRITICAL: Uses useShallow for the object-returning selector
 * to prevent infinite re-render loops with Zustand 5 + React 19.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useRetraiteStore } from "../../stores/retraiteStore.ts";
import { computeAge } from "../../utils/validation.ts";
import { parseFCFAInput, formatFCFAInput } from "../../utils/validation.ts";
import { STATUT_OPTIONS, MONTH_NAMES } from "../../types/retraite.ts";
import type { StatutProfessionnel } from "../../types/retraite.ts";

/** Read-only label/value row. */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-2.5 gap-4">
      <span className="text-sm text-neutral-500 font-normal">{label}</span>
      <span className="text-sm text-neutral-900 font-semibold text-right">
        {value}
      </span>
    </div>
  );
}

/** Format date as "DD Mois AAAA (XX ans)". */
function formatDateWithAge(
  jour: number | null,
  mois: number | null,
  annee: number | null,
  age: number | null
): string {
  if (jour === null || mois === null || annee === null) return "\u2014";
  const monthName = MONTH_NAMES[mois - 1] ?? "";
  const dateStr = `${jour} ${monthName} ${annee}`;
  return age !== null ? `${dateStr} (${age} ans)` : dateStr;
}

/** Look up French label for a statut value. */
function formatStatut(statut: StatutProfessionnel | null): string {
  if (statut === null) return "\u2014";
  const option = STATUT_OPTIONS.find((o) => o.value === statut);
  return option ? option.label : "\u2014";
}

export function ResultsUserSummary() {
  const data = useRetraiteStore(
    useShallow((s) => ({
      jourNaissance: s.jourNaissance,
      moisNaissance: s.moisNaissance,
      anneeNaissance: s.anneeNaissance,
      statut: s.statut,
      ageRetraite: s.ageRetraite,
      salaireActuel: s.salaireActuel,
      revenuRetraite: s.revenuRetraite,
    }))
  );

  const setAgeRetraite = useRetraiteStore((s) => s.setAgeRetraite);
  const setSalaireActuel = useRetraiteStore((s) => s.setSalaireActuel);
  const setRevenuRetraite = useRetraiteStore((s) => s.setRevenuRetraite);

  const currentAge = useMemo(
    () => computeAge(data.jourNaissance, data.moisNaissance, data.anneeNaissance),
    [data.jourNaissance, data.moisNaissance, data.anneeNaissance]
  );


  // ---- Age input: local state for free typing, commit on blur ----
  const [localAge, setLocalAge] = useState(data.ageRetraite.toString());
  const [ageIsFocused, setAgeIsFocused] = useState(false);

  // Sync local state when store value changes externally (e.g., slider)
  // but only when the field is NOT focused (don't overwrite user mid-edit).
  useEffect(() => {
    if (!ageIsFocused) {
      setLocalAge(data.ageRetraite.toString());
    }
  }, [data.ageRetraite, ageIsFocused]);

  const handleAgeFocus = useCallback(() => {
    setAgeIsFocused(true);
  }, []);

  const handleAgeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow only digits, let user type freely
      const raw = e.target.value.replace(/\D/g, "");
      setLocalAge(raw);
    },
    []
  );

  const handleAgeBlur = useCallback(() => {
    setAgeIsFocused(false);
    const num = parseInt(localAge, 10);
    if (isNaN(num) || localAge === "") {
      // Reset to current store value
      setLocalAge(data.ageRetraite.toString());
      return;
    }
    // setAgeRetraite clamps to valid range internally
    setAgeRetraite(num);
  }, [localAge, data.ageRetraite, setAgeRetraite]);

  const handleSalaireChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFCFAInput(e.target.value);
      setSalaireActuel(parsed);
    },
    [setSalaireActuel]
  );

  const handleRevenuChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFCFAInput(e.target.value);
      setRevenuRetraite(parsed);
    },
    [setRevenuRetraite]
  );

  return (
    <div className="bg-white border border-neutral-200 rounded-lg px-5 py-5 mt-6">
      <h3 className="text-base md:text-lg font-bold text-neutral-900 mb-3">
        Vos informations
      </h3>

      {/* Read-only rows */}
      <div className="divide-y divide-neutral-100">
        <SummaryRow
          label="Date de naissance"
          value={formatDateWithAge(
            data.jourNaissance,
            data.moisNaissance,
            data.anneeNaissance,
            currentAge
          )}
        />
        <SummaryRow
          label="Statut professionnel"
          value={formatStatut(data.statut)}
        />
      </div>

      {/* Separator */}
      <div className="border-t border-neutral-200 my-3" />

      {/* Editable fields */}
      <div className="space-y-4">
        {/* Age de depart */}
        <div className="flex justify-between items-center gap-4">
          <label
            htmlFor="summary-age-retraite"
            className="text-sm text-neutral-500 font-normal"
          >
            Age de depart a la retraite
          </label>
          <div className="relative inline-flex items-center">
            <input
              id="summary-age-retraite"
              type="text"
              inputMode="numeric"
              value={localAge}
              onChange={handleAgeChange}
              onFocus={handleAgeFocus}
              onBlur={handleAgeBlur}
              aria-label="Age de depart a la retraite"
              className="w-20 h-9 text-center text-sm text-neutral-900 font-semibold bg-neutral-50 border border-neutral-200 rounded-md transition-colors duration-150 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20 focus:outline-none pr-9"
            />
            <span className="absolute right-2.5 text-xs font-medium text-neutral-400 pointer-events-none">
              ans
            </span>
          </div>
        </div>

        {/* Salaire actuel — shown only if salarié or if a value was provided */}
        {(data.statut === "salarie" || (data.salaireActuel !== null && data.salaireActuel > 0)) && (
          <div className="flex justify-between items-center gap-4">
            <label
              htmlFor="summary-salaire"
              className="text-sm text-neutral-500 font-normal"
            >
              {data.statut === "salarie" ? "Salaire actuel" : "Revenu mensuel"}
            </label>
            <div className="relative inline-flex items-center">
              <input
                id="summary-salaire"
                type="text"
                inputMode="numeric"
                value={formatFCFAInput(data.salaireActuel)}
                onChange={handleSalaireChange}
                aria-label="Salaire actuel en FCFA"
                className="w-36 h-9 text-right text-sm text-neutral-900 font-semibold bg-neutral-50 border border-neutral-200 rounded-md transition-colors duration-150 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20 focus:outline-none pr-12"
              />
              <span className="absolute right-2.5 text-xs font-medium text-neutral-400 pointer-events-none">
                FCFA
              </span>
            </div>
          </div>
        )}

        {/* Revenu souhaite */}
        <div className="flex justify-between items-center gap-4">
          <label
            htmlFor="summary-revenu"
            className="text-sm text-neutral-500 font-normal"
          >
            Revenu souhaite a la retraite
          </label>
          <div className="relative inline-flex items-center">
            <input
              id="summary-revenu"
              type="text"
              inputMode="numeric"
              value={formatFCFAInput(data.revenuRetraite)}
              onChange={handleRevenuChange}
              aria-label="Revenu souhaite a la retraite en FCFA"
              className="w-36 h-9 text-right text-sm text-neutral-900 font-semibold bg-neutral-50 border border-neutral-200 rounded-md transition-colors duration-150 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20 focus:outline-none pr-12"
            />
            <span className="absolute right-2.5 text-xs font-medium text-neutral-400 pointer-events-none">
              FCFA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
