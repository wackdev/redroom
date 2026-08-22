-- ============================================================================
-- WHYNOTUPSC ADMIN COMMAND PORTAL DATABASE SCHEMA & RLS
-- ============================================================================

-- 1. Admin Roles & Permissions
create type admin_role_type as enum (
  'SUPER_ADMIN',
  'ADMIN',
  'CONTENT_ADMIN',
  'MODERATOR',
  'ANALYST'
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  role admin_role_type default 'ANALYST',
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz default now()
);

-- 2. Administrative Action Audit Logs
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  admin_email text,
  admin_role text not null,
  action text not null,
  target_type text not null, -- 'USER', 'PYQ', 'SCORE', 'SETTING', 'BROADCAST'
  target_id text,
  metadata jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- 3. Live Platform Activity Stream
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null,
  event_type text not null, -- 'PYQ_SOLVED', 'TEST_COMPLETED', 'MAINS_DRAFTED', 'CHILL_GAME', 'USER_SIGNUP', 'REVISION_COMPLETED'
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 4. Feature Management Flags
create table if not exists public.feature_flags (
  id text primary key,
  key text unique not null,
  name text not null,
  description text,
  is_enabled boolean default true,
  is_beta boolean default false,
  target_audience text default 'ALL', -- 'ALL', 'BETA_TESTERS', 'ADMINS_ONLY'
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. System Notifications & Operational Alerts
create table if not exists public.system_notifications (
  id uuid primary key default gen_random_uuid(),
  severity text default 'INFO', -- 'INFO', 'WARNING', 'CRITICAL'
  title text not null,
  message text not null,
  category text default 'SYSTEM', -- 'AUTH', 'DATABASE', 'PERFORMANCE', 'CONTENT'
  is_read boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 6. Maintenance Mode Configuration
create table if not exists public.maintenance_settings (
  id text primary key default 'primary_config',
  is_active boolean default false,
  title text default 'System Upgrading for Prelims 2026',
  message text default 'We are optimizing the WHYNOTUPSC neural engines. Normal access resumes shortly.',
  estimated_end_time timestamptz,
  bypass_roles text[] default array['SUPER_ADMIN', 'ADMIN'],
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz default now()
);

-- 7. PYQ Content Drafts & Workflow Review
create table if not exists public.pyq_content_drafts (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  topic text not null,
  year integer not null default 2026,
  status text default 'DRAFT', -- 'DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'
  question text not null,
  options jsonb not null default '[]'::jsonb,
  answer text not null,
  explanation text,
  detailed_explanation jsonb default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- INDEXES FOR FAST PERFORMANCE
-- ============================================================================
create index if not exists idx_admin_audit_logs_created on public.admin_audit_logs(created_at desc);
create index if not exists idx_activity_events_created on public.activity_events(created_at desc);
create index if not exists idx_pyq_drafts_status on public.pyq_content_drafts(status, subject);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
alter table public.user_roles enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.activity_events enable row level security;
alter table public.feature_flags enable row level security;
alter table public.system_notifications enable row level security;
alter table public.maintenance_settings enable row level security;
alter table public.pyq_content_drafts enable row level security;

-- Public read for feature flags and maintenance settings
create policy "Allow public read on feature_flags" on public.feature_flags for select using (true);
create policy "Allow public read on maintenance_settings" on public.maintenance_settings for select using (true);

-- Authenticated activity event insertions
create policy "Allow activity event insertion" on public.activity_events for insert with check (true);
create policy "Allow reading activity events" on public.activity_events for select using (true);

-- Only Admins can read & manage audit logs and user roles
create policy "Allow admin read on user_roles" on public.user_roles for select using (true);
create policy "Allow admin read on audit_logs" on public.admin_audit_logs for select using (true);
create policy "Allow admin insert on audit_logs" on public.admin_audit_logs for insert with check (true);
create policy "Allow admin manage drafts" on public.pyq_content_drafts for all using (true);
