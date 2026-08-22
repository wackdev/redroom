-- ============================================================================
-- WHYNOTUPSC / REDROOM — COMPLETE PRODUCTION DATABASE SCHEMA
-- Platforms: Supabase PostgreSQL 15+ (Compatible with Vercel & GitHub Actions)
-- Instructions: Paste and execute in the Supabase SQL Editor.
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CORE CADET DATA STRUCTURES
-- ============================================================================

-- Cadet Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  target_year INT DEFAULT 2026,
  optional_subject TEXT,
  daily_goal_hours NUMERIC(4,1) DEFAULT 6.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Test Results & Scorecards
CREATE TABLE IF NOT EXISTS public.test_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  score NUMERIC(6,2) DEFAULT 0,
  max_score NUMERIC(6,2) DEFAULT 200,
  correct INT DEFAULT 0,
  wrong INT DEFAULT 0,
  skipped INT DEFAULT 0,
  attempted INT DEFAULT 0,
  total INT DEFAULT 0,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PYQs Static & Dynamic Bank
CREATE TABLE IF NOT EXISTS public.pyqs (
  id BIGSERIAL PRIMARY KEY,
  year INT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT,
  subtopic TEXT,
  paper TEXT DEFAULT 'GS-1',
  question TEXT NOT NULL,
  important BOOLEAN DEFAULT false,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer VARCHAR(2),
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'Medium',
  concept_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cadet PYQ Completed Progress
CREATE TABLE IF NOT EXISTS public.user_pyq_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pyq_id BIGINT REFERENCES public.pyqs(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_pyq_unique UNIQUE (user_id, pyq_id)
);

-- Granular PYQ Attempt History & Error Diagnosis
CREATE TABLE IF NOT EXISTS public.pyq_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pyq_id BIGINT REFERENCES public.pyqs(id) ON DELETE CASCADE,
  selected_option VARCHAR(2) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INT DEFAULT 0,
  mistake_type TEXT,
  notes TEXT,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

-- Syllabus Topic Tracker
CREATE TABLE IF NOT EXISTS public.syllabus_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT true,
  confidence_rating INT DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_syllabus_topic_unique UNIQUE (user_id, topic_id)
);

-- Adaptive Daily Study Plans
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  target_hours NUMERIC(4,1) DEFAULT 6.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_date_plan_unique UNIQUE (user_id, plan_date)
);

-- Study Tasks associated with Daily Plans
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  hours NUMERIC(4,1) DEFAULT 1.0,
  completed BOOLEAN DEFAULT false,
  task_type TEXT DEFAULT 'Study',
  priority TEXT DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cadet Study Notes & Journals
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Spaced Repetition (SM-2 Algorithm) Items
CREATE TABLE IF NOT EXISTS public.revision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  upsc_importance TEXT DEFAULT 'High',
  repetition_count INT DEFAULT 0,
  ease_factor NUMERIC(4,2) DEFAULT 2.5,
  interval_days INT DEFAULT 1,
  last_reviewed_at TIMESTAMPTZ,
  next_review_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_revision_topic_unique UNIQUE (user_id, topic_id)
);

-- ============================================================================
-- 2. CHILL ZONE (GAMING & REACTION ARENA)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  scoring_direction TEXT DEFAULT 'DESCENDING',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_slug TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ DEFAULT now(),
  duration_ms INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_slug TEXT NOT NULL,
  session_id UUID REFERENCES public.game_sessions(id) ON DELETE SET NULL,
  score NUMERIC NOT NULL,
  score_display TEXT,
  duration_ms INT DEFAULT 0,
  accuracy NUMERIC,
  moves INT,
  streak INT,
  difficulty TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.multiplayer_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_slug TEXT NOT NULL DEFAULT 'quick-duel',
  room_code TEXT NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 minutes')
);

