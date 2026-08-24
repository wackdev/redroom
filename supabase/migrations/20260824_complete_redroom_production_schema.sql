-- ============================================================================
-- WHYNOTUPSC / REDROOM — COMPLETE PRODUCTION DATABASE SCHEMA MIGRATION
-- Platforms: Supabase PostgreSQL 15+ (Compatible with Vercel & GitHub Actions)
-- Instructions: Copy and paste this script directly into your Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS & ENUMS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- ----------------------------------------------------------------------------
-- 1. HELPER FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. ASPIRANT IDENTITY & PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  target_year INT DEFAULT 2026,
  optional_subject TEXT,
  daily_goal_hours NUMERIC(4,1) DEFAULT 6.0,
  streak_days INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  rank_tier TEXT DEFAULT 'Aspirant Tier',
  persona TEXT DEFAULT 'Strategist',
  telegram_chat_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role admin_role_type DEFAULT 'ANALYST',
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.live_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'UPSC Aspirant',
  current_path TEXT NOT NULL DEFAULT '/',
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to create profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 3. STUDY PLANNER, TASKS & DEEP WORK FOCUS SESSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_date DATE NOT NULL,
  target_hours NUMERIC(4,1) DEFAULT 6.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_plan_date UNIQUE (user_id, plan_date)
);

CREATE TABLE IF NOT EXISTS public.study_tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_date DATE NOT NULL,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  hours NUMERIC(4,1) DEFAULT 1.0,
  completed BOOLEAN DEFAULT false,
  task_type TEXT DEFAULT 'revision',
  priority TEXT DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INT NOT NULL DEFAULT 25,
  mode TEXT DEFAULT 'pomodoro', -- pomodoro, deep_work, sprint
  subject TEXT DEFAULT 'General Studies',
  topic TEXT DEFAULT 'Deep Work Focus Sprint',
  soundscape TEXT DEFAULT 'gamma_focus', -- gamma_focus, lbsnaa_rain, old_library
  focus_rating INT DEFAULT 5, -- 1 to 5
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. PRELIMS PYQ MATRIX & MISTAKE NOTEBOOK
-- ----------------------------------------------------------------------------
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
  mains_relevance TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_pyq_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pyq_id BIGINT REFERENCES public.pyqs(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT true,
  is_correct BOOLEAN,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_pyq_unique UNIQUE (user_id, pyq_id)
);

CREATE TABLE IF NOT EXISTS public.pyq_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pyq_id BIGINT REFERENCES public.pyqs(id) ON DELETE CASCADE NOT NULL,
  selected_option VARCHAR(2) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INT DEFAULT 0,
  mistake_type TEXT,
  notes TEXT,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pyq_mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pyq_id BIGINT,
  question TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  selected_option TEXT,
  correct_answer TEXT,
  mistake_type TEXT NOT NULL, -- conceptual_error, factual_memory_loss, misread_question, extreme_word_trap, time_pressure, wild_guess
  explanation TEXT,
  reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. MAINS QUESTION BANK & ANSWER EVALUATION ENGINE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mains_pyqs (
  id BIGSERIAL PRIMARY KEY,
  year INT NOT NULL,
  paper VARCHAR(10) NOT NULL, -- GS-1, GS-2, GS-3, GS-4, Essay
  subject TEXT NOT NULL,
  topic TEXT,
  question_number INT,
  marks INT DEFAULT 15,
  word_limit INT DEFAULT 250,
  question TEXT NOT NULL,
  syllabus_mapping TEXT[] DEFAULT '{}',
  dimensions TEXT[] DEFAULT '{}',
  framework TEXT,
  model_answer TEXT,
  topper_copy_sample TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mains_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id BIGINT REFERENCES public.mains_pyqs(id) ON DELETE CASCADE,
  custom_question TEXT,
  paper VARCHAR(10) DEFAULT 'GS-1',
  marks INT DEFAULT 15,
  word_limit INT DEFAULT 250,
  answer_text TEXT NOT NULL,
  word_count INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  stencil_used TEXT, -- PESTLE, Stakeholder, Chronological, Spatial
  is_submitted BOOLEAN DEFAULT true,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mains_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES public.mains_answers(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score NUMERIC(4,1) NOT NULL,
  max_marks INT DEFAULT 15,
  scannability_rating INT DEFAULT 7, -- 1 to 10
  dimensions_identified INT DEFAULT 4,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  improvements TEXT[] DEFAULT '{}',
  model_intro TEXT,
  model_conclusion TEXT,
  ai_raw_evaluation JSONB DEFAULT '{}'::JSONB,
  evaluated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. MOCK TESTS & TEST SERIES RESULTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_results (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  total NUMERIC(5,2) NOT NULL,
  correct INT NOT NULL,
  incorrect INT NOT NULL,
  unattempted INT NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL,
  time_spent_seconds INT DEFAULT 0,
  paper TEXT DEFAULT 'GS-1',
  date TIMESTAMPTZ DEFAULT now(),
  answers JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7. SYLLABUS TRACKER & KNOWLEDGE RADAR
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syllabus_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT true,
  confidence_rating INT DEFAULT 3,
  completed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_syllabus_topic_unique UNIQUE (user_id, topic_id)
);

-- ----------------------------------------------------------------------------
-- 8. SPACED REPETITION (SM-2 ALGORITHM) ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.revision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_revision_topic_unique UNIQUE (user_id, topic_id)
);

-- ----------------------------------------------------------------------------
-- 9. ASPIRANT NOTES VAULT & MINDMAP CANVAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  mindmap_data JSONB DEFAULT '{}'::JSONB,
  attachments JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10. CURRENT AFFAIRS CACHE & BOOKMARKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.current_affairs_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  articles JSONB DEFAULT '[]'::JSONB,
  audio_summary JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.current_affairs_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL,
  article_title TEXT NOT NULL,
  article_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_article_bookmark_unique UNIQUE (user_id, article_id)
);

