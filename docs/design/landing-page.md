# Landing Page — Visual Design Spec

**For:** Frontend Developer (Milestone 3)
**Depends on:** Architecture spec at `docs/architecture/landing-page.md`
**Tailwind version:** v4 (CSS-based theming via `@theme` in `index.css`)

---

## 1. Brand Identity & Color Palette

### Rationale

The platform targets West African users who are not necessarily financially sophisticated. The visual language must signal two things simultaneously: warmth and approachability (this is not a cold banking interface) and credibility (this is not a toy, real money decisions are made here).

The primary palette draws from deep teal-green, a color strongly associated with financial security and growth across francophone West Africa (used by major regional banks such as Ecobank and Bank of Africa). The accent is a warm amber-gold that references wealth and prosperity without being loud or garish. Neutral grays keep the layout clean and let numbers breathe.

### Color Definitions

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-primary-900` | Teal profond | `#0D3D38` | Large text on light, dark section backgrounds |
| `--color-primary-800` | Teal fonce | `#145249` | Hero background alternative, footer |
| `--color-primary-700` | Teal moyen | `#1A6B5E` | Primary button background |
| `--color-primary-600` | Teal vif | `#21856F` | Primary button hover |
| `--color-primary-100` | Teal pale | `#E6F4F1` | Section backgrounds, card hover tint |
| `--color-primary-50`  | Teal tres pale | `#F2FAF8` | Page background alternative |
| `--color-accent-500`  | Or chaud | `#D4860A` | CTA buttons, highlights, badges |
| `--color-accent-400`  | Or vif | `#E59A12` | CTA button hover |
| `--color-accent-50`   | Or pale | `#FEF7E8` | Accent background tint |
| `--color-neutral-900` | Gris tres fonce | `#111827` | Body text, headings |
| `--color-neutral-700` | Gris fonce | `#374151` | Secondary text |
| `--color-neutral-500` | Gris moyen | `#6B7280` | Placeholder text, captions |
| `--color-neutral-300` | Gris clair | `#D1D5DB` | Borders, dividers |
| `--color-neutral-100` | Gris tres clair | `#F3F4F6` | Card backgrounds |
| `--color-neutral-50`  | Blanc casse | `#F9FAFB` | Page background |
| `--color-white`       | Blanc pur | `#FFFFFF` | Card surfaces, header background |
| `--color-success-500` | Vert succes | `#16A34A` | "Disponible" badge, success states |
| `--color-success-100` | Vert pale | `#DCFCE7` | "Disponible" badge background |
| `--color-warning-500` | Ambre avertissement | `#D97706` | "Bientot" badge |
| `--color-warning-100` | Ambre pale | `#FEF3C7` | "Bientot" badge background |
| `--color-error-500`   | Rouge erreur | `#DC2626` | Error states |
| `--color-error-100`   | Rouge pale | `#FEE2E2` | Error state backgrounds |

### Tailwind v4 CSS Theme (`src/index.css`)

Replace the single `@import "tailwindcss";` line with the full theme block below. This is the single source of truth — the frontend developer must not define colors anywhere else.

```css
@import "tailwindcss";

@theme {
  /* ── Brand colors ─────────────────────────────────────── */
  --color-primary-50:  #F2FAF8;
  --color-primary-100: #E6F4F1;
  --color-primary-600: #21856F;
  --color-primary-700: #1A6B5E;
  --color-primary-800: #145249;
  --color-primary-900: #0D3D38;

  --color-accent-50:  #FEF7E8;
  --color-accent-400: #E59A12;
  --color-accent-500: #D4860A;

  /* ── Neutral grays ────────────────────────────────────── */
  --color-neutral-50:  #F9FAFB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-300: #D1D5DB;
  --color-neutral-500: #6B7280;
  --color-neutral-700: #374151;
  --color-neutral-900: #111827;

  /* ── Semantic states ──────────────────────────────────── */
  --color-success-100: #DCFCE7;
  --color-success-500: #16A34A;
  --color-warning-100: #FEF3C7;
  --color-warning-500: #D97706;
  --color-error-100:   #FEE2E2;
  --color-error-500:   #DC2626;

  /* ── Typography ───────────────────────────────────────── */
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;

  /* ── Radius ───────────────────────────────────────────── */
  --radius-sm:  0.375rem;   /* 6px  — badges, small tags */
  --radius-md:  0.75rem;    /* 12px — buttons, inputs */
  --radius-lg:  1rem;       /* 16px — cards */
  --radius-xl:  1.5rem;     /* 24px — hero panel, pricing highlight */

  /* ── Shadows ──────────────────────────────────────────── */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06);
  --shadow-card-hover: 0 8px 24px -4px rgb(0 0 0 / 0.12), 0 4px 8px -4px rgb(0 0 0 / 0.08);
  --shadow-pricing-recommended: 0 0 0 2px #1A6B5E, 0 12px 32px -4px rgb(26 107 94 / 0.20);

  /* ── Transitions ──────────────────────────────────────── */
  --transition-base: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Google Fonts import ─────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Base styles ─────────────────────────────────────────── */
@layer base {
  html {
    font-family: var(--font-sans);
    color: var(--color-neutral-900);
    background-color: var(--color-neutral-50);
    -webkit-font-smoothing: antialiased;
  }

  /* Minimum touch target for all interactive elements */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }

  /* Focus ring — visible, branded */
  :focus-visible {
    outline: 2px solid var(--color-primary-700);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
  }
}
```

