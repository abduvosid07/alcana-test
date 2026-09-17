// Evaluation logic for IQ + Personal (SJT) tests — adapted from scoring.js.
// Uses stored meta (answers by index in shuffled display order + shuffles) and the
// question source in lib/newQuestions.ts to compute per-role recommendations.

import { QS_IQ, QS_PERSONAL, XISLAT_NAMES, RED_FLAG_IDS, type Ml } from "./newQuestions";

export type Lang = "uz" | "uz-cyrl" | "ru" | "en";

// ─── CONFIG (initial calibration; tune once real employees have taken the test) ─
export const EVAL_CONFIG = {
  iq: {
    roles: {
      Dizayner: { mantiq: 0.20, sonli: 0.15, fazoviy: 0.35, diqqat: 0.30 },
      Tseh:     { mantiq: 0.15, sonli: 0.25, fazoviy: 0.25, diqqat: 0.35 },
      Sotuvchi: { mantiq: 0.30, sonli: 0.35, fazoviy: 0.15, diqqat: 0.20 },
    } as Record<string, Record<string, number>>,
    umumiyPol: 40,       // below this % → do not hire
    moslikMos: 65,       // >=65 → good fit
    moslikChegara: 50,   // 50-64 → borderline; <50 → weak
  },
  personal: {
    coreStrong: 24,      // core score (out of 30) >= this → Strong
    coreMid: 18,         // 18..23 → Medium; <18 → Weak
    modStrong: 14,       // module score (out of 18) >= this → Strong
    modMid: 11,          // 11..13 → Medium; <11 → Weak
  },
};

// ─── HELPERS ────────────────────────────────────────────────
function pickL(ml: Ml, lang: Lang, toCyrl: (s: string) => string): string {
  return lang === "ru" ? ml.ru : lang === "en" ? ml.en : lang === "uz-cyrl" ? toCyrl(ml.uz) : ml.uz;
}

// Un-shuffle: convert answers keyed by shuffled display index back to original option indices.
// `answers` map: {qIndex: pickedShuffledIdx}; `shuffles`: array[qIndex] of number[] where shuffles[i][displayIdx] = originalIdx.
function unshuffleAnswers(answers: Record<string, any>, shuffles: number[][] | null | undefined, qLen: number): (number | null)[] {
  const out: (number | null)[] = [];
  for (let i = 0; i < qLen; i++) {
    const picked = answers[i];
    if (picked == null || picked === -1) { out.push(null); continue; }
    if (shuffles && shuffles[i] && shuffles[i][picked] != null) {
      out.push(shuffles[i][picked]);
    } else {
      out.push(picked);
    }
  }
  return out;
}

// ─── IQ EVALUATION ──────────────────────────────────────────
export type IqBlock = "mantiq" | "sonli" | "fazoviy" | "diqqat";

export type IqResult = {
  togri: number;
  jami: number;
  umumiyPct: number;
  umumiyBand: "Yuqori" | "Yaxshi" | "O'rtacha" | "Past" | "Juda past";
  taqiq: boolean;
  bloklar: Record<IqBlock, number>; // percent per block
  bloklarRaw: Record<IqBlock, { togri: number; jami: number }>;
  rollar: Record<string, { ball: number; holat: "MOS" | "CHEGARA" | "KUCHSIZ" }>;
  engMos: string;
};

export function evaluateIq(meta: any): IqResult {
  const shuffles: number[][] | null = meta?.shuffles || null;
  const answers = meta?.answers || {};
  const unshuffled = unshuffleAnswers(answers, shuffles, QS_IQ.length);

  const bloklarRaw: Record<IqBlock, { togri: number; jami: number }> = {
    mantiq: { togri: 0, jami: 0 }, sonli: { togri: 0, jami: 0 },
    fazoviy: { togri: 0, jami: 0 }, diqqat: { togri: 0, jami: 0 },
  };
  let togri = 0;
  QS_IQ.forEach((q, i) => {
    bloklarRaw[q.blok].jami++;
    if (unshuffled[i] === q.ans) { bloklarRaw[q.blok].togri++; togri++; }
  });
  const bloklar: Record<IqBlock, number> = { mantiq: 0, sonli: 0, fazoviy: 0, diqqat: 0 };
  (Object.keys(bloklarRaw) as IqBlock[]).forEach(k => {
    const b = bloklarRaw[k];
    bloklar[k] = b.jami ? (b.togri / b.jami) * 100 : 0;
  });

  const umumiyPct = (togri / QS_IQ.length) * 100;
  const umumiyBand: IqResult["umumiyBand"] =
    umumiyPct >= 80 ? "Yuqori" :
    umumiyPct >= 65 ? "Yaxshi" :
    umumiyPct >= 50 ? "O'rtacha" :
    umumiyPct >= 40 ? "Past" : "Juda past";
  const taqiq = umumiyPct < EVAL_CONFIG.iq.umumiyPol;

  const rollar: IqResult["rollar"] = {};
  for (const [rol, weights] of Object.entries(EVAL_CONFIG.iq.roles)) {
    let ball = 0;
    for (const [blok, w] of Object.entries(weights)) ball += w * bloklar[blok as IqBlock];
    const holat =
      ball >= EVAL_CONFIG.iq.moslikMos ? "MOS" :
      ball >= EVAL_CONFIG.iq.moslikChegara ? "CHEGARA" : "KUCHSIZ";
    rollar[rol] = { ball: Math.round(ball), holat };
  }
  const engMos = Object.entries(rollar).sort((a, b) => b[1].ball - a[1].ball)[0][0];

  return { togri, jami: QS_IQ.length, umumiyPct: Math.round(umumiyPct), umumiyBand, taqiq, bloklar, bloklarRaw, rollar, engMos };
}

