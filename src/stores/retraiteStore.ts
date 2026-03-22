/**
 * =============================================================================
 * Retirement Calculator — Zustand Store
 * =============================================================================
 *
 * Central state management for the 4-step retirement calculator wizard.
 * Uses Zustand with the `persist` middleware for localStorage persistence.
 *
 * Key behaviors:
 * - All form data persists to localStorage (key: "retraite-wizard")
 * - currentStep is persisted (user resumes where they left off)
 * - completedSteps tracks which steps have been validated
 * - Changing DOB in Step 1 auto-adjusts retirement age if now invalid
 * - Validation is NOT stored here — it's computed on-demand via pure functions
 *   from src/utils/validation.ts. The store only stores form data and navigation.
 * - Adjustable calculation parameters (return rate, inflation, life expectancy)
 *   are persisted and exposed via setters for the results page sliders.
 *
 * Spec references:
 *   - docs/specs/milestone-4-wizard.md (form wizard)
 *   - docs/specs/milestone-5-calculation.md (calculation engine + results)
 * =============================================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

import type {
  WizardStep,
  Sexe,
  StatutProfessionnel,
  RetraiteFormData,
  StepValidationResult,
} from "../types/retraite";

import { AGE_CONSTRAINTS } from "../types/retraite";

import type { CalculationParams } from "../types/retraiteResults";
import { CALCULATION_PARAM_DEFAULTS } from "../types/retraiteResults";

import { computeAge, validateStep } from "../utils/validation";

// ---------------------------------------------------------------------------
// Store State Interface
// ---------------------------------------------------------------------------

interface RetraiteWizardState extends RetraiteFormData {
  // -- Navigation --
  currentStep: WizardStep;
  completedSteps: number[]; // steps that have been successfully validated (array for JSON serialization)
  wizardCompleted: boolean; // true after Step 4 validation passes (transition to results)

  // -- Adjustable Calculation Parameters (persisted, used on results page) --
  annualReturnRate: number;     // decimal, default 0 (0%), slider 0-20%
  annualInflationRate: number;  // decimal, default 0.03 (3%), slider 0-10%
  lifeExpectancy: number;       // integer, default 75, slider retirementAge+1 to 100

  // -- Actions: Field Setters (type-safe per field) --
  setPrenom: (value: string) => void;
  setNom: (value: string) => void;
  setSexe: (value: Sexe) => void;
  setJourNaissance: (value: number | null) => void;
  setMoisNaissance: (value: number | null) => void;
  setAnneeNaissance: (value: number | null) => void;
  setStatut: (value: StatutProfessionnel) => void;
  setAgeRetraite: (value: number) => void;
  setSalaireActuel: (value: number | null) => void;
  setRevenuRetraite: (value: number | null) => void;
  setCapitalDisponible: (value: number | null) => void;

  // -- Actions: Adjustable Parameter Setters --
  setAnnualReturnRate: (value: number) => void;
  setAnnualInflationRate: (value: number) => void;
  setLifeExpectancy: (value: number) => void;

  // -- Actions: Navigation --
  /**
   * Attempt to advance to the next step.
   * Runs validation on the current step.
   * Returns the validation result so the UI can display errors.
   */
  nextStep: () => StepValidationResult;

  /**
   * Go back to the previous step. Always allowed, no validation.
   */
  prevStep: () => void;

  /**
   * Jump to a specific step (only allowed for completed steps or current step).
   * Returns true if navigation was allowed.
   */
  goToStep: (step: WizardStep) => boolean;

  /**
   * Set wizardCompleted flag. Used by "Modifier mes informations" to go
   * back to the wizard while preserving all form data.
   */
  setWizardCompleted: (value: boolean) => void;

  // -- Actions: Utility --
  /**
   * Reset the entire wizard to initial state.
   * Also clears localStorage.
   */
  reset: () => void;

  // -- Computed Helpers (derived from state, but stored as getters via actions) --
  /**
   * Get the user's current age computed from DOB fields.
   * Returns null if DOB is incomplete or invalid.
   */
  getCurrentAge: () => number | null;

  /**
   * Get the minimum allowed retirement age (currentAge + 1).
   * Falls back to default if age can't be computed.
   */
  getMinRetirementAge: () => number;

  /**
   * Get years remaining until retirement.
   * Returns null if current age can't be computed.
   */
  getYearsUntilRetirement: () => number | null;

  /**
   * Check if a step is completed.
   */
  isStepCompleted: (step: WizardStep) => boolean;
}

