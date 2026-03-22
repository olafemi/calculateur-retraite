# Milestone 5 — Reactive Calculation Engine + Results Display

> **Status:** Draft
> **Author:** Product Manager
> **Date:** 2026-03-22
> **Milestone:** 5 — Retirement calculator calculation engine and results display
> **Depends on:** Milestone 4 (form wizard)

---

## 1. Overview

Milestone 5 replaces the `StepResultsPlaceholder` with a real calculation engine and results display. When the user completes all 4 wizard steps, the results screen computes and displays:

1. **Capital Cible** ("Ce qu'il vous faut") — the total lump sum needed on day one of retirement to sustain the desired monthly income for 20 years.
2. **Epargne Mensuelle Requise** ("Votre effort mensuel") — the exact monthly amount the user must invest starting today, with compound interest, to reach the Capital Cible by retirement.

Results are **reactive**: if the user navigates back to any step and changes an input, the results recalculate instantly when they return. There is no "Calculer" button.

The results are displayed in full for now. The paywall overlay (blurring/locking results until payment or account creation) is Milestone 6. However, this milestone prepares the structure so the paywall can be layered on top without refactoring.

---

## 2. Calculation Formulas

### 2.1 Input Variables

All inputs come from the Zustand store (`useRetraiteStore`), populated by the 4-step wizard:

| Variable | Source | Store Field | Description |
|----------|--------|-------------|-------------|
| `currentAge` | Computed from DOB (Step 1) | `jourNaissance`, `moisNaissance`, `anneeNaissance` | User's current age in full years |
| `retirementAge` | Step 3 | `ageRetraite` | Desired retirement age |
| `monthlyRetirementIncome` | Step 4 | `revenuRetraite` | Desired monthly income during retirement (FCFA) |
| `currentSalary` | Step 4 | `salaireActuel` | Current monthly salary (FCFA) — used for contextual alerts, not core formula |

### 2.2 Assumptions & Default Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `annualReturnRate` (r) | **0%** default (0.00) | Default at zero (worst case). User adjusts via slider (0% to 20%). Alert shown if > 15% (unrealistic). Future: preset profiles (banque, actions, FCP). |
| `annualInflationRate` (i) | **3%** default (0.03) | Average UEMOA inflation target. CPI in Benin has averaged 2-4% over the past decade. User-adjustable via slider (0% to 10%). |
| `lifeExpectancy` (L) | **75 years** | Optimistic planning horizon for West Africa. User-adjustable. |
| `retirementDurationYears` (D) | `lifeExpectancy - retirementAge` | Dynamically computed. Displayed to user as "Duree estimee de votre retraite : X ans (esperance de vie : 75 ans)". |

All three parameters (**return rate, inflation rate, life expectancy**) are **user-adjustable** via sliders displayed in a dedicated "Hypotheses" section on the results page. Changes trigger instant recalculation of all results.

### 2.3 Derived Variables

| Variable | Formula | Description |
|----------|---------|-------------|
| `yearsToRetirement` (n) | `retirementAge - currentAge` | Number of years the user has to save |
| `monthsToRetirement` (N) | `yearsToRetirement * 12` | Number of months to save |
| `realReturnRate` | `((1 + r) / (1 + i)) - 1` | Inflation-adjusted annual return rate |
| `monthlyRealRate` (rm) | `(1 + realReturnRate)^(1/12) - 1` | Monthly real return rate |
| `monthlyNominalRate` (rn) | `(1 + r)^(1/12) - 1` | Monthly nominal return rate (for accumulation phase) |
| `retirementDurationYears` (D) | `lifeExpectancy - retirementAge` | Years of retirement (e.g., 75 - 60 = 15) |
| `retirementMonths` (M) | `D * 12` | Number of months of retirement income needed |

### 2.4 Formula: Capital Cible

The Capital Cible is the present value (at retirement date) of a stream of monthly income payments over the retirement duration, adjusted for inflation.

We use the **present value of an annuity** formula with the real return rate (which accounts for inflation):

```
Capital Cible = monthlyRetirementIncome * [(1 - (1 + rm_retire)^(-M)) / rm_retire]
```

