# Hansonian OS — System Instructions

**Last Updated:** February 28, 2026
**Version:** 1.0.0

---

## 1. Platform Overview

Hansonian OS is a multi-portal NDIS (National Disability Insurance Scheme) care management platform for Australian disability support services. The platform consists of four web portals and one mobile app, all sharing a unified design system and authentication gateway.

---

## 2. Architecture

```
Hansonian/
├── gateway/              Next.js 16 — Unified login portal (Port 3000)
├── admin-web/            Next.js 16 — CEO/Admin Command Center (Port 3001)
├── employee-ops/         Next.js 16 — Employee & Operations Hub (Port 3002)
├── family-portal/        Next.js 16 — Patient & Family Portal (Port 3003)
├── caregiver-mobile/     Flutter — Caregiver Mobile App
├── shared/               Shared TypeScript types & UI components
├── firestore.rules       Firestore role-based security rules
├── SETUP.md              Complete setup guide
├── AUDIT_REPORT.md       Production refactor audit report
└── SYSTEM_INSTRUCTIONS.md  This document
```

### Authentication Flow

1. User visits the **Gateway** (`/gateway`) and enters demo or Firebase credentials
2. Gateway validates credentials, stores session in `sessionStorage` (`hs_role`, `hs_name`, `hs_email`)
3. Gateway redirects to the appropriate portal based on role:
   - `Admin` → Admin Web (port 3001)
   - `Employee` → Employee Ops (port 3002)
   - `Family` → Family Portal (port 3003)
4. Each portal reads session data for personalization
5. Logout clears session and redirects back to Gateway

---

## 3. Unified Tech Stack

All four web portals use an identical technology stack:

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS (v4, CSS-first) | ^4 |
| PostCSS | @tailwindcss/postcss | ^4 |
| Charts | Recharts | ^3.7.0 |
| Maps | Leaflet + React-Leaflet | ^1.9.4 / ^5.0.0 |
| Icons | Inline SVG / lucide-react | ^0.575.0 |
| Backend | Firebase (Firestore, Auth, Storage) | ^10.7.1 |
| Linting | ESLint (flat config) | ^9 |
| Deployment | Vercel (recommended) | — |

### Configuration File Standards

Each portal follows this consistent config pattern:

| File | Format | Purpose |
|------|--------|---------|
| `package.json` | JSON | Dependencies and scripts |
| `next.config.ts` | TypeScript | Next.js configuration |
| `postcss.config.mjs` | ESM | PostCSS with `@tailwindcss/postcss` |
| `eslint.config.mjs` | ESM flat config | ESLint v9 rules |
| `tsconfig.json` | JSON | TypeScript compiler options |
| `.env.local` | dotenv | Environment variables (not committed) |
| `.env.example` | dotenv | Environment variable template |

### TypeScript Configuration

All portals use:
- `target`: `ES2017`
- `jsx`: `react-jsx`
- `moduleResolution`: `bundler`
- `strict`: `true`

---

## 4. Design System

### Brand Colors

```
#faf9f7 — Primary background (warm cream)
#f0ede6 — Secondary background (cards, headers)
#1a1a2e — Primary text + sidebar + buttons (dark navy)
#4a4a6a — Secondary text
#e8e4dd — Border color (warm sand)
#4ade80 — Accent green (success, active, compliant)
#ef4444 — Alert red (error, expired, critical)
#eab308 — Warning yellow (expiring, medium risk)
```

### Typography

| Usage | Font Family | Tailwind Class |
|-------|------------|----------------|
| Body text | DM Sans | `font-sans` |
| Page headings | Playfair Display | `font-display` |
| Numbers/metrics | JetBrains Mono | `font-mono` |

All fonts loaded via Google Fonts CDN in each portal's `layout.tsx`.

### Tailwind CSS v4 Configuration

Tailwind v4 uses CSS-first configuration. Custom theme values are defined in `@theme {}` blocks within each portal's `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-hansonium-primary: #1a1a2e;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --shadow-premium: 0 4px 20px -2px rgba(26, 26, 46, 0.1);
}
```

No `tailwind.config.ts` or `tailwind.config.js` files are used.

---

## 5. Portal Scope Coverage

### Portal 1 — CEO/Admin Command Center (`/admin-web`)

| Story | Feature | Route |
|-------|---------|-------|
| US.A1 | Financial Pulse (revenue, labor cost, net margin) | `/` |
| US.A2 | DEX Compliance tracker with zone breakdown | `/dex` |
| US.A3 | Strategic Alerts (Client Advocacy Agent) | `/alerts` |
| — | Non-Compliant Sessions viewer | `/non-compliant` |

### Portal 2 — Employee & Operations Hub (`/employee-ops`)

| Story | Feature | Route |
|-------|---------|-------|
| US.E1 | Agentic Rostering with GPS + Auto-Fill | `/rostering` |
| US.E2 | Compliance Vault — credential expiry tracking | `/compliance` |
| US.E3 | DEX Audit Lab with Batch Approve | `/dex-audit` |
| — | Staff Directory | `/staff` |

### Portal 4 — Patient & Family Portal (`/family-portal`)

| Story | Feature | Route |
|-------|---------|-------|
| US.P1 | Transparency Feed — caregiver timeline | `/` |
| US.P2 | NDIS Budget Progress Ring | `/` |
| US.P3 | Session rating with escalation | `/` |

---

## 6. Environment Variables

All portals require a `.env.local` file. Key variables:

| Variable | Used In | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_GATEWAY_URL` | admin-web, employee-ops | Logout redirect URL |
| `NEXT_PUBLIC_ADMIN_URL` | gateway | Admin portal redirect |
| `NEXT_PUBLIC_EMPLOYEE_URL` | gateway | Employee portal redirect |
| `NEXT_PUBLIC_FAMILY_URL` | gateway | Family portal redirect |
| `NEXT_PUBLIC_FIREBASE_*` | all portals | Firebase configuration |

---

## 7. Firestore Security Rules

Role-based access is enforced via `firestore.rules`:

- **Admin** — Full read/write access to all collections
- **Employee (Staff)** — Read/write to assigned shifts, own credentials, participant data
- **Family** — Read-only access to own participant data, shifts, and budget

---

## 8. Production Deployment

### Recommended: Vercel

Each portal is deployed as an independent Vercel project:

| Portal | Recommended Subdomain |
|--------|-----------------------|
| Gateway | `portal.hansonium.com.au` |
| Admin | `admin.hansonium.com.au` |
| Employee | `employee.hansonium.com.au` |
| Family | `family.hansonium.com.au` |

### Pre-Deployment Checklist

- [ ] All `.env.local` values set with production Firebase keys
- [ ] Firebase Auth enabled with Email/Password provider
- [ ] Custom user claims set for role-based routing
- [ ] Security headers configured (X-Frame-Options, CSP, etc.)
- [ ] Gateway redirect URLs point to production subdomains

---

## 9. Development Guidelines

1. **No frontend/backend behavior changes** — UI and logic remain stable
2. **All portals must use identical dependency versions** — check `package.json` alignment
3. **Tailwind v4 CSS-first** — no `tailwind.config.*` files; use `@theme {}` in CSS
4. **ESLint v9 flat config** — use `eslint.config.mjs` with `eslint-config-next`
5. **TypeScript strict mode** — all new code must pass `tsc --noEmit`
6. **Next.js App Router** — use `app/` directory, not `pages/`
7. **Separate viewport export** — never put `viewport` or `themeColor` in `metadata`

---

*System instructions document — Hansonian OS v1.0.0 — February 28, 2026.*
