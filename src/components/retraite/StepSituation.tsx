/**
 * StepSituation — Step 2: Statut professionnel (card select).
 *
 * Four selectable cards: Salarie, Freelance, Etudiant, Autre.
 * Selection immediately clears any error.
 */
import { useCallback, useEffect, useRef } from "react";
import { CardSelect } from "../ui/CardSelect.tsx";
import { useStep2Data, useRetraiteStore } from "../../stores/retraiteStore.ts";
import { STATUT_OPTIONS } from "../../types/retraite.ts";
import type { Step2Errors } from "../../types/retraite.ts";

interface StepSituationProps {
  errors: Step2Errors;
  onClearError: (field: string) => void;
}

export function StepSituation({ errors, onClearError }: StepSituationProps) {
  const data = useStep2Data();
  const store = useRetraiteStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the first card on mount
  useEffect(() => {
    const firstInput = containerRef.current?.querySelector("input");
    firstInput?.focus();
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      store.setStatut(value as "salarie" | "freelance" | "etudiant" | "autre");
      if (errors.statut) {
        onClearError("statut");
      }
    },
    [store, errors.statut, onClearError]
  );

  return (
    <div ref={containerRef}>
      {/* Step title */}
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
        Quelle est votre situation ?
      </h2>
      <p className="mt-1 text-sm md:text-base text-neutral-500">
        Cela nous aide a adapter nos conseils.
      </p>

      {/* Card select */}
      <div className="mt-6">
        <CardSelect
          name="statut"
          legend="Statut professionnel"
          value={data.statut}
          options={STATUT_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
            description: opt.description,
          }))}
          error={errors.statut}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