// ---------------------------------------------------------------------------
// Initial / Default State
// ---------------------------------------------------------------------------

const INITIAL_FORM_DATA: RetraiteFormData = {
  // Step 1
  prenom: "",
  nom: "",
  sexe: null,
  jourNaissance: null,
  moisNaissance: null,
  anneeNaissance: null,

  // Step 2
  statut: null,

  // Step 3
  ageRetraite: AGE_CONSTRAINTS.defaultRetirementAge,

  // Step 4
  salaireActuel: null,
  revenuRetraite: null,
  capitalDisponible: null,
};

const INITIAL_NAV_STATE = {
  currentStep: 1 as WizardStep,
  completedSteps: [] as number[],
  wizardCompleted: false,
};

const INITIAL_PARAMS_STATE: CalculationParams = {
  ...CALCULATION_PARAM_DEFAULTS,
};

// ---------------------------------------------------------------------------
// Helper: Cascade retirement age check after any DOB field changes
// ---------------------------------------------------------------------------

/**
 * After any DOB field changes, recalculate the user's age and check whether
 * the currently stored retirement age is still valid. If not, auto-adjust
 * the retirement age upward and remove Step 3 from completed steps.
 *
 * This must be called from setJourNaissance, setMoisNaissance, AND
 * setAnneeNaissance so that any DOB change triggers the cascade.
 */
function cascadeRetirementAgeCheck(
  get: () => RetraiteWizardState,
  set: (partial: Partial<RetraiteWizardState>) => void
): void {
  const state = get();
  const { jourNaissance, moisNaissance, anneeNaissance, ageRetraite, completedSteps } = state;

  // Can only check if all three DOB fields are filled
  if (jourNaissance === null || moisNaissance === null || anneeNaissance === null) return;

  const newAge = computeAge(jourNaissance, moisNaissance, anneeNaissance);
  if (newAge === null) return;

  const minRetirement = newAge + 1;
  if (ageRetraite < minRetirement) {
    // Auto-adjust retirement age and remove Step 3 from completed
    set({
      ageRetraite: Math.min(minRetirement, AGE_CONSTRAINTS.maxRetirementAge),
      completedSteps: completedSteps.filter((s) => s !== 3),
    });
  }
}

// ---------------------------------------------------------------------------
// Store Creation
// ---------------------------------------------------------------------------

