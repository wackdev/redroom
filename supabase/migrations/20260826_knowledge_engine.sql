-- ============================================================================
-- WHYNOTUPSC / REDROOM — UNIVERSAL UPSC KNOWLEDGE ENGINE SCHEMA
-- Migration: 20260826_knowledge_engine.sql
-- Description: Complete production schema for topics, sources, semantic chunks,
--              knowledge graph, search analytics, student progress, and OCR review.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXAMS & PAPERS HIERARCHY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY, -- e.g. 'upsc_cse', 'bpsc_cce', 'uppsc_pcs', 'epfo_eo'
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Civil Services', -- Central, State PSC, Regulatory
  description TEXT,
  target_year INT DEFAULT 2026,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exam_papers (
  id TEXT PRIMARY KEY, -- e.g. 'upsc_prelims_gs1', 'upsc_mains_gs2', 'upsc_mains_anthro_1'
  exam_id TEXT REFERENCES public.exams(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- e.g. 'GS-1', 'GS-2', 'GS-3', 'GS-4', 'Essay', 'CSAT', 'Optional-1'
  name TEXT NOT NULL,
  total_marks INT DEFAULT 250,
  duration_minutes INT DEFAULT 180,
  stage TEXT DEFAULT 'Mains', -- Prelims, Mains, Interview
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_subjects (
  id TEXT PRIMARY KEY, -- e.g. 'indian_polity', 'modern_history', 'indian_economy', 'anthropology'
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

-- ----------------------------------------------------------------------------
-- 2. UNIVERSAL TOPIC ARCHITECTURE (CENTRAL ENTITY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY, -- slug or UUID, e.g. 'governor-discretionary-powers', 'article-21-right-to-life'
  subject_id TEXT REFERENCES public.knowledge_subjects(id) ON DELETE CASCADE,
  paper_id TEXT REFERENCES public.exam_papers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  topic_level TEXT NOT NULL DEFAULT 'subtopic', -- subject, syllabus_topic, subtopic, microtopic, concept
  syllabus_code TEXT, -- e.g. 'GS2.POL.01.03'
  prelims_relevance NUMERIC(3,2) DEFAULT 0.85, -- 0.00 to 1.00
  mains_relevance NUMERIC(3,2) DEFAULT 0.90,
  optional_relevance NUMERIC(3,2) DEFAULT 0.00,
  importance_score INT DEFAULT 85, -- 1 to 100
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

-- Topic Aliases for Fast Resolution (e.g. 'FR' -> 'Fundamental Rights', 'DPSP' -> 'Directive Principles')
CREATE TABLE IF NOT EXISTS public.topic_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  alias TEXT NOT NULL,
  normalized_alias TEXT NOT NULL,
  is_acronym BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_topic_aliases_norm ON public.topic_aliases(normalized_alias);

-- ----------------------------------------------------------------------------
-- 3. SOURCES & INGESTION STORAGE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
  id TEXT PRIMARY KEY, -- e.g. 'issf-indian-polity-2025', 'laxmikanth-polity-7th'
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT NOT NULL DEFAULT 'Expert Faculty',
  publisher TEXT DEFAULT 'WhyNotUPSC Editorial',
  edition TEXT DEFAULT '1st Edition (2025)',
  publication_year INT DEFAULT 2025,
  source_type TEXT NOT NULL DEFAULT 'Standard Book', -- Standard Book, NCERT, Coaching Notes, Government Report, Current Affairs, etc.
  language TEXT DEFAULT 'English',
  description TEXT,
  file_url TEXT,
  file_size_bytes BIGINT DEFAULT 0,
  total_pages INT DEFAULT 0,
  native_text_pages INT DEFAULT 0,
  ocr_required_pages INT DEFAULT 0,
  is_processed BOOLEAN DEFAULT false,
  processing_status TEXT DEFAULT 'completed', -- queued, processing, completed, failed, needs_review
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

-- ----------------------------------------------------------------------------
-- 4. SEMANTIC CHUNKS (THE KNOWLEDGE ATOMS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_chunks (
  id TEXT PRIMARY KEY, -- e.g. 'chunk-issf-polity-p15-c1'
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  page_start INT NOT NULL,
  page_end INT NOT NULL,
  heading TEXT,
  subheading TEXT,
  chunk_type TEXT NOT NULL DEFAULT 'concept', 
  -- introduction, definition, concept, constitutional_provision, article, amendment,
  -- case_law, judgment, committee, report, scheme, classification, causes, effects,
  -- comparison, examples, data, table, chart, timeline, current_affairs, prelims_fact, mains_dimension, way_forward
  raw_content TEXT NOT NULL,
  cleaned_content TEXT NOT NULL,
  searchable_content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  entities JSONB DEFAULT '{}'::JSONB, -- { articles: [], cases: [], committees: [], dates: [] }
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

-- Full text search index on searchable_content
CREATE INDEX IF NOT EXISTS idx_chunks_fts ON public.source_chunks USING gin(to_tsvector('english', searchable_content));

-- ----------------------------------------------------------------------------
-- 5. KNOWLEDGE GRAPH RELATIONSHIPS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topic_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  to_topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'related_to',
  -- related_to, part_of, explains, depends_on, causes, effect_of, contrasts_with,
  -- article_reference, constitutional_provision, amendment_reference, case_law,
  -- committee_reference, report_reference, current_affairs_reference, pyq_reference
  relevance_score NUMERIC(3,2) DEFAULT 0.80,
  description TEXT,
  evidence_chunk_ids TEXT[] DEFAULT '{}',
  verification_status TEXT DEFAULT 'Admin Approved', -- AI Suggested, Admin Approved, Manual
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_topic_relationship UNIQUE (from_topic_id, to_topic_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_rel_from_topic ON public.topic_relationships(from_topic_id);
CREATE INDEX IF NOT EXISTS idx_rel_to_topic ON public.topic_relationships(to_topic_id);
CREATE INDEX IF NOT EXISTS idx_rel_type ON public.topic_relationships(relationship_type);

-- ----------------------------------------------------------------------------
-- 6. TOPIC TO SOURCE / PYQ / PRACTICE / REVISION BRIDGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topic_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  source_id TEXT REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  is_recommended BOOLEAN DEFAULT false,
  page_ranges TEXT, -- e.g. "15-28, 60-75"
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
  card_type TEXT NOT NULL DEFAULT 'flashcard', -- flashcard, one_liner, article_card, case_law_card, committee_card
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  key_facts TEXT[] DEFAULT '{}',
  upsc_importance TEXT DEFAULT 'High',
  source_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_topic_rev_cards_topic ON public.topic_revision_cards(topic_id);

-- ----------------------------------------------------------------------------
-- 7. STUDENT PROGRESS, NOTES & BOOKMARKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Exploring', -- Not Started, Exploring, Studying, Practicing, Revising, Mastered
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

-- ----------------------------------------------------------------------------
-- 8. SEARCH LOGS & QUERY ANALYTICS
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 9. OCR CORRECTIONS & AUDIT TRAIL
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
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

-- Public Read Policies for Knowledge Material
DROP POLICY IF EXISTS "Public can view active exams" ON public.exams;
CREATE POLICY "Public can view active exams" ON public.exams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view exam papers" ON public.exam_papers;
CREATE POLICY "Public can view exam papers" ON public.exam_papers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view subjects" ON public.knowledge_subjects;
CREATE POLICY "Public can view subjects" ON public.knowledge_subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view topics" ON public.topics;
CREATE POLICY "Public can view topics" ON public.topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view topic aliases" ON public.topic_aliases;
CREATE POLICY "Public can view topic aliases" ON public.topic_aliases FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published sources" ON public.sources;
CREATE POLICY "Public can view published sources" ON public.sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view source pages" ON public.source_pages;
CREATE POLICY "Public can view source pages" ON public.source_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view source chunks" ON public.source_chunks;
CREATE POLICY "Public can view source chunks" ON public.source_chunks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view relationships" ON public.topic_relationships;
CREATE POLICY "Public can view relationships" ON public.topic_relationships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view topic sources" ON public.topic_sources;
CREATE POLICY "Public can view topic sources" ON public.topic_sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view topic pyqs" ON public.topic_pyqs;
CREATE POLICY "Public can view topic pyqs" ON public.topic_pyqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view topic revision cards" ON public.topic_revision_cards;
CREATE POLICY "Public can view topic revision cards" ON public.topic_revision_cards FOR SELECT USING (true);

-- User-Isolated Policies for Student Progress & Bookmarks
DROP POLICY IF EXISTS "Students manage their own topic progress" ON public.student_topic_progress;
CREATE POLICY "Students manage their own topic progress" ON public.student_topic_progress
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students manage their own bookmarks" ON public.student_knowledge_bookmarks;
CREATE POLICY "Students manage their own bookmarks" ON public.student_knowledge_bookmarks
  FOR ALL USING (auth.uid() = user_id);
