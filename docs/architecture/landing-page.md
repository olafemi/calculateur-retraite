# Landing Page Architecture Spec (Milestone 3)

## 1. React Router Setup

### Install Note

`react-router` v7 is already in `package.json`. Use the `react-router` import path (not `react-router-dom` -- v7 unified them).

### Route Table

| Path | Page Component | Status | Description |
|------|---------------|--------|-------------|
| `/` | `HomePage` | **Build now** | Landing page with hero, tool cards, pricing, footer |
| `/outils/retraite` | `RetraiteCalculateurPage` | Placeholder | Retirement calculator (Milestone 4) |
| `/outils/millions` | `RoadToMillionsPage` | Placeholder | Wealth milestone calculator (Phase 2) |
| `/connexion` | `AuthPage` | Placeholder | Login / Register (Milestone 2 -- already scaffolded) |
| `*` | `NotFoundPage` | Placeholder | 404 catch-all |

### Router Configuration (in `App.tsx`)

Replace the Vite boilerplate in `App.tsx` with a `BrowserRouter` + `Routes` setup. The router wraps all pages inside a shared `AppLayout` component that provides the persistent Header and Footer.

```
App.tsx
  BrowserRouter
    Routes
      Route element={<AppLayout />}     <-- layout route (no path)
        Route path="/"       element={<HomePage />}
        Route path="/outils/retraite"  element={<RetraiteCalculateurPage />}
        Route path="/outils/millions"  element={<RoadToMillionsPage />}
        Route path="/connexion"        element={<AuthPage />}
        Route path="*"       element={<NotFoundPage />}
```

### Why `/outils/` prefix

All tools live under `/outils/` so the URL structure scales cleanly. If we add an inflation simulator later it becomes `/outils/inflation`. This also makes it trivial to add a future `/outils` index page listing all tools.

### Placeholder Pages

Each placeholder page should be a minimal component that renders the `<AppLayout>` wrapper and a centered message like "Bientot disponible" (Coming soon). This keeps the router functional and testable while tools are developed in later milestones.

---

## 2. Landing Page Component Structure

### Page Wireframe (ASCII)

```
+--------------------------------------------------+
|  Header (logo, nav links, CTA button)            |
+--------------------------------------------------+
|                                                  |
|  HeroSection                                     |
|    Headline + subheadline                        |
|    Primary CTA button                            |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  ToolCardsSection                                |
|    Section heading                               |
|    Grid of ToolCard components                   |
|      [Calculateur de Retraite]  [Road to         |
|       available / active         Millions]       |
|                                  coming soon     |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  HowItWorksSection                               |
|    3-step visual explanation                     |
|    Step 1: Remplissez  Step 2: Decouvrez         |
|    Step 3: Agissez                               |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  PricingSection                                  |
|    Plan cards (one-shot, daily, monthly, yearly) |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  Footer                                          |
|    Links, copyright, social                      |
|                                                  |
+--------------------------------------------------+
```

### Component Breakdown

| Component | File Path | Responsibility |
|-----------|-----------|---------------|
| `AppLayout` | `src/components/layout/AppLayout.tsx` | Wraps every page. Renders `Header`, `<Outlet />`, `Footer`. |
| `Header` | `src/components/layout/Header.tsx` | Logo, navigation links, mobile hamburger menu, "Commencer" CTA button. |
| `Footer` | `src/components/layout/Footer.tsx` | Copyright, social links, legal links. |
| `HomePage` | `src/pages/HomePage.tsx` | Composes the four landing sections below. Owns the `TOOLS_DATA` array and passes it to `ToolCardsSection`. |
| `HeroSection` | `src/components/landing/HeroSection.tsx` | Full-width hero with headline, subheadline, CTA. |
| `ToolCardsSection` | `src/components/landing/ToolCardsSection.tsx` | Section heading + responsive grid of `ToolCard` components. |
| `ToolCard` | `src/components/landing/ToolCard.tsx` | Single card displaying one tool. Shows icon, name, description, status badge, link. |
| `HowItWorksSection` | `src/components/landing/HowItWorksSection.tsx` | 3-step visual explainer. |
| `PricingSection` | `src/components/landing/PricingSection.tsx` | Pricing plan cards. |
| `PricingCard` | `src/components/landing/PricingCard.tsx` | Single pricing plan card. |

