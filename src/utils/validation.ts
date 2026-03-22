/**
 * =============================================================================
 * Retirement Calculator — Validation Utilities
 * =============================================================================
 *
 * Pure validation functions for each wizard step.
 * These are framework-agnostic (no React, no Zustand imports) and fully testable.
 *
 * Each step has:
 * - A full-step validator (used on "Suivant" click)
 * - Individual field validators (used on blur)
 *
 * Spec reference: docs/specs/milestone-4-wizard.md
 * =============================================================================
 */

import type {
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step1Errors,
  Step2Errors,
  Step3Errors,
  Step4Errors,
  StepValidationResult,
  Step1Field,
  Step2Field,
  Step3Field,
  Step4Field,
  FieldWarning,
} from "../types/retraite";

import { AGE_CONSTRAINTS, FCFA_CONSTRAINTS } from "../types/retraite";

// ---------------------------------------------------------------------------
// Shared Helpers
// ---------------------------------------------------------------------------

/**
 * Regex for valid name characters: letters (including accented), hyphens,
 * spaces, and apostrophes. Unicode-aware.
 */
const NAME_REGEX = /^[\p{L}\s\-']+$/u;

/**
 * Compute the user's current age in full years from date components.
 * Returns null if the date is incomplete or invalid.
 */
export function computeAge(
  jour: number | null,
  mois: number | null,
  annee: number | null,
  referenceDate: Date = new Date()
): number | null {
  if (jour === null || mois === null || annee === null) return null;

  const birthDate = new Date(annee, mois - 1, jour);

  // Check the date is valid (e.g., Feb 30 would roll over to March)
  if (
    birthDate.getFullYear() !== annee ||
    birthDate.getMonth() !== mois - 1 ||
    birthDate.getDate() !== jour
  ) {
    return null; // invalid date
  }

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get the number of days in a given month/year.
 * Used to dynamically adjust the day select in the DOB field.
 */
export function getDaysInMonth(month: number | null, year: number | null): number {
  if (month === null || year === null) return 31; // default max
  // Day 0 of the next month = last day of the given month
  return new Date(year, month, 0).getDate();
}

/**
 * Check if a calendar date is valid (exists).
 */
export function isValidDate(jour: number, mois: number, annee: number): boolean {
  const d = new Date(annee, mois - 1, jour);
  return (
    d.getFullYear() === annee &&
    d.getMonth() === mois - 1 &&
    d.getDate() === jour
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Identite Validation
// ---------------------------------------------------------------------------

/**
 * Validate the "prenom" field.
 * Returns an error message string, or null if valid.
 */
export function validatePrenom(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "Veuillez entrer votre prenom.";
  }
  if (trimmed.length > 50) {
    return "Le prenom ne doit pas depasser 50 caracteres.";
  }
  if (!NAME_REGEX.test(trimmed)) {
    return "Le prenom ne peut contenir que des lettres, espaces, traits d'union et apostrophes.";
  }
  return null;
}

/**
 * Validate the "nom" field.
 * Returns an error message string, or null if valid.
 */
export function validateNom(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "Veuillez entrer votre nom.";
  }
  if (trimmed.length > 50) {
    return "Le nom ne doit pas depasser 50 caracteres.";
  }
  if (!NAME_REGEX.test(trimmed)) {
    return "Le nom ne peut contenir que des lettres, espaces, traits d'union et apostrophes.";
  }
  return null;
}

/**
 * Validate the "sexe" field.
 * Returns an error message string, or null if valid.
 */
export function validateSexe(value: string | null): string | null {
  if (value === null || (value !== "homme" && value !== "femme")) {
    return "Veuillez indiquer votre sexe.";
  }
  return null;
}

/**
 * Validate the date of birth (3 select fields combined).
 * Returns an error message string, or null if valid.
 */
export function validateDateNaissance(
  jour: number | null,
  mois: number | null,
  annee: number | null,
  referenceDate: Date = new Date()
): string | null {
  // Check completeness
  if (jour === null || mois === null || annee === null) {
    return "Veuillez completer votre date de naissance.";
  }

  // Check valid calendar date
  if (!isValidDate(jour, mois, annee)) {
    return "Cette date n'existe pas. Veuillez verifier.";
  }

  // Check age bounds
  const age = computeAge(jour, mois, annee, referenceDate);
  if (age === null) {
    return "Cette date n'existe pas. Veuillez verifier.";
  }
  if (age < AGE_CONSTRAINTS.minAge) {
    return "Vous devez avoir au moins 14 ans pour utiliser cet outil.";
  }
  // Max age is implicitly bounded by minBirthYear (1940), but check explicitly
  // No explicit "too old" message in spec — bounded by year dropdown range

  return null;
}

/**
 * Validate a single field from Step 1 by name.
 * Used for on-blur validation of individual fields.
 */
export function validateStep1Field(
  field: Step1Field,
  data: Step1Data
): string | null {
  switch (field) {
    case "prenom":
      return validatePrenom(data.prenom);
    case "nom":
      return validateNom(data.nom);
    case "sexe":
      return validateSexe(data.sexe);
    case "dateNaissance":
      return validateDateNaissance(
        data.jourNaissance,
        data.moisNaissance,
        data.anneeNaissance
      );
    default:
      return null;
  }
}

/**
 * Validate all fields in Step 1.
 * Returns a full validation result with all errors.
 */
export function validateStep1(data: Step1Data): StepValidationResult<Step1Field> {
  const errors: Step1Errors = {};

  const prenomErr = validatePrenom(data.prenom);
  if (prenomErr) errors.prenom = prenomErr;

  const nomErr = validateNom(data.nom);
  if (nomErr) errors.nom = nomErr;

  const sexeErr = validateSexe(data.sexe);
  if (sexeErr) errors.sexe = sexeErr;

  const dateErr = validateDateNaissance(
    data.jourNaissance,
    data.moisNaissance,
    data.anneeNaissance
  );
  if (dateErr) errors.dateNaissance = dateErr;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings: [],
  };
}

// ---------------------------------------------------------------------------
// Step 2 — Situation Validation
// ---------------------------------------------------------------------------

/**
 * Validate the "statut" field.
 */
export function validateStatut(value: string | null): string | null {
  const validValues = ["salarie", "freelance", "etudiant", "autre"];
  if (value === null || !validValues.includes(value)) {
    return "Veuillez choisir votre situation actuelle.";
  }
  return null;
}

/**
 * Validate a single field from Step 2 by name.
 */
export function validateStep2Field(
  field: Step2Field,
  data: Step2Data
): string | null {
  switch (field) {
    case "statut":
      return validateStatut(data.statut);
    default:
      return null;
  }
}

/**
 * Validate all fields in Step 2.
 */
export function validateStep2(data: Step2Data): StepValidationResult<Step2Field> {
  const errors: Step2Errors = {};

  const statutErr = validateStatut(data.statut);
  if (statutErr) errors.statut = statutErr;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings: [],
  };
}

