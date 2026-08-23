-- ============================================================================
-- WHYNOTUPSC / REDROOM — FREE TIER STORAGE PRUNING (pg_cron)
-- Migration: 20260824_storage_pruning_cron.sql
-- 
-- 1. Enables pg_cron extension on Supabase PostgreSQL
-- 2. Schedules automated weekly cleanup to preserve 500MB database limit
-- ============================================================================

-- 1. Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- 2. Create Storage Pruning Stored Procedure
CREATE OR REPLACE FUNCTION public.prune_stale_storage_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_audit_count int;
  deleted_events_count int;
  deleted_notifs_count int;
  deleted_rooms_count int;
BEGIN
  -- A. Delete audit logs older than 30 days
  DELETE FROM public.admin_audit_logs
  WHERE created_at < (now() - INTERVAL '30 days');
  GET DIAGNOSTICS deleted_audit_count = ROW_COUNT;

  -- B. Delete transient telemetry activity events older than 30 days
  DELETE FROM public.activity_events
  WHERE created_at < (now() - INTERVAL '30 days');
  GET DIAGNOSTICS deleted_events_count = ROW_COUNT;

  -- C. Delete read/stale system notifications older than 14 days
  DELETE FROM public.system_notifications
  WHERE created_at < (now() - INTERVAL '14 days');
  GET DIAGNOSTICS deleted_notifs_count = ROW_COUNT;

  -- D. Delete expired multiplayer rooms older than 7 days
  DELETE FROM public.multiplayer_rooms
  WHERE expires_at < (now() - INTERVAL '7 days');
  GET DIAGNOSTICS deleted_rooms_count = ROW_COUNT;

  -- E. Delete casual chill game sessions older than 30 days
  DELETE FROM public.game_sessions
  WHERE created_at < (now() - INTERVAL '30 days');

  -- Log pruning execution summary to console
  RAISE NOTICE 'Storage Pruning Complete: Audits pruned: %, Events: %, Notifications: %, Rooms: %',
    deleted_audit_count, deleted_events_count, deleted_notifs_count, deleted_rooms_count;
END;
$$;

-- Grant execution permissions exclusively to postgres and service role
REVOKE EXECUTE ON FUNCTION public.prune_stale_storage_data() FROM authenticated, anon, public;
GRANT EXECUTE ON FUNCTION public.prune_stale_storage_data() TO postgres;

-- 3. Schedule Weekly Cron Job (Every Sunday at Midnight UTC)
-- Cron Expression: '0 0 * * 0' (At 00:00 on Sunday)
DO $$
BEGIN
  -- Unschedule existing job if previously scheduled
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-storage-pruning') THEN
    PERFORM cron.unschedule('weekly-storage-pruning');
  END IF;

  -- Schedule new automated pruning job
  PERFORM cron.schedule(
    'weekly-storage-pruning',
    '0 0 * * 0',
    'SELECT public.prune_stale_storage_data();'
  );
END$$;