// ─── PERSONAL / FAROSAT EVALUATION ──────────────────────────
export type PersonalResult = {
  modulKey: string;
  modulLabel: Ml;
  coreScore: number;      // 0..30
  coreBand: "Kuchli" | "O'rtacha" | "Zaif";
  modulScore: number;     // 0..18
  modulBand: "Kuchli" | "O'rtacha" | "Zaif";
  xislatlar: Record<string, { label: Ml; pct: number }>; // trait profile, 0..100 per trait
  redFlags: Array<{ id: string; q: Ml }>;
};

export function evaluatePersonal(meta: any): PersonalResult | null {
  // Every Personal attempt is now: core (Umumiy, 10 SJT) + one position module (6 SJT) = 16 total.
  // section_key format: "personal:<posModKey>". Legacy "personal:core" attempts (single-block)
  // are still supported: coreLen falls back to the questions actually stored.
  const skey: string = meta?.section_key || "";
  const modKey = skey.startsWith("personal:") ? skey.slice("personal:".length) : "core";
  const core = QS_PERSONAL.find(m => m.key === "core");
  const posMod = QS_PERSONAL.find(m => m.key === modKey && m.key !== "core");
  const legacyModOnly = !posMod ? QS_PERSONAL.find(m => m.key === modKey) : null;
  if (!core && !posMod && !legacyModOnly) return null;

  const shuffles: number[][] | null = meta?.shuffles || null;
  const answers = meta?.answers || {};

  // Combined question sequence: core followed by position module (legacy: just the picked module).
  const seq = legacyModOnly ? legacyModOnly.qs : [...(core?.qs || []), ...(posMod?.qs || [])];
  const coreLen = meta?.personal_core_len ?? (legacyModOnly ? (modKey === "core" ? legacyModOnly.qs.length : 0) : (core?.qs.length || 0));

  const unshuffled = unshuffleAnswers(answers, shuffles, seq.length);
  let coreScore = 0, modulScore = 0;
  const traitSums: Record<string, { s: number; c: number }> = {};
  const redFlags: PersonalResult["redFlags"] = [];
  seq.forEach((q, i) => {
    const origIdx = unshuffled[i];
    if (origIdx == null) return;
    const opt = q.opts[origIdx];
    if (!opt) return;
    if (i < coreLen) coreScore += opt.pts;
    else modulScore += opt.pts;
    for (const x of q.xislat) {
      (traitSums[x] ??= { s: 0, c: 0 });
      traitSums[x].s += opt.pts;
      traitSums[x].c++;
    }
    if (RED_FLAG_IDS.has(q.id) && opt.pts === 0) redFlags.push({ id: q.id, q: q.q });
  });

  const coreBand: PersonalResult["coreBand"] =
    coreScore >= EVAL_CONFIG.personal.coreStrong ? "Kuchli" :
    coreScore >= EVAL_CONFIG.personal.coreMid ? "O'rtacha" : "Zaif";
  const modulBand: PersonalResult["modulBand"] =
    (!posMod && !legacyModOnly) || modKey === "core" ? "Kuchli" :
    modulScore >= EVAL_CONFIG.personal.modStrong ? "Kuchli" :
    modulScore >= EVAL_CONFIG.personal.modMid ? "O'rtacha" : "Zaif";

  const xislatlar: PersonalResult["xislatlar"] = {};
  for (const [k, v] of Object.entries(traitSums)) {
    xislatlar[k] = { label: XISLAT_NAMES[k] || { uz: k, ru: k, en: k }, pct: Math.round((v.s / v.c / 3) * 100) };
  }

  const modResolved = posMod || legacyModOnly || core!;
  return { modulKey: modResolved.key, modulLabel: modResolved.label, coreScore, coreBand, modulScore, modulBand, xislatlar, redFlags };
}

// ─── FINAL RECOMMENDATION ───────────────────────────────────
export type Verdict = "ISHGA_OLISH_MUMKIN" | "SINOV_BILAN" | "MOS_EMAS" | "DIQQAT" | "OLINMAYDI" | "TAVSIYA_ETILMAYDI";

