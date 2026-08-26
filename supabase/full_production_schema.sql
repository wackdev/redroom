-- ============================================================================
-- WHYNOTUPSC / REDROOM — COMPLETE PRODUCTION DATABASE SCHEMA
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_user_notif_user ON public.user_notifications(user_id, is_read);
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
SELECT create_user_isolation_policies('user_notifications');
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
-- 17. OPTIONAL SUBJECT MODULE (500 Mains Marks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.optional_subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  paper_1_syllabus JSONB DEFAULT '[]'::JSONB,
  paper_2_syllabus JSONB DEFAULT '[]'::JSONB,
  total_marks INT DEFAULT 500,
  is_popular BOOLEAN DEFAULT false,
  strategy_notes TEXT,
  recommended_books JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.optional_pyqs (
  id BIGSERIAL PRIMARY KEY,
  subject_code TEXT NOT NULL,
  year INT NOT NULL,
  paper INT NOT NULL CHECK (paper IN (1, 2)),
  question_number INT,
  section TEXT DEFAULT 'A',
  marks INT DEFAULT 20,
  word_limit INT DEFAULT 300,
  question TEXT NOT NULL,
  model_answer TEXT,
  key_points TEXT[] DEFAULT '{}',
  concept_tags TEXT[] DEFAULT '{}',
  important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.optional_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_code TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  paper INT NOT NULL CHECK (paper IN (1, 2)),
  completed BOOLEAN DEFAULT true,
  confidence_rating INT DEFAULT 3 CHECK (confidence_rating BETWEEN 1 AND 5),
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_optional_topic_unique UNIQUE (user_id, subject_code, topic_id)
);

CREATE TABLE IF NOT EXISTS public.optional_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id BIGINT REFERENCES public.optional_pyqs(id) ON DELETE CASCADE,
  subject_code TEXT NOT NULL,
  paper INT NOT NULL CHECK (paper IN (1, 2)),
  answer_text TEXT NOT NULL,
  word_count INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  self_rating INT DEFAULT 3 CHECK (self_rating BETWEEN 1 AND 5),
  ai_score NUMERIC(4,1),
  ai_feedback JSONB DEFAULT '{}'::JSONB,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 18. ANSWER WRITING SPEED & QUALITY LAB
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.answer_writing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT,
  question_text TEXT,
  paper TEXT DEFAULT 'GS-1',
  marks INT DEFAULT 15,
  target_words INT DEFAULT 150,
  answer_text TEXT NOT NULL,
  word_count INT NOT NULL DEFAULT 0,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  wpm NUMERIC(6,1) DEFAULT 0,
  dimensions_found TEXT[] DEFAULT '{}',
  dimension_count INT DEFAULT 0,
  has_introduction BOOLEAN DEFAULT false,
  has_conclusion BOOLEAN DEFAULT false,
  keyword_density NUMERIC(4,2) DEFAULT 0,
  ai_score NUMERIC(4,1),
  ai_feedback TEXT,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 19. NEWSPAPER DAILY DIGEST & CLIP VAULT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newspaper_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL,
  article_title TEXT NOT NULL,
  article_source TEXT DEFAULT 'The Hindu',
  article_date DATE NOT NULL,
  snippet TEXT NOT NULL,
  full_text TEXT,
  gs_paper TEXT,
  prelims_relevant BOOLEAN DEFAULT false,
  mains_relevant BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  upsc_angle TEXT,
  clipped_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_article_clip_unique UNIQUE (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS public.daily_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  upsc_context TEXT,
  example_sentence TEXT,
  category TEXT DEFAULT 'Constitutional',
  source_article_id TEXT,
  word_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newspaper_reading_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  read_date DATE NOT NULL,
  articles_read INT DEFAULT 0,
  clips_saved INT DEFAULT 0,
  minutes_spent INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_read_date_unique UNIQUE (user_id, read_date)
);

-- ----------------------------------------------------------------------------
-- 20. GROUP STUDY ROOMS & PEER ACCOUNTABILITY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_year INT DEFAULT 2026,
  max_members INT DEFAULT 10,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  daily_hour_target NUMERIC(4,1) DEFAULT 6.0,
  collective_streak_days INT DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'MEMBER', -- ADMIN, MEMBER
  current_subject TEXT,
  is_online BOOLEAN DEFAULT false,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT room_member_unique UNIQUE (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.study_room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, question, resource, announcement
  reply_to UUID REFERENCES public.study_room_messages(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_room_daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  hours_studied NUMERIC(4,1) DEFAULT 0,
  subjects_covered TEXT[] DEFAULT '{}',
  goal_met BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT room_user_log_date_unique UNIQUE (room_id, user_id, log_date)
);

-- ----------------------------------------------------------------------------
-- 21. NATIONAL RANK LEADERBOARD CACHE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.national_leaderboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  rank_position INT NOT NULL,
  composite_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  test_accuracy NUMERIC(5,2) DEFAULT 0,
  pyqs_solved INT DEFAULT 0,
  study_hours NUMERIC(6,1) DEFAULT 0,
  mains_answers_count INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  state TEXT,
  target_year INT DEFAULT 2026,
  badge_icons TEXT[] DEFAULT '{}',
  rank_tier TEXT DEFAULT 'LBSNAA Probationer',
  weekly_movement INT DEFAULT 0,
  last_computed_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_leaderboard_unique UNIQUE (user_id)
);

-- ----------------------------------------------------------------------------
-- 22. VOICE NOTES & DICTATION VAULT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  transcript TEXT NOT NULL,
  formatted_content TEXT,
  duration_seconds INT DEFAULT 0,
  subject TEXT,
  topic TEXT,
  tags TEXT[] DEFAULT '{}',
  is_synced_to_notes BOOLEAN DEFAULT false,
  synced_note_id UUID REFERENCES public.notes(id) ON DELETE SET NULL,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 23. EXPANDED PYQ BATCH IMPORT LOG
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pyq_batch_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name TEXT,
  total_questions INT DEFAULT 0,
  subjects_covered TEXT[] DEFAULT '{}',
  years_covered INT[] DEFAULT '{}',
  status TEXT DEFAULT 'completed',
  notes TEXT,
  imported_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 24. INDEXES FOR NEW TABLES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_optional_pyqs_subject_year ON public.optional_pyqs(subject_code, year, paper);
CREATE INDEX IF NOT EXISTS idx_optional_progress_user ON public.optional_progress(user_id, subject_code);
CREATE INDEX IF NOT EXISTS idx_optional_answers_user ON public.optional_answers(user_id, subject_code);
CREATE INDEX IF NOT EXISTS idx_answer_sessions_user_date ON public.answer_writing_sessions(user_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_newspaper_clips_user_date ON public.newspaper_clips(user_id, article_date DESC);
CREATE INDEX IF NOT EXISTS idx_newspaper_log_user ON public.newspaper_reading_log(user_id, read_date DESC);
CREATE INDEX IF NOT EXISTS idx_study_rooms_code ON public.study_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_room_members_user ON public.study_room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_messages_room ON public.study_room_messages(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.national_leaderboard_cache(rank_position ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.national_leaderboard_cache(composite_score DESC);
CREATE INDEX IF NOT EXISTS idx_voice_notes_user ON public.voice_notes(user_id, recorded_at DESC);

-- ----------------------------------------------------------------------------
-- 25. RLS FOR NEW TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE public.optional_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optional_pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optional_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optional_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_writing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newspaper_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newspaper_reading_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_room_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.national_leaderboard_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_batch_imports ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view optional_subjects" ON public.optional_subjects FOR SELECT USING (true);
CREATE POLICY "Public can view optional_pyqs" ON public.optional_pyqs FOR SELECT USING (true);
CREATE POLICY "Public can view daily_vocabulary" ON public.daily_vocabulary FOR SELECT USING (true);
CREATE POLICY "Public can view study_rooms" ON public.study_rooms FOR SELECT USING (is_public = true OR is_active = true);
CREATE POLICY "Public can view national_leaderboard" ON public.national_leaderboard_cache FOR SELECT USING (true);

-- User-scoped policies for new tables
CREATE OR REPLACE FUNCTION create_user_isolation_policies_v2(tbl TEXT) RETURNS VOID AS $$
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

SELECT create_user_isolation_policies_v2('optional_progress');
SELECT create_user_isolation_policies_v2('optional_answers');
SELECT create_user_isolation_policies_v2('answer_writing_sessions');
SELECT create_user_isolation_policies_v2('newspaper_clips');
SELECT create_user_isolation_policies_v2('newspaper_reading_log');
SELECT create_user_isolation_policies_v2('study_room_members');
SELECT create_user_isolation_policies_v2('study_room_messages');
SELECT create_user_isolation_policies_v2('study_room_daily_logs');
SELECT create_user_isolation_policies_v2('voice_notes');

-- ----------------------------------------------------------------------------
-- 26. UNIVERSAL UPSC KNOWLEDGE ENGINE (One Topic • All Sources • 38+ Subjects)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Civil Services',
  description TEXT,
  target_year INT DEFAULT 2026,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exam_papers (
  id TEXT PRIMARY KEY,
  exam_id TEXT REFERENCES public.exams(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  total_marks INT DEFAULT 250,
  duration_minutes INT DEFAULT 180,
  stage TEXT DEFAULT 'Mains',
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_subjects (
  id TEXT PRIMARY KEY,
  paper_id TEXT REFERENCES public.exam_papers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  color TEXT DEFAULT '#3B82F6',
  description TEXT,
  total_topics_count INT DEFAULT 0,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.knowledge_subjects(id) ON DELETE CASCADE,
  paper_id TEXT REFERENCES public.exam_papers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  topic_level TEXT NOT NULL DEFAULT 'subtopic',
  syllabus_code TEXT,
  prelims_relevance NUMERIC(3,2) DEFAULT 0.85,
  mains_relevance NUMERIC(3,2) DEFAULT 0.90,
  optional_relevance NUMERIC(3,2) DEFAULT 0.00,
  importance_score INT DEFAULT 85,
  key_articles TEXT[] DEFAULT '{}',
  landmark_cases TEXT[] DEFAULT '{}',
  committees TEXT[] DEFAULT '{}',
  constitutional_amendments TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  aliases TEXT[] DEFAULT '{}',
  summary_30s TEXT,
  summary_2m TEXT,
  detailed_explanation TEXT,
  challenges_and_issues TEXT[] DEFAULT '{}',
  way_forward TEXT[] DEFAULT '{}',
  source_count INT DEFAULT 0,
  pyq_count INT DEFAULT 0,
  practice_count INT DEFAULT 0,
  revision_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_topics_subject ON public.topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_parent ON public.topics(parent_topic_id);
CREATE INDEX IF NOT EXISTS idx_topics_slug ON public.topics(slug);
CREATE INDEX IF NOT EXISTS idx_topics_keywords ON public.topics USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_topics_aliases ON public.topics USING gin(aliases);

CREATE TABLE IF NOT EXISTS public.topic_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  alias TEXT NOT NULL,
  normalized_alias TEXT NOT NULL,
  is_acronym BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_topic_aliases_norm ON public.topic_aliases(normalized_alias);

CREATE TABLE IF NOT EXISTS public.sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT NOT NULL DEFAULT 'Expert Faculty',
  publisher TEXT DEFAULT 'WhyNotUPSC Editorial',
  edition TEXT DEFAULT '1st Edition (2025)',
  publication_year INT DEFAULT 2025,
  source_type TEXT NOT NULL DEFAULT 'Standard Book',
  language TEXT DEFAULT 'English',
  description TEXT,
  file_url TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  total_pages INT DEFAULT 0,
  native_text_pages INT DEFAULT 0,
  ocr_required_pages INT DEFAULT 0,
  is_processed BOOLEAN DEFAULT false,
  processing_status TEXT DEFAULT 'completed',
  tags TEXT[] DEFAULT '{}',
  primary_subject_id TEXT REFERENCES public.knowledge_subjects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.source_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  page_number INT NOT NULL,
  native_text TEXT,
  ocr_text TEXT,
  cleaned_text TEXT NOT NULL,
  ocr_confidence NUMERIC(4,3) DEFAULT 1.000,
  has_tables BOOLEAN DEFAULT false,
  has_charts BOOLEAN DEFAULT false,
  has_diagrams BOOLEAN DEFAULT false,
  headings TEXT[] DEFAULT '{}',
  subheadings TEXT[] DEFAULT '{}',
  needs_review BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_source_page UNIQUE (source_id, page_number)
);
CREATE INDEX IF NOT EXISTS idx_source_pages_source ON public.source_pages(source_id);

CREATE TABLE IF NOT EXISTS public.source_chunks (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  page_start INT NOT NULL,
  page_end INT NOT NULL,
  heading TEXT,
  subheading TEXT,
  chunk_type TEXT NOT NULL DEFAULT 'concept',
  raw_content TEXT NOT NULL,
  cleaned_content TEXT NOT NULL,
  searchable_content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  entities JSONB DEFAULT '{}'::JSONB,
  ocr_confidence NUMERIC(4,3) DEFAULT 1.000,
  source_position INT DEFAULT 1,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chunks_source ON public.source_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_chunks_topic ON public.source_chunks(topic_id);
CREATE INDEX IF NOT EXISTS idx_chunks_type ON public.source_chunks(chunk_type);
CREATE INDEX IF NOT EXISTS idx_chunks_keywords ON public.source_chunks USING gin(keywords);

CREATE TABLE IF NOT EXISTS public.topic_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  to_topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'related_to',
  relevance_score NUMERIC(3,2) DEFAULT 0.80,
  description TEXT,
  evidence_chunk_ids TEXT[] DEFAULT '{}',
  verification_status TEXT DEFAULT 'Admin Approved',
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_topic_relationship UNIQUE (from_topic_id, to_topic_id, relationship_type)
);
CREATE INDEX IF NOT EXISTS idx_rel_from_topic ON public.topic_relationships(from_topic_id);
CREATE INDEX IF NOT EXISTS idx_rel_to_topic ON public.topic_relationships(to_topic_id);

CREATE TABLE IF NOT EXISTS public.topic_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  is_recommended BOOLEAN DEFAULT false,
  page_ranges TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_topic_source UNIQUE (topic_id, source_id)
);

CREATE TABLE IF NOT EXISTS public.topic_pyqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  pyq_id BIGINT REFERENCES public.pyqs(id) ON DELETE CASCADE,
  mains_pyq_id BIGINT REFERENCES public.mains_pyqs(id) ON DELETE CASCADE,
  relevance_score NUMERIC(3,2) DEFAULT 0.90,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.topic_revision_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  card_type TEXT NOT NULL DEFAULT 'flashcard',
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  key_facts TEXT[] DEFAULT '{}',
  upsc_importance TEXT DEFAULT 'High',
  source_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_topic_rev_cards_topic ON public.topic_revision_cards(topic_id);

CREATE TABLE IF NOT EXISTS public.student_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Exploring',
  time_spent_seconds INT DEFAULT 0,
  pyqs_attempted INT DEFAULT 0,
  pyqs_correct INT DEFAULT 0,
  last_studied_at TIMESTAMPTZ DEFAULT now(),
  mastery_percentage INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_student_topic_progress UNIQUE (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS public.student_knowledge_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE,
  chunk_id TEXT REFERENCES public.source_chunks(id) ON DELETE CASCADE,
  note_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  matched_topic_ids TEXT[] DEFAULT '{}',
  execution_time_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ocr_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  page_number INT NOT NULL,
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  corrected_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  correction_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Knowledge Engine
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_revision_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_knowledge_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocr_corrections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Public can view exam papers" ON public.exam_papers FOR SELECT USING (true);
CREATE POLICY "Public can view subjects" ON public.knowledge_subjects FOR SELECT USING (true);
CREATE POLICY "Public can view topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public can view topic aliases" ON public.topic_aliases FOR SELECT USING (true);
CREATE POLICY "Public can view published sources" ON public.sources FOR SELECT USING (true);
CREATE POLICY "Public can view source pages" ON public.source_pages FOR SELECT USING (true);
CREATE POLICY "Public can view source chunks" ON public.source_chunks FOR SELECT USING (true);
CREATE POLICY "Public can view relationships" ON public.topic_relationships FOR SELECT USING (true);
CREATE POLICY "Public can view topic sources" ON public.topic_sources FOR SELECT USING (true);
CREATE POLICY "Public can view topic pyqs" ON public.topic_pyqs FOR SELECT USING (true);
CREATE POLICY "Public can view topic revision cards" ON public.topic_revision_cards FOR SELECT USING (true);

CREATE POLICY "Students manage their own topic progress" ON public.student_topic_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Students manage their own bookmarks" ON public.student_knowledge_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- SCHEMA SETUP COMPLETE (v3 — Universal Knowledge Engine Unified)
-- ============================================================================