Where:
- `rm_retire` = monthly real return rate during retirement = `(1 + realReturnRate)^(1/12) - 1`
- `M` = retirement duration in months (240)
- `monthlyRetirementIncome` = desired monthly income in today's FCFA

**Why real rate?** By using the real (inflation-adjusted) return rate, the desired monthly income is treated as a constant purchasing power amount. The user says "I want 200,000 FCFA/month in today's money" and the formula accounts for inflation automatically.

**Edge case — rm_retire = 0:** If the real return rate happens to be exactly zero, the formula simplifies to:
```
Capital Cible = monthlyRetirementIncome * M
```

### 2.5 Formula: Epargne Mensuelle Requise

The monthly savings amount uses the **future value of an annuity (sinking fund)** formula. The user invests a fixed monthly amount at the nominal return rate to accumulate the Capital Cible:

```
Epargne Mensuelle = Capital Cible * [rn / ((1 + rn)^N - 1)]
```

Where:
- `rn` = monthly nominal return rate = `(1 + r)^(1/12) - 1`
- `N` = months to retirement = `yearsToRetirement * 12`
- `Capital Cible` = from Section 2.4

**Why nominal rate for accumulation?** During the saving phase, actual investment returns compound at the nominal rate. The Capital Cible already incorporates inflation protection for the retirement phase.

**Edge case — rn = 0:** If the nominal rate is zero, the formula simplifies to:
```
Epargne Mensuelle = Capital Cible / N
```

**Edge case — N = 0:** If yearsToRetirement is 0 (should not happen due to validation constraints, but defensively):
```
Epargne Mensuelle = Capital Cible  (user needs the full amount immediately)
```

### 2.6 Worked Example

**Inputs:**
- Current age: 30
- Retirement age: 60
- Desired monthly retirement income: 200,000 FCFA
- Annual return: 8%, Inflation: 3%

**Step 1 — Derived values:**
- Years to retirement: 30
- Months to retirement (N): 360
- Real annual return: (1.08 / 1.03) - 1 = 0.04854 (4.854%)
- Monthly real rate (rm_retire): (1.04854)^(1/12) - 1 = 0.003953
- Monthly nominal rate (rn): (1.08)^(1/12) - 1 = 0.006434

**Step 2 — Capital Cible:**
```
Capital Cible = 200,000 * [(1 - (1.003953)^(-240)) / 0.003953]
             = 200,000 * [(1 - 0.3876) / 0.003953]
             = 200,000 * [0.6124 / 0.003953]
             = 200,000 * 154.91
             = 30,982,000 FCFA (approx.)
```

**Step 3 — Epargne Mensuelle:**
```
Epargne Mensuelle = 30,982,000 * [0.006434 / ((1.006434)^360 - 1)]
                  = 30,982,000 * [0.006434 / (9.9357 - 1)]
                  = 30,982,000 * [0.006434 / 8.9357]
                  = 30,982,000 * 0.000720
                  = 22,307 FCFA/month (approx.)
```

**Result shown to user:**
- "Ce qu'il vous faut" : 30 982 000 FCFA
- "Votre effort mensuel" : 22 307 FCFA

### 2.7 Secondary Calculations (displayed as supporting info)

| Metric | Formula | Description |
|--------|---------|-------------|
| `totalContributions` | `Epargne Mensuelle * N` | Total amount the user will actually deposit |
| `totalInterestEarned` | `Capital Cible - totalContributions` | Total gains from compound interest |
| `savingsRatePercent` | `(Epargne Mensuelle / currentSalary) * 100` | What percentage of current salary goes to savings |

---

## 3. Assumptions — Adjustable Parameters Section

The calculation assumptions are **user-adjustable** via sliders. This section is always visible (not collapsible) on the results page, allowing real-time adjustment and instant recalculation.

### 3.1 Adjustable Parameters

**Section title:** "Ajustez vos hypotheses"

| Parameter | Input Type | Default | Min | Max | Step | Display Format | Label (French) |
|-----------|-----------|---------|-----|-----|------|----------------|----------------|
| Annual return rate | Slider + value | 0% | 0% | 20% | 0.5% | "X % par an" | "Rendement annuel estime" |
| Annual inflation rate | Slider + value | 3% | 0% | 10% | 0.5% | "X % par an" | "Inflation annuelle estimee" |
| Life expectancy | Slider + value | 75 | retirementAge + 1 | 100 | 1 | "X ans" | "Esperance de vie" |

