# 📘 Tesseract 2025 – Simple Manual

## ✅ Goal
Make the whole Marvel voting project fully working and ready to deploy.

---

## 1. Prepare Supabase (Backend)
- **Open Supabase**: https://supabase.com/dashboard/project/lwyxcndmbpotaegbzswh
- **Run the SQL**: Copy everything from `database/schema.sql`, paste in Supabase SQL Editor, hit Run.
- **Check tables**: Make sure `projects`, `votes`, `admins` exist.
- **Add an admin**:
  1. In Supabase Auth, create a user (example: `admin@tesseract.com`).
  2. Copy that user’s ID.
  3. Run this in SQL editor:
     ```sql
     INSERT INTO public.admins (user_id, is_admin)
     VALUES ('PASTE-USER-ID-HERE', true);
     ```

---

## 2. Set Environment Variables
- Copy `.env.example` ➜ `.env.local`
- Make sure it has:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://lwyxcndmbpotaegbzswh.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- Never expose the service role key in client code or Git.

---

## 3. Install Dependencies (one time per app)
In each folder run:
```bash
npm install
```
Folders to check:
- `shield-tesseract-access-portal`
- `avenger-vote-vault`
- `tesseract-hall-of-heroes`
- `furys-war-room-console`
- `hydra-glitch-hax` (optional)

---

## 4. Start Local Servers
Use separate terminals (or run one at a time). Suggested commands:
```bash
# Login portal
cd shield-tesseract-access-portal
npm run dev

# Voting page
cd ../avenger-vote-vault
npm run dev -- --port 8080

# Leaderboard
cd ../tesseract-hall-of-heroes
npm run dev -- --port 3005

# Admin console
cd ../furys-war-room-console
npm run dev -- --port 3006
```
If a port is busy, Next.js will pick another free port automatically.

---

## 5. Test Complete Flow
- **User test**:
  1. Visit `http://localhost:3002` (or whatever port shows in terminal).
  2. Sign up and log in.
  3. Go to voting page (`http://localhost:8080`), vote once.
  4. After voting you should land on Hall of Heroes and see the thank-you banner.

- **Admin test**:
  1. Log in with admin account.
  2. You should be redirected to `http://localhost:3006`.
  3. Unlock/lock projects, check stats.

- **Unauthorized test**: Try to open admin page with non-admin user → should redirect to Hydra error page.

---

## 6. Fix Common Issues
- **Build error about favicon**: Make sure `app/icon.png` exists or use SVG/PNG (no `.ico`).
- **Auth failing**: Confirm Supabase tables + admin entry are set.
- **Votes not updating**: Check RLS rules and make sure user is logged in.
- **Real-time not updating**: Ensure all apps use the same Supabase URL/key and terminals are running.

---

## 7. Deploy When Ready
Follow `DEPLOYMENT_CHECKLIST.md`:
- Confirm database and admin setup.
- Set env vars on hosting (Vercel, Netlify, etc.).
- Run `npm run build` in each app before deploying.

---

## 8. Keep Things Updated
- Update `working.md` if process changes.
- Monitor Supabase usage & logs.
- Keep service role key safe (server only).
- Share this manual with teammates.

---

**You now have a clear map from local setup to full deployment. Marvel power on!** ⚡