export type Recommendation = {
  verdict: Verdict;
  color: "green" | "yellow" | "red";
  reason: Ml;
};

export function combinedRecommendation(iq: IqResult | null, personal: PersonalResult | null, targetRole: string | null): Recommendation {
  if (iq && iq.taqiq) {
    return { verdict: "OLINMAYDI", color: "red", reason: {
      uz: `Aqliy salohiyat pol dan past (${iq.umumiyPct}%).`,
      ru: `Умственный потенциал ниже порога (${iq.umumiyPct}%).`,
      en: `Cognitive score below floor (${iq.umumiyPct}%).`,
    }};
  }
  if (personal && personal.redFlags.length > 0) {
    return { verdict: "DIQQAT", color: "red", reason: {
      uz: `Halollik/xavfsizlik savolida qizil bayroq (${personal.redFlags.length} ta) — ishonch masalasi.`,
      ru: `Красный флаг в вопросах честности/безопасности (${personal.redFlags.length}) — вопрос доверия.`,
      en: `Red flag in honesty/safety questions (${personal.redFlags.length}) — trust concern.`,
    }};
  }
  if (personal && personal.coreBand === "Zaif") {
    return { verdict: "TAVSIYA_ETILMAYDI", color: "red", reason: {
      uz: `Farosat/ishga salohiyat o'zak balli zaif (${personal.coreScore}/30).`,
      ru: `Ядро ситуационной сообразительности слабое (${personal.coreScore}/30).`,
      en: `Core judgment/aptitude is weak (${personal.coreScore}/30).`,
    }};
  }
  if (personal && personal.modulBand === "Zaif" && personal.modulKey !== "core") {
    return { verdict: "MOS_EMAS", color: "yellow", reason: {
      uz: `Lavozim moduli bo'yicha farosat zaif (${personal.modulScore}/18).`,
      ru: `Ситуационные показатели по модулю должности слабые (${personal.modulScore}/18).`,
      en: `Position-module judgment is weak (${personal.modulScore}/18).`,
    }};
  }
  if (iq && targetRole && iq.rollar[targetRole]) {
    const holat = iq.rollar[targetRole].holat;
    if (holat === "KUCHSIZ") return { verdict: "MOS_EMAS", color: "yellow", reason: {
      uz: `${targetRole} lavozimiga aqliy moslik kuchsiz (${iq.rollar[targetRole].ball}).`,
      ru: `Умственная совместимость с ролью ${targetRole} слабая (${iq.rollar[targetRole].ball}).`,
      en: `Cognitive fit for ${targetRole} is weak (${iq.rollar[targetRole].ball}).`,
    }};
    if (holat === "CHEGARA") return { verdict: "SINOV_BILAN", color: "yellow", reason: {
      uz: `${targetRole} lavozimiga moslik chegarada (${iq.rollar[targetRole].ball}). Sinov muddati bilan.`,
      ru: `Совместимость с ролью ${targetRole} на границе (${iq.rollar[targetRole].ball}). С испытательным сроком.`,
      en: `Fit for ${targetRole} is borderline (${iq.rollar[targetRole].ball}). Recommend probation.`,
    }};
  }
  return { verdict: "ISHGA_OLISH_MUMKIN", color: "green", reason: {
    uz: "Aqliy va farosat ko'rsatkichlari yetarli.",
    ru: "Умственные и ситуационные показатели достаточные.",
    en: "Cognitive and judgment scores are sufficient.",
  }};
}

export function verdictLabel(v: Verdict, lang: Lang): string {
  const map: Record<Verdict, Ml> = {
    ISHGA_OLISH_MUMKIN: { uz: "ISHGA OLISH MUMKIN", ru: "МОЖНО НАНИМАТЬ", en: "CAN BE HIRED" },
    SINOV_BILAN:        { uz: "SINOV MUDDATI BILAN", ru: "С ИСПЫТАТЕЛЬНЫМ СРОКОМ", en: "WITH PROBATION" },
    MOS_EMAS:           { uz: "LAVOZIMGA MOS EMAS", ru: "НЕ ПОДХОДИТ НА РОЛЬ", en: "NOT A FIT FOR ROLE" },
    DIQQAT:             { uz: "DIQQAT — ISHONCH MASALASI", ru: "ВНИМАНИЕ — ВОПРОС ДОВЕРИЯ", en: "CAUTION — TRUST ISSUE" },
    OLINMAYDI:          { uz: "OLINMAYDI", ru: "НЕ НАНИМАТЬ", en: "DO NOT HIRE" },
    TAVSIYA_ETILMAYDI:  { uz: "TAVSIYA ETILMAYDI", ru: "НЕ РЕКОМЕНДУЕТСЯ", en: "NOT RECOMMENDED" },
  };
  const m = map[v];
  return lang === "ru" ? m.ru : lang === "en" ? m.en : m.uz; // uz-cyrl handled by caller with toCyrl
}
