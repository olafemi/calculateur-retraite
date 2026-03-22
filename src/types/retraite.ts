/**
 * =============================================================================
 * Retirement Calculator — Type Definitions
 * =============================================================================
 *
 * Data model for the 4-step retirement calculator form wizard.
 * Covers form data, validation state, step configuration, and copy deck types.
 *
 * Spec reference: docs/specs/milestone-4-wizard.md
 *
 * =============================================================================
 * FILE STRUCTURE PLAN (for designer / frontend-dev reference)
 * =============================================================================
 *
 * src/
 * ├── types/
 * │   └── retraite.ts                    ← THIS FILE (data model, validation types)
 * ├── stores/
 * │   └── retraiteStore.ts               ← Zustand store with localStorage persist
 * ├── utils/
 * │   ├── format.ts                      ← (existing) formatFCFA
 * │   └── validation.ts                  ← Pure validation functions for all steps
 * ├── components/
 * │   └── retraite/                      ← NEW: wizard UI components
 * │       ├── RetraiteWizard.tsx          ← Main wizard container (renders current step)
 * │       ├── ProgressIndicator.tsx       ← Horizontal step indicator (top of wizard)
 * │       ├── StepIdentite.tsx            ← Step 1: Prénom, Nom, Sexe, Date de naissance
 * │       ├── StepSituation.tsx           ← Step 2: Statut professionnel (cards)
 * │       ├── StepObjectif.tsx            ← Step 3: Slider + numeric input for age
 * │       ├── StepRevenus.tsx             ← Step 4: Two FCFA currency inputs
 * │       ├── StepResultsPlaceholder.tsx  ← Temporary "results loading" view (M4 only)
 * │       ├── DateOfBirthSelect.tsx       ← 3-select (Jour/Mois/Année) sub-component
 * │       ├── CurrencyInput.tsx           ← FCFA input with real-time formatting
 * │       ├── RetirementAgeControl.tsx    ← Slider + numeric input synced control
 * │       └── FieldError.tsx              ← Reusable error/warning message display
 * ├── hooks/
 * │   └── useRetraiteWizard.ts           ← (optional) Hook wrapping store + validation logic
 * └── pages/
 *     └── RetraiteCalculateurPage.tsx    ← (existing) Will render <RetraiteWizard />
 *
 * =============================================================================
 */

// ---------------------------------------------------------------------------
// Step Navigation
// ---------------------------------------------------------------------------

/** The four wizard steps, represented as literal union for type safety. */
export type WizardStep = 1 | 2 | 3 | 4;

/** Step state in the progress indicator. */
export type StepStatus = "completed" | "active" | "disabled";

/** Configuration for a single step in the progress indicator. */
export interface StepConfig {
  /** Step number (1-4) */
  step: WizardStep;
  /** Short label shown in the progress indicator */
  label: string;
  /** Current state of this step */
  status: StepStatus;
}

/** All step labels (French). Used by the progress indicator. */
export const STEP_LABELS: Record<WizardStep, string> = {
  1: "Identite",
  2: "Situation",
  3: "Objectif",
  4: "Revenus",
} as const;

// ---------------------------------------------------------------------------
// Step 1 — Identite
// ---------------------------------------------------------------------------

/** Biological sex options. */
export type Sexe = "homme" | "femme";

/** Step 1 form data. */
export interface Step1Data {
  prenom: string;
  nom: string;
  sexe: Sexe | null;
  jourNaissance: number | null;   // 1-31
  moisNaissance: number | null;   // 1-12
  anneeNaissance: number | null;  // 1940 to (currentYear - 14)
}

// ---------------------------------------------------------------------------
// Step 2 — Situation
// ---------------------------------------------------------------------------

/** Professional status options. */
export type StatutProfessionnel = "salarie" | "freelance" | "etudiant" | "autre";

/** Step 2 form data. */
export interface Step2Data {
  statut: StatutProfessionnel | null;
}

/** Configuration for a status card in Step 2. */
export interface StatutOption {
  value: StatutProfessionnel;
  label: string;
  description: string;
}

/** All statut options with French copy. */
export const STATUT_OPTIONS: StatutOption[] = [
  { value: "salarie",  label: "Salarie(e)",  description: "Vous travaillez pour un employeur." },
  { value: "freelance", label: "Freelance",   description: "Vous travaillez a votre compte." },
  { value: "etudiant", label: "Etudiant(e)", description: "Vous etes encore en formation." },
  { value: "autre",    label: "Autre",       description: "Retraite, sans emploi, ou autre situation." },
] as const;

