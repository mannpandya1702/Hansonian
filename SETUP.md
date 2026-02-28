# Hansonian OS — Complete Setup Guide

> **From zero to running in production.** This guide covers every step required to run all four web portals locally and deploy them to production.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Repository Structure](#3-repository-structure)
4. [Local Development Setup](#4-local-development-setup)
5. [Environment Variables](#5-environment-variables)
6. [Firebase Setup](#6-firebase-setup)
7. [Running All Portals Locally](#7-running-all-portals-locally)
8. [Production Deployment](#8-production-deployment)
9. [Integrating the Admin Button on hansonium.com.au](#9-integrating-the-admin-button)
10. [Tech Stack Reference](#10-tech-stack-reference)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Overview

Hansonian OS is a **multi-portal NDIS care management platform** with four web portals:

| Portal | Description | Port | Scope Stories |
|--------|-------------|------|---------------|
| **Gateway** | Unified login — role-based redirect | `3000` | Authentication |
| **Admin Web** | CEO/Admin Command Center | `3001` | US.A1, US.A2, US.A3 |
| **Employee Ops** | Employee & Operations Hub | `3002` | US.E1, US.E2, US.E3 |
| **Family Portal** | Patient & Family Portal | `3003` | US.P1, US.P2, US.P3 |

> The **Caregiver Mobile App** (`/caregiver-mobile`) is a Flutter application — see its own README.

---

## 2. Prerequisites

Install the following before proceeding:

```bash
# Node.js (v18 or later recommended)
node --version   # should output v18.x.x or higher

# npm (comes with Node)
npm --version    # should output 9.x.x or higher

# Git
git --version

# Firebase CLI (for Firebase Emulator + deployment)
npm install -g firebase-tools
firebase --version

# Optional: Flutter (for caregiver mobile app only)
flutter --version
```

### Recommended: Install `concurrently` globally to run all portals at once

```bash
npm install -g concurrently
```

---

## 3. Repository Structure

```
Hansonian/
├── gateway/            # Login portal (Port 3000)
├── admin-web/          # CEO/Admin dashboard (Port 3001)
├── employee-ops/       # Employee hub (Port 3002)
├── family-portal/      # Family/patient portal (Port 3003)
├── caregiver-mobile/   # Flutter mobile app
├── shared/             # Shared UI components & TypeScript types
├── firestore.rules     # Firestore security rules
├── SETUP.md            # This file
├── AUDIT_REPORT.md     # Audit report of all changes
└── SYSTEM_INSTRUCTIONS.md
```

---

## 4. Local Development Setup

### Step 1 — Clone the repository (if not already)

```bash
git clone <your-repo-url>
cd Hansonian
```

### Step 2 — Install dependencies for each portal

```bash
# Gateway
cd gateway && npm install && cd ..

# Admin Web
cd admin-web && npm install && cd ..

# Employee Ops
cd employee-ops && npm install && cd ..

# Family Portal
cd family-portal && npm install && cd ..
```

> **One-liner** (using `&` for parallel install):
> ```bash
> (cd gateway && npm install) & (cd admin-web && npm install) & (cd employee-ops && npm install) & (cd family-portal && npm install) & wait
> ```

### Step 3 — Copy environment files

Each portal has a `.env.example`. Copy it to `.env.local` and fill in values:

```bash
cp gateway/.env.example      gateway/.env.local
cp admin-web/.env.example    admin-web/.env.local
cp employee-ops/.env.example employee-ops/.env.local
cp family-portal/.env.example family-portal/.env.local
```

See [Section 5](#5-environment-variables) for required values.

---

## 5. Environment Variables

### Gateway (`gateway/.env.local`)

```env
# Portal redirect URLs — update to production URLs when deploying
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
NEXT_PUBLIC_EMPLOYEE_URL=http://localhost:3002
NEXT_PUBLIC_FAMILY_URL=http://localhost:3003

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase (optional for demo — required for production auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### Admin Web (`admin-web/.env.local`)

```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef
```

### Employee Ops (`employee-ops/.env.local`)

```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3002

# Firebase (same as admin-web)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
...
```

### Family Portal (`family-portal/.env.local`)

```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3003
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false   # set to true for local Firebase emulator

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

---

## 6. Firebase Setup

### Option A — Use Firebase Local Emulator (Recommended for Development)

```bash
# Login to Firebase
firebase login

# Initialize Firebase in the project root
firebase init

# Select: Firestore, Authentication, Storage, Hosting, Emulators
# Choose your Firebase project or create a new one

# Start the emulator suite
firebase emulators:start
```

This starts:
- Firestore emulator: `localhost:8080`
- Auth emulator: `localhost:9099`
- Storage emulator: `localhost:9199`
- Emulator UI: `localhost:4000`

Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in family-portal `.env.local`.

### Option B — Use a Real Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project: `hansonian-production`
3. Enable **Authentication** → Email/Password sign-in
4. Create **Firestore Database** → Start in test mode
5. Enable **Storage**
6. Go to **Project Settings → General → Your Apps** → Add a web app
7. Copy the config values into all `.env.local` files

### Firestore Collections to Create

```
participants/
  {participantId}/
    private/
      financial/        ← Admin-only budget data

shifts/
  {shiftId}/

staff/
  {staffId}/
    credentials/
      {credentialId}/

ndis_rates/
  {rateId}/
```

### Setting Custom User Roles (for role-based routing)

In production, assign roles via Firebase Auth Custom Claims using an Admin SDK function:

```javascript
// Firebase Admin SDK (run as Cloud Function or server-side script)
const admin = require('firebase-admin');

async function setUserRole(uid, role) {
  // role: 'Admin' | 'Employee' | 'Family'
  await admin.auth().setCustomUserClaims(uid, { role });
}
```

---

## 7. Running All Portals Locally

### Option A — Run each portal in separate terminals

```bash
# Terminal 1 — Gateway (login)
cd gateway && npm run dev -- --port 3000

# Terminal 2 — Admin Web
cd admin-web && npm run dev -- --port 3001

# Terminal 3 — Employee Ops
cd employee-ops && npm run dev -- --port 3002

# Terminal 4 — Family Portal
cd family-portal && npm run dev -- --port 3003
```

### Option B — Run all with concurrently (one terminal)

```bash
npx concurrently \
  "cd gateway && npm run dev -- --port 3000" \
  "cd admin-web && npm run dev -- --port 3001" \
  "cd employee-ops && npm run dev -- --port 3002" \
  "cd family-portal && npm run dev -- --port 3003"
```

### Demo Credentials

Visit `http://localhost:3000` and use any of these:

| Email | Password | Portal |
|-------|----------|--------|
| `admin@hansonium.com.au` | `admin123` | CEO/Admin (port 3001) |
| `employee@hansonium.com.au` | `employee123` | Employee (port 3002) |
| `family@hansonium.com.au` | `family123` | Family (port 3003) |

---

## 8. Production Deployment

### Recommended: Vercel (one command per portal)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy each portal
cd gateway && vercel --prod
cd admin-web && vercel --prod
cd employee-ops && vercel --prod
cd family-portal && vercel --prod
```

Set environment variables in Vercel Dashboard for each project.

### After deployment, update Gateway env vars

In `gateway/.env.local` (or Vercel env settings):
```env
NEXT_PUBLIC_ADMIN_URL=https://admin.hansonium.com.au
NEXT_PUBLIC_EMPLOYEE_URL=https://employee.hansonium.com.au
NEXT_PUBLIC_FAMILY_URL=https://family.hansonium.com.au
```

### Recommended Subdomains

| Portal | Subdomain |
|--------|-----------|
| Gateway | `https://portal.hansonium.com.au` or `https://login.hansonium.com.au` |
| Admin | `https://admin.hansonium.com.au` |
| Employee | `https://employee.hansonium.com.au` |
| Family | `https://family.hansonium.com.au` |

---

## 9. Integrating the Admin Button

To add an "Admin Portal" button to the existing `hansonium.com.au` website, add this HTML snippet to your navigation or footer:

```html
<!-- Add to your existing website navigation -->
<a
  href="https://portal.hansonium.com.au"
  target="_blank"
  rel="noopener noreferrer"
  class="admin-portal-btn"
>
  Staff Portal Login
</a>

<style>
.admin-portal-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #1a1a2e;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.admin-portal-btn:hover {
  background: #252540;
}
</style>
```

**Or in React/Next.js** (for the main website):

```tsx
import Link from 'next/link';

export function StaffPortalButton() {
  return (
    <Link
      href="https://portal.hansonium.com.au"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] text-white rounded-xl font-semibold text-sm hover:bg-[#252540] transition-all"
    >
      Staff Portal Login →
    </Link>
  );
}
```

---

## 10. Tech Stack Reference

All portals use a **consistent stack**:

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.x (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 4.x |
| Charts | Recharts 3.x |
| Maps | Leaflet + React-Leaflet |
| Backend/Auth | Firebase (Firestore, Auth, Storage) |
| Fonts | DM Sans (body), Playfair Display (headings), JetBrains Mono (numbers) |
| Icons | Inline SVG (no external dependency) |
| Deployment | Vercel (recommended) |

### Design Tokens (consistent across all portals)

```css
--bg-primary:     #faf9f7   /* warm cream — main background */
--bg-secondary:   #f0ede6   /* slightly darker — section backgrounds */
--text-primary:   #1a1a2e   /* dark navy — headings & body text */
--text-secondary: #4a4a6a   /* medium navy — secondary text */
--border-color:   #e8e4dd   /* warm border */
--accent-green:   #4ade80   /* success / compliant */
--accent-red:     #ef4444   /* error / expired / critical */
--accent-yellow:  #eab308   /* warning / expiring soon */
```

---

## 11. Troubleshooting

### `Module not found: 'leaflet'`
```bash
cd employee-ops && npm install leaflet react-leaflet @types/leaflet
```

### `Cannot find module 'recharts'`
```bash
cd admin-web && npm install recharts
```

### `Error: Firebase: No Firebase App named '[DEFAULT]'`
- Ensure `.env.local` exists and has valid Firebase config values
- Restart the dev server after adding env vars

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Sidebar doesn't appear on mobile
- Tap the hamburger menu (☰) in the top bar — it appears fixed at the top on mobile screens

### Fonts not loading
- The portals use Google Fonts via `next/font/google` — ensure internet access during build

### `next: command not found`
```bash
# Run with npx
npx next dev --port 3001
```

---

## Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] `npm install` run in all 4 portal directories
- [ ] `.env.local` files created and filled in
- [ ] Firebase project created (or emulator started)
- [ ] All 4 portals running on ports 3000–3003
- [ ] Login tested with demo credentials
- [ ] Verified role-based redirect (admin → 3001, employee → 3002, family → 3003)

---

*Generated as part of the Hansonian OS production-ready refactor — February 2026.*