### New Folder: `src/components/landing/`

The plan.md structure defines `components/ui/` and `components/layout/` but does not have a folder for landing-page-specific sections. Add `src/components/landing/` for components that are only used on the landing page and are not reusable UI primitives. This keeps `components/ui/` clean for buttons, inputs, modals, and other truly generic elements.

---

## 3. Data Model -- Type Definitions

All types go in `src/types/`. Create two files for this milestone.

### `src/types/tool.ts`

```typescript
/**
 * Represents the availability status of a tool on the platform.
 *   "available"   -- tool is built and accessible
 *   "coming_soon" -- tool is planned but not yet built
 *   "locked"      -- tool exists but requires subscription
 */
export type ToolStatus = "available" | "coming_soon" | "locked";

/**
 * Describes a single planning tool shown on the landing page.
 */
export interface Tool {
  /** Unique machine-readable identifier (e.g. "retraite", "millions") */
  id: string;

  /** Display name shown on the card (French) */
  name: string;

  /** Short description shown below the name (French, max ~80 chars) */
  description: string;

  /** Route path the card links to (e.g. "/outils/retraite") */
  path: string;

  /** Current availability status */
  status: ToolStatus;

  /**
   * Icon identifier. In Phase 1 this can be an emoji string or
   * the name of a Heroicon / Lucide icon. Avoids importing heavy
   * icon libraries by defaulting to emoji.
   */
  icon: string;
}
```

### `src/types/pricing.ts`

```typescript
/**
 * Billing frequency for subscription plans.
 */
export type BillingPeriod = "one_shot" | "daily" | "monthly" | "yearly";

/**
 * A pricing plan displayed on the landing page.
 */
export interface PricingPlan {
  /** Unique identifier */
  id: BillingPeriod;

  /** Display name (French) */
  name: string;

  /** Price in FCFA (integer -- no decimals in XOF) */
  priceFCFA: number;

  /** Human-readable billing description (e.g. "par mois") */
  billingLabel: string;

  /** List of features / benefits (French strings) */
  features: string[];

  /** Whether this plan is visually highlighted as recommended */
  recommended: boolean;
}
```

### Static Data Constants

The actual data arrays are NOT types -- they are constants. Define them in a dedicated data file.

### `src/data/tools.ts`

```typescript
import type { Tool } from "../types/tool";

export const TOOLS: Tool[] = [
  {
    id: "retraite",
    name: "Calculateur de Retraite",
    description: "Calculez combien epargner chaque mois pour votre retraite",
    path: "/outils/retraite",
    status: "available",
    icon: "piggy-bank",      // or an emoji like a pig
  },
  {
    id: "millions",
    name: "Road to Millions",
    description: "Decouvrez combien de temps pour atteindre vos objectifs",
    path: "/outils/millions",
    status: "coming_soon",
    icon: "trending-up",
  },
];
```

### `src/data/pricing.ts`

```typescript
import type { PricingPlan } from "../types/pricing";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "one_shot",
    name: "Ponctuel",
    priceFCFA: 500,
    billingLabel: "une seule fois",
    features: ["Voir les resultats d'une simulation"],
    recommended: false,
  },
  {
    id: "daily",
    name: "Pass Journalier",
    priceFCFA: 500,
    billingLabel: "par jour",
    features: [
      "Ajustements illimites pendant 24h",
      "Acces a tous les outils",
    ],
    recommended: false,
  },
  {
    id: "monthly",
    name: "Mensuel",
    priceFCFA: 1000,
    billingLabel: "par mois",
    features: [
      "Acces illimite pendant 30 jours",
      "Acces a tous les outils",
      "Historique des simulations",
    ],
    recommended: true,
  },
  {
    id: "yearly",
    name: "Annuel",
    priceFCFA: 5000,
    billingLabel: "par an",
    features: [
      "Acces illimite pendant 365 jours",
      "Acces a tous les outils",
      "Historique des simulations",
      "Meilleur rapport qualite-prix",
    ],
    recommended: false,
  },
];
```