-- ----------------------------------------------------------------------------
-- 11. DAF PROFILES & INTERVIEW SIMULATOR
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daf_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  home_state TEXT,
  home_district TEXT,
  graduation_subject TEXT,
  university TEXT,
  optional_subject TEXT,
  hobbies TEXT[] DEFAULT '{}',
  service_preferences TEXT[] DEFAULT '{}',
  cadre_preferences TEXT[] DEFAULT '{}',
  leadership_roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.interview_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID DEFAULT gen_random_uuid(),
  board_name TEXT DEFAULT 'UPSC Board Simulation',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  ai_evaluation JSONB DEFAULT '{}'::JSONB,
  score INT DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12. CHILL ZONE & REACTION GAMING ARENA
-- ----------------------------------------------------------------------------
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
  room_id UUID REFERENCES public.multiplayer_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'joined',
  score NUMERIC,
  joined_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT room_player_unique UNIQUE (room_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 13. PUSH NOTIFICATIONS, TELEMETRY & GLOBAL BROADCASTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'reminder',
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_broadcasts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'directive',
  priority TEXT DEFAULT 'High',
  action_link TEXT,
  action_label TEXT,
  author TEXT DEFAULT 'Admin Command',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
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

-- ----------------------------------------------------------------------------
-- 14. PERFORMANCE RADAR REPORTS & AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary JSONB DEFAULT '{}'::JSONB,
  radar_metrics JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_weekly_report_unique UNIQUE (user_id, week_start)
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

CREATE TABLE IF NOT EXISTS public.sync_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  client_updated_at TIMESTAMPTZ,
  server_processed_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'SUCCESS'
);