### 3.2 Derived Display (read-only, shown below sliders)

| Metric | Display Text (French) | Value |
|--------|----------------------|-------|
| Retirement duration | "Duree estimee de votre retraite" | "{lifeExpectancy - retirementAge} ans" |
| Real return rate | "Rendement reel (apres inflation)" | "~X,XX % par an" |

### 3.3 Return Rate Alert

| Condition | Severity | Message |
|-----------|----------|---------|
| Return rate > 15% | warning (amber) | "Un rendement superieur a 15% est tres rare sur le long terme. Soyez prudent dans vos projections." |
| Return rate > 20% | error (red) | Blocked by slider max |

### 3.4 Disclaimer

Display below parameters:

> "Ces projections sont basees sur des hypotheses et ne constituent pas un conseil financier. Les rendements passes ne garantissent pas les rendements futurs."

---

## 4. Results Display Specification

### 4.1 Layout Structure

The results screen replaces the wizard steps. It has the following vertical layout (mobile-first):

```
+--------------------------------------------------+
|  [<- Modifier mes informations]                   |  (back to wizard link)
+--------------------------------------------------+
|                                                    |
|  "Bonjour {prenom},"                              |  (personalized greeting)
|  "Voici votre plan de retraite."                  |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  PRIMARY CARD (green/teal accent)                  |
|  "Votre effort mensuel"                           |
|  ████████████████████████                         |
|  22 307 FCFA / mois                               |  (large, bold, hero number)
|                                                    |
+--------------------------------------------------+
|                                                    |
|  SECONDARY CARD                                    |
|  "Ce qu'il vous faut"                             |
|  30 982 000 FCFA                                  |  (medium, prominent)
|  "Capital a accumuler d'ici vos 60 ans"           |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  BREAKDOWN CARD                                    |
|  "Comment ca marche ?"                            |
|                                                    |
|  Vous epargnez .............. 22 307 FCFA/mois    |
|  Pendant .................... 30 ans              |
|  Total de vos versements .... 8 030 520 FCFA      |
|  Les interets generes ....... 22 951 480 FCFA     |
|  Vous accumulez ............. 30 982 000 FCFA     |
|                                                    |
|  "Le taux d'effort : X% de votre salaire actuel" |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  CHART CARD                                        |
|  "Evolution de votre epargne"                     |
|  [Recharts Area Chart]                            |
|  X-axis: Age (current -> retirement)              |
|  Y-axis: Accumulated amount (FCFA)                |
|  Two areas:                                       |
|    - Contributions (darker)                       |
|    - Interest (lighter, stacked on top)           |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  CONTEXTUAL ALERT                                  |
|  (see Section 5 for conditions and messages)      |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  ASSUMPTIONS (adjustable sliders)                  |
|  "Ajustez vos hypotheses"                         |
|  [Slider: Rendement annuel]  0% -------- 20%      |
|  [Slider: Inflation]         0% -------- 10%      |
|  [Slider: Esperance de vie]  XX -------- 100      |
|  Duree de retraite: X ans (read-only)             |
|  (see Section 3)                                  |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  ACTIONS                                          |
|  [Recommencer une simulation]  (secondary button) |
|                                                    |
+--------------------------------------------------+
```

### 4.2 Primary Card — "Votre effort mensuel"

This is the hero element. The monthly savings amount must be the most visually prominent element on the entire page.

| Element | Content |
|---------|---------|
| Label | "Votre effort mensuel" |
| Value | `{formatted Epargne Mensuelle} FCFA / mois` |
| Style | Large text (text-3xl or text-4xl on mobile, text-5xl on desktop), bold, primary color |
| Card style | Accent border or background tint (primary-50 bg, primary-700 text for the number) |

### 4.3 Secondary Card — "Ce qu'il vous faut"

| Element | Content |
|---------|---------|
| Label | "Ce qu'il vous faut" |
| Value | `{formatted Capital Cible} FCFA` |
| Sublabel | "Capital a accumuler d'ici vos {retirementAge} ans" |
| Style | Medium text (text-2xl), semi-bold |