---

## 4. Component Hierarchy and File Map

### Full File Tree (new files only)

```
src/
  types/
    tool.ts                         <-- Tool, ToolStatus
    pricing.ts                      <-- PricingPlan, BillingPeriod
  data/
    tools.ts                        <-- TOOLS constant array
    pricing.ts                      <-- PRICING_PLANS constant array
  components/
    layout/
      AppLayout.tsx                 <-- Header + Outlet + Footer
      Header.tsx                    <-- Top nav bar
      Footer.tsx                    <-- Page footer
    landing/
      HeroSection.tsx               <-- Hero banner
      ToolCardsSection.tsx          <-- Tool cards grid
      ToolCard.tsx                  <-- Single tool card
      HowItWorksSection.tsx         <-- 3-step explainer
      PricingSection.tsx            <-- Pricing plans grid
      PricingCard.tsx               <-- Single pricing card
    ui/
      Button.tsx                    <-- Reusable button (primary/secondary variants)
      Badge.tsx                     <-- Status badge ("Disponible", "Bientot")
  pages/
    HomePage.tsx                    <-- Landing page (composes sections)
    RetraiteCalculateurPage.tsx     <-- Placeholder
    RoadToMillionsPage.tsx          <-- Placeholder
    AuthPage.tsx                    <-- Placeholder
    NotFoundPage.tsx                <-- 404
  App.tsx                           <-- Router setup (replaces boilerplate)
```

### Dependency Diagram

```
main.tsx
  App.tsx
    BrowserRouter
      AppLayout
        Header -----> Button (CTA)
        <Outlet />
          HomePage
            HeroSection --------> Button (CTA)
            ToolCardsSection ---> ToolCard -----> Badge
            HowItWorksSection
            PricingSection -----> PricingCard --> Button
        Footer
```

---

## 5. Props, State, and Data Flow

### Principle: No Global State for the Landing Page

The landing page is entirely static content. There is no user interaction that requires Zustand or any state management. All data flows top-down through props. Zustand stores will be introduced in later milestones (auth state, subscription state, calculator form state).

### Component Props

#### `AppLayout`

- Props: none
- Renders: `<Header />`, `<Outlet />` (from react-router), `<Footer />`
- State: none

#### `Header`

- Props: none
- Internal state: `isMobileMenuOpen: boolean` (for hamburger toggle)
- Renders: logo, nav links (`<a>` or `<Link>`), mobile menu, CTA button

#### `Footer`

- Props: none
- State: none
- Renders: copyright text, social links

#### `HomePage`

- Props: none
- Imports: `TOOLS` from `src/data/tools.ts`, `PRICING_PLANS` from `src/data/pricing.ts`
- Passes `TOOLS` to `ToolCardsSection` and `PRICING_PLANS` to `PricingSection`
- State: none

#### `HeroSection`

- Props: none (content is hardcoded French copy)
- Renders: headline, subheadline, CTA `Button`

#### `ToolCardsSection`

- Props: `{ tools: Tool[] }`
- Renders: section heading + maps over `tools` to render `ToolCard` for each

#### `ToolCard`

- Props: `{ tool: Tool }`
- Renders: icon, name, description, status `Badge`, wraps in a `<Link>` if status is `"available"`, otherwise renders as a disabled card
- Behavior: cards with `status === "coming_soon"` show a "Bientot" badge and are not clickable (no link, reduced opacity or a visual indicator)

#### `HowItWorksSection`

- Props: none (content is hardcoded)
- Renders: three steps with icons and French labels

#### `PricingSection`

