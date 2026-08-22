-- ============================================================================
-- REDROOM CORE DATABASE SCHEMA MIGRATION
-- Migration Version: 20260822_redroom_core_schema
-- Description: Complete schema for UPSC OS with tables, indexes, and RLS.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  target_year INT DEFAULT 2026,
  optional_subject TEXT,
  daily_goal_hours NUMERIC(4,1) DEFAULT 6.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Test Results
CREATE TABLE IF NOT EXISTS public.test_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  score NUMERIC(6,2) DEFAULT 0,
  correct INT DEFAULT 0,
  wrong INT DEFAULT 0,
  skipped INT DEFAULT 0,
  attempted INT DEFAULT 0,
  total INT DEFAULT 0,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PYQs Database
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

-- 4. User PYQ Completed Status
CREATE TABLE IF NOT EXISTS public.user_pyq_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  pyq_id BIGINT REFERENCES public.pyqs(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_pyq_unique UNIQUE (user_id, pyq_id)
);

-- 5. Granular PYQ Attempts & Mistakes
CREATE TABLE IF NOT EXISTS public.pyq_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  pyq_id BIGINT REFERENCES public.pyqs(id) ON DELETE CASCADE,
  selected_option VARCHAR(2) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INT DEFAULT 0,
  mistake_type TEXT,
  notes TEXT,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Syllabus Topic Progress
CREATE TABLE IF NOT EXISTS public.syllabus_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT true,
  confidence_rating INT DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_syllabus_topic_unique UNIQUE (user_id, topic_id)
);

-- 7. Study Daily Plans
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  target_hours NUMERIC(4,1) DEFAULT 6.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_date_plan_unique UNIQUE (user_id, plan_date)
);

-- 8. Study Tasks
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
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

-- 9. UPSC Notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Spaced Repetition Revision Items
CREATE TABLE IF NOT EXISTS public.revision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  upsc_importance VARCHAR(20) DEFAULT 'High',
  repetition_count INT DEFAULT 0,
  ease_factor NUMERIC(4,2) DEFAULT 2.50,
  interval_days INT DEFAULT 1,
  last_reviewed_at TIMESTAMPTZ,
  next_review_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_topic_revision_unique UNIQUE (user_id, topic_id)
);

-- 11. Current Affairs Cache
CREATE TABLE IF NOT EXISTS public.current_affairs_cache (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  source TEXT DEFAULT 'NextIAS',
  source_url TEXT,
  category TEXT,
  gs_paper TEXT,
  summary TEXT NOT NULL,
  context TEXT,
  why_in_news TEXT,
  prelims_points TEXT[] DEFAULT '{}',
  mains_angle TEXT,
  tags TEXT[] DEFAULT '{}',
  raw_content TEXT,
  quiz_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. AI Conversations & Interactions
CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  query_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_test_results_user ON public.test_results(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_pyqs_subject_year ON public.pyqs(subject, year DESC);
CREATE INDEX IF NOT EXISTS idx_user_pyq_progress_user ON public.user_pyq_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_pyq_attempts_user ON public.pyq_attempts(user_id, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_syllabus_progress_user ON public.syllabus_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_date ON public.study_tasks(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_revision_items_due ON public.revision_items(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_current_affairs_date ON public.current_affairs_cache(date DESC);
CREATE INDEX IF NOT EXISTS idx_notes_user_subject ON public.notes(user_id, subject);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pyq_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Public tables: pyqs and current_affairs_cache are readable by all authenticated users
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affairs_cache ENABLE ROW LEVEL SECURITY;

-- PYQs & Current Affairs can be read by anyone
CREATE POLICY "Public Read PYQs" ON public.pyqs FOR SELECT USING (true);
CREATE POLICY "Public Read Current Affairs" ON public.current_affairs_cache FOR SELECT USING (true);

-- User-specific access policies
CREATE POLICY "User Profile Self Access" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "User Test Results Access" ON public.test_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User PYQ Progress Access" ON public.user_pyq_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User PYQ Attempts Access" ON public.pyq_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Syllabus Progress Access" ON public.syllabus_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Study Plans Access" ON public.study_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Study Tasks Access" ON public.study_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Notes Access" ON public.notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User Revision Items Access" ON public.revision_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User AI Interactions Access" ON public.ai_interactions FOR ALL USING (auth.uid() = user_id);
