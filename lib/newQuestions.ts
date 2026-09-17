// New sections: IQ test (single-correct) and Personal SJT test (weighted 0-3 pts per option).
// Uzbek-only source. Rendering layer applies toCyrl() for the uz-cyrl variant.

export type IqQ = { q: string; opts: string[]; ans: number; svg?: string };
export type SjtOpt = { t: string; pts: number };
export type SjtQ = { q: string; opts: SjtOpt[] };
export type PersonalModule = { key: string; label: string; qs: SjtQ[] };

// ─── IQ TEST (30 questions) ───────────────────────────────
export const QS_IQ: IqQ[] = [
  // Mantiq (8)
  { q: "Ketma-ketlikni davom ettiring: 2, 4, 8, 16, ?", opts: ["32", "24", "20", "30"], ans: 0 },
  { q: "Ketma-ketlik: 3, 6, 5, 10, 9, 18, ?", opts: ["19", "20", "36", "17"], ans: 3 },
  { q: "Ortiqchasini toping:", opts: ["Olma", "Nok", "Uzum", "Sabzi"], ans: 3 },
  { q: "Baliq — suzadi. Qush — ?", opts: ["yuguradi", "sakraydi", "uchadi", "suzadi"], ans: 2 },
  { q: "Barcha rassomlar ijodkor. Aziz — rassom. Demak Aziz...", opts: ["sotuvchi", "ijodkor", "dangasa", "ijodkor emas"], ans: 1 },
  { q: "Ketma-ketlik: 1, 4, 9, 16, ?", opts: ["20", "24", "25", "21"], ans: 2 },
  { q: "Ortiqchasini toping:", opts: ["2", "4", "6", "7"], ans: 3 },
  { q: "Ali Vali dan baland. Vali Guli dan baland. Eng past kim?", opts: ["Ali", "Vali", "aniqlab bo'lmaydi", "Guli"], ans: 3 },
  // Sonli (8)
  { q: "6 ta bir xil qalam 12 000 so'm. 1 tasi qancha?", opts: ["2000", "3000", "1500", "2400"], ans: 0 },
  { q: "Ishchi 1 soatda 5 ta quti yig'adi. 3 soatda nechta yig'adi?", opts: ["8", "10", "20", "15"], ans: 3 },
  { q: "2 ishchi bir ishni 4 soatda bajaradi. 4 ishchi (bir xil tezlikda) qancha vaqtda bajaradi?", opts: ["4 soat", "8 soat", "2 soat", "1 soat"], ans: 2 },
  { q: "Sizda 50 000 bor edi. 18 000 va 22 000 lik narsa oldingiz. Qancha qoldi?", opts: ["12 000", "8 000", "10 000", "6 000"], ans: 2 },
  { q: "Bir savatda 8 ta olma, ikkinchisida 12 ta. Birinchisidan 2 tasi ikkinchisiga o'tkazildi. Endi ikkinchisida nechta?", opts: ["10", "14", "12", "16"], ans: 1 },
  { q: "Ketma-ketlik: 100, 90, 81, 73, ?", opts: ["66", "64", "65", "68"], ans: 0 },
  { q: "Ish 9:00 da boshlandi, 6 soat davom etdi, o'rtada 1 soat tanaffus bo'ldi. Soat nechada tugaydi?", opts: ["15:00", "16:00", "17:00", "14:00"], ans: 1 },
  { q: "Qutida 3 qizil va 2 ko'k to'p bor. Ko'zni yumib bitta olsangiz, qaysi rang chiqishi ehtimoli ko'proq?", opts: ["Ko'k", "Teng", "Qizil", "Aniqlab bo'lmaydi"], ans: 2 },
  // Fazoviy (7) — with SVG
  {
    q: "Qaysi biri boshqalaridan farq qiladi?",
    opts: ["1", "2", "3", "4"],
    ans: 2,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="95" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="175" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="250" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="330" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="405" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="485" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="560" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="67" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="67" y1="123" x2="123" y2="67" stroke="#333" stroke-width="2"/><rect x="222" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="222" y1="123" x2="278" y2="67" stroke="#333" stroke-width="2"/><rect x="377" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="377" y1="67" x2="433" y2="123" stroke="#333" stroke-width="2"/><rect x="532" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><line x1="532" y1="123" x2="588" y2="67" stroke="#333" stroke-width="2"/></svg>`,
  },
  {
    q: "Bo'sh katakka qaysi shakl mos keladi?",
    opts: ["1", "2", "3", "4"],
    ans: 0,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><line x1="95" y1="20" x2="95" y2="170" stroke="#ddd"/><line x1="20" y1="95" x2="170" y2="95" stroke="#ddd"/><circle cx="57" cy="57" r="20" fill="none" stroke="#333" stroke-width="2"/><circle cx="132" cy="57" r="20" fill="none" stroke="#333" stroke-width="2"/><circle cx="132" cy="57" r="4" fill="#333"/><rect x="38" y="113" width="38" height="38" fill="none" stroke="#333" stroke-width="2"/><text x="132" y="145" font-family="sans-serif" font-size="34" fill="#c00" text-anchor="middle">?</text><text x="95" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">Rasm</text><rect x="200" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="245" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="310" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="355" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="530" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="575" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="226" y="71" width="38" height="38" fill="none" stroke="#333" stroke-width="2"/><circle cx="245" cy="90" r="4" fill="#333"/><circle cx="355" cy="90" r="20" fill="none" stroke="#333" stroke-width="2"/><circle cx="355" cy="90" r="4" fill="#333"/><rect x="446" y="71" width="38" height="38" fill="none" stroke="#333" stroke-width="2"/><polygon points="575,70 595,108 555,108" fill="none" stroke="#333" stroke-width="2"/><circle cx="575" cy="94" r="4" fill="#333"/></svg>`,
  },
  {
    q: "Kvadratdagi bo'shliqni qaysi bo'lak to'ldiradi?",
    opts: ["1", "2", "3", "4"],
    ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><path d="M20,30 L150,30 L150,110 L100,110 L100,160 L20,160 Z" fill="#eef3f8" stroke="#333" stroke-width="2"/><text x="85" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">Rasm</text><rect x="200" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="245" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="310" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="355" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="530" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="575" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="230" y="75" width="30" height="30" fill="#e07a3b" stroke="#333" stroke-width="2"/><rect x="330" y="65" width="50" height="50" fill="#e07a3b" stroke="#333" stroke-width="2"/><rect x="440" y="75" width="50" height="30" fill="#e07a3b" stroke="#333" stroke-width="2"/><polygon points="575,65 600,115 550,115" fill="#e07a3b" stroke="#333" stroke-width="2"/></svg>`,
  },
  {
    q: "Qaysi shakl ortiqcha?",
    opts: ["1", "2", "3", "4"],
    ans: 3,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="95" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="175" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="250" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="330" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="405" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="485" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="560" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><rect x="67" y="67" width="56" height="56" fill="none" stroke="#333" stroke-width="2"/><rect x="216" y="73" width="68" height="44" fill="none" stroke="#333" stroke-width="2"/><polygon points="405,65 435,95 405,125 375,95" fill="none" stroke="#333" stroke-width="2"/><polygon points="560,67 590,121 530,121" fill="none" stroke="#333" stroke-width="2"/></svg>`,
  },
  {
    q: "Chapdagi shaklning ko'zgudagi (oyna) aksi qaysi biri?",
    opts: ["1", "2", "3", "4"],
    ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="20" y="20" width="150" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><g transform="translate(95,95) rotate(0)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><text x="95" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">Rasm</text><rect x="200" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="245" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="310" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="355" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="530" y="20" width="90" height="150" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="575" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><g transform="translate(245,90) rotate(90)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><g transform="translate(355,90) rotate(0)"><polygon points="-20,-35 0,-35 0,20 -35,20 -35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><g transform="translate(465,90) rotate(180)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g><g transform="translate(575,90) rotate(270)"><polygon points="-20,-35 0,-35 0,20 35,20 35,35 -20,35" fill="#3b6ea5" stroke="#25517d" stroke-width="1.5"/></g></svg>`,
  },
  {
    q: "Ketma-ketlikda keyingi shakl qaysi?",
    opts: ["1", "2", "3", "4"],
    ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="5" y="30" width="180" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><g transform="translate(37,85) rotate(0)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(92,85) rotate(90)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(147,85) rotate(180)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><text x="160" y="95" font-family="sans-serif" font-size="30" fill="#c00" text-anchor="middle">?</text><text x="95" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">Ketma-ketlik</text><rect x="210" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="255" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">1</text><rect x="315" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="360" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">2</text><rect x="420" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="465" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">3</text><rect x="525" y="30" width="90" height="110" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><text x="570" y="185" font-family="sans-serif" font-size="18" fill="#333" text-anchor="middle">4</text><g transform="translate(255,85) rotate(0)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(360,85) rotate(270)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(465,85) rotate(90)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g><g transform="translate(570,85) rotate(45)"><line x1="0" y1="22" x2="0" y2="-14" stroke="#333" stroke-width="3"/><polygon points="0,-26 -9,-10 9,-10" fill="#333"/></g></svg>`,
  },
  {
    q: "Rasmda nechta uchburchak bor?",
    opts: ["2", "3", "4", "5"],
    ans: 1,
    svg: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="200" fill="white"/><rect x="220" y="10" width="200" height="180" fill="none" stroke="#bbb" stroke-width="1.5" rx="6"/><polygon points="320,30 250,165 390,165" fill="#eef3f8" stroke="#333" stroke-width="2"/><line x1="320" y1="30" x2="320" y2="165" stroke="#333" stroke-width="2"/><text x="320" y="188" font-family="sans-serif" font-size="14" fill="#333" text-anchor="middle">Nechta uchburchak bor?</text></svg>`,
  },
  // Diqqat (7)
  { q: "5 ni oling, 3 ga ko'paytiring, so'ng 5 qo'shing, so'ng 2 ga bo'ling. Natija?", opts: ["10", "12", "15", "20"], ans: 0 },
  { q: "Ro'yxat: qizil qalam, ko'k daftar, 3 ta o'chirg'ich, sariq chizg'ich. Quyidagilardan qaysi biri ro'yxatga MOS EMAS?", opts: ["qizil qalam", "ko'k daftar", "sariq chizg'ich", "yashil daftar"], ans: 3 },
  { q: "«OLMA» so'zini oxiridan (teskari) o'qing. Nima chiqadi?", opts: ["AMLO", "OLMA", "MALO", "ALMO"], ans: 0 },
  { q: "Dehqonda 15 qo'y bor edi. 8 tasidan boshqasi o'ldi. Nechta qo'y tirik qoldi?", opts: ["8", "7", "15", "0"], ans: 0 },
  { q: "Ko'rsatma: avval eshikni yop, keyin chiroqni o'chir, keyin chiqib ket. 2-amal qaysi?", opts: ["eshikni yopish", "chiqib ketish", "chiroqni o'chirish", "kutish"], ans: 2 },
  { q: "Quyidagi qatorda nechta 7 bor?   7  1  7  4  7  7  2  7", opts: ["5", "4", "6", "3"], ans: 0 },
  { q: "«MASHINA» so'zida nechta «A» harfi bor?", opts: ["1", "2", "3", "4"], ans: 1 },
];

// ─── PERSONAL TEST (SJT, 0-3 pts per option) ─────────────
export const QS_PERSONAL: PersonalModule[] = [
  {
    key: "core",
    label: "Umumiy (barcha lavozimlar)",
    qs: [
      {
        q: "Rahbar ketayotib shoshib aytdi: «Bugun muhim mehmon keladi, hammasi joyida bo'lsin» — boshqa hech narsa tushuntirmadi va chiqib ketdi.",
        opts: [
          { t: "Joyni tez tartibga keltiraman, choy-kofe tayyorlab qo'yaman; faqat mehmon soatini bir og'iz aniqlab olaman.", pts: 3 },
          { t: "Boshqa ishlarim ham bor; mehmon kelganda ko'raman, kerak bo'lsa o'shanda tez tayyorlayman.", pts: 0 },
          { t: "Rahbarga qo'ng'iroq qilib, aniq nimalar qilishim kerakligini batafsil so'rab, ro'yxat qilib olaman.", pts: 1 },
          { t: "O'zim to'g'ri deb bilganimni to'liq tayyorlayman, rahbarni ortiqcha bezovta qilmayman.", pts: 2 },
        ],
      },
      {
        q: "O'tgan hafta mijozga xato faylni yuborib qo'yding. Bugun yana shunga o'xshash ish tushdi.",
        opts: [
          { t: "Ish ko'p, shuning uchun avvalgidek tez qilaman; xato kamdan-kam bo'ladi.", pts: 0 },
          { t: "Yuborishdan oldin faylni ochib, nomi va mazmunini tekshiradigan kichik odat qildim — shunga amal qilaman.", pts: 3 },
          { t: "Yuborishdan oldin imkon bo'lsa hamkasbdan bir ko'z tashlab berishini so'rayman.", pts: 1 },
          { t: "Bu safar juda diqqat bilan, shoshmasdan qilaman.", pts: 2 },
        ],
      },
      {
        q: "Shoshilinch buyurtma, muddat tor — ishni to'liq sifatli qilishga vaqt yetmaydi.",
        opts: [
          { t: "Sifatni buzmaslik uchun muddatni biroz kechiktiraman, ishni to'liq qilaman.", pts: 1 },
          { t: "Muddatga yetkazish uchun tez qilaman; tashqi ko'rinishi joyida bo'lsa, mijoz sezmasligi mumkin.", pts: 0 },
          { t: "Eng muhim qismini sifatli qilaman, sifatga ta'sir qiladigan joyni rahbarga aytib, eng tez xavfsiz yo'lni taklif qilaman.", pts: 3 },
          { t: "Rahbardan qo'shimcha vaqt so'rab, nega kerakligini tushuntiraman.", pts: 2 },
        ],
      },
      {
        q: "Bir ish e'tibordan chetda qolyapti — texnik jihatdan bu sening vazifang emas, lekin qilinmasa mijoz zarar ko'radi.",
        opts: [
          { t: "Har kim o'z ishini qilsa yaxshi; men o'z vazifamga e'tibor beraman.", pts: 0 },
          { t: "Kuzatib turaman; muammo kattalashsa, o'shanda aralashaman.", pts: 1 },
          { t: "Bu ishning mas'uli aniq bor; unga eslatib qo'yaman, qolganini o'zi hal qiladi.", pts: 2 },
          { t: "Eplasam o'zim qilaman, eplamasam darrov mas'ul odamni yoki rahbarni ogohlantiraman.", pts: 3 },
        ],
      },
      {
        q: "Sening sababingdan bir ish buzildi (masalan, material isrof bo'ldi). Hali hech kim sezmagan.",
        opts: [
          { t: "Rahbarga o'zim darrov aytaman: nima bo'ldi va qanday to'g'rilashni ham aytaman.", pts: 3 },
          { t: "To'g'rilayman; keyin so'rab qolishsa, bo'lgan voqeani aytaman.", pts: 1 },
          { t: "O'zim to'g'rilab qo'yaman; muammo hal bo'lgach, alohida aytib o'tirishning hojati yo'q.", pts: 0 },
          { t: "Avval o'zim jimgina to'g'rilayman, keyin rahbarga bo'lib o'tgan voqeani aytaman.", pts: 2 },
        ],
      },
      {
        q: "Ishing erta tugadi, rahbar yo'q, atrofda ochiq turgan boshqa ish ham bor.",
        opts: [
          { t: "Kimdir yordam so'rasa yordam beraman, o'zim tashabbus ko'rsatib yugurmayman.", pts: 2 },
          { t: "O'zim foydali keyingi ishni topaman yoki bir joyni yaxshilayman.", pts: 3 },
          { t: "Ishimni sifatli tugatdim; endi biroz dam olib, keyingi topshiriqni kutaman.", pts: 1 },
          { t: "Ishim tugadi, shuning uchun shaxsiy ishlarim bilan shug'ullanaman yoki ertaroq chiqaman.", pts: 0 },
        ],
      },
      {
        q: "Bir vaqtning o'zida ikkita shoshilinch ish tushdi, ikkovini birga qilib bo'lmaydi.",
        opts: [
          { t: "Ikkalasi ham shoshilinch, shuning uchun rahbardan qaysi birini birinchi qilishni so'rayman.", pts: 2 },
          { t: "Osonrog'ini avval tugataman — bittasi tez bitsa, boshim yengil bo'ladi.", pts: 1 },
          { t: "Qaysi biri ko'proq zarar/foyda keltirishini o'ylab, muhimrog'ini boshlayman, ikkinchisi haqida tegishli odamni ogohlantiraman.", pts: 3 },
          { t: "Ikkalasini bir vaqtda ulgurishga urinaman, ikkisi ham vaqtida tugasin.", pts: 0 },
        ],
      },
      {
        q: "Buyurtma kechikishini oldindan bilib qolding. Mijozga xabar berish sening zimmangda.",
        opts: [
          { t: "Aniq yangi muddat qo'limda bo'lgach xabar beraman — mijozga aniq narsa aytganim ma'qul.", pts: 2 },
          { t: "Ba'zan kechikish o'z-o'zidan hal bo'ladi; muddatga yaqin hali ham kech bo'lsa, o'shanda aytaman.", pts: 1 },
          { t: "Mijozni ortiqcha xavotirga qo'ymaslik uchun «tayyor bo'lyapti» deb turaman, orqada masalani hal qilaman.", pts: 0 },
          { t: "Mijozga oldindan ochiq aytaman: kechikadi, sababi shu, mana variantlar.", pts: 3 },
        ],
      },
      {
        q: "Rahbar (yoki mijoz) aniq ko'rsatma berdi, lekin sen uni biroz noto'g'ri deb o'ylayapsan.",
        opts: [
          { t: "Aytilganday qilaman, lekin oldin xavotirimni bir og'iz aytaman: «shunday qilsak, mana bu bo'lishi mumkin — baribir shundaymi?»", pts: 3 },
          { t: "O'z fikrimni tushuntirib, to'g'ri deb bilganimni qabul qildirishga harakat qilaman.", pts: 1 },
          { t: "Aytilganday, so'zsiz bajaraman — buyruq shunday bo'lgach, o'ylaganim o'zimda qoladi.", pts: 2 },
          { t: "Men tajribamdan yaxshiroq yo'lni bilaman; shu bo'yicha qilib qo'yaman, natija yaxshi chiqsa hamma rozi bo'ladi.", pts: 0 },
        ],
      },
      {
        q: "Bir ishni qanday qilishni bilmaysan.",
        opts: [
          { t: "Bu ish menikidan tajribaliroq odamniki; uni so'rab, o'sha qilib bergani ma'qul.", pts: 0 },
          { t: "Avval o'zim yo'lini topishga urinaman; chindan tiqilib qolsam, aniq savol bilan so'rayman.", pts: 3 },
          { t: "Vaqt ketmasligi uchun darrov biladiganidan so'rab, ko'rsatib berishini iltimos qilaman.", pts: 1 },
          { t: "O'zimcha bir urinib ko'raman; bo'lmasa, qilinganini ko'rsatib, qayeri xato bo'lganini so'rayman.", pts: 2 },
        ],
      },
    ],
  },
  {
    key: "sotuv",
    label: "Sotuv bo'limi",
    qs: [
      {
        q: "Yaxshi lid bir necha kun javob bermay qo'ydi (o'qigan, lekin jim).",
        opts: [
          { t: "Qiziqqanida o'zi yozadi; bosim qilmay, bazamda saqlab qo'yaman.", pts: 0 },
          { t: "Bir marta qisqa «qanday qaror qildingiz?» deb yozaman.", pts: 2 },
          { t: "Javob berishga arziydigan sabab beraman: yangi imkoniyat/narx yoki savoliga aniqlik bilan yozaman.", pts: 3 },
          { t: "Bir-ikki kunda bir «assalomu alaykum, eslatib o'tayapman» deb yozib turaman.", pts: 1 },
        ],
      },
      {
        q: "Mijoz sen ruxsat bera olmaydigan katta chegirma so'rayapti.",
        opts: [
          { t: "Mijozni yo'qotmaslik uchun «hal qilamiz, chegirma bo'ladi» deb ishontirib, keyin imkonini izlayman.", pts: 0 },
          { t: "Bu masalani rahbarga yo'naltiraman, chunki narx qarori uniki.", pts: 2 },
          { t: "Chegirma vakolatim yo'q; buni ochiq aytib, «narx shu» deb qat'iy turaman.", pts: 1 },
          { t: "Chegirma va'da qilmayman, qiymatni tushuntiraman; kerak bo'lsa mas'uldan aniqlab, muqobil variant taklif qilaman.", pts: 3 },
        ],
      },
      {
        q: "Mijoz kechikish uchun jahli chiqdi — aybdor sen emassan, tseh kechiktirdi.",
        opts: [
          { t: "Aloqani o'z zimmamga olaman: noqulaylik uchun uzr, aniq holatni bilib, real muddat va yechim beraman.", pts: 3 },
          { t: "Mijozga rostini aytaman: kechikish ishlab chiqarish tomonidan bo'ldi, men bog'liq emasman.", pts: 0 },
          { t: "Avval ishlab chiqarishdan aniq holatni bilib, keyin mijozga real ma'lumot bilan qaytaman.", pts: 2 },
          { t: "Uzr so'rab, «tez orada hal bo'ladi» deb tinchitib, orqada tezlashtirishga urinaman.", pts: 1 },
        ],
      },
      {
        q: "Sen bir savdoni «bo'ldi» deb belgilab qo'ymoqchisan, lekin mijoz hali to'lamagan/tasdiqlamagan. Oylik hisobotga o'sha savdo kiradi.",
        opts: [
          { t: "Kiritaman, lekin yoniga «hali tasdiqlanmagan» izohini qo'shaman.", pts: 2 },
          { t: "Aniq holatni belgilayman: hali tasdiqlanmagan — hisobot rost bo'lishi kerak.", pts: 3 },
          { t: "Aniq bilmayman; odatda qanday qoldirsam, shundayligicha qoldiraman.", pts: 1 },
          { t: "Deyarli aniq bo'ladigan savdo, shuning uchun hisobotga kiritaman; oxirida o'zi to'g'rilanadi.", pts: 0 },
        ],
      },
      {
        q: "Kun sokin, yangi lid kam.",
        opts: [
          { t: "Bo'sh vaqtdan foydalanib, hujjat va bazani tartibga solaman.", pts: 2 },
          { t: "Yangi lidlar kelishini kutib, kelgan zahoti tez javob berishga tayyor turaman.", pts: 1 },
          { t: "Eski mijozlarni qayta jonlantiraman, bazani ko'rib chiqaman, marketingdan yangi yondashuv so'rayman.", pts: 3 },
          { t: "Bugun oqim sust; sun'iy ish yaratgandan ko'ra tabiiy lid kelishini kutaman.", pts: 0 },
        ],
      },
      {
        q: "Mijoz kompaniya yaxshi eplamaydigan yoki o'z vaqtida bera olmaydigan narsani so'rayapti.",
        opts: [
          { t: "«Buni biz yaxshi eplamaymiz» deb ochiq aytib, buyurtmadan voz kechaman.", pts: 1 },
          { t: "Buyurtmani yo'qotmaslik uchun «ha, qilamiz» deb olaman, keyin bir amallaymiz.", pts: 0 },
          { t: "Rahbardan so'rab, buni olish-olmaslikni u hal qilsin.", pts: 2 },
          { t: "Moslik haqida halol bo'laman, real eplaydigan variantni taklif qilaman.", pts: 3 },
        ],
      },
    ],
  },
  {
    key: "oshpaz",
    label: "Oshpaz",
    qs: [
      {
        q: "Tushlik (obed) belgilangan vaqtda tayyor bo'lishi kerak, lekin bugun orqada qolyapsan.",
        opts: [
          { t: "Asosiy taomni o'z vaqtida chiqarishga urinaman; kerak bo'lsa garnir/salatni soddalashtiraman, biroz kechiksa oldindan aytaman.", pts: 3 },
          { t: "Ulgurish uchun olovni ko'tarib tez pishiraman; ustidan tayyor ko'rinsa, chiqaraveraman.", pts: 0 },
          { t: "Sifat buzilmasin deb shoshmayman; taom biroz kech bo'lsa ham to'liq pishirib beraman.", pts: 1 },
          { t: "Kechikayotganimni oldindan aytaman va necha daqiqa kechishini bildiraman.", pts: 2 },
        ],
      },
      {
        q: "Idish yoki qozon ko'zga toza ko'rinadi, lekin sen uni to'liq yuvmaganingni bilasan.",
        opts: [
          { t: "Hozir band bo'lganim uchun chetga qo'yaman, keyin bo'sh vaqtda yaxshilab yuvaman.", pts: 2 },
          { t: "Qaytadan yaxshilab yuvaman — ko'rinishi emas, tozaligi muhim.", pts: 3 },
          { t: "Issiq suv bilan bir chayib olaman, shu yetarli bo'ladi.", pts: 1 },
          { t: "Ko'zga toza ko'rinsa, artib ustidan chayib ishlataveraman — vaqt tejaladi.", pts: 0 },
        ],
      },
      {
        q: "Holodilnikdagi mahsulot buzila boshlaganini sezding — aynan shuni pishirmoqchi eding.",
        opts: [
          { t: "Ishlatmayman, boshqa narsa pishiraman — buzuqni chiqarib tashlayman.", pts: 2 },
          { t: "Hidlab, ko'rib ko'raman; unchalik yomon bo'lmasa, ozgina ishlataman.", pts: 1 },
          { t: "Buni ishlatmayman, menyuni o'zgartiraman va yangisini olish kerakligini aytaman.", pts: 3 },
          { t: "Yaxshilab pishirsam issiqda hammasi o'ladi; shuning uchun ishlataveraman.", pts: 0 },
        ],
      },
      {
        q: "Obeddan keyin idishlar ko'p, kechki tayyorgarlik ham boshiga tushib turibdi.",
        opts: [
          { t: "Tez yuvib olaman, lekin joyiga terishni ish tugagach, kechqurun qilaman.", pts: 2 },
          { t: "Kechki zichlik tufayli idishlarni bir joyga yig'ib qo'yaman, imkon bo'lganda yuvaman.", pts: 0 },
          { t: "Eng kerakli idishlarni yuvaman, qolganini keyinga qoldiraman.", pts: 1 },
          { t: "Idishlarni yuvib joyiga qo'yaman — keyingi ovqatga toza oshxona kerak, bu qoldirilmaydi.", pts: 3 },
        ],
      },
      {
        q: "Gaz yoki biror mahsulot tugab qolish arafasida ekanini sezding.",
        opts: [
          { t: "Tugashini kutmasdan, mas'ul odamga oldindan aytaman — vaqtida to'ldirilsin.", pts: 3 },
          { t: "Hali ozgina bor; butunlay tugaganda aytaman, shunda aniq bo'ladi.", pts: 0 },
          { t: "Kamayganini ko'rsam, imkon topib mas'ulga aytaman.", pts: 2 },
          { t: "O'zim eslab qo'yaman, keyingi bozorlikda aytishga urinaman.", pts: 1 },
        ],
      },
      {
        q: "Gaz plita yoki mikrovalnovka iflos — ehtimol sen iflos qilmagansan.",
        opts: [
          { t: "O'z joyimni tozalayman, umumiy joyni asosiy tozalash vaqtida qilaman.", pts: 2 },
          { t: "Oshxona tartibi mening zimmamda; kim iflos qilganidan qat'i nazar, tozalab qo'yaman.", pts: 3 },
          { t: "Iflos qilgan odam o'zi tozalasa to'g'ri bo'ladi; men faqat o'zim ishlatgan joyni tozalayman.", pts: 0 },
          { t: "Vaqtim bo'lganda umumiy tozalikni ham qilaman, hozir o'z ishimga ulguray.", pts: 1 },
        ],
      },
    ],
  },
  {
    key: "ai",
    label: "AI menejer",
    qs: [
      {
        q: "Rahbar (texnik bilimi yo'q) sen qurgan avtomatlashtirish haqida so'radi: «bu qanday ishlaydi?»",
        opts: [
          { t: "Tizim qanday qurilganini batafsil aytaman: n8n, OData, webhook — qanchalik murakkab ekanini ko'rsataman.", pts: 0 },
          { t: "Natijani ko'rsataman: mana hisobot o'zi chiqdi, mana lidlar CRMga tushdi.", pts: 2 },
          { t: "Sodda til bilan, biznes foydasini tushuntiraman: nima ishni tezlashtiradi, qancha vaqt tejaydi — atamalarsiz.", pts: 3 },
          { t: "«Murakkab narsa, ishlayapti — ishonavering» deb qisqa qilaman.", pts: 1 },
        ],
      },
      {
        q: "Botning oylik savdo hisoboti bir raqamni haqiqatdan katta ko'rsatyapti — nimadir noto'g'riday.",
        opts: [
          { t: "Yuboraman, lekin «bu raqamni bir tekshirib ko'ring» deb izoh qo'shaman.", pts: 2 },
          { t: "Tizim avtomatik hisoblagan, demak to'g'ri; shundayligicha yuboraman.", pts: 0 },
          { t: "Raqamni o'zim mantiqan to'g'riroq ko'ringan songa tuzatib yuboraman.", pts: 1 },
          { t: "Rahbarga yubormasdan oldin manba (1C) bilan solishtirib tekshiraman, xatoni topaman.", pts: 3 },
        ],
      },
      {
        q: "Yangi zo'r AI vosita topding. Ayni paytda savdo rejadan ancha past.",
        opts: [
          { t: "Hozir savdoni ko'taradigan ishga e'tibor beraman; bu vositani faqat shunga foydasi bo'lsa olaman.", pts: 3 },
          { t: "Asosiy ishni buzmay, uni kichik hajmda sinab ko'raman.", pts: 2 },
          { t: "Rahbarga katta yangi tizim taklif qilaman — bu bizni zamonaviylashtiradi.", pts: 1 },
          { t: "Avval shu ta'sirli vositani joriy qilaman — kompaniya yangilanadi.", pts: 0 },
        ],
      },
      {
        q: "Sen qurgan avtomatlashtirish 2 kun jimgina lid tortishni to'xtatib qo'ygan — hozir sezding.",
        opts: [
          { t: "Tuzataman; uzilishni hech kim sezmagan, shuning uchun alohida aytishning hojati yo'q.", pts: 0 },
          { t: "Aybni tan olaman, sotuv/rahbarni ogohlantiraman, tuzataman va endi jim to'xtamasligi uchun ogohlantirish (alert) qo'shaman.", pts: 3 },
          { t: "Tuzataman, keyin bir payt rahbarga o'tib ketgan uzilishni aytaman.", pts: 2 },
          { t: "Buni tashqi platforma/API uzilishi bo'lgani uchun deb tushuntiraman.", pts: 1 },
        ],
      },
      {
        q: "Rahbar barcha lidlarga har kuni reklama xabari yuborishni xohlayapti (bu spam bo'lib, lidlarni bezdiradi).",
        opts: [
          { t: "Aytilganday qilaman — u rahbar, qarori o'ziniki, fikrim o'zimda qoladi.", pts: 2 },
          { t: "Uning o'rniga o'zimning «aqlliroq» versiyamni qilib qo'yaman.", pts: 0 },
          { t: "Maqsadiga xizmat qiladigan variant qilaman, lekin spam xavfini (lidlar ketishi) aytib, aqlliroq chastota taklif qilaman.", pts: 3 },
          { t: "Fikrimni o'tkazguncha, uni bu g'oyadan qaytarishga urinaman.", pts: 1 },
        ],
      },
      {
        q: "Mijozga ketadigan CRM xabarlari/tahlilni AI bilan tayyorlading.",
        opts: [
          { t: "Kimdir shikoyat qilsa keyin to'g'rilayman, hozir yuboraveraman.", pts: 1 },
          { t: "Tez ko'z yugurtirib, ko'zga tashlangan narsalarni to'g'rilayman.", pts: 2 },
          { t: "AI ilg'or, shuning uchun natijasini to'g'ridan-to'g'ri yuboraman — vaqt tejaladi.", pts: 0 },
          { t: "Jonli ketishidan oldin AI natijasini o'qib, tekshirib, to'g'rilayman — AI qoralama, yakuniy emas.", pts: 3 },
        ],
      },
    ],
  },
  {
    key: "dizayn",
    label: "Dizayn",
    qs: [
      {
        q: "Mijoz aniq brief (topshiriq) berdi, lekin sen o'z g'oyang chiroyliroq deb o'ylayapsan.",
        opts: [
          { t: "So'ralganini qilaman, lekin o'z variantimni ham qo'shimcha taklif sifatida ko'rsataman.", pts: 3 },
          { t: "O'z fikrimni qabul qildirishga urinib, avval mijozni ishontirmoqchi bo'laman.", pts: 1 },
          { t: "Ularga o'zimning yaxshiroq versiyamni beraman — ko'rsa yoqib qoladi.", pts: 0 },
          { t: "Aynan brief bo'yicha qilaman, g'oyam o'zimda qoladi.", pts: 2 },
        ],
      },
      {
        q: "Mijoz allaqachon tasdiqlagan dizaynda xato (masalan, noto'g'ri telefon raqami) borligini payqading — bu hozir bannerga chop etilmoqda.",
        opts: [
          { t: "Chop etilgach muammo chiqsa, o'shanda aytaman.", pts: 1 },
          { t: "To'xtataman va chop etishdan oldin menejer/mijozga darrov aytaman — bosilgan xato qimmatga tushadi.", pts: 3 },
          { t: "Aniq xato (raqam) bo'lgani uchun to'g'rilab, tez tasdiqlatib chop etaman.", pts: 2 },
          { t: "Mijoz tasdiqlagan, javobgarlik uniki; tasdiqlangan holda chop etaman.", pts: 0 },
        ],
      },
      {
        q: "Dizayn bugun topshiriladi. U yaxshi, lekin sen yana sayqal berishni xohlayapsan.",
        opts: [
          { t: "Mukammal bo'lguncha sayqallayveraman, kechiksa ham a'lo chiqsin.", pts: 0 },
          { t: "O'z vaqtida topshiraman, yetarli darajada yaxshi.", pts: 2 },
          { t: "O'z vaqtida tayyor variantni topshiraman; xohlasangiz yana sayqallayman deb aytaman.", pts: 3 },
          { t: "Muddatni biroz cho'zib bo'lsa ham mukammal qilaman.", pts: 1 },
        ],
      },
      {
        q: "Dizaynni mijozga yoki chopga yuborishdan oldin.",
        opts: [
          { t: "Yuboraman, mijoz ko'rsa aytadi.", pts: 1 },
          { t: "Bir marta ko'z yugurtirib olaman.", pts: 2 },
          { t: "Tajribaliman, kam xato qilaman — shuning uchun to'g'ridan yuboraman.", pts: 0 },
          { t: "Har safar tez o'z-o'zini tekshiraman: imlo, o'lchamlar, brend ranglari.", pts: 3 },
        ],
      },
      {
        q: "Mijozning briefi mavhum: «chiroyli, ko'zga tashlanadigan qilib bering».",
        opts: [
          { t: "1-2 ta aniq savol beraman (auditoriya, majburiy narsalar), keyin yo'nalish taklif qilaman.", pts: 3 },
          { t: "Har bir mayda detal aniqlanguncha savol beraveraman.", pts: 1 },
          { t: "So'ramay, o'zim eng yaxshi deb bilganimni qilaman.", pts: 0 },
          { t: "2-3 variant qilib beraman, o'zlari tanlashsin.", pts: 2 },
        ],
      },
      {
        q: "Mijoz dizayningni 3-marta rad etdi, asabiylashgani sezilyapti.",
        opts: [
          { t: "Dizaynim yaxshi ekanini tushuntirib, himoya qilaman.", pts: 1 },
          { t: "Bir qadam orqaga chekinib, aslida nima yetishmayotganini aniqlayman, yondashuvni o'zgartiraman.", pts: 3 },
          { t: "Aniq nimani o'zgartirishni so'rab, aytilganini qilaman.", pts: 2 },
          { t: "Mijoz o'zi nima xohlashini bilmaydi; variant yuboraveraman.", pts: 0 },
        ],
      },
    ],
  },
  {
    key: "tseh",
    label: "Tseh hodimi",
    qs: [
      {
        q: "Buyurtma bo'yicha qimmat materialga chop etish/kesish oldidasan.",
        opts: [
          { t: "Bir marta tez ko'rib chiqaman.", pts: 2 },
          { t: "Aniq bo'lmasa, ehtiyot uchun sal ko'proq qilib kesaman.", pts: 1 },
          { t: "Kesishdan oldin o'lchamlar va spekni buyurtma bilan yana bir tekshiraman.", pts: 3 },
          { t: "Ko'p marta qilganman, darrov kesaveraman.", pts: 0 },
        ],
      },
      {
        q: "Buyurtma speki senga noto'g'riday ko'rinyapti (masalan, g'alati o'lcham).",
        opts: [
          { t: "O'zim to'g'ri deb bilganimga o'zgartirib ishlab chiqaraman.", pts: 0 },
          { t: "Yozilganidek aynan ishlab chiqaraman, g'alati bo'lsa ham.", pts: 2 },
          { t: "Ehtiyot uchun ikkala versiyani ham qilib qo'yaman.", pts: 1 },
          { t: "To'xtab, ishlab chiqarishdan oldin mas'ul odam bilan aniqlab olaman.", pts: 3 },
        ],
      },
      {
        q: "Xato kesib/chop etib, bir varaq qimmat materialni buzding. Hech kim ko'rmagan.",
        opts: [
          { t: "Darrov menejerga aytaman — zaxira va xarajat hisobga olinsin, kerak bo'lsa qayta buyurtma qilinsin.", pts: 3 },
          { t: "Qayta qilaman, keyin material ketganini aytaman.", pts: 2 },
          { t: "Bir o'zim qayta qilaman; zaxira yetsa, alohida aytmayman.", pts: 1 },
          { t: "Har kimda material buziladi; bu ishning bir qismi, aytishning hojati yo'q.", pts: 0 },
        ],
      },
      {
        q: "Kesish mashinasi/printer nosozlik beryapti yoki himoya qismi bo'shab qolgan.",
        opts: [
          { t: "Davom etaman, lekin smena tugagach mas'ulga aytaman.", pts: 2 },
          { t: "To'xtataman va davom etishdan oldin xavfsiz tarzda xabar beraman / hal qilaman.", pts: 3 },
          { t: "O'zim ish ustida tuzatishga urinaman.", pts: 1 },
          { t: "Hali ishlayapti, muddatga ulgurish uchun davom etaveraman.", pts: 0 },
        ],
      },
      {
        q: "Muhim material tugab qolish arafasida ekanini ko'rding.",
        opts: [
          { t: "O'zim boshqa material bilan almashtirib, jimgina davom etaman.", pts: 1 },
          { t: "Bori bilan ishlayveraman, butunlay tugaganda aytaman.", pts: 0 },
          { t: "Tugashini kutmasdan, mas'ul odamga oldindan aytaman — vaqtida to'ldirilsin.", pts: 3 },
          { t: "Kamayganini ko'rsam, imkon topib aytaman.", pts: 2 },
        ],
      },
      {
        q: "Shoshilinch ish, tugatuvchi bosqich (chekka kesish/laminatsiya) qo'shimcha vaqt oladi.",
        opts: [
          { t: "Tugatuvchi bosqichni tashlab ketaman, odatda baribir yaxshi ko'rinadi.", pts: 0 },
          { t: "Hammasini to'liq qilaman, juda kechiksa ham.", pts: 1 },
          { t: "Bosqichning tezroq variantini qilaman.", pts: 2 },
          { t: "Mijoz natijasiga muhim bosqichni bajaraman; chindan vaqt bo'lmasa, yon berishni oldindan aytaman.", pts: 3 },
        ],
      },
    ],
  },
];

// Maximum possible points per module (used to show "score / max").
export function personalMaxPts(mod: PersonalModule): number {
  return mod.qs.length * 3;
}