// ---------------------------------------------------------------------------
// Step 3 — Objectif Validation
// ---------------------------------------------------------------------------

/**
 * Compute the minimum retirement age based on the user's current age.
 * Returns currentAge + 1, or the default retirement age minimum if age can't be computed.
 */
export function getMinRetirementAge(
  jour: number | null,
  mois: number | null,
  annee: number | null
): number {
  const age = computeAge(jour, mois, annee);
  if (age === null) return AGE_CONSTRAINTS.defaultRetirementAge;
  return age + 1;
}

/**
 * Compute the years remaining until retirement.
 */
export function getYearsUntilRetirement(
  currentAge: number,
  retirementAge: number
): number {
  return retirementAge - currentAge;
}

/**
 * Validate the retirement age field.
 *
 * @param ageRetraite - The selected retirement age
 * @param currentAge  - The user's current age (computed from DOB)
 */
export function validateAgeRetraite(
  ageRetraite: number,
  currentAge: number | null
): string | null {
  if (!Number.isInteger(ageRetraite)) {
    return "Veuillez entrer un nombre entier.";
  }

  if (currentAge !== null && ageRetraite <= currentAge) {
    return `L'age de depart doit etre superieur a votre age actuel (${currentAge} ans).`;
  }

  if (ageRetraite > AGE_CONSTRAINTS.maxRetirementAge) {
    return "L'age de depart ne peut pas depasser 80 ans.";
  }

  return null;
}

/**
 * Get warnings for Step 3 (non-blocking).
 */
export function getStep3Warnings(
  currentAge: number | null,
  ageRetraite: number
): FieldWarning[] {
  const warnings: FieldWarning[] = [];

  if (currentAge !== null) {
    const yearsRemaining = ageRetraite - currentAge;

    if (yearsRemaining <= 2) {
      warnings.push({
        field: "ageRetraite",
        message: "Tres peu de temps avant la retraite. Les resultats pourraient etre difficiles a atteindre.",
      });
    } else if (yearsRemaining <= 5) {
      warnings.push({
        field: "ageRetraite",
        message: "Attention : il vous reste peu de temps. L'effort d'epargne sera important.",
      });
    }
  }

  return warnings;
}

/**
 * Validate a single field from Step 3 by name.
 */
export function validateStep3Field(
  field: Step3Field,
  data: Step3Data,
  currentAge: number | null
): string | null {
  switch (field) {
    case "ageRetraite":
      return validateAgeRetraite(data.ageRetraite, currentAge);
    default:
      return null;
  }
}

/**
 * Validate all fields in Step 3.
 */
