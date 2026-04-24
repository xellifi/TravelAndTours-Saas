# mywebpages (jorickz-travel)

A Next.js 16 multi-tenant SaaS landing-page builder for small businesses
(travel agencies, restaurants, gyms, etc.). Each tenant gets a public landing
page at `/[slug]` with services, bookings, inquiries, and Filipino-friendly
payments (GCash, Maya, bank transfer).

## Stack

- **Framework:** Next.js 16.2.4 (App Router, Turbopack), React 19
- **Styling:** Tailwind CSS v4 (no `tailwind.config.*` — uses `@theme inline`
  in `src/app/globals.css`)
- **Auth + DB:** Supabase SSR (`@supabase/ssr`)
- **Font:** Inter via `next/font/google` (loaded in `src/app/layout.tsx`)
- **Icons:** Font Awesome 6 from cdnjs (loaded in `<head>`)

## Layout / Conventions

- Source code lives under `src/`
  - `src/app/...` — routes (App Router)
  - `src/app/[slug]/page.tsx` — public business landing page
  - `src/app/dashboard/...` — auth-protected admin area
  - `src/modules/templates/...` — landing-page templates per business type
    (Travel, Restaurant, Fitness, etc.) wrapped by `TemplateRenderer`
  - `src/modules/landing/...` — shared client widgets (BookingForm,
    InquiryForm)
  - `src/components/` — small reusable UI (`SubmitButton`, `Alert`)
  - `src/lib/format.ts` — formatting helpers (peso, price ranges)
  - `src/utils/supabase/{client,server}.ts` — Supabase factories
- Server Actions live next to the route they belong to
  (e.g. `src/app/dashboard/services/actions.ts`).
- Forms that need pending state and inline errors use the pattern:
  `useActionState` + `<SubmitButton />` (spinner) + `<Alert />`.

## Environment

Replit secrets used at build & runtime:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; required by `src/utils/supabase/admin.ts` (`createAdminClient()`) for admin pages and admin server actions. Bypasses RLS. Never imported from a client component. Must also be set in Vercel.

## Admin pages & RLS

The `public.users` table has RLS that only lets a user read their own row.
Admin pages (`/admin`, `/admin/users`, `/admin/businesses`) therefore use
`createAdminClient()` (service-role) for SELECT queries instead of the SSR
client. This is safe because `src/app/admin/layout.tsx` redirects any
non-admin to `/dashboard` before these pages render. The `public.users`
table also has an `email` column (mirrored from `auth.users` on signup) that
the admin pages select directly.

`next.config.ts` derives the Supabase hostname from `NEXT_PUBLIC_SUPABASE_URL`
to allow `next/image` to optimize images served from Supabase Storage.

## Workflows

- **Start application:** `npm run dev` (Next.js dev server on `0.0.0.0:5000`)
- The dev server is bound to `0.0.0.0:5000` in `package.json`'s `dev` script.
- `start` is left as plain `next start` for Vercel.
- Replit dev origins are whitelisted in `next.config.ts → allowedDevOrigins`.

If a restart fails with `EADDRINUSE: address already in use 0.0.0.0:5000`,
kill stale `next dev` / `next-server` processes and restart the workflow.

## Database

The schema lives in Supabase. Migrations checked into the repo as `.sql` files:

- `payment_settings_migration.sql` — `payment_settings` table for
  GCash/Maya/Bank fields per business.
- `services_image_pricing_migration.sql` — adds `image_url`, `price_min`,
  `price_max` to `services`. Run this before redeploying so the new service
  card design has data to display. Backward compatible: old `price` column is
  still populated by the dashboard form.
- `hero_images_migration.sql` — adds `hero_images TEXT[]` to `businesses`.
  Used by `/dashboard/hero-images` (max 5 photos, 100&nbsp;KB each, uploaded
  to the public `images` bucket) and rendered by `HeroSlideshow` in
  `TravelTemplate` with a clockwise rotation animation defined in
  `globals.css` (`hero-spin-in` / `hero-spin-out`).

> **Run new migrations in the Supabase SQL editor.**

### Known Supabase pitfall

The `users` table policy `"Admins can view all profiles"` previously caused
infinite recursion. It was replaced with a `SECURITY DEFINER` helper
`is_admin()` referenced by the policy.

## Deployment

The user deploys to **Vercel** from GitHub. Replit is the dev environment.
Do **not** add Replit-specific code paths (port pinning, etc.) to anything
that runs in production.

## Recent work

- Mobile-optimized owner dashboard: added `src/app/dashboard/MobileNav.tsx`
  client component with a slide-out drawer, top app bar, and bottom tab bar
  (Flutter/native-app feel). Desktop sidebar still rendered at `lg:` breakpoint.
- Mobile-optimized admin dashboard: top bar now uses icon-only buttons on
  small screens with safe-area insets.
- PWA: added `src/app/dashboard/manifest.ts` (in addition to the existing
  `[slug]` and `admin` manifests). Service worker (`public/sw.js`) bumped to
  `v2` and now skips `/auth/*`, `/api/*`, `/_next/data/*`, RSC payloads, and
  Next.js server actions to avoid breaking auth and mutations.
- Migrated to Replit dev environment while preserving Vercel production.
- Refactored Settings page to client forms with `useActionState`.
- Added bookings CSV export (`/dashboard/bookings/export`).
- Redesigned `TravelTemplate`:
  - Removed the white ring on the logo.
  - Filled the previously empty right-side hero column with a featured
    image plus floating trust + payment cards.
  - Service cards now show an image and a price **range** (`From ₱X` /
    `₱X – ₱Y`) instead of a single price.
  - Split the contact section into a dedicated **Book a Service** section
    (with a rich green panel: trust points + operating hours) and a
    standalone **Contact Us** section (address, phone, email, socials,
    inquiry form).
- Performance:
  - Switched Inter to `next/font/google` (no more render-blocking font CDN).
  - Removed `background-attachment: fixed` from `.mesh-bg` (huge
    repaint cost on scroll).
  - Parallelized the Supabase queries in `src/app/[slug]/page.tsx`
    with `Promise.all` and added ISR (`revalidate = 60`).
  - Added `sizes` props to `next/image` usages and configured
    `images.remotePatterns` so Supabase-hosted images are optimized.

## Conventions for the agent

- Speak to the (non-technical) user in plain language. Currency is **₱**.
- Never delete migrations — append new `.sql` files instead.
- Don't introduce new npm packages without an obvious need.
- Keep templates inside `src/modules/templates/` self-contained.