- Props: `{ plans: PricingPlan[] }`
- Renders: section heading + maps over `plans` to render `PricingCard` for each

#### `PricingCard`

- Props: `{ plan: PricingPlan }`
- Renders: plan name, price (formatted via `fr-FR` locale), billing label, features list, CTA button
- The `recommended` plan gets a visual highlight (border color, "Recommande" badge)

#### `Button`

- Props: `{ variant: "primary" | "secondary" | "outline"; size?: "sm" | "md" | "lg"; children: React.ReactNode; } & React.ButtonHTMLAttributes<HTMLButtonElement>`
- This is a generic UI primitive. Use Tailwind classes composed via the `variant` prop.

#### `Badge`

- Props: `{ status: ToolStatus }`
- Renders a small colored pill:
  - `"available"` -> green, text "Disponible"
  - `"coming_soon"` -> amber/yellow, text "Bientot"
  - `"locked"` -> gray, text "Verrouille"

### Data Flow Diagram

```
[src/data/tools.ts]         [src/data/pricing.ts]
   TOOLS (static)              PRICING_PLANS (static)
       |                              |
       v                              v
   HomePage -------+----------> HomePage
       |           |                  |
       v           |                  v
ToolCardsSection   |          PricingSection
       |           |                  |
       v           |                  v
   ToolCard        |            PricingCard
       |           |                  |
       v           |                  v
     Badge         |              Button
                   |
                   v
           HeroSection -----> Button
```

No state management library is involved. Data is imported at the page level and passed down as props.

---

## 6. Styling Guidelines

### Tailwind Conventions

- **Mobile-first:** Write base styles for mobile, then use `sm:`, `md:`, `lg:` breakpoints to layer on tablet/desktop styles.
- **Spacing scale:** Use Tailwind's default spacing scale. Sections get `py-16 md:py-24` vertical padding. Container widths use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Typography:** Use Tailwind's `text-` utilities. Headlines: `text-3xl md:text-5xl font-bold`. Body: `text-base md:text-lg`.
- **Colors:** Define a small custom palette in `tailwind.config.ts` or use Tailwind v4's CSS-based theming in `index.css`. Primary brand color, secondary, and neutral grays. Exact hex values are a designer decision -- the frontend developer should use CSS custom properties so they can be changed later.
- **Grid for tool cards:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- **Grid for pricing cards:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`

### Currency Formatting Utility

Create a shared formatting function in `src/utils/format.ts`:

```typescript
/**
 * Format a number as FCFA currency using French locale.
 * Example: 1000 -> "1 000 F CFA"
 */
