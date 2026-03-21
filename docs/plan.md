# Wealth Planning Tools — Project Plan

## Vision

A suite of subscription-based wealth planning tools targeting users in Benin and West Africa. Built as a microservices architecture designed for scale. Each tool is a standalone micro-frontend within a shared platform, with centralized authentication and payment via KKiaPay.

### Problem Statement

- No visibility on the real amount to save to maintain a lifestyle at retirement.
- Compound interest calculations are too complex for the general public.
- Lack of financial tools adapted to the FCFA currency and West African context.

---

## Architecture — Microservices

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                 │
│  ┌────────────┐ ┌────────────┐ ┌─────────────────┐  │
│  │  Landing /  │ │ Calculateur│ │ Road to Millions│  │
│  │  Auth Pages │ │ de Retraite│ │   (Phase 2)     │  │
│  └────────────┘ └────────────┘ └─────────────────┘  │
└──────────────┬──────────────────┬────────────────────┘
               │ API calls        │
┌──────────────▼──────────────────▼────────────────────┐
│               API Gateway (Vercel API Routes)        │
└──┬──────────┬───────────┬───────────┬────────────────┘
   │          │           │           │
┌──▼───┐ ┌───▼────┐ ┌────▼─────┐ ┌──▼──────────┐
│ Auth │ │Payment │ │Calculator│ │Subscription │
│Service│ │Service │ │ Service  │ │  Service    │
│      │ │(KKiaPay)│ │         │ │             │
└──────┘ └────────┘ └──────────┘ └─────────────┘
   │          │           │           │
┌──▼──────────▼───────────▼───────────▼────────────────┐
│                  Database (Supabase / Firebase)       │
│  users, subscriptions, simulation_history             │
└──────────────────────────────────────────────────────┘
```

### Service Breakdown

| Service           | Responsibility                                                    | Tech                          |
|-------------------|-------------------------------------------------------------------|-------------------------------|
| **Auth Service**  | User registration, login, session management                      | Supabase Auth or Firebase Auth|
| **Payment Service** | Payment collection, webhook handling, receipt generation        | KKiaPay SDK                   |
| **Subscription Service** | Plan management, access control, usage tracking            | Vercel API Routes + DB        |
| **Calculator Service** | Calculation engine (retirement, millions, future tools)       | Pure TS functions + API routes|

---

## Monetization — KKiaPay Integration

### Pricing Model (FCFA)

| Plan         | Price   | Access                                             |
|--------------|---------|----------------------------------------------------|
| One-shot     | 500 F   | See simulation results (single view)               |
| No account   | 500 F   | Pay to reveal results after filling the form        |
| Free account | 0 F     | First simulation result for free                   |
| Daily pass   | 500 F   | Unlimited adjustments for 24 hours                 |
| Monthly      | 1 000 F | Unlimited access for 30 days                       |
| Yearly       | 5 000 F | Unlimited access for 365 days                      |

### Payment Flow

```
User fills form → Results are blurred/locked
  ├─ No account → Pay 500 F via KKiaPay → Results revealed (one-time)
  └─ Has account
       ├─ First simulation → Free → Results shown
       └─ Adjustments / new simulations
            ├─ Active subscription → Results shown
            └─ No subscription → Choose plan → Pay via KKiaPay → Access granted