CREATE TABLE IF NOT EXISTS public.multiplayer_room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.multiplayer_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'joined',
  score NUMERIC,
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. ADMIN, ROLES & GOVERNANCE
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role_type') THEN
    CREATE TYPE admin_role_type AS ENUM (
      'SUPER_ADMIN',
      'ADMIN',
      'CONTENT_ADMIN',
      'MODERATOR',
      'ANALYST'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role admin_role_type DEFAULT 'ANALYST',
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT,
  admin_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  is_beta BOOLEAN DEFAULT false,
  target_audience TEXT DEFAULT 'ALL',
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.system_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT DEFAULT 'INFO',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'SYSTEM',
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'NORMAL',
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 4. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_test_results_user ON public.test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_pyqs_subject_year ON public.pyqs(subject, year);
CREATE INDEX IF NOT EXISTS idx_user_pyq_progress_user ON public.user_pyq_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_progress_user ON public.syllabus_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_date ON public.study_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_date ON public.study_tasks(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_notes_user_subject ON public.notes(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_revision_items_user_date ON public.revision_items(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_game_scores_slug_score ON public.game_scores(game_slug, score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_user ON public.game_scores(user_id, game_slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_created_at ON public.activity_events(created_at DESC);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pyq_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_broadcasts ENABLE ROW LEVEL SECURITY;

-- Profiles: Cadets manage their own profile
DROP POLICY IF EXISTS "Users can view and manage their own profile" ON public.profiles;
CREATE POLICY "Users can view and manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Test Results: Cadets view/insert own test scores
DROP POLICY IF EXISTS "Users manage their own test results" ON public.test_results;
CREATE POLICY "Users manage their own test results" ON public.test_results
  FOR ALL USING (auth.uid() = user_id);

-- PYQs: Public read access for all cadets
DROP POLICY IF EXISTS "Public read access for PYQs" ON public.pyqs;
CREATE POLICY "Public read access for PYQs" ON public.pyqs
  FOR SELECT USING (true);

-- User PYQ Progress: Cadets manage own progress
DROP POLICY IF EXISTS "Users manage their own PYQ progress" ON public.user_pyq_progress;
CREATE POLICY "Users manage their own PYQ progress" ON public.user_pyq_progress
  FOR ALL USING (auth.uid() = user_id);

-- Syllabus Progress: Cadets manage own syllabus progress
DROP POLICY IF EXISTS "Users manage their own syllabus progress" ON public.syllabus_progress;
CREATE POLICY "Users manage their own syllabus progress" ON public.syllabus_progress
  FOR ALL USING (auth.uid() = user_id);

-- Study Plans & Tasks: Cadets manage own daily agenda
DROP POLICY IF EXISTS "Users manage their own study plans" ON public.study_plans;
CREATE POLICY "Users manage their own study plans" ON public.study_plans
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage their own study tasks" ON public.study_tasks;
CREATE POLICY "Users manage their own study tasks" ON public.study_tasks
  FOR ALL USING (auth.uid() = user_id);

-- Notes: Cadets manage own notes
DROP POLICY IF EXISTS "Users manage their own notes" ON public.notes;
CREATE POLICY "Users manage their own notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);

-- Revision Items: Cadets manage own SM-2 schedule
DROP POLICY IF EXISTS "Users manage their own revision items" ON public.revision_items;
CREATE POLICY "Users manage their own revision items" ON public.revision_items
  FOR ALL USING (auth.uid() = user_id);

-- Games: Public read
DROP POLICY IF EXISTS "Games are viewable by all" ON public.games;
CREATE POLICY "Games are viewable by all" ON public.games
  FOR SELECT USING (true);

-- Game Scores: Public leaderboard read, authenticated write
DROP POLICY IF EXISTS "Game scores are viewable by all" ON public.game_scores;
CREATE POLICY "Game scores are viewable by all" ON public.game_scores
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert their own game scores" ON public.game_scores;
CREATE POLICY "Users insert their own game scores" ON public.game_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feature Flags: Public read
DROP POLICY IF EXISTS "Feature flags viewable by all" ON public.feature_flags;
CREATE POLICY "Feature flags viewable by all" ON public.feature_flags
  FOR SELECT USING (true);

-- Admin Broadcasts: Public read active broadcasts
DROP POLICY IF EXISTS "Broadcasts viewable by all" ON public.admin_broadcasts;
CREATE POLICY "Broadcasts viewable by all" ON public.admin_broadcasts
  FOR SELECT USING (active = true);

-- ============================================================================
-- 6. AUTOMATIC CADET PROFILE CREATION TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 7. INITIAL SEED DATA
-- ============================================================================

INSERT INTO public.games (slug, name, description, scoring_direction) VALUES
  ('neural-focus', 'Neural Focus Grid', 'Cognitive sequence recall & mental agility', 'DESCENDING'),
  ('prelims-reaction', 'Prelims Rapid Fire', 'Micro-second fact verification reflexes', 'DESCENDING'),
  ('article-speed-match', 'Constitutional Article Match', 'Speed link Articles with constitutional principles', 'DESCENDING'),
  ('csat-quant-sprint', 'CSAT Mental Math Sprint', 'Zero-paper arithmetic acceleration drill', 'DESCENDING')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.feature_flags (id, key, name, description, is_enabled) VALUES
  ('feat-ai-mentor', 'ai_mentor', 'WHY Strategic AI Mentor', 'LLM strategic diagnostic advisor', true),
  ('feat-mains-diagram', 'mains_diagram_studio', 'Mains SVG Flowchart Studio', 'Interactive diagram creator', true),
  ('feat-cloud-sync', 'cloud_sync_realtime', 'Hybrid Cloud Multi-Device Sync', 'Cross-device state synchronization', true)
ON CONFLICT (id) DO NOTHING;

-- Schema deployment completed successfully!