### 4.4 Breakdown Card — "Comment ca marche ?"

A simple summary table showing the math in plain language.

| Row | Label | Value |
|-----|-------|-------|
| 1 | "Vous epargnez" | `{Epargne Mensuelle} FCFA/mois` |
| 2 | "Pendant" | `{yearsToRetirement} ans` |
| 3 | "Total de vos versements" | `{totalContributions} FCFA` |
| 4 | "Les interets generes" | `{totalInterestEarned} FCFA` |
| 5 | "Vous accumulez" | `{Capital Cible} FCFA` (bold, with a bottom border to emphasize as total) |

Below the table:
- "Le taux d'effort : **{savingsRatePercent}%** de votre salaire actuel"
- If `savingsRatePercent > 100`, do NOT show this line (it would be confusing). Instead show the unrealistic target alert (see Section 5).

### 4.5 Chart Card — "Evolution de votre epargne"

A stacked area chart built with **Recharts** (already installed).

**Chart specifications:**

| Property | Value |
|----------|-------|
| Chart type | `AreaChart` (stacked) |
| X-axis | User's age, from `currentAge` to `retirementAge`, one data point per year |
| Y-axis | Amount in FCFA, auto-scaled, formatted with `fr-FR` locale and abbreviated (e.g., "10M", "20M") |
| Area 1 (bottom) | "Vos versements" — cumulative contributions at each age. Color: primary-600 |
| Area 2 (top, stacked) | "Interets cumules" — cumulative interest earned. Color: primary-300 |
| Tooltip | On hover/tap, show age, cumulative contributions, cumulative interest, and total |
| Legend | Below chart: colored dots + labels "Vos versements" and "Interets cumules" |
| Responsive | Container width 100%, height 250px on mobile, 300px on desktop |
| Grid | Subtle horizontal gridlines only |

**Data generation:**
For each year from `currentAge` to `retirementAge`, compute:
- `cumulativeContributions = Epargne Mensuelle * 12 * (year - currentAge)`
- `totalAccumulated = Epargne Mensuelle * [((1 + rn)^(months) - 1) / rn]` where months = `(year - currentAge) * 12`
- `cumulativeInterest = totalAccumulated - cumulativeContributions`

Each data point: `{ age, contributions: cumulativeContributions, interest: cumulativeInterest, total: totalAccumulated }`

### 4.6 Actions

| Action | Button Text | Behavior |
|--------|-------------|----------|
| Reset | "Recommencer une simulation" | Calls `store.reset()`, returns to Step 1 |
| Modify | "Modifier mes informations" | Sets `wizardCompleted = false`, returns to Step 1 (preserving all data) |

"Modifier mes informations" appears at the top of the results page as a link/text button (not a primary button). "Recommencer une simulation" appears at the bottom as a secondary/outline button.

### 4.7 Paywall Preparation

Although the paywall is Milestone 6, the results display must be structured to support it:

- The results content (cards, chart, breakdown) should be wrapped in a single container div with a data attribute or CSS class (e.g., `results-content`) that can be targeted by a blur overlay.
- The primary card ("Votre effort mensuel") values should be extractable as props so they can be replaced with "XXX XXX FCFA" in locked state.
- Export a `ResultsData` type from the calculation utils that contains all computed values, so the paywall component can check if results exist without re-computing.

---

## 5. Contextual Alerts

Alerts provide situational guidance based on the user's inputs and results. They appear as colored banners/cards in the results view.

### 5.1 Alert Definitions