```

### KKiaPay Integration

- **SDK:** `kkiapay-js` (frontend widget for payment)
- **Webhook:** Vercel API route receives payment confirmation from KKiaPay
- **Environment variables (Vercel):**
  - `KKIAPAY_PUBLIC_KEY`
  - `KKIAPAY_PRIVATE_KEY`
  - `KKIAPAY_SECRET`

---

## Tools Roadmap

### Phase 1 — Calculateur de Retraite

#### Step-by-step Inputs (form wizard)

**Step 1 — Identité**
- Nom
- Prénom
- Sexe
- Date de naissance (used to compute current age)

**Step 2 — Situation actuelle**
- Statut : Salarié / Freelance / Étudiant / Autre

**Step 3 — Objectif retraite**
- Âge souhaité de départ à la retraite

**Step 4 — Revenus**
- Salaire actuel (mensuel, en FCFA)
- Revenu souhaité à la retraite (mensuel, en FCFA)

#### Calculation Engine

Computed in real-time (reactive — no "Calculer" button):

- **Capital Cible** — Total amount needed on day one of retirement
- **Épargne Mensuelle Requise** — Exact monthly amount to invest, accounting for compound interest

#### Results Display

- **Key figure:** Monthly savings amount displayed prominently in large text ("Votre effort mensuel")
- **Summary:** Total capital to accumulate ("Ce qu'il vous faut")
- **Contextual alerts:**
  - Retirement age too close → warning
  - Unrealistic target amount → warning
  - On track → encouragement message
- **Results are locked** until payment or account creation (see Payment Flow above)

### Phase 2 — Road to Millions

Show users how long it will take to reach a wealth milestone (1M, 10M, 100M FCFA) based on income and savings habits.

**Inputs:**
- Daily income or monthly salary
- Savings rate (% of income saved)
- Target wealth amount
- Expected return on investments

**Outputs:**
- Time to reach target (years/months)
- Side-by-side comparison scenarios (different savings rates)
- Milestone timeline visualization

### Future Phases (Backlog)

- **Inflation simulator** — simulate FCFA purchasing power loss over time
- **Export summary** — download results as JPEG, PNG, or PDF
- **Tax simulator** — integrate social contributions by country (Sénégal, Côte d'Ivoire, Bénin, etc.)
- **Budget tracker, debt payoff calculator, investment simulator**

---

## UX Requirements

- **Mobile-First:** Interface must be flawless on smartphone (primary device for target users)
- **Reactive calculations:** Results update instantly as the user moves sliders or changes inputs — no submit button
- **Simple language:** No technical terms like "Valeur Actuelle" or "Annuité". Use plain language:
  - "Ce qu'il vous faut" instead of "Capital cible"
  - "Votre effort mensuel" instead of "Épargne mensuelle requise"
- **WhatsApp share button** on results page

---

## Tech Stack

| Layer          | Choice                            |
|----------------|-----------------------------------|
| Framework      | React (Vite)                      |
| Styling        | Tailwind CSS                      |
| Language       | TypeScript                        |
| Hosting        | Vercel (frontend + API routes)    |
| Routing        | React Router                      |
| Charts         | Recharts                          |
| Auth           | Supabase Auth (or Firebase Auth)  |
| Database       | Supabase (PostgreSQL)             |
| Payments       | KKiaPay                           |
| State          | Zustand (lightweight)             |

---

## Project Structure (planned)

```
src/
├── components/          # Shared UI (layout, navbar, inputs, cards, paywall)
│   ├── ui/              # Buttons, inputs, sliders, modals
│   ├── layout/          # Header, Footer, PageWrapper
│   └── payment/         # KKiaPay widget, paywall overlay
├── pages/
│   ├── Home.tsx          # Landing page listing all tools
│   ├── Auth.tsx          # Login / Register
│   ├── RetraiteCalculateur.tsx
│   └── RoadToMillions.tsx
├── services/            # API client functions
│   ├── auth.ts
│   ├── payment.ts
│   └── subscription.ts
├── utils/               # Pure calculation logic (testable)
│   ├── retraite.ts
│   └── millions.ts
├── hooks/               # Custom React hooks (useAuth, useSubscription)
├── stores/              # Zustand stores
├── types/               # Shared TypeScript types
├── App.tsx
└── main.tsx

api/                     # Vercel serverless functions
├── auth/
├── payment/
│   └── webhook.ts       # KKiaPay webhook handler
├── subscription/
└── calculate/
```

---

## Deployment — Vercel

### Setup
1. Push repo to GitHub.
2. Import in Vercel → auto-detects Vite.
3. Every push to `main` triggers production deploy. PRs get preview deploys.

### Build settings
- **Build command:** `npm run build`
- **Output directory:** `dist`

### Environment variables
- `KKIAPAY_PUBLIC_KEY`
- `KKIAPAY_PRIVATE_KEY`
- `KKIAPAY_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## KPIs (Success Metrics)

| Metric              | Description                                                    |
|---------------------|----------------------------------------------------------------|
| Completion rate     | % of users who complete the full simulation after opening page |
| Conversion rate     | % of users who pay or create an account to see results         |
| Share rate          | Number of users who share results via WhatsApp                 |
| Subscription rate   | % of free users who upgrade to daily/monthly/yearly            |

---

## Currency & Locale

- Default currency: **FCFA (XOF)**
- Number formatting: French locale (`fr-FR`) — spaces as thousand separators, comma as decimal
- UI language: **French**

---

## Development Workflow

1. **Scaffold:** `npm create vite@latest . -- --template react-ts`
2. **Install:** `npm install tailwindcss @tailwindcss/vite react-router recharts zustand kkiapay-js @supabase/supabase-js`
3. **Dev server:** `npm run dev`
4. **Build:** `npm run build`
5. **Preview:** `npm run preview`

### Branching
- `main` — production (auto-deploys to Vercel)
- Feature branches → PR into `main`

---

## Phase 1 Milestones

1. Project scaffolding (Vite + Tailwind + Router + Supabase + Zustand)
2. Auth service (register, login, session)
3. Landing page with tool cards
4. Retirement calculator — step-by-step form wizard (4 steps)
5. Retirement calculator — reactive calculation engine
6. Retirement calculator — results display with paywall overlay
7. KKiaPay payment integration + webhook
8. Subscription management (daily / monthly / yearly)
9. WhatsApp share button
10. Responsive design pass (mobile-first)
11. Deploy to Vercel
12. User testing & iteration → stable v1
