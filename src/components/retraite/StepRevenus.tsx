/**
 * StepRevenus — Step 4: Two FCFA currency inputs with dynamic labels.
 *
 * Salaire label and helper adapt based on statut from Step 2.
 * Shows warnings when revenu retraite > salaire actuel.
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { CurrencyInput } from "./CurrencyInput.tsx";
import {
  useStep4Data,
  useRetraiteStore,
} from "../../stores/retraiteStore.ts";
import {
  validateStep4Field,
  getStep4Warnings,
} from "../../utils/validation.ts";
import { STEP4_COPY_BY_STATUT } from "../../types/retraite.ts";
import type { Step4Errors, Step4Field } from "../../types/retraite.ts";

interface StepRevenusProps {
  errors: Step4Errors;
  onClearError: (field: string) => void;
}

export function StepRevenus({ errors: externalErrors, onClearError }: StepRevenusProps) {
  const data = useStep4Data();
  const store = useRetraiteStore();
  const statut = store.statut;
  const containerRef = useRef<HTMLDivElement>(null);

  const [blurErrors, setBlurErrors] = useState<Step4Errors>({});

  // Focus first input on mount
  useEffect(() => {
    const input = containerRef.current?.querySelector("input");
    input?.focus();
  }, []);

  // Merge external and blur errors
  const mergedErrors: Step4Errors = { ...blurErrors, ...externalErrors };

  // Get dynamic copy for salaire field based on statut
  const copyDeck = STEP4_COPY_BY_STATUT[statut ?? "autre"];

  // Compute warnings
  const warnings = getStep4Warnings({
    salaireActuel: data.salaireActuel,
    revenuRetraite: data.revenuRetraite,
  });
  const revenuWarning = warnings.find((w) => w.field === "revenuRetraite")?.message ?? null;

  // Handlers
  const handleSalaireChange = useCallback(
    (value: number | null) => {
      store.setSalaireActuel(value);
      if (mergedErrors.salaireActuel) {
        setBlurErrors((prev) => {
          const next = { ...prev };
          delete next.salaireActuel;
          return next;
        });
        onClearError("salaireActuel");
      }
    },
    [store, mergedErrors.salaireActuel, onClearError]
  );

  const handleRevenuChange = useCallback(
    (value: number | null) => {
      store.setRevenuRetraite(value);
      if (mergedErrors.revenuRetraite) {
        setBlurErrors((prev) => {
          const next = { ...prev };
          delete next.revenuRetraite;
          return next;
        });
        onClearError("revenuRetraite");
      }
    },
    [store, mergedErrors.revenuRetraite, onClearError]
  );

  const isSalarie = statut === "salarie";

  const handleSalaireBlur = useCallback(() => {
    const err = validateStep4Field("salaireActuel" as Step4Field, {
      salaireActuel: data.salaireActuel,
      revenuRetraite: data.revenuRetraite,
    }, statut);
    if (err) {
      setBlurErrors((prev) => ({ ...prev, salaireActuel: err }));
    }
  }, [data.salaireActuel, data.revenuRetraite, statut]);

  const handleRevenuBlur = useCallback(() => {
    const err = validateStep4Field("revenuRetraite" as Step4Field, {
      salaireActuel: data.salaireActuel,
      revenuRetraite: data.revenuRetraite,
    }, statut);
    if (err) {
      setBlurErrors((prev) => ({ ...prev, revenuRetraite: err }));
    }
  }, [data.salaireActuel, data.revenuRetraite, statut]);

  return (
    <div ref={containerRef}>
      {/* Step title */}
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
        Parlons de vos revenus
      </h2>
      <p className="mt-1 text-sm md:text-base text-neutral-500">
        Ces montants nous permettent de calculer votre effort d&apos;epargne.
      </p>

      {/* Form fields */}
      <div className="mt-6 space-y-5">
        {/* Salaire actuel */}
        <CurrencyInput
          id="salaire-actuel"
          label={isSalarie ? copyDeck.salaireLabel : `${copyDeck.salaireLabel} (optionnel)`}
          value={data.salaireActuel}
          placeholder="Ex : 250 000"
          helperText={isSalarie ? copyDeck.salaireHelper : "Optionnel. Si renseigne, nous afficherons votre taux d'effort."}
          error={mergedErrors.salaireActuel}
          onChange={handleSalaireChange}
          onBlur={handleSalaireBlur}
        />

        {/* Revenu retraite */}
        <CurrencyInput
          id="revenu-retraite"
          label="Revenu souhaite a la retraite (par mois)"
          value={data.revenuRetraite}
          placeholder="Ex : 200 000"
          helperText="Le montant mensuel dont vous auriez besoin pour vivre confortablement."
          error={mergedErrors.revenuRetraite}
          warning={!mergedErrors.revenuRetraite ? revenuWarning : null}
          onChange={handleRevenuChange}
          onBlur={handleRevenuBlur}
        />
      </div>
    </div>
  );
}
