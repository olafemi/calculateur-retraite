/**
 * StepIdentite — Step 1: Prenom, Nom, Sexe, Date de naissance.
 *
 * Reads from and writes to the Zustand store.
 * Validates individual fields on blur.
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { TextInput } from "../ui/TextInput.tsx";
import { RadioGroup } from "../ui/RadioGroup.tsx";
import { DateOfBirthSelect } from "./DateOfBirthSelect.tsx";
import { useStep1Data, useRetraiteStore } from "../../stores/retraiteStore.ts";
import {
  validatePrenom,
  validateNom,
  validateSexe,
  validateDateNaissance,
} from "../../utils/validation.ts";
import type { Step1Errors } from "../../types/retraite.ts";

interface StepIdentiteProps {
  errors: Step1Errors;
  onClearError: (field: string) => void;
}

export function StepIdentite({ errors: externalErrors, onClearError }: StepIdentiteProps) {
  const data = useStep1Data();
  const store = useRetraiteStore();

  // Local blur errors merged with external (from Suivant click)
  const [blurErrors, setBlurErrors] = useState<Step1Errors>({});

  const firstFieldRef = useRef<HTMLDivElement>(null);

  // Focus first field on mount
  useEffect(() => {
    const input = firstFieldRef.current?.querySelector("input");
    input?.focus();
  }, []);

  // Merge external and blur errors (external takes priority)
  const mergedErrors: Step1Errors = { ...blurErrors, ...externalErrors };

  // Clear error when field value changes
  const handlePrenomChange = useCallback(
    (value: string) => {
      store.setPrenom(value);
      if (mergedErrors.prenom) {
        setBlurErrors((prev) => {
          const next = { ...prev };
          delete next.prenom;
          return next;
        });
        onClearError("prenom");
      }
    },
    [store, mergedErrors.prenom, onClearError]
  );

  const handleNomChange = useCallback(
    (value: string) => {
      store.setNom(value);
      if (mergedErrors.nom) {
        setBlurErrors((prev) => {
          const next = { ...prev };
          delete next.nom;
          return next;
        });
        onClearError("nom");
      }
    },
    [store, mergedErrors.nom, onClearError]
  );

  const handleSexeChange = useCallback(
    (value: string) => {
      store.setSexe(value as "homme" | "femme");
      setBlurErrors((prev) => {
        const next = { ...prev };
        delete next.sexe;
        return next;
      });
      onClearError("sexe");
    },
    [store, onClearError]
  );

  const handleDateChange = useCallback(
    (
      field: "jour" | "mois" | "annee",
      value: number | null
    ) => {
      if (field === "jour") store.setJourNaissance(value);
      if (field === "mois") store.setMoisNaissance(value);
      if (field === "annee") store.setAnneeNaissance(value);
      if (mergedErrors.dateNaissance) {
        setBlurErrors((prev) => {
          const next = { ...prev };
          delete next.dateNaissance;
          return next;
        });
        onClearError("dateNaissance");
      }
    },
    [store, mergedErrors.dateNaissance, onClearError]
  );

  // On blur validators
  const handlePrenomBlur = useCallback(() => {
    const err = validatePrenom(data.prenom);
    if (err) setBlurErrors((prev) => ({ ...prev, prenom: err }));
  }, [data.prenom]);

  const handleNomBlur = useCallback(() => {
    const err = validateNom(data.nom);
    if (err) setBlurErrors((prev) => ({ ...prev, nom: err }));
  }, [data.nom]);

  const handleSexeBlur = useCallback(() => {
    const err = validateSexe(data.sexe);
    if (err) setBlurErrors((prev) => ({ ...prev, sexe: err }));
  }, [data.sexe]);

  const handleDateBlur = useCallback(() => {
    // Only validate if at least one field has been touched
    if (data.jourNaissance !== null || data.moisNaissance !== null || data.anneeNaissance !== null) {
      const err = validateDateNaissance(
        data.jourNaissance,
        data.moisNaissance,
        data.anneeNaissance
      );
      if (err) setBlurErrors((prev) => ({ ...prev, dateNaissance: err }));
    }
  }, [data.jourNaissance, data.moisNaissance, data.anneeNaissance]);

  return (
    <div>
      {/* Step title */}
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
        Qui etes-vous ?
      </h2>
      <p className="mt-1 text-sm md:text-base text-neutral-500">
        Ces informations nous aident a personnaliser votre simulation.
      </p>

      {/* Form fields */}
      <div className="mt-6 space-y-5">
        {/* Prenom */}
        <div ref={firstFieldRef}>
          <TextInput
            id="prenom"
            label="Prenom"
            value={data.prenom}
            placeholder="Ex : Fatou"
            error={mergedErrors.prenom}
            maxLength={50}
            onChange={handlePrenomChange}
            onBlur={handlePrenomBlur}
          />
        </div>

        {/* Nom */}
        <TextInput
          id="nom"
          label="Nom"
          value={data.nom}
          placeholder="Ex : Adjovi"
          error={mergedErrors.nom}
          maxLength={50}
          onChange={handleNomChange}
          onBlur={handleNomBlur}
        />

        {/* Sexe */}
        <RadioGroup
          name="sexe"
          legend="Sexe"
          value={data.sexe}
          options={[
            { value: "homme", label: "Homme" },
            { value: "femme", label: "Femme" },
          ]}
          error={mergedErrors.sexe}
          onChange={handleSexeChange}
          onBlur={handleSexeBlur}
        />

        {/* Date de naissance */}
        <DateOfBirthSelect
          jourValue={data.jourNaissance}
          moisValue={data.moisNaissance}
          anneeValue={data.anneeNaissance}
          error={mergedErrors.dateNaissance}
          onJourChange={(v) => handleDateChange("jour", v)}
          onMoisChange={(v) => handleDateChange("mois", v)}
          onAnneeChange={(v) => handleDateChange("annee", v)}
          onBlur={handleDateBlur}
        />
      </div>
    </div>
  );
}
