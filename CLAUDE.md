# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

"Evolved Fitness 2.0" — a gym management web app (Next.js App Router + TypeScript). One codebase serves three audiences: staff/admin (manage members, payments, check-ins, content), customers (view their own membership/pass/visit data), and anonymous walk-ins (payment recorded by staff, no account). Full domain model, architecture rationale, and conventions live in `PROJECT_BRIEF.md` — read it before making structural decisions; it is the source of truth, not this file.

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build

npx prisma generate            # regenerate client after schema.prisma changes
npx prisma migrate dev --name <name>   # create + apply a migration
npx prisma db seed             # seed a staff user (needs SEED_STAFF_EMAIL/SEED_STAFF_PASSWORD in .env)
```

There is no lint script/config and no test runner wired up yet (Playwright is a devDependency but unused — no config or test files exist). Don't assume `npm run lint` or `npm test` work.

## Architecture

### Two zones (dependency direction is one-way: `app/` → `features/` → `shared/`/`lib/`)

- `src/app/` — routing only. Pages and route handlers stay thin: parse request → call a feature action/service → return. No business logic here.
- `src/features/<name>/` — each feature owns its full vertical slice:
  - `components/` — UI
  - `actions/` — Next.js Server Actions (`"use server"`), the only thing routes/components call
  - `<name>.service.ts` — business logic, framework-independent (no Next.js/Prisma imports)
  - `<name>.repository.ts` — the *only* place that talks to Prisma for that feature
  - `<name>.schema.ts` — Zod schemas + inferred types, validated at the action boundary
  - Flow is strictly one-directional: component → action → service → repository → DB.
- `src/shared/` — cross-feature UI/types/utils. `src/lib/` — infra (Prisma client, Auth.js config).
- Features must not import from each other; shared code moves down into `shared/`.

See `member.schema.ts` / `member.service.ts` / `member.repository.ts` / `actions/member.actions.ts` in `src/features/members/` as the reference implementation of this pattern — copy its shape for new features (passes, payments, visits, content, reports are still empty/scaffolded).

### Auth.js v5 (beta) — split config gotcha

- `src/lib/auth.config.ts` is **edge-safe** (no Prisma, no Node-only modules) — it's the config Proxy runs with.
- `src/lib/auth.ts` extends it with the Prisma-backed Credentials provider and is used everywhere else.
- Session typing via module augmentation (`src/lib/auth.d.ts`) was unreliable in practice; route/action code instead imports the `AppSession` type and `getSession()` helper exported from `src/lib/auth.ts`.
- Route protection lives in `src/proxy.ts`, not `middleware.ts` — this Next.js version renamed the middleware convention to "proxy" (see `AGENTS.md`). It reads `req.auth as AppSession` and redirects by role/path.

### Prisma v7 — non-obvious setup

- Generated client output is `src/generated/prisma/` (gitignored) — import from `@/generated/prisma/client`, not `@/generated/prisma`.
- `PrismaClient` requires a driver adapter now: `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })` (see `src/lib/prisma.ts`). There is no adapter-less initialization.
- Connection config lives in `prisma.config.ts`, not a `url` in `schema.prisma`'s datasource block.
- The `Visit` table's "exactly one of `pass_id`/`payment_id`" rule is a DB check constraint added by hand in the migration SQL — Prisma's schema language can't express it. Any future migration touching `visits` must preserve that raw SQL.

### Data model

Seven entities — `User`, `Member`, `Plan`, `Payment`, `Pass`, `Visit`, `ContentBlock` — defined in `prisma/schema.prisma`. Key domain rules (see `PROJECT_BRIEF.md` §1–2 for full rationale): membership fee ≠ expiring, passes are non-stackable and time-bound, `Payment` (money) and `Visit` (attendance) are separate axes that sometimes coincide, expiry "flags" are computed on read rather than stored, and pricing lives in editable `Plan` rows rather than code.

### Current build state

The "walking skeleton" (scaffold, full schema, Auth.js, the `members` feature end-to-end) is done. The public marketing site (`src/app/(public)/`) is built out: home, equipment, facilities, plans, and trainers pages, sharing a `Navbar`/`Footer`/`PageHeader` layout, with `HeroCarousel`, `EquipmentGrid`, `FacilityGallery`, `TrainerCarousel`, and `PlansSection` components in `src/features/content/components/`. Content is currently sourced from static TypeScript modules in `src/features/content/data/` (`equipment.ts`, `plans.ts`, `trainers.ts`) rather than the `ContentBlock` table — `src/features/content/actions/` is still empty, so there is no DB-backed read path or admin editing yet for this content. `passes`, `payments`, `visits`, `reports`, and the customer-facing dashboard remain empty stubs — when building them, follow the same layered pattern as `members` and wire them in that dependency order (passes → payments → visits → reports → customer dashboard), since each depends on the one before it. Migrating the public site's static data onto `ContentBlock` (service/repository/actions) is the natural next step for the `content` feature.
