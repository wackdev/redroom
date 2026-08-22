-- ============================================================================
-- REDROOM UPSC PREPARATION PLATFORM - COMPLETE SUPABASE SQL SCHEMA
-- Execute this entire script in your Supabase SQL Editor
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE 1: STUDY PLANS (Daily study targets & notes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    plan_date DATE NOT NULL,
    target_hours NUMERIC(4,2) DEFAULT 6.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_plan_date UNIQUE (user_id, plan_date)
);

CREATE INDEX IF NOT EXISTS idx_study_plans_user_date ON public.study_plans (user_id, plan_date);

-- ============================================================================
-- TABLE 2: STUDY TASKS (Individual task breakdown for each day)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_date DATE NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    hours NUMERIC(4,2) DEFAULT 1.00,
    completed BOOLEAN DEFAULT false,
    task_type TEXT DEFAULT 'revision',
    priority TEXT DEFAULT 'Medium',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_tasks_user_date ON public.study_tasks (user_id, plan_date);

-- ============================================================================
-- TABLE 3: NOTES (User study notes & topic journals)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_user ON public.notes (user_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes (subject);

-- ============================================================================
-- TABLE 4: TEST RESULTS (Mock test analytics & scoring)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.test_results (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    test_title TEXT NOT NULL,
    subject TEXT NOT NULL,
    score NUMERIC(6,2) NOT NULL,
    total_questions INT NOT NULL,
    correct INT NOT NULL,
    wrong INT NOT NULL,
    accuracy NUMERIC(5,2) NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_results_user ON public.test_results (user_id);

-- ============================================================================
-- TABLE 5: SYLLABUS PROGRESS (Completed syllabus topics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.syllabus_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT true,
    completed_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_topic UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_syllabus_progress_user ON public.syllabus_progress (user_id);

-- ============================================================================
-- TABLE 6: REVISION ITEMS (SM-2 Spaced Repetition flashcards)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.revision_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    upsc_importance TEXT DEFAULT 'High',
    repetition_count INT DEFAULT 0,
    ease_factor NUMERIC(4,2) DEFAULT 2.50,
    interval_days INT DEFAULT 1,
    last_reviewed_at TIMESTAMPTZ,
    next_review_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_revision_topic UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_revision_items_user_due ON public.revision_items (user_id, next_review_date);

-- ============================================================================
-- TABLE 7: PYQS (Master database of Previous Year Questions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pyqs (
    id TEXT PRIMARY KEY,
    year INT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    subtopic TEXT,
    paper TEXT DEFAULT 'GS-1',
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(2) NOT NULL,
    explanation TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Medium',
    important BOOLEAN DEFAULT false,
    concept_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pyqs_year_subject ON public.pyqs (year, subject);

-- ============================================================================
-- TABLE 8: PYQ ATTEMPTS (User attempt logging & mistake classification)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pyq_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    pyq_id TEXT NOT NULL,
    selected_option VARCHAR(2) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    mistake_type TEXT,
    notes TEXT,
    attempted_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pyq_attempts_user ON public.pyq_attempts (user_id);

-- ============================================================================
-- TABLE 9: USER PYQ PROGRESS (Track completed PYQs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_pyq_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    pyq_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_pyq UNIQUE (user_id, pyq_id)
);

CREATE INDEX IF NOT EXISTS idx_user_pyq_progress_user ON public.user_pyq_progress (user_id);

-- ============================================================================
-- TABLE 10: CURRENT AFFAIRS CACHE (Daily News, Indian Express, PIB)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.current_affairs_cache (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT,
    category TEXT,
    gs_paper TEXT,
    summary TEXT,
    context TEXT,
    why_in_news TEXT,
    key_facts TEXT[] DEFAULT '{}',
    prelims_points TEXT[] DEFAULT '{}',
    mains_angle TEXT,
    tags TEXT[] DEFAULT '{}',
    raw_content TEXT,
    quiz_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_current_affairs_date ON public.current_affairs_cache (date);

-- ============================================================================
-- TABLE 11: ADMIN BROADCASTS (Universal announcements & directives)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_broadcasts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'directive',
    priority TEXT DEFAULT 'Normal',
    action_link TEXT,
    action_label TEXT,
    author TEXT DEFAULT 'Admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_active ON public.admin_broadcasts (is_active, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pyq_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affairs_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_broadcasts ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for Global Datasets (PYQs, Current Affairs, Admin Broadcasts)
CREATE POLICY "Public read for pyqs" ON public.pyqs FOR SELECT USING (true);
CREATE POLICY "Public read for current_affairs" ON public.current_affairs_cache FOR SELECT USING (true);
CREATE POLICY "Public read for admin_broadcasts" ON public.admin_broadcasts FOR SELECT USING (true);

-- 2. Service Role & Authenticated Access for User Data
CREATE POLICY "Allow all operations for service role on study_plans" ON public.study_plans FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on study_tasks" ON public.study_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on notes" ON public.notes FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on test_results" ON public.test_results FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on syllabus_progress" ON public.syllabus_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on revision_items" ON public.revision_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on pyq_attempts" ON public.pyq_attempts FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on user_pyq_progress" ON public.user_pyq_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on admin_broadcasts" ON public.admin_broadcasts FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on current_affairs" ON public.current_affairs_cache FOR ALL USING (true);
CREATE POLICY "Allow all operations for service role on pyqs" ON public.pyqs FOR ALL USING (true);
