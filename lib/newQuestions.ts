// New sections: IQ test (single-correct) and Personal SJT test (weighted 0-3 pts per option).
// Fully translated to UZ / RU / EN. uz-cyrl derived at render time via toCyrl().

export type Ml = { uz: string; ru: string; en: string };
export type IqQ = { id: string; blok: "mantiq" | "sonli" | "fazoviy" | "diqqat"; q: Ml; opts: Ml[]; ans: number; svg?: string };
export type SjtOpt = { t: Ml; pts: number };
export type SjtQ = { id: string; xislat: string[]; q: Ml; opts: SjtOpt[] };
export type PersonalModule = { key: string; label: Ml; qs: SjtQ[] };

const _n = (uz: string, ru: string, en: string): Ml => ({ uz, ru, en });

// ─── IQ TEST (30 questions) ───────────────────────────────
export const QS_IQ: IqQ[] = [
  // Mantiq (8)
  { id: "A1", blok: "mantiq", q: _n("Ketma-ketlikni davom ettiring: 2, 4, 8, 16, ?", "Продолжите последовательность: 2, 4, 8, 16, ?", "Continue the sequence: 2, 4, 8, 16, ?"), opts: [_n("32","32","32"),_n("24","24","24"),_n("20","20","20"),_n("30","30","30")], ans: 0 },
  { id: "A2", blok: "mantiq", q: _n("Ketma-ketlik: 3, 6, 5, 10, 9, 18, ?", "Последовательность: 3, 6, 5, 10, 9, 18, ?", "Sequence: 3, 6, 5, 10, 9, 18, ?"), opts: [_n("19","19","19"),_n("20","20","20"),_n("36","36","36"),_n("17","17","17")], ans: 3 },
  { id: "A3", blok: "mantiq", q: _n("Ortiqchasini toping:", "Найдите лишнее:", "Find the odd one out:"), opts: [_n("Olma","Яблоко","Apple"),_n("Nok","Груша","Pear"),_n("Uzum","Виноград","Grapes"),_n("Sabzi","Морковь","Carrot")], ans: 3 },
  { id: "A4", blok: "mantiq", q: _n("Baliq — suzadi. Qush — ?", "Рыба — плавает. Птица — ?", "Fish — swims. Bird — ?"), opts: [_n("yuguradi","бегает","runs"),_n("sakraydi","прыгает","jumps"),_n("uchadi","летает","flies"),_n("suzadi","плавает","swims")], ans: 2 },
  { id: "A5", blok: "mantiq", q: _n("Barcha rassomlar ijodkor. Aziz — rassom. Demak Aziz...", "Все художники — творческие. Азиз — художник. Значит Азиз...", "All artists are creative. Aziz is an artist. So Aziz is..."), opts: [_n("sotuvchi","продавец","a salesman"),_n("ijodkor","творческий","creative"),_n("dangasa","ленивый","lazy"),_n("ijodkor emas","не творческий","not creative")], ans: 1 },
  { id: "A6", blok: "mantiq", q: _n("Ketma-ketlik: 1, 4, 9, 16, ?", "Последовательность: 1, 4, 9, 16, ?", "Sequence: 1, 4, 9, 16, ?"), opts: [_n("20","20","20"),_n("24","24","24"),_n("25","25","25"),_n("21","21","21")], ans: 2 },
  { id: "A7", blok: "mantiq", q: _n("Ortiqchasini toping:", "Найдите лишнее:", "Find the odd one out:"), opts: [_n("2","2","2"),_n("4","4","4"),_n("6","6","6"),_n("7","7","7")], ans: 3 },
  { id: "A8", blok: "mantiq", q: _n("Ali Vali dan baland. Vali Guli dan baland. Eng past kim?", "Али выше Вали. Вали выше Гули. Кто самый низкий?", "Ali is taller than Vali. Vali is taller than Guli. Who is the shortest?"), opts: [_n("Ali","Али","Ali"),_n("Vali","Вали","Vali"),_n("aniqlab bo'lmaydi","определить нельзя","cannot tell"),_n("Guli","Гули","Guli")], ans: 3 },
  // Sonli (8)
  { id: "B1", blok: "sonli", q: _n("6 ta bir xil qalam 12 000 so'm. 1 tasi qancha?", "6 одинаковых ручек — 12 000 сум. Сколько стоит одна?", "6 identical pens cost 12,000 UZS. How much is one?"), opts: [_n("2000","2000","2000"),_n("3000","3000","3000"),_n("1500","1500","1500"),_n("2400","2400","2400")], ans: 0 },
  { id: "B2", blok: "sonli", q: _n("Ishchi 1 soatda 5 ta quti yig'adi. 3 soatda nechta yig'adi?", "Рабочий собирает 5 коробок в час. Сколько за 3 часа?", "A worker packs 5 boxes per hour. How many in 3 hours?"), opts: [_n("8","8","8"),_n("10","10","10"),_n("20","20","20"),_n("15","15","15")], ans: 3 },
  { id: "B3", blok: "sonli", q: _n("2 ishchi bir ishni 4 soatda bajaradi. 4 ishchi (bir xil tezlikda) qancha vaqtda bajaradi?", "2 рабочих делают работу за 4 часа. Сколько понадобится 4 рабочим (при той же скорости)?", "2 workers finish a job in 4 hours. How long will 4 workers (same pace) take?"), opts: [_n("4 soat","4 часа","4 hours"),_n("8 soat","8 часов","8 hours"),_n("2 soat","2 часа","2 hours"),_n("1 soat","1 час","1 hour")], ans: 2 },
  { id: "B4", blok: "sonli", q: _n("Sizda 50 000 bor edi. 18 000 va 22 000 lik narsa oldingiz. Qancha qoldi?", "У вас было 50 000. Купили на 18 000 и 22 000. Сколько осталось?", "You had 50,000. You bought items for 18,000 and 22,000. How much is left?"), opts: [_n("12 000","12 000","12,000"),_n("8 000","8 000","8,000"),_n("10 000","10 000","10,000"),_n("6 000","6 000","6,000")], ans: 2 },
  { id: "B5", blok: "sonli", q: _n("Bir savatda 8 ta olma, ikkinchisida 12 ta. Birinchisidan 2 tasi ikkinchisiga o'tkazildi. Endi ikkinchisida nechta?", "В одной корзине 8 яблок, во второй 12. Из первой во вторую переложили 2. Сколько теперь во второй?", "One basket has 8 apples, another has 12. Two are moved from the first to the second. How many are in the second now?"), opts: [_n("10","10","10"),_n("14","14","14"),_n("12","12","12"),_n("16","16","16")], ans: 1 },
  { id: "B6", blok: "sonli", q: _n("Ketma-ketlik: 100, 90, 81, 73, ?", "Последовательность: 100, 90, 81, 73, ?", "Sequence: 100, 90, 81, 73, ?"), opts: [_n("66","66","66"),_n("64","64","64"),_n("65","65","65"),_n("68","68","68")], ans: 0 },
  { id: "B7", blok: "sonli", q: _n("Ish 9:00 da boshlandi, 6 soat davom etdi, o'rtada 1 soat tanaffus bo'ldi. Soat nechada tugaydi?", "Работа началась в 9:00, длилась 6 часов, был 1 час перерыва. Во сколько закончится?", "Work started at 9:00, lasted 6 hours, with a 1-hour break. When does it end?"), opts: [_n("15:00","15:00","15:00"),_n("16:00","16:00","16:00"),_n("17:00","17:00","17:00"),_n("14:00","14:00","14:00")], ans: 1 },
  { id: "B8", blok: "sonli", q: _n("Qutida 3 qizil va 2 ko'k to'p bor. Ko'zni yumib bitta olsangiz, qaysi rang chiqishi ehtimoli ko'proq?", "В коробке 3 красных и 2 синих шара. Если взять один с закрытыми глазами, какой цвет вероятнее?", "A box has 3 red and 2 blue balls. If you pick one blindly, which color is more likely?"), opts: [_n("Ko'k","Синий","Blue"),_n("Teng","Равновероятно","Equally likely"),_n("Qizil","Красный","Red"),_n("Aniqlab bo'lmaydi","Нельзя определить","Cannot tell")], ans: 2 },
  // Fazoviy (7)
  {
    id: "C1", blok: "fazoviy", q: _n("Qaysi biri boshqalaridan farq qiladi?", "Какая из них отличается от других?", "Which one is different from the others?"),
    opts: [_n("1","1","1"),_n("2","2","2"),_n("3","3","3"),_n("4","4","4")], ans: 2,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="95" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="175" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="250" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="330" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="405" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="485" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="560" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="67" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="67" y1="123" x2="123" y2="67" stroke="#333" stroke-width="2"/><rect x="222" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="222" y1="123" x2="278" y2="67" stroke="#333" stroke-width="2"/><rect x="377" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="377" y1="67" x2="433" y2="123" stroke="#333" stroke-width="2"/><rect x="532" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="532" y1="123" x2="588" y2="67" stroke="#333" stroke-width="2"/></svg>`,
  },
  {
    id: "C2", blok: "fazoviy", q: _n("Bo'sh katakka qaysi shakl mos keladi?", "Какая фигура подходит для пустой ячейки?", "Which shape fits the empty cell?"),
    opts: [_n("1","1","1"),_n("2","2","2"),_n("3","3","3"),_n("4","4","4")], ans: 0,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><line x1="95" y1="20" x2="95" y2="170" stroke="#ddd"/><line x1="20" y1="95" x2="170" y2="95" stroke="#ddd"/><circle cx="57" cy="57" r="20" fill="none" stroke="#333" stroke-width="2"/><circle cx="132" cy="57" r="20" fill="none" stroke="#333" stroke-width="2"/><circle cx="132" cy="57" r="4" fill="#333"/><rect x="38" y="113" width="38" height="38" fill="none" stroke="#333" stroke-width="2"/><text x="132" y="145" font-family="sans-serif" font-size="34" fill="#c00" text-anchor="middle">?</text><rect x="200" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="245" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="310" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="355" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="530" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="575" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="226" y="71" width="38" height="38" fill="none" stroke="#333" stroke-width="2"/><circle cx="245" cy="90" r="4" fill="#333"/><circle cx="355" cy="90" r="20" fill="none" stroke="#333" stroke-width="2"/><circle cx="355" cy="90" r="4" fill="#333"/><rect x="446" y="71" width="38" height="38" fill="none" stroke="#333" stroke-width="2"/><polygon points="575,70 595,108 555,108" fill="none" stroke="#333" stroke-width="2"/><circle cx="575" cy="94" r="4" fill="#333"/></svg>`,
  },
  {
    id: "C3", blok: "fazoviy", q: _n("Kvadratdagi bo'shliqni qaysi bo'lak to'ldiradi?", "Какой фрагмент заполнит пустое место в фигуре?", "Which piece fills the empty space in the shape?"),
    opts: [_n("1","1","1"),_n("2","2","2"),_n("3","3","3"),_n("4","4","4")], ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><path d="M20,30 L150,30 L150,110 L100,110 L100,160 L20,160 Z" fill="#eef3f8" stroke="#333" stroke-width="2"/><rect x="200" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="245" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="310" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="355" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="530" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="575" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="230" y="75" width="30" height="30" fill="#e07a3b" stroke="#333" stroke-width="2"/><rect x="330" y="65" width="50" height="50" fill="#e07a3b" stroke="#333" stroke-width="2"/><rect x="440" y="75" width="50" height="30" fill="#e07a3b" stroke="#333" stroke-width="2"/><polygon points="575,65 600,115 550,115" fill="#e07a3b" stroke="#333" stroke-width="2"/></svg>`,
  },
  {
    id: "C4", blok: "fazoviy", q: _n("Qaysi shakl ortiqcha?", "Какая фигура лишняя?", "Which shape is the odd one?"),
    opts: [_n("1","1","1"),_n("2","2","2"),_n("3","3","3"),_n("4","4","4")], ans: 3,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="95" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="175" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="250" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="330" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="405" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="485" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="560" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="67" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><rect x="216" y="73" width="68" height="44" fill="none" stroke="#333" stroke-width="2"/><polygon points="405,65 435,95 405,125 375,95" fill="none" stroke="#333" stroke-width="2"/><polygon points="560,67 590,121 530,121" fill="none" stroke="#333" stroke-width="2"/></svg>`,
  },
  {
    id: "C5", blok: "fazoviy", q: _n("Chapdagi shaklning ko'zgudagi (oyna) aksi qaysi biri?", "Какое из изображений — зеркальное отражение фигуры слева?", "Which image is the mirror reflection of the shape on the left?"),
    opts: [_n("1","1","1"),_n("2","2","2"),_n("3","3","3"),_n("4","4","4")], ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><g transform="translate(95,95) rotate(0)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><rect x="200" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="245" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="310" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="355" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="530" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="575" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><g transform="translate(245,90) rotate(90)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><g transform="translate(355,90) rotate(0)"><polygon points="-20,-35 0,-35 0,20 -35,20 -35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><g transform="translate(465,90) rotate(180)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><g transform="translate(575,90) rotate(270)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g></svg>`,
  },
  {
    id: "C6", blok: "fazoviy", q: _n("Ketma-ketlikda keyingi shakl qaysi?", "Какая фигура идёт следующей в последовательности?", "Which shape comes next in the sequence?"),
    opts: [_n("1","1","1"),_n("2","2","2"),_n("3","3","3"),_n("4","4","4")], ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="5" y="30" width="180" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><g transform="translate(37,85) rotate(0)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(92,85) rotate(90)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(147,85) rotate(180)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><text x="160" y="95" font-family="sans-serif" font-size="30" fill="#c00" text-anchor="middle">?</text><rect x="210" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="255" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="315" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="360" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="525" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="570" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><g transform="translate(255,85) rotate(0)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(360,85) rotate(270)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(465,85) rotate(90)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(570,85) rotate(45)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g></svg>`,
  },
  {
    id: "C7", blok: "fazoviy", q: _n("Rasmda nechta uchburchak bor?", "Сколько треугольников на рисунке?", "How many triangles are in the picture?"),
    opts: [_n("2","2","2"),_n("3","3","3"),_n("4","4","4"),_n("5","5","5")], ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="220" y="10" width="200" height="180" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><polygon points="320,30 250,165 390,165" fill="#eef3f8" stroke="#333" stroke-width="2"/><line x1="320" y1="30" x2="320" y2="165" stroke="#333" stroke-width="2"/></svg>`,
  },
  // Diqqat (7)
  { id: "D1", blok: "diqqat", q: _n("5 ni oling, 3 ga ko'paytiring, so'ng 5 qo'shing, so'ng 2 ga bo'ling. Natija?", "Возьмите 5, умножьте на 3, прибавьте 5, разделите на 2. Результат?", "Take 5, multiply by 3, add 5, divide by 2. Result?"), opts: [_n("10","10","10"),_n("12","12","12"),_n("15","15","15"),_n("20","20","20")], ans: 0 },
  { id: "D2", blok: "diqqat", q: _n("Ro'yxat: qizil qalam, ko'k daftar, 3 ta o'chirg'ich, sariq chizg'ich. Quyidagilardan qaysi biri ro'yxatga MOS EMAS?", "Список: красный карандаш, синяя тетрадь, 3 ластика, жёлтая линейка. Что из следующего НЕ подходит списку?", "List: red pencil, blue notebook, 3 erasers, yellow ruler. Which of the following does NOT match the list?"), opts: [_n("qizil qalam","красный карандаш","red pencil"),_n("ko'k daftar","синяя тетрадь","blue notebook"),_n("sariq chizg'ich","жёлтая линейка","yellow ruler"),_n("yashil daftar","зелёная тетрадь","green notebook")], ans: 3 },
  { id: "D3", blok: "diqqat", q: _n("«OLMA» so'zini oxiridan (teskari) o'qing. Nima chiqadi?", "Прочитайте слово «OLMA» с конца (наоборот). Что получится?", "Read the word 'OLMA' from the end (in reverse). What do you get?"), opts: [_n("AMLO","AMLO","AMLO"),_n("OLMA","OLMA","OLMA"),_n("MALO","MALO","MALO"),_n("ALMO","ALMO","ALMO")], ans: 0 },
  { id: "D4", blok: "diqqat", q: _n("Dehqonda 15 qo'y bor edi. 8 tasidan boshqasi o'ldi. Nechta qo'y tirik qoldi?", "У фермера было 15 овец. Все, кроме 8, погибли. Сколько овец осталось живыми?", "A farmer had 15 sheep. All but 8 died. How many sheep are still alive?"), opts: [_n("8","8","8"),_n("7","7","7"),_n("15","15","15"),_n("0","0","0")], ans: 0 },
  { id: "D5", blok: "diqqat", q: _n("Ko'rsatma: avval eshikni yop, keyin chiroqni o'chir, keyin chiqib ket. 2-amal qaysi?", "Инструкция: сначала закрой дверь, потом выключи свет, потом уходи. Какое действие второе?", "Instruction: first close the door, then turn off the light, then leave. What is action #2?"), opts: [_n("eshikni yopish","закрыть дверь","close the door"),_n("chiqib ketish","уйти","leave"),_n("chiroqni o'chirish","выключить свет","turn off the light"),_n("kutish","подождать","wait")], ans: 2 },
  { id: "D6", blok: "diqqat", q: _n("Quyidagi qatorda nechta 7 bor?   7  1  7  4  7  7  2  7", "Сколько семёрок в ряду?   7  1  7  4  7  7  2  7", "How many 7s are in the row?   7  1  7  4  7  7  2  7"), opts: [_n("5","5","5"),_n("4","4","4"),_n("6","6","6"),_n("3","3","3")], ans: 0 },
  { id: "D7", blok: "diqqat", q: _n("«MASHINA» so'zida nechta «A» harfi bor?", "Сколько букв «A» в слове «MASHINA»?", "How many letter 'A's are in the word 'MASHINA'?"), opts: [_n("1","1","1"),_n("2","2","2"),_n("3","3","3"),_n("4","4","4")], ans: 1 },
];

// ─── PERSONAL / FAROSAT TEST (SJT, 0-3 pts per option) ───
export const QS_PERSONAL: PersonalModule[] = [
  {
    key: "core",
    label: _n("Umumiy (barcha lavozimlar)", "Общий (для всех должностей)", "Core (for all positions)"),
    qs: [
      {
        id: "K1", xislat: ["farosat","tashabbus"],
        q: _n("Rahbar ketayotib shoshib aytdi: «Bugun muhim mehmon keladi, hammasi joyida bo'lsin» — boshqa hech narsa tushuntirmadi va chiqib ketdi.", "Уходя, руководитель на бегу сказал: «Сегодня будет важный гость, пусть всё будет на месте» — больше ничего не объяснил и вышел.", "The manager, rushing out, said: 'An important guest is coming today — make sure everything is in order' — explained nothing else and left."),
        opts: [
          { t: _n("Joyni tez tartibga keltiraman, choy-kofe tayyorlab qo'yaman; faqat mehmon soatini bir og'iz aniqlab olaman.", "Быстро наведу порядок, приготовлю чай/кофе; уточню только время визита.", "Quickly tidy up, prepare tea/coffee; just clarify the guest's ETA."), pts: 3 },
          { t: _n("Boshqa ishlarim ham bor; mehmon kelganda ko'raman, kerak bo'lsa o'shanda tez tayyorlayman.", "У меня и другие дела; когда гость придёт — тогда и займусь.", "I have other work too; when the guest arrives, I'll handle it then."), pts: 0 },
          { t: _n("Rahbarga qo'ng'iroq qilib, aniq nimalar qilishim kerakligini batafsil so'rab, ro'yxat qilib olaman.", "Позвоню руководителю и подробно спрошу, что именно нужно сделать, составлю список.", "Call the manager and ask in detail what to do, make a list."), pts: 1 },
          { t: _n("O'zim to'g'ri deb bilganimni to'liq tayyorlayman, rahbarni ortiqcha bezovga qilmayman.", "Сам подготовлю всё, что считаю нужным, лишний раз руководителя не беспокою.", "Prepare whatever I think is right and won't bother the manager."), pts: 2 },
        ],
      },
      {
        id: "K2", xislat: ["xato","oxiri"],
        q: _n("O'tgan hafta mijozga xato faylni yuborib qo'yding. Bugun yana shunga o'xshash ish tushdi.", "На прошлой неделе ты отправил клиенту неверный файл. Сегодня снова похожее задание.", "Last week you sent the client the wrong file. Today a similar task comes in again."),
        opts: [
          { t: _n("Ish ko'p, shuning uchun avvalgidek tez qilaman; xato kamdan-kam bo'ladi.", "Работы много, поэтому делаю быстро как обычно; ошибки бывают редко.", "There's a lot of work, so I'll do it fast as before; errors are rare."), pts: 0 },
          { t: _n("Yuborishdan oldin faylni ochib, nomi va mazmunini tekshiradigan kichik odat qildim — shunga amal qilaman.", "Ввёл привычку перед отправкой открывать файл и проверять имя и содержимое — следую ей.", "I made it a habit to open the file and check name/content before sending — I'll follow it."), pts: 3 },
          { t: _n("Yuborishdan oldin imkon bo'lsa hamkasbdan bir ko'z tashlab berishini so'rayman.", "Перед отправкой попрошу коллегу глянуть, если возможно.", "Before sending, I'll ask a colleague to have a look if possible."), pts: 1 },
          { t: _n("Bu safar juda diqqat bilan, shoshmasdan qilaman.", "В этот раз сделаю очень внимательно, не торопясь.", "This time I'll do it very carefully, without rushing."), pts: 2 },
        ],
      },
      {
        id: "K3", xislat: ["oxiri","farosat","bosim"],
        q: _n("Shoshilinch buyurtma, muddat tor — ishni to'liq sifatli qilishga vaqt yetmaydi.", "Срочный заказ, срок сжатый — на полное качественное выполнение времени не хватает.", "Urgent order, tight deadline — not enough time to do everything at full quality."),
        opts: [
          { t: _n("Sifatni buzmaslik uchun muddatni biroz kechiktiraman, ishni to'liq qilaman.", "Чтобы не потерять качество, немного задержу срок, но сделаю всё полностью.", "To keep quality, I'll push the deadline a bit and do it fully."), pts: 1 },
          { t: _n("Muddatga yetkazish uchun tez qilaman; tashqi ko'rinishi joyida bo'lsa, mijoz sezmasligi mumkin.", "Чтобы успеть, сделаю быстро; если внешне выглядит нормально — клиент может и не заметить.", "To meet the deadline, do it fast; if it looks OK on the outside the client may not notice."), pts: 0 },
          { t: _n("Eng muhim qismini sifatli qilaman, sifatga ta'sir qiladigan joyni rahbarga aytib, eng tez xavfsiz yo'lni taklif qilaman.", "Главное сделаю качественно, о рисковых для качества местах предупрежу руководителя и предложу самый быстрый безопасный путь.", "Do the most important part with quality, warn the manager about quality-critical parts, propose the fastest safe path."), pts: 3 },
          { t: _n("Rahbardan qo'shimcha vaqt so'rab, nega kerakligini tushuntiraman.", "Попрошу у руководителя дополнительное время и объясню, почему нужно.", "Ask the manager for extra time and explain why it's needed."), pts: 2 },
        ],
      },
      {
        id: "K4", xislat: ["tashabbus","halollik"],
        q: _n("Bir ish e'tibordan chetda qolyapti — texnik jihatdan bu sening vazifang emas, lekin qilinmasa mijoz zarar ko'radi.", "Одна задача выпадает из внимания — формально не твоя, но если её не сделать, клиент пострадает.", "A task is falling through the cracks — technically not yours, but if it's not done, the client loses."),
        opts: [
          { t: _n("Har kim o'z ishini qilsa yaxshi; men o'z vazifamga e'tibor beraman.", "Пусть каждый занимается своим; я — своим.", "Everyone should mind their own work; I'll focus on mine."), pts: 0 },
          { t: _n("Kuzatib turaman; muammo kattalashsa, o'shanda aralashaman.", "Понаблюдаю; если проблема вырастет — вмешаюсь.", "I'll watch; if the problem grows, I'll step in."), pts: 1 },
          { t: _n("Bu ishning mas'uli aniq bor; unga eslatib qo'yaman, qolganini o'zi hal qiladi.", "У этой задачи есть ответственный; напомню ему, остальное — его дело.", "There's an owner for this; I'll remind them, the rest is on them."), pts: 2 },
          { t: _n("Eplasam o'zim qilaman, eplamasam darrov mas'ul odamni yoki rahbarni ogohlantiraman.", "Смогу — сделаю сам, не смогу — сразу предупрежу ответственного или руководителя.", "If I can, I'll do it; if not, I'll immediately alert the owner or manager."), pts: 3 },
        ],
      },
      {
        id: "K5", xislat: ["halollik","xato"],
        q: _n("Sening sababingdan bir ish buzildi (masalan, material isrof bo'ldi). Hali hech kim sezmagan.", "По твоей вине что-то испортилось (например, материал ушёл впустую). Никто пока не заметил.", "Something got broken because of you (e.g., material wasted). Nobody has noticed yet."),
        opts: [
          { t: _n("Rahbarga o'zim darrov aytaman: nima bo'ldi va qanday to'g'rilashni ham aytaman.", "Сразу сам скажу руководителю: что случилось и как это исправить.", "I'll tell the manager right away myself: what happened and how to fix it."), pts: 3 },
          { t: _n("To'g'rilayman; keyin so'rab qolishsa, bo'lgan voqeani aytaman.", "Исправлю; если спросят — тогда и расскажу.", "I'll fix it; if asked, then I'll tell what happened."), pts: 1 },
          { t: _n("O'zim to'g'rilab qo'yaman; muammo hal bo'lgach, alohida aytib o'tirishning hojati yo'q.", "Сам всё исправлю; после решения проблемы отдельно рассказывать не нужно.", "I'll fix it myself; once solved, no need to say anything separately."), pts: 0 },
          { t: _n("Avval o'zim jimgina to'g'rilayman, keyin rahbarga bo'lib o'tgan voqeani aytaman.", "Сначала тихо исправлю сам, потом расскажу руководителю о случившемся.", "First I'll quietly fix it myself, then tell the manager what happened."), pts: 2 },
        ],
      },
      {
        id: "K6", xislat: ["tashabbus","oxiri"],
        q: _n("Ishing erta tugadi, rahbar yo'q, atrofda ochiq turgan boshqa ish ham bor.", "Работа закончилась рано, руководителя нет, рядом есть незакрытые задачи.", "Your work finished early, the manager isn't around, there are open tasks nearby."),
        opts: [
          { t: _n("Kimdir yordam so'rasa yordam beraman, o'zim tashabbus ko'rsatib yugurmayman.", "Если кто-то попросит помощь — помогу, сам инициативу не проявляю.", "If someone asks for help I'll help, but I won't jump in on my own."), pts: 2 },
          { t: _n("O'zim foydali keyingi ishni topaman yoki bir joyni yaxshilayman.", "Сам найду полезную задачу или улучшу что-то в процессе.", "I'll find a useful next task or improve something."), pts: 3 },
          { t: _n("Ishimni sifatli tugatdim; endi biroz dam olib, keyingi topshiriqni kutaman.", "Свою работу выполнил качественно; теперь немного отдохну и дождусь следующего задания.", "I finished my work well; now I'll rest a bit and wait for the next task."), pts: 1 },
          { t: _n("Ishim tugadi, shuning uchun shaxsiy ishlarim bilan shug'ullanaman yoki ertaroq chiqaman.", "Работа готова, поэтому займусь личными делами или уйду пораньше.", "My work is done, so I'll do personal things or leave earlier."), pts: 0 },
        ],
      },
      {
        id: "K7", xislat: ["farosat","bosim"],
        q: _n("Bir vaqtning o'zida ikkita shoshilinch ish tushdi, ikkovini birga qilib bo'lmaydi.", "Одновременно поступили две срочные задачи, обе одновременно сделать нельзя.", "Two urgent tasks land at the same time; you can't do both at once."),
        opts: [
          { t: _n("Ikkalasi ham shoshilinch, shuning uchun rahbardan qaysi birini birinchi qilishni so'rayman.", "Оба срочные — спрошу руководителя, что делать первым.", "Both are urgent, so I'll ask the manager which to do first."), pts: 2 },
          { t: _n("Osonrog'ini avval tugataman — bittasi tez bitsa, boshim yengil bo'ladi.", "Сначала закончу более простую — как одну закрою, легче станет.", "I'll finish the easier one first — closing one lightens the load."), pts: 1 },
          { t: _n("Qaysi biri ko'proq zarar/foyda keltirishini o'ylab, muhimrog'ini boshlayman, ikkinchisi haqida tegishli odamni ogohlantiraman.", "Прикину, где больший вред/польза, начну с важной; о второй предупрежу нужного человека.", "Weigh which has bigger impact, start the more important one; warn the right person about the other."), pts: 3 },
          { t: _n("Ikkalasini bir vaqtda ulgurishga urinaman, ikkisi ham vaqtida tugasin.", "Попробую делать оба параллельно, чтобы успеть.", "I'll try to do both in parallel so both finish on time."), pts: 0 },
        ],
      },
      {
        id: "K8", xislat: ["muloqot","halollik","bosim"],
        q: _n("Buyurtma kechikishini oldindan bilib qolding. Mijozga xabar berish sening zimmangda.", "Ты заранее узнал, что заказ будет с опозданием. Сообщать клиенту — твоя задача.", "You've found out in advance that the order will be late. Notifying the client is on you."),
        opts: [
          { t: _n("Aniq yangi muddat qo'limda bo'lgach xabar beraman — mijozga aniq narsa aytganim ma'qul.", "Сообщу, когда будет точный новый срок — лучше говорить клиенту конкретику.", "I'll tell them once I have a firm new date — better to give the client something concrete."), pts: 2 },
          { t: _n("Ba'zan kechikish o'z-o'zidan hal bo'ladi; muddatga yaqin hali ham kech bo'lsa, o'shanda aytaman.", "Иногда всё рассасывается; если к сроку всё ещё опаздывает — тогда и сообщу.", "Sometimes delays resolve on their own; if it's still late near the deadline I'll say then."), pts: 1 },
          { t: _n("Mijozni ortiqcha xavotirga qo'ymaslik uchun «tayyor bo'lyapti» deb turaman, orqada masalani hal qilaman.", "Чтобы не тревожить клиента, говорю «делается», а сзади решаю вопрос.", "To avoid worrying the client, I say 'it's being prepared' and handle it behind the scenes."), pts: 0 },
          { t: _n("Mijozga oldindan ochiq aytaman: kechikadi, sababi shu, mana variantlar.", "Открыто предупреждаю клиента заранее: опаздывает, причина такая, вот варианты.", "I tell the client upfront: it'll be late, here's why, here are the options."), pts: 3 },
        ],
      },
      {
        id: "K9", xislat: ["farosat","muloqot"],
        q: _n("Rahbar (yoki mijoz) aniq ko'rsatma berdi, lekin sen uni biroz noto'g'ri deb o'ylayapsan.", "Руководитель (или клиент) дал чёткое указание, но ты считаешь его частично неверным.", "The manager (or client) gave a clear instruction, but you think it's a bit off."),
        opts: [
          { t: _n("Aytilganday qilaman, lekin oldin xavotirimni bir og'iz aytaman: «shunday qilsak, mana bu bo'lishi mumkin — baribir shundaymi?»", "Сделаю как сказали, но сначала озвучу опасение: «если так, может случиться вот это — всё равно так?»", "I'll do as told but first voice my concern: 'if we do this, X might happen — still go ahead?'"), pts: 3 },
          { t: _n("O'z fikrimni tushuntirib, to'g'ri deb bilganimni qabul qildirishga harakat qilaman.", "Объясню свою позицию и постараюсь убедить принять то, что считаю правильным.", "I'll explain my view and try to get my preferred option accepted."), pts: 1 },
          { t: _n("Aytilganday, so'zsiz bajaraman — buyruq shunday bo'lgach, o'ylaganim o'zimda qoladi.", "Молча выполню, как сказали — раз указание такое, мнение оставлю при себе.", "I'll do it silently as told — since it's an instruction, my opinion stays with me."), pts: 2 },
          { t: _n("Men tajribamdan yaxshiroq yo'lni bilaman; shu bo'yicha qilib qo'yaman, natija yaxshi chiqsa hamma rozi bo'ladi.", "Из опыта знаю лучший путь; сделаю по-своему — если результат хороший, все будут довольны.", "I know a better way from experience; I'll do it my way — if it works out, everyone's happy."), pts: 0 },
        ],
      },
      {
        id: "K10", xislat: ["tashabbus","xato"],
        q: _n("Bir ishni qanday qilishni bilmaysan.", "Ты не знаешь, как выполнить одну задачу.", "You don't know how to do a task."),
        opts: [
          { t: _n("Bu ish menikidan tajribaliroq odamniki; uni so'rab, o'sha qilib bergani ma'qul.", "Эта работа для более опытного; пусть он и сделает.", "This is for someone more experienced; better let them do it."), pts: 0 },
          { t: _n("Avval o'zim yo'lini topishga urinaman; chindan tiqilib qolsam, aniq savol bilan so'rayman.", "Сначала сам поищу решение; если реально застряну — задам конкретный вопрос.", "First I'll try to figure it out myself; if truly stuck, I'll ask a specific question."), pts: 3 },
          { t: _n("Vaqt ketmasligi uchun darrov biladiganidan so'rab, ko'rsatib berishini iltimos qilaman.", "Чтобы не терять время, сразу попрошу знающего показать.", "To save time, immediately ask someone who knows to show me."), pts: 1 },
          { t: _n("O'zimcha bir urinib ko'raman; bo'lmasa, qilinganini ko'rsatib, qayeri xato bo'lganini so'rayman.", "Попробую сам; если не выйдет — покажу сделанное и спрошу, где ошибка.", "I'll try myself; if it doesn't work, I'll show what I did and ask where it went wrong."), pts: 2 },
        ],
      },
    ],
  },
  {
    key: "sotuv",
    label: _n("Sotuv bo'limi", "Отдел продаж", "Sales"),
    qs: [
      {
        id: "S1", xislat: ["tashabbus","muloqot"],
        q: _n("Yaxshi lid bir necha kun javob bermay qo'ydi (o'qigan, lekin jim).", "Хороший лид несколько дней не отвечает (прочитал, но молчит).", "A good lead has gone silent for several days (read but no reply)."),
        opts: [
          { t: _n("Qiziqqanida o'zi yozadi; bosim qilmay, bazamda saqlab qo'yaman.", "Захочет — сам напишет; не давлю, оставляю в базе.", "They'll write when interested; no pressure, I'll keep them in the base."), pts: 0 },
          { t: _n("Bir marta qisqa «qanday qaror qildingiz?» deb yozaman.", "Один раз коротко напишу «какое решение приняли?»", "Send one short 'what have you decided?' note."), pts: 2 },
          { t: _n("Javob berishga arziydigan sabab beraman: yangi imkoniyat/narx yoki savoliga aniqlik bilan yozaman.", "Дам повод для ответа: новая возможность/цена или точный ответ на его вопрос.", "Give them a reason to reply: a new offer/price or a precise answer to their question."), pts: 3 },
          { t: _n("Bir-ikki kunda bir «assalomu alaykum, eslatib o'tayapman» deb yozib turaman.", "Каждый день-другой пишу «здравствуйте, напоминаю о себе».", "Every day or two, I keep sending 'hello, just reminding you'."), pts: 1 },
        ],
      },
      {
        id: "S2", xislat: ["farosat","halollik"],
        q: _n("Mijoz sen ruxsat bera olmaydigan katta chegirma so'rayapti.", "Клиент просит большую скидку, которую ты не вправе давать.", "The client is asking for a big discount you're not authorized to give."),
        opts: [
          { t: _n("Mijozni yo'qotmaslik uchun «hal qilamiz, chegirma bo'ladi» deb ishontirib, keyin imkonini izlayman.", "Чтобы не упустить клиента, заверю «решим, скидка будет», а потом найду способ.", "To keep the client, promise 'we'll figure it out, you'll get the discount', then look for a way."), pts: 0 },
          { t: _n("Bu masalani rahbarga yo'naltiraman, chunki narx qarori uniki.", "Передам вопрос руководителю — решение по цене за ним.", "Escalate to the manager — pricing decisions are theirs."), pts: 2 },
          { t: _n("Chegirma vakolatim yo'q; buni ochiq aytib, «narx shu» deb qat'iy turaman.", "Полномочий давать скидку нет; открыто скажу и твёрдо буду держать цену.", "I don't have discount authority; say so openly and hold the price firmly."), pts: 1 },
          { t: _n("Chegirma va'da qilmayman, qiymatni tushuntiraman; kerak bo'lsa mas'uldan aniqlab, muqobil variant taklif qilaman.", "Скидку не обещаю, объясню ценность; при необходимости уточню у ответственного и предложу альтернативу.", "No discount promises; explain value; if needed check with the authorized person and propose an alternative."), pts: 3 },
        ],
      },
      {
        id: "S3", xislat: ["muloqot","bosim","halollik"],
        q: _n("Mijoz kechikish uchun jahli chiqdi — aybdor sen emassan, tseh kechiktirdi.", "Клиент злится из-за задержки — виноват не ты, задержал цех.", "The client is furious about a delay — it's not your fault, production caused it."),
        opts: [
          { t: _n("Aloqani o'z zimmamga olaman: noqulaylik uchun uzr, aniq holatni bilib, real muddat va yechim beraman.", "Беру коммуникацию на себя: извиняюсь, узнаю ситуацию, даю реальный срок и решение.", "Take ownership of comms: apologize, learn the situation, give a realistic date and solution."), pts: 3 },
          { t: _n("Mijozga rostini aytaman: kechikish ishlab chiqarish tomonidan bo'ldi, men bog'liq emasman.", "Скажу клиенту правду: задержка со стороны производства, я тут ни при чём.", "Tell the client the truth: production caused it, I'm not to blame."), pts: 0 },
          { t: _n("Avval ishlab chiqarishdan aniq holatni bilib, keyin mijozga real ma'lumot bilan qaytaman.", "Сначала уточню у производства, потом вернусь к клиенту с реальной информацией.", "First check with production, then come back to the client with real info."), pts: 2 },
          { t: _n("Uzr so'rab, «tez orada hal bo'ladi» deb tinchitib, orqada tezlashtirishga urinaman.", "Извинюсь, успокою «скоро решится», сзади пытаюсь ускорить.", "Apologize and calm them with 'soon', then push to speed things up in the background."), pts: 1 },
        ],
      },
      {
        id: "S4", xislat: ["halollik"],
        q: _n("Sen bir savdoni «bo'ldi» deb belgilab qo'ymoqchisan, lekin mijoz hali to'lamagan/tasdiqlamagan. Oylik hisobotga o'sha savdo kiradi.", "Ты хочешь пометить сделку как «завершённую», но клиент ещё не оплатил/не подтвердил. Она попадает в месячный отчёт.", "You want to mark a sale as 'closed' but the client hasn't paid/confirmed yet. It goes into the monthly report."),
        opts: [
          { t: _n("Kiritaman, lekin yoniga «hali tasdiqlanmagan» izohini qo'shaman.", "Внесу, но добавлю пометку «ещё не подтверждено».", "Include it but add a note 'not yet confirmed'."), pts: 2 },
          { t: _n("Aniq holatni belgilayman: hali tasdiqlanmagan — hisobot rost bo'lishi kerak.", "Отмечу точно: не подтверждено — отчёт должен быть честным.", "Mark it accurately: not confirmed — the report should be honest."), pts: 3 },
          { t: _n("Aniq bilmayman; odatda qanday qoldirsam, shundayligicha qoldiraman.", "Не уверен; оставлю как обычно.", "Not sure; leave it however I usually do."), pts: 1 },
          { t: _n("Deyarli aniq bo'ladigan savdo, shuning uchun hisobotga kiritaman; oxirida o'zi to'g'rilanadi.", "Сделка почти точно состоится, поэтому внесу — потом само выровняется.", "The deal is nearly certain, so I'll include it; it'll sort itself out."), pts: 0 },
        ],
      },
      {
        id: "S5", xislat: ["tashabbus"],
        q: _n("Kun sokin, yangi lid kam.", "День тихий, новых лидов мало.", "It's a quiet day, few new leads."),
        opts: [
          { t: _n("Bo'sh vaqtdan foydalanib, hujjat va bazani tartibga solaman.", "Использую свободное время: приведу в порядок документы и базу.", "Use free time to tidy up documents and the base."), pts: 2 },
          { t: _n("Yangi lidlar kelishini kutib, kelgan zahoti tez javob berishga tayyor turaman.", "Жду новых лидов, готов быстро отвечать.", "Wait for new leads, ready to respond quickly."), pts: 1 },
          { t: _n("Eski mijozlarni qayta jonlantiraman, bazani ko'rib chiqaman, marketingdan yangi yondashuv so'rayman.", "Реактивирую старых клиентов, пересмотрю базу, попрошу у маркетинга новый подход.", "Re-engage old clients, review the base, ask marketing for a new approach."), pts: 3 },
          { t: _n("Bugun oqim sust; sun'iy ish yaratgandan ko'ra tabiiy lid kelishini kutaman.", "Поток слабый; лучше подожду естественных лидов, чем создавать работу искусственно.", "Flow is weak; better wait for natural leads than manufacture work."), pts: 0 },
        ],
      },
      {
        id: "S6", xislat: ["halollik","farosat"],
        q: _n("Mijoz kompaniya yaxshi eplamaydigan yoki o'z vaqtida bera olmaydigan narsani so'rayapti.", "Клиент просит то, что компания плохо делает или не успевает выполнить в срок.", "The client wants something the company doesn't do well or can't deliver on time."),
        opts: [
          { t: _n("«Buni biz yaxshi eplamaymiz» deb ochiq aytib, buyurtmadan voz kechaman.", "Открыто скажу «это не наша сильная сторона» и откажусь от заказа.", "Openly say 'this isn't our strong suit' and pass on the order."), pts: 1 },
          { t: _n("Buyurtmani yo'qotmaslik uchun «ha, qilamiz» deb olaman, keyin bir amallaymiz.", "Чтобы не упустить заказ, скажу «сделаем», а там как-нибудь.", "To not lose the deal, say 'yes, we'll do it', then wing it."), pts: 0 },
          { t: _n("Rahbardan so'rab, buni olish-olmaslikni u hal qilsin.", "Спрошу руководителя — пусть решает.", "Ask the manager to decide whether to take it."), pts: 2 },
          { t: _n("Moslik haqida halol bo'laman, real eplaydigan variantni taklif qilaman.", "Буду честен насчёт соответствия, предложу реалистичный вариант.", "Be honest about the fit, propose a realistic alternative."), pts: 3 },
        ],
      },
    ],
  },
  {
    key: "oshpaz",
    label: _n("Oshpaz", "Повар", "Chef"),
    qs: [
      {
        id: "O1", xislat: ["oxiri","farosat"],
        q: _n("Tushlik (obed) belgilangan vaqtda tayyor bo'lishi kerak, lekin bugun orqada qolyapsan.", "Обед должен быть готов вовремя, но сегодня ты отстаёшь.", "Lunch has to be ready on time, but today you're behind."),
        opts: [
          { t: _n("Asosiy taomni o'z vaqtida chiqarishga urinaman; kerak bo'lsa garnir/salatni soddalashtiraman, biroz kechiksa oldindan aytaman.", "Главное блюдо стараюсь подать вовремя; при необходимости упрощу гарнир/салат; о небольшом опоздании предупрежу заранее.", "Try to serve the main course on time; simplify sides if needed; warn in advance if a bit late."), pts: 3 },
          { t: _n("Ulgurish uchun olovni ko'tarib tez pishiraman; ustidan tayyor ko'rinsa, chiqaraveraman.", "Чтобы успеть, увеличу огонь; если сверху выглядит готовым — подаю.", "Crank the heat to catch up; if it looks done on top, serve it."), pts: 0 },
          { t: _n("Sifat buzilmasin deb shoshmayman; taom biroz kech bo'lsa ham to'liq pishirib beraman.", "Чтобы качество не пострадало, не тороплюсь; подам чуть позже, зато готово полностью.", "Won't rush to preserve quality; serve a bit late but fully cooked."), pts: 1 },
          { t: _n("Kechikayotganimni oldindan aytaman va necha daqiqa kechishini bildiraman.", "Заранее сообщу об опоздании и укажу, на сколько минут.", "Warn about the delay in advance and say by how many minutes."), pts: 2 },
        ],
      },
      {
        id: "O2", xislat: ["tozalik","halollik"],
        q: _n("Idish yoki qozon ko'zga toza ko'rinadi, lekin sen uni to'liq yuvmaganingni bilasan.", "Посуда/казан выглядит чистой, но ты знаешь, что помыл не до конца.", "The dish or pot looks clean, but you know you didn't wash it thoroughly."),
        opts: [
          { t: _n("Hozir band bo'lganim uchun chetga qo'yaman, keyin bo'sh vaqtda yaxshilab yuvaman.", "Сейчас занят — отложу и позже помою как следует.", "Set aside for now since I'm busy, wash properly when free."), pts: 2 },
          { t: _n("Qaytadan yaxshilab yuvaman — ko'rinishi emas, tozaligi muhim.", "Помою ещё раз тщательно — важен не вид, а чистота.", "Rewash thoroughly — cleanliness matters, not appearance."), pts: 3 },
          { t: _n("Issiq suv bilan bir chayib olaman, shu yetarli bo'ladi.", "Ополосну горячей водой — этого достаточно.", "Rinse with hot water; that's enough."), pts: 1 },
          { t: _n("Ko'zga toza ko'rinsa, artib ustidan chayib ishlataveraman — vaqt tejaladi.", "Если выглядит чисто — протру, ополосну и работаю дальше, экономлю время.", "If it looks clean, wipe, rinse and keep going — saves time."), pts: 0 },
        ],
      },
      {
        id: "O3", xislat: ["sifat","halollik"],
        q: _n("Holodilnikdagi mahsulot buzila boshlaganini sezding — aynan shuni pishirmoqchi eding.", "Заметил, что продукт в холодильнике начинает портиться — именно его собирался готовить.", "You've noticed a product in the fridge is starting to go bad — the one you were about to cook."),
        opts: [
          { t: _n("Ishlatmayman, boshqa narsa pishiraman — buzuqni chiqarib tashlayman.", "Не буду использовать, приготовлю что-то другое — испорченное выбросить.", "Won't use it, cook something else — throw the bad one out."), pts: 2 },
          { t: _n("Hidlab, ko'rib ko'raman; unchalik yomon bo'lmasa, ozgina ishlataman.", "Понюхаю, посмотрю; если не сильно — использую чуть-чуть.", "Smell and look; if not too bad, use a little."), pts: 1 },
          { t: _n("Buni ishlatmayman, menyuni o'zgartiraman va yangisini olish kerakligini aytaman.", "Не использую, поменяю меню и сообщу, что нужно купить свежее.", "Don't use it, change the menu, and say we need a fresh one."), pts: 3 },
          { t: _n("Yaxshilab pishirsam issiqda hammasi o'ladi; shuning uchun ishlataveraman.", "Если хорошо приготовить — на жаре всё погибнет; так что использую.", "If cooked well the heat will kill everything, so I'll use it."), pts: 0 },
        ],
      },
      {
        id: "O4", xislat: ["oxiri","tozalik"],
        q: _n("Obeddan keyin idishlar ko'p, kechki tayyorgarlik ham boshiga tushib turibdi.", "После обеда посуды много, вечерняя подготовка тоже наваливается.", "After lunch there's lots of dishes, and evening prep is piling on."),
        opts: [
          { t: _n("Tez yuvib olaman, lekin joyiga terishni ish tugagach, kechqurun qilaman.", "Быстро помою, но расставлю по местам вечером после работы.", "Wash quickly, put things away in the evening after work."), pts: 2 },
          { t: _n("Kechki zichlik tufayli idishlarni bir joyga yig'ib qo'yaman, imkon bo'lganda yuvaman.", "Из-за вечерней загрузки сложу посуду в кучу, помою когда получится.", "Given the evening load, pile the dishes up, wash them when I can."), pts: 0 },
          { t: _n("Eng kerakli idishlarni yuvaman, qolganini keyinga qoldiraman.", "Помою самое нужное, остальное — потом.", "Wash what's essential, leave the rest for later."), pts: 1 },
          { t: _n("Idishlarni yuvib joyiga qo'yaman — keyingi ovqatga toza oshxona kerak, bu qoldirilmaydi.", "Помою и расставлю — к следующей готовке нужна чистая кухня, это не откладывается.", "Wash and put away — the next meal needs a clean kitchen, no delaying this."), pts: 3 },
        ],
      },
      {
        id: "O5", xislat: ["tashabbus"],
        q: _n("Gaz yoki biror mahsulot tugab qolish arafasida ekanini sezding.", "Заметил, что газ или какой-то продукт вот-вот закончится.", "You've noticed gas or a product is about to run out."),
        opts: [
          { t: _n("Tugashini kutmasdan, mas'ul odamga oldindan aytaman — vaqtida to'ldirilsin.", "Не жду, пока закончится — заранее говорю ответственному, чтобы пополнили вовремя.", "Don't wait for it to run out — tell the responsible person in advance to restock in time."), pts: 3 },
          { t: _n("Hali ozgina bor; butunlay tugaganda aytaman, shunda aniq bo'ladi.", "Ещё есть немного; скажу когда закончится совсем, тогда точно.", "There's still a bit; I'll say when it's fully gone, then it's certain."), pts: 0 },
          { t: _n("Kamayganini ko'rsam, imkon topib mas'ulga aytaman.", "Как замечу нехватку — при случае скажу ответственному.", "When I notice it's low, tell the responsible person when I get a chance."), pts: 2 },
          { t: _n("O'zim eslab qo'yaman, keyingi bozorlikda aytishga urinaman.", "Запомню сам, попробую сказать при следующей закупке.", "I'll remember it myself, try to mention it at the next shopping run."), pts: 1 },
        ],
      },
      {
        id: "O6", xislat: ["tozalik","tashabbus"],
        q: _n("Gaz plita yoki mikrovalnovka iflos — ehtimol sen iflos qilmagansan.", "Плита или микроволновка грязная — возможно, не ты испачкал.", "The stove or microwave is dirty — probably not by you."),
        opts: [
          { t: _n("O'z joyimni tozalayman, umumiy joyni asosiy tozalash vaqtida qilaman.", "Своё место убираю, общее — во время общей уборки.", "I clean my area; shared spots during general cleaning."), pts: 2 },
          { t: _n("Oshxona tartibi mening zimmamda; kim iflos qilganidan qat'i nazar, tozalab qo'yaman.", "Порядок на кухне на мне; кто бы ни испачкал — уберу.", "Kitchen order is on me; no matter who dirtied it, I'll clean it."), pts: 3 },
          { t: _n("Iflos qilgan odam o'zi tozalasa to'g'ri bo'ladi; men faqat o'zim ishlatgan joyni tozalayman.", "Правильно, если уберёт тот, кто испачкал; я убираю только за собой.", "Whoever made the mess should clean it; I only clean my own area."), pts: 0 },
          { t: _n("Vaqtim bo'lganda umumiy tozalikni ham qilaman, hozir o'z ishimga ulguray.", "Общей уборкой займусь когда будет время; сейчас справлюсь со своим.", "I'll do general cleaning when I have time; for now, finish my own work."), pts: 1 },
        ],
      },
    ],
  },
  {
    key: "ai",
    label: _n("AI menejer", "AI-менеджер", "AI manager"),
    qs: [
      {
        id: "AM1", xislat: ["muloqot","farosat"],
        q: _n("Rahbar (texnik bilimi yo'q) sen qurgan avtomatlashtirish haqida so'radi: «bu qanday ishlaydi?»", "Руководитель (без технического бэкграунда) спрашивает про твою автоматизацию: «как это работает?»", "The manager (non-technical) asks about your automation: 'how does it work?'"),
        opts: [
          { t: _n("Tizim qanday qurilganini batafsil aytaman: n8n, OData, webhook — qanchalik murakkab ekanini ko'rsataman.", "Подробно расскажу устройство: n8n, OData, webhook — покажу, насколько это сложно.", "Explain in detail how it's built: n8n, OData, webhook — showing how complex it is."), pts: 0 },
          { t: _n("Natijani ko'rsataman: mana hisobot o'zi chiqdi, mana lidlar CRMga tushdi.", "Покажу результат: вот отчёт вышел сам, вот лиды упали в CRM.", "Show the result: here's the auto-generated report, here are leads landing in CRM."), pts: 2 },
          { t: _n("Sodda til bilan, biznes foydasini tushuntiraman: nima ishni tezlashtiradi, qancha vaqt tejaydi — atamalarsiz.", "Простым языком объясню бизнес-пользу: что ускоряет, сколько времени экономит — без терминов.", "In plain language, explain the business value: what it speeds up, time saved — no jargon."), pts: 3 },
          { t: _n("«Murakkab narsa, ishlayapti — ishonavering» deb qisqa qilaman.", "«Сложная штука, работает — доверьтесь» — коротко.", "Say briefly: 'complicated thing, it works — trust me'."), pts: 1 },
        ],
      },
      {
        id: "AM2", xislat: ["halollik","xato"],
        q: _n("Botning oylik savdo hisoboti bir raqamni haqiqatdan katta ko'rsatyapti — nimadir noto'g'riday.", "Месячный отчёт бота показывает число значительно выше реального — что-то не так.", "The bot's monthly sales report shows a number visibly higher than reality — something looks off."),
        opts: [
          { t: _n("Yuboraman, lekin «bu raqamni bir tekshirib ko'ring» deb izoh qo'shaman.", "Отправлю, но с пометкой «проверьте эту цифру».", "Send it with a note 'please check this number'."), pts: 2 },
          { t: _n("Tizim avtomatik hisoblagan, demak to'g'ri; shundayligicha yuboraman.", "Автоматика посчитала — значит верно; отправлю как есть.", "The system computed it, so it must be right; send as is."), pts: 0 },
          { t: _n("Raqamni o'zim mantiqan to'g'riroq ko'ringan songa tuzatib yuboraman.", "Сам подправлю на число, которое кажется логичнее, и отправлю.", "Adjust the number to what seems logical and send it."), pts: 1 },
          { t: _n("Rahbarga yubormasdan oldin manba (1C) bilan solishtirib tekshiraman, xatoni topaman.", "Перед отправкой руководителю сверю с источником (1C), найду ошибку.", "Before sending to the manager, cross-check with the source (1C) and find the bug."), pts: 3 },
        ],
      },
      {
        id: "AM3", xislat: ["farosat","tashabbus"],
        q: _n("Yangi zo'r AI vosita topding. Ayni paytda savdo rejadan ancha past.", "Ты нашёл классный новый AI-инструмент. При этом продажи сильно ниже плана.", "You've found a great new AI tool. Meanwhile, sales are well below plan."),
        opts: [
          { t: _n("Hozir savdoni ko'taradigan ishga e'tibor beraman; bu vositani faqat shunga foydasi bo'lsa olaman.", "Сейчас сосредоточусь на подъёме продаж; инструмент возьму только если он этому помогает.", "Focus on lifting sales now; take the tool only if it helps with that."), pts: 3 },
          { t: _n("Asosiy ishni buzmay, uni kichik hajmda sinab ko'raman.", "Не отвлекаясь от основной работы, попробую в малом объёме.", "Without disturbing core work, try it on a small scale."), pts: 2 },
          { t: _n("Rahbarga katta yangi tizim taklif qilaman — bu bizni zamonaviylashtiradi.", "Предложу руководителю большую новую систему — это осовременит нас.", "Propose a big new system to the manager — it'll modernize us."), pts: 1 },
          { t: _n("Avval shu ta'sirli vositani joriy qilaman — kompaniya yangilanadi.", "Сначала внедрю этот эффектный инструмент — компания обновится.", "Roll out this impressive tool first — the company gets an upgrade."), pts: 0 },
        ],
      },
      {
        id: "AM4", xislat: ["halollik","oxiri"],
        q: _n("Sen qurgan avtomatlashtirish 2 kun jimgina lid tortishni to'xtatib qo'ygan — hozir sezding.", "Твоя автоматизация 2 дня тихо не тянула лиды — заметил только сейчас.", "Your automation stopped pulling leads for 2 days silently — you've just noticed."),
        opts: [
          { t: _n("Tuzataman; uzilishni hech kim sezmagan, shuning uchun alohida aytishning hojati yo'q.", "Починю; никто не заметил простоя, поэтому отдельно говорить не нужно.", "Fix it; nobody noticed the outage, so no need to say separately."), pts: 0 },
          { t: _n("Aybni tan olaman, sotuv/rahbarni ogohlantiraman, tuzataman va endi jim to'xtamasligi uchun ogohlantirish (alert) qo'shaman.", "Признаю вину, предупрежу продажи/руководителя, починю и добавлю алерт, чтобы больше не молчало.", "Own it, alert sales/manager, fix it, and add an alert so it never silently fails again."), pts: 3 },
          { t: _n("Tuzataman, keyin bir payt rahbarga o'tib ketgan uzilishni aytaman.", "Починю, а потом при случае расскажу руководителю про сбой.", "Fix it, then tell the manager about the outage sometime later."), pts: 2 },
          { t: _n("Buni tashqi platforma/API uzilishi bo'lgani uchun deb tushuntiraman.", "Объясню это сбоем внешней платформы/API.", "Explain it as an external platform/API outage."), pts: 1 },
        ],
      },
      {
        id: "AM5", xislat: ["farosat","muloqot"],
        q: _n("Rahbar barcha lidlarga har kuni reklama xabari yuborishni xohlayapti (bu spam bo'lib, lidlarni bezdiradi).", "Руководитель хочет каждый день слать всем лидам рекламу (это спам, лиды устанут).", "The manager wants to send an ad to every lead daily (that's spam, will burn out the leads)."),
        opts: [
          { t: _n("Aytilganday qilaman — u rahbar, qarori o'ziniki, fikrim o'zimda qoladi.", "Сделаю как сказали — он руководитель, решение его, мнение оставлю при себе.", "Do as told — he's the manager, the call is his, my opinion stays with me."), pts: 2 },
          { t: _n("Uning o'rniga o'zimning «aqlliroq» versiyamni qilib qo'yaman.", "Вместо этого сделаю свою «умную» версию.", "Instead, deploy my own 'smarter' version."), pts: 0 },
          { t: _n("Maqsadiga xizmat qiladigan variant qilaman, lekin spam xavfini (lidlar ketishi) aytib, aqlliroq chastota taklif qilaman.", "Сделаю вариант, отвечающий цели, но предупрежу о риске спама (лиды уйдут) и предложу разумную частоту.", "Build something that meets his goal but flag the spam risk (leads will churn) and propose a smarter cadence."), pts: 3 },
          { t: _n("Fikrimni o'tkazguncha, uni bu g'oyadan qaytarishga urinaman.", "Пока не поменяет мнение, буду переубеждать.", "Keep trying to talk him out of the idea until he changes his mind."), pts: 1 },
        ],
      },
      {
        id: "AM6", xislat: ["xato","sifat"],
        q: _n("Mijozga ketadigan CRM xabarlari/tahlilni AI bilan tayyorlading.", "Сообщения/аналитика в CRM для клиента подготовлены с помощью AI.", "The client-facing CRM messages/analytics were prepared with AI."),
        opts: [
          { t: _n("Kimdir shikoyat qilsa keyin to'g'rilayman, hozir yuboraveraman.", "Если пожалуются — поправлю; пока отправлю.", "If someone complains later I'll fix it; send now."), pts: 1 },
          { t: _n("Tez ko'z yugurtirib, ko'zga tashlangan narsalarni to'g'rilayman.", "Быстро пробегу глазами, поправлю то, что бросается.", "Skim quickly, fix the obvious things."), pts: 2 },
          { t: _n("AI ilg'or, shuning uchun natijasini to'g'ridan-to'g'ri yuboraman — vaqt tejaladi.", "AI умный, отправлю результат сразу — сэкономлю время.", "AI is advanced, send the output directly — saves time."), pts: 0 },
          { t: _n("Jonli ketishidan oldin AI natijasini o'qib, tekshirib, to'g'rilayman — AI qoralama, yakuniy emas.", "Перед отправкой прочту, проверю и поправлю — AI это черновик, а не финал.", "Before it goes live, read/check/edit the AI output — AI is a draft, not final."), pts: 3 },
        ],
      },
    ],
  },
  {
    key: "dizayn",
    label: _n("Dizayn", "Дизайн", "Design"),
    qs: [
      {
        id: "D1", xislat: ["farosat","muloqot"],
        q: _n("Mijoz aniq brief (topshiriq) berdi, lekin sen o'z g'oyang chiroyliroq deb o'ylayapsan.", "Клиент дал чёткое ТЗ, но ты считаешь свою идею красивее.", "The client gave a clear brief, but you think your own idea is prettier."),
        opts: [
          { t: _n("So'ralganini qilaman, lekin o'z variantimni ham qo'shimcha taklif sifatida ko'rsataman.", "Сделаю, как просили, и покажу свой вариант как дополнительное предложение.", "Do what's asked, and show my version as an extra proposal."), pts: 3 },
          { t: _n("O'z fikrimni qabul qildirishga urinib, avval mijozni ishontirmoqchi bo'laman.", "Сначала попробую убедить клиента принять мой вариант.", "First try to convince the client to accept my view."), pts: 1 },
          { t: _n("Ularga o'zimning yaxshiroq versiyamni beraman — ko'rsa yoqib qoladi.", "Отдам им свою лучшую версию — увидят, понравится.", "Just give them my better version — they'll like it when they see it."), pts: 0 },
          { t: _n("Aynan brief bo'yicha qilaman, g'oyam o'zimda qoladi.", "Сделаю точно по брифу, идею оставлю себе.", "Do exactly per the brief, keep my idea to myself."), pts: 2 },
        ],
      },
      {
        id: "D2", xislat: ["oxiri","halollik"],
        q: _n("Mijoz allaqachon tasdiqlagan dizaynda xato (masalan, noto'g'ri telefon raqami) borligini payqading — bu hozir bannerga chop etilmoqda.", "Ты заметил ошибку (например, неверный номер) в уже утверждённом клиентом дизайне — он сейчас идёт в печать баннера.", "You spot an error (e.g., wrong phone number) in a client-approved design — it's being printed onto a banner now."),
        opts: [
          { t: _n("Chop etilgach muammo chiqsa, o'shanda aytaman.", "Если после печати всплывёт — тогда и скажу.", "If issues come up after printing, I'll say then."), pts: 1 },
          { t: _n("To'xtataman va chop etishdan oldin menejer/mijozga darrov aytaman — bosilgan xato qimmatga tushadi.", "Остановлю и сразу сообщу менеджеру/клиенту до печати — напечатанная ошибка обойдётся дорого.", "Stop it and immediately tell the manager/client before printing — a printed error is expensive."), pts: 3 },
          { t: _n("Aniq xato (raqam) bo'lgani uchun to'g'rilab, tez tasdiqlatib chop etaman.", "Так как ошибка явная (номер), быстро поправлю, подтвержу и напечатаю.", "Since it's an obvious error (a number), fix it, get a quick reapproval, and print."), pts: 2 },
          { t: _n("Mijoz tasdiqlagan, javobgarlik uniki; tasdiqlangan holda chop etaman.", "Клиент утвердил, ответственность на нём; печатаю как есть.", "Client approved, liability is theirs; print as approved."), pts: 0 },
        ],
      },
      {
        id: "D3", xislat: ["oxiri","farosat"],
        q: _n("Dizayn bugun topshiriladi. U yaxshi, lekin sen yana sayqal berishni xohlayapsan.", "Дизайн сдаётся сегодня. Он хороший, но ты хочешь ещё пошлифовать.", "The design is due today. It's good, but you want to polish it more."),
        opts: [
          { t: _n("Mukammal bo'lguncha sayqallayveraman, kechiksa ham a'lo chiqsin.", "Буду шлифовать до совершенства, пусть опоздает, но станет отличным.", "Polish until perfect, even if late — make it great."), pts: 0 },
          { t: _n("O'z vaqtida topshiraman, yetarli darajada yaxshi.", "Сдам вовремя — достаточно хорошо.", "Deliver on time — good enough."), pts: 2 },
          { t: _n("O'z vaqtida tayyor variantni topshiraman; xohlasangiz yana sayqallayman deb aytaman.", "Сдам вовремя готовый вариант, скажу «если хотите — ещё пошлифую».", "Deliver on time, say 'if you want, I can polish more'."), pts: 3 },
          { t: _n("Muddatni biroz cho'zib bo'lsa ham mukammal qilaman.", "Пусть чуть задержу срок, но сделаю идеально.", "Push the deadline a bit and make it perfect."), pts: 1 },
        ],
      },
      {
        id: "D4", xislat: ["xato","sifat"],
        q: _n("Dizaynni mijozga yoki chopga yuborishdan oldin.", "Перед отправкой дизайна клиенту или в печать.", "Before sending the design to the client or to print."),
        opts: [
          { t: _n("Yuboraman, mijoz ko'rsa aytadi.", "Отправлю — клиент увидит и скажет.", "Send it; the client will see and say something."), pts: 1 },
          { t: _n("Bir marta ko'z yugurtirib olaman.", "Один раз пробегу глазами.", "Give it a quick glance."), pts: 2 },
          { t: _n("Tajribaliman, kam xato qilaman — shuning uchun to'g'ridan yuboraman.", "Опытен, ошибок мало — отправлю сразу.", "I'm experienced, few mistakes — send directly."), pts: 0 },
          { t: _n("Har safar tez o'z-o'zini tekshiraman: imlo, o'lchamlar, brend ranglari.", "Каждый раз быстро самопроверяюсь: орфография, размеры, фирменные цвета.", "Every time I do a quick self-check: spelling, dimensions, brand colors."), pts: 3 },
        ],
      },
      {
        id: "D5", xislat: ["farosat","muloqot"],
        q: _n("Mijozning briefi mavhum: «chiroyli, ko'zga tashlanadigan qilib bering».", "Бриф клиента абстрактный: «сделайте красиво и броско».", "The client's brief is vague: 'make it beautiful and eye-catching'."),
        opts: [
          { t: _n("1-2 ta aniq savol beraman (auditoriya, majburiy narsalar), keyin yo'nalish taklif qilaman.", "Задам 1-2 конкретных вопроса (аудитория, обязательные элементы), потом предложу направление.", "Ask 1-2 pointed questions (audience, required elements), then propose a direction."), pts: 3 },
          { t: _n("Har bir mayda detal aniqlanguncha savol beraveraman.", "Буду задавать вопросы до тех пор, пока каждая мелочь не прояснится.", "Keep asking questions until every detail is clarified."), pts: 1 },
          { t: _n("So'ramay, o'zim eng yaxshi deb bilganimni qilaman.", "Не спрашивая, сделаю по-своему как считаю лучше.", "Without asking, do what I think is best."), pts: 0 },
          { t: _n("2-3 variant qilib beraman, o'zlari tanlashsin.", "Сделаю 2-3 варианта, пусть выберут сами.", "Make 2-3 options, let them pick."), pts: 2 },
        ],
      },
      {
        id: "D6", xislat: ["bosim","muloqot"],
        q: _n("Mijoz dizayningni 3-marta rad etdi, asabiylashgani sezilyapti.", "Клиент отклонил дизайн уже 3-й раз, заметно раздражён.", "The client has rejected your design for the 3rd time, clearly irritated."),
        opts: [
          { t: _n("Dizaynim yaxshi ekanini tushuntirib, himoya qilaman.", "Буду объяснять и защищать свой дизайн.", "Explain and defend my design."), pts: 1 },
          { t: _n("Bir qadam orqaga chekinib, aslida nima yetishmayotganini aniqlayman, yondashuvni o'zgartiraman.", "Отступлю на шаг, выясню, чего не хватает по существу, поменяю подход.", "Step back, figure out what's actually missing, change the approach."), pts: 3 },
          { t: _n("Aniq nimani o'zgartirishni so'rab, aytilganini qilaman.", "Спрошу, что именно менять, и сделаю.", "Ask specifically what to change and do it."), pts: 2 },
          { t: _n("Mijoz o'zi nima xohlashini bilmaydi; variant yuboraveraman.", "Клиент сам не знает, чего хочет; продолжу присылать варианты.", "The client doesn't know what they want; I'll keep sending options."), pts: 0 },
        ],
      },
    ],
  },
  {
    key: "tseh",
    label: _n("Tseh hodimi", "Работник цеха", "Workshop worker"),
    qs: [
      {
        id: "T1", xislat: ["xato","oxiri"],
        q: _n("Buyurtma bo'yicha qimmat materialga chop etish/kesish oldidasan.", "Перед печатью/резкой по заказу на дорогом материале.", "You're about to print/cut on expensive material per an order."),
        opts: [
          { t: _n("Bir marta tez ko'rib chiqaman.", "Быстро пробегусь один раз.", "Do one quick check."), pts: 2 },
          { t: _n("Aniq bo'lmasa, ehtiyot uchun sal ko'proq qilib kesaman.", "Если не уверен — на всякий случай отрежу чуть побольше.", "If not sure, cut a bit larger just in case."), pts: 1 },
          { t: _n("Kesishdan oldin o'lchamlar va spekni buyurtma bilan yana bir tekshiraman.", "Перед резкой ещё раз сверю размеры и спецификацию с заказом.", "Before cutting, recheck dimensions and spec against the order."), pts: 3 },
          { t: _n("Ko'p marta qilganman, darrov kesaveraman.", "Делал много раз — режу сразу.", "Done it many times — cut right away."), pts: 0 },
        ],
      },
      {
        id: "T2", xislat: ["farosat","halollik"],
        q: _n("Buyurtma speki senga noto'g'riday ko'rinyapti (masalan, g'alati o'lcham).", "Спецификация заказа кажется тебе неверной (например, странный размер).", "The order spec looks wrong to you (e.g., an odd dimension)."),
        opts: [
          { t: _n("O'zim to'g'ri deb bilganimga o'zgartirib ishlab chiqaraman.", "Сам поменяю на то, что считаю правильным, и произведу.", "Change it to what I think is right and produce."), pts: 0 },
          { t: _n("Yozilganidek aynan ishlab chiqaraman, g'alati bo'lsa ham.", "Произведу ровно как написано, пусть и странно.", "Produce exactly as written, even if odd."), pts: 2 },
          { t: _n("Ehtiyot uchun ikkala versiyani ham qilib qo'yaman.", "На всякий случай сделаю обе версии.", "Just in case, make both versions."), pts: 1 },
          { t: _n("To'xtab, ishlab chiqarishdan oldin mas'ul odam bilan aniqlab olaman.", "Остановлюсь, до производства уточню у ответственного.", "Stop and clarify with the responsible person before producing."), pts: 3 },
        ],
      },
      {
        id: "T3", xislat: ["halollik","xato"],
        q: _n("Xato kesib/chop etib, bir varaq qimmat materialni buzding. Hech kim ko'rmagan.", "Ошибся при резке/печати и испортил лист дорогого материала. Никто не видел.", "You cut/printed wrong and ruined a sheet of expensive material. Nobody saw."),
        opts: [
          { t: _n("Darrov menejerga aytaman — zaxira va xarajat hisobga olinsin, kerak bo'lsa qayta buyurtma qilinsin.", "Сразу скажу менеджеру — учесть в остатках и расходах, при необходимости перезаказать.", "Tell the manager immediately — account for stock/cost, re-order if needed."), pts: 3 },
          { t: _n("Qayta qilaman, keyin material ketganini aytaman.", "Переделаю, потом сообщу, что материал ушёл.", "Redo it, then say material was used."), pts: 2 },
          { t: _n("Bir o'zim qayta qilaman; zaxira yetsa, alohida aytmayman.", "Сам переделаю; если запаса хватит — отдельно не скажу.", "Redo it myself; if stock holds, I won't say anything."), pts: 1 },
          { t: _n("Har kimda material buziladi; bu ishning bir qismi, aytishning hojati yo'q.", "У всех бывает брак; это часть работы, говорить не нужно.", "Everyone ruins material sometimes; it's part of the job, no need to say."), pts: 0 },
        ],
      },
      {
        id: "T4", xislat: ["farosat","oxiri"],
        q: _n("Kesish mashinasi/printer nosozlik beryapti yoki himoya qismi bo'shab qolgan.", "Резак/принтер выдаёт неисправность, или защитная часть ослаблена.", "The cutter/printer is malfunctioning, or a safety guard is loose."),
        opts: [
          { t: _n("Davom etaman, lekin smena tugagach mas'ulga aytaman.", "Продолжу работать, после смены скажу ответственному.", "Keep going, tell the responsible person after the shift."), pts: 2 },
          { t: _n("To'xtataman va davom etishdan oldin xavfsiz tarzda xabar beraman / hal qilaman.", "Остановлю и до продолжения сообщу/решу вопрос безопасно.", "Stop and, before continuing, report/resolve it safely."), pts: 3 },
          { t: _n("O'zim ish ustida tuzatishga urinaman.", "Попробую починить прямо на ходу.", "Try to fix it myself on the fly."), pts: 1 },
          { t: _n("Hali ishlayapti, muddatga ulgurish uchun davom etaveraman.", "Ещё работает — продолжу, чтобы успеть к сроку.", "Still works — keep going to meet the deadline."), pts: 0 },
        ],
      },
      {
        id: "T5", xislat: ["tashabbus"],
        q: _n("Muhim material tugab qolish arafasida ekanini ko'rding.", "Заметил, что важный материал вот-вот закончится.", "You've noticed an important material is about to run out."),
        opts: [
          { t: _n("O'zim boshqa material bilan almashtirib, jimgina davom etaman.", "Сам заменю на другой материал и молча продолжу.", "Swap in another material myself and quietly continue."), pts: 1 },
          { t: _n("Bori bilan ishlayveraman, butunlay tugaganda aytaman.", "Работаю тем, что есть; скажу, когда совсем закончится.", "Work with what's there; report only when it's fully out."), pts: 0 },
          { t: _n("Tugashini kutmasdan, mas'ul odamga oldindan aytaman — vaqtida to'ldirilsin.", "Не жду — заранее сообщаю ответственному, чтобы пополнили вовремя.", "Don't wait — tell the responsible person early to restock in time."), pts: 3 },
          { t: _n("Kamayganini ko'rsam, imkon topib aytaman.", "Как замечу нехватку — при случае скажу.", "When I notice it's low, mention it when convenient."), pts: 2 },
        ],
      },
      {
        id: "T6", xislat: ["oxiri","sifat"],
        q: _n("Shoshilinch ish, tugatuvchi bosqich (chekka kesish/laminatsiya) qo'shimcha vaqt oladi.", "Срочная работа, финальный этап (обрезка кромок/ламинация) съедает время.", "Rush job — the finishing step (edge trim/lamination) takes extra time."),
        opts: [
          { t: _n("Tugatuvchi bosqichni tashlab ketaman, odatda baribir yaxshi ko'rinadi.", "Пропущу финальный этап — обычно и так выглядит хорошо.", "Skip finishing — it usually looks fine anyway."), pts: 0 },
          { t: _n("Hammasini to'liq qilaman, juda kechiksa ham.", "Сделаю всё полностью, пусть и сильно опоздает.", "Do it all fully, even if very late."), pts: 1 },
          { t: _n("Bosqichning tezroq variantini qilaman.", "Сделаю ускоренный вариант этапа.", "Do a faster variant of that step."), pts: 2 },
          { t: _n("Mijoz natijasiga muhim bosqichni bajaraman; chindan vaqt bo'lmasa, yon berishni oldindan aytaman.", "Выполню этап, важный для результата у клиента; если реально нет времени — заранее договорюсь об уступке.", "Do the step that matters for the client's result; if truly out of time, negotiate a trade-off in advance."), pts: 3 },
        ],
      },
    ],
  },
];

// Maximum possible points per module (used to show "score / max").
export function personalMaxPts(mod: PersonalModule): number {
  return mod.qs.length * 3;
}

// Trait key → readable name in each language (matches xislatlar from the original JSON).
export const XISLAT_NAMES: Record<string, Ml> = {
  tashabbus: _n("Tashabbus / egalik", "Инициативность / собственность", "Initiative / ownership"),
  oxiri:     _n("Oxirigacha yetkazish", "Доведение до конца", "Follow-through"),
  xato:      _n("Xatoni tan olish / o'rganish", "Признание ошибки / обучение", "Owning mistakes / learning"),
  farosat:   _n("Vaziyatni o'qish (farosat)", "Чтение ситуации (сообразительность)", "Reading the situation (judgment)"),
  halollik:  _n("Halollik / mas'uliyat", "Честность / ответственность", "Honesty / responsibility"),
  bosim:     _n("Bosim ostida vazminlik", "Хладнокровие под давлением", "Composure under pressure"),
  muloqot:   _n("Muloqot / mijoz bilan", "Коммуникация / с клиентом", "Communication / with the client"),
  tozalik:   _n("Tozalik / intizom", "Чистота / дисциплина", "Cleanliness / discipline"),
  sifat:     _n("Sifat / oziq-ovqat farosati", "Качество / чутьё к продукту", "Quality / product sense"),
};

// Red-flag question ids (honesty/safety questions where pts=0 = deep integrity issue).
export const RED_FLAG_IDS = new Set(["K5", "K8", "S3", "S4", "O3", "AM2", "AM4", "D2", "T3"]);