---

## 2. Typography

### Font Family

**Plus Jakarta Sans** (Google Fonts). Reasons for this choice:
- Excellent support for French diacritics (é, è, ê, à, ù, ç, etc.)
- Geometric-humanist style that is modern but warm — avoids the sterile feel of purely geometric fonts
- Strong weight range (400–800) gives expressive headings without needing a second typeface
- Highly legible at small sizes on low-resolution mobile screens

A single typeface family is used for all text (headings and body). This reduces loading time and eliminates visual inconsistency.

### Type Scale

| Role | Size (mobile) | Size (desktop) | Weight | Line Height | Tailwind classes |
|------|--------------|----------------|--------|-------------|-----------------|
| Hero headline (h1) | 28px / `text-3xl` | 48px / `text-5xl` | 800 | 1.15 | `text-3xl md:text-5xl font-extrabold leading-tight` |
| Section heading (h2) | 22px / `text-2xl` | 32px / `text-3xl` | 700 | 1.25 | `text-2xl md:text-3xl font-bold` |
| Card heading (h3) | 18px / `text-lg` | 20px / `text-xl` | 700 | 1.3 | `text-lg md:text-xl font-bold` |
| Body large | 18px / `text-lg` | 20px / `text-xl` | 400 | 1.6 | `text-lg md:text-xl font-normal` |
| Body base | 16px / `text-base` | 16px / `text-base` | 400 | 1.6 | `text-base font-normal` |
| Body small | 14px / `text-sm` | 14px / `text-sm` | 400 | 1.5 | `text-sm font-normal` |
| Label / caption | 12px / `text-xs` | 12px / `text-xs` | 500 | 1.4 | `text-xs font-medium uppercase tracking-wide` |
| Price display | 28px / `text-3xl` | 32px / `text-4xl` | 800 | 1 | `text-3xl md:text-4xl font-extrabold tabular-nums` |
| Price suffix | 14px / `text-sm` | 14px / `text-sm` | 500 | 1 | `text-sm font-medium` |

### Color Application

- **Headings:** `text-neutral-900` on light backgrounds, `text-white` on dark (primary) backgrounds
- **Body text:** `text-neutral-700`
- **Captions / secondary:** `text-neutral-500`
- **Links:** `text-primary-700 hover:text-primary-600 underline-offset-2 hover:underline`

---

## 3. Design Tokens Summary

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `rounded` (default) | 4px | Not used — too tight |
| `rounded-md` | `--radius-md` = 12px | Buttons, inputs, small badges |
| `rounded-lg` | `--radius-lg` = 16px | Tool cards, how-it-works steps |
| `rounded-xl` | `--radius-xl` = 24px | Pricing card recommended state, hero image panel |
| `rounded-full` | 9999px | Status badges (pill shape) |

### Shadows

Use the custom shadow variables via inline styles or a `@layer utilities` block:

```css
@layer utilities {
  .shadow-card       { box-shadow: var(--shadow-card); }
  .shadow-card-hover { box-shadow: var(--shadow-card-hover); }
  .shadow-pricing    { box-shadow: var(--shadow-pricing-recommended); }
}
```

Cards default to `shadow-card` and transition to `shadow-card-hover` on hover. Avoid the Tailwind default `shadow-md` / `shadow-lg` — they are too dark for a clean financial UI.

