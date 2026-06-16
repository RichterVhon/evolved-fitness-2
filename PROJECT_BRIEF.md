# Evolved Fitness 2.0 — Project Brief & Decision Log

> This document is the single source of truth for the project's goals, data model,
> tech stack, architecture, and conventions. It doubles as (a) the planning prompt for
> Claude Code and (b) the running decision log for the repository. Keep it updated as
> decisions change.

---

## 1. What we're building

A web application for a local gym, **Evolved Fitness 2.0**, with two audiences served by one codebase:

1. **Staff/Admin** — manage members, record in-person payments, process check-ins, view flagged (expiring) memberships, edit the public landing page content, and view business analytics with exportable reports.
2. **Customers (members)** — log in to view their own data: membership status, active pass, pass start/end dates, and their visit history.
3. **Anonymous walk-ins** — no account; staff simply record their daily payment as a transaction.

**Primary purpose:** portfolio piece demonstrating clean, modular, well-architected full-stack engineering. Secondary goal: actually deployable and usable by the real gym.

### Core domain rules (these drive the data model)
- A **one-time membership fee** makes someone a member. Membership does not expire.
- A **pass** is time-bound access (daily, monthly, 3-month, 6-month, 1-year). You must be a member to buy a non-daily pass. Passes are **non-stackable** (one active pass at a time).
- **Daily access** can be paid by members (cheaper rate) or non-members/walk-ins (higher rate).
- A **member who pays daily** is both a known identity *and* a payment event — this must produce both a visit record and a payment record.
- **Check-in:** a member types their membership ID; the system verifies they have an active, non-expired pass (or records a daily payment).
- **Payments are recorded in person only** — no online payment processing. Staff record a payment that already happened (cash/card at the desk).
- **Expiry alerts** ("flagged memberships") are computed on demand (passes expiring within 7 days), not stored.

---

## 2. Data model (ERD)

Seven entities. All tables use an internal surrogate primary key (`id`, UUID) distinct from any
human-facing identifier. All event tables carry timestamps. Editable content carries an audit trail
(`updated_by`, `updated_at`).

### Entities and key fields

**USER** — authentication & identity
- `id` (PK), `email` (unique), `password_hash`, `role` (`staff` | `customer`), `created_at`
- A staff user has no MEMBER profile; a customer user has exactly one.

**MEMBER** — gym-domain profile (1:1 with a customer USER)
- `id` (PK), `user_id` (FK → USER), `membership_id` (unique, human-facing, e.g. `EVF-2026-0001`, system-generated), `full_name`, `address`, `emergency_contact`, `joined_at`

**PLAN** — the configurable price list (editable by staff)
- `id` (PK), `name` (e.g. "Monthly", "6-Month"), `kind` (`membership` | `pass` | `daily`), `duration_days`, `price`, `is_member_rate` (bool, distinguishes member vs walk-in daily rate), `active` (bool)

**PAYMENT** — the universal money record (one row per peso earned)
- `id` (PK), `member_id` (FK → MEMBER, **nullable**: null = anonymous walk-in), `plan_id` (FK → PLAN), `type` (`new_membership` | `pass` | `daily_member` | `daily_walkin`), `walkin_tag` (e.g. "student", "regular"), `amount`, `paid_at`

**PASS** — time-bound access, created by a PAYMENT of type `pass`
- `id` (PK), `member_id` (FK → MEMBER), `plan_id` (FK → PLAN), `payment_id` (FK → PAYMENT), `start_date`, `end_date`, `created_at`

**VISIT** — attendance record for known members only
- `id` (PK), `member_id` (FK → MEMBER), `pass_id` (FK → PASS, **nullable**), `payment_id` (FK → PAYMENT, **nullable**), `checked_in_at`
- **Constraint:** exactly one of `pass_id` / `payment_id` is set. If the member entered on an active pass → `pass_id` set, `payment_id` null. If they paid daily → `payment_id` set, `pass_id` null. **This requires a DB-level check constraint; FK constraints alone can't enforce it.**

**CONTENT_BLOCK** — key-value store for editable landing-page content
- `id` (PK), `key` (unique, e.g. `hero_headline`, `gym_photo_1`), `value` (the text or an image URL), `type` (`text` | `richtext` | `image_url`), `updated_by` (FK → USER), `updated_at`
- Image files live in storage; the block stores the URL.