export const useRetraiteStore = create<RetraiteWizardState>()(
  persist(
    (set, get) => ({
      // -- Initial State --
      ...INITIAL_FORM_DATA,
      ...INITIAL_NAV_STATE,
      ...INITIAL_PARAMS_STATE,

      // =====================================================================
      // Field Setters
      // =====================================================================

      setPrenom: (value) => set({ prenom: value }),

      setNom: (value) => set({ nom: value }),

      setSexe: (value) => set({ sexe: value }),

      setJourNaissance: (value) => {
        set({ jourNaissance: value });
        // Cascade: re-check retirement age validity after day change
        cascadeRetirementAgeCheck(get, set);
      },

      setMoisNaissance: (value) => {
        const state = get();
        set({ moisNaissance: value });
        // If day is set and now exceeds the max days in the new month, reset day
        if (state.jourNaissance !== null && value !== null && state.anneeNaissance !== null) {
          const maxDays = new Date(state.anneeNaissance, value, 0).getDate();
          if (state.jourNaissance > maxDays) {
            set({ jourNaissance: null });
          }
        }
        // Cascade: re-check retirement age validity after month change
        cascadeRetirementAgeCheck(get, set);
      },

      setAnneeNaissance: (value) => {
        const state = get();
        set({ anneeNaissance: value });
        // If day is set and now exceeds the max days (e.g., Feb 29 on non-leap year), reset
        if (state.jourNaissance !== null && state.moisNaissance !== null && value !== null) {
          const maxDays = new Date(value, state.moisNaissance, 0).getDate();
          if (state.jourNaissance > maxDays) {
            set({ jourNaissance: null });
          }
        }
        // Cascade: re-check retirement age validity after year change
        cascadeRetirementAgeCheck(get, set);
      },

      setStatut: (value) => set({ statut: value }),

      setAgeRetraite: (value) => {
        // Clamp to valid range
        const state = get();
        const currentAge = computeAge(
          state.jourNaissance,
          state.moisNaissance,
          state.anneeNaissance
        );
        const min = currentAge !== null ? currentAge + 1 : 1;
        const clamped = Math.max(min, Math.min(AGE_CONSTRAINTS.maxRetirementAge, value));

        // Also ensure life expectancy is at least retirementAge + 1
        const updates: Partial<RetraiteWizardState> = { ageRetraite: clamped };
        if (state.lifeExpectancy <= clamped) {
          updates.lifeExpectancy = Math.min(clamped + 1, 100);
        }
        set(updates);
      },

      setSalaireActuel: (value) => set({ salaireActuel: value }),

      setRevenuRetraite: (value) => set({ revenuRetraite: value }),

      setCapitalDisponible: (value) => set({ capitalDisponible: value }),

      // =====================================================================
      // Adjustable Parameter Setters
      // =====================================================================

      setAnnualReturnRate: (value) => {
        // Clamp to valid range: 0 to 0.20 (0% to 20%)
        const clamped = Math.max(0, Math.min(0.20, value));
        set({ annualReturnRate: clamped });
      },

      setAnnualInflationRate: (value) => {
        // Clamp to valid range: 0 to 0.10 (0% to 10%)
        const clamped = Math.max(0, Math.min(0.10, value));
        set({ annualInflationRate: clamped });
      },

      setLifeExpectancy: (value) => {
        // Clamp: min = retirementAge + 1, max = 100
        const state = get();
        const min = state.ageRetraite + 1;
        const clamped = Math.max(min, Math.min(100, Math.round(value)));
        set({ lifeExpectancy: clamped });
      },

      // =====================================================================
      // Navigation Actions
      // =====================================================================

      nextStep: () => {
        const state = get();
        const currentAge = computeAge(
          state.jourNaissance,
          state.moisNaissance,
          state.anneeNaissance
        );

        const result = validateStep(state.currentStep, state, currentAge);

        if (result.valid) {
          const newCompleted = state.completedSteps.includes(state.currentStep)
            ? state.completedSteps
            : [...state.completedSteps, state.currentStep];

          if (state.currentStep < 4) {
            set({
              currentStep: (state.currentStep + 1) as WizardStep,
              completedSteps: newCompleted,
            });
          } else {
            // Step 4 completed — wizard is done
            set({
              completedSteps: newCompleted,
              wizardCompleted: true,
            });
          }
        }

        return result;
      },

      prevStep: () => {
        const state = get();
        if (state.currentStep > 1) {
          set({ currentStep: (state.currentStep - 1) as WizardStep });
        }
      },

      goToStep: (step) => {
        const state = get();

        // Can only go to completed steps or the current step
        if (step === state.currentStep) return true;
        if (state.completedSteps.includes(step)) {
          set({ currentStep: step });
          return true;
        }
        return false; // Navigation not allowed
      },

      setWizardCompleted: (value) => {
        set({ wizardCompleted: value });
        // When going back to wizard from results, navigate to step 1
        if (!value) {
          set({ currentStep: 1 as WizardStep });
        }
      },

      // =====================================================================
      // Utility Actions
      // =====================================================================

      reset: () => {
        set({
          ...INITIAL_FORM_DATA,
          ...INITIAL_NAV_STATE,
          ...INITIAL_PARAMS_STATE,
        });
      },

      // =====================================================================
      // Computed Helpers
      // =====================================================================

      getCurrentAge: () => {
        const state = get();
        return computeAge(
          state.jourNaissance,
          state.moisNaissance,
          state.anneeNaissance
        );
      },

      getMinRetirementAge: () => {
        const state = get();
        const age = computeAge(
          state.jourNaissance,
          state.moisNaissance,
          state.anneeNaissance
        );
        if (age === null) return AGE_CONSTRAINTS.defaultRetirementAge;
        return age + 1;
      },

      getYearsUntilRetirement: () => {
        const state = get();
        const age = computeAge(
          state.jourNaissance,
          state.moisNaissance,
          state.anneeNaissance
        );
        if (age === null) return null;
        return state.ageRetraite - age;
      },

      isStepCompleted: (step) => {
        return get().completedSteps.includes(step);
      },
    }),
    {
      name: "retraite-wizard", // localStorage key
      // Only persist form data, navigation state, and adjustable params — NOT action functions
      partialize: (state) => ({
        // Step 1
        prenom: state.prenom,
        nom: state.nom,
        sexe: state.sexe,
        jourNaissance: state.jourNaissance,
        moisNaissance: state.moisNaissance,
        anneeNaissance: state.anneeNaissance,
        // Step 2
        statut: state.statut,
        // Step 3
        ageRetraite: state.ageRetraite,
        // Step 4
        salaireActuel: state.salaireActuel,
        revenuRetraite: state.revenuRetraite,
        capitalDisponible: state.capitalDisponible,
        // Navigation
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        wizardCompleted: state.wizardCompleted,
        // Adjustable calculation parameters
        annualReturnRate: state.annualReturnRate,
        annualInflationRate: state.annualInflationRate,
        lifeExpectancy: state.lifeExpectancy,
      }),
    }
  )
);

