# Kiv — Product Requirements Document (PRD)

**Version:** 1.0
**Date:** May 2026
**Product:** Kiv
**Tagline:** Check in with yourself
**Owner:** SAMKIEL Studio
**Repo:** github.com/SAMKIELDEV/kiv
**Platform:** Web app (Next.js)
**Status:** MVP

---

## 1. Overview

Kiv is a micro-journaling and daily check-in web app. It gives users a simple, private space to log how they're doing each day — a mood, a thought, a moment. No pressure. Under 2 minutes. Every day.

Kiv is the first product under SAMKIEL Studio. Authentication is handled entirely by SAMKIEL ID via the `@samkielauthsdk` package. Kiv owns its own MongoDB database for product-specific data only.

---

## 2. Problem

People want to reflect on their days but existing journaling apps are either too complex, too feature-heavy, or feel like homework. There is no truly minimal, intentional daily check-in tool that respects the user's time and privacy.

---

## 3. Goal

Ship a clean, working MVP of Kiv that allows users to:
- Authenticate via SAMKIEL ID (no separate Kiv account)
- Check in daily with a mood + optional note
- View their history in a calendar view
- Track their current and longest streak

---

## 4. Target User

Anyone who wants a low-friction way to be more self-aware. Students, young professionals, creatives. Global — no specific regional focus.

---

## 5. Design Principles

- **Intentional** — every element earns its place
- **Private by default** — no social, no sharing, no ads
- **Fast** — check-in takes under 2 minutes
- **Calm** — UI feels minimal, never anxious or cluttered
- **Consistent with SAMKIEL** — dark-first, electric lime accent, bold typography

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (latest stable) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Toasts | Sonner |
| Auth | @samkiel/authsdk |
| Database | MongoDB (Kiv-owned) |
| Hosting | Vercel |
| Domain | kiv.app (or usekiv.com) |

---

## 7. Authentication Architecture

Kiv uses SAMKIEL ID for all authentication. Kiv **never** handles passwords, registration logic, or session management directly.

### How it works

```
User visits kiv.app → not authenticated
→ Redirected to /login
→ Kiv renders <LoginButton redirectTo="/app" /> from @samkielauthsdk
→ User enters credentials
→ SDK calls POST id.samkiel.tech/login
→ Receives accessToken (JWT) + refreshToken
→ Tokens stored as httpOnly cookies by SDK
→ User redirected to /app
→ Kiv middleware verifies JWT on every protected route
→ Extracts { userId, email, name } from JWT payload
→ userId used as foreign key for all MongoDB operations
```

### JWT Payload (from SAMKIEL ID)

```typescript
interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}
```

Access token expires in 15 minutes. Refresh token expires in 30 days. The SDK handles token rotation automatically.

### What Kiv owns vs SAMKIEL ID

| Data | Owned by |
|---|---|
| Password, email verification | SAMKIEL ID |
| userId, email, name | SAMKIEL ID (read via JWT) |
| Check-in entries | Kiv MongoDB |
| User cache (name, email) | Kiv MongoDB |
| Streaks | Kiv MongoDB (computed from entries) |

---

## 8. Database — MongoDB (Kiv)

Kiv has its own MongoDB instance. It does not share a database with SAMKIEL ID.

### `users` collection (lightweight cache)

Populated on first login. Updated if name/email changes.

```typescript
{
  _id: ObjectId,
  userId: string,       // from SAMKIEL ID JWT — primary reference
  name: string,         // cached from JWT
  email: string,        // cached from JWT
  createdAt: Date
}
```

### `entries` collection

One document per user per calendar day.

```typescript
{
  _id: ObjectId,
  userId: string,          // from SAMKIEL ID JWT
  date: string,            // "YYYY-MM-DD" — unique per userId
  mood: number,            // 1–5
  prompt: string,          // the prompt shown that day
  promptResponse: string,  // nullable
  note: string,            // nullable
  createdAt: Date
}
```

**Index:** `{ userId: 1, date: 1 }` — unique compound index. Enforces one entry per user per day.

---

## 9. Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing | No |
| `/login` | Login | No (redirect to /app if already authed) |
| `/app` | Dashboard | Yes |
| `/app/history` | History (calendar) | Yes |
| `/app/entry/[date]` | Entry Detail | Yes |
| `/app/settings` | Settings | Yes |

---

## 10. Core Features (MVP)