### Relationships
- USER 1—o1 MEMBER (a customer user has one member profile; staff users have none)
- MEMBER 1—o{ PAYMENT, PASS, VISIT
- PLAN 1—o{ PAYMENT, PASS
- PAYMENT 1—o1 PASS (a `pass`-type payment creates one pass; daily payments create none)
- USER 1—o{ CONTENT_BLOCK (last edited by)

### Modeling principles applied (rationale)
- **Entities vs events:** PAYMENT (money) and VISIT (attendance) are separate axes that
  sometimes coincide (member pays daily → both). Never merge them.
- **Surrogate keys:** internal `id` for all FKs; `membership_id` is for humans only.
- **Derive, don't store:** expiry "flags" are a query (`end_date` within 7 days), not a column.
- **Config in data, not code:** prices live in editable PLAN rows.
- **Audit editable data:** content blocks record who/when.

---

## 3. Tech stack (with rationale)

- **Language: TypeScript** end-to-end (front and back). Enables shared types across the stack;
  a schema change surfaces as a compile error on both ends.
- **Framework: Next.js (App Router).** One project for the server-rendered public landing page
  (good for SEO) and the app-like staff/customer dashboards. Most in-demand React meta-framework.
- **Database: PostgreSQL.** Robust relational default; the data is highly relational.
- **ORM: Prisma.** Schema-first; generates TypeScript types from the schema; handles migrations.
- **Auth: Auth.js (NextAuth).** Vetted library — **do not hand-roll auth/crypto.** Supports
  email/password + role-based access (staff vs customer).
- **Validation: Zod.** One schema yields both runtime validation and a static type.
- **Styling: Tailwind CSS** (optionally shadcn/ui for prebuilt components).
- **Deployment target:** Vercel + a free-tier Postgres host (Neon or Supabase).

---

## 4. Architecture & conventions

### Two zones
1. **`src/app/` — delivery layer (framework's rules).** Routing only. Pages and route handlers
   stay **thin**: receive request → call a feature → return response. No business logic here.
   - `src/app/(public)/` — landing page routes
   - `src/app/dashboard/` — staff + customer routes
   - `src/app/api/` — endpoint routes
2. **`src/features/`, `src/shared/`, `src/lib/` — your code (feature-based).**

### Feature-based structure
```
src/
  app/                  # routing only (Next.js owns this)
    (public)/
    dashboard/
    api/
  features/             # feature-local code; each owns its UI + logic + data
    members/
    passes/
    payments/
    visits/
    content/
    auth/
    reports/            # cross-cutting: reads payments + visits for analytics/CSV
  shared/               # Button, shared types, utils — used by many features
  lib/                  # Prisma client, Auth.js config — infrastructure
```

### Inside each feature folder (layered, one job per layer)
```
features/members/
  components/           # React UI (MemberCard, MemberForm)
  hooks/  (or actions/) # glue connecting UI to the service
  member.service.ts     # business logic & domain rules — knows NOTHING about Next.js/HTTP
  member.repository.ts  # the ONLY place that talks to the DB (Prisma)
  member.schema.ts      # Zod validation + derived types
```

### The rules that keep it clean (enforce these)
- **Dependencies point inward:** `app/` → `features/` → `shared/` + `lib/`. Never the reverse.
- **Features don't import from each other.** If `payments` needs something from `members`,
  move the shared thing down into `shared/`.
- **One-directional flow within a feature:** components → hooks → service → repository → DB.
  The UI never reaches past the service to the database.
- **Business logic is framework-independent.** A service file should make sense if lifted out
  of Next.js entirely (ports-and-adapters / clean-architecture spirit).
- **All DB access is in repositories.** No Prisma calls in services, components, or route handlers.
- **Validate at the boundary** with Zod before data reaches a service or the DB.

---

## 5. SCOPE OF THIS PLAN — the "walking skeleton"

Build the thinnest end-to-end slice that actually runs, proving the full architecture before
building breadth. **Build vertically (one feature, all layers) before horizontally (many features).**

### In scope for this first plan
1. **Project scaffold:** Next.js + TypeScript + Tailwind, correctly configured, with the
   two-zone folder structure above created (empty feature folders are fine).
2. **Database:** Postgres + Prisma connected. Define the **full schema for all seven entities**
   from section 2 (so the data foundation is complete), including the VISIT check constraint.
   Generate the initial migration.
3. **Auth:** Auth.js configured with email/password and the `staff` / `customer` role
   distinction. A way to protect routes by role.
4. **The `members` feature, end-to-end through every layer:**
   - `member.schema.ts` (Zod) — validation + types
   - `member.repository.ts` — Prisma CRUD for members
   - `member.service.ts` — business logic (e.g. system-generated `membership_id`, enforce
     that a customer USER and MEMBER are created together)
   - `hooks/` + `components/` — a MemberForm to create/edit a member and a MemberCard/list to view
   - Wired into a thin `app/dashboard/members/` route (staff-only)

### Explicitly OUT of scope for this first plan (later sessions)
- passes, payments, visits, content, reports features
- customer-facing dashboard
- public landing page
- analytics / CSV export
- file upload for content images

### Why this slice
`members` is the dependency root — passes, payments, and visits all reference a member, so
building it first unblocks everything else. It also exercises every architectural layer, so it
validates the whole pattern. Once proven and refined, subsequent features reuse the pattern in
this order: passes → payments → visits → reports → customer dashboard → public landing page.

---

## 6. What I want from Claude Code (plan mode)

Produce a step-by-step build plan for the walking skeleton in section 5 that:
- Respects every convention in section 4 (especially the layering and dependency rules).
- Sets up the full Prisma schema from section 2, not just the members table.
- Sequences the work sensibly (scaffold → DB/schema/migration → auth → members layers → route).
- Flags any decision points or trade-offs for my approval rather than silently choosing.
- Notes where I'll need to provide secrets/config (DB URL, auth secret) so I can do those steps
  myself rather than having them hard-coded.

Do not write application code until the plan is approved.
