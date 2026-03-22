# Milestone 4 — UI/UX Design Specification: Retirement Calculator Wizard

> **Status:** Final
> **Author:** Designer
> **Date:** 2026-03-22
> **Milestone:** 4 — Retirement calculator step-by-step form wizard (4 steps)
> **Depends on:** milestone-4-wizard.md (PM spec), src/types/retraite.ts (data model)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing and Sizing](#4-spacing-and-sizing)
5. [Component Hierarchy](#5-component-hierarchy)
6. [Wizard Layout](#6-wizard-layout)
7. [Progress Indicator](#7-progress-indicator)
8. [Form Field Components](#8-form-field-components)
9. [Step Layouts](#9-step-layouts)
10. [Navigation Buttons](#10-navigation-buttons)
11. [Responsive Breakpoints](#11-responsive-breakpoints)
12. [Transitions and Animations](#12-transitions-and-animations)
13. [Accessibility](#13-accessibility)
14. [Component Props Reference](#14-component-props-reference)

---

## 1. Design Principles

These principles are ordered by priority. When two principles conflict, the higher one wins.

1. **Mobile-first:** Every measurement, layout, and interaction is designed for a 320px-wide viewport first. Desktop is an enhancement, not the baseline.
2. **Clarity over density:** One concern per step. Generous whitespace. No field should feel crowded.
3. **Instant feedback:** Errors appear on blur, clear on correction. Warnings display reactively. The user never wonders "did it work?"
4. **Touch-friendly:** All interactive targets are at least 44x44px. Spacing between touch targets prevents mis-taps.
5. **Visual consistency:** Every component reuses the same color tokens, radius values, shadows, and font weights defined in the existing design system (src/index.css @theme block).

---

## 2. Color Tokens

All colors reference the existing `@theme` variables defined in `src/index.css`. No new color values are introduced.

### Brand Colors (Primary — Deep Teal)

| Token | Value | Usage |
|-------|-------|-------|
| `primary-50` | `#F2FAF8` | Light backgrounds (selected card bg, active step bg) |
| `primary-100` | `#E6F4F1` | Progress indicator completed step bg, hover states |
| `primary-600` | `#21856F` | n/a (reserved) |
| `primary-700` | `#1A6B5E` | Primary actions, active step indicator, focus rings |
| `primary-800` | `#145249` | Step titles, strong emphasis text |
| `primary-900` | `#0D3D38` | Wizard header background (if using dark header variant) |

### Accent Colors (Gold)

| Token | Value | Usage |
|-------|-------|-------|
| `accent-400` | `#E59A12` | n/a in wizard (reserved for CTA on landing) |
| `accent-500` | `#D4860A` | "Voir mes resultats" final button |

### Neutral Colors

| Token | Value | Usage |
|-------|-------|-------|
| `neutral-50` | `#F9FAFB` | Page background (inherited from base) |
| `neutral-100` | `#F3F4F6` | Disabled step indicator bg, disabled input bg |
| `neutral-200` | `#E5E7EB` | Input borders (default state), divider lines |
| `neutral-300` | `#D1D5DB` | Placeholder text in selects |
| `neutral-400` | `#9CA3AF` | Disabled step text, placeholder text in inputs |
| `neutral-500` | `#6B7280` | Helper text, step subtitles |
| `neutral-700` | `#374151` | Field labels, body text |
| `neutral-900` | `#111827` | Step titles, user-entered input text |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `error-100` | `#FEE2E2` | Error field background tint (optional) |
| `error-500` | `#DC2626` | Error border, error text, error icon |
| `warning-100` | `#FEF3C7` | Warning background tint |
| `warning-500` | `#D97706` | Warning border, warning text, warning icon |
| `success-100` | `#DCFCE7` | Completed step bg in progress indicator |
| `success-500` | `#16A34A` | Completed step checkmark, success border |

---

## 3. Typography

The project uses **Plus Jakarta Sans** (loaded via Google Fonts, set as `--font-sans`).

### Type Scale for the Wizard

| Role | Mobile | Desktop (md+) | Weight | Color |
|------|--------|---------------|--------|-------|
| Step title (h2) | `text-xl` (20px) | `text-2xl` (24px) | `font-bold` (700) | `text-neutral-900` |
| Step subtitle | `text-sm` (14px) | `text-base` (16px) | `font-normal` (400) | `text-neutral-500` |
| Field label | `text-sm` (14px) | `text-sm` (14px) | `font-medium` (500) | `text-neutral-700` |
| Field placeholder | `text-sm` (14px) | `text-sm` (14px) | `font-normal` (400) | `text-neutral-400` |
| Field input text | `text-base` (16px) | `text-base` (16px) | `font-normal` (400) | `text-neutral-900` |
| Helper text | `text-xs` (12px) | `text-sm` (14px) | `font-normal` (400) | `text-neutral-500` |
| Error text | `text-xs` (12px) | `text-sm` (14px) | `font-medium` (500) | `text-error-500` |
| Warning text | `text-xs` (12px) | `text-sm` (14px) | `font-medium` (500) | `text-warning-500` |
| Progress step label | `text-xs` (12px) | `text-sm` (14px) | `font-medium` (500) | varies by state |
| Progress step number | `text-sm` (14px) | `text-sm` (14px) | `font-semibold` (600) | varies by state |
| Card option label | `text-base` (16px) | `text-base` (16px) | `font-semibold` (600) | `text-neutral-900` |
| Card option description | `text-sm` (14px) | `text-sm` (14px) | `font-normal` (400) | `text-neutral-500` |
| Slider value display | `text-2xl` (24px) | `text-3xl` (30px) | `font-bold` (700) | `text-primary-700` |
| Years remaining helper | `text-sm` (14px) | `text-base` (16px) | `font-normal` (400) | `text-neutral-700` |
| FCFA suffix | `text-sm` (14px) | `text-sm` (14px) | `font-medium` (500) | `text-neutral-400` |
| Button text | `text-base` (16px) | `text-base` (16px) | `font-semibold` (600) | varies by variant |

**Note on input font size:** `text-base` (16px) is mandatory for inputs on mobile. Using a smaller size causes iOS Safari to auto-zoom the viewport when the input is focused, which is a poor UX.

---

## 4. Spacing and Sizing

### Spacing Scale

All spacing values use Tailwind's default scale (based on 4px increments).

| Usage | Value | Tailwind Class |
|-------|-------|----------------|
| Between wizard sections (progress bar to content) | 24px | `gap-6` or `mt-6` |
| Between step title and subtitle | 4px | `mt-1` |
| Between subtitle and first field | 24px | `mt-6` |
| Between consecutive fields | 20px | `space-y-5` |
| Between field label and input | 6px | `mt-1.5` |
| Between input and error/helper text | 4px | `mt-1` |
| Between grouped date selects (Jour/Mois/Annee) | 8px | `gap-2` |
| Padding inside wizard content area (mobile) | 16px horizontal | `px-4` |
| Padding inside wizard content area (desktop) | 0px (centered card handles it) | inherits from card |
| Card internal padding | 24px | `p-6` |
| Between navigation buttons (Retour / Suivant) | 12px | `gap-3` |

### Sizing

| Element | Height | Min Width |
|---------|--------|-----------|
| Text input | 44px | Full width |
| Select input | 44px | Determined by container |
| Button (md) | 44px | 120px |
| Button (lg) | 48px | 160px |
| Radio circle (Sexe) | 20x20px | n/a |
| Selectable card (Step 2) | auto (content) | Full width |
| Range slider track | 6px tall | Full width |
| Range slider thumb | 24x24px | n/a |
| Progress step circle | 32x32px (mobile), 36x36px (desktop) | n/a |

### Maximum Content Width

| Breakpoint | Wizard content max-width |
|------------|------------------------|
| Mobile (< 640px) | 100% (full viewport minus padding) |
| sm (640px+) | 480px |
| md (768px+) | 560px |
| lg (1024px+) | 640px |

The wizard content is always horizontally centered: `mx-auto`.

### Border Radius

Use the existing `@theme` radius tokens:

| Element | Radius | Token |
|---------|--------|-------|
| Inputs, selects | 12px | `rounded-md` (mapped to `--radius-md: 0.75rem`) |
| Buttons | 12px | `rounded-md` |
| Selectable cards (Step 2) | 16px | `rounded-lg` (mapped to `--radius-lg: 1rem`) |
| Wizard container card (desktop) | 16px | `rounded-lg` |
| Progress step circles | full | `rounded-full` |
| Error/Warning message pill (if bg) | 8px | `rounded-sm` or `rounded` |

---

## 5. Component Hierarchy

This section defines every new component needed, how they nest, and what each one is responsible for. The frontend-dev creates the actual React files. This spec defines the blueprint.

```
RetraiteWizard                       (wizard container, top-level orchestrator)
├── ProgressIndicator                (horizontal step bar at the top)
│   └── ProgressStep (x4)           (individual step circle + label)
├── WizardStepContent                (animated container that swaps step content)
│   ├── StepIdentite                 (Step 1 form)
│   │   ├── TextInput (x2)          (Prenom, Nom)
│   │   ├── RadioGroup               (Sexe: Homme / Femme)
│   │   │   └── RadioOption (x2)     (individual radio button + label)
│   │   ├── DateOfBirthSelect        (3-select composite)
│   │   │   └── SelectInput (x3)     (Jour, Mois, Annee)
│   │   └── FieldMessage (x4)       (error/helper below each field group)
│   ├── StepSituation               (Step 2 form)
│   │   ├── CardSelect               (group of selectable cards)
│   │   │   └── CardOption (x4)      (individual selectable card)
│   │   └── FieldMessage             (error below cards)
│   ├── StepObjectif                 (Step 3 form)
│   │   ├── RetirementAgeControl     (slider + numeric input composite)
│   │   │   ├── RangeSlider          (styled range input)
│   │   │   └── NumberInput          (small numeric input with "ans" suffix)
│   │   ├── FieldMessage             (error/warning below control)
│   │   └── YearsRemainingBanner     (info banner: "Il vous reste X ans...")
│   ├── StepRevenus                  (Step 4 form)
│   │   ├── CurrencyInput (x2)      (FCFA formatted input)
│   │   └── FieldMessage (x2)       (error/warning below each input)
│   └── StepResultsPlaceholder      (temporary M4-only "preparing results" view)
└── WizardNavigation                 (bottom bar with Retour / Suivant buttons)
    ├── Button (ghost — "Retour")
    └── Button (primary or accent — "Suivant" / "Voir mes resultats")
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `RetraiteWizard` | Reads `currentStep` from store, renders ProgressIndicator + current step content + WizardNavigation. Manages focus on step transitions. |
| `ProgressIndicator` | Renders 4 ProgressStep items horizontally. Receives step configs from parent. |
| `ProgressStep` | Renders a single step circle (number or checkmark) and label. Handles click for completed steps. |
| `WizardStepContent` | Wraps the current step in a transition container. Handles enter/exit animation. |
| `StepIdentite` | Renders Step 1 fields. Calls store setters on change. Calls field validators on blur. |
| `StepSituation` | Renders Step 2 card selector. Calls store setter on selection. |
| `StepObjectif` | Renders Step 3 slider/input combo. Calls store setter on change. Shows years-remaining banner. |
| `StepRevenus` | Renders Step 4 currency inputs. Calls store setters on change. Shows dynamic labels based on statut. |
| `StepResultsPlaceholder` | Static placeholder view shown after wizard completion (M4 only). |
| `TextInput` | Reusable labeled text input with all visual states. |
| `SelectInput` | Reusable labeled select dropdown with all visual states. |
| `RadioGroup` / `RadioOption` | Inline radio button group for binary choices (Sexe). |
| `CardSelect` / `CardOption` | Selectable card list for multi-choice (Statut). |
| `DateOfBirthSelect` | Composite of 3 SelectInputs for Jour/Mois/Annee with dynamic day counts. |
| `CurrencyInput` | Text input with real-time FCFA formatting, suffix display, digit-only filtering. |
| `RetirementAgeControl` | Composite of RangeSlider + NumberInput, kept in sync. |
| `RangeSlider` | Styled HTML range input with min/max labels. |
| `NumberInput` | Small numeric input field with optional suffix. |
| `FieldMessage` | Displays error (red), warning (amber), or helper (gray) text below a field. |
| `YearsRemainingBanner` | Info box displaying "Il vous reste X ans pour preparer votre retraite." |
| `WizardNavigation` | Renders Retour + Suivant buttons. Handles click handlers and disabled states. |

---

## 6. Wizard Layout

### Overall Page Structure

The wizard lives inside `RetraiteCalculateurPage.tsx`, which renders inside the `AppLayout` (Header + main + Footer). The wizard itself uses a clean, minimal layout to keep focus on the form.

```
┌──────────────────────────────────────┐
│             HEADER (fixed)           │
├──────────────────────────────────────┤
│                                      │
│   ┌──────────────────────────────┐   │
│   │      Progress Indicator      │   │  ← top of wizard
│   ├──────────────────────────────┤   │
│   │                              │   │
│   │       Step Title             │   │
│   │       Step Subtitle          │   │
│   │                              │   │
│   │       [Form Fields]          │   │  ← scrollable content area
│   │                              │   │
│   │                              │   │
│   ├──────────────────────────────┤   │
│   │    [Retour]      [Suivant]   │   │  ← sticky bottom on mobile
│   └──────────────────────────────┘   │
│                                      │
├──────────────────────────────────────┤
│             FOOTER                   │
└──────────────────────────────────────┘
```

### Mobile Layout (< 640px)

- **Background:** `neutral-50` (page default). No card wrapping — the wizard content stretches edge-to-edge with `px-4` padding.
- **Progress indicator:** Pinned to top of wizard area (scrolls with page). 
- **Content area:** Scrolls naturally. Minimum height ensures fields are visible above the nav buttons.
- **Navigation buttons:** Fixed to bottom of viewport (sticky). This prevents the user from having to scroll down to find the "Suivant" button. Uses a white background with a subtle top border (`border-t border-neutral-200`) and padding `px-4 py-3`. The page content has bottom padding equal to the nav bar height (~72px) to prevent content from being hidden behind it.

### Desktop Layout (md: 768px+)

- **Background:** `neutral-50`.
- **Card wrapping:** The wizard content is wrapped in a white card (`bg-white rounded-lg shadow-card border border-neutral-200`) centered on the page with `max-w-2xl mx-auto`. The card has `p-8` internal padding.
- **Progress indicator:** Inside the card, at the top.
- **Navigation buttons:** Inside the card, at the bottom. Not sticky — they scroll with the form content. This is fine on desktop because the form is short enough to not require scrolling in most cases.
- **Vertical centering:** The card is vertically offset from the top by `pt-8 pb-16` to give breathing room below the fixed header.

### Wizard Container Tailwind Classes

```
// Page wrapper (RetraiteCalculateurPage)
<section class="min-h-[calc(100vh-4rem)] pt-20 md:pt-24 pb-24 md:pb-16 px-4">

  // Desktop card wrapper (hidden on mobile, shown md+)
  <div class="w-full max-w-2xl mx-auto md:bg-white md:rounded-lg md:shadow-card md:border md:border-neutral-200 md:p-8">

    // Progress indicator
    // Step content
    // Navigation buttons

  </div>
</section>
```

The `pt-20` accounts for the fixed header (height 64px + 16px breathing room). On desktop, `pt-24` gives more space (header is 72px).

---

## 7. Progress Indicator

### Layout

A horizontal bar with 4 step circles connected by lines. The entire indicator is centered.

```
Mobile (< 640px):
  (1)────(2)────(3)────(4)
             Situation           ← Only current step label shown below

Desktop (md+):
  (1)────────(2)────────(3)────────(4)
  Identite   Situation   Objectif   Revenus    ← All labels shown
```

### Structure

```
<nav aria-label="Etapes du formulaire">
  <ol class="flex items-center justify-between">
    <!-- Step 1 -->
    <li class="flex flex-col items-center">
      <div class="step-circle">1</div>
      <span class="step-label">Identite</span>
    </li>
    <!-- Connector line -->
    <div class="step-connector" />
    <!-- Step 2 -->
    ...
  </ol>
</nav>
```

### Connector Lines

- Positioned between step circles using flex layout.
- `h-0.5` (2px) thick lines.
- **Completed segment:** `bg-primary-700` (solid teal).
- **Incomplete segment:** `bg-neutral-200` (light gray).
- The line between step N and step N+1 is "completed" when step N is in the completed state.

### Step Circle Visual States

| State | Circle Background | Circle Border | Content | Text Color | Clickable |
|-------|------------------|---------------|---------|------------|-----------|
| **Active** (current step) | `bg-primary-700` | none | Step number (white) | `text-white` | No (already there) |
| **Completed** (validated, past) | `bg-primary-100` | `border-2 border-primary-700` | Checkmark SVG (primary-700) | `text-primary-700` | Yes |
| **Disabled** (future, not reached) | `bg-neutral-100` | `border-2 border-neutral-200` | Step number (neutral-400) | `text-neutral-400` | No |

### Step Label Visual States

| State | Mobile | Desktop |
|-------|--------|---------|
| **Active** | Shown below circle: `text-primary-700 font-medium` | Shown below circle: `text-primary-700 font-medium` |
| **Completed** | Hidden (only circle visible) | Shown below circle: `text-neutral-700 font-normal` |
| **Disabled** | Hidden (only circle visible) | Shown below circle: `text-neutral-400 font-normal` |

### Step Circle Size

- Mobile: 32x32px (`w-8 h-8`)
- Desktop: 36x36px (`md:w-9 md:h-9`)

### Checkmark Icon (Completed State)

A simple SVG checkmark, 14x14px, stroke-width 2, color `primary-700`:

```svg
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.5 7 L5.5 10 L11.5 4" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

### Click Behavior

- Completed steps: `cursor-pointer`. On click, calls `goToStep(step)`. Add `hover:bg-primary-50` ring on the circle.
- Active step: `cursor-default`. No hover effect.
- Disabled steps: `cursor-not-allowed`. No hover effect. `pointer-events-none` on the clickable area.

### Overall Spacing

- Progress indicator has `mb-6` (24px) below it before the step content begins.
- Each step circle + label group has `min-w-[40px]` on mobile to ensure touch targets.

---

## 8. Form Field Components

### 8.1 TextInput

A labeled text input used for Prenom and Nom fields.

**Anatomy:**
```
┌─ Label ─────────────────────────────┐
│ Prenom                              │
├─────────────────────────────────────┤
│ ┌─ Input ─────────────────────────┐ │
│ │ Ex : Fatou                      │ │
│ └─────────────────────────────────┘ │
│ Helper or Error text                │
└─────────────────────────────────────┘
```

**Visual States:**

| State | Border | Background | Label | Additional |
|-------|--------|------------|-------|------------|
| Default | `border border-neutral-200` | `bg-white` | `text-neutral-700` | — |
| Focused | `border-2 border-primary-700` | `bg-white` | `text-neutral-700` | `ring-2 ring-primary-700/20` (subtle outer glow) |
| Error | `border-2 border-error-500` | `bg-white` | `text-neutral-700` | Error icon optional at right edge |
| Disabled | `border border-neutral-200` | `bg-neutral-100` | `text-neutral-400` | `cursor-not-allowed` |
| Filled (valid) | `border border-neutral-200` | `bg-white` | `text-neutral-700` | Input text is `text-neutral-900` |

**Input Classes (default):**
```
class="w-full h-11 px-3 text-base text-neutral-900 placeholder:text-neutral-400
       bg-white border border-neutral-200 rounded-md
       transition-colors duration-150
       focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20 focus:outline-none
       disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
```

**Error state override:**
```
class="border-2 border-error-500 focus:border-error-500 focus:ring-error-500/20"
```

### 8.2 SelectInput

A styled native `<select>` element. Used in the DateOfBirthSelect composite (Jour, Mois, Annee).

**Why native select:** On mobile, native selects trigger the OS picker wheel, which is a far better UX than any custom dropdown. The form targets mobile-first users in West Africa — native selects are the correct choice.

**Anatomy:**
```
┌─ Select ──────────────────────────┐
│ Mois                           ▼  │
└───────────────────────────────────┘
```

**Visual States:** Same as TextInput (Default, Focused, Error, Disabled), with the addition of:

| State | Text Color |
|-------|-----------|
| Placeholder selected (no value) | `text-neutral-400` (italic optional) |
| Value selected | `text-neutral-900` |

**Chevron indicator:** A custom SVG chevron positioned at the right edge of the select using `appearance-none` on the select and an absolutely-positioned SVG. Color: `neutral-400` (default), `primary-700` (focused).

**Select Classes:**
```
class="w-full h-11 px-3 pr-8 text-base bg-white border border-neutral-200 rounded-md
       appearance-none cursor-pointer
       transition-colors duration-150
       focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20 focus:outline-none"
```

### 8.3 RadioGroup and RadioOption

Used for the Sexe field in Step 1 (Homme / Femme). Renders as inline horizontal options.

**Layout:**
```
  (o) Homme     (o) Femme
```

**RadioOption anatomy:**
```
┌───────────────────────────┐
│  (O)  Homme               │    ← label inline with radio circle
└───────────────────────────┘
```

**Radio circle visual states:**

| State | Outer Circle | Inner Fill |
|-------|-------------|------------|
| Unselected | `border-2 border-neutral-300` (20x20px) | none |
| Unselected + hover | `border-2 border-neutral-400` | none |
| Selected | `border-2 border-primary-700` | `bg-primary-700` (10x10px centered dot) |
| Error (no selection) | `border-2 border-error-500` | none |
| Focused | `border-2 border-primary-700` + `ring-2 ring-primary-700/20` | varies |

**Implementation note:** Use a hidden native `<input type="radio">` for accessibility, with a custom visual circle rendered via a `<span>`. The hidden input receives focus; the visual span shows the states via peer selectors.

**Group layout classes:**
```
class="flex flex-wrap gap-x-6 gap-y-3"
```

Each option is a `<label>` wrapping the hidden input and the visual treatment:
```
class="flex items-center gap-2.5 cursor-pointer select-none"
```

### 8.4 CardSelect and CardOption

Used for the Statut professionnel field in Step 2. Four selectable cards laid out vertically on mobile, in a 2x2 grid on desktop.

**CardOption anatomy:**
```
┌──────────────────────────────────┐
│  Salarie(e)                      │  ← label (font-semibold)
│  Vous travaillez pour un         │  ← description (text-sm, neutral-500)
│  employeur.                      │
└──────────────────────────────────┘
```

**Visual States:**

| State | Border | Background | Shadow | Label Color |
|-------|--------|------------|--------|-------------|
| Default (unselected) | `border border-neutral-200` | `bg-white` | `shadow-card` | `text-neutral-900` |
| Hover (unselected) | `border border-neutral-300` | `bg-white` | `shadow-card-hover` slight lift | `text-neutral-900` |
| Selected | `border-2 border-primary-700` | `bg-primary-50` | `shadow-card` | `text-neutral-900` |
| Selected + checkmark | Top-right corner: small circle with checkmark icon (`bg-primary-700 text-white`, 20x20px) | — | — | — |
| Error (none selected) | All cards get `border border-error-500` (subtle, 1px) | unchanged | unchanged | unchanged |
| Focused (keyboard) | `ring-2 ring-primary-700/20 ring-offset-2` | unchanged | unchanged | unchanged |

**Card padding:** `p-4` (16px all sides).
**Card radius:** `rounded-lg` (16px).

**Layout classes:**
```
// Mobile: vertical stack
class="flex flex-col gap-3"

// Desktop (md+): 2-column grid
class="md:grid md:grid-cols-2 md:gap-3"
```

**Selection indicator (checkmark circle):**
When a card is selected, a small circle (20x20px) appears at the top-right corner (offset `-top-2 -right-2` or inset `top-3 right-3`). The circle has `bg-primary-700` background, contains a white checkmark SVG (10x10px). This provides a clear, unambiguous selection state.

**Implementation:** Each CardOption is a `<label>` wrapping a hidden `<input type="radio" name="statut">`. Clicking anywhere on the card selects it.

### 8.5 RangeSlider

A styled HTML `<input type="range">` for the retirement age in Step 3.

**Anatomy:**
```
   26 ans ─────────────●────────── 80 ans     ← min/max labels
                                               ← slider track + thumb
```

**Track styling:**
- Height: 6px (`h-1.5`)
- Radius: full (`rounded-full`)
- Filled portion (left of thumb): `bg-primary-700`
- Unfilled portion (right of thumb): `bg-neutral-200`
- The filled/unfilled split is achieved via a CSS linear-gradient on the track, computed from the current value's percentage position.

**Thumb styling:**
- Size: 24x24px (`w-6 h-6`)
- Shape: circle (`rounded-full`)
- Background: `bg-white`
- Border: `border-2 border-primary-700`
- Shadow: `shadow-md` (small elevation to look liftable)
- Hover: `border-primary-600`, `shadow-lg`
- Active (dragging): `scale-110`, `border-primary-800`
- Focus: `ring-2 ring-primary-700/20`

**Min/Max labels:**
- Positioned at the left and right ends of the slider track.
- `text-xs text-neutral-500 font-medium`
- Dynamic: min label shows "{currentAge+1} ans", max label shows "80 ans".

**Cross-browser note:** The frontend-dev must style `::-webkit-slider-thumb`, `::-moz-range-thumb`, and `::-webkit-slider-runnable-track`, `::-moz-range-track` separately. Provide a utility CSS class in `src/index.css` for this if needed.

### 8.6 NumberInput (for retirement age)

A small inline numeric input that displays and accepts the retirement age value, synced with the RangeSlider.

**Anatomy:**
```
┌─────────┐
│  60  ans │
└─────────┘
```

**Sizing:**
- Width: `w-20` (80px) — enough for "80" plus padding.
- Height: `h-11` (44px).
- The "ans" suffix is rendered as a `<span>` inside a wrapper div, positioned at the right edge. The input has `pr-10` to leave room.
- Text alignment: `text-center`.

**Input behavior:**
- `inputMode="numeric"` (shows numeric keyboard on mobile).
- `type="text"` (not `type="number"`, to avoid native spinner arrows and allow full control of formatting).
- On blur, clamp value to valid range and update store.

**Visual states:** Same as TextInput.

### 8.7 CurrencyInput

A text input with real-time FCFA formatting. Used for the two financial fields in Step 4.

**Anatomy:**
```
┌─ Label ─────────────────────────────┐
│ Votre salaire actuel (par mois)     │
├─────────────────────────────────────┤
│ ┌─ Input ───────────────────────┐   │
│ │ 250 000                  FCFA │   │
│ └───────────────────────────────┘   │
│ Helper text in neutral-500          │
│ Error/Warning text if applicable    │
└─────────────────────────────────────┘
```

**FCFA suffix positioning:**
- The suffix "FCFA" is an absolutely-positioned `<span>` inside the input wrapper, at the right edge.
- Color: `text-neutral-400`
- The input has `pr-16` to accommodate the suffix.
- The suffix is always visible (even when input is empty — it provides context).

**Input behavior:**
- `inputMode="numeric"` for mobile numeric keyboard.
- `type="text"` for full formatting control.
- As the user types, non-digit characters are stripped and the remaining digits are formatted with French locale thousand separators (spaces). The `parseFCFAInput` and `formatFCFAInput` utilities from `src/utils/validation.ts` handle this.
- Cursor position: After formatting, the cursor should be placed at the end of the formatted text. This avoids confusing cursor jumps.

**Visual states:** Same as TextInput, with the addition of warning state:

| State | Border | Additional |
|-------|--------|------------|
| Warning (non-blocking) | `border border-warning-500` | Warning icon at right edge (before FCFA suffix) |

### 8.8 FieldMessage

A reusable component for displaying helper text, error messages, or warning messages below a form field.

**Anatomy:**
```
(icon) Message text here
```

**Variants:**

| Variant | Icon | Text Color | Background | Border |
|---------|------|------------|------------|--------|
| `helper` | None | `text-neutral-500` | None | None |
| `error` | Red circle-exclamation (optional) | `text-error-500` | None | None |
| `warning` | Amber triangle-exclamation (optional) | `text-warning-500` | `bg-warning-100` (subtle) | `border border-warning-500/20` |

**Error variant** is the simplest — just red text below the field. No background needed.

**Warning variant** gets a subtle background because warnings are informational and need to be visually distinct from errors. The background helps them stand out without looking alarming.

**Layout:**
```
class="flex items-start gap-1.5 mt-1"
```

The icon (if present) is 14x14px, flex-shrink-0. The text wraps freely.

### 8.9 YearsRemainingBanner (Step 3)

An informational banner shown below the slider control in Step 3.

**Anatomy:**
```
┌──────────────────────────────────────────┐
│  Il vous reste **35 ans** pour preparer  │
│  votre retraite.                         │
└──────────────────────────────────────────┘
```

**Styling:**
- Background: `bg-primary-50`
- Border: `border border-primary-700/10`
- Radius: `rounded-lg`
- Padding: `px-4 py-3`
- Text: `text-sm text-neutral-700`
- The bold number uses `font-bold text-primary-700`

When years remaining is <= 5, this banner changes to the warning style:
- Background: `bg-warning-100`
- Border: `border border-warning-500/20`
- Text color for the number: `text-warning-500 font-bold`

When years remaining is <= 2:
- Same warning style but with stronger emphasis.
- The warning text from the PM spec replaces or supplements the banner text.

---

## 9. Step Layouts

### 9.1 Step 1 — Identite

**Field order (top to bottom):**

1. Step title: "Qui etes-vous ?"
2. Step subtitle: "Ces informations nous aident a personnaliser votre simulation."
3. Gap: 24px
4. **Prenom** — TextInput (full width)
5. Gap: 20px
6. **Nom** — TextInput (full width)
7. Gap: 20px
8. **Sexe** — RadioGroup (Homme / Femme, inline horizontal)
9. Gap: 20px
10. **Date de naissance** — DateOfBirthSelect (3 selects in a row)

**DateOfBirthSelect internal layout:**
```
Mobile:
┌────────┐ ┌──────────────┐ ┌───────────┐
│  Jour  │ │    Mois      │ │  Annee    │
└────────┘ └──────────────┘ └───────────┘
  flex-1      flex-[2]         flex-[1.5]
```

The three selects are in a `flex` row with `gap-2`. Mois gets more width (`flex-[2]`) because month names are longer. Jour is `flex-1`. Annee is `flex-[1.5]`.

A single shared label "Date de naissance" sits above the row. A single FieldMessage sits below the row (for the combined date validation error).

Each select has its own placeholder: "Jour", "Mois", "Annee".

### 9.2 Step 2 — Situation actuelle

**Field order:**

1. Step title: "Quelle est votre situation ?"
2. Step subtitle: "Cela nous aide a adapter nos conseils."
3. Gap: 24px
4. **Statut professionnel** — CardSelect (4 cards)

This is the simplest step. On mobile, the 4 cards stack vertically. On desktop, they form a 2x2 grid.

**Card content per option:**
- **Label** (bold): "Salarie(e)", "Freelance", "Etudiant(e)", "Autre"
- **Description** (normal): One line of helper text per the PM spec copy deck.

No additional fields or helper text on this step beyond the cards and potential error message below them.

### 9.3 Step 3 — Objectif retraite

**Field order:**

1. Step title: "A quel age souhaitez-vous partir a la retraite ?"
2. Step subtitle: "Choisissez l'age auquel vous aimeriez arreter de travailler."
3. Gap: 24px
4. **Large value display** — centered, showing current retirement age prominently
5. Gap: 16px
6. **RangeSlider** — full width, with min/max labels
7. Gap: 8px
8. **NumberInput** — centered below slider (alternative fine-tuning input)
9. Gap: 16px
10. **YearsRemainingBanner** — info/warning banner
11. **FieldMessage** — error if applicable

**Value display layout:**
```
            ┌─────────┐
            │   60    │  ← text-3xl font-bold text-primary-700
            │   ans   │  ← text-base font-normal text-neutral-500
            └─────────┘
```

This large value display is the visual centerpiece of the step. The number is large and branded. The word "ans" sits directly below it in lighter weight. This display updates reactively as the slider moves. It is separate from the NumberInput (which is a small input for manual entry) — both show the same value.

**Alternative layout (simpler):** If the large display feels redundant with the NumberInput, the frontend-dev may combine them: use the NumberInput as the large centered display (with `text-2xl` styling) and skip the separate read-only display. Either approach is acceptable. The key requirement is that the current age value is visually prominent and centered.

### 9.4 Step 4 — Revenus

**Field order:**

1. Step title: "Parlons de vos revenus"
2. Step subtitle: "Ces montants nous permettent de calculer votre effort d'epargne."
3. Gap: 24px
4. **Salaire actuel** — CurrencyInput (full width)
   - Label: Dynamic based on statut from Step 2 (see `STEP4_COPY_BY_STATUT` in types)
   - Helper text: Dynamic based on statut
5. Gap: 20px
6. **Revenu retraite** — CurrencyInput (full width)
   - Label: "Revenu souhaite a la retraite (par mois)"
   - Helper text: "Le montant mensuel dont vous auriez besoin pour vivre confortablement."

**Dynamic labels:** The first field's label and helper text change based on the `statut` value from Step 2. The store selector provides this. The `STEP4_COPY_BY_STATUT` constant in `src/types/retraite.ts` maps each status to its label and helper. If statut is null (should not happen if wizard flow is correct), fall back to the "autre" copy.

### 9.5 Step Results Placeholder (M4 only)

After Step 4 validation passes, the wizard transitions to this temporary view.

**Layout:**
```
         (centered content)

         [spinner or pulse icon]

      Vos resultats sont en cours
           de preparation...

        [Recommencer] (ghost button, optional)
```

**Styling:**
- Centered vertically and horizontally within the wizard content area.
- Icon: A simple animated spinner (CSS animation) or pulsing dots. Color: `primary-700`.
- Text: `text-lg text-neutral-700 font-medium`, centered.
- The progress indicator still shows at the top, with all 4 steps completed.
- Navigation buttons are hidden in this view.

---

## 10. Navigation Buttons

### Button Layout

```
Mobile:
┌──────────────────────────────────────────────┐
│                                              │
│  [Retour]                     [  Suivant  ]  │
│                                              │
└──────────────────────────────────────────────┘
  ← ghost, left-aligned        primary, right →

Desktop:
Same layout, but within the card. Not sticky.
```

**Button bar classes:**
```
// Mobile: sticky bottom
class="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3
       flex items-center justify-between
       md:static md:border-t-0 md:px-0 md:pt-8 md:pb-0"
```

### Button Specifications

**"Retour" button:**
- Variant: `ghost` (from existing Button component)
- Size: `md`
- Hidden on Step 1 (no previous step)
- Always enabled (no validation on back navigation)
- Left-aligned in the button bar

**"Suivant" button (Steps 1-3):**
- Variant: `primary` (from existing Button component)
- Size: `md`
- Right-aligned in the button bar
- On click: triggers validation. If valid, advances. If invalid, shows errors.
- Full width on mobile when "Retour" is hidden (Step 1): `w-full sm:w-auto`

**"Voir mes resultats" button (Step 4 only):**
- Variant: `accent` (gold — this is the final action, it should feel different)
- Size: `lg` (larger for emphasis)
- Right-aligned
- Same validation behavior as "Suivant"

### Disabled States

Navigation buttons are never visually disabled. They always appear clickable. Clicking "Suivant" with invalid fields triggers validation display — it does not silently fail. This is intentional: disabled buttons confuse users who do not understand why they cannot proceed.

### Button Icons (Optional Enhancement)

- "Retour": Left arrow icon before text: `<- Retour`
- "Suivant": Right arrow icon after text: `Suivant ->`
- "Voir mes resultats": No icon, or a subtle sparkle/chart icon after text.

These are nice-to-have. The frontend-dev can include them if they feel right. Inline SVGs, 16x16px, matching the button text color.

---

## 11. Responsive Breakpoints

The wizard uses Tailwind's default breakpoints:

| Breakpoint | Min-width | Key Changes |
|------------|-----------|-------------|
| Base (mobile) | 0px | Single column, full-width, sticky nav, step numbers only |
| `sm` | 640px | Max-width constraint on content (480px), buttons side by side |
| `md` | 768px | Card wrapper appears, nav is not sticky, step labels shown, 2-col cards |
| `lg` | 1024px | Max-width widens (640px), more generous padding |

### What Changes at Each Breakpoint

**Base -> sm:**
- Wizard content max-width: 480px (centered)
- Button bar: "Retour" and "Suivant" side by side (instead of full-width Suivant on Step 1)
- No other major changes

**sm -> md:**
- White card wrapper with border, shadow, and padding appears
- Progress indicator shows all step labels (not just current)
- Navigation buttons move inside the card (no longer sticky at bottom)
- Step 2 cards switch from vertical stack to 2x2 grid
- Step title size increases from `text-xl` to `text-2xl`

**md -> lg:**
- Content max-width widens from 560px to 640px
- Slightly more card padding (`p-10` instead of `p-8`)
- No other changes — the layout is stable from md upward

---

## 12. Transitions and Animations

Keep animations minimal and purposeful. Users on low-end Android devices in West Africa may experience janky animations. Performance is more important than polish.

### Step Transitions

When transitioning between steps, the content area fades:

- **Exit:** Current step content fades out (`opacity 1 -> 0`, duration 100ms)
- **Enter:** New step content fades in (`opacity 0 -> 1`, duration 150ms)
- No sliding or lateral movement (avoids layout complexity and jank).
- Total perceived transition: ~250ms.

**Implementation:** Use CSS transitions on the step content wrapper. Toggle a class that controls opacity. A `key` prop on the step content wrapper triggers React to unmount/remount, enabling the transition.

Alternatively, use a simple approach: no animation at all. Just swap the content instantly. This is perfectly acceptable and simpler to implement. The frontend-dev can add the fade later as a polish pass.

### Slider Interaction

- Thumb position updates in real-time with no transition (it follows the finger/mouse).
- The filled portion of the track updates instantly via CSS gradient.
- No easing on thumb — native range behavior is fine.

### Error Appearance

- Errors appear instantly (no fade-in). Immediate feedback is more important than smooth appearance.
- Errors disappear instantly when corrected.

### Card Selection (Step 2)

- On selection, the card border transitions from neutral to primary: `transition-colors duration-150`.
- The checkmark indicator appears instantly (no animation).
- On hover, the card slightly lifts: `transition-all duration-150 hover:-translate-y-0.5`.

### Progress Indicator

- Connector line fill (neutral to primary) uses `transition-colors duration-300` for a smooth color change when a step is completed.
- Step circle state changes (disabled to active to completed) transition smoothly: `transition-all duration-200`.

---

## 13. Accessibility

### ARIA Attributes

**Wizard container:**
```html
<div role="form" aria-label="Calculateur de retraite">
```

**Progress indicator:**
```html
<nav aria-label="Etapes du formulaire">
  <ol>
    <li>
      <button
        aria-current="step"           <!-- on active step -->
        aria-label="Etape 1: Identite, completee"  <!-- completed -->
        aria-label="Etape 2: Situation, en cours"   <!-- active -->
        aria-label="Etape 3: Objectif, non atteinte" <!-- disabled -->
        aria-disabled="true"          <!-- on disabled steps -->
      >
```

**Form fields:**
```html
<!-- Text input -->
<label for="prenom">Prenom</label>
<input
  id="prenom"
  type="text"
  aria-required="true"
  aria-invalid="true"               <!-- when field has error -->
  aria-describedby="prenom-error"   <!-- links to error message -->
/>
<p id="prenom-error" role="alert">Veuillez entrer votre prenom.</p>

<!-- Radio group -->
<fieldset>
  <legend>Sexe</legend>
  <input type="radio" id="sexe-homme" name="sexe" value="homme" />
  <label for="sexe-homme">Homme</label>
  <input type="radio" id="sexe-femme" name="sexe" value="femme" />
  <label for="sexe-femme">Femme</label>
</fieldset>

<!-- Card select (radio group semantics) -->
<fieldset aria-required="true">
  <legend>Statut professionnel</legend>
  <!-- Each card is a label wrapping a radio input -->
</fieldset>

<!-- Range slider -->
<label for="age-retraite">Age de depart</label>
<input
  id="age-retraite"
  type="range"
  min="26"
  max="80"
  aria-valuemin="26"
  aria-valuemax="80"
  aria-valuenow="60"
  aria-valuetext="60 ans"
/>

<!-- Currency input -->
<label for="salaire-actuel">Votre salaire actuel (par mois)</label>
<input
  id="salaire-actuel"
  type="text"
  inputMode="numeric"
  aria-required="true"
  aria-describedby="salaire-helper salaire-error"
/>
<p id="salaire-helper">Le montant que vous recevez chaque mois.</p>
<p id="salaire-error" role="alert">...</p>
```

### Focus Management

| Event | Focus Behavior |
|-------|---------------|
| Step transition (forward) | Focus the first interactive field of the new step |
| Step transition (backward) | Focus the first interactive field of the destination step |
| Validation failure ("Suivant" click) | Focus the first field with an error. Use `element.focus()` and `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` |
| Step indicator click (jump to completed step) | Focus the first interactive field of the destination step |
| Error message appears | The error `<p>` has `role="alert"`, which causes screen readers to announce it automatically. No manual focus on the error text. |

### Focus Ring

The global focus-visible style from `src/index.css` applies:
```css
:focus-visible {
  outline: 2px solid var(--color-primary-700);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
```

For form inputs, override with a more subtle inner ring: `focus:ring-2 focus:ring-primary-700/20` plus `focus:border-primary-700`. Remove the default outline with `focus:outline-none` and rely on the ring + border instead.

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Moves focus through all interactive elements in document order |
| Shift+Tab | Moves focus backward |
| Enter | On "Suivant" button: triggers validation and navigation. On card in Step 2: selects the card. |
| Space | On radio options (Sexe): selects the option. On cards (Step 2): selects the card. |
| Arrow Left/Right | In radio groups (Sexe): moves between options. On range slider: adjusts value by 1. |
| Arrow Up/Down | On range slider: adjusts value by 1. |

### Screen Reader Announcements

- Step transitions: When the step changes, the step title is in an `<h2>`, which screen readers will announce when focused. Additionally, the `aria-current="step"` on the progress indicator updates.
- Validation errors: `role="alert"` on error messages causes automatic announcement.
- Warnings: `role="status"` on warning messages for polite announcement (non-intrusive).
- Slider value: `aria-valuetext` provides a human-readable value ("60 ans") for screen readers.

### Color Contrast

All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text):

| Foreground | Background | Ratio | Pass? |
|-----------|------------|-------|-------|
| `neutral-900` on `white` | `#111827` on `#FFFFFF` | 15.4:1 | Yes |
| `neutral-700` on `white` | `#374151` on `#FFFFFF` | 9.8:1 | Yes |
| `neutral-500` on `white` | `#6B7280` on `#FFFFFF` | 5.0:1 | Yes |
| `neutral-400` on `white` (placeholder) | `#9CA3AF` on `#FFFFFF` | 3.0:1 | Passes for large text only; acceptable for placeholder |
| `error-500` on `white` | `#DC2626` on `#FFFFFF` | 4.6:1 | Yes |
| `warning-500` on `white` | `#D97706` on `#FFFFFF` | 3.8:1 | Passes for large text; use font-medium to compensate |
| `white` on `primary-700` | `#FFFFFF` on `#1A6B5E` | 5.5:1 | Yes |
| `primary-700` on `primary-50` | `#1A6B5E` on `#F2FAF8` | 5.3:1 | Yes |

---

## 14. Component Props Reference

This section defines the TypeScript props interface for each new component. The frontend-dev uses these as the contract when building the components.

### RetraiteWizard

```typescript
// No props — reads all state from useRetraiteStore()
interface RetraiteWizardProps {}
```

### ProgressIndicator

```typescript
interface ProgressIndicatorProps {
  steps: Array<{
    step: 1 | 2 | 3 | 4;
    label: string;
    status: "active" | "completed" | "disabled";
  }>;
  onStepClick: (step: 1 | 2 | 3 | 4) => void;
}
```

### ProgressStep

```typescript
interface ProgressStepProps {
  step: 1 | 2 | 3 | 4;
  label: string;
  status: "active" | "completed" | "disabled";
  onClick?: () => void;
}
```

### TextInput

```typescript
interface TextInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  /** ID of the element describing this input (for aria-describedby) */
  describedBy?: string;
}
```

### SelectInput

```typescript
interface SelectInputProps {
  id: string;
  label?: string;           // Optional — may be provided by parent (DateOfBirthSelect)
  value: string | number | null;
  placeholder: string;
  options: Array<{ value: string | number; label: string }>;
  error?: string | null;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** ID of the element describing this input (for aria-describedby) */
  describedBy?: string;
}
```

### RadioGroup

```typescript
interface RadioGroupProps {
  name: string;
  legend: string;           // Accessible legend text (may be visually hidden)
  value: string | null;
  options: Array<{ value: string; label: string }>;
  error?: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
}
```

### CardSelect

```typescript
interface CardSelectProps {
  name: string;
  legend: string;
  value: string | null;
  options: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  error?: string | null;
  onChange: (value: string) => void;
}
```

### CardOption

```typescript
interface CardOptionProps {
  name: string;
  value: string;
  label: string;
  description: string;
  isSelected: boolean;
  hasError: boolean;
  onChange: (value: string) => void;
}
```

### DateOfBirthSelect

```typescript
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
```

### CurrencyInput

```typescript
interface CurrencyInputProps {
  id: string;
  label: string;
  value: number | null;       // Raw integer FCFA value
  placeholder?: string;
  helperText?: string;
  error?: string | null;
  warning?: string | null;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}
```

### RetirementAgeControl

```typescript
interface RetirementAgeControlProps {
  value: number;
  min: number;
  max: number;
  error?: string | null;
  onChange: (value: number) => void;
  onBlur?: () => void;
}
```

### RangeSlider

```typescript
interface RangeSliderProps {
  id: string;
  value: number;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  ariaValueText: string;
  onChange: (value: number) => void;
  onBlur?: () => void;
}
```

### FieldMessage

```typescript
interface FieldMessageProps {
  id?: string;               // For aria-describedby linking
  type: "helper" | "error" | "warning";
  message: string;
}
```

### YearsRemainingBanner

```typescript
interface YearsRemainingBannerProps {
  yearsRemaining: number;
  warningMessage?: string;   // From getStep3Warnings()
}
```

### WizardNavigation

```typescript
interface WizardNavigationProps {
  currentStep: 1 | 2 | 3 | 4;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
}
```

---

## Appendix A: File Mapping

Where each component should be created (reference for the frontend-dev):

```
src/components/
├── retraite/
│   ├── RetraiteWizard.tsx
│   ├── ProgressIndicator.tsx
│   ├── ProgressStep.tsx
│   ├── StepIdentite.tsx
│   ├── StepSituation.tsx
│   ├── StepObjectif.tsx
│   ├── StepRevenus.tsx
│   ├── StepResultsPlaceholder.tsx
│   ├── DateOfBirthSelect.tsx
│   ├── CurrencyInput.tsx
│   ├── RetirementAgeControl.tsx
│   ├── YearsRemainingBanner.tsx
│   └── WizardNavigation.tsx
├── ui/
│   ├── Button.tsx              (existing — reuse as-is)
│   ├── Badge.tsx               (existing — not used in wizard)
│   ├── TextInput.tsx           (NEW — reusable across project)
│   ├── SelectInput.tsx         (NEW — reusable across project)
│   ├── RadioGroup.tsx          (NEW — reusable across project)
│   ├── CardSelect.tsx          (NEW — reusable across project)
│   ├── CardOption.tsx          (NEW — reusable across project)
│   ├── RangeSlider.tsx         (NEW — reusable across project)
│   ├── NumberInput.tsx         (NEW — reusable across project)
│   └── FieldMessage.tsx        (NEW — reusable across project)
```

Generic, reusable form components go in `src/components/ui/`. Wizard-specific composites and step views go in `src/components/retraite/`.

---

## Appendix B: Visual Summary Per Step

### Step 1 — Mobile Wireframe (ASCII)

```
┌──────────────────────────────────┐
│  (1)───(2)───(3)───(4)          │
│        Identite                  │
│                                  │
│  Qui etes-vous ?                 │
│  Ces informations nous aident    │
│  a personnaliser votre           │
│  simulation.                     │
│                                  │
│  Prenom                          │
│  ┌──────────────────────────┐    │
│  │ Ex : Fatou               │    │
│  └──────────────────────────┘    │
│                                  │
│  Nom                             │
│  ┌──────────────────────────┐    │
│  │ Ex : Adjovi              │    │
│  └──────────────────────────┘    │
│                                  │
│  Sexe                            │
│  (o) Homme    (o) Femme          │
│                                  │
│  Date de naissance               │
│  ┌──────┐ ┌─────────┐ ┌──────┐  │
│  │ Jour │ │  Mois   │ │Annee │  │
│  └──────┘ └─────────┘ └──────┘  │
│                                  │
├──────────────────────────────────┤
│                    [ Suivant  ]  │
└──────────────────────────────────┘
```

### Step 2 — Mobile Wireframe

```
┌──────────────────────────────────┐
│  (✓)───(2)───(3)───(4)          │
│       Situation                  │
│                                  │
│  Quelle est votre situation ?    │
│  Cela nous aide a adapter nos    │
│  conseils.                       │
│                                  │
│  ┌──────────────────────────┐    │
│  │ Salarie(e)            ✓  │    │  ← selected
│  │ Vous travaillez pour un  │    │
│  │ employeur.               │    │
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ Freelance                │    │
│  │ Vous travaillez a votre  │    │
│  │ compte.                  │    │
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ Etudiant(e)              │    │
│  │ Vous etes encore en      │    │
│  │ formation.               │    │
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ Autre                    │    │
│  │ Retraite, sans emploi,   │    │
│  │ ou autre situation.      │    │
│  └──────────────────────────┘    │
│                                  │
├──────────────────────────────────┤
│  [Retour]          [ Suivant  ]  │
└──────────────────────────────────┘
```

### Step 3 — Mobile Wireframe

```
┌──────────────────────────────────┐
│  (✓)───(✓)───(3)───(4)          │
│       Objectif                   │
│                                  │
│  A quel age souhaitez-vous       │
│  partir a la retraite ?          │
│  Choisissez l'age auquel vous    │
│  aimeriez arreter de travailler. │
│                                  │
│            60                    │
│           ans                    │
│                                  │
│  26 ────────●───────────── 80    │
│                                  │
│         ┌────────┐               │
│         │ 60 ans │               │
│         └────────┘               │
│                                  │
│  ┌──────────────────────────┐    │
│  │ Il vous reste 35 ans     │    │
│  │ pour preparer votre      │    │
│  │ retraite.                │    │
│  └──────────────────────────┘    │
│                                  │
├──────────────────────────────────┤
│  [Retour]          [ Suivant  ]  │
└──────────────────────────────────┘
```

### Step 4 — Mobile Wireframe

```
┌──────────────────────────────────┐
│  (✓)───(✓)───(✓)───(4)          │
│        Revenus                   │
│                                  │
│  Parlons de vos revenus          │
│  Ces montants nous permettent    │
│  de calculer votre effort        │
│  d'epargne.                      │
│                                  │
│  Votre salaire actuel (par mois) │
│  ┌──────────────────────────┐    │
│  │ 250 000             FCFA │    │
│  └──────────────────────────┘    │
│  Le montant que vous recevez     │
│  chaque mois, avant ou apres     │
│  impots.                         │
│                                  │
│  Revenu souhaite a la retraite   │
│  (par mois)                      │
│  ┌──────────────────────────┐    │
│  │ 200 000             FCFA │    │
│  └──────────────────────────┘    │
│  Le montant mensuel dont vous    │
│  auriez besoin pour vivre        │
│  confortablement.                │
│                                  │
├──────────────────────────────────┤
│  [Retour]   [Voir mes resultats] │
└──────────────────────────────────┘
```

---

*End of design specification.*