### 10.1 Landing Page (`/`)
- Tagline: *"Check in with yourself"*
- Brief product description
- CTA: "Get started" → `/login`
- Minimal — no feature lists, no marketing fluff

### 10.2 Login Page (`/login`)
- Renders `<LoginButton redirectTo="/app" />` from `@samkielauthsdk`
- If already authenticated → redirect to `/app`
- No separate signup page — SAMKIEL ID handles registration

### 10.3 Middleware (`middleware.ts`)
- All `/app/*` routes are protected
- Verify JWT using `@samkielauthsdk` middleware
- On invalid/expired token → redirect to `/login`
- On first valid login → upsert user record in Kiv `users` collection

### 10.4 Dashboard (`/app`)

**If user has NOT checked in today:**
- Greeting: *"Good [morning/afternoon/evening], [name]"*
- Streak counter (current streak)
- Check-in form:
  1. **Mood selector** — 5 options (😔 😕 😐 🙂 😄), single select
  2. **Daily prompt** *(optional)* — rotating prompt with text input
  3. **Note** *(optional)* — free-write textarea, no minimum
  4. **Submit button** — "Check in"
- On submit:
  - Save entry to MongoDB
  - Show confirmation state — warm, affirming
  - Update streak display

**If user HAS checked in today:**
- Show today's entry (read-only)
- Mood, prompt response, note displayed
- Streak counter
- Link to history

### 10.5 Streak Logic
- **Current streak** — consecutive days with an entry up to and including today
- **Longest streak** — all-time record
- Streak breaks if a full calendar day is missed
- Computed from `entries` collection on load — no separate streak collection for MVP
- Both values displayed on dashboard

### 10.6 History (`/app/history`)
- Monthly calendar view
- Days with entries marked with a visual indicator
- Navigate between months (prev/next arrows)
- Click any marked day → `/app/entry/[date]`
- Days without entries are not clickable

### 10.7 Entry Detail (`/app/entry/[date]`)
- Displays: date, mood, prompt shown, prompt response (if answered), note (if written)
- Read-only — no editing after submission
- Back button → `/app/history`
- Returns 404 if entry doesn't exist or doesn't belong to authenticated user

### 10.8 Settings (`/app/settings`)
- Display name (from JWT / Kiv user cache)
- Email (from JWT — read-only)
- "Manage account" → link to `id.samkiel.tech` for password changes
- **Delete Kiv data** — deletes all entries and user record from Kiv MongoDB only
  - Does NOT delete the SAMKIEL ID account
  - Requires confirmation before deletion

---

## 11. Daily Prompts

One prompt per day, same for all users, based on day of year (deterministic rotation). Stored as a static array.

```typescript
const prompts = [
  "What's one thing on your mind?",
  "What made you smile today?",
  "What's one thing you're looking forward to?",
  "What's one thing you want to let go of today?",
  "What are you grateful for right now?",
  "What drained your energy today?",
  "What did you do just for yourself today?",
  "What's something you learned today?",
  "How did you treat yourself today?",
  "What's one word to describe your day?",
  "What's something you're proud of this week?",
  "What would have made today better?",
  "Who made a positive impact on your day?",
  "What's something you've been avoiding?",
  "What does your body need right now?",
];

// Usage
const prompt = prompts[dayOfYear % prompts.length];
```

---

## 12. API Routes (Next.js)

All API routes require a valid JWT verified via `@samkielauthsdk` middleware.

| Method | Route | Description |
|---|---|---|
| POST | `/api/entries` | Create today's entry |
| GET | `/api/entries` | Get all entries for the authenticated user |
| GET | `/api/entries/[date]` | Get a single entry by date |
| GET | `/api/entries/streak` | Get current + longest streak |
| GET | `/api/me` | Get cached user info from Kiv DB |
| DELETE | `/api/me` | Delete all user data from Kiv DB |

---

## 13. Design Tokens

```css
--background: #0A0A0A;
--accent: #E8FF47;         /* electric lime — use sparingly */
--text-primary: #FFFFFF;
--text-secondary: #888888;
--surface: #111111;
--border: #222222;
```

**Typography:**
- Syne or Cabinet Grotesk
- **Excluded:** Inter, Roboto, Space Grotesk

---

## 14. Out of Scope (MVP)

Do not build these in v1:

