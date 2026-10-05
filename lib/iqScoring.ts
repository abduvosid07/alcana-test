// IQ test scoring — adapted from iq_scoring.js.
// New format: 50 single-correct questions across mantiq / sonli / fazoviy / diqqat.
// Raw percentage is mapped to a 55..145 IQ-like score and bucketed into 3 bands.

import iqData from "./iqData.json";

export type IqBlock = "mantiq" | "sonli" | "fazoviy" | "diqqat";

export type IqItem = {
  id: string;
  blok: IqBlock;
  tur: "matn" | "rasm";
  savol: string;
  variantlar: string[];
  togri: number;
  izoh?: string;
  rasm_svg?: string;
};

export type IqTestData = {
  test_nomi: string;
  til: string;
  savol_soni: number;
  izoh: string;
  bloklar: Record<IqBlock, string>;
  savollar: IqItem[];
};

export const IQ_DATA = iqData as unknown as IqTestData;

export const IQ_CONFIG = {
  // IQ = 100 + (p - mid) * slope, clamped to [min,max].
  mid: 0.50,
  slope: 80,
  min: 55,
  max: 145,
  bandlar: [
    { chek: 110, nom: "Yuqori",   rang: "yashil", izoh_uz: "O'rtachadan yuqori — kuchli nomzod", izoh_ru: "Выше среднего — сильный кандидат", izoh_en: "Above average — strong candidate" },
    { chek: 90,  nom: "O'rtacha", rang: "sariq",  izoh_uz: "Norma darajasi — yaxshi",             izoh_ru: "Уровень нормы — хорошо",             izoh_en: "Within norm — good" },
    { chek: 0,   nom: "Past",     rang: "qizil",  izoh_uz: "O'rtachadan past — ehtiyot bo'ling",   izoh_ru: "Ниже среднего — осторожно",          izoh_en: "Below average — be cautious" },
  ],
  rollar: {
    Dizayner: { mantiq: 0.20, sonli: 0.15, fazoviy: 0.35, diqqat: 0.30 },
    Tseh:     { mantiq: 0.15, sonli: 0.25, fazoviy: 0.25, diqqat: 0.35 },
    Sotuvchi: { mantiq: 0.30, sonli: 0.35, fazoviy: 0.15, diqqat: 0.20 },
  } as Record<string, Record<IqBlock, number>>,
  moslikMos: 65,
  moslikChegara: 50,
};

export type IqBand = { chek: number; nom: string; rang: "yashil" | "sariq" | "qizil"; izoh_uz: string; izoh_ru: string; izoh_en: string };

const _clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const _r = (x: number) => Math.round(x);

export function rawToIQ(p: number): number {
  return _clamp(_r(100 + (p - IQ_CONFIG.mid) * IQ_CONFIG.slope), IQ_CONFIG.min, IQ_CONFIG.max);
}
export function iqBand(iq: number): IqBand {
  for (const b of IQ_CONFIG.bandlar) if (iq >= b.chek) return b as IqBand;
  return IQ_CONFIG.bandlar[IQ_CONFIG.bandlar.length - 1] as IqBand;
}

export type IqResultNew = {
  togri: number;
  jami: number;
  foiz: number;
  iq: number;
  band: IqBand;
  bloklar: Record<IqBlock, number>;             // 0-100 pct per block
  bloklarRaw: Record<IqBlock, { togri: number; jami: number }>;
  rollar: Record<string, { ball: number; holat: "MOS" | "CHEGARA" | "KUCHSIZ" }>;
  engMos: string;
};

export function baholashIQ(javoblar: Record<string, number>, test: IqTestData = IQ_DATA): IqResultNew {
  const blok: Record<IqBlock, { t: number; n: number }> = {
    mantiq: { t: 0, n: 0 }, sonli: { t: 0, n: 0 },
    fazoviy: { t: 0, n: 0 }, diqqat: { t: 0, n: 0 },
  };
  let togri = 0;
  for (const q of test.savollar) {
    const b = blok[q.blok]; if (!b) continue;
    b.n++;
    if (javoblar[q.id] === q.togri) { b.t++; togri++; }
  }
  const jami = test.savollar.length;
  const p = jami ? togri / jami : 0;
  const iq = rawToIQ(p);
  const band = iqBand(iq);
  const blokFoiz: Record<IqBlock, number> = { mantiq: 0, sonli: 0, fazoviy: 0, diqqat: 0 };
  (Object.keys(blok) as IqBlock[]).forEach(k => {
    blokFoiz[k] = blok[k].n ? _r(blok[k].t / blok[k].n * 100) : 0;
  });
  const rollar: IqResultNew["rollar"] = {};
  for (const [rol, w] of Object.entries(IQ_CONFIG.rollar)) {
    let ball = 0;
    for (const bk of Object.keys(w) as IqBlock[]) ball += w[bk] * blokFoiz[bk];
    const holat = ball >= IQ_CONFIG.moslikMos ? "MOS" : ball >= IQ_CONFIG.moslikChegara ? "CHEGARA" : "KUCHSIZ";
    rollar[rol] = { ball: _r(ball), holat };
  }
  const engMos = Object.entries(rollar).sort((a, b) => b[1].ball - a[1].ball)[0][0];
  return { togri, jami, foiz: _r(p * 100), iq, band, bloklar: blokFoiz, bloklarRaw: blok, rollar, engMos };
}