export function validateStep3(
  data: Step3Data,
  currentAge: number | null
): StepValidationResult<Step3Field> {
  const errors: Step3Errors = {};

  const ageErr = validateAgeRetraite(data.ageRetraite, currentAge);
  if (ageErr) errors.ageRetraite = ageErr;

  const warnings = getStep3Warnings(currentAge, data.ageRetraite);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Step 4 — Revenus Validation
// ---------------------------------------------------------------------------

/**
 * Validate a single FCFA currency field.
 *
 * @param value     - Raw integer value (or null if empty)
 * @param fieldName - Human-readable field name for error messages
 * @param emptyMsg  - Custom message when the field is empty
 */
export function validateFCFAAmount(
  value: number | null,
  emptyMsg: string
): string | null {
  if (value === null || value === 0) {
    return emptyMsg;
  }
  if (value < FCFA_CONSTRAINTS.min) {
    return `Le montant minimum est de 10 000 FCFA.`;
  }
  if (value > FCFA_CONSTRAINTS.max) {
    return `Le montant maximum est de 50 000 000 FCFA.`;
  }
  return null;
}

/**
 * Get warnings for Step 4 (non-blocking).
 */
export function getStep4Warnings(data: Step4Data): FieldWarning[] {
  const warnings: FieldWarning[] = [];

  if (
    data.salaireActuel !== null &&
    data.revenuRetraite !== null &&
    data.salaireActuel > 0
  ) {
    if (data.revenuRetraite > data.salaireActuel) {
      warnings.push({
        field: "revenuRetraite",
        message:
          "Votre revenu souhaite est superieur a votre salaire actuel. C'est possible, mais l'effort d'epargne sera plus eleve.",
      });
    } else if (data.revenuRetraite > data.salaireActuel * 0.8) {
      warnings.push({
        field: "revenuRetraite",
        message:
          "La plupart des experts recommandent de viser entre 50% et 70% de votre salaire actuel.",
      });
    }
  }

  return warnings;
}

/**
 * Validate a single field from Step 4 by name.
 *
 * @param statut - Professional status. Salary validation is skipped
 *                 for non-salariés when the field is empty.
 */
export function validateStep4Field(
  field: Step4Field,
  data: Step4Data,
  statut?: string | null
): string | null {
  switch (field) {
    case "salaireActuel": {
      const salaireRequired = statut === "salarie";
      if (!salaireRequired && (data.salaireActuel === null || data.salaireActuel === 0)) {
        return null; // optional and empty — no error
      }
      return validateFCFAAmount(
        data.salaireActuel,
        "Veuillez entrer votre salaire mensuel."
      );
    }
    case "revenuRetraite":
      return validateFCFAAmount(
        data.revenuRetraite,
        "Veuillez entrer le revenu souhaite a la retraite."
      );
    default:
      return null;
  }
}

/**
 * Validate all fields in Step 4.
 *
 * @param data   - Step 4 form data
 * @param statut - Professional status from Step 2. Salary is required only
 *                 for "salarie"; optional for freelance/etudiant/autre.
 */
export function validateStep4(
  data: Step4Data,
  statut?: string | null
): StepValidationResult<Step4Field> {
  const errors: Step4Errors = {};

  // Salary is required only for salariés
  const salaireRequired = statut === "salarie";
  if (salaireRequired) {
    const salaireErr = validateFCFAAmount(
      data.salaireActuel,
      "Veuillez entrer votre salaire mensuel."
    );
    if (salaireErr) errors.salaireActuel = salaireErr;
  } else if (data.salaireActuel !== null) {
    // If provided voluntarily, still validate min/max
    const salaireErr = validateFCFAAmount(
      data.salaireActuel,
      "" // won't trigger — value is not null
    );
    // Only keep error if it's a range error, not "empty" error
    if (salaireErr && data.salaireActuel > 0) {
      errors.salaireActuel = salaireErr;
    }
  }

  const revenuErr = validateFCFAAmount(
    data.revenuRetraite,
    "Veuillez entrer le revenu souhaite a la retraite."
  );
  if (revenuErr) errors.revenuRetraite = revenuErr;

  const warnings = getStep4Warnings(data);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Cross-step Validation
// ---------------------------------------------------------------------------

/**
 * Validate any step by number. Dispatcher used by the store's nextStep action.
 *
 * @param step        - Which step to validate (1-4)
 * @param formData    - Full wizard form data
 * @param currentAge  - User's current age (needed for Step 3)
 */
export function validateStep(
  step: 1 | 2 | 3 | 4,
  formData: Step1Data & Step2Data & Step3Data & Step4Data,
  currentAge: number | null
): StepValidationResult {
  switch (step) {
    case 1:
      return validateStep1(formData);
    case 2:
      return validateStep2(formData);
    case 3:
      return validateStep3(formData, currentAge);
    case 4:
      return validateStep4(formData, formData.statut);
    default:
      return { valid: true, errors: {}, warnings: [] };
  }
}

// ---------------------------------------------------------------------------
// FCFA Input Helpers (used by the CurrencyInput component)
// ---------------------------------------------------------------------------

/**
 * Parse a raw input string into an integer FCFA value.
 * Strips all non-digit characters (spaces, letters, etc.).
 * Returns null if the string contains no digits.
 */
export function parseFCFAInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return null;
  // Strip leading zeros
  const parsed = parseInt(digits, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Format a raw FCFA integer for display in an input field.
 * Uses French locale thousand separators (non-breaking space).
 * Returns empty string if value is null.
 */
export function formatFCFAInput(value: number | null): string {
  if (value === null || value === 0) return "";
  return new Intl.NumberFormat("fr-FR").format(value);
}