// ---------------------------------------------------------------------------
// Selector Hooks (for convenient use in components)
// ---------------------------------------------------------------------------

/**
 * Select only the Step 1 form data from the store.
 * Use this in StepIdentite to minimize re-renders.
 */
export const useStep1Data = () =>
  useRetraiteStore(useShallow((s) => ({
    prenom: s.prenom,
    nom: s.nom,
    sexe: s.sexe,
    jourNaissance: s.jourNaissance,
    moisNaissance: s.moisNaissance,
    anneeNaissance: s.anneeNaissance,
  })));

/**
 * Select only the Step 2 form data from the store.
 */
export const useStep2Data = () =>
  useRetraiteStore(useShallow((s) => ({
    statut: s.statut,
  })));

/**
 * Select only the Step 3 form data from the store.
 */
export const useStep3Data = () =>
  useRetraiteStore(useShallow((s) => ({
    ageRetraite: s.ageRetraite,
  })));

/**
 * Select only the Step 4 form data from the store.
 */
export const useStep4Data = () =>
  useRetraiteStore(useShallow((s) => ({
    salaireActuel: s.salaireActuel,
    revenuRetraite: s.revenuRetraite,
    capitalDisponible: s.capitalDisponible,
  })));

/**
 * Select navigation state from the store.
 */
export const useWizardNav = () =>
  useRetraiteStore(useShallow((s) => ({
    currentStep: s.currentStep,
    completedSteps: s.completedSteps,
    wizardCompleted: s.wizardCompleted,
  })));

/**
 * Select adjustable calculation parameters from the store.
 * Used by the ResultsAssumptions component for the sliders.
 *
 * IMPORTANT: Uses useShallow to prevent infinite re-render loops
 * with Zustand 5 + React 19 when returning object selectors.
 */
export const useResultsParams = () =>
  useRetraiteStore(useShallow((s) => ({
    annualReturnRate: s.annualReturnRate,
    annualInflationRate: s.annualInflationRate,
    lifeExpectancy: s.lifeExpectancy,
  })));