| ID | Condition | Severity | Icon | Message (French) |
|----|-----------|----------|------|-------------------|
| `time-very-short` | `yearsToRetirement <= 2` | warning (amber) | Clock | "Vous etes tres proche de la retraite. L'effort d'epargne mensuel est tres eleve. Consultez un conseiller financier pour explorer vos options." |
| `time-short` | `yearsToRetirement <= 5` AND `> 2` | info (blue) | Clock | "Il vous reste peu de temps. Chaque mois compte ! Commencez le plus tot possible." |
| `unrealistic-savings` | `savingsRatePercent > 50` | warning (amber) | Alert triangle | "L'effort d'epargne represente plus de la moitie de votre salaire actuel. Envisagez de reduire votre objectif de revenu a la retraite ou de repousser l'age de depart." |
| `impossible-savings` | `savingsRatePercent > 100` | error (red) | Alert circle | "Le montant mensuel depasse votre salaire actuel. Cet objectif n'est pas atteignable avec vos revenus actuels. Ajustez votre revenu souhaite ou votre age de depart." |
| `on-track` | `savingsRatePercent <= 20` AND `yearsToRetirement >= 10` | success (green) | Checkmark | "Bonne nouvelle ! Avec un effort modere, vous pouvez atteindre votre objectif. La cle : commencer maintenant et rester regulier." |
| `moderate-effort` | `savingsRatePercent > 20` AND `<= 50` AND `yearsToRetirement >= 5` | info (blue) | Info circle | "Votre objectif est ambitieux mais realiste. Mettez en place un virement automatique pour ne jamais oublier." |

### 5.2 Alert Priority

If multiple conditions match, show alerts in this priority order (highest first). Show a maximum of **2 alerts** to avoid overwhelming the user:

1. `impossible-savings` (always show if true — highest priority)
2. `unrealistic-savings`
3. `time-very-short`
4. `time-short`
5. `on-track`
6. `moderate-effort`

### 5.3 Alert Component Structure

Each alert is a horizontal card with:
- Left: colored icon (matches severity)
- Right: message text
- Background: light tint matching severity color
- Border-left: 4px solid in severity color
- No dismiss button (always visible)

---

## 6. Reactive Behavior

### 6.1 When Results Recompute

Results recompute **immediately** whenever the source data changes. Since the wizard and results share the same Zustand store, any change to a wizard field triggers a re-render of any component reading the computed results.

The calculation is a **pure function** — it takes the store state as input and returns computed results. It does NOT write back to the store. Components call the calculation function directly (or via a hook) on each render.

### 6.2 Navigation Between Results and Wizard

| User Action | Behavior |
|-------------|----------|
| User is on results, clicks "Modifier mes informations" | `wizardCompleted` set to `false`, navigate to Step 1. All data preserved. |
| User changes a value in any step | Data updates in store immediately. |
| User completes wizard again ("Voir mes resultats") | `wizardCompleted` set to `true`, results screen shows with new calculations. |
| User clicks "Recommencer une simulation" | `store.reset()` called. All data cleared. Returns to Step 1. |

### 6.3 No Debouncing Needed

The calculation is a simple arithmetic operation (microseconds). No debouncing or memoization is required. However, the chart data generation (one point per year, up to ~66 data points) should use `useMemo` to avoid regenerating on every unrelated re-render.

---

## 7. Edge Cases

### 7.1 Arithmetic Edge Cases