- Push notifications / reminders
- AI-generated insights
- Tags or categories
- Data export
- Premium / paid tier
- Social features or sharing
- Dark/light mode toggle (dark by default)
- Native mobile app
- OAuth redirect flow (SAMKIEL ID v2 concern)
- Email notifications

---

## 15. Folder Structure

```
/app
  /app                      → authenticated routes
    /history
      page.tsx
    /entry
      /[date]
        page.tsx
    /settings
      page.tsx
    page.tsx                → dashboard
    layout.tsx              → auth guard layout
  /login
    page.tsx
  /api
    /entries
      route.ts              → GET, POST
      /[date]
        route.ts            → GET
      /streak
        route.ts            → GET
    /me
      route.ts              → GET, DELETE
  page.tsx                  → landing
  layout.tsx                → root layout
/components
  /ui                       → reusable primitives (Button, Input, etc.)
  /checkin                  → check-in form components
  /calendar                 → history calendar components
  /streak                   → streak display components
/lib
  /auth                     → @samkielauthsdk helpers + middleware wrappers
  /db                       → MongoDB connection + collection helpers
  /prompts                  → daily prompt rotation logic
  /utils                    → shared utilities
/types
  index.ts                  → shared TypeScript interfaces
middleware.ts               → Next.js route protection
```

---

## 16. Environment Variables

```env
MONGODB_URI=
SAMKIEL_ID_API_URL=https://id.samkiel.tech
JWT_SECRET=                     # same secret used by SAMKIEL ID
NEXT_PUBLIC_APP_URL=https://kiv.app
```

---

## 17. Build Order (for Claude Code)

Build in this exact order — do not skip ahead:

1. Project init — Next.js, TypeScript strict, Tailwind v4, all dependencies
2. MongoDB connection — `/lib/db`
3. Auth integration — `@samkielauthsdk`, middleware, protected layout
4. User cache — upsert to `users` collection on first login
5. Check-in form — the core of the product, build this before anything else
6. Entry API routes — POST + GET
7. Dashboard page — form + today's entry display
8. Streak logic — `/api/entries/streak`
9. History calendar — `/app/history`
10. Entry detail — `/app/entry/[date]`
11. Landing page — minimal, last
12. Settings page — last before deploy
13. Deploy to Vercel — ship early

---

## 18. CLAUDE.md

```markdown
# Kiv

**Tagline:** Check in with yourself
**Owner:** SAMKIEL Studio — samkiel.tech
**Repo:** github.com/SAMKIELDEV/kiv

## Stack
- Next.js (latest stable), TypeScript strict mode
- Tailwind CSS v4, Framer Motion, Lucide React, Sonner
- Auth: @samkielauthsdk — NEVER build custom auth, never touch passwords
- Database: MongoDB (Kiv-owned, completely separate from SAMKIEL ID DB)
- Hosting: Vercel

## What this is
Kiv is a micro-journaling web app. Users check in daily with a mood and optional note.
Simple, private, intentional.

## Core loop
Login (via SAMKIEL ID) → Check in daily (mood + optional note) → View history → Track streak

## Auth
- All auth via @samkielauthsdk
- JWT payload: { userId, email, name, iat, exp }
- Use userId as foreign key for ALL MongoDB operations
- Protected routes: all /app/* — handled in middleware.ts
- Use <LoginButton redirectTo="/app" /> from SDK — never build login forms manually

## Database — MongoDB (Kiv only)
Two collections:
- users: { userId, name, email, createdAt } — cache from JWT, upsert on login
- entries: { userId, date (YYYY-MM-DD), mood (1-5), prompt, promptResponse, note, createdAt }
- Compound unique index on { userId, date } — one entry per user per day, enforced at DB level

## Design
- Background: #0A0A0A
- Accent: #E8FF47 (electric lime) — sparingly, CTAs and highlights only
- Font: Syne or Cabinet Grotesk — NO Inter, Roboto, Space Grotesk
- Dark by default, no theme toggle
- Mobile responsive from day one

## Rules
- One check-in per calendar day — read-only after submission, no editing
- All entries private — no social features whatsoever
- Build check-in form first — it is the core of the product
- Deploy to Vercel from day one, iterate in production

## Key references
- Full spec: PRD.md
- SAMKIEL ID API base: https://id.samkiel.tech
- SAMKIEL ID repo: https://github.com/SAMKIELDEV/SAMKIELID
```

---

*Kiv — SAMKIEL Studio — 2026*
