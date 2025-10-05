-- Tesseract 2025 Database Schema
-- Run this in Supabase SQL Editor

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id SERIAL PRIMARY KEY,
  team_name TEXT NOT NULL,
  project_url TEXT NOT NULL,
  is_unlocked BOOLEAN DEFAULT false
);

-- Votes table (1 user = 1 vote per project)
CREATE TABLE IF NOT EXISTS public.votes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Admins table
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Projects: Everyone can read
CREATE POLICY "projects_select_all"
ON public.projects
FOR SELECT
TO public
USING (true);

-- Projects: Only admins can update (unlock/lock)
CREATE POLICY "projects_update_admin_only"
ON public.projects
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins a
    WHERE a.user_id = auth.uid() AND a.is_admin = true
  )
);

-- Votes: Users can insert their own votes
CREATE POLICY "votes_insert_own"
ON public.votes
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.votes v
    WHERE v.user_id = auth.uid() AND v.project_id = votes.project_id
  )
);

-- Votes: Everyone authenticated can read (for leaderboard)
CREATE POLICY "votes_select_all"
ON public.votes
FOR SELECT 
TO authenticated
USING (true);

-- Admins: Only admins can read admins table
CREATE POLICY "admins_select_admin_only"
ON public.admins
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins a
    WHERE a.user_id = auth.uid() AND a.is_admin = true
  )
);

-- Sample Projects Data
INSERT INTO public.projects (team_name, project_url, is_unlocked)
VALUES
  ('Team Stark Industries', 'https://example.com/team-stark', false),
  ('Team Captain America', 'https://example.com/team-cap', false),
  ('Team Thor Asgard', 'https://example.com/team-thor', false),
  ('Team Black Widow', 'https://example.com/team-widow', false),
  ('Team Hulk Smash', 'https://example.com/team-hulk', false),
  ('Team Hawkeye', 'https://example.com/team-hawkeye', false)
ON CONFLICT DO NOTHING;

-- To add an admin (replace with actual user UUID from Supabase Auth):
-- INSERT INTO public.admins (user_id, is_admin) VALUES ('<YOUR-ADMIN-UUID>', true);
