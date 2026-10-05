// Personality (shaxsiyat / MBTI-style) test scoring — adapted from scoring_personality.js.
// Each item is answered on a 7-point Likert scale: 0 = fully agree ... 3 = neutral ... 6 = fully disagree.

import personalityData from "./personalityData.json";

export type Lang = "uz" | "uz-cyrl" | "ru" | "en";

export type PersonalityItem = {
  id: string;
  scale: string;
  key: string;
  text: { uz: string; ru: string; en: string };
};

export type PersonalityScale = {
  id: string;
  a: string;
  b: string;
  color: string;
  title: { uz: string; ru: string; en: string };
  pole: Record<string, { uz: string; ru: string; en: string }>;
  desc: Record<string, { uz: string; ru: string; en: string }>;
};

export type PersonalityType = {
  group: string;
  name: { uz: string; ru: string; en: string };
  tag: { uz: string; ru: string; en: string };
  about: { uz: string; ru: string; en: string };
  strengths?: { uz: string[]; ru: string[]; en: string[] };
  weaknesses?: { uz: string[]; ru: string[]; en: string[] };
  work?: { uz: string; ru: string; en: string };
  howto?: { uz: string; ru: string; en: string };
};

export type PersonalityData = {
  scales: PersonalityScale[];
  items: PersonalityItem[];
  types: Record<string, PersonalityType>;
  groups?: Record<string, any>;
  identity?: Record<string, any>;
  ui: Record<string, any>;
};

export const PERSONALITY_DATA = personalityData as unknown as PersonalityData;

export type PersonalityResult = {
  kod: string;        // e.g. "INFJ-A"
  tip: string;        // e.g. "INFJ"
  identity: string;   // "A" or "T"
  shkalalar: Record<string, { pole: string; pct: number; pA: number }>;
  javobSoni: number;
};

export function baholashShaxsiyat(javoblar: Record<string, number>, data: PersonalityData = PERSONALITY_DATA): PersonalityResult {
  const sh: Record<string, { sum: number; n: number }> = {};
  for (const s of data.scales) sh[s.id] = { sum: 0, n: 0 };
  for (const it of data.items) {
    const v = javoblar[it.id];
    if (v == null) continue;
    const agree = 3 - v;                            // +3 (fully agree) .. -3 (fully disagree)
    const s = data.scales.find(x => x.id === it.scale);
    if (!s) continue;
    sh[it.scale].sum += agree * (it.key === s.a ? 1 : -1);
    sh[it.scale].n++;
  }
  const shkalalar: PersonalityResult["shkalalar"] = {};
  for (const s of data.scales) {
    const m = sh[s.id].n ? sh[s.id].sum / sh[s.id].n : 0;      // -3..+3; positive = a pole
    const pA = 50 + (m / 3) * 50;
    const pole = pA >= 50 ? s.a : s.b;
    const pct = Math.round(Math.max(pA, 100 - pA));
    shkalalar[s.id] = { pole, pct, pA: Math.round(pA) };
  }
  const kod = ["EI", "NS", "TF", "JP"].map(k => shkalalar[k].pole).join("") + "-" + shkalalar.AT.pole;
  const javobSoni = Object.keys(javoblar).length;
  return { kod, tip: kod.slice(0, 4), identity: shkalalar.AT.pole, shkalalar, javobSoni };
}

export function pickL<T extends { uz: string; ru: string; en: string }>(ml: T, lang: Lang, toCyrl: (s: string) => string): string {
  if (!ml) return "";
  if (lang === "ru") return ml.ru;
  if (lang === "en") return ml.en;
  if (lang === "uz-cyrl") return toCyrl(ml.uz);
  return ml.uz;
}