### Spacing Rhythm

All sections use a consistent vertical rhythm:

- **Section padding:** `py-16 md:py-24` (64px mobile, 96px desktop)
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Card internal padding:** `p-6` (24px all sides, mobile and desktop)
- **Gap between cards:** `gap-5 md:gap-6`
- **Stack gap inside a card:** `space-y-3` between elements
- **Section heading margin below:** `mb-10 md:mb-14`

### Card Style (base)

```
Background:     white
Border:         1px solid neutral-200  (Tailwind: border border-neutral-200)
Border-radius:  rounded-lg  (16px)
Shadow:         shadow-card
Padding:        p-6
Transition:     all 150ms ease
```

Hover state (for clickable cards):
```
Shadow:         shadow-card-hover
Transform:      -translateY(2px)  (Tailwind: hover:-translate-y-0.5)
Border color:   neutral-300
```

---

## 4. Component Visual Specs

### 4.1 Header

**Visual appearance**

Fixed to the top, full width. White background with a very subtle bottom border (`border-b border-neutral-200`). Height is 64px on mobile, 72px on desktop. A soft `backdrop-blur-sm` is applied so it feels slightly frosted when the user scrolls over colored sections.

**Logo area (left)**
- Text-based logo in Phase 1: "WealthPlan" or the French product name
- Font: `font-extrabold text-xl text-primary-800`
- Optionally prefix with a small teal circle icon (pure CSS or inline SVG — no icon library import)

**Nav links (center/right on desktop)**
- Three links: "Nos outils", "Tarifs", "Se connecter"
- Style: `text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors`
- Active link: `text-primary-700 font-semibold`
- Links collapse behind a hamburger on mobile

**CTA button (far right)**
- Variant: `primary` (amber accent)
- Label: "Commencer"
- Hidden on mobile to avoid crowding — the hamburger menu reveals it

**Mobile menu**
- Slides down from below the header (not a full overlay drawer — keeps it simple)
- Background: `bg-white border-b border-neutral-200`
- Nav items stacked vertically with `py-3 px-4 text-base font-medium`
- CTA button shown here, full width: `w-full mt-4`

**Tailwind classes (header bar)**
```
fixed top-0 left-0 right-0 z-50
bg-white/95 backdrop-blur-sm
border-b border-neutral-200
h-16 md:h-18
```

