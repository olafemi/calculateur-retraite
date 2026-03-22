# Milestone 4 — Retirement Calculator Form Wizard Specification

> **Status:** Draft
> **Author:** Product Manager
> **Date:** 2026-03-21
> **Milestone:** 4 — Retirement calculator step-by-step form wizard (4 steps)

---

## 1. Overview

The Calculateur de Retraite form wizard collects user information across 4 sequential steps to compute how much the user needs to save monthly for retirement. The wizard lives on a single URL (`/retraite`), with step navigation managed via Zustand state (no URL-per-step). Results computation happens in Milestone 5; paywall in Milestone 6. This spec covers only the form wizard UI and validation.

### Design Principles

- **Mobile-first:** Primary device for target users is smartphone
- **Simple language:** No financial jargon — plain French
- **Progressive disclosure:** One concern per step, never overwhelm
- **Reactive validation:** Validate on blur AND on "Suivant" click
- **Accessibility:** All form fields must have proper labels and ARIA attributes

---

## 2. User Flow

### 2.1 Navigation Model

```
[Step 1: Identité] → [Step 2: Situation] → [Step 3: Objectif] → [Step 4: Revenus] → [Results]
```

- **Single URL:** `/retraite` — step state is managed in Zustand, not in the URL
- **Forward:** User clicks "Suivant" button — triggers validation, advances if valid
- **Backward:** User clicks "Retour" button — always allowed, no validation needed to go back
- **Direct step access:** User can click on completed steps in the progress indicator to jump back (but NOT forward past incomplete steps)
- **Data persistence:** All entered data is preserved in Zustand store when navigating between steps (no data loss on back/forward)
- **Browser back button:** Does NOT navigate between steps (single URL). Standard browser behavior applies (navigates to previous page).

### 2.2 Entry and Exit

- **Entry:** User arrives at `/retraite` from the landing page tool card or direct URL. Always starts at Step 1 (fresh session).
- **Exit after Step 4:** On completing Step 4, the wizard transitions to the results view (Milestone 5). For now (Milestone 4 only), show a placeholder results screen: "Vos resultats sont en cours de preparation..."
- **Abandon:** If user navigates away mid-wizard, data is preserved in localStorage and restored on return.

---

## 3. Progress Indicator

### 3.1 Design

A horizontal step indicator displayed at the top of the wizard, visible on all 4 steps. It shows the user where they are and how many steps remain.

### 3.2 Behavior Per Step

| Step | Label in Indicator | State |
|------|--------------------|-------|
| 1 | "Identite" | Active (highlighted) when current; Completed (checkmark) when past; Disabled when future |
| 2 | "Situation" | Active when current; Completed when past; Disabled when future |
| 3 | "Objectif" | Active when current; Completed when past; Disabled when future |
| 4 | "Revenus" | Active when current; Completed when past; Disabled when future |

### 3.3 Interaction Rules

- **Completed steps:** Clickable — user can jump back to any completed step
- **Current step:** Highlighted (not clickable, already there)
- **Future steps:** Not clickable — visually dimmed/disabled
- **Mobile:** On small screens, show step numbers (1, 2, 3, 4) with the current step label below. On larger screens, show all labels.

---

## 4. Step Specifications

---

### Step 1 — Identite

**Purpose:** Collect basic identity information and date of birth (used to compute current age for retirement calculations).

#### Fields

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| Prenom | Text input | Yes | Empty | 1-50 characters, letters/hyphens/spaces/apostrophes only |
| Nom | Text input | Yes | Empty | 1-50 characters, letters/hyphens/spaces/apostrophes only |
| Sexe | Radio group | Yes | None selected | Two options: "Homme" / "Femme" |
| Date de naissance | 3 selects | Yes | None selected | See date rules below |

#### Date of Birth — 3 Selects

Three dropdown selects displayed side by side: **Jour / Mois / Annee**

- **Jour:** Options 1-31 (dynamically adjusted based on selected month/year — e.g., February shows 1-28 or 1-29)
- **Mois:** Options "Janvier" through "Decembre" (display names), values 1-12
- **Annee:** Options from 1940 to current year minus 14 (i.e., 1940 to 2012 in 2026). Most recent years first (descending order).

