-- ============================================================================
-- WHYNOTUPSC / REDROOM — UPGRADE: SUPABASE FREE TIER OPTIMIZATION
-- Migration: 20260824_jwt_hook_and_zero_subquery_rls.sql
-- 
-- 1. Custom Access Token (JWT) Auth Hook for zero-subquery RBAC
-- 2. Non-destructive app_metadata.role assignment preserving existing metadata
-- 3. Refactored RLS policies using O(1) in-memory (auth.jwt() -> 'app_metadata' ->> 'role')
-- 4. Complete elimination of nested table subqueries to protect Free Tier DB CPU
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SUPABASE CUSTOM ACCESS TOKEN (JWT) HOOK
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role text;
  app_meta jsonb;
BEGIN
  -- Fetch cadet's assigned administrative role from user_roles
  SELECT role::text INTO user_role 
  FROM public.user_roles 
  WHERE user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  -- Extract existing app_metadata or initialize as empty object
  app_meta := COALESCE(claims->'app_metadata', '{}'::jsonb);

  -- Safely inject or update role in app_metadata without clobbering existing claims
  IF user_role IS NOT NULL THEN
    app_meta := jsonb_set(app_meta, '{role}', to_jsonb(user_role));
  ELSE
    app_meta := jsonb_set(app_meta, '{role}', '"ASPIRANT"'::jsonb);
  END IF;

  claims := jsonb_set(claims, '{app_metadata}', app_meta);
  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

-- Grant execution permissions exclusively to supabase_auth_admin
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated, anon, public;
GRANT SELECT ON TABLE public.user_roles TO supabase_auth_admin;

-- ----------------------------------------------------------------------------
-- 2. ZERO-SUBQUERY HELPER FUNCTIONS (O(1) In-Memory JWT Claim Checks)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'ASPIRANT');
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN';
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN', 'ADMIN');
$$;

CREATE OR REPLACE FUNCTION public.is_content_admin_or_above()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN');
$$;

-- ----------------------------------------------------------------------------
-- 3. REFACTOR ALL RLS POLICIES (Zero Table Subqueries)
-- ----------------------------------------------------------------------------

-- Table: profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_super_admin())
  WITH CHECK (auth.uid() = id OR public.is_super_admin());

-- Table: user_roles
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_policy" ON public.user_roles;

CREATE POLICY "user_roles_select_policy"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "user_roles_admin_manage"
  ON public.user_roles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Table: admin_audit_logs
DROP POLICY IF EXISTS "admin_audit_logs_insert" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "admin_audit_logs_select" ON public.admin_audit_logs;

CREATE POLICY "admin_audit_logs_insert"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "admin_audit_logs_select"
  ON public.admin_audit_logs FOR SELECT
  USING (public.is_super_admin() OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('ADMIN', 'MODERATOR', 'ANALYST'));

-- Table: activity_events
DROP POLICY IF EXISTS "activity_events_select" ON public.activity_events;
DROP POLICY IF EXISTS "activity_events_insert" ON public.activity_events;

CREATE POLICY "activity_events_select"
  ON public.activity_events FOR SELECT
  USING (true);

CREATE POLICY "activity_events_insert"
  ON public.activity_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Table: feature_flags
DROP POLICY IF EXISTS "feature_flags_select" ON public.feature_flags;
DROP POLICY IF EXISTS "feature_flags_admin_modify" ON public.feature_flags;
DROP POLICY IF EXISTS "feature_flags_admin" ON public.feature_flags;

CREATE POLICY "feature_flags_select"
  ON public.feature_flags FOR SELECT
  USING (true);

CREATE POLICY "feature_flags_admin_modify"
  ON public.feature_flags FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Table: admin_broadcasts
DROP POLICY IF EXISTS "broadcasts_select" ON public.admin_broadcasts;
DROP POLICY IF EXISTS "broadcasts_admin_modify" ON public.admin_broadcasts;
DROP POLICY IF EXISTS "broadcasts_admin" ON public.admin_broadcasts;

CREATE POLICY "broadcasts_select"
  ON public.admin_broadcasts FOR SELECT
  USING (active = true OR public.is_super_admin());

CREATE POLICY "broadcasts_admin_modify"
  ON public.admin_broadcasts FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Table: pyqs
DROP POLICY IF EXISTS "pyqs_read_all" ON public.pyqs;
DROP POLICY IF EXISTS "pyqs_admin_write" ON public.pyqs;

CREATE POLICY "pyqs_read_all"
  ON public.pyqs FOR SELECT
  USING (true);

CREATE POLICY "pyqs_admin_write"
  ON public.pyqs FOR ALL
  USING (public.is_content_admin_or_above())
  WITH CHECK (public.is_content_admin_or_above());

-- Table: user_pyq_progress
DROP POLICY IF EXISTS "user_pyq_progress_policy" ON public.user_pyq_progress;

CREATE POLICY "user_pyq_progress_policy"
  ON public.user_pyq_progress FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- Table: pyq_attempts
DROP POLICY IF EXISTS "pyq_attempts_policy" ON public.pyq_attempts;

CREATE POLICY "pyq_attempts_policy"
  ON public.pyq_attempts FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- Table: syllabus_progress
DROP POLICY IF EXISTS "syllabus_progress_policy" ON public.syllabus_progress;

CREATE POLICY "syllabus_progress_policy"
  ON public.syllabus_progress FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- Table: study_plans
DROP POLICY IF EXISTS "study_plans_policy" ON public.study_plans;

CREATE POLICY "study_plans_policy"
  ON public.study_plans FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- Table: study_tasks
DROP POLICY IF EXISTS "study_tasks_policy" ON public.study_tasks;

CREATE POLICY "study_tasks_policy"
  ON public.study_tasks FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- Table: notes
DROP POLICY IF EXISTS "notes_policy" ON public.notes;

CREATE POLICY "notes_policy"
  ON public.notes FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- Table: revision_items
DROP POLICY IF EXISTS "revision_items_policy" ON public.revision_items;

CREATE POLICY "revision_items_policy"
  ON public.revision_items FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- Table: test_results
DROP POLICY IF EXISTS "test_results_policy" ON public.test_results;

CREATE POLICY "test_results_policy"
  ON public.test_results FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_super_admin());

-- ----------------------------------------------------------------------------
-- 4. CONNECTION POOLING CONFIGURATION (SUPAVISOR PORT 6543)
-- ----------------------------------------------------------------------------
-- When configuring database connections on Supabase Free Tier, use the 
-- Transaction Pooler URL (Port 6543) to prevent connection exhaustion:
-- DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
-- DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