-- ----------------------------------------------------------------------------
-- 15. PERFORMANCE INDEXES (High-Speed Execution)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_date ON public.study_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_date ON public.study_tasks(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user ON public.focus_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pyqs_subject_year ON public.pyqs(subject, year);
CREATE INDEX IF NOT EXISTS idx_pyqs_paper ON public.pyqs(paper);
CREATE INDEX IF NOT EXISTS idx_pyq_attempts_user_pyq ON public.pyq_attempts(user_id, pyq_id);
CREATE INDEX IF NOT EXISTS idx_pyq_mistakes_user ON public.pyq_mistakes(user_id, mistake_type);
CREATE INDEX IF NOT EXISTS idx_mains_pyqs_paper ON public.mains_pyqs(paper, year);
CREATE INDEX IF NOT EXISTS idx_mains_answers_user ON public.mains_answers(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_mains_eval_user ON public.mains_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user_date ON public.test_results(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_syllabus_progress_user ON public.syllabus_progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_revision_items_next_review ON public.revision_items(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_notes_user_subject ON public.notes(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_game_scores_slug_score ON public.game_scores(game_slug, score DESC);
CREATE INDEX IF NOT EXISTS idx_live_presence_last_seen ON public.live_presence(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_active ON public.admin_broadcasts(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_time ON public.activity_events(created_at DESC);

-- ----------------------------------------------------------------------------
-- 16. ROW LEVEL SECURITY (Zero-Subquery, Ultra-Fast Policies)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pyq_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mains_pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mains_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mains_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affairs_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affairs_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daf_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiplayer_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiplayer_room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Reference Data Policies
DROP POLICY IF EXISTS "Public can view pyqs" ON public.pyqs;
CREATE POLICY "Public can view pyqs" ON public.pyqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view mains_pyqs" ON public.mains_pyqs;
CREATE POLICY "Public can view mains_pyqs" ON public.mains_pyqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view games" ON public.games;
CREATE POLICY "Public can view games" ON public.games FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view feature_flags" ON public.feature_flags;
CREATE POLICY "Public can view feature_flags" ON public.feature_flags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view broadcasts" ON public.admin_broadcasts;
CREATE POLICY "Public can view broadcasts" ON public.admin_broadcasts FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage broadcasts" ON public.admin_broadcasts;
CREATE POLICY "Admin can manage broadcasts" ON public.admin_broadcasts FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view presence" ON public.live_presence;
CREATE POLICY "Public can view presence" ON public.live_presence FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can upsert presence" ON public.live_presence;
CREATE POLICY "Anyone can upsert presence" ON public.live_presence FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view current affairs" ON public.current_affairs_cache;
CREATE POLICY "Public can view current affairs" ON public.current_affairs_cache FOR SELECT USING (true);

-- User-Owned Table Policies (Fast auth.uid() check)
CREATE OR REPLACE FUNCTION create_user_isolation_policies(tbl TEXT) RETURNS VOID AS $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS "%s_select" ON public.%I', tbl, tbl);
  EXECUTE format('DROP POLICY IF EXISTS "%s_insert" ON public.%I', tbl, tbl);
  EXECUTE format('DROP POLICY IF EXISTS "%s_update" ON public.%I', tbl, tbl);
  EXECUTE format('DROP POLICY IF EXISTS "%s_delete" ON public.%I', tbl, tbl);

  EXECUTE format('CREATE POLICY "%s_select" ON public.%I FOR SELECT USING (auth.uid() = user_id OR auth.uid()::text = user_id::text)', tbl, tbl);
  EXECUTE format('CREATE POLICY "%s_insert" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid()::text = user_id::text)', tbl, tbl);
  EXECUTE format('CREATE POLICY "%s_update" ON public.%I FOR UPDATE USING (auth.uid() = user_id OR auth.uid()::text = user_id::text)', tbl, tbl);
  EXECUTE format('CREATE POLICY "%s_delete" ON public.%I FOR DELETE USING (auth.uid() = user_id OR auth.uid()::text = user_id::text)', tbl, tbl);
END;
$$ LANGUAGE plpgsql;

-- Apply standard user isolation to user-scoped tables
SELECT create_user_isolation_policies('study_plans');
SELECT create_user_isolation_policies('study_tasks');
SELECT create_user_isolation_policies('focus_sessions');
SELECT create_user_isolation_policies('user_pyq_progress');
SELECT create_user_isolation_policies('pyq_attempts');
SELECT create_user_isolation_policies('pyq_mistakes');
SELECT create_user_isolation_policies('mains_answers');
SELECT create_user_isolation_policies('mains_evaluations');
SELECT create_user_isolation_policies('test_results');
SELECT create_user_isolation_policies('syllabus_progress');
SELECT create_user_isolation_policies('revision_items');
SELECT create_user_isolation_policies('notes');
SELECT create_user_isolation_policies('current_affairs_bookmarks');
SELECT create_user_isolation_policies('daf_profiles');
SELECT create_user_isolation_policies('interview_transcripts');
SELECT create_user_isolation_policies('game_sessions');
SELECT create_user_isolation_policies('game_scores');
SELECT create_user_isolation_policies('push_subscriptions');
SELECT create_user_isolation_policies('weekly_reports');
SELECT create_user_isolation_policies('sync_audit_logs');

-- Specific Profiles Policy
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Clean up helper function
DROP FUNCTION IF EXISTS create_user_isolation_policies(TEXT);

-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================
