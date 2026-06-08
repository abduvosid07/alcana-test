-- Run once in Supabase Dashboard → SQL Editor → New query → Run
-- https://supabase.com/dashboard/project/vbkggklqpufvcgnibonn/sql/new

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  surname text not null,
  score integer not null,
  attempt integer not null default 1,
  status text not null check (status in ('passed', 'retry', 'failed')),
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists assessment_results_created_at_idx
  on public.assessment_results (created_at desc);

alter table public.assessment_results enable row level security;

drop policy if exists "anon_insert_assessment_results" on public.assessment_results;
drop policy if exists "anon_select_assessment_results" on public.assessment_results;
drop policy if exists "anon_delete_assessment_results" on public.assessment_results;

create policy "anon_insert_assessment_results"
  on public.assessment_results for insert to anon, authenticated
  with check (true);

create policy "anon_select_assessment_results"
  on public.assessment_results for select to anon, authenticated
  using (true);

create policy "anon_delete_assessment_results"
  on public.assessment_results for delete to anon, authenticated
  using (true);

-- ─────────────────────────────────────────────
-- Admin Question Editor: quiz sections, questions, options
-- ─────────────────────────────────────────────

create table if not exists public.quiz_sections (
  id uuid primary key default gen_random_uuid(),
  title_uz text not null,
  title_ru text not null,
  title_en text not null,
  pass_threshold int not null,
  retry_threshold int not null,
  time_limit_minutes int not null default 15,
  is_archived boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.quiz_sections(id) on delete cascade,
  text_uz text not null,
  text_ru text not null,
  text_en text not null,
  correct_index int not null default 0,
  is_archived boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  text_uz text not null,
  text_ru text not null,
  text_en text not null,
  sort_order int not null default 0
);

create index if not exists quiz_questions_section_idx on public.quiz_questions (section_id);
create index if not exists quiz_options_question_idx on public.quiz_options (question_id);

alter table public.quiz_sections enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;

drop policy if exists "anon all quiz_sections" on public.quiz_sections;
drop policy if exists "anon all quiz_questions" on public.quiz_questions;
drop policy if exists "anon all quiz_options" on public.quiz_options;

create policy "anon all quiz_sections"
  on public.quiz_sections for all to anon, authenticated
  using (true) with check (true);

create policy "anon all quiz_questions"
  on public.quiz_questions for all to anon, authenticated
  using (true) with check (true);

create policy "anon all quiz_options"
  on public.quiz_options for all to anon, authenticated
  using (true) with check (true);