export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F CFA";
}
```

This utility will be used by `PricingCard` and later by calculator result displays.

---

## 7. Responsive Behavior

| Breakpoint | Header | Hero | Tool Cards | Pricing Cards | How It Works |
|-----------|--------|------|-----------|--------------|-------------|
| Mobile (< 640px) | Hamburger menu | Stacked, centered text | 1 column | 1 column, scroll or stack | Vertical steps |
| Tablet (640-1024px) | Full nav | Side-by-side text + image | 2 columns | 2 columns | Horizontal steps |
| Desktop (> 1024px) | Full nav | Side-by-side text + image | 2-3 columns | 4 columns | Horizontal steps |

---

## 8. Accessibility Notes

- All interactive elements (`Button`, `ToolCard` links) must have clear focus styles (Tailwind's `focus:ring-2 focus:ring-offset-2`).
- The mobile hamburger menu needs `aria-expanded` and `aria-controls` attributes.
- `ToolCard` with `coming_soon` status should use `aria-disabled="true"` rather than omitting the link entirely, so screen readers understand the card exists but is not actionable.
- Price values should include visually hidden currency context for screen readers.
- All section headings use semantic `<h2>` within the page (the page title in `HeroSection` is `<h1>`).

---

## 9. Architectural Decisions

### ADR-001: Static data arrays instead of API fetch for tool/pricing data

**Decision:** Tool metadata and pricing plans are defined as static TypeScript constants in `src/data/`, not fetched from an API.

**Rationale:** At this stage, tools and pricing change infrequently (only when we ship a new tool or change prices). Hardcoding avoids an API round-trip on every landing page load, keeps the page fast, and eliminates a failure mode. When the platform grows to 10+ tools or pricing becomes dynamic (A/B testing, regional pricing), we can move this to a Supabase table and fetch via API without changing the component interfaces -- `ToolCardsSection` will still receive `Tool[]` as a prop.

### ADR-002: Separate `landing/` component folder

**Decision:** Landing page sections live in `src/components/landing/`, not in `src/components/ui/` or directly in `src/pages/`.

**Rationale:** These components (`HeroSection`, `PricingSection`) are page-specific compositions, not reusable UI primitives. Placing them in `ui/` would pollute that folder with non-reusable elements. Placing them directly in `pages/` would make `HomePage.tsx` a 500+ line monolith. The `landing/` folder keeps them co-located and discoverable.

### ADR-003: Layout route pattern for Header/Footer

**Decision:** Use a React Router layout route (`<Route element={<AppLayout />}>`) rather than rendering Header/Footer inside each page component.

**Rationale:** This is the idiomatic React Router v7 pattern for persistent layout. It avoids duplicating Header/Footer in every page, and makes it trivial to create pages that opt out of the layout (e.g., a future full-screen onboarding flow could use a different layout route).

### ADR-004: No state management for the landing page

**Decision:** Do not introduce Zustand for the landing page. All data flows via props from static imports.

**Rationale:** The landing page has no interactive state beyond the mobile menu toggle (which is local `useState`). Introducing a store here would add complexity without benefit. Zustand will be added in Milestone 4 (calculator form state) and Milestone 2 (auth state).

### ADR-005: `src/data/` folder for static constants

**Decision:** Create a new `src/data/` directory to hold static data arrays (`tools.ts`, `pricing.ts`).

**Rationale:** These are not types (which go in `src/types/`), not utility functions (which go in `src/utils/`), and not API service calls (which go in `src/services/`). They are static domain data that the UI consumes. A dedicated `data/` folder makes this clear and keeps other folders focused.

---

## 10. Implementation Order

The frontend developer should build in this order:

1. **Types** -- `src/types/tool.ts`, `src/types/pricing.ts`
2. **Data** -- `src/data/tools.ts`, `src/data/pricing.ts`
3. **Utility** -- `src/utils/format.ts` (currency formatter)
4. **UI primitives** -- `src/components/ui/Button.tsx`, `src/components/ui/Badge.tsx`
5. **Layout** -- `src/components/layout/AppLayout.tsx`, `Header.tsx`, `Footer.tsx`
6. **Landing sections** -- `HeroSection`, `ToolCard`, `ToolCardsSection`, `HowItWorksSection`, `PricingCard`, `PricingSection`
7. **Pages** -- `HomePage.tsx` (compose sections), placeholder pages
8. **Router** -- Update `App.tsx` with router setup
9. **Cleanup** -- Remove `App.css`, Vite boilerplate assets, boilerplate code from `App.tsx`

---

## 11. French Copy Reference

These are the key French strings the frontend developer should use. Exact wording can be refined by the product manager, but this gives a starting point.

| Location | Text |
|----------|------|
| Hero headline | "Prenez le controle de votre avenir financier" |
| Hero subheadline | "Des outils simples pour planifier votre retraite et construire votre patrimoine" |
| Hero CTA | "Commencer gratuitement" |
| Tool cards section heading | "Nos outils" |
| How it works heading | "Comment ca marche" |
| Step 1 | "Remplissez le formulaire" |
| Step 2 | "Decouvrez vos resultats" |
| Step 3 | "Passez a l'action" |
| Pricing heading | "Nos tarifs" |
| Badge: available | "Disponible" |
| Badge: coming_soon | "Bientot" |
| Header CTA | "Commencer" |
| Footer copyright | "(c) 2026 - Tous droits reserves" |