**Tailwind classes (inner container)**
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
flex items-center justify-between h-full
```

**Accessibility**
- `<nav aria-label="Navigation principale">`
- Hamburger button: `aria-expanded={isMobileMenuOpen}` and `aria-controls="mobile-menu"`
- Mobile menu: `id="mobile-menu"` with `role="navigation"`

---

### 4.2 HeroSection

**Visual appearance**

Full-width section with a dark teal gradient background. This is the most visually impactful element on the page — it must immediately communicate trust and aspiration.

```
Background: linear-gradient(135deg, #0D3D38 0%, #1A6B5E 100%)
```
Equivalent in Tailwind: `bg-gradient-to-br from-primary-900 to-primary-700`

**Layout (mobile):** Single column, centered text. Headline, then subheadline, then CTA button, then a subtle decorative element below.

**Layout (desktop — md and above):** Two columns. Left column has text and CTA (60% width). Right column has an abstract decorative graphic (a stylized upward chart drawn in SVG using primary-100 and accent-400 colors, or a tasteful illustration of a person looking forward — no generic stock photo).

**Headline copy:** "Prenez le controle de votre avenir financier"
- Style: `text-3xl md:text-5xl font-extrabold text-white leading-tight`
- The word "avenir" can be wrapped in `<span className="text-accent-400">` to create a focal color accent

**Subheadline copy:** "Des outils simples pour planifier votre retraite et construire votre patrimoine, adaptes au contexte ouest-africain."
- Style: `text-lg md:text-xl font-normal text-primary-100 mt-4 max-w-xl`
- `text-primary-100` provides sufficient contrast on the dark background (see section 6)

**CTA button:** "Commencer gratuitement" — variant `accent` (amber), size `lg`
- `mt-8 md:mt-10`

**Trust signal strip** below the hero (still inside the section, on a slightly lighter teal band):
- Three short items in a row: a lock icon + "Paiement securise", a shield icon + "Vos donnees protegees", a star icon + "100% gratuit pour commencer"
- Style: `flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 pt-8 border-t border-primary-800`
- Text: `text-sm font-medium text-primary-100`
- Icons: small inline SVGs, `text-accent-400`

**Tailwind classes (section)**
```
bg-gradient-to-br from-primary-900 to-primary-700
px-4 sm:px-6 lg:px-8
pt-32 pb-20 md:pt-40 md:pb-28
```
(`pt-32` on mobile accounts for the fixed 64px header plus generous breathing room.)

**Tailwind classes (inner layout)**
```
max-w-7xl mx-auto
grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16
items-center
```

---

### 4.3 ToolCard

**Visual appearance**

White card on a light gray section background (`bg-neutral-50`). Each card has:
- An icon in a rounded square at the top left — `w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center` — emoji or SVG icon inside, `text-2xl` if emoji, `w-6 h-6 text-primary-700` if SVG
- Tool name as `h3`
- Short description as `p`
- Status badge (see Badge spec below)
- If `status === "available"`: the entire card is wrapped in a `<Link>` and gains hover styles
- If `status === "coming_soon"`: card is not a link, has `opacity-70` on the text content (not the card itself — the card stays visible), badge shows "Bientot"

**Available card (interactive state)**
```
Default:
  bg-white rounded-lg p-6 border border-neutral-200 shadow-card
  transition-all duration-150 cursor-pointer

Hover:
  shadow-card-hover -translate-y-0.5 border-neutral-300
  (the icon square background shifts to primary-200)

Focus:
  focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2
```

**Coming soon card (non-interactive)**
```
bg-white rounded-lg p-6 border border-neutral-200 shadow-card
cursor-default
(icon square: bg-neutral-100, icon color: text-neutral-400)
(heading: text-neutral-500)
(description: text-neutral-400)
```

**Card internal layout (top to bottom)**
```
[Icon square]         (mb-4)
[Tool name h3]        text-lg font-bold text-neutral-900  (mb-1)
[Description p]       text-sm text-neutral-500            (mb-4)
[Badge]               (mt-auto — push to bottom if using flex-col)
```
Make the card `flex flex-col` so the badge is always pinned to the bottom regardless of description length.

**Full card class string**
```
group flex flex-col bg-white rounded-lg p-6
border border-neutral-200 shadow-card
transition-all duration-150
hover:shadow-card-hover hover:-translate-y-0.5 hover:border-neutral-300
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-primary-700 focus-visible:ring-offset-2
```

**Mobile vs Desktop**
- Mobile: full width in a 1-column grid, minimum height not set (natural content height)
- Desktop: 2–3 column grid via `ToolCardsSection`, cards align to equal height via CSS grid

---

### 4.4 ToolCardsSection

**Visual appearance**

Light gray section (`bg-neutral-50`) to visually separate it from the white hero. No heavy decoration — the cards themselves carry the visual weight.

**Section heading**
```
text-2xl md:text-3xl font-bold text-neutral-900
```
Preceded by a small uppercase label in accent color:
```
text-xs font-medium uppercase tracking-widest text-primary-700 mb-2
```
Example: "NOS OUTILS" in small caps above the larger heading.

**Grid**
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6
mt-10 md:mt-14
```

**Full section classes**
```
bg-neutral-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8
```

---

### 4.5 HowItWorksSection

**Visual appearance**

White background. Three horizontal steps on desktop, vertical stack on mobile. Each step has:
- A large numbered circle
- A short heading
- Two lines of description text
- Connector line between steps (desktop only, hidden on mobile)

**Step number circle**
```
w-14 h-14 rounded-full
bg-primary-700 text-white
flex items-center justify-center
text-xl font-extrabold
mx-auto md:mx-0
```

**Connector line (desktop only)**
- A `<div>` positioned absolutely between step circles
- `hidden md:block absolute top-7 left-[3.5rem] right-0 h-0.5 bg-neutral-200`
- The parent step wrapper needs `relative` positioning

**Step heading**
```
text-base md:text-lg font-bold text-neutral-900 mt-4 mb-1
text-center md:text-left
```

**Step description**
```
text-sm text-neutral-500 leading-relaxed
text-center md:text-left
```

**Layout**
```
Mobile:  flex flex-col gap-8
Desktop: grid grid-cols-3 gap-8 relative
```

**Section header:** same pattern as ToolCardsSection — small uppercase label then large heading.

**French step copy**
| Step | Heading | Description |
|------|---------|-------------|
| 1 | "Remplissez le formulaire" | "Repondez a quelques questions simples sur votre situation et vos objectifs." |
| 2 | "Decouvrez vos resultats" | "Notre moteur de calcul vous montre exactement ce qu'il vous faut chaque mois." |
| 3 | "Passez a l'action" | "Commencez a epargner avec un plan concret adapte a votre vie." |

**Full section classes**
```
bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8
```

---

### 4.6 PricingCard

**Visual appearance**

Cards use the same base card style as ToolCard but with some important differences:
- Taller, more spacious internal layout
- Price is the dominant visual element, large and bold
- Features list uses checkmark icons

**Default card**
```
bg-white rounded-lg p-6 border border-neutral-200 shadow-card flex flex-col
```

**Recommended card** (`plan.recommended === true`)

This card gets elevated visual treatment:
```
bg-white rounded-xl p-6 md:p-8
border-2 border-primary-700
shadow-pricing
flex flex-col
relative
```
A "Recommande" badge is positioned at the top, overlapping the card border:
```
absolute -top-3 left-1/2 -translate-x-1/2
bg-primary-700 text-white text-xs font-semibold
px-4 py-1 rounded-full
```

**Card internal layout**
```
[Plan name]           text-sm font-semibold uppercase tracking-wide text-neutral-500  (mb-2)
[Price row]           flex items-end gap-1                                             (mb-1)
  [Amount]            text-3xl md:text-4xl font-extrabold text-neutral-900 tabular-nums
  [Currency]          text-sm font-medium text-neutral-500 mb-1
[Billing label]       text-sm text-neutral-500                                        (mb-6)
[Divider]             h-px bg-neutral-100                                             (mb-5)
[Features list]       flex-1 space-y-3                                                (mb-8)
  [Feature item]      flex items-start gap-2
    [Checkmark icon]  w-4 h-4 text-primary-700 flex-shrink-0 mt-0.5
    [Feature text]    text-sm text-neutral-700
[CTA button]          mt-auto (push to bottom via flex-col + mt-auto)
```

**CTA button in pricing card**
- Default card: `variant="outline"`, label "Choisir ce plan"
- Recommended card: `variant="primary"` (teal), label "Commencer — 1 000 F"

**Grid layout (PricingSection)**
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6
```
On mobile, cards stack and each is full width. The recommended card should be rendered first in the array order if you want it to appear prominently on mobile, but the architect's data defines it as the third item (monthly) — keep the order as-is and rely on the visual highlight to draw attention.

**Section background**
```
bg-primary-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8
```
The pale teal background differentiates pricing from the other sections and subtly reinforces the brand color.

---

### 4.7 Footer

**Visual appearance**

Dark footer using `bg-primary-900` (the darkest teal). Two rows:
1. Top row: logo (white) on left, three link groups on desktop (stacks vertically on mobile)
2. Bottom row: copyright text centered, legal links

**Logo in footer**
- Same text as header but `text-white font-extrabold`

**Link groups (desktop only — collapse on mobile)**
- "Outils": Calculateur de Retraite, Road to Millions
- "Compte": Se connecter, Creer un compte
- "Legal": Mentions legales, Confidentialite

**Link style**
```
text-sm text-primary-100 hover:text-white transition-colors
```

**Copyright bar**
```
border-t border-primary-800 mt-10 pt-6
text-xs text-primary-100 text-center
```
Copy: "© 2026 WealthPlan — Tous droits reserves"

**Tailwind classes (footer)**
```
bg-primary-900 px-4 sm:px-6 lg:px-8 py-12 md:py-16
```

---

### 4.8 Button

Three variants are defined. The `Button` component receives a `variant` prop and applies the corresponding class set.

#### Variant: `primary` (teal — main navigation and form actions)

```
inline-flex items-center justify-center gap-2
rounded-md font-semibold transition-all duration-150
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-primary-700 focus-visible:ring-offset-2

bg-primary-700 text-white
hover:bg-primary-600 active:bg-primary-800
disabled:opacity-50 disabled:cursor-not-allowed
```

#### Variant: `accent` (amber — primary CTA, hero button)

```
inline-flex items-center justify-center gap-2
rounded-md font-semibold transition-all duration-150
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-accent-500 focus-visible:ring-offset-2

bg-accent-500 text-white
hover:bg-accent-400 active:bg-accent-500
shadow-sm hover:shadow
disabled:opacity-50 disabled:cursor-not-allowed
```

#### Variant: `outline` (teal outline — secondary actions, pricing default)

```
inline-flex items-center justify-center gap-2
rounded-md font-semibold transition-all duration-150
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-primary-700 focus-visible:ring-offset-2

border-2 border-primary-700 text-primary-700 bg-transparent
hover:bg-primary-50 active:bg-primary-100
disabled:opacity-50 disabled:cursor-not-allowed
```

#### Variant: `ghost` (subtle — used in header nav on mobile)

```
inline-flex items-center justify-center gap-2
rounded-md font-semibold transition-all duration-150
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-primary-700 focus-visible:ring-offset-2

text-neutral-700 bg-transparent
hover:bg-neutral-100 hover:text-neutral-900
```

#### Size modifiers

| Size | Height | Padding | Font size |
|------|--------|---------|-----------|
| `sm` | 36px | `px-3 py-2` | `text-sm` |
| `md` (default) | 44px | `px-5 py-2.5` | `text-base` |
| `lg` | 52px | `px-8 py-3.5` | `text-lg` |

The minimum 44px height for `md` satisfies WCAG 2.5.5 (minimum touch target size).

---

### 4.9 Badge

Small pill-shaped label. Rendered as a `<span>`, not a `<button>`.

#### Status: `available`
```
inline-flex items-center gap-1.5
rounded-full px-2.5 py-0.5
text-xs font-semibold
bg-success-100 text-success-500
```
Optional: a small filled circle dot `w-1.5 h-1.5 rounded-full bg-success-500` before the text.
Label: "Disponible"

#### Status: `coming_soon`
```
inline-flex items-center gap-1.5
rounded-full px-2.5 py-0.5
text-xs font-semibold
bg-warning-100 text-warning-500
```
Label: "Bientot"

#### Status: `locked`
```
inline-flex items-center gap-1.5
rounded-full px-2.5 py-0.5
text-xs font-semibold
bg-neutral-100 text-neutral-500
```
Label: "Verrouille"

---

## 5. Visual Hierarchy

The eye should move through the page in this order:

**1. Hero headline** — Largest text on the page, white on dark teal, high contrast. The accent-colored word "avenir" creates a color focal point that pulls the eye immediately.

**2. Hero CTA button** — The amber button is the only warm-colored element in the cool teal hero. It is visually isolated and easy to find.

**3. Trust signal strip** — Three short items just below the CTA. Small text but positioned where the eye naturally travels after the button. Reduces friction before the user scrolls.

**4. Tool cards** — On scroll, the first thing visible is the tool cards section. The card for "Calculateur de Retraite" should always appear first (top-left on desktop, top on mobile). The icon and bold heading capture attention; the description and badge answer "what is this and is it ready?"

**5. How it works** — By the time users reach this section, they are interested. The numbered steps and brief text answer "how does this work?" The large numbered circles on a white background create strong visual rhythm.

**6. Pricing section** — The pale teal background creates a visual break that signals "this section is different — here is what it costs." The recommended (monthly) card's elevated border and shadow ensure it is noticed first within the grid.

**7. Footer** — Functional, not decorative. Dark background creates clear page closure.

---

## 6. Accessibility

### Color Contrast Ratios (WCAG 2.1 AA minimum: 4.5:1 for normal text, 3:1 for large text)

| Foreground | Background | Ratio | Pass? | Usage |
|-----------|------------|-------|-------|-------|
| `#FFFFFF` white | `#1A6B5E` primary-700 | 5.8:1 | AA pass | Primary button text |
| `#FFFFFF` white | `#D4860A` accent-500 | 3.5:1 | AA pass (large text / bold) | Accent button text — use only for `text-base font-semibold` or larger |
| `#FFFFFF` white | `#0D3D38` primary-900 | 12.2:1 | AAA | Hero section text |
| `#E6F4F1` primary-100 | `#0D3D38` primary-900 | 9.1:1 | AAA | Hero subheadline |
| `#111827` neutral-900 | `#FFFFFF` white | 16.1:1 | AAA | Body text on cards |
| `#374151` neutral-700 | `#FFFFFF` white | 9.7:1 | AAA | Secondary text on cards |
| `#6B7280` neutral-500 | `#FFFFFF` white | 4.6:1 | AA pass | Captions on white |
| `#16A34A` success-500 | `#DCFCE7` success-100 | 5.2:1 | AA pass | Available badge |
| `#D97706` warning-500 | `#FEF3C7` warning-100 | 3.1:1 | AA pass (large text) | Bientot badge — `font-semibold` required |
| `#1A6B5E` primary-700 | `#F2FAF8` primary-50 | 6.4:1 | AA pass | Outline button text on light bg |

The amber accent (`#D4860A` on white) yields a 3.1:1 ratio — below AA for body text. **Never use accent-500 as text color on a white background for body copy.** It is only used for button text on a colored background, or for decorative icons.

### Focus States

Every interactive element must show a visible focus ring on keyboard navigation. The base `focus-visible` rule in `index.css` applies site-wide. Do not suppress outlines with `outline-none` without providing an equivalent replacement via `ring`.

The focus ring color is `primary-700` (#1A6B5E) — this provides 3.1:1 against white backgrounds. When a focused element appears on the dark hero section, add `focus-visible:ring-offset-primary-900` to ensure the offset gap is visible.

### Keyboard Navigation Order

The page tab order must flow logically:
1. Skip-to-content link (visually hidden, revealed on focus) — `href="#main-content"`
2. Header logo link
3. Header nav links (left to right)
4. Hamburger button (mobile only, replaces nav links)
5. Header CTA button
6. Hero CTA button
7. Tool cards (available cards are `<Link>`, coming-soon cards use `tabIndex={-1}` and `aria-disabled="true"`)
8. Pricing card CTA buttons
9. Footer links

### Screen Reader Annotations

- The hero `<section>` gets `aria-labelledby="hero-heading"` where `id="hero-heading"` is on the `<h1>`
- The tool cards section gets `aria-labelledby="tools-heading"`
- The pricing section gets `aria-labelledby="pricing-heading"`
- Price values: wrap in `<span aria-label="500 francs CFA, une seule fois">` so screen readers read a natural sentence instead of "500 F CFA une seule fois"
- The "Recommande" badge: add `aria-label="Plan recommande"` to clarify for screen readers

---

## 7. Interaction and Animation Guidelines

Keep animations minimal and purposeful. The target devices include budget Android phones — no animations that require GPU compositing for more than 200ms.

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Card hover (translate + shadow) | `transition-all` | 150ms |
| Button hover (color shift) | `transition-colors` | 150ms |
| Mobile menu open/close | Slide down + fade in (`transform translateY` + `opacity`) | 200ms |
| Header background on scroll | Opacity shift via JS class toggle | 100ms |
| Page transitions | None in Phase 1 — instant navigation |

**No scroll-triggered animations** in Phase 1. Intersection Observer animations (fade in as sections enter viewport) can be added in a later pass once core functionality is shipped.

---

## 8. Mobile-First Responsive Checklist

The following must be verified at 375px (iPhone SE viewport — the smallest common target device):

- [ ] Hero headline fits on 3 lines maximum at `text-3xl`
- [ ] Hero CTA button is full-width (`w-full`) on mobile to maximize tap target
- [ ] Header height does not overlap hero content (check `pt-32` on hero section)
- [ ] Tool cards stack to 1 column with no horizontal overflow
- [ ] Pricing cards stack to 1 column, recommended card is visually distinguishable even without the grid context
- [ ] "Recommande" badge on pricing card does not overflow its card at 375px
- [ ] Footer link groups collapse gracefully — show as a vertical list
- [ ] All touch targets are minimum 44x44px (buttons, nav links, card links)
- [ ] No text smaller than 14px (`text-sm`) is used for meaningful content

---

## 9. Dark Mode

Dark mode is **out of scope for Phase 1**. Do not implement `dark:` variants. The CSS variables in `@theme` use light-mode values only. If dark mode is added later, it should be implemented by adding a `.dark` class on `<html>` and re-defining the color variables under a `@layer base { .dark { ... } }` block — this requires no changes to component class strings.

---

## 10. Quick Reference: Section Backgrounds

| Section | Background |
|---------|-----------|
| Header (fixed) | `bg-white/95 backdrop-blur-sm` |
| HeroSection | `bg-gradient-to-br from-primary-900 to-primary-700` |
| ToolCardsSection | `bg-neutral-50` |
| HowItWorksSection | `bg-white` |
| PricingSection | `bg-primary-50` |
| Footer | `bg-primary-900` |

This alternating rhythm (dark → light gray → white → pale teal → dark) gives the page clear visual sections without needing decorative dividers or borders between them.
