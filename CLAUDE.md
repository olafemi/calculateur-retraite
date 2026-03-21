# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Subscription-based wealth planning tools suite for Benin / West Africa. Microservices architecture designed for scale. See `docs/plan.md` for full plan.

**Tools (in development order):**
1. Calculateur de Retraite — retirement savings calculator
2. Road to Millions — wealth milestone timeline calculator
3. More tools planned (inflation sim, tax sim, budget tracker)

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS
- React Router, Zustand (state), Recharts (charts)
- Supabase (auth + PostgreSQL database)
- KKiaPay (payment aggregator)
- Vercel (hosting + serverless API routes)

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally

## Architecture

- **Frontend:** React SPA with step-by-step form wizards, reactive calculations (no submit buttons)
- **API routes:** Vercel serverless functions in `api/` (auth, payment webhooks, subscription management)
- **Calculation logic:** Pure functions in `src/utils/` — keep testable and framework-agnostic
- **Payment:** KKiaPay SDK for collecting FCFA payments, webhook at `api/payment/webhook.ts`
- **Auth:** Supabase Auth for user registration/login

## Conventions

- UI language: French
- Currency: FCFA (XOF)
- Number formatting: French locale (`fr-FR`)
- Mobile-first design
- Simple language in UI — no financial jargon (use "Votre effort mensuel" not "Épargne mensuelle requise")
- Results are behind a paywall (blurred/locked until payment or account creation)

## Agent System

This project uses a multi-agent system in `.claude/agents/`. Start all work through the orchestrator:

```bash
claude --agent orchestrator
```

| Agent | Role |
|-------|------|
| `orchestrator` | CTO — receives all instructions, delegates to specialists |
| `product-manager` | Requirements, user stories, acceptance criteria, roadmap |
| `architect` | System design, data models, API contracts, tech decisions |
| `designer` | UI/UX, components, responsive layouts, design tokens |
| `frontend-dev` | React components, pages, state, KKiaPay widget |
| `backend-dev` | API routes, Supabase, auth, webhooks, subscriptions |
| `qa-tester` | Tests, edge cases, bug verification, quality gates |
| `devops` | Vercel config, CI/CD, env vars, deployment, monitoring |
