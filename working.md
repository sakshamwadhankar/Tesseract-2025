# 🛠️ Tesseract 2025 Working Process

## Overview
- **Project name**: `Tesseract 2025`
- **Theme**: Marvel-inspired, multi-app Next.js/Vite monorepo
- **Primary goal**: Secure, Supabase-backed voting platform with admin controls and real-time leaderboards
- **Core directories**:
  - `shield-tesseract-access-portal/` – Authentication portal (Next.js)
  - `avenger-vote-vault/` – Voter experience (Vite)
  - `tesseract-hall-of-heroes/` – Thank-you + leaderboard (Next.js)
  - `furys-war-room-console/` – Admin dashboard (Next.js)
  - `hydra-glitch-hax/` – Access denied/error page (Vite)
  - `tessellation-vote-portal/` – Landing/home (static or existing)
  - `lib/`, `hooks/`, `components/` – Shared Supabase integration utilities
  - `database/schema.sql` – Supabase schema & policies
  - `SETUP_GUIDE.md`, `DEPLOYMENT_CHECKLIST.md` – Documentation assets

## Environment Configuration
- Copy `.env.example` ➜ `.env.local` at repo root
- Required keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` *(server-side only)*
- Never expose the service role key to client code

## Backend (Supabase) Setup
1. Open Supabase dashboard: `https://supabase.com/dashboard/project/lwyxcndmbpotaegbzswh`
2. Run `database/schema.sql` in SQL Editor to create:
   - `projects` table (project catalog + unlock control)
   - `votes` table (enforces one vote/user/project)
   - `admins` table (auth-based admin whitelist)
   - RLS policies for secure CRUD and leaderboard reads
3. (Optional) Insert seed projects
4. Create admin user via Supabase Auth ➜ add UUID to `admins`

## Shared Utilities
- `lib/supabase.ts` – Client + admin Supabase instances
- `lib/auth-utils.ts` – Sign in/out, admin check, password resets
- `lib/voting-utils.ts` – Vote casting, leaderboard aggregation
- `lib/admin-utils.ts` – Project management, stats, admin toggles
- `hooks/useSupabase.tsx` – React hooks for auth, projects, leaderboard, real-time votes
- `components/VotingIntegration.tsx` – Example handlers for wiring utility functions into existing UI
- `scripts/quick-integrate.js` – Vanilla JS bootstrapper for non-React pages

## Development Workflow
### 1. Install Dependencies
Run inside each sub-app before development:
```bash
npm install
```

### 2. Start Development Servers
Recommended ports (adjust as needed):
- `shield-tesseract-access-portal`: `npm run dev` (defaults to 3000, falls back if in use)
- `avenger-vote-vault`: `npm run dev -- --port 8080`
- `tesseract-hall-of-heroes`: `npm run dev -- --port 3005`
- `furys-war-room-console`: `npm run dev -- --port 3006`
- `hydra-glitch-hax`: `npm run dev -- --port 3007`

### 3. Local Testing Sequence
- Launch all relevant apps
- Verify `.env.local` is loaded for each Next.js instance
- Ensure Supabase schema + admin users exist (otherwise auth/voting flows break)

## Functional Flows
### User Flow (Public)
1. Navigate to `shield-tesseract-access-portal`
2. Sign up / Log in ➜ redirected to `avenger-vote-vault`
3. Vote on unlocked projects ➜ single vote enforced by database
4. Redirected to `tesseract-hall-of-heroes?thank=1` with thank-you banner + real-time leaderboard

### Admin Flow
1. Admin logs in via `shield-tesseract-access-portal`
2. Redirect to `furys-war-room-console`
3. Manage `projects` (lock/unlock, inspect vote stats)
4. Monitor real-time voting activity and totals

### Error Handling
- Unauthorized admin access ➜ redirect to `hydra-glitch-hax`
- Vote errors handled in `lib/voting-utils.ts` (`castVote` alerts, duplicate vote guard)

## Testing Checklist
- **Authentication**: Signup ➜ email verification (optional), login, logout
- **Voting**: One vote per project, duplicate attempt triggers warning
- **Leaderboard**: Real-time updates on `tesseract-hall-of-heroes`
- **Admin Controls**: Lock/unlock toggles, stats refresh, access restrictions
- **RLS**: Attempt restricted operations to confirm policy enforcement (e.g., non-admin update rejection)

## Deployment Process
Refer to `DEPLOYMENT_CHECKLIST.md`, highlights:
- Confirm Supabase tables/policies/admins
- Validate `.env` values in hosting platform (Vercel/Netlify/etc.)
- Build commands: `npm run build` per app
- Post-deploy smoke tests: auth, vote submission, leaderboard, admin toggles, error page routing

## Maintenance Tips
- Track background commands with `npm run dev`
- Monitor Supabase dashboard for auth logs and policy violations
- Keep `lib/` utilities as single source of truth for Supabase interactions
- Update favicons via `app/icon.png` to avoid ICO parsing issues (Next.js 15/Turbopack)
- Document new workflows directly in this `working.md`

## Quick Troubleshooting
- **Build error: ICO decode** ➜ remove problematic `favicon.ico`, use `icon.png`
- **Auth error** ➜ ensure Supabase schema and admin entries exist
- **Vote not registered** ➜ check RLS policy + ensure user authenticated
- **Real-time updates missing** ➜ verify `supabase.channel(...)` subscriptions in `hooks/useSupabase.tsx`
- **Port conflict** ➜ specify custom port with `--port` flag during `npm run dev`

---
Maintained by the Tesseract engineering team. Update this document whenever processes change.
