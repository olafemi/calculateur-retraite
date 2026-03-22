/**
 * DateOfBirthSelect — 3-select composite for Jour / Mois / Annee.
 *
 * Dynamically adjusts day count based on selected month/year.
 * Annee in descending order (most recent first).
 * Shared label above, shared error below.
 */
import { useMemo } from "react";
import { SelectInput } from "../ui/SelectInput.tsx";
import { FieldMessage } from "../ui/FieldMessage.tsx";
import { getDaysInMonth } from "../../utils/validation.ts";
import { MONTH_NAMES, AGE_CONSTRAINTS } from "../../types/retraite.ts";

interface DateOfBirthSelectProps {
  jourValue: number | null;
  moisValue: number | null;
  anneeValue: number | null;
  error?: string | null;
  onJourChange: (value: number | null) => void;
  onMoisChange: (value: number | null) => void;
  onAnneeChange: (value: number | null) => void;
  onBlur?: () => void;
}

export function DateOfBirthSelect({
  jourValue,
  moisValue,
  anneeValue,
  error,
  onJourChange,
  onMoisChange,
  onAnneeChange,
  onBlur,
}: DateOfBirthSelectProps) {
  const currentYear = new Date().getFullYear();
  const maxBirthYear = currentYear - AGE_CONSTRAINTS.minAge;

  // Day options: dynamically adjusted based on month/year
  const maxDays = getDaysInMonth(moisValue, anneeValue);
  const dayOptions = useMemo(
    () =>
      Array.from({ length: maxDays }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
    [maxDays]
  );

  // Month options
  const monthOptions = useMemo(
    () =>
      MONTH_NAMES.map((name, index) => ({
        value: index + 1,
        label: name,
      })),
    []
  );

  // Year options (descending)
  const yearOptions = useMemo(
    () =>
      Array.from({ length: maxBirthYear - AGE_CONSTRAINTS.minBirthYear + 1 }, (_, i) => {
        const year = maxBirthYear - i;
        return { value: year, label: String(year) };
      }),
    [maxBirthYear]
  );

  const errorId = error ? "date-naissance-error" : undefined;

  // Pass a non-empty placeholder error to child selects so their borders turn red.
  // The actual error message is displayed once below the row.
  const childError = error ? " " : undefined;

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Date de naissance
      </label>
      <div className="flex gap-2" role="group" aria-label="Date de naissance">
        <div className="flex-1">
          <SelectInput
            id="jour-naissance"
            value={jourValue}
            placeholder="Jour"
            options={dayOptions}
            error={childError}
            onChange={(val) => onJourChange(val ? Number(val) : null)}
            onBlur={onBlur}
            describedBy={errorId}
          />
        </div>
        <div className="flex-[2]">
          <SelectInput
            id="mois-naissance"
            value={moisValue}
            placeholder="Mois"
            options={monthOptions}
            error={childError}
            onChange={(val) => onMoisChange(val ? Number(val) : null)}
            onBlur={onBlur}
            describedBy={errorId}
          />
        </div>
        <div className="flex-[1.5]">
          <SelectInput
            id="annee-naissance"
            value={anneeValue}
            placeholder="Annee"
            options={yearOptions}
            error={childError}
            onChange={(val) => onAnneeChange(val ? Number(val) : null)}
            onBlur={onBlur}
            describedBy={errorId}
          />
        </div>
      </div>
      {error && <FieldMessage id={errorId} type="error" message={error} />}
    </div>
  );
}