// ---------------------------------------------------------------------------
// Step 3 — Objectif
// ---------------------------------------------------------------------------

/** Step 3 form data. */
export interface Step3Data {
  ageRetraite: number; // default 60, min = currentAge + 1, max = 80
}

// ---------------------------------------------------------------------------
// Step 4 — Revenus
// ---------------------------------------------------------------------------

/** Step 4 form data. */
export interface Step4Data {
  salaireActuel: number | null;    // raw integer in FCFA
  revenuRetraite: number | null;   // raw integer in FCFA
  capitalDisponible: number | null; // raw integer in FCFA — existing savings (optional)
}

/** FCFA amount constraints (shared between both fields in Step 4). */
export const FCFA_CONSTRAINTS = {
  min: 10_000,
  max: 50_000_000,
} as const;

// ---------------------------------------------------------------------------
// Combined Form Data
// ---------------------------------------------------------------------------

/**
 * Full wizard form data combining all steps.
 * This is the shape stored in Zustand (without actions).
 */
export interface RetraiteFormData extends Step1Data, Step2Data, Step3Data, Step4Data {}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * A single field validation error.
 * `null` means the field is valid (no error).
 */
export type FieldError = string | null;

/**
 * Validation errors keyed by field name.
 * Only fields with errors are present; absent = valid.
 */
export type ValidationErrors<T extends string = string> = Partial<Record<T, string>>;

/** Field names that can have validation errors in Step 1. */
export type Step1Field = "prenom" | "nom" | "sexe" | "dateNaissance";

/** Field names that can have validation errors in Step 2. */
export type Step2Field = "statut";

/** Field names that can have validation errors in Step 3. */
export type Step3Field = "ageRetraite";

/** Field names that can have validation errors in Step 4. */
export type Step4Field = "salaireActuel" | "revenuRetraite";

/** Union of all validatable field names across all steps. */
export type WizardField = Step1Field | Step2Field | Step3Field | Step4Field;

/** Step-specific validation error types. */
export type Step1Errors = ValidationErrors<Step1Field>;
export type Step2Errors = ValidationErrors<Step2Field>;
export type Step3Errors = ValidationErrors<Step3Field>;
export type Step4Errors = ValidationErrors<Step4Field>;

/**
 * A non-blocking warning message (displayed in amber, does not prevent navigation).
 */
export interface FieldWarning {
  field: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Validation Result
// ---------------------------------------------------------------------------

/**
 * Return type for step validation functions.
 * `valid` = true means no errors; user can proceed.
 * `warnings` are non-blocking messages shown in amber.
 */
export interface StepValidationResult<TField extends string = string> {
  valid: boolean;
  errors: ValidationErrors<TField>;
  warnings: FieldWarning[];
}

// ---------------------------------------------------------------------------
// Dynamic Copy Deck — Step 4 labels that adapt based on statut
// ---------------------------------------------------------------------------

/** Copy configuration for Step 4 fields, keyed by professional status. */
export interface Step4CopyDeck {
  salaireLabel: string;
  salaireHelper: string;
}

/** Step 4 copy deck mapped by statut. Falls back to "autre" if null. */
export const STEP4_COPY_BY_STATUT: Record<StatutProfessionnel, Step4CopyDeck> = {
  salarie: {
    salaireLabel: "Votre salaire actuel (par mois)",
    salaireHelper: "Le montant que vous recevez chaque mois, avant ou apres impots.",
  },
  freelance: {
    salaireLabel: "Votre revenu mensuel",
    salaireHelper: "Le montant moyen que vous gagnez chaque mois.",
  },
  etudiant: {
    salaireLabel: "Votre revenu mensuel",
    salaireHelper: "Le montant que vous recevez ou gagnez chaque mois, meme approximatif.",
  },
  autre: {
    salaireLabel: "Votre revenu mensuel",
    salaireHelper: "Le montant que vous recevez chaque mois, de toute source.",
  },
} as const;

// ---------------------------------------------------------------------------
// Month Names (French, for date of birth select)
// ---------------------------------------------------------------------------

export const MONTH_NAMES: readonly string[] = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
] as const;

// ---------------------------------------------------------------------------
// Age / Date Constraints
// ---------------------------------------------------------------------------

export const AGE_CONSTRAINTS = {
  /** Minimum user age to use the tool */
  minAge: 14,
  /** Earliest birth year allowed */
  minBirthYear: 1940,
  /** Maximum retirement age */
  maxRetirementAge: 80,
  /** Default retirement age */
  defaultRetirementAge: 60,
} as const;