| Scenario | Handling |
|----------|----------|
| `yearsToRetirement = 1` (minimum possible) | Calculation works normally. N=12 months. Monthly amount will be high. Contextual alert warns. |
| `yearsToRetirement` very large (e.g., 66 years for a 14-year-old retiring at 80) | Calculation works normally. Monthly amount will be very small due to compound interest over long period. |
| `revenuRetraite` at minimum (10,000 FCFA) | Capital Cible will be small. No special handling needed. |
| `revenuRetraite` at maximum (50,000,000 FCFA) | Capital Cible will be very large. Numbers formatted normally. May trigger `impossible-savings` alert. |
| Interest rate = 0 (default value, user hasn't adjusted slider) | Use simplified formulas (see Section 2.4 and 2.5 edge cases). |
| Very large computed values (overflow) | JavaScript `Number` can safely represent values up to ~9 quadrillion. No FCFA amount in this calculator can approach this. Not a concern. |

### 7.2 Display Edge Cases

| Scenario | Handling |
|----------|----------|
| Monthly savings > 1 billion FCFA | Display the number formatted normally. The `impossible-savings` alert covers the UX. |
| Monthly savings < 1,000 FCFA | Display normally. The `on-track` alert provides encouragement. |
| Savings rate > 1000% | Do NOT display the savings rate line. Show `impossible-savings` alert instead. |
| Chart with only 1-2 data points | Show at minimum 2 points (start and end). If only 1 year, show monthly granularity (12 points). |
| User's name is very long | Truncate greeting with CSS (`text-overflow: ellipsis`) or wrap naturally. |

### 7.3 Data Integrity

| Scenario | Handling |
|----------|----------|
| Store has `wizardCompleted = true` but missing required fields (e.g., corrupted localStorage) | Before computing, validate that all required fields are present. If not, set `wizardCompleted = false` and return user to the first incomplete step. |
| `currentAge` cannot be computed (DOB fields null) | Should not happen if wizard completed correctly. Defensive: show error state with "Modifier mes informations" link. |

---

## 8. Technical Architecture

### 8.1 New Files

| File | Purpose |
|------|---------|
| `src/utils/retraite.ts` | Pure calculation functions (Capital Cible, Epargne Mensuelle, chart data, alerts) |
| `src/types/retraiteResults.ts` | TypeScript types for calculation results |
| `src/components/retraite/StepResults.tsx` | Main results container (replaces StepResultsPlaceholder) |
| `src/components/retraite/ResultsPrimaryCard.tsx` | "Votre effort mensuel" hero card |
| `src/components/retraite/ResultsSecondaryCard.tsx` | "Ce qu'il vous faut" card |
| `src/components/retraite/ResultsBreakdown.tsx` | "Comment ca marche ?" table |
| `src/components/retraite/ResultsChart.tsx` | Recharts area chart |
| `src/components/retraite/ResultsAlerts.tsx` | Contextual alert banners |
| `src/components/retraite/ResultsAssumptions.tsx` | Collapsible assumptions section |

### 8.2 Modified Files

| File | Changes |
|------|---------|
| `src/components/retraite/RetraiteWizard.tsx` | Replace `<StepResultsPlaceholder />` with `<StepResults />` when `wizardCompleted === true` |
| `src/stores/retraiteStore.ts` | Add `setWizardCompleted` action (to allow going back to wizard from results) |
| `src/types/retraite.ts` | Add `ResultsData` type export (or import from new file) |

### 8.3 Calculation Module API (`src/utils/retraite.ts`)

```typescript
// Constants
export const CALCULATION_PARAMS = {
  annualReturnRate: 0.08,
  annualInflationRate: 0.03,
  retirementDurationYears: 20,
};

// Core calculations
export function computeCapitalCible(
  monthlyRetirementIncome: number,
  params?: Partial<typeof CALCULATION_PARAMS>
): number;

export function computeEpargneMensuelle(
  capitalCible: number,
  monthsToRetirement: number,
  params?: Partial<typeof CALCULATION_PARAMS>
): number;

// Full results computation
export function computeRetirementResults(
  currentAge: number,
  retirementAge: number,
  monthlyRetirementIncome: number,
  currentSalary: number,
  params?: Partial<typeof CALCULATION_PARAMS>
): ResultsData;

// Chart data generation
export function generateChartData(
  currentAge: number,
  retirementAge: number,
  epargneMensuelle: number,
  params?: Partial<typeof CALCULATION_PARAMS>
): ChartDataPoint[];

// Alert evaluation
export function evaluateAlerts(
  yearsToRetirement: number,
  savingsRatePercent: number
): AlertDefinition[];
```

### 8.4 Results Data Type (`src/types/retraiteResults.ts`)

```typescript
export interface ResultsData {
  // Core results
  capitalCible: number;          // Total needed at retirement (FCFA)
  epargneMensuelle: number;      // Monthly savings required (FCFA)

  // Supporting metrics
  yearsToRetirement: number;
  monthsToRetirement: number;
  totalContributions: number;    // epargneMensuelle * monthsToRetirement
  totalInterestEarned: number;   // capitalCible - totalContributions
  savingsRatePercent: number;    // (epargneMensuelle / currentSalary) * 100

  // Parameters used (for display in assumptions)
  params: {
    annualReturnRate: number;
    annualInflationRate: number;
    retirementDurationYears: number;
    realReturnRate: number;
  };

  // Chart data
  chartData: ChartDataPoint[];

  // Contextual alerts
  alerts: AlertDefinition[];
}

export interface ChartDataPoint {
  age: number;
  contributions: number;     // Cumulative deposits
  interest: number;          // Cumulative interest earned
  total: number;             // contributions + interest
}

export type AlertSeverity = "success" | "info" | "warning" | "error";

export interface AlertDefinition {
  id: string;
  severity: AlertSeverity;
  message: string;
}
```

---

## 9. Copy Deck (French)

All user-facing text in the results view.

### 9.1 Results Header

| Element | Text |
|---------|------|
| Greeting | "Bonjour {prenom}," |
| Subtitle | "Voici votre plan de retraite." |
| Back to wizard link | "← Modifier mes informations" |

### 9.2 Primary Card

| Element | Text |
|---------|------|
| Label | "Votre effort mensuel" |
| Value | "{amount} FCFA / mois" |

### 9.3 Secondary Card

| Element | Text |
|---------|------|
| Label | "Ce qu'il vous faut" |
| Value | "{amount} FCFA" |
| Sublabel | "Capital a accumuler d'ici vos {retirementAge} ans" |

### 9.4 Breakdown

| Element | Text |
|---------|------|
| Title | "Comment ca marche ?" |
| Row 1 | "Vous epargnez" / "{amount} FCFA/mois" |
| Row 2 | "Pendant" / "{years} ans" |
| Row 3 | "Total de vos versements" / "{amount} FCFA" |
| Row 4 | "Les interets generes" / "{amount} FCFA" |
| Row 5 (total) | "Vous accumulez" / "{amount} FCFA" |
| Savings rate | "Le taux d'effort : {percent}% de votre salaire actuel" |

### 9.5 Chart

| Element | Text |
|---------|------|
| Title | "Evolution de votre epargne" |
| Legend 1 | "Vos versements" |
| Legend 2 | "Interets cumules" |
| Y-axis label | (none — values self-explanatory) |
| X-axis label | "Age" |

### 9.6 Adjustable Assumptions

| Element | Text |
|---------|------|
| Section title | "Ajustez vos hypotheses" |
| Slider 1 label | "Rendement annuel estime" |
| Slider 2 label | "Inflation annuelle estimee" |
| Slider 3 label | "Esperance de vie" |
| Derived row 1 | "Duree estimee de votre retraite : {X} ans" |
| Derived row 2 | "Rendement reel (apres inflation) : ~{X} % par an" |
| Return rate warning (>15%) | "Un rendement superieur a 15% est tres rare sur le long terme. Soyez prudent dans vos projections." |
| Disclaimer | "Ces projections sont basees sur des hypotheses et ne constituent pas un conseil financier. Les rendements passes ne garantissent pas les rendements futurs." |

### 9.7 Actions

| Element | Text |
|---------|------|
| Reset button | "Recommencer une simulation" |
| Back to wizard | "← Modifier mes informations" |

---

## 10. Acceptance Criteria

### AC-1: Calculation Engine — Pure Functions

- [ ] `computeCapitalCible` correctly computes the present value of annuity using the real return rate
- [ ] `computeEpargneMensuelle` correctly computes the sinking fund payment using the nominal return rate
- [ ] Both functions handle edge cases: zero interest rate, single month, very long horizons
- [ ] Worked example from Section 2.6 produces matching results (within 1% rounding tolerance)
- [ ] All calculation functions are pure (no side effects, no store access, no DOM)
- [ ] Calculation parameters are exported as constants and easily adjustable

### AC-2: Results Display — Layout

- [ ] Results screen appears automatically when `wizardCompleted === true` (no button to trigger)
- [ ] Greeting shows the user's first name from the store
- [ ] Primary card ("Votre effort mensuel") is the most visually prominent element
- [ ] Secondary card ("Ce qu'il vous faut") shows the Capital Cible with sublabel
- [ ] Breakdown card shows all 5 rows with correct computed values
- [ ] Savings rate percentage is shown (unless > 100%)
- [ ] All FCFA amounts are formatted with French locale thousand separators
- [ ] Layout is responsive: single column on mobile, reasonable spacing on desktop

### AC-3: Chart

- [ ] Stacked area chart renders with Recharts
- [ ] X-axis shows age from current age to retirement age
- [ ] Two stacked areas: contributions (bottom, darker) and interest (top, lighter)
- [ ] Tooltip shows values on hover/tap
- [ ] Legend displays below the chart
- [ ] Chart is responsive (fills container width)
- [ ] Chart handles edge case of short timeframes (1-2 years) gracefully

### AC-4: Contextual Alerts

- [ ] Correct alert(s) display based on savings rate and years to retirement
- [ ] Maximum 2 alerts displayed
- [ ] Priority ordering is respected when multiple conditions match
- [ ] Alerts use correct severity colors (green/blue/amber/red)
- [ ] Alert for `impossible-savings` shows when monthly savings > current salary
- [ ] Alert for `on-track` shows when savings rate <= 20% and years >= 10

### AC-5: Adjustable Assumptions Section

- [ ] Section with 3 sliders: rendement (0-20%, default 0%), inflation (0-10%, default 3%), esperance de vie (retirementAge+1 to 100, default 75)
- [ ] Changing any slider instantly recalculates all results, chart, and alerts
- [ ] Derived values displayed: "Duree estimee de votre retraite" and "Rendement reel (apres inflation)"
- [ ] Warning alert when return rate > 15%
- [ ] Disclaimer text displayed below sliders

### AC-6: Reactive Behavior

- [ ] User clicks "Modifier mes informations", returns to Step 1 with all data preserved
- [ ] User changes retirement age (Step 3), completes wizard again, results update
- [ ] User changes desired income (Step 4), completes wizard again, results update
- [ ] "Recommencer une simulation" resets all data and returns to Step 1

### AC-7: Edge Cases

- [ ] 1-year timeframe: calculation works, chart renders, `time-very-short` alert shows
- [ ] Very large amounts (50M FCFA retirement income): numbers display correctly, `impossible-savings` alert shows if applicable
- [ ] Corrupted localStorage (missing fields but `wizardCompleted = true`): gracefully falls back to wizard

### AC-8: Paywall Preparation

- [ ] Results content is wrapped in a container that can accept an overlay
- [ ] `ResultsData` type is exported for use by future paywall component
- [ ] The results component structure supports conditional blurring/locking without refactoring

---

## 11. Scope

### In Scope (Milestone 5)

- Calculation engine (pure functions in `src/utils/retraite.ts`)
- Results types (`src/types/retraiteResults.ts`)
- Results display (all cards, chart, alerts, assumptions)
- Reactive recalculation on input changes
- Navigation between results and wizard (modify / reset)
- Paywall-ready container structure
- French copy deck for all results UI

### Out of Scope (Future Milestones)

| Item | Milestone |
|------|-----------|
| Paywall overlay (blur/lock results) | 6 |
| KKiaPay payment integration | 7 |
| User authentication (save simulations) | 2 (exists, not connected) |
| WhatsApp share button | 9 |
| PDF/image export of results | Future |
| Investment profile presets (banque, actions, FCP) | Future |
| Multiple scenario comparison (side-by-side) | Future |
| Server-side calculation (API route) | Future |
| Animation/transitions between wizard and results | Nice-to-have |

---

## 12. Key Design Decisions (Founder-Approved)

### Q: What annual return rate should we assume?

**A: 0% default, user-adjustable via slider (0-20%).** Default at zero = worst case scenario. User slides up to see the effect of investment returns. Alert if > 15%. Future milestone will add preset profiles (banque, actions, FCP).

### Q: Should we account for inflation? If so, what rate?

**A: Yes, 3% default, user-adjustable via slider (0-10%).** The BCEAO targets 1-3%. Benin CPI averages 2-4%. Inflation is accounted for via the real return rate in Capital Cible.

### Q: Retirement duration?

**A: Based on life expectancy (default 75 ans) minus retirement age.** User-adjustable via slider (retirementAge+1 to 100). Displayed as "Esperance de vie" with the derived "Duree estimee de votre retraite" shown as read-only.

### Q: Should rates be adjustable by the user?

**A: Yes, all three parameters adjustable.** Rendement, inflation, esperance de vie — all via sliders on the results page with instant recalculation.

### Q: Should we show a chart?

**A: Yes.** Stacked area chart (Recharts) showing savings growth over time. Visually demonstrates compound interest. Updates reactively when sliders change.

---

*End of specification.*