**Date validation rules:**
- All three selects must be filled
- The resulting date must be a valid calendar date
- User must be at least 14 years old (born on or before today's date minus 14 years)
- User must be at most 86 years old (born on or after 1940-01-01)

#### Copy Deck

| Element | French Text |
|---------|-------------|
| Step title | "Qui etes-vous ?" |
| Step subtitle | "Ces informations nous aident a personnaliser votre simulation." |
| Prenom label | "Prenom" |
| Prenom placeholder | "Ex : Fatou" |
| Nom label | "Nom" |
| Nom placeholder | "Ex : Adjovi" |
| Sexe label | "Sexe" |
| Sexe option 1 | "Homme" |
| Sexe option 2 | "Femme" |
| Date de naissance label | "Date de naissance" |
| Jour placeholder | "Jour" |
| Mois placeholder | "Mois" |
| Annee placeholder | "Annee" |
| Button forward | "Suivant" |

#### Error Messages — Step 1

| Condition | Message |
|-----------|---------|
| Prenom empty | "Veuillez entrer votre prenom." |
| Prenom invalid characters | "Le prenom ne peut contenir que des lettres, espaces, traits d'union et apostrophes." |
| Prenom too long | "Le prenom ne doit pas depasser 50 caracteres." |
| Nom empty | "Veuillez entrer votre nom." |
| Nom invalid characters | "Le nom ne peut contenir que des lettres, espaces, traits d'union et apostrophes." |
| Nom too long | "Le nom ne doit pas depasser 50 caracteres." |
| Sexe not selected | "Veuillez indiquer votre sexe." |
| Date incomplete | "Veuillez completer votre date de naissance." |
| Date invalid | "Cette date n'existe pas. Veuillez verifier." |
| User under 14 | "Vous devez avoir au moins 14 ans pour utiliser cet outil." |

---

### Step 2 — Situation actuelle

**Purpose:** Understand the user's current professional situation. This informs contextual messaging (not calculation logic in the current version, but important for future features like social contribution estimates).

#### Fields

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| Statut professionnel | Radio group or selectable cards | Yes | None selected | Exactly one option from: Salarie, Freelance, Etudiant, Autre |

#### Copy Deck

| Element | French Text |
|---------|-------------|
| Step title | "Quelle est votre situation ?" |
| Step subtitle | "Cela nous aide a adapter nos conseils." |
| Option 1 label | "Salarie(e)" |
| Option 1 description | "Vous travaillez pour un employeur." |
| Option 2 label | "Freelance" |
| Option 2 description | "Vous travaillez a votre compte." |
| Option 3 label | "Etudiant(e)" |
| Option 3 description | "Vous etes encore en formation." |
| Option 4 label | "Autre" |
| Option 4 description | "Retraite, sans emploi, ou autre situation." |
| Button back | "Retour" |
| Button forward | "Suivant" |

#### Error Messages — Step 2

| Condition | Message |
|-----------|---------|
| No option selected | "Veuillez choisir votre situation actuelle." |

---

### Step 3 — Objectif retraite

**Purpose:** Collect the user's desired retirement age. This is the target year used in all calculations.

#### Fields

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| Age de depart a la retraite | Slider + numeric input (synced) | Yes | 60 | Minimum: user's current age + 1, Maximum: 80 |

#### Slider + Input Sync Behavior

- The slider and the numeric input display the same value and stay in sync
- Changing the slider updates the numeric input in real-time
- Changing the numeric input updates the slider position in real-time
- The slider shows min and max labels at each end
- The numeric input accepts only integers

#### Dynamic Constraints

- **Minimum retirement age:** Current age + 1 (computed from date of birth entered in Step 1). Example: if user is 25, minimum is 26.
- **Maximum retirement age:** 80
- **Default value:** 60 (clamped to min if user is already 60+)
- If the user goes back to Step 1 and changes their date of birth, the minimum here updates accordingly. If their previously selected retirement age is now below the new minimum, it resets to the new minimum.

#### Helper Information

Display the computed number of years until retirement based on the selected age:
- Formula: `retirement_age - current_age`
- Display: "Il vous reste **X ans** pour preparer votre retraite."
- This updates reactively as the slider/input changes.

#### Copy Deck

| Element | French Text |
|---------|-------------|
| Step title | "A quel age souhaitez-vous partir a la retraite ?" |
| Step subtitle | "Choisissez l'age auquel vous aimeriez arreter de travailler." |
| Slider label | "Age de depart" |
| Slider min label | "{min} ans" (dynamic) |
| Slider max label | "80 ans" |
| Numeric input suffix | "ans" |
| Years remaining text | "Il vous reste **{X} ans** pour preparer votre retraite." |
| Button back | "Retour" |
| Button forward | "Suivant" |

#### Error Messages — Step 3

| Condition | Message |
|-----------|---------|
| Age below minimum | "L'age de depart doit etre superieur a votre age actuel ({current_age} ans)." |
| Age above 80 | "L'age de depart ne peut pas depasser 80 ans." |
| Non-integer value | "Veuillez entrer un nombre entier." |

#### Warning Messages (non-blocking)

| Condition | Message |
|-----------|---------|
| Years remaining <= 5 | "Attention : il vous reste peu de temps. L'effort d'epargne sera important." |
| Years remaining <= 2 | "Tres peu de temps avant la retraite. Les resultats pourraient etre difficiles a atteindre." |

---

### Step 4 — Revenus

**Purpose:** Collect the user's current monthly salary and desired monthly income in retirement. These are the core numbers for the calculation engine.

#### Fields

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| Salaire actuel | Currency input (FCFA) | Yes | Empty | Minimum: 10 000 FCFA, Maximum: 50 000 000 FCFA, integers only |
| Revenu souhaite a la retraite | Currency input (FCFA) | Yes | Empty | Minimum: 10 000 FCFA, Maximum: 50 000 000 FCFA, integers only |

#### FCFA Input Behavior

- **Real-time formatting:** As the user types, the number is formatted with French locale thousand separators (non-breaking space). Example: typing "150000" displays "150 000".
- **Suffix:** "FCFA" displayed inside or after the input as a fixed suffix
- **Input filtering:** Only digits are accepted. Non-numeric characters are silently ignored.
- **Paste handling:** If user pastes a formatted number (e.g., "1 500 000"), strip non-digit characters and format correctly.
- **Empty/clear:** If user clears the field, it shows the placeholder.
- **No decimals:** FCFA amounts are always integers.

#### Copy Deck

| Element | French Text |
|---------|-------------|
| Step title | "Parlons de vos revenus" |
| Step subtitle | "Ces montants nous permettent de calculer votre effort d'epargne." |
| Salaire label (Salarie) | "Votre salaire actuel (par mois)" |
| Salaire label (Freelance) | "Votre revenu mensuel" |
| Salaire label (Etudiant) | "Votre revenu mensuel" |
| Salaire label (Autre) | "Votre revenu mensuel" |
| Salaire placeholder | "Ex : 250 000" |
| Salaire helper (Salarie) | "Le montant que vous recevez chaque mois, avant ou apres impots." |
| Salaire helper (Freelance) | "Le montant moyen que vous gagnez chaque mois." |
| Salaire helper (Etudiant) | "Le montant que vous recevez ou gagnez chaque mois, meme approximatif." |
| Salaire helper (Autre) | "Le montant que vous recevez chaque mois, de toute source." |
| Revenu retraite label | "Revenu souhaite a la retraite (par mois)" |
| Revenu retraite placeholder | "Ex : 200 000" |
| Revenu retraite helper | "Le montant mensuel dont vous auriez besoin pour vivre confortablement." |
| Button back | "Retour" |
| Button forward | "Voir mes resultats" |

#### Error Messages — Step 4

| Condition | Message |
|-----------|---------|
| Salaire empty | "Veuillez entrer votre salaire mensuel." |
| Salaire below 10 000 | "Le montant minimum est de 10 000 FCFA." |
| Salaire above 50 000 000 | "Le montant maximum est de 50 000 000 FCFA." |
| Revenu retraite empty | "Veuillez entrer le revenu souhaite a la retraite." |
| Revenu retraite below 10 000 | "Le montant minimum est de 10 000 FCFA." |
| Revenu retraite above 50 000 000 | "Le montant maximum est de 50 000 000 FCFA." |

#### Warning Messages (non-blocking)

| Condition | Message |
|-----------|---------|
| Revenu retraite > Salaire actuel | "Votre revenu souhaite est superieur a votre salaire actuel. C'est possible, mais l'effort d'epargne sera plus eleve." |
| Revenu retraite > 80% of Salaire | "La plupart des experts recommandent de viser entre 50% et 70% de votre salaire actuel." |

---

## 5. Validation Strategy

### 5.1 When Validation Runs

1. **On blur:** When the user leaves a field (tabs out, taps another field), validate that single field immediately. Show the error message below the field if invalid.
2. **On "Suivant" click:** Validate ALL fields on the current step. If any field is invalid, show all error messages simultaneously and prevent navigation. Scroll to / focus the first invalid field.
3. **On "Retour" click:** No validation. Always allowed.
4. **On step indicator click (back to completed step):** No validation. Always allowed.

### 5.2 Error Display

- Error messages appear directly below the relevant field
- Error text is styled in red (e.g., `text-red-600`)
- The field border turns red when in error state
- Errors clear as soon as the user corrects the value (on change, not waiting for blur again)
- Warning messages (non-blocking) appear below the field in amber/orange and do NOT prevent navigation

### 5.3 Focus Management

- On step transition (forward), focus the first field of the new step
- On validation failure (Suivant click), focus the first invalid field
- On backward navigation, focus the first field of the destination step

---

## 6. Edge Cases

### 6.1 Date of Birth vs. Retirement Age Conflicts

- **User changes DOB after setting retirement age:** If the new age makes the previously selected retirement age invalid (e.g., user is now 62 but had selected retirement at 60), the retirement age auto-adjusts to `current_age + 1` and Step 3 is marked as needing review (its "completed" checkmark is removed from the progress indicator).
- **User is very old (70+):** Retirement age range is extremely narrow (71-80). The UI must handle this gracefully. The warning message about limited time will display.

### 6.2 Extreme Values

- **Very young user (14-17):** Large year ranges work fine. Default retirement age of 60 applies. Helper shows "Il vous reste 43+ ans..."
- **Very high salary (50M FCFA):** Allowed up to the maximum. No special handling.
- **Very low salary (10K FCFA):** Allowed at the minimum. Results may show an unrealistic savings rate — this is handled in the results display (Milestone 5), not in the form.
- **Retirement income = 0:** Not allowed. Minimum is 10 000 FCFA.

### 6.3 Input Edge Cases

- **Copy-paste formatted numbers:** Strip spaces and non-digits before processing. "1 500 000" becomes "1500000".
- **Leading zeros:** Strip leading zeros. "0050000" becomes "50 000".
- **Very long input:** Max digits enforced by the 50 000 000 ceiling (8 digits max). Inputs beyond this are silently truncated or rejected.
- **Typing very fast:** Currency formatter must not lag or produce visual glitches. Debounce formatting if needed, but display should feel instant.

### 6.4 Navigation Edge Cases

- **User refreshes the page:** Wizard state is restored from localStorage. User returns to the step they were on.
- **User clicks browser back:** Navigates away from `/retraite` entirely (since it's a single URL). State is preserved in localStorage for when they return.
- **User directly accesses `/retraite`:** If localStorage has saved state, restore it (resume where they left off). Otherwise, start at Step 1.

---

## 7. Zustand Store Shape

> This section is guidance for the architect/dev — the PM's recommended data shape.

```typescript
interface RetraiteWizardState {
  // Navigation
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: Set<number>; // Steps that have been successfully validated

  // Step 1 — Identite
  prenom: string;
  nom: string;
  sexe: 'homme' | 'femme' | null;
  jourNaissance: number | null;  // 1-31
  moisNaissance: number | null;  // 1-12
  anneeNaissance: number | null; // 1940-2012

  // Step 2 — Situation
  statut: 'salarie' | 'freelance' | 'etudiant' | 'autre' | null;

  // Step 3 — Objectif
  ageRetraite: number; // default 60

  // Step 4 — Revenus
  salaireActuel: number | null;     // raw integer in FCFA
  revenuRetraite: number | null;    // raw integer in FCFA

  // Actions
  setField: (field: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}
```

---

## 8. Acceptance Criteria

### AC-1: Step 1 — Identite

- [ ] User sees a form with Prenom, Nom, Sexe (radio), and Date de naissance (3 selects)
- [ ] All fields are required; "Suivant" is blocked if any are empty/invalid
- [ ] Name fields accept letters, hyphens, spaces, and apostrophes only
- [ ] Date selects dynamically adjust days based on month/year (e.g., Feb has 28 or 29)
- [ ] User must be between 14 and 86 years old
- [ ] Validation fires on blur for individual fields and on "Suivant" for all fields
- [ ] Error messages display below the relevant field in red
- [ ] On successful validation, user advances to Step 2

### AC-2: Step 2 — Situation

- [ ] User sees 4 selectable options (Salarie, Freelance, Etudiant, Autre) displayed as cards or radio buttons
- [ ] Exactly one must be selected to proceed
- [ ] "Retour" navigates back to Step 1 without validation, preserving all data
- [ ] On selection + "Suivant", user advances to Step 3

### AC-3: Step 3 — Objectif

- [ ] User sees a slider and a numeric input, both synced to the same value
- [ ] Default value is 60 (or current_age + 1 if user is 60+)
- [ ] Minimum is current_age + 1 (computed from DOB in Step 1)
- [ ] Maximum is 80
- [ ] Helper text shows years remaining, updating reactively
- [ ] Warning displays if years remaining <= 5
- [ ] "Retour" navigates back to Step 2 without validation

### AC-4: Step 4 — Revenus

- [ ] User sees two FCFA currency inputs with real-time thousand separator formatting
- [ ] Both fields required, minimum 10 000, maximum 50 000 000
- [ ] Only digits accepted; non-numeric input is silently ignored
- [ ] Paste handling strips non-digit characters
- [ ] Warning if retirement income > current salary
- [ ] "Retour" navigates back to Step 3 without validation
- [ ] "Voir mes resultats" button (instead of "Suivant") on the last step

### AC-5: Progress Indicator

- [ ] Horizontal step indicator visible on all 4 steps
- [ ] Shows current step as active/highlighted
- [ ] Shows completed steps with a checkmark; they are clickable
- [ ] Shows future steps as disabled/dimmed; they are NOT clickable
- [ ] On mobile, shows step numbers with current step label; on desktop, shows all labels

### AC-6: Navigation & State

- [ ] Zustand store holds all wizard state; no URL changes between steps
- [ ] Data persists across step navigation (back and forward)
- [ ] Clicking a completed step in the indicator jumps back to it
- [ ] Cannot skip forward to a step that hasn't been reached
- [ ] Page refresh restores wizard state from localStorage (user resumes where they left off)

### AC-7: Validation UX

- [ ] Fields validate on blur (single field) and on "Suivant" (all fields)
- [ ] Errors display below fields in red with red border on the field
- [ ] Errors clear immediately when the user corrects the value
- [ ] On "Suivant" with errors, focus scrolls to the first invalid field
- [ ] Warnings display in amber/orange and do NOT block navigation

---

## 9. Out of Scope (This Milestone)

- Calculation engine (Milestone 5)
- Results display (Milestone 5)
- Paywall overlay (Milestone 6)
- Auth integration (Milestone 2 — already exists but not connected to wizard)
- Data persistence to server (localStorage persistence IS in scope)
- Animation/transitions between steps (nice-to-have, not required)
- Keyboard shortcut navigation (Enter to advance — nice-to-have)

---

## 10. Founder Decisions (Resolved)

1. **Dynamic labels by status:** Yes — Step 4 labels and helper texts adapt dynamically based on the status selected in Step 2 (Salarié → "Votre salaire actuel", Freelance/Étudiant/Autre → "Votre revenu mensuel"). See Step 4 copy deck for full mapping.
2. **Minimum age:** 14 years old confirmed. Inclusive approach for young users planning early.
3. **localStorage persistence:** Yes — wizard progress persists to localStorage. User can refresh or leave and resume where they left off.

---

*End of specification.*
