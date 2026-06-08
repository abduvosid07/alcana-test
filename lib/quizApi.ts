// Direct Supabase REST helper for the quiz editor.
// Mirrors the inline fetch pattern already used in app/page.tsx for assessment_results.

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

export type Lang = "uz" | "uz-cyrl" | "ru" | "en";

export type DbOption = {
  id: string;
  question_id: string;
  text_uz: string;
  text_ru: string;
  text_en: string;
  sort_order: number;
};

export type DbQuestion = {
  id: string;
  section_id: string;
  text_uz: string;
  text_ru: string;
  text_en: string;
  correct_index: number;
  is_archived: boolean;
  sort_order: number;
  options?: DbOption[];
};

export type DbSection = {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  pass_threshold: number;
  retry_threshold: number;
  time_limit_minutes: number;
  is_archived: boolean;
  sort_order: number;
  created_at: string;
  questions?: DbQuestion[];
};

function url(path: string) {
  return `${SB_URL}/rest/v1/${path}`;
}

// ── Sections ──────────────────────────────────────

export async function listSections(includeArchived = false): Promise<DbSection[]> {
  const filter = includeArchived ? "" : "&is_archived=eq.false";
  const r = await fetch(url(`quiz_sections?select=*&order=sort_order.asc,created_at.asc${filter}`), { headers });
  if (!r.ok) throw new Error("Failed to load sections");
  return r.json();
}

export async function createSection(s: Omit<DbSection, "id" | "created_at" | "questions" | "is_archived" | "sort_order">): Promise<DbSection> {
  const r = await fetch(url("quiz_sections"), {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(s),
  });
  if (!r.ok) throw new Error("Failed to create section");
  const arr = await r.json();
  return arr[0];
}

export async function updateSection(id: string, patch: Partial<DbSection>): Promise<void> {
  const r = await fetch(url(`quiz_sections?id=eq.${id}`), {
    method: "PATCH",
    headers,
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Failed to update section");
}

export async function archiveSection(id: string): Promise<void> {
  await updateSection(id, { is_archived: true });
}

export async function restoreSection(id: string): Promise<void> {
  await updateSection(id, { is_archived: false });
}

// ── Questions ──────────────────────────────────────

export async function listQuestionsForSection(sectionId: string, includeArchived = false): Promise<DbQuestion[]> {
  const filter = includeArchived ? "" : "&is_archived=eq.false";
  const r = await fetch(
    url(`quiz_questions?select=*,options:quiz_options(*)&section_id=eq.${sectionId}&order=sort_order.asc${filter}`),
    { headers }
  );
  if (!r.ok) throw new Error("Failed to load questions");
  const rows: DbQuestion[] = await r.json();
  rows.forEach(q => q.options?.sort((a, b) => a.sort_order - b.sort_order));
  return rows;
}

export async function listSectionsWithQuestions(): Promise<DbSection[]> {
  const r = await fetch(
    url("quiz_sections?select=*,questions:quiz_questions(*,options:quiz_options(*))&is_archived=eq.false&order=sort_order.asc,created_at.asc"),
    { headers }
  );
  if (!r.ok) throw new Error("Failed to load sections");
  const rows: DbSection[] = await r.json();
  rows.forEach(s => {
    s.questions = (s.questions || []).filter(q => !q.is_archived).sort((a, b) => a.sort_order - b.sort_order);
    s.questions.forEach(q => q.options?.sort((a, b) => a.sort_order - b.sort_order));
  });
  return rows;
}

type NewQuestion = {
  section_id: string;
  text_uz: string;
  text_ru: string;
  text_en: string;
  correct_index: number;
  sort_order: number;
  options: { text_uz: string; text_ru: string; text_en: string }[];
};

export async function createQuestion(q: NewQuestion): Promise<void> {
  const qRes = await fetch(url("quiz_questions"), {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      section_id: q.section_id,
      text_uz: q.text_uz,
      text_ru: q.text_ru,
      text_en: q.text_en,
      correct_index: q.correct_index,
      sort_order: q.sort_order,
    }),
  });
  if (!qRes.ok) throw new Error("Failed to create question");
  const inserted = (await qRes.json())[0];
  const optionsPayload = q.options.map((o, i) => ({
    question_id: inserted.id,
    text_uz: o.text_uz,
    text_ru: o.text_ru,
    text_en: o.text_en,
    sort_order: i,
  }));
  const oRes = await fetch(url("quiz_options"), {
    method: "POST",
    headers,
    body: JSON.stringify(optionsPayload),
  });
  if (!oRes.ok) throw new Error("Failed to create options");
}

export async function updateQuestion(questionId: string, patch: {
  text_uz: string;
  text_ru: string;
  text_en: string;
  correct_index: number;
  options: { text_uz: string; text_ru: string; text_en: string }[];
}): Promise<void> {
  const qRes = await fetch(url(`quiz_questions?id=eq.${questionId}`), {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      text_uz: patch.text_uz,
      text_ru: patch.text_ru,
      text_en: patch.text_en,
      correct_index: patch.correct_index,
    }),
  });
  if (!qRes.ok) throw new Error("Failed to update question");
  await fetch(url(`quiz_options?question_id=eq.${questionId}`), { method: "DELETE", headers });
  const optionsPayload = patch.options.map((o, i) => ({
    question_id: questionId,
    text_uz: o.text_uz,
    text_ru: o.text_ru,
    text_en: o.text_en,
    sort_order: i,
  }));
  const oRes = await fetch(url("quiz_options"), {
    method: "POST",
    headers,
    body: JSON.stringify(optionsPayload),
  });
  if (!oRes.ok) throw new Error("Failed to replace options");
}

export async function archiveQuestion(id: string): Promise<void> {
  await fetch(url(`quiz_questions?id=eq.${id}`), {
    method: "PATCH",
    headers,
    body: JSON.stringify({ is_archived: true }),
  });
}

export async function restoreQuestion(id: string): Promise<void> {
  await fetch(url(`quiz_questions?id=eq.${id}`), {
    method: "PATCH",
    headers,
    body: JSON.stringify({ is_archived: false }),
  });
}
