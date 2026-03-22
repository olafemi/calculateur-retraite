# Milestone 5 — UI/UX Design Specification: Results Display with Adjustable Sliders

> **Status:** Final
> **Author:** Designer
> **Date:** 2026-03-22
> **Milestone:** 5 — Retirement calculator results display and adjustable assumptions
> **Depends on:** milestone-5-calculation.md (PM spec), milestone-4-ui-design.md (wizard design language), src/types/retraiteResults.ts (data model)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Results Page Layout](#2-results-page-layout)
3. [Navigation — Back Link and Reset](#3-navigation--back-link-and-reset)
4. [Primary Card — "Votre effort mensuel"](#4-primary-card--votre-effort-mensuel)
5. [Secondary Card — "Ce qu'il vous faut"](#5-secondary-card--ce-quil-vous-faut)
6. [Breakdown Card — "Comment ca marche ?"](#6-breakdown-card--comment-ca-marche-)
7. [Chart Card — "Evolution de votre epargne"](#7-chart-card--evolution-de-votre-epargne)
8. [Contextual Alerts](#8-contextual-alerts)
9. [Adjustable Assumptions Section](#9-adjustable-assumptions-section)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Typography and Spacing](#11-typography-and-spacing)
12. [Transitions and Animations](#12-transitions-and-animations)
13. [Accessibility](#13-accessibility)
14. [Paywall Preparation](#14-paywall-preparation)
15. [Component Hierarchy](#15-component-hierarchy)
16. [Component Props Reference](#16-component-props-reference)
17. [File Mapping](#17-file-mapping)

---

## 1. Design Principles

Carried forward from milestone-4-ui-design.md, with results-specific additions:

1. **Mobile-first:** Every layout and measurement targets 320px viewport first. Desktop enhances but never replaces.
2. **Hero number dominance:** The monthly savings amount ("Votre effort mensuel") must be the single most visually prominent element on the page. Everything else is subordinate.
3. **Instant feedback:** Slider adjustments trigger immediate recalculation. The user sees numbers change in real time. No loading spinners, no submit buttons.
4. **Visual consistency with wizard:** The results page reuses the same color tokens, radius values, shadows, and font weights from the wizard design system. It should feel like a natural continuation, not a different application.
5. **Scannable layout:** Users should get the key insight (monthly savings amount) within 1 second of seeing the page. Supporting details (breakdown, chart, assumptions) are available but not competing for attention.
6. **Touch-friendly:** All interactive targets (sliders, buttons, links) are at least 44x44px.

---

## 2. Results Page Layout

### 2.1 Overall Structure

The results page replaces the wizard steps when `wizardCompleted === true`. It renders inside the same page container (`RetraiteCalculateurPage.tsx` within `AppLayout`), maintaining header and footer consistency.

The layout is a single vertical column of content sections, wrapped in a paywall-ready container.

### 2.2 Section Order (Mobile — Top to Bottom)

```
+--------------------------------------------------+
|  HEADER (fixed, from AppLayout)                   |
+--------------------------------------------------+
|                                                    |
|  PROGRESS INDICATOR (all 4 steps completed)        |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  BACK LINK: "<- Modifier mes informations"         |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  GREETING                                          |
|  "Bonjour {prenom},"                               |
|  "Voici votre plan de retraite."                   |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  CONTEXTUAL ALERTS (0-2 alerts, stacked)           |
|                                                    |
+--------------------------------------------------+
|                                                    |  <-- results-content wrapper starts here
|  PRIMARY CARD — "Votre effort mensuel"             |
|  22 307 FCFA / mois                                |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  SECONDARY CARD — "Ce qu'il vous faut"             |
|  30 982 000 FCFA                                   |
|  "Capital a accumuler d'ici vos 60 ans"            |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  BREAKDOWN CARD — "Comment ca marche ?"            |
|  [Summary table with 5 rows]                       |
|  "Le taux d'effort : X% de votre salaire"         |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  CHART CARD — "Evolution de votre epargne"         |
|  [Recharts stacked area chart]                     |
|  [Legend: Vos versements | Interets cumules]       |
|                                                    |
+--------------------------------------------------+  <-- results-content wrapper ends here
|                                                    |
|  ASSUMPTIONS SECTION — "Ajustez vos hypotheses"    |
|  [Slider: Rendement annuel]                        |
|  [Slider: Inflation annuelle]                      |
|  [Slider: Esperance de vie]                        |
|  [Derived: Duree / Rendement reel]                 |
|  [Disclaimer]                                      |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  RESET BUTTON: "Recommencer une simulation"        |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  FOOTER (from AppLayout)                           |
+--------------------------------------------------+
```

### 2.3 Desktop Layout (md: 768px+)

On desktop, the results content is wrapped in the same white card container used by the wizard:

```
// Desktop card wrapper
<div class="w-full max-w-2xl mx-auto md:bg-white md:rounded-lg md:shadow-card
            md:border md:border-neutral-200 md:p-8 lg:p-10">
```

All content sections stack vertically within this card. No multi-column layout for the results page — single column keeps the reading flow simple and ensures the hero number retains its dominance.

### 2.4 Page Container

The results page uses the same outer container as the wizard:

```
// Page wrapper (same as wizard)
<section class="min-h-[calc(100vh-4rem)] pt-20 md:pt-24 pb-24 md:pb-16 px-4">
```

---

## 3. Navigation — Back Link and Reset

### 3.1 Back Link — "Modifier mes informations"

Positioned at the top of the results content, above the greeting. This is a text link (not a button), providing a low-friction way to return to the wizard.

**Placement:** First element after the progress indicator, above the greeting.

**Appearance:**

| Property | Value |
|----------|-------|
| Text | `"<- Modifier mes informations"` (the `<-` is a left arrow entity: `\u2190`) |
| Font size | `text-sm` (14px) |
| Font weight | `font-medium` (500) |
| Color | `text-primary-700` |
| Hover | `text-primary-600 underline` |
| Min height | `44px` (touch target — use `min-h-[44px] flex items-center`) |
| Padding | `py-2` (vertical padding for touch target) |
| Margin | `mb-4` below the link before the greeting |

**Behavior:** Calls `setWizardCompleted(false)`. Returns user to Step 1 with all data preserved.

**Tailwind classes:**
```
class="flex items-center gap-1.5 min-h-[44px] py-2 mb-4
       text-sm font-medium text-primary-700
       hover:text-primary-600 hover:underline
       transition-colors duration-150"
```

**Arrow icon:** Inline SVG, 16x16px, stroke-based left arrow:
```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

### 3.2 Greeting

Below the back link. Personalized with the user's first name from the store.

| Element | Text | Style |
|---------|------|-------|
| Greeting line | `"Bonjour {prenom},"` | `text-xl md:text-2xl font-bold text-neutral-900` |
| Subtitle | `"Voici votre plan de retraite."` | `text-sm md:text-base font-normal text-neutral-500 mt-1` |
| Container spacing | `mb-6` below greeting before first content card |

**Edge case — long name:** The greeting wraps naturally. No truncation needed since first names are typically short. If the name is extremely long (corrupted data), CSS `overflow-wrap: break-word` on the container handles it.

### 3.3 Reset Button — "Recommencer une simulation"

Positioned at the very bottom of the results page, after the assumptions section. Uses the ghost/outline button variant.

| Property | Value |
|----------|-------|
| Text | `"Recommencer une simulation"` |
| Variant | `ghost` (outline style) |
| Size | `md` (44px height) |
| Width | Full width on mobile (`w-full`), auto on desktop (`sm:w-auto`) |
| Color | `text-primary-700 border-primary-700 hover:bg-primary-50` |
| Margin | `mt-8` above (spacing from assumptions section) |

**Behavior:** Calls `store.reset()`. Clears all data and returns to Step 1.

**Tailwind classes:**
```
class="w-full sm:w-auto h-11 px-6
       text-base font-semibold text-primary-700
       bg-transparent border border-primary-700 rounded-md
       hover:bg-primary-50 active:bg-primary-100
       transition-colors duration-150"
```

---

## 4. Primary Card — "Votre effort mensuel"

This is the hero element of the entire results page. It must be the first thing the user's eye lands on after the greeting.

### 4.1 Visual Design

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  Votre effort mensuel                              │  <- label
│                                                    │
│           22 307 FCFA                              │  <- hero number (centered)
│              / mois                                │  <- unit suffix
│                                                    │
└──────────────────────────────────────────────────┘
```

### 4.2 Specifications

| Element | Style |
|---------|-------|
| Card background | `bg-primary-50` |
| Card border | `border border-primary-700/20` |
| Card radius | `rounded-lg` (16px) |
| Card padding | `px-6 py-6 md:py-8` |
| Card text alignment | `text-center` |
| Card margin | First card in the content area, no top margin (greeting provides spacing) |
| Label text | `"Votre effort mensuel"` |
| Label style | `text-sm md:text-base font-medium text-primary-800 uppercase tracking-wide` |
| Value (number) | Formatted with `fr-FR` locale thousand separators + ` FCFA` |
| Value style | `text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-700 mt-3 tabular-nums` |
| Unit suffix | `"/ mois"` |
| Unit style | `text-base md:text-lg font-normal text-primary-700/70 mt-1` |

### 4.3 Number Formatting

The hero number uses the `formatFCFA` utility but is split for styling purposes:
- The number part (e.g., `"22 307"`) is rendered in the large bold style.
- The `"FCFA"` suffix is part of the same line but can be rendered at a slightly smaller size: `text-2xl md:text-3xl font-bold` (instead of extrabold).
- The `"/ mois"` sits on the next line.

**Implementation approach:**
```
<p class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-700 mt-3 tabular-nums">
  {formattedNumber} <span class="text-2xl md:text-3xl font-bold">FCFA</span>
</p>
<p class="text-base md:text-lg font-normal text-primary-700/70 mt-1">/ mois</p>
```

### 4.4 Live Region

The primary card value is a live region so screen readers announce recalculations:
```html
<div aria-live="polite" aria-atomic="true">
  <!-- value and unit -->
</div>
```

---

## 5. Secondary Card — "Ce qu'il vous faut"

### 5.1 Visual Design

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  Ce qu'il vous faut                                │  <- label
│  30 982 000 FCFA                                   │  <- value
│  Capital a accumuler d'ici vos 60 ans              │  <- sublabel
│                                                    │
└──────────────────────────────────────────────────┘
```

### 5.2 Specifications

| Element | Style |
|---------|-------|
| Card background | `bg-white` (mobile: transparent, desktop: part of white card container) |
| Card border | `border border-neutral-200` |
| Card radius | `rounded-lg` |
| Card padding | `px-6 py-5` |
| Card margin | `mt-4` (below primary card) |
| Label | `"Ce qu'il vous faut"` |
| Label style | `text-sm font-medium text-neutral-500 uppercase tracking-wide` |
| Value | Formatted Capital Cible + ` FCFA` |
| Value style | `text-2xl md:text-3xl font-bold text-neutral-900 mt-2 tabular-nums` |
| Sublabel | `"Capital a accumuler d'ici vos {retirementAge} ans"` |
| Sublabel style | `text-sm font-normal text-neutral-500 mt-1` |

---

## 6. Breakdown Card — "Comment ca marche ?"

### 6.1 Visual Design

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  Comment ca marche ?                               │  <- title
│                                                    │
│  Vous epargnez ............. 22 307 FCFA/mois      │
│  Pendant ................... 30 ans                │
│  Total de vos versements ... 8 030 520 FCFA        │
│  Les interets generes ...... 22 951 480 FCFA       │
│  ──────────────────────────────────────────────    │
│  Vous accumulez ............ 30 982 000 FCFA       │  <- total row (bold)
│                                                    │
│  Le taux d'effort : 8.9% de votre salaire actuel  │  <- savings rate (conditional)
│                                                    │
└──────────────────────────────────────────────────┘
```

### 6.2 Specifications

| Element | Style |
|---------|-------|
| Card background | `bg-white` (mobile: transparent, desktop: part of white card container) |
| Card border | `border border-neutral-200` |
| Card radius | `rounded-lg` |
| Card padding | `px-6 py-5` |
| Card margin | `mt-4` |
| Title | `"Comment ca marche ?"` |
| Title style | `text-lg md:text-xl font-bold text-neutral-900 mb-4` |

### 6.3 Summary Table

The table uses a definition-list style layout: each row has a label (left) and a value (right), spread across the full width using flexbox.

**Row layout:**
```
class="flex justify-between items-baseline py-2.5"
```

**Row specifications:**

| Row | Label | Value |
|-----|-------|-------|
| 1 | `"Vous epargnez"` | `"{epargneMensuelle} FCFA/mois"` |
| 2 | `"Pendant"` | `"{yearsToRetirement} ans"` |
| 3 | `"Total de vos versements"` | `"{totalContributions} FCFA"` |
| 4 | `"Les interets generes"` | `"{totalInterestEarned} FCFA"` |
| 5 (total) | `"Vous accumulez"` | `"{capitalCible} FCFA"` |

**Standard row label:** `text-sm text-neutral-700 font-normal`
**Standard row value:** `text-sm text-neutral-900 font-semibold tabular-nums`

**Total row (row 5) — visually distinct:**
- Top border: `border-t-2 border-primary-700/20 pt-3 mt-1`
- Label: `text-sm text-neutral-900 font-semibold`
- Value: `text-base text-primary-700 font-bold tabular-nums`

**Row separator:** Rows 1-4 have a subtle bottom border: `border-b border-neutral-100`. This creates a visual rhythm without being heavy.

### 6.4 Savings Rate Line

Below the table (with `mt-4 pt-3 border-t border-neutral-200`):

| Condition | Display |
|-----------|---------|
| `savingsRatePercent <= 100` | `"Le taux d'effort : {savingsRatePercent}% de votre salaire actuel"` |
| `savingsRatePercent > 100` | Do NOT display this line. The `impossible-savings` alert covers this case. |

**Style:** `text-sm text-neutral-500 font-normal`. The percentage is bold: `font-semibold text-neutral-700`.

---

## 7. Chart Card — "Evolution de votre epargne"

### 7.1 Visual Design

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  Evolution de votre epargne                        │  <- title
│                                                    │
│  ┌──────────────────────────────────────────┐      │
│  │       ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱       │      │  <- interest (lighter)
│  │    ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱         │      │
│  │  ████████████████████████████████         │      │  <- contributions (darker)
│  │  ████████████████████████████████         │      │
│  │  30    35    40    45    50    55   60    │      │  <- age axis
│  └──────────────────────────────────────────┘      │
│                                                    │
│  ● Vos versements   ● Interets cumules             │  <- legend
│                                                    │
└──────────────────────────────────────────────────┘
```

### 7.2 Card Specifications

| Element | Style |
|---------|-------|
| Card background | `bg-white` (mobile: transparent, desktop: part of card container) |
| Card border | `border border-neutral-200` |
| Card radius | `rounded-lg` |
| Card padding | `px-4 py-5 md:px-6` (less horizontal padding on mobile to give chart more room) |
| Card margin | `mt-4` |
| Title | `"Evolution de votre epargne"` |
| Title style | `text-lg md:text-xl font-bold text-neutral-900 mb-4` |

### 7.3 Recharts Area Chart Configuration

| Property | Value |
|----------|-------|
| Chart component | `<ResponsiveContainer>` wrapping `<AreaChart>` |
| Container height | `250px` mobile, `300px` desktop (`h-[250px] md:h-[300px]`) |
| Container width | `100%` (responsive) |
| Chart margins | `{ top: 10, right: 10, bottom: 0, left: 10 }` |
| X-axis dataKey | `"age"` |
| X-axis type | `"number"` with `domain={['dataMin', 'dataMax']}` |
| X-axis label | None (age values are self-explanatory) |
| X-axis tick style | `{ fontSize: 12, fill: '#6B7280' }` (neutral-500) |
| Y-axis | Auto-scaled, formatted with abbreviations |
| Y-axis tick formatter | Abbreviate large numbers: `"10M"`, `"20M"`, `"500K"` using `fr-FR` locale |
| Y-axis tick style | `{ fontSize: 11, fill: '#9CA3AF' }` (neutral-400) |
| Y-axis width | `60` (enough for abbreviated labels) |
| Grid | `<CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />` (horizontal lines only, neutral-200) |

### 7.4 Area Layers

Two stacked areas, rendered bottom-to-top:

| Area | dataKey | Fill Color | Stroke Color | Fill Opacity |
|------|---------|------------|--------------|-------------|
| Contributions (bottom) | `"contributions"` | `var(--color-primary-700)` / `#1A6B5E` | `var(--color-primary-700)` / `#1A6B5E` | `0.7` |
| Interest (top, stacked) | `"interest"` | `var(--color-primary-100)` / `#E6F4F1` | `var(--color-primary-600)` / `#21856F` | `0.8` |

Both areas use `type="monotone"` for smooth curves and `stackId="1"` for stacking.

### 7.5 Tooltip

Custom tooltip that appears on hover (desktop) and tap (mobile):

```
┌─────────────────────────────┐
│  Age : 45 ans               │
│  Vos versements: 4 015 260  │
│  Interets cumules: 2 896 000│
│  Total: 6 911 260 FCFA      │
└─────────────────────────────┘
```

**Tooltip styling:**
| Property | Value |
|----------|-------|
| Background | `bg-white` |
| Border | `border border-neutral-200` |
| Shadow | `shadow-card` |
| Radius | `rounded-md` (12px) |
| Padding | `px-4 py-3` |
| Font | `text-xs md:text-sm` |
| Label color | `text-neutral-500` |
| Value color | `text-neutral-900 font-semibold` |
| Total row | `text-primary-700 font-bold` with top border `border-t border-neutral-100 pt-1.5 mt-1.5` |

**Custom Tooltip component:** Build a `ChartTooltip` component rather than using the default Recharts tooltip, to match the design system.

### 7.6 Legend

Below the chart (not inside the chart area), as a simple inline list.

```
class="flex items-center justify-center gap-6 mt-3"
```

Each legend item:
```
class="flex items-center gap-2 text-xs md:text-sm text-neutral-700"
```

**Legend dots:**
- "Vos versements": 10x10px circle, `bg-primary-700`, `rounded-full`
- "Interets cumules": 10x10px circle, `bg-primary-100 border border-primary-600`, `rounded-full`

### 7.7 Y-Axis Formatter Function

```typescript
function formatYAxisTick(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)}Md`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return new Intl.NumberFormat("fr-FR").format(value);
}
```

### 7.8 Chart Alt Text

For accessibility, provide a text description of the chart:

```html
<figure role="img" aria-label="Graphique montrant l'evolution de votre epargne de {currentAge} ans a {retirementAge} ans. Total accumule : {capitalCible} FCFA dont {totalContributions} FCFA de versements et {totalInterestEarned} FCFA d'interets.">
  <!-- chart content -->
</figure>
```

---

## 8. Contextual Alerts

### 8.1 Alert Component Design

Alerts are horizontal cards with a left accent border. They appear between the greeting and the primary card.

```
┌────┬──────────────────────────────────────────────┐
│    │                                                │
│ ██ │  (icon)  Alert message text here that can      │
│ ██ │          wrap to multiple lines.               │
│    │                                                │
└────┴──────────────────────────────────────────────┘
  ^
  4px left border in severity color
```

### 8.2 Severity Variants

| Severity | Left Border | Background | Icon Color | Text Color | Icon |
|----------|-------------|------------|------------|------------|------|
| `success` | `border-l-4 border-success-500` | `bg-success-100` | `text-success-500` | `text-neutral-900` | Checkmark circle |
| `info` | `border-l-4 border-primary-700` | `bg-primary-50` | `text-primary-700` | `text-neutral-900` | Info circle |
| `warning` | `border-l-4 border-warning-500` | `bg-warning-100` | `text-warning-500` | `text-neutral-900` | Warning triangle |
| `error` | `border-l-4 border-error-500` | `bg-error-100` | `text-error-500` | `text-neutral-900` | Error circle |

### 8.3 Alert Layout

| Property | Value |
|----------|-------|
| Container | `flex items-start gap-3` |
| Card radius | `rounded-md` (right side only: `rounded-r-md`) since left border is flush |
| Card padding | `px-4 py-3` |
| Card radius | `rounded-lg` (full, with left border overlaying) |
| Icon size | 20x20px (`w-5 h-5 flex-shrink-0 mt-0.5`) |
| Message text | `text-sm font-normal` |
| Max alerts | 2. Stacked vertically with `gap-3` between them. |
| Container margin | `mb-6` (below greeting, above primary card) |

### 8.4 Alert Icons (SVG, 20x20px)

**Checkmark circle (success):**
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
  <path d="M6.5 10L9 12.5L13.5 7.5" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

**Info circle (info):**
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
  <path d="M10 9v4M10 7v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
```

**Warning triangle (warning):**
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
  <path d="M10 2L19 17H1L10 2z" stroke="currentColor" stroke-width="1.5"
        stroke-linejoin="round" />
  <path d="M10 8v4M10 14v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
```

**Error circle (error):**
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
  <path d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" />
</svg>
```

### 8.5 Alert Accessibility

Each alert uses `role="status"` for polite announcement. For `error` severity, use `role="alert"` for assertive announcement.

```html
<div role="status" class="...">  <!-- success, info, warning -->
<div role="alert" class="...">   <!-- error -->
```

---

## 9. Adjustable Assumptions Section

### 9.1 Section Design

This section is always visible (never collapsible). It sits below the chart card and above the reset button. It contains 3 sliders, derived values, an optional warning, and a disclaimer.

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  Ajustez vos hypotheses                            │  <- section title
│                                                    │
│  Rendement annuel estime                           │  <- slider 1 label
│  [ 8 % par an ]                                    │  <- current value display
│  0% ─────────────●──────────── 20%                 │  <- slider with min/max
│                                                    │
│  Inflation annuelle estimee                        │  <- slider 2 label
│  [ 3 % par an ]                                    │  <- current value display
│  0% ──────●──────────────────── 10%                │  <- slider with min/max
│                                                    │
│  Esperance de vie                                  │  <- slider 3 label
│  [ 75 ans ]                                        │  <- current value display
│  61 ─────────────────●────────── 100               │  <- slider with min/max
│                                                    │
│  ⚠ Un rendement superieur a 15% est tres rare...  │  <- warning (conditional)
│                                                    │
│  ┌──────────────────────────────────────────┐      │
│  │ Duree estimee de votre retraite : 15 ans │      │  <- derived value 1
│  │ Rendement reel (apres inflation) : ~4.9% │      │  <- derived value 2
│  └──────────────────────────────────────────┘      │
│                                                    │
│  Ces projections sont basees sur des hypotheses... │  <- disclaimer
│                                                    │
└──────────────────────────────────────────────────┘
```

### 9.2 Section Container

| Property | Value |
|----------|-------|
| Background | `bg-neutral-50` on mobile, `bg-neutral-50` on desktop (subtle differentiation from white card) |
| Border | `border border-neutral-200` |
| Radius | `rounded-lg` |
| Padding | `px-6 py-6` |
| Margin | `mt-6` (larger gap to visually separate from result cards) |
| Title | `"Ajustez vos hypotheses"` |
| Title style | `text-lg md:text-xl font-bold text-neutral-900 mb-6` |

### 9.3 Individual Slider Block

Each of the 3 sliders follows this layout pattern:

```
┌──────────────────────────────────────────────────┐
│  [Label]                              [Value]     │  <- label row
│  min ────────────────●──────────── max             │  <- slider
└──────────────────────────────────────────────────┘
```

**Label row layout:**
```
class="flex justify-between items-baseline mb-2"
```

**Label:** `text-sm font-medium text-neutral-700`
**Current value display:** `text-sm font-semibold text-primary-700`

**Slider:** Reuse the existing `RangeSlider` component from `src/components/ui/RangeSlider.tsx`. The component already handles the filled track, thumb styling, and min/max labels.

**Spacing between sliders:** `space-y-6` (24px gap between each slider block).

### 9.4 Slider Configurations

| Slider | Label | Value Format | Min | Max | Step | minLabel | maxLabel |
|--------|-------|-------------|-----|-----|------|----------|----------|
| Return rate | `"Rendement annuel estime"` | `"{value * 100} % par an"` | `0` | `0.20` | `0.005` | `"0%"` | `"20%"` |
| Inflation rate | `"Inflation annuelle estimee"` | `"{value * 100} % par an"` | `0` | `0.10` | `0.005` | `"0%"` | `"10%"` |
| Life expectancy | `"Esperance de vie"` | `"{value} ans"` | `{retirementAge + 1}` | `100` | `1` | `"{retirementAge + 1} ans"` | `"100 ans"` |

**Important — RangeSlider step attribute:** The existing `RangeSlider` component does not currently have a `step` prop. The frontend-dev must add a `step` prop to support the 0.005 increment for percentage sliders. See Component Props Reference (Section 16) for the updated interface.

### 9.5 Return Rate Warning

Displayed conditionally when `annualReturnRate > 0.15` (15%).

| Property | Value |
|----------|-------|
| Condition | `annualReturnRate > 0.15` |
| Style | Reuse `FieldMessage` component with `type="warning"` |
| Message | `"Un rendement superieur a 15% est tres rare sur le long terme. Soyez prudent dans vos projections."` |
| Placement | Immediately below the return rate slider (before the next slider) |
| Margin | `mt-2` |

### 9.6 Derived Values Display

A small info box below all three sliders, showing computed read-only values.

| Property | Value |
|----------|-------|
| Background | `bg-white` (on mobile, this provides contrast against neutral-50 section bg) |
| Border | `border border-neutral-200` |
| Radius | `rounded-md` |
| Padding | `px-4 py-3` |
| Margin | `mt-6` (below last slider / warning) |

**Content — two rows:**

| Row | Label | Value |
|-----|-------|-------|
| 1 | `"Duree estimee de votre retraite"` | `"{lifeExpectancy - retirementAge} ans"` |
| 2 | `"Rendement reel (apres inflation)"` | `"~{realReturnRate * 100} % par an"` (one decimal place) |

**Row layout:**
```
class="flex justify-between items-baseline py-1.5"
```

**Label style:** `text-sm text-neutral-500 font-normal`
**Value style:** `text-sm text-neutral-900 font-semibold tabular-nums`

**Live region:** The derived values container uses `aria-live="polite"` since values change when sliders adjust:
```html
<div aria-live="polite" aria-atomic="true" class="...">
```

### 9.7 Disclaimer

Below the derived values, as plain text.

| Property | Value |
|----------|-------|
| Text | `"Ces projections sont basees sur des hypotheses et ne constituent pas un conseil financier. Les rendements passes ne garantissent pas les rendements futurs."` |
| Style | `text-xs text-neutral-400 mt-4 leading-relaxed` |
| Italic | No (plain text is more readable on small screens) |

---

## 10. Responsive Breakpoints

The results page uses Tailwind's default breakpoints, consistent with the wizard spec.

### 10.1 Breakpoint Summary

| Breakpoint | Min-width | Key Changes |
|------------|-----------|-------------|
| Base (mobile) | 0px | Single column, full-width cards, smaller type, 250px chart |
| `sm` | 640px | Max-width constraint on content (480px centered), reset button shrinks to auto width |
| `md` | 768px | White card wrapper appears, larger type sizes, 300px chart, more padding |
| `lg` | 1024px | Max-width widens (640px), hero number at text-5xl, slightly more card padding |

### 10.2 What Changes at Each Breakpoint

**Base -> sm (640px):**
- Content gets `max-w-[480px] mx-auto` constraint
- Reset button changes from `w-full` to `w-auto`
- No other changes — mobile layout is the baseline

**sm -> md (768px):**
- White card wrapper appears: `md:bg-white md:rounded-lg md:shadow-card md:border md:border-neutral-200 md:p-8`
- Hero number scales from `text-3xl` to `text-4xl`
- Chart height increases from 250px to 300px
- Section titles scale from `text-lg` to `text-xl`
- Greeting scales from `text-xl` to `text-2xl`
- Progress indicator shows all step labels

**md -> lg (1024px):**
- Content max-width widens to 640px
- Hero number scales to `text-5xl`
- Card padding increases from `p-8` to `p-10`
- No structural changes — layout is stable from md upward

### 10.3 Cards on Mobile vs Desktop

On mobile (< md), cards have their own `border` and `rounded-lg` styling since there is no wrapping white card. The cards sit directly on the `neutral-50` page background.

On desktop (md+), the entire results area is wrapped in a white card. Individual content cards (secondary, breakdown, chart) should use a subtler treatment to avoid double-borders:
- Keep the border (`border border-neutral-200`) for visual separation between sections
- The primary card retains its `bg-primary-50` background for emphasis
- The assumptions section retains its `bg-neutral-50` for differentiation

---

## 11. Typography and Spacing

### 11.1 Type Scale for Results

All fonts use **Plus Jakarta Sans** (inherited from wizard design system).

| Role | Mobile | Desktop (md+) | Weight | Color |
|------|--------|---------------|--------|-------|
| Hero number (monthly savings) | `text-3xl` (30px) | `text-4xl` / `text-5xl` (36px / 48px) | `font-extrabold` (800) | `text-primary-700` |
| Hero FCFA suffix | `text-2xl` (24px) | `text-3xl` (30px) | `font-bold` (700) | `text-primary-700` |
| Hero unit ("/ mois") | `text-base` (16px) | `text-lg` (18px) | `font-normal` (400) | `text-primary-700/70` |
| Card label (uppercase) | `text-sm` (14px) | `text-base` (16px) | `font-medium` (500) | `text-primary-800` or `text-neutral-500` |
| Capital value | `text-2xl` (24px) | `text-3xl` (30px) | `font-bold` (700) | `text-neutral-900` |
| Section title | `text-lg` (18px) | `text-xl` (20px) | `font-bold` (700) | `text-neutral-900` |
| Greeting name | `text-xl` (20px) | `text-2xl` (24px) | `font-bold` (700) | `text-neutral-900` |
| Greeting subtitle | `text-sm` (14px) | `text-base` (16px) | `font-normal` (400) | `text-neutral-500` |
| Table row label | `text-sm` (14px) | `text-sm` (14px) | `font-normal` (400) | `text-neutral-700` |
| Table row value | `text-sm` (14px) | `text-sm` (14px) | `font-semibold` (600) | `text-neutral-900` |
| Total row value | `text-base` (16px) | `text-base` (16px) | `font-bold` (700) | `text-primary-700` |
| Slider label | `text-sm` (14px) | `text-sm` (14px) | `font-medium` (500) | `text-neutral-700` |
| Slider value | `text-sm` (14px) | `text-sm` (14px) | `font-semibold` (600) | `text-primary-700` |
| Alert text | `text-sm` (14px) | `text-sm` (14px) | `font-normal` (400) | `text-neutral-900` |
| Disclaimer | `text-xs` (12px) | `text-xs` (12px) | `font-normal` (400) | `text-neutral-400` |
| Chart axis labels | 12px | 12px | `400` | `neutral-500` (via Recharts config) |
| Chart tooltip text | `text-xs` (12px) | `text-sm` (14px) | `400` / `600` | `neutral-500` / `neutral-900` |
| Back link | `text-sm` (14px) | `text-sm` (14px) | `font-medium` (500) | `text-primary-700` |
| Reset button | `text-base` (16px) | `text-base` (16px) | `font-semibold` (600) | `text-primary-700` |

### 11.2 Spacing Between Sections

| Between | Gap | Tailwind |
|---------|-----|----------|
| Progress indicator and back link | 24px | `mt-6` |
| Back link and greeting | 16px | `mb-4` on the link |
| Greeting and alerts | 24px | `mb-6` on the greeting |
| Alerts and primary card | 0px | Alerts have `mb-6`, which provides spacing |
| Primary card and secondary card | 16px | `mt-4` |
| Secondary card and breakdown card | 16px | `mt-4` |
| Breakdown card and chart card | 16px | `mt-4` |
| Chart card and assumptions section | 24px | `mt-6` |
| Assumptions section and reset button | 32px | `mt-8` |

### 11.3 Number Formatting

All FCFA amounts use `fr-FR` locale formatting (spaces as thousand separators):
- `22 307 FCFA`
- `30 982 000 FCFA`

Percentages use one decimal place for the real return rate and zero decimals for slider display:
- `"8 % par an"` (slider)
- `"~4.9 % par an"` (derived real return rate)

Use the existing `formatFCFA` utility from `src/utils/format.ts` for FCFA formatting. For percentage formatting, create a helper:

```typescript
function formatPercent(decimal: number, decimals: number = 0): string {
  return (decimal * 100).toFixed(decimals).replace('.', ',');
}
```

Note: Use French decimal separator (comma) for the real return rate display.

---

## 12. Transitions and Animations

Consistent with the wizard spec: minimal, purposeful animations. Performance over polish.

### 12.1 Slider Recalculation

- Slider thumb follows finger/mouse with no transition delay.
- Filled track updates instantly via CSS gradient (existing RangeSlider behavior).
- All dependent values (hero number, capital, breakdown, chart, alerts) update synchronously.
- No loading spinners, no transition animations on the numbers.

### 12.2 Number Updates

When slider values change and numbers recalculate:
- Numbers update instantly (no counter animation, no fade).
- `tabular-nums` font feature prevents layout shift when numbers change width.
- If the number width changes significantly (e.g., going from millions to billions), the layout adjusts naturally.

### 12.3 Alert Changes

When slider adjustments cause alerts to appear or disappear:
- Alerts appear/disappear instantly (no fade in/out).
- The layout shifts naturally to accommodate.

### 12.4 Chart Updates

When sliders change:
- Chart data updates and re-renders. Recharts handles its own internal transitions.
- Set `isAnimationActive={false}` on the Area components to disable Recharts' default animation. This prevents janky animations on rapid slider changes and improves performance on low-end devices.

### 12.5 Wizard-to-Results Transition

When the wizard completes and transitions to results:
- The content swaps instantly (same as step transitions in the wizard).
- No page-level animation. The progress indicator updates to show all 4 steps completed.
- Scroll position resets to top: `window.scrollTo({ top: 0, behavior: 'smooth' })`.

---

## 13. Accessibility

### 13.1 Page Structure

```html
<div role="region" aria-label="Resultats de votre simulation de retraite">
  <!-- back link -->
  <!-- greeting -->
  <!-- alerts -->
  <!-- results-content (paywall container) -->
  <!-- assumptions -->
  <!-- reset button -->
</div>
```

### 13.2 Headings Hierarchy

```
h2: "Bonjour {prenom},"                    (greeting — implied heading for the results section)
h3: "Votre effort mensuel"                 (primary card — visually implicit, may be visually hidden)
h3: "Ce qu'il vous faut"                   (secondary card — same approach)
h3: "Comment ca marche ?"                  (breakdown card title)
h3: "Evolution de votre epargne"           (chart card title)
h3: "Ajustez vos hypotheses"              (assumptions section title)
```

The section titles within cards serve as implicit h3 headings. The frontend-dev should use actual `<h3>` elements for the card titles to maintain a logical heading hierarchy.

### 13.3 Slider Accessibility (ARIA)

Each slider in the assumptions section requires full ARIA attributes:

```html
<label for="rendement-slider">Rendement annuel estime</label>
<input
  id="rendement-slider"
  type="range"
  role="slider"
  min="0"
  max="0.20"
  step="0.005"
  aria-valuemin="0"
  aria-valuemax="0.20"
  aria-valuenow="0.08"
  aria-valuetext="8 pourcent par an"
  aria-describedby="rendement-warning"   <!-- if warning is shown -->
/>
```

**aria-valuetext values:**
- Return rate: `"{value * 100} pourcent par an"` (e.g., `"8 pourcent par an"`)
- Inflation rate: `"{value * 100} pourcent par an"` (e.g., `"3 pourcent par an"`)
- Life expectancy: `"{value} ans"` (e.g., `"75 ans"`)

### 13.4 Live Regions for Recalculated Values

When slider values change, the recalculated results must be announced to screen readers:

1. **Primary card value:** `aria-live="polite" aria-atomic="true"` on the value container.
2. **Derived values (retirement duration, real return rate):** `aria-live="polite" aria-atomic="true"` on the derived values container.
3. **Alerts:** `role="status"` (info/warning/success) or `role="alert"` (error) handles announcement automatically when alerts change.

**Important:** Do NOT put `aria-live` on the chart or the breakdown card. Too many live regions cause excessive screen reader chatter. The primary card value and derived values are sufficient — they communicate the essential changed information.

### 13.5 Chart Accessibility

The chart is decorative for screen reader users (the numerical data is already presented in the breakdown card). Wrap it in a `<figure>` with a descriptive `aria-label`:

```html
<figure
  role="img"
  aria-label="Graphique : evolution de votre epargne de {currentAge} a {retirementAge} ans, total {capitalCible} FCFA dont {totalContributions} FCFA de versements et {totalInterestEarned} FCFA d'interets."
>
  <h3 class="...">Evolution de votre epargne</h3>
  <div aria-hidden="true">
    <!-- Recharts AreaChart -->
  </div>
  <!-- Legend (visible to all) -->
</figure>
```

The chart itself is `aria-hidden="true"` since the `aria-label` on the figure provides the equivalent information.

### 13.6 Focus Management

| Event | Focus Behavior |
|-------|---------------|
| Wizard -> Results transition | Focus the greeting heading (h2). Scroll to top. |
| Results -> Wizard transition (back link click) | Focus the first field of Step 1. |
| Slider value change | Focus stays on the slider. No focus movement. |
| Alert appears/disappears | No focus movement. `role="status"` / `role="alert"` handles announcement. |
| Reset button click | Focus the first field of Step 1 (after reset and navigation). |

### 13.7 Keyboard Navigation

| Key | Context | Behavior |
|-----|---------|----------|
| Tab | Results page | Moves through: back link, primary card (if focusable), sliders, reset button |
| Arrow Left/Right | On slider | Adjusts value by one step |
| Arrow Up/Down | On slider | Adjusts value by one step |
| Enter | On back link | Returns to wizard |
| Enter | On reset button | Resets and returns to Step 1 |

### 13.8 Color Contrast Compliance

All new color combinations maintain WCAG 2.1 AA compliance:

| Foreground | Background | Ratio | Pass? |
|-----------|------------|-------|-------|
| `primary-700` on `primary-50` | `#1A6B5E` on `#F2FAF8` | 5.3:1 | Yes |
| `primary-800` on `primary-50` | `#145249` on `#F2FAF8` | 7.3:1 | Yes |
| `neutral-900` on `white` | `#111827` on `#FFFFFF` | 15.4:1 | Yes |
| `neutral-500` on `white` | `#6B7280` on `#FFFFFF` | 5.0:1 | Yes |
| `success-500` on `success-100` | `#16A34A` on `#DCFCE7` | 3.4:1 | Passes for large text; use font-medium |
| `warning-500` on `warning-100` | `#D97706` on `#FEF3C7` | 3.2:1 | Passes for large text; icon aids recognition |
| `error-500` on `error-100` | `#DC2626` on `#FEE2E2` | 3.6:1 | Passes for large text; use font-medium |
| `neutral-900` on `success-100` | `#111827` on `#DCFCE7` | 13.3:1 | Yes |
| `neutral-900` on `warning-100` | `#111827` on `#FEF3C7` | 13.8:1 | Yes |
| `neutral-900` on `error-100` | `#111827` on `#FEE2E2` | 12.9:1 | Yes |

Note: Alert message text uses `text-neutral-900` (not the severity color) to ensure high contrast. Only the icon and left border use the severity color.

---

## 14. Paywall Preparation

### 14.1 Container Structure

The results content that will be blurred/locked in Milestone 6 must be wrapped in a single container:

```html
<div class="results-content relative" data-paywall="results">
  <!-- Primary card -->
  <!-- Secondary card -->
  <!-- Breakdown card -->
  <!-- Chart card -->
</div>
```

**Key properties of this container:**
- `position: relative` — so the blur overlay can be positioned absolutely within it.
- `data-paywall="results"` — a data attribute for targeting by the paywall component.
- CSS class `results-content` — for easy selection.

### 14.2 What is Inside vs Outside the Paywall Container

| Inside (will be blurred) | Outside (always visible) |
|--------------------------|-------------------------|
| Primary card (hero number) | Back link ("Modifier mes informations") |
| Secondary card (capital target) | Greeting |
| Breakdown card | Contextual alerts |
| Chart card | Assumptions section (sliders) |
| | Reset button |

**Rationale:** The paywall locks the specific numerical results. The greeting, alerts, navigation, and sliders remain visible. The alerts provide value even without exact numbers (they tell the user "your savings rate is high"), and the sliders encourage engagement.

### 14.3 Blur Overlay Structure (Future — Milestone 6)

The paywall overlay will be an absolutely-positioned div inside the `results-content` container:

```html
<div class="results-content relative">
  <!-- actual results cards (will be blurred) -->

  <!-- Paywall overlay (Milestone 6) -->
  <div class="absolute inset-0 backdrop-blur-md bg-white/60 flex items-center justify-center rounded-lg z-10">
    <div class="text-center px-6">
      <p class="text-lg font-semibold text-neutral-900">Debloquez vos resultats</p>
      <p class="text-sm text-neutral-500 mt-2">Creez un compte ou connectez-vous pour voir votre plan.</p>
      <button class="mt-4 ...">S'inscrire</button>
    </div>
  </div>
</div>
```

**The frontend-dev does NOT implement the overlay in Milestone 5.** The structure just needs to support it. The `relative` positioning and single-container wrapping are the only requirements now.

### 14.4 Hero Number Replacement (Future)

In locked state, the primary card value will show `"XXX XXX FCFA"` instead of the real number. The component should accept the `ResultsData` as props (not read directly from computation), making it easy for the paywall wrapper to substitute placeholder values.

---

## 15. Component Hierarchy

```
StepResults                              (main results container, replaces StepResultsPlaceholder)
├── ResultsBackLink                      (back to wizard link)
├── ResultsGreeting                      (personalized greeting)
├── ResultsAlerts                        (0-2 contextual alert banners)
│   └── ResultsAlert (x0-2)            (individual alert with severity styling)
├── div.results-content                  (paywall-ready container)
│   ├── ResultsPrimaryCard              ("Votre effort mensuel" — hero number)
│   ├── ResultsSecondaryCard            ("Ce qu'il vous faut" — capital target)
│   ├── ResultsBreakdown                ("Comment ca marche ?" — summary table)
│   │   └── BreakdownRow (x5)          (label + value row in the summary table)
│   └── ResultsChart                    ("Evolution de votre epargne" — Recharts chart)
│       ├── AreaChart (Recharts)        (the actual chart)
│       ├── ChartTooltip               (custom tooltip component)
│       └── ChartLegend                (custom legend below chart)
├── ResultsAssumptions                   ("Ajustez vos hypotheses" — sliders section)
│   ├── AssumptionSlider (x3)           (label + value + RangeSlider composite)
│   │   └── RangeSlider (existing)     (reused from ui/ with step prop added)
│   ├── FieldMessage (existing)         (warning for high return rate, conditional)
│   ├── DerivedValues                   (retirement duration + real return rate)
│   └── Disclaimer                      (plain text disclaimer)
└── ResultsResetButton                   ("Recommencer une simulation")
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `StepResults` | Main container. Reads form data from store, calls `computeRetirementResults()`, passes results down to child components. Handles `setWizardCompleted(false)` and `store.reset()`. |
| `ResultsBackLink` | Renders the "Modifier mes informations" text link. Calls parent callback to go back to wizard. |
| `ResultsGreeting` | Renders personalized greeting with first name. |
| `ResultsAlerts` | Receives `alerts: AlertDefinition[]` from results data. Renders 0-2 `ResultsAlert` components. |
| `ResultsAlert` | Single alert banner. Receives severity and message. Selects icon and colors based on severity. |
| `ResultsPrimaryCard` | Hero card. Receives `epargneMensuelle: number`. Formats and displays prominently. |
| `ResultsSecondaryCard` | Secondary card. Receives `capitalCible: number` and `retirementAge: number`. |
| `ResultsBreakdown` | Summary table. Receives all breakdown values from results. Conditionally shows savings rate. |
| `ResultsChart` | Chart container. Receives `chartData: ChartDataPoint[]` and display context. Renders Recharts. |
| `ChartTooltip` | Custom Recharts tooltip. Formats values as FCFA. |
| `ResultsAssumptions` | Assumptions section. Reads adjustable params from store. Renders 3 sliders. Shows derived values and disclaimer. |
| `AssumptionSlider` | Composite of label + current value display + `RangeSlider`. Encapsulates one adjustable parameter. |
| `ResultsResetButton` | Reset button at the bottom. Calls `store.reset()`. |

---

## 16. Component Props Reference

TypeScript interfaces for all new components. The frontend-dev uses these as contracts.

### StepResults

```typescript
// No props — reads all state from useRetraiteStore()
// Calls computeRetirementResults() internally via useMemo
interface StepResultsProps {}
```

### ResultsBackLink

```typescript
interface ResultsBackLinkProps {
  onBack: () => void;
}
```

### ResultsGreeting

```typescript
interface ResultsGreetingProps {
  prenom: string;
}
```

### ResultsAlerts

```typescript
import type { AlertDefinition } from "../../types/retraiteResults";

interface ResultsAlertsProps {
  alerts: AlertDefinition[];
}
```

### ResultsAlert

```typescript
import type { AlertSeverity } from "../../types/retraiteResults";

interface ResultsAlertProps {
  severity: AlertSeverity;
  message: string;
}
```

### ResultsPrimaryCard

```typescript
interface ResultsPrimaryCardProps {
  epargneMensuelle: number;
}
```

### ResultsSecondaryCard

```typescript
interface ResultsSecondaryCardProps {
  capitalCible: number;
  retirementAge: number;
}
```

### ResultsBreakdown

```typescript
interface ResultsBreakdownProps {
  epargneMensuelle: number;
  yearsToRetirement: number;
  totalContributions: number;
  totalInterestEarned: number;
  capitalCible: number;
  savingsRatePercent: number;
}
```

### ResultsChart

```typescript
import type { ChartDataPoint } from "../../types/retraiteResults";

interface ResultsChartProps {
  chartData: ChartDataPoint[];
  currentAge: number;
  retirementAge: number;
  /** For accessible chart description */
  capitalCible: number;
  totalContributions: number;
  totalInterestEarned: number;
}
```

### ChartTooltip

```typescript
// Recharts tooltip payload type
interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: {
      age: number;
      contributions: number;
      interest: number;
      total: number;
    };
  }>;
  label?: number;
}
```

### ResultsAssumptions

```typescript
// No props — reads adjustable params from store via useResultsParams()
// and form data (retirementAge) for life expectancy slider min
interface ResultsAssumptionsProps {
  retirementAge: number;
  /** Current values for derived display */
  retirementDurationYears: number;
  realReturnRate: number;
}
```

### AssumptionSlider

```typescript
interface AssumptionSliderProps {
  id: string;
  label: string;
  value: number;
  displayValue: string;      // Formatted current value (e.g., "8 % par an")
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  ariaValueText: string;
  onChange: (value: number) => void;
}
```

### RangeSlider (Updated — add step prop)

```typescript
interface RangeSliderProps {
  id: string;
  value: number;
  min: number;
  max: number;
  step?: number;              // NEW — defaults to 1 if not provided
  minLabel: string;
  maxLabel: string;
  ariaValueText: string;
  onChange: (value: number) => void;
  onBlur?: () => void;
}
```

### ResultsResetButton

```typescript
interface ResultsResetButtonProps {
  onReset: () => void;
}
```

---

## 17. File Mapping

Where each new component should be created:

```
src/components/
├── retraite/
│   ├── StepResults.tsx               (NEW — main results container)
│   ├── ResultsBackLink.tsx           (NEW — back to wizard link)
│   ├── ResultsGreeting.tsx           (NEW — personalized greeting)
│   ├── ResultsAlerts.tsx             (NEW — alert list container)
│   ├── ResultsAlert.tsx              (NEW — single alert banner)
│   ├── ResultsPrimaryCard.tsx        (NEW — hero monthly savings card)
│   ├── ResultsSecondaryCard.tsx      (NEW — capital target card)
│   ├── ResultsBreakdown.tsx          (NEW — summary table)
│   ├── ResultsChart.tsx              (NEW — Recharts area chart)
│   ├── ChartTooltip.tsx              (NEW — custom chart tooltip)
│   ├── ResultsAssumptions.tsx        (NEW — adjustable sliders section)
│   ├── AssumptionSlider.tsx          (NEW — single slider composite)
│   ├── ResultsResetButton.tsx        (NEW — reset button)
│   ├── RetraiteWizard.tsx            (MODIFIED — replace StepResultsPlaceholder with StepResults)
│   └── StepResultsPlaceholder.tsx    (DEPRECATED — replaced by StepResults)
├── ui/
│   ├── RangeSlider.tsx               (MODIFIED — add step prop)
│   └── FieldMessage.tsx              (EXISTING — reused for return rate warning)
```

### Modified Files

| File | Change |
|------|--------|
| `src/components/retraite/RetraiteWizard.tsx` | Replace `<StepResultsPlaceholder />` with `<StepResults />` when `wizardCompleted === true`. Remove progress indicator from results view (StepResults handles its own layout). |
| `src/components/ui/RangeSlider.tsx` | Add optional `step` prop. Pass to `<input step={step}>` and include `step` in the HTML attribute. |

---

## Appendix A: Mobile Wireframe — Results Page

```
┌──────────────────────────────────┐
│          HEADER (fixed)          │
├──────────────────────────────────┤
│  (✓)───(✓)───(✓)───(✓)          │
│                                  │
│  <- Modifier mes informations    │
│                                  │
│  Bonjour Fatou,                  │
│  Voici votre plan de retraite.   │
│                                  │
│  ┌──────────────────────────┐    │
│  │ ⚠ Bonne nouvelle ! Avec │    │  <- alert (success)
│  │   un effort modere...    │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │  Votre effort mensuel    │    │
│  │                          │    │
│  │     22 307 FCFA          │    │  <- hero number
│  │       / mois             │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │  Ce qu'il vous faut      │    │
│  │  30 982 000 FCFA         │    │
│  │  Capital a accumuler     │    │
│  │  d'ici vos 60 ans        │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │  Comment ca marche ?     │    │
│  │                          │    │
│  │  Vous epargnez           │    │
│  │         22 307 FCFA/mois │    │
│  │  Pendant                 │    │
│  │                  30 ans  │    │
│  │  Total versements        │    │
│  │       8 030 520 FCFA     │    │
│  │  Interets generes        │    │
│  │      22 951 480 FCFA     │    │
│  │  ─────────────────────── │    │
│  │  Vous accumulez          │    │
│  │      30 982 000 FCFA     │    │
│  │                          │    │
│  │  Taux d'effort : 8.9%   │    │
│  │  de votre salaire        │    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │  Evolution de votre      │    │
│  │  epargne                 │    │
│  │                          │    │
│  │  ┌────────────────────┐  │    │
│  │  │    ╱╱╱╱╱╱╱╱╱╱╱     │  │    │
│  │  │  ████████████████   │  │    │
│  │  │  30  40  50  60     │  │    │
│  │  └────────────────────┘  │    │
│  │                          │    │
│  │  ● Versements ● Interets│    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │  Ajustez vos hypotheses  │    │
│  │                          │    │
│  │  Rendement annuel        │    │
│  │  estime          8%/an   │    │
│  │  0% ────●─────── 20%    │    │
│  │                          │    │
│  │  Inflation annuelle      │    │
│  │  estimee          3%/an  │    │
│  │  0% ──●────────── 10%   │    │
│  │                          │    │
│  │  Esperance de vie        │    │
│  │                  75 ans  │    │
│  │  61 ─────●──────── 100  │    │
│  │                          │    │
│  │  ┌────────────────────┐  │    │
│  │  │ Duree retraite :   │  │    │
│  │  │            15 ans  │  │    │
│  │  │ Rendement reel :   │  │    │
│  │  │         ~4,9%/an   │  │    │
│  │  └────────────────────┘  │    │
│  │                          │    │
│  │  Ces projections sont    │    │
│  │  basees sur des          │    │
│  │  hypotheses...           │    │
│  └──────────────────────────┘    │
│                                  │
│  [  Recommencer une simulation ] │
│                                  │
├──────────────────────────────────┤
│            FOOTER                │
└──────────────────────────────────┘
```

---

## Appendix B: Desktop Wireframe — Results Page (md+)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER (fixed)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│    ┌───────────────────────────────────────────────────┐      │
│    │  (✓)─────────(✓)─────────(✓)─────────(✓)         │      │
│    │  Identite    Situation    Objectif    Revenus     │      │
│    │                                                   │      │
│    │  <- Modifier mes informations                     │      │
│    │                                                   │      │
│    │  Bonjour Fatou,                                   │      │
│    │  Voici votre plan de retraite.                    │      │
│    │                                                   │      │
│    │  ┌────────────────────────────────────────────┐   │      │
│    │  │ ✓ Bonne nouvelle ! Avec un effort modere.. │   │      │
│    │  └────────────────────────────────────────────┘   │      │
│    │                                                   │      │
│    │  ┌────────────────────────────────────────────┐   │      │
│    │  │     Votre effort mensuel                   │   │      │
│    │  │          22 307 FCFA                       │   │      │
│    │  │            / mois                          │   │      │
│    │  └────────────────────────────────────────────┘   │      │
│    │                                                   │      │
│    │  ┌────────────────────────────────────────────┐   │      │
│    │  │  Ce qu'il vous faut                        │   │      │
│    │  │  30 982 000 FCFA                           │   │      │
│    │  │  Capital a accumuler d'ici vos 60 ans      │   │      │
│    │  └────────────────────────────────────────────┘   │      │
│    │                                                   │      │
│    │  ┌────────────────────────────────────────────┐   │      │
│    │  │  Comment ca marche ?                       │   │      │
│    │  │                                            │   │      │
│    │  │  Vous epargnez ........ 22 307 FCFA/mois   │   │      │
│    │  │  Pendant .................. 30 ans         │   │      │
│    │  │  Total versements ... 8 030 520 FCFA       │   │      │
│    │  │  Interets generes .. 22 951 480 FCFA       │   │      │
│    │  │  ──────────────────────────────────────    │   │      │
│    │  │  Vous accumulez .... 30 982 000 FCFA       │   │      │
│    │  │                                            │   │      │
│    │  │  Taux d'effort : 8.9% de votre salaire    │   │      │
│    │  └────────────────────────────────────────────┘   │      │
│    │                                                   │      │
│    │  ┌────────────────────────────────────────────┐   │      │
│    │  │  Evolution de votre epargne                │   │      │
│    │  │  ┌──────────────────────────────────────┐  │   │      │
│    │  │  │     ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱       │  │   │      │
│    │  │  │  ████████████████████████████████     │  │   │      │
│    │  │  │  30   35   40   45   50   55  60     │  │   │      │
│    │  │  └──────────────────────────────────────┘  │   │      │
│    │  │  ● Vos versements    ● Interets cumules    │   │      │
│    │  └────────────────────────────────────────────┘   │      │
│    │                                                   │      │
│    │  ┌────────────────────────────────────────────┐   │      │
│    │  │  Ajustez vos hypotheses                    │   │      │
│    │  │                                            │   │      │
│    │  │  Rendement annuel estime        8 % par an │   │      │
│    │  │  0% ──────────────●──────────── 20%        │   │      │
│    │  │                                            │   │      │
│    │  │  Inflation annuelle estimee     3 % par an │   │      │
│    │  │  0% ─────●──────────────────── 10%         │   │      │
│    │  │                                            │   │      │
│    │  │  Esperance de vie               75 ans     │   │      │
│    │  │  61 ─────────────●──────────── 100         │   │      │
│    │  │                                            │   │      │
│    │  │  ┌──────────────────────────────────────┐  │   │      │
│    │  │  │ Duree retraite : 15 ans              │  │   │      │
│    │  │  │ Rendement reel : ~4,9 % par an       │  │   │      │
│    │  │  └──────────────────────────────────────┘  │   │      │
│    │  │                                            │   │      │
│    │  │  Ces projections sont basees sur des       │   │      │
│    │  │  hypotheses et ne constituent pas un       │   │      │
│    │  │  conseil financier...                      │   │      │
│    │  └────────────────────────────────────────────┘   │      │
│    │                                                   │      │
│    │       [ Recommencer une simulation ]              │      │
│    │                                                   │      │
│    └───────────────────────────────────────────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                          FOOTER                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Appendix C: Color Quick Reference for Results Page

| Usage | Token | Hex |
|-------|-------|-----|
| Hero number, total row value, slider values, back link | `primary-700` | `#1A6B5E` |
| Primary card label | `primary-800` | `#145249` |
| Primary card background | `primary-50` | `#F2FAF8` |
| Primary card border | `primary-700/20` | `#1A6B5E` at 20% |
| Chart contributions area fill | `primary-700` | `#1A6B5E` |
| Chart interest area fill | `primary-100` | `#E6F4F1` |
| Chart interest area stroke | `primary-600` | `#21856F` |
| Card borders | `neutral-200` | `#E5E7EB` |
| Section titles, table labels | `neutral-900` | `#111827` |
| Table row labels, slider labels | `neutral-700` | `#374151` |
| Sublabels, greeting subtitle | `neutral-500` | `#6B7280` |
| Disclaimer, placeholder | `neutral-400` | `#9CA3AF` |
| Assumptions section bg | `neutral-50` | `#F9FAFB` |
| Success alert bg / border | `success-100` / `success-500` | `#DCFCE7` / `#16A34A` |
| Info alert bg / border | `primary-50` / `primary-700` | `#F2FAF8` / `#1A6B5E` |
| Warning alert bg / border | `warning-100` / `warning-500` | `#FEF3C7` / `#D97706` |
| Error alert bg / border | `error-100` / `error-500` | `#FEE2E2` / `#DC2626` |

---

*End of design specification.*
