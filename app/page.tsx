"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { listSectionsWithQuestions, type DbSection, type DbQuestion } from "../lib/quizApi";
import AdminQuestions from "../components/AdminQuestions";
import SectionFormModal from "../components/SectionFormModal";
import QuestionFormModal from "../components/QuestionFormModal";
import QuestionsList from "../components/QuestionsList";

// Force Next.js to render this strictly on demand to fix build loops
export const dynamic = "force-dynamic";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_PASS = "Alcana2024";
const LK = "alcana_v5";

// ─── PREMIUM CSS ───────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',system-ui,sans-serif;background:#f9fafb;color:#111827;-webkit-font-smoothing:antialiased;line-height:1.6;}
::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:#f3f4f6;} ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px;}

@keyframes heroGlow{0%,100%{opacity:.55;transform:scale(1);}50%{opacity:1;transform:scale(1.12);}}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg);}33%{transform:translateY(-14px) rotate(2deg);}66%{transform:translateY(-7px) rotate(-1deg);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideR{from{opacity:0;transform:translateX(42px);}to{opacity:1;transform:translateX(0);}}
@keyframes slideL{from{opacity:0;transform:translateX(-42px);}to{opacity:1;transform:translateX(0);}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:scale(1);}}
@keyframes bounceIn{0%{transform:scale(0.2);opacity:0;}55%{transform:scale(1.1);}75%{transform:scale(0.95);}100%{transform:scale(1);opacity:1;}}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-18px) scale(0.88);}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}}
@keyframes checkPop{0%{transform:scale(0) rotate(-10deg);}60%{transform:scale(1.25) rotate(5deg);}100%{transform:scale(1) rotate(0deg);}}
@keyframes drift{0%{transform:translateY(0) translateX(0);opacity:0;}8%{opacity:.5;}90%{opacity:.3;}100%{transform:translateY(-110vh) translateX(50px);opacity:0;}}
@keyframes gradPulse{0%,100%{opacity:.5;}50%{opacity:1;}}
@keyframes shimmer{from{background-position:-400% center;}to{background-position:400% center;}}
@keyframes ringIn{from{stroke-dasharray:0 450;}to{}}
@keyframes glow{0%,100%{box-shadow:0 4px 14px rgba(22,163,74,.35);}50%{box-shadow:0 4px 22px rgba(22,163,74,.65),0 0 30px rgba(22,163,74,.2);}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
@keyframes barFill{from{width:0;}to{}}

.au{animation:fadeUp .45s cubic-bezier(.4,0,.2,1) both;}
.sr{animation:slideR .3s cubic-bezier(.4,0,.2,1) both;}
.sl{animation:slideL .3s cubic-bezier(.4,0,.2,1) both;}
.si{animation:scaleIn .38s cubic-bezier(.4,0,.2,1) both;}
.bi{animation:bounceIn .65s cubic-bezier(.175,.885,.32,1.275) both;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;font-family:inherit;font-weight:600;letter-spacing:-.01em;white-space:nowrap;transition:all 200ms cubic-bezier(.4,0,.2,1);-webkit-user-select:none;user-select:none;}
.btn-p{background:#16a34a;color:#fff;border-radius:10px;padding:13px 24px;font-size:15px;box-shadow:0 4px 14px rgba(22,163,74,.38),0 1px 3px rgba(0,0,0,.1);}
.btn-p:hover:not(:disabled){background:#15803d;transform:translateY(-2px);box-shadow:0 10px 24px rgba(22,163,74,.48),0 2px 6px rgba(0,0,0,.12);}
.btn-p:active:not(:disabled){transform:translateY(0);box-shadow:0 4px 14px rgba(22,163,74,.38);}
.btn-p:disabled{background:#9ca3af;box-shadow:none;cursor:not-allowed;opacity:.65;}
.btn-p-glow{animation:glow 2.5s ease-in-out infinite;}
.btn-s{background:#fff;color:#374151;border:1.5px solid #e5e7eb;border-radius:10px;padding:12px 22px;font-size:14.5px;}
.btn-s:hover{border-color:#16a34a;color:#16a34a;background:#f9fafb;}
.btn-ghost{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.22);border-radius:20px;padding:7px 14px;font-size:13px;}
.btn-ghost:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.4);}
.btn-w{width:100%;}

/* INPUTS */
.inp{width:100%;padding:12px 16px;border-radius:8px;border:1.5px solid #e5e7eb;font-size:15px;font-family:inherit;color:#111827;background:#fff;outline:none;transition:all 200ms;box-sizing:border-box;}
.inp:focus{border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.12);}
.inp::placeholder{color:#9ca3af;}

/* OPTION BUTTONS */
.opt{display:flex;align-items:center;gap:14px;width:100%;padding:15px 18px;margin-bottom:10px;border-radius:12px;border:2px solid #e5e7eb;background:#fff;cursor:pointer;font-size:15px;font-weight:400;text-align:left;color:#374151;font-family:inherit;line-height:1.5;transition:all 200ms cubic-bezier(.4,0,.2,1);}
.opt:hover{border-color:#86efac;background:#f9fafb;transform:translateX(4px);box-shadow:0 2px 8px rgba(22,163,74,.08);}
.opt.sel{border-color:#16a34a;background:linear-gradient(135deg,#f0fdf4,#dcfce7);transform:translateX(4px);box-shadow:0 4px 14px rgba(22,163,74,.15);color:#166534;font-weight:500;}
.opt-lbl{width:32px;height:32px;min-width:32px;border-radius:9px;background:#f3f4f6;color:#374151;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;transition:all 200ms;}
.opt.sel .opt-lbl{background:#16a34a;color:#fff;}
.chk{margin-left:auto;font-size:16px;flex-shrink:0;animation:checkPop .3s cubic-bezier(.175,.885,.32,1.275) both;}

/* CARDS */
.card{background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.05);}
.card-p{padding:24px;} .card-p-lg{padding:32px;}

/* PROGRESS */
.prog{height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;}
.prog-f{height:100%;border-radius:4px;background:linear-gradient(90deg,#16a34a,#10b981);transition:width 500ms cubic-bezier(.4,0,.2,1);box-shadow:0 0 10px rgba(22,163,74,.4);}

/* NAV DOTS */
.ndot{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all 150ms;border:2px solid transparent;font-family:inherit;}
.ndot:hover{transform:scale(1.15);}

/* BADGES */
.bdg{display:inline-flex;align-items:center;gap:4px;border-radius:20px;padding:5px 12px;font-size:12.5px;font-weight:700;}
.bdg-p{background:#dcfce7;color:#166534;border:1.5px solid rgba(22,163,74,.3);}
.bdg-r{background:#fef9c3;color:#92400e;border:1.5px solid rgba(245,158,11,.3);}
.bdg-f{background:#fee2e2;color:#991b1b;border:1.5px solid rgba(239,68,68,.3);}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;}
.tbl th{padding:14px 16px;text-align:left;font-size:12.5px;font-weight:700;color:#fff;letter-spacing:.03em;}
.tbl td{padding:13px 16px;font-size:13.5px;border-bottom:1px solid #f3f4f6;color:#374151;}
.tbl tr:hover td{background:#f9fafb;}
.tbl tr:last-child td{border-bottom:none;}

/* HERO */
.hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#071810 0%,#0d2818 35%,#163824 65%,#0d2818 100%);padding:68px 24px 88px;text-align:center;}
.hero-g1{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(22,163,74,.22) 0%,transparent 68%);top:-280px;left:-180px;animation:gradPulse 7s ease-in-out infinite;}
.hero-g2{position:absolute;width:550px;height:550px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.16) 0%,transparent 68%);bottom:-240px;right:-120px;animation:gradPulse 9s ease-in-out infinite 2.5s;}
.hero-grid{position:absolute;inset:0;opacity:.035;background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);background-size:48px 48px;}
.hero-wave{position:absolute;bottom:0;left:0;right:0;height:52px;overflow:hidden;}
.glass-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:16px;padding:20px 16px;text-align:center;transition:all 250ms;}
.glass-card:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.22);transform:translateY(-3px);}

/* LANG DROPDOWN */
.lang-dd{position:absolute;top:48px;right:0;background:#fff;border:1.5px solid #e5e7eb;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.12);overflow:hidden;z-index:999;min-width:160px;animation:slideDown .2s ease both;}
.lang-item{padding:12px 16px;cursor:pointer;font-size:14px;font-family:inherit;transition:all .12s;display:flex;align-items:center;gap:10px;border-left:3px solid transparent;}
.lang-item:hover{background:#f3f4f6;border-left-color:#16a34a;color:#16a34a;}
.lang-item.active{background:#f0fdf4;border-left-color:#16a34a;color:#166534;font-weight:600;}
`;

// ─── TRANSLATIONS ──────────────────────────────────────────
// ─── LATIN → CYRILLIC UZBEK TRANSLITERATION ───────────────
function toCyrl(s:string):string{
  if(!s||typeof s!=="string")return s;
  let out=s;
  // multi-char digraphs first
  const multi:[string,string][]=[
    ["yo'","йў"],["Yo'","Йў"],["YO'","ЙЎ"],
    ["g'","ғ"],["G'","Ғ"],
    ["o'","ў"],["O'","Ў"],
    ["sh","ш"],["Sh","Ш"],["SH","Ш"],
    ["ch","ч"],["Ch","Ч"],["CH","Ч"],
    ["yo","ё"],["Yo","Ё"],["YO","Ё"],
    ["yu","ю"],["Yu","Ю"],["YU","Ю"],
    ["ya","я"],["Ya","Я"],["YA","Я"],
  ];
  for(const[a,b]of multi)out=out.split(a).join(b);
  // Note: c→к in Uzbek transliteration (Alcana → Алкана, not Алцана).
  const map:Record<string,string>={a:"а",b:"б",c:"к",d:"д",e:"е",f:"ф",g:"г",h:"ҳ",i:"и",j:"ж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",q:"қ",r:"р",s:"с",t:"т",u:"у",v:"в",w:"в",x:"х",y:"й",z:"з",A:"А",B:"Б",C:"К",D:"Д",E:"Е",F:"Ф",G:"Г",H:"Ҳ",I:"И",J:"Ж",K:"К",L:"Л",M:"М",N:"Н",O:"О",P:"П",Q:"Қ",R:"Р",S:"С",T:"Т",U:"У",V:"В",W:"В",X:"Х",Y:"Й",Z:"З","'":"ъ"};
  out=out.replace(/[a-zA-Z']/g,c=>map[c]||c);
  return out;
}
function deepCyrl(o:any):any{
  if(o===null||o===undefined)return o;
  if(typeof o==="string")return toCyrl(o);
  if(Array.isArray(o))return o.map(deepCyrl);
  if(typeof o==="object"){const r:any={};for(const k in o)r[k]=deepCyrl(o[k]);return r;}
  return o;
}

const T:any={
  uz:{lang:"UZ",h:{admin:"Admin",mus:"🌊 Musiqa",musOff:"🔇 Musiqa",exit:"Chiqish"},home:{badge:"Yangi Xodim Testi",hero:"Alcana Group",sub:"Yangi xodimlarni baholash platformasi",dur:"30 savol · ~15 daqiqa",info:"Ma'lumotlaringizni kiriting",fnL:"Ism",fnP:"Ismingiz...",lnL:"Familiya",lnP:"Familiyangiz...",start:"Testni Boshlash →",err:"Iltimos, ism va familiyangizni kiriting!",hint:"Tinch okean musiqasi uchun yuqoridagi tugmani bosing 🌊",s27:"O'tdi",s20:"Qayta",s0:"O'tmadi"},test:{q:"Savol",ans:"javoblandi",prev:"← Oldingi",next:"Keyingi →",sub:"Testni Yakunlash",unans:"ta javobsiz",jump:"Tez o'tish:",clear:"Javobni o'zgartirish",att:"urinish"},res:{cong:"Tabriklaymiz!",again:"Yana bir bor!",sorry:"Afsuski...",passM:"🎉 Siz Alcana Group jamoasiga to'liq loyiqsiz! HR bo'limi siz bilan tez orada bog'lanadi.",retryM:"Siz chegaradan o'tdingiz! Materiallarni qayta o'qib chiqing va ikkinchi urinishda muvaffaqiyat qozing.",failM:"Bu safar kutilgan natijaga erisha olmadingiz. Kuchingizni to'plab, keyinroq qayta murojaat qilishingiz mumkin.",retry:"🔄 Qayta urinish",home:"🏠 Bosh sahifa",cloud:"☁️ Bulutga saqlandi",local:"💾 Qurilmaga saqlandi",cats:["Kompaniya","Qadriyatlar","HR Siyosat","Xulq-Atvor","Innovatsiya"]},adm:{title:"Admin Boshqaruv Paneli",pLbl:"Parolni kiriting...",login:"Kirish →",wrong:"❌ Noto'g'ri parol!",tot:"Jami",pass:"O'tdi",ret:"Qayta",fail:"O'tmadi",all:"Barchasi",search:"Ism bo'yicha...",none:"Natija topilmadi",hdrs:["#","Ism Familiya","Ball","%","Urinish","Holat","Sana"],exp:"📊 CSV",clr:"🗑️ Tozalash",pL:"✅ O'tdi",rL:"⚠️ Qayta",fL:"❌ O'tmadi",sub:"Faqat vakolatli menejerlar",sb:"☁️ Supabase",lc:"💾 Mahalliy"},mot:["Ajoyib! 🌊","Zo'r! ✨","Davom eting! 💪","A'lo! 🎯","Kuchli! 🔥","Olg'a! 🚀"]},
  ru:{lang:"RU",h:{admin:"Админ",mus:"🌊 Музыка",musOff:"🔇 Музыка",exit:"Выход"},home:{badge:"Тест нового сотрудника",hero:"Alcana Group",sub:"Платформа адаптации сотрудников",dur:"30 вопросов · ~15 минут",info:"Введите ваши данные",fnL:"Имя",fnP:"Ваше имя...",lnL:"Фамилия",lnP:"Ваша фамилия...",start:"Начать тест →",err:"Пожалуйста, введите имя и фамилию!",hint:"Нажмите кнопку выше для звуков океана 🌊",s27:"Прошёл",s20:"Повтор",s0:"Не прошёл"},test:{q:"Вопрос",ans:"отвечено",prev:"← Назад",next:"Далее →",sub:"Завершить тест",unans:"без ответа",jump:"Быстрый переход:",clear:"Изменить ответ",att:"попытка"},res:{cong:"Поздравляем!",again:"Ещё раз!",sorry:"К сожалению...",passM:"🎉 Вы полностью подходите для вступления в команду Alcana Group!",retryM:"Вы перешли порог! Повторно изучите материалы и попробуйте снова.",failM:"На этот раз не удалось достичь результата. Обращайтесь позднее.",retry:"🔄 Повторить",home:"🏠 Главная",cloud:"☁️ Сохранено в облаке",local:"💾 Сохранено на устройстве",cats:["Компания","Ценности","HR Политика","Поведение","Инновации"]},adm:{title:"Панель администратора",pLbl:"Введите пароль...",login:"Войти →",wrong:"❌ Неверный пароль!",tot:"Всего",pass:"Прошли",ret:"Повтор",fail:"Не прошли",all:"Все",search:"Поиск по имени...",none:"Результатов не найдено",hdrs:["#","Имя Фамилия","Балл","%","Попытка","Статус","Дата"],exp:"📊 CSV",clr:"🗑️ Очистить",pL:"✅ Прошёл",rL:"⚠️ Повтор",fL:"❌ Не прошёл",sub:"Только авторизованные менеджеры",sb:"☁️ Supabase",lc:"💾 Локально"},mot:["Отлично! 🌊","Здорово! ✨","Продолжайте! 💪","Превосходно! 🎯","Сильно! 🔥","Вперёд! 🚀"]},
  en:{lang:"EN",h:{admin:"Admin",mus:"🌊 Music",musOff:"🔇 Music",exit:"Exit"},home:{badge:"New Employee Test",hero:"Alcana Group",sub:"Onboarding Assessment Platform",dur:"30 questions · ~15 minutes",info:"Enter your information",fnL:"First Name",fnP:"Your first name...",lnL:"Last Name",lnP:"Your last name...",start:"Start Test →",err:"Please enter your first and last name!",hint:"Click the button above for ocean sounds 🌊",s27:"Passed",s20:"Retry",s0:"Failed"},test:{q:"Question",ans:"answered",prev:"← Previous",next:"Next →",sub:"Submit Test",unans:"unanswered",jump:"Quick jump:",clear:"Change answer",att:"attempt"},res:{cong:"Congratulations!",again:"Try Again!",sorry:"Unfortunately...",passM:"🎉 You are fully eligible to join the Alcana Group team! HR will contact you soon.",retryM:"You crossed the threshold! Review the materials and succeed on your second attempt.",failM:"This time you didn't reach the expected result. Gather your strength and reapply later.",retry:"🔄 Retry",home:"🏠 Home",cloud:"☁️ Saved to cloud",local:"💾 Saved to device",cats:["Company","Values","HR Policy","Conduct","Innovation"]},adm:{title:"Admin Control Panel",pLbl:"Enter password...",login:"Login →",wrong:"❌ Wrong password!",tot:"Total",pass:"Passed",ret:"Retry",fail:"Failed",all:"All",search:"Search by name...",none:"No results found",hdrs:["#","Full Name","Score","%","Attempt","Status","Date"],exp:"📊 CSV",clr:"🗑️ Clear",pL:"✅ Passed",rL:"⚠️ Retry",fL:"❌ Failed",sub:"Authorized managers only",sb:"☁️ Supabase",lc:"💾 Local"},mot:["Amazing! 🌊","Great! ✨","Keep going! 💪","Excellent! 🎯","Strong! 🔥","Forward! 🚀"]}
};
// 4th language: Uzbek in Cyrillic letters, auto-derived from Latin Uzbek
T["uz-cyrl"]=deepCyrl(T.uz);
T["uz-cyrl"].lang="УЗ";

// ─── QUESTIONS ─────────────────────────────────────────────
const QS={
  uz:[
    {q:"1. Alcana Group o'zini bozorda qanday kompaniya sifatida namoyon etadi?",opts:["Mijozlarga eng arzon xizmat ko'rsatuvchi reklama agentligi","G'oyalarni natijaga aylantiradigan va bizneslarga real qiymat beradigan jamoa","Faqat tayyor andozalar asosida ishlaydigan poligrafiya korxonasi","Faqat yirik davlat buyurtmalari bilan ishlaydigan yopiq tashkilot"],ans:1},
    {q:"2. Kompaniyaning yaqin yillar ichidagi katta maqsadlaridan biri qaysi javobda to'g'ri ko'rsatilgan?",opts:["O'zbekistondagi eng ko'p xodimga ega kompaniyaga aylanish","Faqat onlayn reklama bozorini to'liq egallash","Xalqaro miqyosda raqobatlashuvchi brend qurish va 7 qavatli shaxsiy binoga ega bo'lish","Barcha ishlab chiqarish jarayonlarini autsorsingga topshirish"],ans:2},
    {q:"3. Alcana Group kelajakda o'z jamoasi uchun qanday qulaylik yaratishni maqsad qilgan?",opts:["Haftada faqat 3 kun ishlash tizimiga o'tish","Uyda o'tirib ishlash tizimini joriy etish","3 mahal kompaniya hisobidan ovqat bilan ta'minlash","Har yili xodimlarni chet elga bepul sayohatga yuborish"],ans:2},
    {q:"4. O'rta Osiyo va O'zbekiston bozorida qaysi o'rinni egallash maqsad qilingan?",opts:["Eng ko'p daromad ko'radigan top-5 talikka kirish","Eng kuchli 10 ta ichki va tashqi reklama agentliklaridan biriga aylanish","Faqat raqamli marketing bo'yicha 1-o'rinni egallash","Bozorning kamida 80 foiz ulushini nazorat qilish"],ans:1},
    {q:"5. Alcana Group kelajakdagi strategik rejalariga ko'ra qaysi davlat bilan qo'shma korxona ochishni maqsad qilgan?",opts:["Turkiya davlati bilan hamkorlikda yangi startap loyihasini","BAA (Dubay) bozorida xalqaro filial ochishni","Xitoy davlati bilan qo'shma korxona ochib ishlashni","Rossiya kompaniyalari bilan reklama tarmoqlarini birlashtirishni"],ans:2},
    {q:"6. Quyidagilardan qaysi biri Alcana Group kompaniyasining asosiy ustunlari (qadriyatlari) hisoblanadi?",opts:["Tezlik, raqobatchilarni yo'qotish, maxfiylik","Halollik, adolat, mas'uliyat, natija va rivojlanish","Kreativlik, erkinlik, individual yondashuv","Tajriba, moslashuvchanlik, mijozning har qanday talabini bajarish"],ans:1},
    {q:"7. Kompaniya qadriyatlariga ko'ra, qaysi yo'nalish bilan hamkorlik qilishga ruxsat etiladi?",opts:["Lombardlar va tungi klublar","Alkogol va tamaki mahsulotlari ishlab chiqaruvchilar","Qimor va unga oid bo'lgan tashkilotlar","Sog'lom oziq-ovqat va umumiy ovqatlanish korxonalari"],ans:3},
    {q:"8. Alcana Group'da buyurtmalar qabul qilishdagi moliyaviy cheklov qaysi javobda to'g'ri ko'rsatilgan?",opts:["Kichik byudjetli buyurtmalar qabul qilinmaydi","Porali (otkat) buyurtmalar mutloq bajarilmaydi","Faqat oldindan 100% to'lov qilganlar bilan ishlanadi","Naqd pul ko'rinishidagi buyurtmalar cheklangan"],ans:1},
    {q:"9. Kompaniyada muammolarga qanday yondashiladi va najot nimaligi ta'kidlanadi?",opts:["Muammo – bu tizimning xatosi, najot tajribadadir","Muammo – bu bahona emas, balki imkoniyat; najot ilmdadir","Muammo – bu mijozning aybi, najot tezkor qarorlardadir","Muammo – bu vaqtinchalik holat, najot sabrdadir"],ans:1},
    {q:"10. Alcana Group'da oddiy kunlardagi standart ish vaqti tartibi qanday belgilangan?",opts:["Dushanbadan jumagacha 9:00 dan 17:00 gacha, shanba dam olish","Dushanbadan jumagacha 8:00 dan 18:00 gacha, shanba uchrashuv","Haftada 6 kun, har kuni 9:00 dan 18:00 gacha","Kundalik ish vaqti 9:00 dan 19:00 gacha, faqat shanba kuni alohida tartibda"],ans:3},
    {q:"11. Shanba kungi ish tartibining o'ziga xosligi nimada?",opts:["Ish vaqti soat 10:00 da boshlanadi","Ertalab soat 8:00 da majlis (meeting) bor va ish 18:00 gacha davom etadi","Faqat tushlikkacha ishlanadi, undan keyin sport o'yinlari bo'ladi","Shanba kuni faqat masofadan (online) hisobot topshiriladi"],ans:1},
    {q:"12. Kompaniyada tushlik (lunch) vaqti qaysi soatlar oralig'ida belgilangan?",opts:["12:00 dan 13:00 gacha","13:00 dan 14:00 gacha","12:30 dan 13:30 gacha","Har bir bo'lim uchun alohida grafik asosida"],ans:1},
    {q:"13. Ishga kelishda punktuallik (aniqlik) darajasi qanday o'lchanadi?",opts:["5 daqiqagacha kechikish normal holat hisoblanadi","15 daqiqadan keyin kechikish deb hisoblanadi","Hatto 1 daqiqa kechikish ham qoidabuzarlik hisoblanadi","Faqat 9:30 dan keyin kelganlar qayd etiladi"],ans:2},
    {q:"14. Intizom qoidalarini buzgan xodimlarga nisbatan qanday chora ko'riladi?",opts:["Maoshidan to'g'ridan-to'g'ri ushlab qolinadi","Yo'l qo'yilgan xatoga qarab 10 000 so'mdan 200 000 so'mgacha ehson shaklida jazo qo'llaniladi","O'sha kungi ish haqi to'liq bekor qilinadi","Keyingi haftalik tushlikdan mahrum qilinadi"],ans:1},
    {q:"15. Alcana Group'da 'Bu mening ishim emas' degan yondashuvga munosabat qanday?",opts:["To'g'ri yondashuv, har kim faqat o'z shartnomasidagi ishni qilishi kerak","Bunday tushuncha jamoada yo'q; natija uchun javobgarlik har bir xodimning zimmasida","Faqat rahbar ruxsat bergandagina boshqa ishga aralashish mumkin","Bu yondashuv faqat sinov muddatidagi xodimlarga tegishli"],ans:1},
    {q:"16. Kompaniyaga qanday xodimlar mos keladi?",opts:["Faqat katta tajribaga ega, lekin o'zgarishni xohlamaydiganlar","Buyruqni so'zsiz bajaradigan, shaxsiy fikriga ega bo'lmaganlar","Rivojlanishni istaydigan, mas'uliyatdan qochmaydigan, qat'iyatli va halol insonlar","Faqat reklama sohasida oliy ma'lumoti bor mutaxassislar"],ans:2},
    {q:"17. Kompaniyaga qaysi toifadagi insonlar mutloq mos kelmaydi?",opts:["Sokin muhitda ishlashni afzal ko'radiganlar","Bahona qidiradigan, dangasa, o'z ustida ishlamaydigan va intizomsilar","Jamoaviy sport o'yinlarida qatnashishni xohlamaydiganlar","Kompyuter dasturlarini mukammal bilmaydiganlar"],ans:1},
    {q:"18. 3-6 oy ichida o'sish ko'rmagan xodimga kompaniya qanday kafolat beradi?",opts:["Qo'shimcha 2 oylik bepul trening tavsiya qiladi","Boshqa bo'limga o'tkazadi","Kompensatsiya sifatida 10 000 000 so'm beradi","Sinov muddatini yana uzaytiradi"],ans:2},
    {q:"19. Oy davomida eng yaxshi xodim bo'lib madaniy hordiq yutgan xodimga nima berilishi mumkin?",opts:["Chet elga sayohat yo'llanmasi","Kinoteatrlarga chipta, restoranga oilaviy yoki jamoaviy vaucherlar","Qo'shimcha 3 kunlik haq to'lanadigan ta'tillar","Qimmatbaho maishiy texnika vositalari"],ans:1},
    {q:"20. Dizaynerlik yo'nalishida intizomli xodim uchun 'Deadline' (muddat) qanday ahamiyatga ega?",opts:["Muddat nisbiy tushuncha, asosiysi g'oyaning mukammalligi","Ishlab chiqarish bo'limi va yetkazib berish zanjiri kechikmasligi uchun qat'iy amal qilinishi shart","Faqat mijoz qo'shimcha haq to'lagandagina muddatga qaraladi","Muddatni faqat koll-markaz xodimi nazorat qiladi"],ans:1},
    {q:"21. Dizayner tayyorlagan faylini ishlab chiqarishga topshirishdan oldin nima qilishi shart?",opts:["Faylni to'g'ridan-to'g'ri ishlab chiqarish kompyuteriga tashlab ketishi kerak","Mijozdan faylni qayta tekshirib berishini so'rashi lozim","Faylning barcha texnik parametrlarini shaxsan o'zi diqqat bilan tekshirishi shart","Faylni koll-markaz operatori orqali yuborishi kerak"],ans:2},
    {q:"22. Ishlab chiqarish bo'limi xodimlari bilbord va boshqa konstruksiyalarni yig'ishda tozalikni qachon ta'minlashlari kerak?",opts:["Faqat smena almashayotgan vaqtda","Haftada bir marta, shanba kungi yig'ilishdan keyin","Ish jarayonida va ish yakunlangandan so'ng darhol","Faqat ishlab chiqarish boshlig'i buyruq berganda"],ans:2},
    {q:"23. Ustaxonada ish qurollari va kesilgan materiallar qanday tartibga solinadi?",opts:["Qoldiqlar stol ostiga yig'iladi, asboblar ish joyida qoladi","Asboblar maxsus belgilangan joyiga toza qo'yiladi, qoldiqlar esa saralanib chiqindiga tashlanadi","Hamma narsa keyingi smena xodimi tozalashi uchun qoldiriladi","Material qoldiqlari ustaxona tashqarisiga shunchaki chiqarib tashlanadi"],ans:1},
    {q:"24. Koll-markaz xodimining 'Mijozlarga yondashuv' qoidasi qaysi javobda to'g'ri aks etgan?",opts:["Mijozga faqat buyurtma miqdoriga qarab muomala qilish","Mijozni sherik sifatida ko'rib, doimo xushmuomala va professional bo'lish","Mijozning har qanday taklifiga texnik imkoniyatlarni tekshirmasdan rozi bo'lish","Muammoli mijozlarni darhol ishlab chiqarish xodimlariga yo'naltirish"],ans:1},
    {q:"25. Koll-markaz xodimi o'z smenasi yakunlanganda yangi buyurtmalarni qanday topshirishi lozim?",opts:["Barcha ma'lumotlarni kompyuter xotirasida qoldirib ketishi kifoya","Tizimga kiritilgan buyurtmalar va hal etilmagan masalalarni keyingi smenaga intizom bilan qayd etib topshiradi","Faqat yirik buyurtmalar haqida rahbarni ogohlantirib ketadi","Mijozlarga ertaga qayta qo'ng'iroq qilishni aytadi"],ans:1},
    {q:"26. Alcana Group o'z faoliyatida samaradorlikni oshirish uchun qaysi texnologiyani tatbiq etib boradi?",opts:["Faqat bulutli (Cloud) saqlash tizimlarini","Sun'iy intellekt (AI) texnologiyalarini","Faqat xorijiy xabarchilar (messenger) tizimini","Avtomatlashtirilgan telefon stansiyalarini"],ans:1},
    {q:"27. Kompaniya boshqaruv va ish jarayonlarida jami nechta natijaviy instrumentlardan foydalanadi?",opts:["20 dan ortiq","40 ga yaqin","60 dan ortiq","Maxsus cheklov yo'q"],ans:2},
    {q:"28. Alcana Group yangiliklar va innovatsiyalarni kuzatish uchun qanday chora ko'radi?",opts:["Mahalliy bozor mutaxassislarining hisobotlarini sotib oladi","Chet elda bo'ladigan jahon ko'rgazmalarida qatnashib boradi","Faqat internetdagi ochiq maqolalar bilan cheklanadi","Raqobatchilarning ish uslubini nusxalaydi"],ans:1},
    {q:"29. Kompaniyada xodimlarning nutqini o'stirish va motivatsiyasini oshirish uchun qanday imkoniyat mavjud?",opts:["Faqat mustaqil kitob o'qish vaqti beriladi","Har haftalik motivatsion yig'ilishlarda qatnashish imkoni taqdim etiladi","Maxsus pullik notiqlik kurslariga yo'llanma beriladi","Faqat koll-markaz xodimlari uchun maxsus darslar tashkil etiladi"],ans:1},
    {q:"30. Manifestda aytilganidek, 'yaxshi' degani Alcana Group uchun nima?",opts:["Chiroyli va kreativ ko'ringan har qanday g'oya","Mijozga yoqqan va uzoq muddat muhokama qilingan loyiha","Aniq foyda va natija bergan ish hamda mahsulot sifati","Tez fursatda va kam xarajat bilan bitkazilgan buyurtma"],ans:2},
  ],
  ru:[
    {q:"1. Как компания Alcana Group представляет себя на рынке?",opts:["Рекламное агентство с самыми низкими ценами","Команда, превращающая идеи в результат и создающая реальную ценность для бизнеса","Типография, работающая только по готовым шаблонам","Закрытая организация, работающая только с государственными заказами"],ans:1},
    {q:"2. Какая крупная цель компании на ближайшие годы верно указана?",opts:["Стать компанией с наибольшим числом сотрудников в Узбекистане","Полностью захватить рынок онлайн-рекламы","Построить международный бренд и иметь собственное 7-этажное здание","Передать все производственные процессы на аутсорсинг"],ans:2},
    {q:"3. Какое удобство планирует создать Alcana Group для своей команды?",opts:["Перейти на систему работы 3 дня в неделю","Внедрить систему удалённой работы из дома","Обеспечить трёхразовым питанием за счёт компании","Ежегодно отправлять сотрудников в бесплатные зарубежные поездки"],ans:2},
    {q:"4. Какую позицию планирует занять компания на рынке Центральной Азии и Узбекистана?",opts:["Войти в топ-5 компаний по доходам","Стать одним из 10 сильнейших рекламных агентств","Занять 1-е место только в digital-маркетинге","Контролировать не менее 80% доли рынка"],ans:1},
    {q:"5. С какой страной планирует открыть совместное предприятие Alcana Group?",opts:["Турция — новый стартап-проект","ОАЭ (Дубай) — международный филиал","Китай — совместное предприятие","Россия — объединение рекламных сетей"],ans:2},
    {q:"6. Что из перечисленного является основными ценностями Alcana Group?",opts:["Скорость, устранение конкурентов, конфиденциальность","Честность, справедливость, ответственность, результат и развитие","Креативность, свобода, индивидуальный подход","Опыт, гибкость, выполнение любых требований клиента"],ans:1},
    {q:"7. С каким направлением разрешено сотрудничество по ценностям компании?",opts:["Ломбарды и ночные клубы","Производители алкоголя и табака","Организации, связанные с азартными играми","Компании здорового питания и общественного питания"],ans:3},
    {q:"8. Какое финансовое ограничение при приёме заказов верно указано?",opts:["Заказы с маленьким бюджетом не принимаются","Заказы с откатом категорически не выполняются","Работают только с теми, кто оплатил 100% авансом","Заказы наличными ограничены"],ans:1},
    {q:"9. Как в компании относятся к проблемам и что считается спасением?",opts:["Проблема — ошибка системы, спасение — в опыте","Проблема — не оправдание, а возможность; спасение — в знаниях","Проблема — вина клиента, спасение — в быстрых решениях","Проблема — временное явление, спасение — в терпении"],ans:1},
    {q:"10. Каков стандартный рабочий график в Alcana Group в обычные дни?",opts:["Пн–Пт 9:00–17:00, суббота выходной","Пн–Пт 8:00–18:00, суббота — встречи","6 дней в неделю, каждый день 9:00–18:00","Ежедневно 9:00–19:00, суббота — особый режим"],ans:3},
    {q:"11. В чём особенность рабочего режима в субботу?",opts:["Рабочий день начинается в 10:00","Утром в 8:00 совещание, работа до 18:00","Работают только до обеда, затем спортивные игры","В субботу сдают только онлайн-отчёты"],ans:1},
    {q:"12. В какие часы установлен обеденный перерыв в компании?",opts:["12:00–13:00","13:00–14:00","12:30–13:30","По отдельному графику для каждого отдела"],ans:1},
    {q:"13. Как измеряется пунктуальность при приходе на работу?",opts:["Опоздание до 5 минут считается нормой","Опоздание считается с 15 минут","Даже 1 минута опоздания считается нарушением","Фиксируются только пришедшие после 9:30"],ans:2},
    {q:"14. Какое взыскание применяется к нарушителям дисциплины?",opts:["Вычитается напрямую из зарплаты","Штраф в форме садаки от 10 000 до 200 000 сум","Полностью аннулируется зарплата за день","Лишают обеда на следующей неделе"],ans:1},
    {q:"15. Каково отношение в Alcana Group к подходу «Это не моя работа»?",opts:["Правильный подход — каждый делает только то, что в договоре","Такого понятия нет; ответственность за результат на каждом сотруднике","Вмешиваться в другую работу можно только с разрешения руководителя","Это только для сотрудников на испытательном сроке"],ans:1},
    {q:"16. Какие сотрудники подходят компании?",opts:["Только опытные, но не желающие меняться","Беспрекословно выполняющие приказы, без личного мнения","Стремящиеся к развитию, ответственные, решительные и честные","Только специалисты с высшим образованием в сфере рекламы"],ans:2},
    {q:"17. Кто категорически не подходит компании?",opts:["Предпочитающие работать в спокойной обстановке","Ищущие отговорки, ленивые, недисциплинированные и не работающие над собой","Не желающие участвовать в командных спортивных играх","Не знающие компьютерных программ в совершенстве"],ans:1},
    {q:"18. Какую гарантию даёт компания сотруднику, не показавшему рост за 3-6 месяцев?",opts:["Рекомендует дополнительный 2-месячный бесплатный тренинг","Переводит в другой отдел","Выплачивает компенсацию в размере 10 000 000 сум","Продлевает испытательный срок"],ans:2},
    {q:"19. Что может получить лучший сотрудник месяца, выигравший культурный отдых?",opts:["Путёвку за рубеж","Билеты в кино, семейный или командный ваучер в ресторан","Дополнительный 3-дневный оплачиваемый отпуск","Дорогостоящую бытовую технику"],ans:1},
    {q:"20. Каково значение «Deadline» для дисциплинированного дизайнера?",opts:["Срок — понятие относительное, главное — совершенство идеи","Правило, которому нужно строго следовать, чтобы производство не опаздывало","На срок обращают внимание только если клиент доплатил","Срок контролирует только оператор колл-центра"],ans:1},
    {q:"21. Что дизайнер обязан сделать перед передачей файла в производство?",opts:["Просто скинуть файл на компьютер производства","Попросить клиента повторно проверить файл","Лично внимательно проверить все технические параметры файла","Отправить файл через оператора колл-центра"],ans:2},
    {q:"22. Когда производственные сотрудники должны обеспечивать чистоту при монтаже билбордов?",opts:["Только при смене смены","Раз в неделю, после субботнего собрания","В процессе работы и сразу после её завершения","Только по команде начальника производства"],ans:2},
    {q:"23. Как упорядочиваются инструменты и обрезки материалов в мастерской?",opts:["Обрезки складываются под стол, инструменты остаются на рабочем месте","Инструменты убираются на своё место, обрезки сортируются и выбрасываются","Всё оставляется для уборки следующей сменой","Остатки материалов просто выносятся за пределы мастерской"],ans:1},
    {q:"24. Какое правило колл-центра «Подход к клиентам» верно указано?",opts:["Общаться с клиентом в зависимости от суммы заказа","Видеть в клиенте партнёра, всегда быть вежливым и профессиональным","Соглашаться с любым предложением клиента без проверки","Сразу направлять проблемных клиентов в производство"],ans:1},
    {q:"25. Как оператор колл-центра должен передавать заказы в конце смены?",opts:["Достаточно оставить все данные в памяти компьютера","Дисциплинированно записывает заказы и нерешённые вопросы и передаёт следующей смене","Предупреждает только о крупных заказах","Просит клиентов перезвонить завтра"],ans:1},
    {q:"26. Какую технологию внедряет Alcana Group для повышения эффективности?",opts:["Только облачные системы хранения данных","Технологии искусственного интеллекта (ИИ)","Только иностранные мессенджеры","Автоматизированные телефонные станции"],ans:1},
    {q:"27. Сколько результативных инструментов использует компания?",opts:["Более 20","Около 40","Более 60","Без специальных ограничений"],ans:2},
    {q:"28. Как Alcana Group следит за мировыми инновациями?",opts:["Покупает отчёты местных экспертов рынка","Участвует в международных выставках за рубежом","Ограничивается открытыми статьями в интернете","Копирует стиль работы конкурентов"],ans:1},
    {q:"29. Какая возможность существует для развития речи и повышения мотивации сотрудников?",opts:["Даётся только время для самостоятельного чтения","Участие в еженедельных мотивационных собраниях","Направляют на платные курсы ораторского мастерства","Специальные уроки только для колл-центра"],ans:1},
    {q:"30. Что означает «хорошо» для Alcana Group по манифесту?",opts:["Любая красивая и креативная идея","Проект, понравившийся клиенту и долго обсуждавшийся","Работа, давшая конкретную пользу и качество продукта","Заказ, выполненный быстро и с минимальными затратами"],ans:2},
  ],
  en:[
    {q:"1. How does Alcana Group present itself in the market?",opts:["An ad agency offering the cheapest services","A team that turns ideas into results and creates real value for businesses","A printing company working only with ready-made templates","A closed organization working only with government orders"],ans:1},
    {q:"2. Which major company goal for the coming years is correctly stated?",opts:["To have the most employees in Uzbekistan","To fully capture the online advertising market","To build an internationally competitive brand and own a 7-story building","To outsource all production processes"],ans:2},
    {q:"3. What convenience does Alcana Group plan to create for its team?",opts:["Switch to a 3-day workweek","Implement a remote work-from-home system","Provide 3 meals a day at company expense","Send employees on free trips abroad every year"],ans:2},
    {q:"4. What market position does the company aim to achieve in Central Asia?",opts:["Enter the top 5 by revenue","Become one of the 10 strongest advertising agencies","Take 1st place only in digital marketing","Control at least 80% market share"],ans:1},
    {q:"5. With which country does Alcana Group plan to open a joint venture?",opts:["Turkey — a new startup project","UAE (Dubai) — international branch","China — joint venture","Russia — merging advertising networks"],ans:2},
    {q:"6. Which of the following are Alcana Group's core values?",opts:["Speed, eliminating competitors, confidentiality","Honesty, justice, responsibility, results and development","Creativity, freedom, individual approach","Experience, flexibility, fulfilling any client request"],ans:1},
    {q:"7. With which type of business is cooperation permitted under company values?",opts:["Pawnshops and nightclubs","Alcohol and tobacco manufacturers","Gambling-related organizations","Healthy food and catering companies"],ans:3},
    {q:"8. Which financial restriction on accepting orders is correctly stated?",opts:["Small-budget orders are not accepted","Orders involving kickbacks are absolutely not fulfilled","Only those who paid 100% upfront are served","Cash orders are limited"],ans:1},
    {q:"9. How does the company approach problems and what is the solution?",opts:["Problem is a system error; solution is experience","Problem is not an excuse but an opportunity; solution is knowledge","Problem is the client's fault; solution is quick decisions","Problem is temporary; solution is patience"],ans:1},
    {q:"10. What is the standard working hours in Alcana Group on regular days?",opts:["Mon–Fri 9:00–17:00, Saturday off","Mon–Fri 8:00–18:00, Saturday meetings","6 days a week, every day 9:00–18:00","Daily 9:00–19:00, Saturday on a special schedule"],ans:3},
    {q:"11. What is special about the Saturday work schedule?",opts:["Work starts at 10:00","Morning meeting at 8:00, work continues until 18:00","Work only until lunch, then sports games","Only online reports submitted on Saturday"],ans:1},
    {q:"12. What hours are set for the lunch break?",opts:["12:00–13:00","13:00–14:00","12:30–13:30","Separate schedule for each department"],ans:1},
    {q:"13. How is punctuality measured when arriving at work?",opts:["Up to 5 minutes late is normal","Being late counts from 15 minutes","Even 1 minute late is considered a violation","Only those arriving after 9:30 are recorded"],ans:2},
    {q:"14. What measure is taken against employees who violate discipline?",opts:["Deducted directly from salary","A fine in the form of charity from 10,000 to 200,000 UZS","That day's full salary is cancelled","Deprived of next week's lunch"],ans:1},
    {q:"15. What is the attitude toward 'This is not my job' in Alcana Group?",opts:["Correct — everyone should only do what's in their contract","Such a concept doesn't exist; responsibility for results is on every employee","Only allowed with the manager's permission","Only applies to probationary employees"],ans:1},
    {q:"16. What kind of employees suit the company?",opts:["Only experienced ones who don't want to change","Those who follow orders without personal opinion","Those who want to grow, are responsible, determined and honest","Only specialists with advertising degrees"],ans:2},
    {q:"17. What type of people absolutely don't suit the company?",opts:["Those who prefer a calm work environment","Those who make excuses, are lazy, undisciplined, and don't self-develop","Those who don't want to join team sports","Those who don't know computer programs perfectly"],ans:1},
    {q:"18. What guarantee does the company give to an employee showing no growth in 3-6 months?",opts:["Recommends additional 2-month free training","Transfers to another department","Pays compensation of 10,000,000 UZS","Extends the probation period"],ans:2},
    {q:"19. What can the best employee of the month who won a cultural leisure prize receive?",opts:["A trip abroad","Cinema tickets, family or team restaurant vouchers","An additional 3-day paid vacation","Expensive household appliances"],ans:1},
    {q:"20. What is the importance of 'Deadline' for a disciplined designer?",opts:["Deadline is relative; the main thing is perfection of the idea","A strict rule so production and delivery don't get delayed","Only considered if the client paid extra","Only the call center operator controls the deadline"],ans:1},
    {q:"21. What must a designer do before submitting a file to production?",opts:["Just drop the file on the production computer","Ask the client to re-check the file","Personally and carefully check all technical parameters of the file","Send the file through the call center operator"],ans:2},
    {q:"22. When must production employees ensure cleanliness when assembling billboards?",opts:["Only when shifts change","Once a week, after Saturday's meeting","During and immediately after completing work","Only when the production manager orders it"],ans:2},
    {q:"23. How are tools and cut materials organized in the workshop?",opts:["Scraps piled under the table, tools remain at the workstation","Tools placed neatly in their designated spot, scraps sorted and thrown away","Everything left for the next shift to clean","Material scraps just taken outside the workshop"],ans:1},
    {q:"24. Which call center rule on client approach is correctly stated?",opts:["Treat clients based on their order amount","See the client as a partner, always be polite and professional","Agree to any client suggestion without checking feasibility","Immediately direct problematic clients to production"],ans:1},
    {q:"25. How should a call center employee hand over orders at end of shift?",opts:["Leaving data in computer memory is sufficient","Disciplinedly records orders and unresolved issues and hands over to next shift","Only notifies management about large orders","Tells clients to call back tomorrow"],ans:1},
    {q:"26. What technology does Alcana Group implement to increase efficiency?",opts:["Only cloud storage systems","Artificial Intelligence (AI) technologies","Only foreign messenger systems","Automated telephone exchanges"],ans:1},
    {q:"27. How many effective instruments does the company use in management?",opts:["More than 20","About 40","More than 60","No specific limit"],ans:2},
    {q:"28. How does Alcana Group track world innovations?",opts:["Buys reports from local market experts","Participates in international exhibitions abroad","Limits itself to open internet articles","Copies competitors' work style"],ans:1},
    {q:"29. What opportunity exists to improve employees' speech and motivation?",opts:["Only given time for independent reading","Opportunity to participate in weekly motivational meetings","Sent to paid public speaking courses","Special classes only for call center employees"],ans:1},
    {q:"30. What does 'good' mean for Alcana Group per the manifest?",opts:["Any beautiful and creative idea","A project liked by the client and discussed for a long time","Work and product quality that delivered concrete benefit","An order completed quickly with minimal cost"],ans:2},
  ]
};

// ─── HARDCODED SECTION QUESTIONS ──────────────────────────
// Multilingual question record: q + 4 opts × 3 source languages; uz-cyrl auto-derives.
type MlStr = {uz:string;ru:string;en:string};
type MlQ = {q:MlStr;opts:MlStr[];ans:number};

// 50 questions for the "Alcana Jamoasi" card (34 Ichki Tartib + 16 Trello).
const QS_ALCANA: MlQ[] = [
  // Ichki Tartib Qoidalari (34 ta savol)
  {q:{uz:`Xodim qoidabuzarlik qilganini o'zi tan olib, nazoratchidan oldin jarimalar daftariga yozsa, nima bo'ladi?`,ru:`Если сотрудник сам признает нарушение и запишет его в журнал штрафов раньше контролёра, что произойдёт?`,en:`If an employee admits a violation themselves and records it in the fines log before the supervisor does, what happens?`},opts:[{uz:`Jarima bekor qilinadi`,ru:`Штраф отменяется`,en:`The fine is cancelled`},{uz:`Ogohlantirish beriladi`,ru:`Выносится предупреждение`,en:`A warning is issued`},{uz:`Jarimaning 50% ini to'laydi`,ru:`Платит 50% штрафа`,en:`Pays 50% of the fine`},{uz:`To'liq jarima to'laydi`,ru:`Платит полный штраф`,en:`Pays the full fine`}],ans:2},
  {q:{uz:`Xodim yillik anketada ishdan ketish muddatini aniq ko'rsatmasa, qanday tartib qo'llaniladi?`,ru:`Если сотрудник не указывает точный срок увольнения в годовой анкете, какой порядок применяется?`,en:`If an employee doesn't clearly specify their exit date in the annual form, what procedure applies?`},opts:[{uz:`Faqat 1 oy ishlab beradi`,ru:`Отрабатывает только 1 месяц`,en:`Works only 1 month`},{uz:`Darhol ishdan bo'shatiladi`,ru:`Немедленно увольняется`,en:`Is dismissed immediately`},{uz:`Keyingi yil anketasi va 2 oylik qoida bo'yicha ishlaydi`,ru:`Работает по следующей годовой анкете и правилу 2 месяцев`,en:`Works under next year's form and the 2-month rule`},{uz:`Hech qanday talab qo'yilmaydi`,ru:`Никаких требований не предъявляется`,en:`No requirements are made`}],ans:2},
  {q:{uz:`Xodim ishga kech qolishini oldindan bilsa, nima qilishi shart?`,ru:`Если сотрудник заранее знает, что опоздает, что он должен сделать?`,en:`If an employee knows in advance they will be late, what must they do?`},opts:[{uz:`Ishga kelgach tushuntirish berishi kerak`,ru:`Должен объяснить после прихода на работу`,en:`Must explain after arriving at work`},{uz:`Soat 08:30 gacha Telegram guruhida tasdiqlatishi kerak`,ru:`Должен подтвердить в Telegram-группе до 08:30`,en:`Must confirm in the Telegram group by 08:30`},{uz:`Hamkasbiga aytib qo'yishi kifoya`,ru:`Достаточно сообщить коллеге`,en:`Telling a coworker is enough`},{uz:`Hech kimni ogohlantirmasa ham bo'ladi`,ru:`Можно никого не предупреждать`,en:`Need not warn anyone`}],ans:1},
  {q:{uz:`Ish vaqtidan tashqari o'rnatish (ustanovka) uchun korxona asboblari yoki mahsulotlarini ruxsatsiz bergan xodimga nima qo'llaniladi?`,ru:`Какая мера применяется к сотруднику, который без разрешения выдал инструменты или продукцию компании для установки во внерабочее время?`,en:`What measure applies to an employee who, without permission, gave out company tools or products for an installation outside working hours?`},opts:[{uz:`Ogohlantirish beriladi`,ru:`Выносится предупреждение`,en:`A warning is issued`},{uz:`Hech qanday chora ko'rilmaydi`,ru:`Никаких мер не принимается`,en:`No action is taken`},{uz:`Ogohlantirishsiz jarima qo'llaniladi`,ru:`Применяется штраф без предупреждения`,en:`A fine is applied without warning`},{uz:`Faqat tushuntirish xati yozadi`,ru:`Только пишет объяснительную`,en:`Just writes an explanatory note`}],ans:2},
  {q:{uz:`Ish vaqtida qanday kiyimda yurish shart?`,ru:`В какой одежде нужно находиться в рабочее время?`,en:`What clothing must be worn during working hours?`},opts:[{uz:`Oddiy kiyim`,ru:`Обычная одежда`,en:`Casual clothes`},{uz:`Logotipli va ozoda kiyim`,ru:`Опрятная одежда с логотипом`,en:`Clean clothing with the company logo`},{uz:`Sport kiyimi`,ru:`Спортивная одежда`,en:`Sportswear`},{uz:`Istalgan kiyim`,ru:`Любая одежда`,en:`Any clothes`}],ans:1},
  {q:{uz:`Oylikning 50% qachon beriladi?`,ru:`Когда выплачивается 50% зарплаты?`,en:`When is 50% of the salary paid?`},opts:[{uz:`Har oyning 15-sanasi`,ru:`15-го числа каждого месяца`,en:`On the 15th of each month`},{uz:`1-sanada`,ru:`1-го числа`,en:`On the 1st`},{uz:`25-sanada`,ru:`25-го числа`,en:`On the 25th`},{uz:`Oy oxirida`,ru:`В конце месяца`,en:`At month end`}],ans:0},
  {q:{uz:`Eng yaxshi amaliy taklif bergan xodim nima oladi?`,ru:`Что получает сотрудник, предложивший лучшее практическое предложение?`,en:`What does the employee who makes the best practical suggestion receive?`},opts:[{uz:`Ta'til`,ru:`Отпуск`,en:`Vacation`},{uz:`Jarima`,ru:`Штраф`,en:`Fine`},{uz:`Bonus`,ru:`Бонус`,en:`Bonus`},{uz:`Ogohlantirish`,ru:`Предупреждение`,en:`Warning`}],ans:2},
  {q:{uz:`Buyurtma 1C ga necha soatda kiritilishi kerak?`,ru:`Через сколько часов заказ должен быть внесён в 1C?`,en:`Within how many hours must an order be entered into 1C?`},opts:[{uz:`24 soat`,ru:`24 часа`,en:`24 hours`},{uz:`12 soat`,ru:`12 часов`,en:`12 hours`},{uz:`2 soat`,ru:`2 часа`,en:`2 hours`},{uz:`6 soat`,ru:`6 часов`,en:`6 hours`}],ans:2},
  {q:{uz:`O'lchovdagi xatolik sabab ish qayta bajarilsa, zarar kimdan ushlab qolinadi?`,ru:`Если работу приходится переделывать из-за ошибки в измерениях, с кого удерживается ущерб?`,en:`If a job has to be redone due to a measurement error, from whom is the damage deducted?`},opts:[{uz:`Barcha xodimlardan teng ushlab qolinadi`,ru:`Удерживается со всех сотрудников поровну`,en:`Deducted equally from all employees`},{uz:`Faqat mijoz to'laydi`,ru:`Платит только клиент`,en:`Only the client pays`},{uz:`Shu ish uchun mas'ul xodimning bonus yoki KPIidan ushlab qolinadi`,ru:`Удерживается с бонуса или KPI ответственного за работу сотрудника`,en:`Deducted from the bonus or KPI of the employee responsible`},{uz:`Hech kim javobgar bo'lmaydi`,ru:`Никто не несёт ответственности`,en:`No one is responsible`}],ans:2},
  {q:{uz:`Xodim mijoz bilan aloqa qilishda qaysi raqamdan foydalanishi kerak?`,ru:`С какого номера сотрудник должен связываться с клиентом?`,en:`Which number must an employee use to contact a client?`},opts:[{uz:`Shaxsiy telefon raqamidan`,ru:`С личного номера телефона`,en:`Personal phone number`},{uz:`Istalgan telefon raqamidan`,ru:`С любого номера`,en:`Any phone number`},{uz:`Faqat korxonaning telefon raqami va Telegramidan`,ru:`Только с корпоративного телефона и Telegram компании`,en:`Only the company's phone number and Telegram`},{uz:`Hamkasbining telefonidan`,ru:`С телефона коллеги`,en:`A coworker's phone`}],ans:2},
  {q:{uz:`Stanokdan foydalanishdan oldin nima qilinadi?`,ru:`Что нужно сделать перед использованием станка?`,en:`What must be done before using a machine?`},opts:[{uz:`Stanokni ish davomida tekshirishi kerak`,ru:`Нужно проверять станок во время работы`,en:`Check the machine during work`},{uz:`Nosozlik bo'lsa keyin rahbarga aytishi kerak`,ru:`Если будет неисправность, потом сообщить руководителю`,en:`If there's a fault, tell the manager afterwards`},{uz:`Ish boshlashdan oldin stanokning sozligini tekshirishi kerak`,ru:`Перед началом работы проверить исправность станка`,en:`Check that the machine works before starting`},{uz:`Faqat eski stanoklarni tekshirishi kerak`,ru:`Проверять только старые станки`,en:`Only check old machines`}],ans:2},
  {q:{uz:`Treningdan qaytgan xodim 3 kun ichida nima qilishi shart?`,ru:`Что должен сделать сотрудник в течение 3 дней после возвращения с тренинга?`,en:`What must an employee do within 3 days of returning from training?`},opts:[{uz:`Faqat rahbarga hisobot topshirishi kerak`,ru:`Только сдать отчёт руководителю`,en:`Just submit a report to the manager`},{uz:`O'z bilimlarini boshqa xodimlarga o'rgatishi kerak`,ru:`Должен передать свои знания другим сотрудникам`,en:`Must teach their knowledge to other employees`},{uz:`Trening materiallarini yashirib qo'yishi kerak`,ru:`Спрятать материалы тренинга`,en:`Hide the training materials`},{uz:`Yana bir treningga yozilishi kerak`,ru:`Записаться на ещё один тренинг`,en:`Sign up for another training`}],ans:1},
  {q:{uz:`Mijoz fleshkasi ulanishidan oldin nima tekshiriladi?`,ru:`Что проверяется перед подключением флешки клиента?`,en:`What is checked before connecting a client's USB drive?`},opts:[{uz:`Hajmi`,ru:`Размер`,en:`Size`},{uz:`Rangi`,ru:`Цвет`,en:`Color`},{uz:`Virusi`,ru:`На вирусы`,en:`For viruses`},{uz:`Narxi`,ru:`Цена`,en:`Price`}],ans:2},
  {q:{uz:`Vazifa muddatiga ulgurmasa rahbar qachon ogohlantiriladi?`,ru:`Когда нужно предупредить руководителя, если задача не успевает к сроку?`,en:`When must the manager be warned if a task won't be done on time?`},opts:[{uz:`12 soat oldin`,ru:`За 12 часов`,en:`12 hours before`},{uz:`1 soat oldin`,ru:`За 1 час`,en:`1 hour before`},{uz:`Keyin`,ru:`Потом`,en:`Later`},{uz:`Ogohlantirilmaydi`,ru:`Не предупреждают`,en:`Not warned`}],ans:0},
  {q:{uz:`Reklama budjeti rejasi kimga tasdiqlatiladi?`,ru:`Кому утверждается план рекламного бюджета?`,en:`Who approves the advertising budget plan?`},opts:[{uz:`Omborchiga`,ru:`Кладовщику`,en:`Storekeeper`},{uz:`Direktorga`,ru:`Директору`,en:`Director`},{uz:`Mijozga`,ru:`Клиенту`,en:`Client`},{uz:`Haydovchiga`,ru:`Водителю`,en:`Driver`}],ans:1},
  {q:{uz:`Xodim majlisga uzrli sabab bilan kech qolsa, nima qilishi kerak?`,ru:`Если сотрудник опаздывает на собрание по уважительной причине, что он должен сделать?`,en:`If an employee is late to a meeting for a valid reason, what must they do?`},opts:[{uz:`Majlis tugagach tushuntirish berishi kerak`,ru:`Объяснить после окончания собрания`,en:`Explain after the meeting ends`},{uz:`Nazoratchini 1 soat oldin ogohlantirishi kerak`,ru:`Предупредить контролёра за 1 час`,en:`Warn the supervisor 1 hour in advance`},{uz:`Hamkasbiga aytib qo'yishi kifoya`,ru:`Достаточно сказать коллеге`,en:`Telling a coworker is enough`},{uz:`Hech kimni ogohlantirmasa ham bo'ladi`,ru:`Можно никого не предупреждать`,en:`Need not warn anyone`}],ans:1},
  {q:{uz:`Xom ashyo kimning ruxsati bilan olinadi?`,ru:`С чьего разрешения берётся сырьё?`,en:`With whose permission is raw material taken?`},opts:[{uz:`Istalgan odamdan`,ru:`У любого человека`,en:`From anyone`},{uz:`Mas'ul xodimdan`,ru:`У ответственного сотрудника`,en:`The responsible employee`},{uz:`Mijozdan`,ru:`У клиента`,en:`Client`},{uz:`Ruxsatsiz olish mumkin`,ru:`Можно брать без разрешения`,en:`Can take without permission`}],ans:1},
  {q:{uz:`Korxona mashinasi kaliti qayerda qoldirilmaydi?`,ru:`Где нельзя оставлять ключ от служебной машины?`,en:`Where should the company car key NOT be left?`},opts:[{uz:`Seyfda`,ru:`В сейфе`,en:`In the safe`},{uz:`Rahbarda`,ru:`У руководителя`,en:`With the manager`},{uz:`Ichida`,ru:`В машине`,en:`Inside the car`},{uz:`Omborda`,ru:`На складе`,en:`In the warehouse`}],ans:2},
  {q:{uz:`Ishdan ketayotgan xodim zarar yetkazgan bo'lsa nima qiladi?`,ru:`Что делает увольняющийся сотрудник, если нанёс ущерб?`,en:`If a leaving employee caused damage, what do they do?`},opts:[{uz:`Yarmini to'laydi`,ru:`Платит половину`,en:`Pays half`},{uz:`To'lamaydi`,ru:`Не платит`,en:`Doesn't pay`},{uz:`To'liq qoplaydi`,ru:`Полностью возмещает`,en:`Fully compensates`},{uz:`Kechiriladi`,ru:`Прощается`,en:`Is forgiven`}],ans:2},
  {q:{uz:`Qoidalar daftarlari nazoratini kim yuritadi?`,ru:`Кто ведёт контроль за журналами правил?`,en:`Who oversees the rules logbooks?`},opts:[{uz:`Nazoratchi`,ru:`Контролёр`,en:`Supervisor`},{uz:`Sotuvchi`,ru:`Продавец`,en:`Salesperson`},{uz:`Mijoz`,ru:`Клиент`,en:`Client`},{uz:`Dizayner`,ru:`Дизайнер`,en:`Designer`}],ans:0},
  {q:{uz:`Ichki sirlar qachongacha saqlanadi?`,ru:`Как долго хранятся внутренние секреты?`,en:`Until when are internal secrets kept?`},opts:[{uz:`Faqat ish payti`,ru:`Только во время работы`,en:`Only during work`},{uz:`Ishdan bo'shagandan keyin ham`,ru:`И после увольнения`,en:`Even after leaving the job`},{uz:`Bir oy`,ru:`Один месяц`,en:`One month`},{uz:`Bir hafta`,ru:`Одна неделя`,en:`One week`}],ans:1},
  {q:{uz:`Korxonada "vaqtga xiyonat qilish" deb qaysi holatga aytiladi?`,ru:`Какая ситуация в компании называется «предательством времени»?`,en:`Which situation is called "time betrayal" in the company?`},opts:[{uz:`Ishni reja asosida bajarish`,ru:`Выполнение работы по плану`,en:`Doing work by plan`},{uz:`Hamkasblarga yordam berish`,ru:`Помощь коллегам`,en:`Helping coworkers`},{uz:`Ish vaqtida yashirincha shaxsiy buyurtmalar bilan shug'ullanish`,ru:`Тайное занятие личными заказами в рабочее время`,en:`Secretly doing personal orders during work hours`},{uz:`Vazifalarni muddatidan oldin tugatish`,ru:`Завершение задач раньше срока`,en:`Finishing tasks ahead of schedule`}],ans:2},
  {q:{uz:`Har bir mijoz qanday chiqib ketishi kerak?`,ru:`Как должен уйти каждый клиент?`,en:`How must every client leave?`},opts:[{uz:`Shoshilib`,ru:`Спеша`,en:`In a hurry`},{uz:`Norozi`,ru:`Недовольным`,en:`Dissatisfied`},{uz:`Rozi`,ru:`Довольным`,en:`Satisfied`},{uz:`Jim`,ru:`Молча`,en:`Silent`}],ans:2},
  {q:{uz:`Rahbar xonasiga qanday kiriladi?`,ru:`Как заходить в кабинет руководителя?`,en:`How is the manager's office entered?`},opts:[{uz:`Ruxsatsiz`,ru:`Без разрешения`,en:`Without permission`},{uz:`Ruxsat bilan`,ru:`С разрешением`,en:`With permission`},{uz:`Istalgan payt`,ru:`В любое время`,en:`Any time`},{uz:`Guruh bo'lib`,ru:`Группой`,en:`In a group`}],ans:1},
  {q:{uz:`Sex hududida xodim qachon telefondan foydalanishi mumkin?`,ru:`Когда сотрудник может пользоваться телефоном в цеху?`,en:`When may an employee use a phone in the workshop?`},opts:[{uz:`Istalgan vaqtda`,ru:`В любое время`,en:`Any time`},{uz:`Tanaffusdan tashqari paytlarda ham erkin foydalanishi mumkin`,ru:`Может свободно пользоваться и вне перерыва`,en:`Can freely use even outside breaks`},{uz:`Faqat ishga bog'liq zarur holatda va mas'ul shaxs ruxsati bilan`,ru:`Только при необходимости по работе и с разрешения ответственного`,en:`Only when work requires it and with the responsible person's permission`},{uz:`Faqat shaxsiy qo'ng'iroqlar uchun`,ru:`Только для личных звонков`,en:`Only for personal calls`}],ans:2},
  {q:{uz:`Kunlik chiqim amalga oshirilgandan keyin ma'lumot qachongacha guruhga kiritilishi kerak?`,ru:`В какой срок информация о ежедневном расходе должна быть внесена в группу?`,en:`By when must information about daily expenses be entered into the group?`},opts:[{uz:`Ish kuni oxirigacha`,ru:`До конца рабочего дня`,en:`By end of workday`},{uz:`24 soat ichida`,ru:`В течение 24 часов`,en:`Within 24 hours`},{uz:`2 soat ichida`,ru:`В течение 2 часов`,en:`Within 2 hours`},{uz:`Hafta oxirigacha`,ru:`До конца недели`,en:`By end of week`}],ans:2},
  {q:{uz:`23:00 dan keyin sexda nima taqiqlanadi?`,ru:`Что запрещено в цеху после 23:00?`,en:`What is forbidden in the workshop after 23:00?`},opts:[{uz:`Kunlik reja tuzish`,ru:`Составление плана на день`,en:`Making a daily plan`},{uz:`Telefon va ijtimoiy tarmoqlar`,ru:`Телефон и социальные сети`,en:`Phone and social media`},{uz:`Dam olish`,ru:`Отдых`,en:`Resting`},{uz:`Ovqat yeyish`,ru:`Приём пищи`,en:`Eating`}],ans:1},
  {q:{uz:`Mijozdan bo'lim faoliyati bo'yicha asosli shikoyat tushsa, qanday chora qo'llaniladi?`,ru:`Какая мера применяется, если от клиента поступает обоснованная жалоба на работу отдела?`,en:`What measure is applied if a justified complaint about a department comes from a client?`},opts:[{uz:`Faqat rahbar javobgar bo'ladi`,ru:`Отвечает только руководитель`,en:`Only the manager is responsible`},{uz:`Hech qanday chora ko'rilmaydi`,ru:`Никаких мер не принимается`,en:`No action is taken`},{uz:`Bo'limning barcha xodimlariga jamoaviy moliyaviy jarima qo'llaniladi`,ru:`Применяется коллективный финансовый штраф ко всем сотрудникам отдела`,en:`A collective financial fine is applied to all department employees`},{uz:`Faqat bir xodimga ogohlantirish beriladi`,ru:`Только одному сотруднику выносится предупреждение`,en:`Only one employee gets a warning`}],ans:2},
  {q:{uz:`Xodim foydalangan ish qurolini boshqa joyda qoldirib ketsa, bu qanday holat hisoblanadi?`,ru:`Если сотрудник оставляет рабочий инструмент в другом месте, как это расценивается?`,en:`If an employee leaves a work tool in another place, how is this considered?`},opts:[{uz:`Ish jarayonining odatiy qismi`,ru:`Обычная часть рабочего процесса`,en:`A normal part of the workflow`},{uz:`Faqat og'zaki ogohlantirishga sabab bo'ladi`,ru:`Приводит только к устному предупреждению`,en:`Leads only to a verbal warning`},{uz:`Intizom buzilishi hisoblanib, jarima va choralar qo'llaniladi`,ru:`Считается нарушением дисциплины, применяются штраф и меры`,en:`Considered a discipline violation, fine and measures applied`},{uz:`Faqat rahbar ruxsati bilan mumkin`,ru:`Возможно только с разрешения руководителя`,en:`Allowed only with manager's permission`}],ans:2},
  {q:{uz:`Telegram'da xodimlar uchun qanday talab majburiy hisoblanadi?`,ru:`Какое требование обязательно для сотрудников в Telegram?`,en:`Which Telegram requirement is mandatory for employees?`},opts:[{uz:`Guruhlardan chiqib ketish`,ru:`Выход из групп`,en:`Leaving groups`},{uz:`Faqat rahbarni kuzatish`,ru:`Только следить за руководителем`,en:`Only monitor the manager`},{uz:`Oxirgi kirgan vaqt holatini ochiq qilish`,ru:`Открытый статус «последний раз был в сети»`,en:`Keep "last seen" status visible`},{uz:`Faqat ish vaqtida yozish`,ru:`Писать только в рабочее время`,en:`Write only during work hours`}],ans:2},
  {q:{uz:`Dizayner mijoz bilan aloqa bo'yicha qanday majburiyatga ega?`,ru:`Какие обязанности по коммуникации с клиентом у дизайнера?`,en:`What obligations does the designer have regarding client communication?`},opts:[{uz:`Mijozni faqat sotuv bo'limiga yo'naltirishi`,ru:`Должен только направлять клиента в отдел продаж`,en:`Just direct the client to sales`},{uz:`Mijoz savollariga javob bermasligi mumkin`,ru:`Может не отвечать на вопросы клиента`,en:`May not answer client questions`},{uz:`O'z loyihasi bo'yicha mijoz bilan bevosita muloqot qilishi shart`,ru:`Обязан напрямую общаться с клиентом по своему проекту`,en:`Must communicate directly with the client on their project`},{uz:`Faqat yozma xabar orqali javob berishi kerak`,ru:`Должен отвечать только письменно`,en:`Must reply only in writing`}],ans:2},
  {q:{uz:`Montajchining mahsulotdagi kamchilik sabab qayta o'rnatish talab qilinsa, xarajatlar kim zimmasiga yuklanadi?`,ru:`Если из-за дефекта в изделии требуется повторный монтаж, на кого ложатся расходы?`,en:`If a defect in the product requires reinstallation, who bears the cost?`},opts:[{uz:`Korxona hisobidan qoplanadi`,ru:`Покрывается за счёт компании`,en:`Covered by the company`},{uz:`Mijoz to'laydi`,ru:`Платит клиент`,en:`The client pays`},{uz:`Montajchi xodimlar zimmasiga yuklanadi`,ru:`Возлагается на монтажников`,en:`Borne by the installers`},{uz:`Sifat bo'limi to'laydi`,ru:`Платит отдел качества`,en:`The quality department pays`}],ans:2},
  {q:{uz:`"Kuch birlikda" shiori bo'yicha xodim nima qilishi kerak?`,ru:`Что должен делать сотрудник согласно девизу «Сила в единстве»?`,en:`What must an employee do according to the motto "Strength in unity"?`},opts:[{uz:`Chetda turishi`,ru:`Стоять в стороне`,en:`Stay aside`},{uz:`Jamoaviy ishlarda faol qatnashishi`,ru:`Активно участвовать в командной работе`,en:`Actively participate in team work`},{uz:`Faqat kuzatishi`,ru:`Только наблюдать`,en:`Just observe`},{uz:`Rad etishi`,ru:`Отказываться`,en:`Refuse`}],ans:1},
  {q:{uz:`Korxona xodimlarga nimalarni ta'minlab berishi shart?`,ru:`Что компания должна обеспечить сотрудникам?`,en:`What must the company provide to employees?`},opts:[{uz:`Faqat ish haqi`,ru:`Только зарплату`,en:`Only the salary`},{uz:`Ish joyi, asbob-uskunalar, texnik jihozlar va maxsus kiyim`,ru:`Рабочее место, инструменты, техническое оборудование и спецодежду`,en:`Workplace, tools, equipment and special clothing`},{uz:`Faqat maxsus kiyim`,ru:`Только спецодежду`,en:`Only special clothing`},{uz:`Faqat texnik jihozlar`,ru:`Только техническое оборудование`,en:`Only technical equipment`}],ans:1},
  // Trello bo'yicha test savollari (16 ta savol)
  {q:{uz:`Trelloda ish boshlashdan oldin nima qilinishi shart?`,ru:`Что нужно сделать перед началом работы в Trello?`,en:`What must be done before starting work in Trello?`},opts:[{uz:`Hisobot yozish`,ru:`Написать отчёт`,en:`Write a report`},{uz:`Vazifani bajarildi qilish`,ru:`Отметить задачу выполненной`,en:`Mark task as done`},{uz:`Mirzohid aka audiosini eshittirish`,ru:`Прослушать аудио Мирзохид ака`,en:`Play Mirzohid aka's audio`},{uz:`Yangi kartochka ochish`,ru:`Открыть новую карточку`,en:`Open a new card`}],ans:2},
  {q:{uz:`Vazifa necha soat ichida "Vazifalar"dan "Jarayon"ga o'tkazilishi kerak?`,ru:`За сколько часов задача должна быть переведена из «Задачи» в «Процесс»?`,en:`Within how many hours must a task move from "Tasks" to "In progress"?`},opts:[{uz:`1 soat`,ru:`1 час`,en:`1 hour`},{uz:`3 soat`,ru:`3 часа`,en:`3 hours`},{uz:`5 soat`,ru:`5 часов`,en:`5 hours`},{uz:`8 soat`,ru:`8 часов`,en:`8 hours`}],ans:1},
  {q:{uz:`Vazifa bajarilgach birinchi navbatda qayerda hisobot beriladi?`,ru:`Где в первую очередь даётся отчёт после выполнения задачи?`,en:`Where is the report first given after a task is completed?`},opts:[{uz:`Trello izohida`,ru:`В комментарии Trello`,en:`In a Trello comment`},{uz:`Shaxsiy chatda`,ru:`В личном чате`,en:`In a personal chat`},{uz:`Telefon orqali`,ru:`По телефону`,en:`Over the phone`},{uz:`Telegram guruhida`,ru:`В Telegram-группе`,en:`In the Telegram group`}],ans:3},
  {q:{uz:`Telegramda hisobot berilgandan keyin Trelloda nima yoziladi?`,ru:`Что пишется в Trello после отчёта в Telegram?`,en:`What is written in Trello after reporting in Telegram?`},opts:[{uz:`Vazifa nomi`,ru:`Название задачи`,en:`Task name`},{uz:`Rahbar ismi`,ru:`Имя руководителя`,en:`Manager's name`},{uz:`Hisobot berilgan vaqt`,ru:`Время сдачи отчёта`,en:`Time the report was given`},{uz:`Jarima summasi`,ru:`Сумма штрафа`,en:`Fine amount`}],ans:2},
  {q:{uz:`Vazifa tugagach qaysi holatga o'tkaziladi?`,ru:`В какой статус переводится задача после завершения?`,en:`What status is a task moved to once finished?`},opts:[{uz:`Jarayon`,ru:`Процесс`,en:`In progress`},{uz:`Nazorat`,ru:`Контроль`,en:`Control`},{uz:`Tekshiruv`,ru:`Проверка`,en:`Review`},{uz:`Bajarildi`,ru:`Выполнено`,en:`Done`}],ans:3},
  {q:{uz:`Hisobot "Dedlayn"ni qaysi paytida topshirilishi kerak?`,ru:`В какое время должен быть сдан отчёт «Дедлайн»?`,en:`When must the "Deadline" report be submitted?`},opts:[{uz:`Vazifa boshida darhol`,ru:`Сразу в начале задачи`,en:`Immediately at the start of the task`},{uz:`Dedlayn kunida va berilgan vaqtigacha`,ru:`В день дедлайна и до указанного времени`,en:`On the deadline day and by the given time`},{uz:`Istalgan vaqtda`,ru:`В любое время`,en:`Any time`},{uz:`Ertasi kuni kunduzgi vaqtda`,ru:`На следующий день днём`,en:`The next day during daytime`}],ans:1},
  {q:{uz:`"Bajarildi"ga o'tkazish kechiksa har bir qo'shimcha soat uchun nima qo'llaniladi?`,ru:`Что применяется за каждый дополнительный час задержки перевода в «Выполнено»?`,en:`What applies for each extra hour delay moving to "Done"?`},opts:[{uz:`Mukofot`,ru:`Премия`,en:`Reward`},{uz:`Dam olish`,ru:`Отдых`,en:`Rest`},{uz:`Ogohlantirish`,ru:`Предупреждение`,en:`Warning`},{uz:`Jarima`,ru:`Штраф`,en:`Fine`}],ans:3},
  {q:{uz:`Jarima yozilgandan keyin yangi muddatni qancha vaqt ichida belgilatib olinishi kerak?`,ru:`В течение какого времени после выписки штрафа нужно установить новый срок?`,en:`Within how long after a fine is written must a new deadline be set?`},opts:[{uz:`30 daqiqa`,ru:`30 минут`,en:`30 minutes`},{uz:`2 soat`,ru:`2 часа`,en:`2 hours`},{uz:`1 soat`,ru:`1 час`,en:`1 hour`},{uz:`24 soat`,ru:`24 часа`,en:`24 hours`}],ans:2},
  {q:{uz:`Trellodagi vazifani o'chirib tashlash mumkinmi?`,ru:`Можно ли удалить задачу в Trello?`,en:`Can a Trello task be deleted?`},opts:[{uz:`Rahbarsiz ham mumkin`,ru:`Можно без руководителя`,en:`Allowed without the manager`},{uz:`Faqat kechqurun mumkin`,ru:`Только вечером`,en:`Only in the evening`},{uz:`Ba'zan mumkin`,ru:`Иногда можно`,en:`Sometimes`},{uz:`Qat'iyan mumkin emas`,ru:`Категорически нельзя`,en:`Strictly forbidden`}],ans:3},
  {q:{uz:`Xodim boshqa xodimga berilgan vazifani o'zgartira oladimi?`,ru:`Может ли сотрудник изменять задачу, назначенную другому?`,en:`Can an employee change a task assigned to another?`},opts:[{uz:`Yo'q, mumkin emas`,ru:`Нет, нельзя`,en:`No, not allowed`},{uz:`Ha, istalgan payt`,ru:`Да, в любое время`,en:`Yes, any time`},{uz:`Faqat yakshanba kuni`,ru:`Только в воскресенье`,en:`Only on Sunday`},{uz:`Faqat telefon orqali`,ru:`Только по телефону`,en:`Only by phone`}],ans:0},
  {q:{uz:`Vazifani tushunmasdan "Jarayon"ga olish mumkinmi?`,ru:`Можно ли брать задачу в «Процесс», не поняв её?`,en:`Can a task be moved to "In progress" without understanding it?`},opts:[{uz:`Mumkin`,ru:`Можно`,en:`Allowed`},{uz:`Faqat rahbar ruxsati bilan`,ru:`Только с разрешения руководителя`,en:`Only with manager's permission`},{uz:`Mumkin emas`,ru:`Нельзя`,en:`Not allowed`},{uz:`Ba'zan mumkin`,ru:`Иногда можно`,en:`Sometimes`}],ans:2},
  {q:{uz:`Vazifani vaqtida tugata olmasa rahbar qachon ogohlantiriladi?`,ru:`Когда нужно предупредить руководителя, если не успеваешь по задаче?`,en:`When must the manager be warned if a task won't be done on time?`},opts:[{uz:`Dedlayndan 1 soat oldin`,ru:`За 1 час до дедлайна`,en:`1 hour before deadline`},{uz:`Dedlayndan keyin`,ru:`После дедлайна`,en:`After deadline`},{uz:`Ertasi kuni`,ru:`На следующий день`,en:`The next day`},{uz:`Istalgan vaqtda`,ru:`В любое время`,en:`Any time`}],ans:0},
  {q:{uz:`Vazifa "Jarayon"da turgan bo'lsa va xodim uni o'z vaqtida bajara olmasligini bilsa, nima qilishi kerak?`,ru:`Если задача в «Процессе», а сотрудник понимает, что не успеет, что делать?`,en:`If a task is "In progress" and the employee knows they won't make it, what should they do?`},opts:[{uz:`Vazifani muddatidan keyin bajarib, keyin rahbarga xabar berishi kerak.`,ru:`Выполнить задачу позже срока, а потом сообщить руководителю.`,en:`Finish the task after the deadline and then notify the manager.`},{uz:`Vazifani "Bajarildi"ga o'tkazib, keyin rahbar bilan bog'lanishi kerak.`,ru:`Перевести задачу в «Выполнено», а потом связаться с руководителем.`,en:`Move the task to "Done" and then contact the manager.`},{uz:`Muddatdan kamida 1 soat oldin rahbarni SMS yoki Telegram orqali ogohlantirib, 5 daqiqa ichida telefon qilishi kerak.`,ru:`Минимум за 1 час до срока предупредить руководителя по SMS или Telegram и в течение 5 минут позвонить.`,en:`At least 1 hour before the deadline, warn the manager via SMS or Telegram and call within 5 minutes.`},{uz:`Faqat Telegram orqali yozishi kifoya, telefon qilish shart emas.`,ru:`Достаточно написать в Telegram, звонить не обязательно.`,en:`Writing in Telegram is enough, no need to call.`}],ans:2},
  {q:{uz:`Trelloda yangi kartochka ochish kimga ruxsat etiladi?`,ru:`Кому разрешено открывать новую карточку в Trello?`,en:`Who is allowed to open a new card in Trello?`},opts:[{uz:`Har qanday xodimga`,ru:`Любому сотруднику`,en:`Any employee`},{uz:`Faqat staji 1 yildan oshgan xodimga`,ru:`Только сотруднику со стажем более 1 года`,en:`Only employees with more than 1 year tenure`},{uz:`Telegramda yozgan xodimga`,ru:`Сотруднику, который написал в Telegram`,en:`Employees who wrote in Telegram`},{uz:`Hech kimga ruxsat etilmaydi`,ru:`Никому не разрешено`,en:`No one is allowed`}],ans:3},
  {q:{uz:`Xodim o'ziga berilgan vazifaga Trelloda nima qila oladi?`,ru:`Что может сотрудник делать в Trello со своей задачей?`,en:`What can an employee do in Trello with their assigned task?`},opts:[{uz:`Yangi muddat belgilashi mumkin`,ru:`Может устанавливать новый срок`,en:`Can set a new deadline`},{uz:`Faqat vazifani bosqichlar bo'yicha o'tkazishi va izoh qoldirishi mumkin`,ru:`Только переводить задачу по этапам и оставлять комментарии`,en:`Can only move the task through stages and leave comments`},{uz:`Boshqa xodimga topshirishi mumkin`,ru:`Может передать другому сотруднику`,en:`Can delegate to another employee`},{uz:`Vazifa mazmunini o'zgartirishi mumkin`,ru:`Может изменять содержание задачи`,en:`Can change the task content`}],ans:1},
  {q:{uz:`Mas'ul shaxs Trelloda berilgan yangi vazifani olgach, birinchi navbatda nima qilishi kerak?`,ru:`Что в первую очередь должен сделать ответственный, получив новую задачу в Trello?`,en:`What must the responsible person do first upon receiving a new Trello task?`},opts:[{uz:`Vazifani darhol "Jarayon"ga o'tkazishi kerak.`,ru:`Сразу перевести задачу в «Процесс».`,en:`Move the task to "In progress" immediately.`},{uz:`Vazifani o'qib chiqmasdan bajarishni boshlashi kerak.`,ru:`Начать выполнение, не прочитав задачу.`,en:`Start working without reading the task.`},{uz:`Vazifani diqqat bilan o'qib, mazmuni va talablarini to'liq tushunib olgandan keyingina "Jarayon"ga o'tkazishi kerak.`,ru:`Внимательно прочитать задачу и только после полного понимания её содержания и требований переводить в «Процесс».`,en:`Carefully read the task and only after fully understanding its content and requirements move it to "In progress".`},{uz:`Vazifani boshqa xodimga yuborib qo'yishi kerak.`,ru:`Перенаправить задачу другому сотруднику.`,en:`Send the task to another employee.`}],ans:2},
];

// 30 questions for the "amoCRM bo'limi" card.
const QS_AMOCRM: MlQ[] = [
  {q:{uz:`amoCRM da yangi mijoz murojaati kelganda xodimning birinchi vazifasi nima?`,ru:`Когда в amoCRM поступает обращение нового клиента, какова первая задача сотрудника?`,en:`When a new client request arrives in amoCRM, what is the employee's first task?`},opts:[{uz:`Mijozni kutishga qo'yish`,ru:`Поставить клиента в ожидание`,en:`Put client on hold`},{uz:`Mijoz ma'lumotlarini amoCRM ga kiritish va bitim yaratish`,ru:`Внести данные клиента в amoCRM и создать сделку`,en:`Enter client data in amoCRM and create a deal`},{uz:`Faqat telefon raqamini saqlab qo'yish`,ru:`Только сохранить номер телефона`,en:`Just save the phone number`},{uz:`Rahbarning ko'rsatmasini kutish`,ru:`Ждать указаний руководителя`,en:`Wait for manager's instructions`}],ans:1},
  {q:{uz:`amoCRM ga yangi mijoz murojaati kelganda birinchi nima qilinadi?`,ru:`Что делается первым, когда в amoCRM приходит обращение нового клиента?`,en:`What is done first when a new client request comes to amoCRM?`},opts:[{uz:`E'tibor hisobga olinmaydi / E'tiborsiz qoldiriladi`,ru:`Игнорируется / Не учитывается`,en:`Ignored / Disregarded`},{uz:`O'chirib yuboriladi`,ru:`Удаляется`,en:`Deleted`},{uz:`Mijozga aloqaga chiqiladi`,ru:`Связываются с клиентом`,en:`Contact the client`},{uz:`Kutib turiladi`,ru:`Ждут`,en:`Wait`}],ans:2},
  {q:{uz:`Mijoz bilan gaplashayotganda qanday ohangda muloqot qilish kerak?`,ru:`В каком тоне нужно общаться с клиентом?`,en:`In what tone must you speak with a client?`},opts:[{uz:`Qo'pol`,ru:`Грубо`,en:`Rude`},{uz:`Hurmat bilan`,ru:`С уважением`,en:`Respectfully`},{uz:`Befarq`,ru:`Безразлично`,en:`Indifferently`},{uz:`Jahldor`,ru:`Раздражённо`,en:`Angrily`}],ans:1},
  {q:{uz:`Mijozning telefon raqami qayerda saqlanishi kerak?`,ru:`Где должен храниться номер телефона клиента?`,en:`Where must the client's phone number be stored?`},opts:[{uz:`amoCRM da`,ru:`В amoCRM`,en:`In amoCRM`},{uz:`Telegramda`,ru:`В Telegram`,en:`In Telegram`},{uz:`Daftarda`,ru:`В блокноте`,en:`In a notebook`},{uz:`Esda`,ru:`В памяти`,en:`By memory`}],ans:0},
  {q:{uz:`Mijoz savoliga javob berishda nima muhim?`,ru:`Что важно при ответе на вопрос клиента?`,en:`What matters when answering a client's question?`},opts:[{uz:`Tez va aniq javob berish`,ru:`Быстро и точно отвечать`,en:`Reply quickly and accurately`},{uz:`Kechiktirish`,ru:`Откладывать`,en:`Delay`},{uz:`Mavzuni o'zgartirish`,ru:`Менять тему`,en:`Change the topic`},{uz:`Javob bermaslik`,ru:`Не отвечать`,en:`Not reply`}],ans:0},
  {q:{uz:`Mijoz murojaati CRM ga kiritilmasa nima yuz beradi?`,ru:`Что произойдёт, если обращение клиента не внести в CRM?`,en:`What happens if a client request isn't entered in the CRM?`},opts:[{uz:`Muammo bo'lmaydi`,ru:`Никакой проблемы`,en:`No problem`},{uz:`Mijoz yo'qolib qolishi mumkin`,ru:`Клиент может потеряться`,en:`The client may be lost`},{uz:`Savdo oshadi`,ru:`Продажи вырастут`,en:`Sales increase`},{uz:`Bonus beriladi`,ru:`Дают бонус`,en:`A bonus is given`}],ans:1},
  {q:{uz:`Mijoz bilan tortishish kerakmi?`,ru:`Нужно ли спорить с клиентом?`,en:`Should you argue with the client?`},opts:[{uz:`Ha`,ru:`Да`,en:`Yes`},{uz:`Ba'zida`,ru:`Иногда`,en:`Sometimes`},{uz:`Yo'q`,ru:`Нет`,en:`No`},{uz:`Zarur bo'lsa`,ru:`При необходимости`,en:`If necessary`}],ans:2},
  {q:{uz:`CRM dagi ma'lumotlar qanday bo'lishi kerak?`,ru:`Какими должны быть данные в CRM?`,en:`What should CRM data be like?`},opts:[{uz:`Taxminiy`,ru:`Приблизительными`,en:`Approximate`},{uz:`Keraksiz`,ru:`Ненужными`,en:`Unnecessary`},{uz:`Qisman`,ru:`Частичными`,en:`Partial`},{uz:`To'liq va aniq`,ru:`Полными и точными`,en:`Complete and accurate`}],ans:3},
  {q:{uz:`Mijoz qo'ng'iroqqa javob bermasa nima qilinadi?`,ru:`Что делать, если клиент не отвечает на звонок?`,en:`What to do if a client doesn't answer the call?`},opts:[{uz:`Qayta bog'laniladi`,ru:`Связываются повторно`,en:`Call back`},{uz:`Unutiladi`,ru:`Забывают`,en:`Forget`},{uz:`Bloklanadi`,ru:`Блокируется`,en:`Blocked`},{uz:`O'chiriladi`,ru:`Удаляется`,en:`Deleted`}],ans:0},
  {q:{uz:`Mijoz mahsulot yoki xizmat haqida qo'shimcha ma'lumot so'rasa, xodim qanday yo'l tutishi kerak?`,ru:`Как должен поступить сотрудник, если клиент запрашивает дополнительную информацию о продукте или услуге?`,en:`How should the employee act if a client asks for additional information about a product or service?`},opts:[{uz:`Taxminiy ma'lumot berishi kerak.`,ru:`Должен дать приблизительную информацию.`,en:`Should give approximate information.`},{uz:`Mavzuni o'zgartirib yuborishi kerak.`,ru:`Должен сменить тему.`,en:`Should change the topic.`},{uz:`Faqat aniq va tasdiqlangan ma'lumot berishi kerak.`,ru:`Должен давать только точную и подтверждённую информацию.`,en:`Should give only accurate, verified information.`},{uz:`Javob berishni boshqa kunga qoldirishi kerak.`,ru:`Должен отложить ответ на другой день.`,en:`Should delay the answer to another day.`}],ans:2},
  {q:{uz:`amoCRM da vazifa nima uchun qo'yiladi?`,ru:`Для чего ставится задача в amoCRM?`,en:`Why is a task set in amoCRM?`},opts:[{uz:`Eslatma uchun`,ru:`Для напоминания`,en:`For reminder`},{uz:`O'yin uchun`,ru:`Для игры`,en:`For fun`},{uz:`Hisobot uchun`,ru:`Для отчёта`,en:`For reporting`},{uz:`Reklama uchun`,ru:`Для рекламы`,en:`For advertising`}],ans:0},
  {q:{uz:`Mijoz bilan suhbatda eng muhim narsa nima?`,ru:`Что самое важное в разговоре с клиентом?`,en:`What is most important in a conversation with a client?`},opts:[{uz:`Shoshirish`,ru:`Торопить`,en:`Rushing`},{uz:`Ko'p gapirish`,ru:`Много говорить`,en:`Talking a lot`},{uz:`Eshitish va tushunish`,ru:`Слушать и понимать`,en:`Listening and understanding`},{uz:`Bahslashish`,ru:`Спорить`,en:`Arguing`}],ans:2},
  {q:{uz:`Mijoz ma'lumotlarini boshqa shaxslarga berish mumkinmi?`,ru:`Можно ли передавать данные клиента другим лицам?`,en:`Can client data be shared with other people?`},opts:[{uz:`Ha`,ru:`Да`,en:`Yes`},{uz:`Yo'q`,ru:`Нет`,en:`No`},{uz:`Do'stlarga mumkin`,ru:`Друзьям можно`,en:`Friends are OK`},{uz:`Hamkasblarga har doim mumkin`,ru:`Коллегам всегда можно`,en:`Always OK to coworkers`}],ans:1},
  {q:{uz:`Mijozga va'da berilganda nima qilish kerak?`,ru:`Что нужно сделать, если клиенту дано обещание?`,en:`What must be done when a promise is made to a client?`},opts:[{uz:`Unutish`,ru:`Забыть`,en:`Forget`},{uz:`Bekor qilish`,ru:`Отменить`,en:`Cancel`},{uz:`Kechiktirish`,ru:`Откладывать`,en:`Delay`},{uz:`Bajarish`,ru:`Выполнить`,en:`Fulfill`}],ans:3},
  {q:{uz:`CRM da varonkadagi mijoz kartochkasi nima uchun o'zgartiriladi?`,ru:`Для чего меняется карточка клиента в воронке CRM?`,en:`Why is the client card in the CRM funnel changed?`},opts:[{uz:`Jarayonni ko'rsatish uchun`,ru:`Чтобы показать этап процесса`,en:`To show the process stage`},{uz:`Chiroyli ko'rinish uchun`,ru:`Для красивого вида`,en:`For pretty looks`},{uz:`Tasodifan`,ru:`Случайно`,en:`Randomly`},{uz:`Keraksiz`,ru:`Без надобности`,en:`Unnecessarily`}],ans:0},
  {q:{uz:`Mijoz e'tiroz bildirsa nima qilish kerak?`,ru:`Что делать, если клиент возражает?`,en:`What to do if a client objects?`},opts:[{uz:`Bahslashish`,ru:`Спорить`,en:`Argue`},{uz:`Telefonni qo'yish`,ru:`Положить трубку`,en:`Hang up`},{uz:`Tinglash va yechim taklif qilish`,ru:`Выслушать и предложить решение`,en:`Listen and offer a solution`},{uz:`E'tibor bermaslik`,ru:`Игнорировать`,en:`Ignore`}],ans:2},
  {q:{uz:`Savdo yopilgandan keyin nima qilish kerak?`,ru:`Что делать после закрытия сделки?`,en:`What to do after a sale is closed?`},opts:[{uz:`CRM ni yangilash`,ru:`Обновить CRM`,en:`Update the CRM`},{uz:`Hech narsa`,ru:`Ничего`,en:`Nothing`},{uz:`Mijozni o'chirish`,ru:`Удалить клиента`,en:`Delete the client`},{uz:`Statusni o'zgartirmaslik`,ru:`Не менять статус`,en:`Don't change status`}],ans:0},
  {q:{uz:`Mijozga javob berishni kechiktirish nimaga olib keladi?`,ru:`К чему ведёт задержка ответа клиенту?`,en:`What does delaying a reply to a client lead to?`},opts:[{uz:`Savdo oshadi`,ru:`Продажи растут`,en:`Sales increase`},{uz:`Ishonch kamayadi`,ru:`Доверие снижается`,en:`Trust decreases`},{uz:`Foyda ko'payadi`,ru:`Прибыль растёт`,en:`Profit grows`},{uz:`Ta'siri yo'q`,ru:`Не влияет`,en:`No effect`}],ans:1},
  {q:{uz:`CRM da izohlar nima uchun yoziladi?`,ru:`Для чего пишутся комментарии в CRM?`,en:`Why are notes written in the CRM?`},opts:[{uz:`Shunchaki o'yin uchun`,ru:`Просто ради игры`,en:`Just for play`},{uz:`Bekorchilik uchun`,ru:`От безделья`,en:`Out of idleness`},{uz:`Reklama uchun`,ru:`Для рекламы`,en:`For advertising`},{uz:`Mijoz tarixi saqlanishi uchun`,ru:`Чтобы сохранять историю клиента`,en:`To preserve client history`}],ans:3},
  {q:{uz:`Mijozga murojaat qilishda nima muhim?`,ru:`Что важно при обращении к клиенту?`,en:`What matters when addressing a client?`},opts:[{uz:`Hurmat va odob`,ru:`Уважение и вежливость`,en:`Respect and politeness`},{uz:`Buyruq ohangi`,ru:`Приказной тон`,en:`Command tone`},{uz:`Qo'pollik`,ru:`Грубость`,en:`Rudeness`},{uz:`Shoshirish`,ru:`Спешка`,en:`Rushing`}],ans:0},
  {q:{uz:`Mijoz javob bermasa nima qilinadi?`,ru:`Что делать, если клиент не отвечает?`,en:`What to do if a client doesn't reply?`},opts:[{uz:`Belgilangan vaqtda qayta aloqa qilinadi`,ru:`В назначенное время связываются повторно`,en:`Contact again at scheduled time`},{uz:`O'chiriladi`,ru:`Удаляется`,en:`Deleted`},{uz:`Bloklanadi`,ru:`Блокируется`,en:`Blocked`},{uz:`Unutiladi`,ru:`Забывается`,en:`Forgotten`}],ans:0},
  {q:{uz:`CRM dagi vazifani yopishdan oldin nima tekshiriladi?`,ru:`Что проверяется перед закрытием задачи в CRM?`,en:`What is checked before closing a CRM task?`},opts:[{uz:`Rang`,ru:`Цвет`,en:`Color`},{uz:`Sana`,ru:`Дата`,en:`Date`},{uz:`Vazifa bajarilgani`,ru:`Что задача выполнена`,en:`That the task is completed`},{uz:`Ism`,ru:`Имя`,en:`Name`}],ans:2},
  {q:{uz:`Mijozga noto'g'ri narx aytilsa nima qilish kerak?`,ru:`Что делать, если клиенту названа неверная цена?`,en:`What to do if the wrong price was given to a client?`},opts:[{uz:`Xatoni tan olib to'g'rilash`,ru:`Признать ошибку и исправить`,en:`Admit the mistake and correct it`},{uz:`Yashirish`,ru:`Скрыть`,en:`Hide`},{uz:`Bahslashish`,ru:`Спорить`,en:`Argue`},{uz:`Javob bermaslik`,ru:`Не отвечать`,en:`Not respond`}],ans:0},
  {q:{uz:`Mijoz bilan yozishmada qanday uslub bo'lishi kerak?`,ru:`В каком стиле должна вестись переписка с клиентом?`,en:`In what style should correspondence with a client be?`},opts:[{uz:`Beparvo`,ru:`Небрежно`,en:`Careless`},{uz:`Qo'pol`,ru:`Грубо`,en:`Rude`},{uz:`Professional va muloyim`,ru:`Профессионально и вежливо`,en:`Professional and polite`},{uz:`Hazilomuz`,ru:`Шутливо`,en:`Joking`}],ans:2},
  {q:{uz:`CRM ga ma'lumot qachon kiritiladi?`,ru:`Когда вносится информация в CRM?`,en:`When is information entered into the CRM?`},opts:[{uz:`Muloqotdan so'ng darhol`,ru:`Сразу после общения`,en:`Immediately after the conversation`},{uz:`Bir haftadan keyin`,ru:`Через неделю`,en:`A week later`},{uz:`Oyning oxirida`,ru:`В конце месяца`,en:`At month end`},{uz:`Kerak bo'lsa`,ru:`Если понадобится`,en:`If needed`}],ans:0},
  {q:{uz:`Mijozning e'tirozini eshitmaslik nimaga olib keladi?`,ru:`К чему ведёт нежелание выслушать возражение клиента?`,en:`What does ignoring a client's objection lead to?`},opts:[{uz:`Bonusga`,ru:`К бонусу`,en:`To bonus`},{uz:`Savdo oshishiga`,ru:`К росту продаж`,en:`To sales growth`},{uz:`Mijozni yo'qotishga`,ru:`К потере клиента`,en:`To losing the client`},{uz:`Reklamaga`,ru:`К рекламе`,en:`To advertising`}],ans:2},
  {q:{uz:`amoCRM da vazifani unutmaslik uchun nima qilinadi?`,ru:`Что делается, чтобы не забыть задачу в amoCRM?`,en:`What is done so as not to forget a task in amoCRM?`},opts:[{uz:`Vazifa va muddat qo'yiladi`,ru:`Ставится задача с дедлайном`,en:`A task with a deadline is set`},{uz:`Kutib turiladi`,ru:`Просто ждут`,en:`Just wait`},{uz:`Yozilmaydi`,ru:`Не записывают`,en:`Don't record`},{uz:`O'chirib yuboriladi`,ru:`Удаляют`,en:`Delete`}],ans:0},
  {q:{uz:`Mijozga yolg'on va'da berish mumkinmi?`,ru:`Можно ли давать клиенту ложные обещания?`,en:`Can you give a client false promises?`},opts:[{uz:`Ba'zida`,ru:`Иногда`,en:`Sometimes`},{uz:`Ha, vaziyatga qarab`,ru:`Да, по ситуации`,en:`Yes, depending on the situation`},{uz:`Yo'q`,ru:`Нет`,en:`No`},{uz:`Zarur bo'lsa`,ru:`При необходимости`,en:`If necessary`}],ans:2},
  {q:{uz:`Mijoz bilan ishlashdagi asosiy maqsad nima?`,ru:`Какова главная цель работы с клиентом?`,en:`What is the main goal of working with a client?`},opts:[{uz:`Mijoz ehtiyojini qondirish va savdo qilish`,ru:`Удовлетворить потребность клиента и совершить продажу`,en:`Meet the client's need and make the sale`},{uz:`Bahslashish`,ru:`Спорить`,en:`Arguing`},{uz:`Shoshirish`,ru:`Торопить`,en:`Rushing`},{uz:`Rad etish`,ru:`Отказывать`,en:`Refusing`}],ans:0},
  {q:{uz:`amoCRM da barcha ma'lumotlarni o'z vaqtida kiritish nima uchun muhim?`,ru:`Почему важно своевременно вносить все данные в amoCRM?`,en:`Why is it important to enter all data into amoCRM on time?`},opts:[{uz:`Ish jarayonini nazorat qilish uchun`,ru:`Для контроля рабочего процесса`,en:`To control the workflow`},{uz:`Faqat hisobot uchun`,ru:`Только для отчёта`,en:`Only for reporting`},{uz:`Keraksiz`,ru:`Не нужно`,en:`Not necessary`},{uz:`Faqat rahbar uchun`,ru:`Только для руководителя`,en:`Only for the manager`}],ans:0},
];

// 50 questions for the "Umumiy test" card. Edit/extend this section via admin once
// a DB-backed override is added; for now these are the source of truth.
const QS_UMUMIY: MlQ[] = [
  {q:{uz:`Korxonada qog'ozni tejash uchun kim mas'ul?`,ru:`Кто в компании несет ответственность за экономию бумаги?`,en:`Who is responsible for saving paper in the company?`},opts:[{uz:`Faqat omborchi`,ru:`Только кладовщик`,en:`Only the warehouse keeper`},{uz:`Faqat rahbar`,ru:`Только руководитель`,en:`Only the manager`},{uz:`Har bir xodim`,ru:`Каждый сотрудник`,en:`Every employee`},{uz:`Faqat printer operatori`,ru:`Только оператор принтера`,en:`Only the printer operator`}],ans:2},
  {q:{uz:`Printerdan chiqariladigan matn qachon chop etilishi kerak?`,ru:`Когда должен распечатываться текст из принтера?`,en:`When should a text sent to the printer be printed?`},opts:[{uz:`Rahbar ruxsatidan keyin`,ru:`После разрешения руководителя`,en:`After receiving permission from the manager`},{uz:`Bir necha marta chop etilgandan keyin`,ru:`После повторной печати несколько раз`,en:`After being printed multiple times`},{uz:`Tekshirib chiqilgandan keyin`,ru:`После проверки текста`,en:`After it has been thoroughly checked`},{uz:`Kun oxirida`,ru:`В конце дня`,en:`At the end of the day`}],ans:2},
  {q:{uz:`Telegram holatini kimlar ochiq qilishi shart?`,ru:`Кто обязан сделать свой статус в Telegram «открытым» (видимым)?`,en:`Who must keep their Telegram status public/visible?`},opts:[{uz:`Faqat rahbarlar`,ru:`Только руководители`,en:`Only managers`},{uz:`Faqat yangi xodimlar`,ru:`Только новые сотрудники`,en:`Only new employees`},{uz:`Faqat ofis xodimlari`,ru:`Только офисные сотрудники`,en:`Only office staff`},{uz:`Barcha xodimlar`,ru:`Все сотрудники`,en:`All employees`}],ans:3},
  {q:{uz:`Telegramda oxirgi kirgan vaqt holati qanday bo'lishi kerak?`,ru:`Каким должен быть статус времени последнего входа (активности) в Telegram?`,en:`What should the "Last Seen" privacy setting be on Telegram?`},opts:[{uz:`Faqat rahbarlarga ochiq`,ru:`Открыт только для руководителей`,en:`Visible only to managers`},{uz:`Yopiq`,ru:`Скрыт`,en:`Hidden`},{uz:`Ochiq`,ru:`Открыт`,en:`Public / Visible`},{uz:`Muhim emas`,ru:`Не имеет значения`,en:`It doesn't matter`}],ans:2},
  {q:{uz:`Ish qurollarini tartibli saqlashning asosiy maqsadi nima?`,ru:`Какова основная цель поддержания порядка на рабочем месте и хранения инструментов?`,en:`What is the main purpose of keeping working tools organized?`},opts:[{uz:`Ish jarayonini samarali tashkil qilish`,ru:`Эффективная организация рабочего процесса`,en:`Efficient organization of the work process`},{uz:`Ish vaqtini uzaytirish`,ru:`Продление рабочего времени`,en:`Extending working hours`},{uz:`Omborni to'ldirish`,ru:`Заполнение склада`,en:`Filling up the warehouse`},{uz:`Xarajatlarni oshirish`,ru:`Увеличение расходов`,en:`Increasing expenses`}],ans:0},
  {q:{uz:`Zarur holatda boshqa joyda qolish uchun nima qilish kerak?`,ru:`Что нужно сделать в случае необходимости отлучиться или остаться в другом месте?`,en:`What must you do if you need to stay or be elsewhere during work hours?`},opts:[{uz:`Hamkasbini ogohlantirish`,ru:`Предупредить коллегу`,en:`Inform a colleague`},{uz:`Oldindan rahbariyatni ogohlantirib, ruxsat olish`,ru:`Заранее предупредить руководство и получить разрешение`,en:`Inform management in advance and get approval`},{uz:`Telegram guruhiga yozish`,ru:`Написать в группу Telegram`,en:`Write in the Telegram group`},{uz:`Hech kimga aytmaslik`,ru:`Никому не говорить`,en:`Tell no one`}],ans:1},
  {q:{uz:`Sotuv bo'limi xodimlarining asosiy vazifasi nima?`,ru:`Какова основная обязанность сотрудников отдела продаж?`,en:`What is the primary duty of the sales department staff?`},opts:[{uz:`Ombor ishlarini bajarish`,ru:`Выполнение складских работ`,en:`Handling warehouse tasks`},{uz:`Faqat sotuv faoliyati bilan shug'ullanish`,ru:`Заниматься исключительно продажами`,en:`Focusing exclusively on sales activities`},{uz:`Barcha bo'lim ishlarini nazorat qilish`,ru:`Контролировать работу всех отделов`,en:`Supervising all departments`},{uz:`Ishlab chiqarish bilan shug'ullanish`,ru:`Заниматься производством`,en:`Handling production`}],ans:1},
  {q:{uz:`Sotuv bo'limi xodimlariga nima taqiqlanadi?`,ru:`Что запрещено сотрудникам отдела продаж?`,en:`What is strictly forbidden for sales department staff?`},opts:[{uz:`Mijozlar bilan ishlash`,ru:`Работать с клиентами`,en:`Working with clients`},{uz:`Hisobot topshirish`,ru:`Сдавать отчеты`,en:`Submitting reports`},{uz:`Boshqa bo'lim ishlariga aralashish`,ru:`Вмешиваться в работу других отделов`,en:`Interfering in the work of other departments`},{uz:`Sotuv rejasini bajarish`,ru:`Выполнять план продаж`,en:`Meeting the sales target`}],ans:2},
  {q:{uz:`Quyidagilardan qaysi biri sotuv bo'limi xodimining asosiy vazifasiga kirmaydi?`,ru:`Что из перечисленного НЕ входит в основные обязанности сотрудника отдела продаж?`,en:`Which of the following is NOT a core responsibility of a sales department employee?`},opts:[{uz:`Mijozlar bilan ishlash`,ru:`Работа с клиентами`,en:`Working with clients`},{uz:`Sotuv jarayonini yuritish`,ru:`Ведение процесса продаж`,en:`Managing the sales process`},{uz:`Sotuv rejasini bajarish`,ru:`Выполнение плана продаж`,en:`Meeting the sales target`},{uz:`Ombordagi mahsulotlarni inventarizatsiya qilish`,ru:`Инвентаризация товаров на складе`,en:`Inventorying products in the warehouse`}],ans:3},
  {q:{uz:`Ish kunlarida xodimlar turli oilaviy sabablar bilan tez-tez javob so'rashi mumkinmi?`,ru:`Могут ли сотрудники часто отпрашиваться в рабочие дни по различным семейным обстоятельствам?`,en:`Can employees frequently ask for time off during workdays for various family reasons?`},opts:[{uz:`Ha, istalgan vaqtda`,ru:`Да, в любое время`,en:`Yes, at any time`},{uz:`Faqat oy oxirida`,ru:`Только в конце месяца`,en:`Only at the end of the month`},{uz:`Mumkin emas`,ru:`Нельзя (не допускается)`,en:`It is not allowed`},{uz:`Faqat yangi xodimlar mumkin`,ru:`Можно только новым сотрудникам`,en:`Only new employees can`}],ans:2},
  {q:{uz:`Qaysi holatlar ushbu qoidaga istisno hisoblanadi?`,ru:`Какие случаи являются исключением из этого правила?`,en:`Which situations are considered exceptions to this rule?`},opts:[{uz:`Mehmonga borish`,ru:`Поход в гости`,en:`Visiting guests`},{uz:`Sog'liq, aza, fotiha va o'ta uzrli holatlar`,ru:`Здоровье, траур, обряды (похороны/поминки) и другие крайне уважительные причины`,en:`Health issues, mourning, traditional family rites (fotiha), and extreme emergencies`},{uz:`Shaxsiy ishlar`,ru:`Личные дела`,en:`Personal errands`},{uz:`Bozorga chiqish`,ru:`Поход на рынок`,en:`Going to the market`}],ans:1},
  {q:{uz:`Xodim ishni qachon to'liq boshlashga tayyor bo'lishi kerak?`,ru:`К какому времени сотрудник должен быть полностью готов к началу работы?`,en:`When must an employee be fully ready to start working?`},opts:[{uz:`08:55 da`,ru:`В 08:55`,en:`At 08:55`},{uz:`09:10 da`,ru:`В 09:10`,en:`At 09:10`},{uz:`Tushlikdan keyin`,ru:`После обеда`,en:`After lunch`},{uz:`09:00 da`,ru:`В 09:00`,en:`At 09:00`}],ans:3},
  {q:{uz:`Oshpaz mahsulot ro'yxatini necha kun oldin topshirishi kerak?`,ru:`За сколько дней повар должен сдать список необходимых продуктов?`,en:`How many days in advance must the chef submit the grocery list?`},opts:[{uz:`3 kun oldin`,ru:`За 3 дня`,en:`3 days in advance`},{uz:`5 kun oldin`,ru:`За 5 дней`,en:`5 days in advance`},{uz:`7 kun oldin`,ru:`За 7 дней`,en:`7 days in advance`},{uz:`10 kun oldin`,ru:`За 10 дней`,en:`10 days in advance`}],ans:0},
  {q:{uz:`Hojatxonalarga qo'yilgan asosiy talab nima?`,ru:`Каково основное требование к туалетным комнатам?`,en:`What is the primary requirement for restrooms?`},opts:[{uz:`Faqat ertalab tozalanishi kerak`,ru:`Должны убираться только утром`,en:`They should only be cleaned in the morning`},{uz:`Har doim toza va anjomlari to'liq bo'lishi shart`,ru:`Всегда должны быть чистыми и полностью укомплектованными принадлежностями`,en:`They must always be clean and fully stocked with supplies`},{uz:`Haftada bir marta tozalansa yetarli`,ru:`Достаточно убираться раз в неделю`,en:`Cleaning once a week is enough`},{uz:`Faqat tekshiruvdan oldin tartibga keltiriladi`,ru:`Приводятся в порядок только перед проверкой`,en:`They are only organized before inspections`}],ans:1},
  {q:{uz:`Rahbar tekshiruv vaqtida ofis xonasi tartibsiz bo'lsa nima bo'ladi?`,ru:`Что произойдет, если во время проверки руководителем в офисном кабинете будет беспорядок?`,en:`What happens if an office room is untidy during a manager's inspection?`},opts:[{uz:`Faqat farrosh javob beradi`,ru:`Ответственность несет только уборщица`,en:`Only the cleaner will be held responsible`},{uz:`Hech qanday chora ko'rilmaydi`,ru:`Никаких мер принято не будет`,en:`No action will be taken`},{uz:`Xonada ishlovchi barcha xodimlarga alohida jarima qo'llaniladi`,ru:`На всех сотрудников, работающих в этом кабинете, налагается отдельный штраф`,en:`A separate fine will be issued to all employees working in that room`},{uz:`Faqat bo'lim boshlig'i ogohlantiriladi`,ru:`Предупреждение получит только начальник отдела`,en:`Only the department head will be warned`}],ans:2},
  {q:{uz:`Xodimlarga ishchi Telegram guruhlariga nisbatan nima taqiqlanadi?`,ru:`Что запрещено сотрудникам в отношении рабочих групп в Telegram?`,en:`What is forbidden for employees regarding work-related Telegram groups?`},opts:[{uz:`Xabar yozish`,ru:`Писать сообщения`,en:`Writing messages`},{uz:`Fayl yuborish`,ru:`Отправлять файлы`,en:`Sending files`},{uz:`Guruh nomini o'qish`,ru:`Читать название группы`,en:`Reading the group name`},{uz:`O'zboshimchalik bilan guruhni tark etish`,ru:`Самовольно выходить из группы`,en:`Leaving the group without authorization`}],ans:3},
  {q:{uz:`Kompaniyada qaysi holatlarga yo'l qo'yilmaydi?`,ru:`Какие проявления абсолютно недопустимы в компании?`,en:`Which of the following behaviors is completely unacceptable in the company?`},opts:[{uz:`Hamkorlik qilishga`,ru:`Сотрудничество`,en:`Collaborating`},{uz:`Arazlashish, beodoblik va oliftagarchilikka`,ru:`Обиды (бойкоты), грубость/невоспитанность и высокомерие (выпендреж)`,en:`Giving the silent treatment (sulking), rudeness, and showing off (arrogance)`},{uz:`Taklif bildirishga`,ru:`Выдвижение предложений`,en:`Making suggestions`},{uz:`Savol berishga`,ru:`Задавание вопросов`,en:`Asking questions`}],ans:1},
  {q:{uz:`Ish unumdorligini oshirish uchun qaysi bo'limlar bir-birining xonasiga kirishi taqiqlanadi?`,ru:`Каким отделам запрещено заходить в кабинеты друг к другу для повышения продуктивности работы?`,en:`To boost productivity, which departments are prohibited from entering each other's offices?`},opts:[{uz:`Ombor va ishlab chiqarish bo'limi`,ru:`Склад и производственный отдел`,en:`Warehouse and production departments`},{uz:`Dizayn va sotuv bo'limi xodimlari`,ru:`Сотрудники отдела дизайна и отдела продаж`,en:`Design and sales department staff`},{uz:`Buxgalteriya va oshxona`,ru:`Бухгалтерия и столовая`,en:`Accounting and kitchen`},{uz:`Montaj va ombor`,ru:`Монтаж и склад`,en:`Assembly and warehouse`}],ans:1},
  {q:{uz:`"Tozalik bor joyda baraka bor" qoidasi nimani anglatadi?`,ru:`Что означает правило «Где чистота, там и благословение (барака)»?`,en:`What does the rule "Where there is cleanliness, there is blessing (baraka)" mean?`},opts:[{uz:`Faqat haftada bir marta tozalash kerak`,ru:`Убираться нужно только раз в неделю`,en:`Cleaning should only be done once a week`},{uz:`Ish joyida tozalikni doimiy saqlash shart`,ru:`На рабочем месте необходимо постоянно поддерживать чистоту`,en:`Cleanliness must be constantly maintained at the workplace`},{uz:`Faqat rahbar kelganda tozalash kerak`,ru:`Убираться нужно только к приходу руководителя`,en:`Cleaning is only necessary when the manager arrives`},{uz:`Tozalik muhim emas`,ru:`Чистота не имеет значения`,en:`Cleanliness does not matter`}],ans:1},
  {q:{uz:`Avtomashina nazorati nima uchun kerak?`,ru:`Для чего нужен контроль служебного автотранспорта?`,en:`Why is vehicle monitoring/control necessary?`},opts:[{uz:`Mashinani bezash uchun`,ru:`Для украшения машины`,en:`To decorate the car`},{uz:`Tartib va xavfsizlikni ta'minlash uchun`,ru:`Для обеспечения порядка и безопасности`,en:`To ensure order and safety`},{uz:`Faqat hujjat yig'ish uchun`,ru:`Только для сбора документов`,en:`Only to collect documents`},{uz:`Vaqtni yo'qotish uchun`,ru:`Для пустой траты времени`,en:`To waste time`}],ans:1},
  {q:{uz:`Alcana Group o'zini bozorda qanday kompaniya sifatida namoyon etadi?`,ru:`Как Alcana Group позиционирует себя на рынке?`,en:`How does Alcana Group position itself in the market?`},opts:[{uz:`Mijozlarga eng arzon xizmat ko'rsatuvchi reklama agentligi`,ru:`Рекламное агентство, предоставляющее клиентам самые дешевые услуги`,en:`An advertising agency offering the cheapest services to clients`},{uz:`G'oyalarni natijaga aylantiradigan va bizneslarga real qiymat beradigan jamoa`,ru:`Команда, которая превращает идеи в результаты и приносит реальную пользу бизнесу`,en:`A team that turns ideas into results and provides real value to businesses`},{uz:`Faqat tayyor andozalar (shablonlar) asosida ishlaydigan poligrafiya korxonasi`,ru:`Полиграфическое предприятие, работающее исключительно по готовым шаблонам`,en:`A printing company working solely on the basis of ready-made templates`},{uz:`Faqat yirik davlat buyurtmalari bilan ishlaydigan yopiq tashkilot`,ru:`Закрытая организация, работающая только с крупными государственными заказами`,en:`A closed organization working only with large government orders`}],ans:1},
  {q:{uz:`Kompaniyaning yaqin yillar ichidagi katta maqsadlaridan biri (Vision) qaysi javobda to'g'ri ko'rsatilgan?`,ru:`Какая из масштабных целей компании на ближайшие годы (Vision) указана верно?`,en:`Which answer correctly identifies one of the company's major goals for the coming years (Vision)?`},opts:[{uz:`O'zbekistondagi eng ko'p xodimga ega kompaniyaga aylanish`,ru:`Стать компанией с самым большим количеством сотрудников в Узбекистане`,en:`To become the company with the largest number of employees in Uzbekistan`},{uz:`Faqat onlayn reklama bozorini to'liq egallash`,ru:`Полностью завоевать только рынок онлайн-рекламы`,en:`To completely dominate only the online advertising market`},{uz:`Xalqaro miqyosda raqobatlashuvchi brend qurish va 7 qavatli shaxsiy binoga ega bo'lish`,ru:`Построение международно конкурентоспособного бренда и владение собственным 7-этажным зданием`,en:`Building an internationally competitive brand and owning a personal 7-story building`},{uz:`Barcha ishlab chiqarish jarayonlarini autsorsingga topshirish`,ru:`Передать все производственные процессы на аутсорсинг`,en:`Outsourcing all production processes`}],ans:2},
  {q:{uz:`Alcana Group kelajakda o'z jamoasi uchun qanday qulaylik yaratishni maqsad qilgan?`,ru:`Какое удобство для своей команды Alcana Group стремится создать в будущем?`,en:`What convenience does Alcana Group aim to create for its team in the future?`},opts:[{uz:`Haftada faqat 3 kun ishlash tizimiga o'tish`,ru:`Переход на 3-дневную рабочую неделю`,en:`Switching to a 3-day work week system`},{uz:`Uyda o'tirib ishlash (masofaviy) tizimini joriy etish`,ru:`Внедрение системы удаленной работы (из дома)`,en:`Introducing a remote work (work from home) system`},{uz:`3 mahal kompaniya hisobidan ovqat bilan ta'minlash`,ru:`Обеспечение 3-разовым питанием за счет компании`,en:`Providing 3 meals a day at the company's expense`},{uz:`Har yili xodimlarni chet elga bepul sayohatga yuborish`,ru:`Ежегодная отправка сотрудников в бесплатные поездки за границу`,en:`Sending employees on free trips abroad every year`}],ans:2},
  {q:{uz:`Kompaniyaning strategik rejasiga ko'ra, O'rta Osiyo va O'zbekiston bozorida qaysi o'rinni egallash maqsad qilingan?`,ru:`Какую позицию на рынке Центральной Азии и Узбекистана планируется занять согласно стратегическому плану компании?`,en:`According to the company's strategic plan, which position is aimed to be occupied in the Central Asian and Uzbekistan markets?`},opts:[{uz:`Eng ko'p daromad ko'radigan top-5 talikka kirish`,ru:`Войти в топ-5 самых прибыльных компаний`,en:`Entering the top 5 highest-earning companies`},{uz:`Eng kuchli 10 ta ichki va tashqi reklama agentliklaridan biriga aylanish`,ru:`Стать одним из 10 сильнейших агентств внутренней и наружной рекламы`,en:`To become one of the top 10 strongest indoor and outdoor advertising agencies`},{uz:`Faqat raqamli (digital) marketing bo'yicha 1-o'rinni egallash`,ru:`Занять 1-е место исключительно в сфере цифрового (digital) маркетинга`,en:`Taking 1st place solely in digital marketing`},{uz:`Bozorning kamida 80 foiz ulushini nazorat qilish`,ru:`Контролировать не менее 80 процентов доли рынка`,en:`Controlling at least 80 percent of the market share`}],ans:1},
  {q:{uz:`Alcana Group kelajakdagi strategik rejalariga ko'ra qaysi davlat bilan qo'shma korxona ochishni maqsad qilgan?`,ru:`С какой страной Alcana Group планирует открыть совместное предприятие согласно своим стратегическим планам?`,en:`According to its future strategic plans, with which country does Alcana Group aim to open a joint venture?`},opts:[{uz:`Turkiya davlati bilan hamkorlikda yangi startap loyihasini`,ru:`Новый стартап-проект в сотрудничестве с Турцией`,en:`A new startup project in cooperation with Turkey`},{uz:`BAA (Dubay) bozorida xalqaro filial ochishni`,ru:`Открытие международного филиала на рынке ОАЭ (Дубай)`,en:`Opening an international branch in the UAE (Dubai) market`},{uz:`Xitoy davlati bilan qo'shma korxona ochib ishlashni`,ru:`Открытие и управление совместным предприятием с Китаем`,en:`Opening and operating a joint venture with China`},{uz:`Rossiya kompaniyalari bilan reklama tarmoqlarini birlashtirishni`,ru:`Объединение рекламных сетей с российскими компаниями`,en:`Merging advertising networks with Russian companies`}],ans:2},
  {q:{uz:`Quyidagilardan qaysi biri Alcana Group kompaniyasining asosiy ustunlari (qadriyatlari) hisoblanadi?`,ru:`Что из перечисленного является основными столпами (ценностями) компании Alcana Group?`,en:`Which of the following are the core pillars (values) of Alcana Group?`},opts:[{uz:`Tezlik, raqobatchilarni yo'qotish, maxfiylik`,ru:`Скорость, устранение конкурентов, конфиденциальность`,en:`Speed, elimination of competitors, confidentiality`},{uz:`Halollik, adolat, mas'uliyat, natija va rivojlanish`,ru:`Честность, справедливость, ответственность, результат и развитие`,en:`Honesty, justice, responsibility, result, and development`},{uz:`Kreativlik, erkinlik, individual yondashuv`,ru:`Креативность, свобода, индивидуальный подход`,en:`Creativity, freedom, individual approach`},{uz:`Tajriba, moslashuvchanlik, mijozning har qanday talabini bajarish`,ru:`Опыт, гибкость, выполнение любых требований клиента`,en:`Experience, flexibility, fulfilling any client request`}],ans:1},
  {q:{uz:`Kompaniya qadriyatlariga ko'ra, quyidagi yo'nalishlarning qaysi biri bilan hamkorlik qilishga ruxsat etiladi?`,ru:`Согласно ценностям компании, с какими из следующих направлений разрешено сотрудничество?`,en:`According to the company's values, cooperation with which of the following sectors is permitted?`},opts:[{uz:`Lombardlar va tungi klublar`,ru:`Ломбарды и ночные клубы`,en:`Pawnshops and nightclubs`},{uz:`Alkogol va tamaki mahsulotlari ishlab chiqaruvchilar`,ru:`Производители алкогольной и табачной продукции`,en:`Alcohol and tobacco manufacturers`},{uz:`Qimor va unga oid bo'lgan tashkilotlar`,ru:`Азартные игры и связанные с ними организации`,en:`Gambling and related organizations`},{uz:`Sog'lom oziq-ovqat va umumiy ovqatlanish korxonalari`,ru:`Предприятия здорового питания и общественного питания`,en:`Healthy food and public catering enterprises`}],ans:3},
  {q:{uz:`Alcana Group'da buyurtmalar qabul qilishdagi moliyaviy cheklov qaysi javobda to'g'ri ko'rsatilgan?`,ru:`Какое финансовое ограничение при приеме заказов верно указано для Alcana Group?`,en:`Which financial restriction on accepting orders is correctly stated for Alcana Group?`},opts:[{uz:`Kichik byudjetli buyurtmalar qabul qilinmaydi`,ru:`Заказы с маленьким бюджетом не принимаются`,en:`Small budget orders are not accepted`},{uz:`Porali (otkat) buyurtmalar mutloq bajarilmaydi`,ru:`Заказы с откатами (взятками) абсолютно не выполняются`,en:`Orders involving kickbacks (bribes) are absolutely not executed`},{uz:`Faqat oldindan 100% to'lov qilganlar bilan ishlanadi`,ru:`Работа ведется только с теми, кто вносит 100% предоплату`,en:`Work is done only with those who make 100% prepayment`},{uz:`Naqd pul ko'rinishidagi buyurtmalar cheklangan`,ru:`Заказы в наличной форме ограничены`,en:`Orders in the form of cash are limited`}],ans:1},
  {q:{uz:`Kompaniyada muammolarga qanday yondashiladi va najot nimaligi ta'kidlanadi?`,ru:`Как в компании подходят к проблемам и в чем заключается спасение?`,en:`How are problems approached in the company, and what is emphasized as the solution/salvation?`},opts:[{uz:`Muammo – bu tizimning xatosi, najot tajribadadir`,ru:`Проблема — это ошибка системы, спасение — в опыте`,en:`A problem is a system error, salvation lies in experience`},{uz:`Muammo – bu bahona emas, balki imkoniyat; najot ilmdadir`,ru:`Проблема — это не оправдание, а возможность; спасение — в знаниях (науке)`,en:`A problem is not an excuse, but an opportunity; salvation lies in knowledge (science)`},{uz:`Muammo – bu mijozning aybi, najot tezkor qarorlardadir`,ru:`Проблема — это вина клиента, спасение — в быстрых решениях`,en:`A problem is the client's fault, salvation lies in quick decisions`},{uz:`Muammo – bu vaqtinchalik holat, najot sabrdadir`,ru:`Проблема — это временное явление, спасение — в терпении`,en:`A problem is a temporary situation, salvation lies in patience`}],ans:1},
  {q:{uz:`Alcana Group'da oddiy kunlardagi standart ish vaqti tartibi qanday belgilangan?`,ru:`Как установлен стандартный рабочий график в обычные дни в Alcana Group?`,en:`How is the standard working hours routine on regular days defined at Alcana Group?`},opts:[{uz:`Dushanbadan jumagacha 9:00 dan 17:00 gacha, shanba dam olish`,ru:`С понедельника по пятницу с 9:00 до 17:00, суббота — выходной`,en:`Monday to Friday from 9:00 to 17:00, Saturday is a day off`},{uz:`Dushanbadan jumagacha 8:00 dan 18:00 gacha, shanba uchrashuv`,ru:`С понедельника по пятницу с 8:00 до 18:00, суббота — встреча`,en:`Monday to Friday from 8:00 to 18:00, Saturday is a meeting day`},{uz:`Haftada 6 kun, har kuni 9:00 dan 18:00 gacha`,ru:`6 дней в неделю, каждый день с 9:00 до 18:00`,en:`6 days a week, every day from 9:00 to 18:00`},{uz:`Kundalik ish vaqti 9:00 dan 19:00 gacha, faqat shanba kuni alohida tartibda`,ru:`Ежедневное рабочее время с 9:00 до 19:00, только в субботу действует особый порядок`,en:`Daily working hours are from 9:00 to 19:00, with a special routine only on Saturdays`}],ans:3},
  {q:{uz:`Shanba kungi ish tartibining o'ziga xosligi nimada?`,ru:`В чем особенность субботнего графика работы?`,en:`What is the specific feature of the Saturday working routine?`},opts:[{uz:`Ish vaqti soat 10:00 da boshlanadi`,ru:`Рабочее время начинается в 10:00`,en:`Working hours start at 10:00 AM`},{uz:`Ertalab soat 8:00 da majlis (meeting) bor va ish 18:00 gacha davom etadi`,ru:`Утром в 8:00 проводится собрание (митинг), и работа продолжается до 18:00`,en:`There is a meeting at 8:00 AM and work continues until 18:00`},{uz:`Faqat tushlikkacha ishlanadi, undan keyin sport o'yinlari bo'ladi`,ru:`Работа ведется только до обеда, после чего проходят спортивные игры`,en:`Work is done only until lunch, followed by sports games`},{uz:`Shanba kuni faqat masofadan (online) hisobot topshiriladi`,ru:`В субботу отчеты сдаются только удаленно (онлайн)`,en:`On Saturdays, reports are submitted only remotely (online)`}],ans:1},
  {q:{uz:`Kompaniyada tushlik (lunch) vaqti qaysi soatlar oralig'ida belgilangan?`,ru:`В какой промежуток времени в компании установлен обеденный перерыв (lunch)?`,en:`Between which hours is the lunch break defined in the company?`},opts:[{uz:`12:00 dan 13:00 gacha`,ru:`С 12:00 до 13:00`,en:`From 12:00 to 13:00`},{uz:`13:00 dan 14:00 gacha`,ru:`С 13:00 до 14:00`,en:`From 13:00 to 14:00`},{uz:`12:30 dan 13:30 gacha`,ru:`С 12:30 до 13:30`,en:`From 12:30 to 13:30`},{uz:`Har bir bo'lim uchun alohida grafik asosida`,ru:`По отдельному графику для каждого отдела`,en:`Based on a separate schedule for each department`}],ans:1},
  {q:{uz:`Ishga kelishda punktuallik (aniqlik) darajasi qanday o'lchanadi?`,ru:`Как измеряется уровень пунктуальности при приходе на работу?`,en:`How is the degree of punctuality measured when arriving at work?`},opts:[{uz:`5 daqiqagacha kechikish normal holat hisoblanadi`,ru:`Опоздание до 5 минут считается нормальным явлением`,en:`A delay of up to 5 minutes is considered normal`},{uz:`15 daqiqadan keyin kechikish deb hisoblanadi`,ru:`Опозданием считается задержка более чем на 15 минут`,en:`It is considered a delay only after 15 minutes`},{uz:`Hatto 1 daqiqa kechikish ham qoidabuzarlik (kechikish) hisoblanadi`,ru:`Опозданием считается даже задержка на 1 минуту`,en:`Even a 1-minute delay is considered a violation (tardiness)`},{uz:`Faqat 9:30 dan keyin kelganlar qayd etiladi`,ru:`Фиксируются только те, кто пришел после 9:30`,en:`Only those who arrive after 9:30 AM are recorded`}],ans:2},
  {q:{uz:`Intizom qoidalarini buzgan xodimlarga nisbatan qanday chora ko'riladi?`,ru:`Какие меры принимаются к сотрудникам, нарушившим правила дисциплины?`,en:`What measures are taken against employees who violate disciplinary rules?`},opts:[{uz:`Maoshidan to'g'ridan-to'g'ri ushlab qolinadi (kompaniya hisobiga)`,ru:`Прямое удержание из зарплаты (в доход компании)`,en:`Direct deduction from the salary (to the company's account)`},{uz:`Yo'l qo'yilgan xatoga qarab 10 000 so'mdan 200 000 so'mgacha ehson (sadaqa) shaklida jazo qo'llaniladi`,ru:`В зависимости от допущенной ошибки налагается взыскание в размере от 10 000 до 200 000 сумов в виде пожертвования (садака)`,en:`Depending on the mistake made, a penalty from 10,000 to 200,000 UZS is applied in the form of a donation (charity)`},{uz:`O'sha kungi ish haqi to'liq bekor qilinadi`,ru:`Полностью аннулируется заработная плата за этот день`,en:`The salary for that day is completely canceled`},{uz:`Keyingi haftalik tushlikdan mahrum qilinadi`,ru:`Сотрудник лишается обедов на следующую неделю`,en:`The employee is deprived of next week's lunches`}],ans:1},
  {q:{uz:`Alcana Group'da "Bu mening ishim emas" degan yondashuvga munosabat qanday?`,ru:`Каково отношение к подходу «Это не моя работа» в Alcana Group?`,en:`What is the attitude towards the "This is not my job" approach at Alcana Group?`},opts:[{uz:`To'g'ri yondashuv, har kim faqat o'z shartnomasidagi ishni qilishi kerak`,ru:`Правильный подход, каждый должен делать только то, что указано в его договоре`,en:`Correct approach, everyone should only do the work stated in their contract`},{uz:`Bunday tushuncha jamoada yo'q; natija uchun javobgarlik har bir xodimning zimmasida`,ru:`Такого понятия в команде нет; ответственность за результат лежит на каждом сотруднике`,en:`There is no such concept in the team; responsibility for the result lies with every employee`},{uz:`Faqat rahbar ruxsat bergandagina boshqa ishga aralashish mumkin`,ru:`Вмешиваться в другую работу можно только с разрешения руководителя`,en:`It is possible to get involved in other work only with the leader's permission`},{uz:`Bu yondashuv faqat sinov muddatidagi xodimlarga tegishli`,ru:`Этот подход применим только к сотрудникам на испытательном сроке`,en:`This approach applies only to employees on probation period`}],ans:1},
  {q:{uz:`Kompaniyaga qanday xodimlar mos keladi?`,ru:`Какие сотрудники подходят компании?`,en:`What kind of employees are suitable for the company?`},opts:[{uz:`Faqat katta tajribaga ega, lekin o'zgarishni xohlamaydiganlar`,ru:`Только те, кто имеет большой опыт, но не желает меняться`,en:`Only those with extensive experience but unwilling to change`},{uz:`Buyruqni so'zsiz bajaradigan, shaxsiy fikriga ega bo'lmaganlar`,ru:`Те, кто беспрекословно выполняет приказы и не имеет личного мнения`,en:`Those who blindly follow orders and have no personal opinion`},{uz:`Rivojlanishni istaydigan, mas'uliyatdan qochmaydigan, qat'iyatli va halol insonlar`,ru:`Люди, которые хотят развиваться, не избегают ответственности, решительные и честные`,en:`People who want to develop, do not shirk responsibility, and are determined and honest`},{uz:`Faqat reklama sohasida oliy ma'lumoti bor mutaxassislar`,ru:`Только специалисты с высшим образованием в сфере рекламы`,en:`Only specialists with higher education in the advertising field`}],ans:2},
  {q:{uz:`Kompaniyaga qaysi toifadagi insonlar mutloq mos kelmaydi?`,ru:`Какая категория людей абсолютно не подходит компании?`,en:`Which category of people is absolutely not suitable for the company?`},opts:[{uz:`Sokin muhitda ishlashni afzal ko'radiganlar`,ru:`Те, кто предпочитает работать в спокойной обстановке`,en:`Those who prefer to work in a quiet environment`},{uz:`Bahona qidiradigan, dangasa, o'z ustida ishlamaydigan va intizomsizlar`,ru:`Те, кто ищет оправдания, ленивые, не работающие над собой и недисциплинированные`,en:`Those who look for excuses, are lazy, do not work on themselves, and are undisciplined`},{uz:`Jamoaviy sport o'yinlarida qatnashishni xohlamaydiganlar`,ru:`Те, кто не хочет участвовать в командных спортивных играх`,en:`Those who do not want to participate in team sports games`},{uz:`Kompyuter dasturlarini mukammal bilmaydiganlar`,ru:`Те, кто не знает компьютерные программы в совершенстве`,en:`Those who do not know computer programs perfectly`}],ans:1},
  {q:{uz:`Kompaniya o'z yo'riqnoma va instrumentlariga to'liq amal qilib, 3-6 oy ichida o'sish ko'rmagan xodimga qanday kafolat beradi?`,ru:`Какую гарантию дает компания сотруднику, который полностью следовал инструкциям и инструментам, но не увидел роста в течение 3-6 месяцев?`,en:`What guarantee does the company provide to an employee who fully followed instructions and tools but saw no growth within 3-6 months?`},opts:[{uz:`Qo'shimcha 2 oylik bepul trening tavsiya qiladi`,ru:`Рекомендует дополнительные 2 месяца бесплатных тренингов`,en:`Recommends an additional 2 months of free training`},{uz:`Boshqa bo'limga o'tkazadi`,ru:`Переводит в другой отдел`,en:`Transfers them to another department`},{uz:`Kompensatsiya sifatida 10 000 000 so'm beradi`,ru:`Выплачивает 10 000 000 сумов в качестве компенсации`,en:`Provides 10,000,000 UZS as compensation`},{uz:`Sinov muddatini yana uzaytiradi`,ru:`Снова продлевает испытательный срок`,en:`Extends the probation period again`}],ans:2},
  {q:{uz:`Oy davomida eng yaxshi xodim bo'lib madaniy hordiq yutgan xodimga nima berilishi mumkin?`,ru:`Что может получить сотрудник, признанный лучшим работником месяца и выигравший культурный отдых?`,en:`What can an employee receive for being the best employee of the month and winning a cultural recreation reward?`},opts:[{uz:`Chet elga sayohat yo'llanmasi`,ru:`Путевку для путешествия за границу`,en:`A travel voucher abroad`},{uz:`Kinoteatrlarga chipta, restoranga oilaviy yoki jamoaviy vaucherlar`,ru:`Билеты в кинотеатры, семейные или коллективные ваучеры в ресторан`,en:`Movie tickets, family or team vouchers for restaurants`},{uz:`Qo'shimcha 3 kunlik haq to'lanadigan ta'tillar`,ru:`Дополнительные 3 дня оплачиваемого отпуска`,en:`An additional 3 days of paid leave`},{uz:`Qimmatbaho maishiy texnika vositalari`,ru:`Дорогостоящую бытовую технику`,en:`Expensive household appliances`}],ans:1},
  {q:{uz:`Dizaynerlik (Designing) yo'nalishida intizomli xodim uchun "Deadline" (muddat) qanday ahamiyatga ega?`,ru:`Какое значение имеет «Дедлайн» (срок) для дисциплинированного сотрудника в направлении дизайна?`,en:`What significance does a "Deadline" hold for a disciplined employee in the Design department?`},opts:[{uz:`Muddat nisbiy tushuncha, asosiysi g'oyaning mukammalligi`,ru:`Срок — понятие относительное, главное — совершенство идеи`,en:`Deadline is a relative concept, the main thing is the perfection of the idea`},{uz:`Ishlab chiqarish bo'limi va yetkazib berish zanjiri kechikmasligi uchun qat'iy amal qilinishi shart bo'lgan qoida`,ru:`Правило, обязательное к строгому соблюдению, чтобы избежать задержек в производственном отделе и цепочке поставок`,en:`A rule that must be strictly followed to prevent delays in the production department and supply chain`},{uz:`Faqat mijoz qo'shimcha haq to'lagandagina muddatga qaraladi`,ru:`Срок учитывается только тогда, когда клиент доплачивает`,en:`Deadlines are only considered if the client pays extra`},{uz:`Muddatni faqat koll-markaz xodimi nazorat qiladi`,ru:`Срок контролируется только сотрудником колл-центра`,en:`The deadline is controlled only by the call center employee`}],ans:1},
  {q:{uz:`Dizayner tayyorlagan faylini ishlab chiqarishga (pechat/kesishga) topshirishdan oldin nima qilishi shart?`,ru:`Что обязан сделать дизайнер перед отправкой подготовленного файла на производство (печать/резку)?`,en:`What must a designer do before submitting their prepared file to production (printing/cutting)?`},opts:[{uz:`Faylni to'g'ridan-to'g'ri ishlab chiqarish kompyuteriga tashlab ketishi kerak`,ru:`Просто оставить файл напрямую на производственном компьютере`,en:`Leave the file directly on the production computer`},{uz:`Mijozdan faylni qayta tekshirib berishini so'rashi lozim`,ru:`Попросить клиента перепроверить файл`,en:`Ask the client to re-check the file`},{uz:`Faylning barcha texnik parametrlarini shaxsan o'zi diqqat bilan tekshirishi shart`,ru:`Лично и внимательно проверить все технические параметры файла`,en:`Personally and carefully check all technical parameters of the file`},{uz:`Faylni koll-markaz operatori orqali yuborishi kerak`,ru:`Отправить файл через оператора колл-центра`,en:`Send the file through the call center operator`}],ans:2},
  {q:{uz:`Ishlab chiqarish bo'limi (Factory) xodimlari bilbord va boshqa konstruksiyalarni yig'ishda tozalikni qachon ta'minlashlari kerak?`,ru:`Когда сотрудники производственного отдела (Factory) должны обеспечивать чистоту при сборке билбордов и других конструкций?`,en:`When must production department (Factory) employees ensure cleanliness when assembling billboards and other structures?`},opts:[{uz:`Faqat smena almashayotgan vaqtda`,ru:`Только во время пересменки`,en:`Only during shift changes`},{uz:`Haftada bir marta, shanba kungi yig'ilishdan keyin`,ru:`Раз в неделю, после субботнего собрания`,en:`Once a week, after the Saturday meeting`},{uz:`Ish jarayonida va ish yakunlangandan so'ng darhol`,ru:`Во время рабочего процесса и сразу после завершения работы`,en:`During the work process and immediately upon completion of the work`},{uz:`Faqat ishlab chiqarish boshlig'i buyruq berganda`,ru:`Только по приказу начальника производства`,en:`Only when the production manager gives an order`}],ans:2},
  {q:{uz:`Ustaxonada ish qurollari va kesilgan materiallar (banner, alkofon qoldiqlari) qanday tartibga solinadi?`,ru:`Как упорядочиваются рабочие инструменты и нарезанные материалы (остатки баннеров, алкопона) в мастерской?`,en:`How are work tools and cut materials (banner, alucobond scraps) organized in the workshop?`},opts:[{uz:`Qoldiqlar stol ostiga yig'iladi, asboblar ish joyida qoladi`,ru:`Остатки собираются под столом, инструменты остаются на рабочем месте`,en:`Scraps are gathered under the table, tools remain at the workplace`},{uz:`Asboblar maxsus belgilangan joyiga toza qo'yiladi, qoldiqlar esa saralanib chiqindiga tashlanadi`,ru:`Инструменты складываются чистыми на специально отведенные места, а остатки сортируются и выбрасываются в мусор`,en:`Tools are placed cleanly in their designated areas, and scraps are sorted and thrown into the trash`},{uz:`Hamma narsa keyingi smena xodimi tozalashi uchun qoldiriladi`,ru:`Все оставляется для уборки сотруднику следующей смены`,en:`Everything is left for the next shift worker to clean up`},{uz:`Material qoldiqlari ustaxona tashqarisiga shunchaki chiqarib tashlanadi`,ru:`Остатки материалов просто выбрасываются за пределы мастерской`,en:`Material scraps are simply thrown outside the workshop`}],ans:1},
  {q:{uz:`Koll-markaz (Call Center) xodimining asosiy majburiyatlaridan biri bo'lgan "Mijozlarga yondashuv" qoidasi qaysi javobda to'g'ri aks etgan?`,ru:`В каком ответе верно отражено правило «Подход к клиентам», являющееся одной из основных обязанностей сотрудника колл-центра?`,en:`Which answer correctly reflects the "Approach to Clients" rule, which is one of the primary duties of a Call Center employee?`},opts:[{uz:`Mijozga faqat buyurtma miqdoriga qarab muomala qilish`,ru:`Относиться к клиенту только в зависимости от объема заказа`,en:`Treating the client based only on the order volume`},{uz:`Mijozni sherik sifatida ko'rib, doimo xushmuomala va professional bo'lish`,ru:`Воспринимать клиента как партнера, всегда быть вежливым и профессиональным`,en:`Viewing the client as a partner, always being polite and professional`},{uz:`Mijozning har qanday taklifiga texnik imkoniyatlarni tekshirmasdan rozi bo'lish`,ru:`Соглашаться на любое предложение клиента без проверки технических возможностей`,en:`Agreeing to any client proposal without checking technical capabilities`},{uz:`Muammoli mijozlarni darhol ishlab chiqarish xodimlari va mutaxassislariga yo'naltirish`,ru:`Немедленно направлять проблемных клиентов к производственному персоналу`,en:`Immediately redirecting difficult clients to production staff`}],ans:1},
  {q:{uz:`Koll-markaz xodimi o'z smenasi yakunlanganda yangi buyurtmalarni qanday topshirishi lozim?`,ru:`Как сотрудник колл-центра должен передавать новые заказы по окончании своей смены?`,en:`How should a Call Center employee hand over new orders at the end of their shift?`},opts:[{uz:`Barcha ma'lumotlarni kompyuter xotirasida qoldirib ketishi kifoya`,ru:`Достаточно просто оставить всю информацию в памяти компьютера`,en:`It is enough to just leave all information in the computer's memory`},{uz:`Tizimga kiritilgan buyurtmalar va hal etilmagan masalalarni keyingi smenaga intizom bilan qayd etib topshiradi`,ru:`Дисциплинированно фиксирует и передает следующей смене введенные в систему заказы и нерешенные вопросы`,en:`Systematically records and hands over orders entered into the system and unresolved issues to the next shift`},{uz:`Faqat yirik buyurtmalar haqida rahbarni ogohlantirib ketadi`,ru:`Предупреждает руководителя только о крупных заказах перед уходом`,en:`Only warns the manager about large orders before leaving`},{uz:`Mijozlarga ertaga qayta qo'ng'iroq qilishni aytadi`,ru:`Говорит клиентам перезвонить завтра`,en:`Tells clients to call back tomorrow`}],ans:1},
  {q:{uz:`Alcana Group o'z faoliyatida samaradorlikni oshirish uchun qaysi texnologiyani barcha yo'nalishlarga tatbiq etib boradi?`,ru:`Какую технологию Alcana Group внедряет во все направления для повышения эффективности своей деятельности?`,en:`Which technology does Alcana Group implement across all departments to increase efficiency in its operations?`},opts:[{uz:`Faqat bulutli (Cloud) saqlash tizimlarini`,ru:`Только облачные (Cloud) системы хранения данных`,en:`Only cloud storage systems`},{uz:`Sun'iy intellekt (AI) texnologiyalarini`,ru:`Технологии искусственного интеллекта (AI)`,en:`Artificial Intelligence (AI) technologies`},{uz:`Faqat xorijiy xabarchilar (messenger) tizimini`,ru:`Только системы зарубежных мессенджеров`,en:`Only foreign messenger systems`},{uz:`Avtomatlashtirilgan telefon stansiyalarini`,ru:`Автоматические телефонные станции`,en:`Automated telephone stations`}],ans:1},
  {q:{uz:`Kompaniya boshqaruv va ish jarayonlarida jami nechta natijaviy instrumentlardan foydalanadi?`,ru:`Сколько всего результативных инструментов использует компания в управлении и рабочих процессах?`,en:`How many result-driven tools in total does the company use in management and work processes?`},opts:[{uz:`20 dan ortiq`,ru:`Более 20`,en:`More than 20`},{uz:`40 ga yaqin`,ru:`Около 40`,en:`Close to 40`},{uz:`60 dan ortiq`,ru:`Более 60`,en:`More than 60`},{uz:`Maxsus cheklov yo'q`,ru:`Особых ограничений нет`,en:`No specific limit`}],ans:2},
  {q:{uz:`Alcana Group dunyodagi yangiliklar va innovatsiyalarni kuzatish hamda kompaniyaga tatbiq etish uchun qanday chora ko'radi?`,ru:`Какие меры принимает Alcana Group для отслеживания мировых новинок и инноваций и их внедрения в компанию?`,en:`What measures does Alcana Group take to monitor and implement global news and innovations into the company?`},opts:[{uz:`Mahalliy bozor mutaxassislarining hisobotlarini sotib oladi`,ru:`Покупает отчеты специалистов местного рынка`,en:`Buys reports from local market specialists`},{uz:`Chet elda bo'ladigan jahon ko'rgazmalarida qatnashib boradi`,ru:`Участвует во всемирных выставках, проходящих за рубежом`,en:`Participates in international exhibitions held abroad`},{uz:`Faqat internetdagi ochiq maqolalar bilan cheklanadi`,ru:`Ограничивается только открытыми статьями в интернете`,en:`Confines itself only to open articles on the internet`},{uz:`Raqobatchilarning ish uslubini nusxalaydi`,ru:`Копирует стиль работы конкурентов`,en:`Copies the working style of competitors`}],ans:1},
  {q:{uz:`Kompaniyada xodimlarning nutqini o'stirish va motivatsiyasini oshirish uchun qanday imkoniyat mavjud?`,ru:`Какая возможность существует в компании для развития речи сотрудников и повышения их мотивации?`,en:`What opportunity exists in the company to develop employees' speech and increase their motivation?`},opts:[{uz:`Faqat mustaqil kitob o'qish vaqti beriladi`,ru:`Предоставляется время только для самостоятельного чтения книг`,en:`Only time for independent book reading is given`},{uz:`Har haftalik motivatsion yig'ilishlarda qatnashish imkoni taqdim etiladi`,ru:`Предоставляется возможность участия в еженедельных мотивационных собраниях`,en:`Opportunity to participate in weekly motivational meetings is provided`},{uz:`Maxsus pullik notiqlik kurslariga yo'llanma beriladi`,ru:`Выдается направление на специальные платные курсы ораторского мастерства`,en:`Referral to special paid public speaking courses is provided`},{uz:`Faqat koll-markaz xodimlari uchun maxsus darslar tashkil etiladi`,ru:`Специальные занятия организуются только для сотрудников колл-центра`,en:`Special classes are organized only for call center employees`}],ans:1},
  {q:{uz:`Manifestda aytilganidek, "yaxshi" degani Alcana Group uchun nima?`,ru:`Что означает слово «хорошо» для Alcana Group, как сказано в Манифесте?`,en:`As stated in the Manifest, what does "good" mean for Alcana Group?`},opts:[{uz:`Chiroyli va kreativ ko'ringan har qanday g'oya`,ru:`Любая идея, которая выглядит красиво и креативно`,en:`Any idea that looks beautiful and creative`},{uz:`Mijozga yoqqan va uzoq muddat muhokama qilingan loyiha`,ru:`Проект, который понравился клиенту и долго обсуждался`,en:`A project that the client liked and was discussed for a long time`},{uz:`Aniq foyda va natija bergan ish hamda mahsulot sifati`,ru:`Работа, принесшая конкретную пользу и результат, а также качество продукции`,en:`Work and product quality that yields concrete profit and results`},{uz:`Tez fursatda va kam xarajat bilan bitkazilgan buyurtma`,ru:`Заказ, выполненный в кратчайшие сроки и с минимальными затратами`,en:`An order completed quickly and at a low cost`}],ans:2},
];

// ─── OCEAN AUDIO ──────────────────────────────────────────
function mkOcean(ctx){
  const master=ctx.createGain();master.gain.value=0.42;master.connect(ctx.destination);
  const stops=[];
  function layer(lpF,gV,lfoR,lfoD,hpF=30,pan=0){
    const sr=ctx.sampleRate,len=sr*12,buf=ctx.createBuffer(2,len,sr);
    for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.sin(i/(sr/(lfoR*8+0.1)))*0.4;}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;src.playbackRate.value=0.9+Math.random()*0.2;
    const hp=ctx.createBiquadFilter();hp.type="highpass";hp.frequency.value=hpF;
    const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=lpF;lp.Q.value=0.3;
    const g=ctx.createGain();g.gain.value=gV;
    const lfo=ctx.createOscillator();lfo.type="sine";lfo.frequency.value=lfoR;
    const lg=ctx.createGain();lg.gain.value=lfoD;
    const pn=ctx.createStereoPanner?ctx.createStereoPanner():null;
    if(pn){pn.pan.value=pan;lfo.connect(lg);lg.connect(g.gain);src.connect(hp);hp.connect(lp);lp.connect(g);g.connect(pn);pn.connect(master);}
    else{lfo.connect(lg);lg.connect(g.gain);src.connect(hp);hp.connect(lp);lp.connect(g);g.connect(master);}
    src.start();lfo.start();stops.push(()=>{try{src.stop();lfo.stop();}catch{}});
  }
  layer(320,0.36,0.055,0.16,20,-0.3);
  layer(200,0.40,0.038,0.20,15,0.2);
  layer(480,0.18,0.12,0.08,40,-0.5);
  layer(160,0.32,0.028,0.18,10,0.4);
  layer(650,0.08,0.22,0.04,60,0);
  return()=>{stops.forEach(s=>s());try{master.disconnect();}catch{}};
}

// ─── SUPABASE / STORAGE ───────────────────────────────────
async function sbOp(method,body,params=""){
  try{
    const r=await fetch(`${SB_URL}/rest/v1/assessment_results${params}`,{
      method,
      headers:{apikey:SB_KEY!,Authorization:`Bearer ${SB_KEY}`,"Content-Type":"application/json",Prefer:method==="POST"?"return=representation":""},
      body:body?JSON.stringify(body):undefined,
    });
    if(!r.ok){const errText=await r.text().catch(()=>"");console.error("sbOp failed:",r.status,errText);throw new Error("sbOp failed");}
    return method==="GET"?r.json():true;
  }catch(e){console.error("sbOp error:",e);return null;}
}
const getLocal=()=>{try{return JSON.parse(localStorage.getItem(LK)||"[]");}catch{return[];}};
const addLocal=r=>{const a=getLocal();a.unshift(r);localStorage.setItem(LK,JSON.stringify(a));};

// ─── ISOLATED NAME FORM ───────────────────────────────────
const NameForm=memo(({t,onStart})=>{
  const[fn,setFn]=useState("");const[ln,setLn]=useState("");const[err,setErr]=useState("");
  const go=useCallback(()=>{if(!fn.trim()||!ln.trim()){setErr(t.err);return;}onStart(fn.trim(),ln.trim());},[fn,ln,t.err,onStart]);
  return(
    <div className="card card-p" style={{marginTop:24}}>
      <p style={{fontSize:13,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",marginBottom:16}}>{t.info}</p>
      <div style={{display:"flex",gap:12,marginBottom:err?0:4,flexWrap:"wrap"}}>
        {[[t.fnL,t.fnP,fn,setFn],[t.lnL,t.lnP,ln,setLn]].map(([lb,ph,v,sv])=>(
          <div key={lb} style={{flex:1,minWidth:140}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",marginBottom:6,letterSpacing:".03em"}}>{lb.toUpperCase()}</label>
            <input type="text" className={`inp${err&&!v.trim()?" inp-err":""}`} value={v} placeholder={ph}
              onChange={e=>{sv(e.target.value);if(err)setErr("");}}
              onKeyDown={e=>e.key==="Enter"&&go()}
              style={{border:`1.5px solid ${err&&!v.trim()?"#ef4444":"#e5e7eb"}`}}/>
          </div>
        ))}
      </div>
      {err&&<div style={{marginTop:10,padding:"10px 14px",background:"#fee2e2",border:"1px solid rgba(239,68,68,.2)",borderRadius:8,fontSize:13.5,color:"#991b1b"}}>⚠️ {err}</div>}
      <button className="btn btn-p btn-w" style={{marginTop:16}} onClick={go}>{t.start}</button>
      <p style={{textAlign:"center",color:"#9ca3af",fontSize:12.5,marginTop:12}}>{t.hint}</p>
    </div>
  );
});

// ─── MAIN APP ────────────────────────────────────────────
export default function App(){
  // Always start with "uz" on first render to keep server and client HTML identical (avoids hydration mismatch).
  // The real preference is read from localStorage in a useEffect below.
  const[lang,setLang]=useState("uz");
  const[page,setPage]=useState("home");
  const[cand,setCand]=useState({name:"",surname:""});
  const[answers,setAnswers]=useState({});
  const[cur,setCur]=useState(0);
  const[score,setScore]=useState(null);
  const[attempt,setAttempt]=useState(1);
  const[ap,setAp]=useState("");const[ae,setAe]=useState("");
  const[results,setResults]=useState([]);
  const[filt,setFilt]=useState("all");const[srch,setSrch]=useState("");
  const[music,setMusic]=useState(false);
  const[sk,setSk]=useState(0);const[sd,setSd]=useState(1);
  const[toast,setToast]=useState("");const[tv,setTv]=useState(false);
  const[sbSt,setSbSt]=useState("local");
  const[langOpen,setLangOpen]=useState(false);
  const[catS,setCatS]=useState({});
  // Picked test section. Can be a hardcoded id ("alcana" | "amocrm") or a DbSection from admin.
  const[selectedSection,setSelectedSection]=useState<"alcana"|"amocrm"|"umumiy"|DbSection|null>(null);
  const[dbSections,setDbSections]=useState<DbSection[]>([]);
  const[adminTab,setAdminTab]=useState<"results"|"questions">("results");
  const[editingSection,setEditingSection]=useState<DbSection|"new"|null>(null);
  const[managingSectionId,setManagingSectionId]=useState<string|null>(null);
  const[editingQuestion,setEditingQuestion]=useState<DbQuestion|"new"|null>(null);
  const[adminRefresh,setAdminRefresh]=useState(0);
  const[mistakesRow,setMistakesRow]=useState<any|null>(null);
  const actx=useRef(null);const stopO=useRef(null);

  // After hydration, restore the user's saved language from localStorage.
  useEffect(()=>{if(typeof window!=="undefined"){const saved=localStorage.getItem("al_lang");if(saved&&saved!==lang)setLang(saved);}},[]);
  useEffect(()=>{if(typeof window!=="undefined")localStorage.setItem("al_lang",lang);},[lang]);
  useEffect(()=>{listSectionsWithQuestions().then(setDbSections).catch(e=>console.error("dbSections:",e));},[adminRefresh]);
  useEffect(()=>()=>{if(stopO.current)stopO.current();if(actx.current)actx.current.close();},[]);
  useEffect(()=>{const h=()=>setLangOpen(false);if(langOpen)document.addEventListener("click",h);return()=>document.removeEventListener("click",h);},[langOpen]);

  const toggleMusic=useCallback(()=>{
    if(music){if(stopO.current)stopO.current();if(actx.current){actx.current.close();actx.current=null;}setMusic(false);}
    else{const c=new(window.AudioContext||window.webkitAudioContext)();actx.current=c;stopO.current=mkOcean(c);setMusic(true);}
  },[music]);

  const showToast=msg=>{setToast(msg);setTv(true);setTimeout(()=>setTv(false),1600);};
  const nav=(fn,dir=1)=>{setSd(dir);setSk(k=>k+1);fn();};

  const startTest=useCallback((name,surname)=>{setCand({name,surname});setAnswers({});setCur(0);setScore(null);nav(()=>setPage("test"));},[]);
  const selAns=oi=>{setAnswers(p=>({...p,[cur]:oi}));showToast(T[lang].mot[Math.floor(Math.random()*T[lang].mot.length)]);};
  const clrAns=()=>setAnswers(p=>{const n={...p};delete n[cur];return n;});
  const goQ=dir=>nav(()=>setCur(c=>c+dir),dir);

  const submitTest=async()=>{
    // Read from the currently active section (DB or hardcoded). qs is already derived above
    // for the render, but we re-derive here because closures can drift mid-quiz.
    const curDb = (selectedSection && typeof selectedSection==="object") ? selectedSection : null;
    const curQs:any[] = curDb
      ? (curDb.questions||[]).map(dq=>({ans:dq.correct_index}))
      : selectedSection==="alcana" ? QS_ALCANA
      : selectedSection==="umumiy" ? [...QS_UMUMIY, ...QS_ALCANA]
      : selectedSection==="amocrm" ? QS_AMOCRM
      : (QS[lang] || QS.uz || []);
    let s=0;const ck=["company","values","hr","conduct","innovation"];const cs:any={};ck.forEach(k=>cs[k]=0);
    curQs.forEach((q:any,i:number)=>{if(answers[i]===q.ans){s++;cs[ck[Math.min(Math.floor(i/6),4)]]++;}});
    setScore(s);setCatS(cs);
    const pT = curDb ? curDb.pass_threshold
             : selectedSection==="alcana" ? 43
             : selectedSection==="umumiy" ? 86
             : selectedSection==="amocrm" ? 26
             : 27;
    const rT = curDb ? curDb.retry_threshold
             : selectedSection==="alcana" ? 35
             : selectedSection==="umumiy" ? 70
             : selectedSection==="amocrm" ? 21
             : 20;
    const sectionKey:string = curDb ? `db:${curDb.id}`
             : selectedSection==="alcana" ? "alcana"
             : selectedSection==="umumiy" ? "umumiy"
             : selectedSection==="amocrm" ? "amocrm"
             : "legacy";
    const status = s>=pT ? "passed" : (s>=rT && attempt===1 ? "retry" : "failed");
    // assessment_results schema: name, surname, score, attempt, status, meta (jsonb).
    // Everything else goes into meta.
    const rec:any = {
      name: cand.name,
      surname: cand.surname,
      score: s,
      attempt,
      status,
      meta: {
        lang,
        cats: cs,
        section_id: curDb?.id || null,
        section_key: sectionKey,
        section_label: curDb ? curDb.title_uz
                              : selectedSection==="amocrm" ? "amoCRM bo'limi"
                              : selectedSection==="umumiy" ? "Umumiy test"
                              : "Alcana Jamoasi",
        total: curQs.length,
        pass_threshold: pT,
        retry_threshold: rT,
        // Per-question record for the admin mistakes view:
        // map of {questionIndex: pickedOptionIndex}; -1 means unanswered.
        answers: Object.fromEntries(curQs.map((_,i)=>[i, answers[i]??-1])),
        // Snapshot of correct answer indices in case section content is later edited.
        correct: curQs.map((qq:any)=>qq.ans),
      },
    };
    if(status!=="retry"){addLocal({...rec,date:new Date().toLocaleString()});const ok=await sbOp("POST",rec);setSbSt(ok?"cloud":"local");}
    nav(()=>setPage("result"));
  };

  const retryTest=()=>{setAttempt(2);setAnswers({});setCur(0);setScore(null);nav(()=>setPage("test"));};
  const goHome=useCallback(()=>{if(stopO.current)stopO.current();if(actx.current){actx.current.close();actx.current=null;}setMusic(false);nav(()=>{setPage("home");setCand({name:"",surname:""});setAttempt(1);setAnswers({});setScore(null);setSelectedSection(null);},-1);},[]);

  const loginAdmin=async()=>{
    if(ap!==ADMIN_PASS){setAe(t.adm.wrong);return;}setAe("");
    const sb=await sbOp("GET",null,"?order=created_at.desc");
    if(sb){setResults(sb);setSbSt("cloud");}else{setResults(getLocal());setSbSt("local");}
    nav(()=>setPage("admin"));setAp("");
  };

  const t=T[lang];
  // Translation helper: picks ru/en/uz-cyrl variant; falls back to uz; uz-cyrl auto-derives.
  const L=(uz:string,ru?:string,en?:string)=>
    lang==="ru"&&ru?ru
    :lang==="en"&&en?en
    :lang==="uz-cyrl"?toCyrl(uz)
    :uz;
  // Pick the language variant from a multilingual question record.
  const pickMl=(ml:any):string=>!ml||typeof ml==="string"?ml:lang==="ru"?ml.ru:lang==="en"?ml.en:lang==="uz-cyrl"?toCyrl(ml.uz):ml.uz;
  const mapMlQs=(arr:any[]):any[]=>arr.map((it:any)=>({q:pickMl(it.q),opts:it.opts.map(pickMl),ans:it.ans}));
  // Derive the active question list + thresholds from selectedSection.
  const dbSec = (selectedSection && typeof selectedSection==="object") ? selectedSection : null;
  const qs:any[] = dbSec
    ? (dbSec.questions||[]).map(dq=>({
        q: lang==="ru"?dq.text_ru:lang==="en"?dq.text_en:lang==="uz-cyrl"?toCyrl(dq.text_uz):dq.text_uz,
        opts: (dq.options||[]).map(o=>lang==="ru"?o.text_ru:lang==="en"?o.text_en:lang==="uz-cyrl"?toCyrl(o.text_uz):o.text_uz),
        ans: dq.correct_index,
      }))
    : selectedSection==="alcana" ? mapMlQs(QS_ALCANA)
    : selectedSection==="umumiy" ? mapMlQs([...QS_UMUMIY, ...QS_ALCANA])
    : selectedSection==="amocrm" ? mapMlQs(QS_AMOCRM)
    : (QS[lang] || QS.uz || []); // legacy fallback (only used if nothing picked yet); guard against missing lang keys (uz-cyrl)
  const q=qs[cur];
  const totalQ = qs.length || 1;
  const passT = dbSec ? dbSec.pass_threshold
              : selectedSection==="alcana" ? 43
              : selectedSection==="umumiy" ? 86
              : selectedSection==="amocrm" ? 26
              : 27;
  const retryT = dbSec ? dbSec.retry_threshold
               : selectedSection==="alcana" ? 35
               : selectedSection==="umumiy" ? 70
               : selectedSection==="amocrm" ? 21
               : 20;
  const sectionTitle = dbSec
    ? (lang==="ru"?dbSec.title_ru:lang==="en"?dbSec.title_en:lang==="uz-cyrl"?toCyrl(dbSec.title_uz):dbSec.title_uz)
    : selectedSection==="amocrm" ? L("amoCRM bo'limi","Раздел amoCRM","amoCRM section")
    : selectedSection==="umumiy" ? L("Umumiy test","Общий тест","General test")
    : L("Alcana Jamoasi","Команда Alcana","Alcana Team");
  const answered=Object.keys(answers).length;
  const fRes=results.filter(r=>(filt==="all"||r.status===filt)&&(!srch||`${r.name} ${r.surname}`.toLowerCase().includes(srch.toLowerCase())));
  const cnt={all:results.length,passed:results.filter(r=>r.status==="passed").length,retry:results.filter(r=>r.status==="retry").length,failed:results.filter(r=>r.status==="failed").length};
  const slideClass=sd>0?"sr":"sl";

  const exportCSV=()=>{const rows=fRes.map((r,i)=>[i+1,`${r.name} ${r.surname}`,r.score,Math.round((r.score/30)*100),r.attempt,r.status,r.created_at?new Date(r.created_at).toLocaleDateString():r.date||""].join(","));const csv=[t.adm.hdrs.join(","),...rows].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="alcana_results.csv";a.click();};

  // ── HEADER ──
  const Header=({sub})=>(
    <header style={{background:"linear-gradient(135deg,#0f2d1a 0%,#16a34a 60%,#15803d 100%)",padding:"0 24px",height:68,display:"flex",alignItems:"center",gap:14,boxShadow:"0 1px 0 rgba(0,0,0,.15),0 4px 16px rgba(0,0,0,.12)",position:"sticky",top:0,zIndex:100}}>
      <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,.15)",border:"1.5px solid rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width="26" height="26" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="rgba(255,255,255,.9)"/><text x="50" y="66" textAnchor="middle" fill="#15803d" fontSize="36" fontWeight="900" fontFamily="Inter,sans-serif">A</text></svg>
      </div>
      <div style={{flex:1}}>
        <div style={{color:"#fff",fontWeight:800,fontSize:16,letterSpacing:"-.02em",lineHeight:1.2}}>ALCANA <span style={{fontWeight:400,opacity:.8}}>print</span></div>
        {sub&&<div style={{color:"rgba(255,255,255,.65)",fontSize:11.5,marginTop:1}}>{sub}</div>}
      </div>
      {/* Lang switcher */}
      <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button className="btn btn-ghost" onClick={()=>setLangOpen(o=>!o)} style={{fontSize:12.5}}>{t.lang} ▾</button>
        {langOpen&&(
          <div className="lang-dd">
            {Object.keys(T).map(l=>(
              <div key={l} className={`lang-item${l===lang?" active":""}`} onClick={()=>{setLang(l);setLangOpen(false);}}>{T[l].lang}</div>
            ))}
          </div>
        )}
      </div>
      <button className="btn btn-ghost" onClick={toggleMusic} style={{fontSize:12.5}}>{music?t.h.mus:t.h.musOff}</button>
      {page!=="admin"&&page!=="login"&&<button className="btn btn-ghost" style={{fontSize:12.5}} onClick={()=>nav(()=>setPage("login"))}>{t.h.admin}</button>}
      {(page==="admin"||page==="login")&&<button className="btn btn-ghost" style={{fontSize:12.5}} onClick={goHome}>← {t.h.exit}</button>}
    </header>
  );

  // ─────────────────────────────────────────
  // HOME PAGE
  // ─────────────────────────────────────────
  if(page==="home") return(
    <div style={{minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:CSS}} />
      <Header/>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-g1"/><div className="hero-g2"/><div className="hero-grid"/>
        {/* Floating particles */}
        {[...Array(10)].map((_,i)=>(
          <div key={i} style={{position:"absolute",width:i%2?5:4,height:i%2?5:4,borderRadius:"50%",background:"rgba(255,255,255,.25)",left:`${8+i*9}%`,bottom:0,animation:`drift ${10+i*2}s linear infinite`,animationDelay:`${i*1.2}s`}}/>
        ))}
        <div style={{position:"relative",zIndex:1}}>
          {/* Badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:20,padding:"6px 16px",marginBottom:20,backdropFilter:"blur(8px)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block",boxShadow:"0 0 8px #4ade80"}}/>
            <span style={{color:"rgba(255,255,255,.9)",fontSize:12.5,fontWeight:600,letterSpacing:".03em"}}>{t.home.badge}</span>
          </div>
          {/* Logo icon */}
          <div style={{width:88,height:88,borderRadius:24,background:"rgba(255,255,255,.1)",border:"1.5px solid rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px",animation:"float 5s ease-in-out infinite",backdropFilter:"blur(8px)"}}>
            <span style={{fontSize:44}}>🎯</span>
          </div>
          <h1 style={{color:"#fff",fontSize:40,fontWeight:900,letterSpacing:"-.03em",marginBottom:10,lineHeight:1.15}}>{t.home.hero}</h1>
          <p style={{color:"rgba(255,255,255,.72)",fontSize:16,fontWeight:400,marginBottom:6}}>{t.home.sub}</p>
          <p style={{color:"rgba(255,255,255,.45)",fontSize:13.5}}>{lang==="ru"?"Выберите раздел для начала":lang==="en"?"Select a section to begin":"Boshlash uchun bo'limni tanlang"}</p>
        </div>
        {/* Wave */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 52" preserveAspectRatio="none" style={{width:"100%",height:"100%"}}>
            <path d="M0,30 C240,50 480,10 720,30 C960,50 1200,10 1440,30 L1440,52 L0,52 Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>
      {/* ── SECTION PICKER + FORM ── */}
      <div style={{maxWidth:760,margin:"0 auto",padding:"16px 16px 48px"}}>
        <div className="au" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:24}}>
          {/* Hardcoded section 1: Alcana Jamoasi (placeholder uses existing QS) */}
          {(()=>{const isSel=selectedSection==="alcana";return(
            <button onClick={()=>setSelectedSection("alcana")} className="card" style={{textAlign:"left",cursor:"pointer",padding:20,border:isSel?"2px solid #16a34a":"1.5px solid #e5e7eb",background:isSel?"#f0fdf4":"#fff",fontFamily:"inherit",transition:"all 200ms"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:26}}>🏢</span>
                <span style={{fontWeight:900,fontSize:17,color:"#111827"}}>{L("Alcana Jamoasi","Команда Alcana","Alcana Team")}</span>
              </div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:10,lineHeight:1.5}}>{L("Ichki tartib qoidalari, kompaniya madaniyati va ish jarayoni","Внутренние правила, культура компании и рабочий процесс","Internal rules, company culture and work process")}</div>
              <div style={{fontSize:12.5,color:"#374151",fontWeight:600}}>50 {L("savol","вопросов","questions")} · 43+ {L("to'g'ri javob","для прохождения","to pass")}</div>
            </button>
          );})()}
          {/* Hardcoded section 2: amoCRM bo'limi */}
          {(()=>{const isSel=selectedSection==="amocrm";return(
            <button onClick={()=>setSelectedSection("amocrm")} className="card" style={{textAlign:"left",cursor:"pointer",padding:20,border:isSel?"2px solid #16a34a":"1.5px solid #e5e7eb",background:isSel?"#f0fdf4":"#fff",fontFamily:"inherit",transition:"all 200ms"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:26}}>📋</span>
                <span style={{fontWeight:900,fontSize:17,color:"#111827"}}>{L("amoCRM bo'limi","Раздел amoCRM","amoCRM section")}</span>
              </div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:10,lineHeight:1.5}}>{L("amoCRM va mijoz bilan muomala","amoCRM и взаимодействие с клиентами","amoCRM and customer interaction")}</div>
              <div style={{fontSize:12.5,color:"#374151",fontWeight:600}}>30 {L("savol","вопросов","questions")} · 26+ {L("to'g'ri javob","для прохождения","to pass")}</div>
            </button>
          );})()}
          {/* Hardcoded section 3: Umumiy test (reuses 50 Alcana questions, editable via admin) */}
          {(()=>{const isSel=selectedSection==="umumiy";return(
            <button onClick={()=>setSelectedSection("umumiy")} className="card" style={{textAlign:"left",cursor:"pointer",padding:20,border:isSel?"2px solid #16a34a":"1.5px solid #e5e7eb",background:isSel?"#f0fdf4":"#fff",fontFamily:"inherit",transition:"all 200ms"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:26}}>📚</span>
                <span style={{fontWeight:900,fontSize:17,color:"#111827"}}>{L("Umumiy test","Общий тест","General test")}</span>
              </div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:10,lineHeight:1.5}}>{L("Umumiy bilim va kompaniya tartiblari bo'yicha test","Тест по общим знаниям и правилам компании","General knowledge and company rules test")}</div>
              <div style={{fontSize:12.5,color:"#374151",fontWeight:600}}>100 {L("savol","вопросов","questions")} · 86+ {L("to'g'ri javob","для прохождения","to pass")}</div>
            </button>
          );})()}
          {/* DB-added sections (managed via admin) */}
          {dbSections.map(s=>{
            const title=lang==="ru"?s.title_ru:lang==="en"?s.title_en:s.title_uz;
            const qc=s.questions?.length||0;
            const isSel = typeof selectedSection==="object" && selectedSection?.id===s.id;
            return(
              <button key={s.id} onClick={()=>qc>0&&setSelectedSection(s)} disabled={qc===0} className="card" style={{textAlign:"left",cursor:qc===0?"not-allowed":"pointer",padding:20,opacity:qc===0?.5:1,border:isSel?"2px solid #16a34a":"1.5px solid #e5e7eb",background:isSel?"#f0fdf4":"#fff",fontFamily:"inherit",transition:"all 200ms"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:26}}>📚</span>
                  <span style={{fontWeight:900,fontSize:17,color:"#111827"}}>{title}</span>
                </div>
                <div style={{fontSize:12.5,color:"#374151",fontWeight:600}}>{qc} {lang==="ru"?"вопросов":lang==="en"?"questions":"savol"} · {s.pass_threshold}+ {lang==="ru"?"для прохождения":lang==="en"?"to pass":"to'g'ri javob"}</div>
              </button>
            );
          })}
        </div>
        {selectedSection ? (
          <div className="au"><NameForm t={t.home} onStart={startTest}/></div>
        ) : (
          <div className="au" style={{textAlign:"center",padding:24,color:"#9ca3af",fontSize:14,fontWeight:500}}>
            ↑ {lang==="ru"?"Выберите раздел выше":lang==="en"?"Pick a section above":"Yuqoridagi bo'limni tanlang"}
          </div>
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // TEST PAGE
  // ─────────────────────────────────────────
  if(page==="test") return(
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:CSS}} />
      {/* Toast */}
      <div style={{position:"fixed",top:80,left:"50%",pointerEvents:"none",zIndex:999,opacity:tv?1:0,transition:"opacity .25s",animation:tv?"toastIn .3s cubic-bezier(.4,0,.2,1) both":"none"}}>
        <div style={{background:"#16a34a",color:"#fff",borderRadius:24,padding:"10px 22px",fontWeight:700,fontSize:14,boxShadow:"0 4px 20px rgba(22,163,74,.45)",whiteSpace:"nowrap",transform:"translateX(-50%)"}}>{toast}</div>
      </div>
      <Header sub={`${cand.name} ${cand.surname} · ${attempt} ${t.test.att}`}/>
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 40px"}}>
        {/* Progress card */}
        <div className="card card-p au" style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#6b7280",marginBottom:10,fontWeight:500}}>
            <span>📝 <span style={{color:"#111827",fontWeight:700}}>{answered}</span> / {qs.length} {t.test.ans}</span>
            <span>{t.test.q} <span style={{color:"#16a34a",fontWeight:700}}>{cur+1}</span> / {qs.length}</span>
          </div>
          <div className="prog"><div className="prog-f" style={{width:`${(answered/qs.length)*100}%`}}/></div>
        </div>
        {/* Question card */}
        <div key={sk} className={`card card-p-lg ${slideClass}`} style={{marginBottom:14,boxShadow:"0 8px 24px rgba(0,0,0,.08)"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f0fdf4",borderRadius:8,padding:"6px 14px",marginBottom:20}}>
            <span style={{width:24,height:24,borderRadius:"50%",background:"#16a34a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{cur+1}</span>
            <span style={{fontSize:12.5,color:"#15803d",fontWeight:700,letterSpacing:".02em"}}>{t.test.q.toUpperCase()}</span>
          </div>
          <p style={{fontWeight:600,fontSize:16,lineHeight:1.7,marginBottom:24,color:"#111827"}}>{q.q}</p>
          {q.opts.map((opt,oi)=>{
            const sel=answers[cur]===oi;
            return(
              <button key={oi} className={`opt${sel?" sel":""}`} onClick={()=>selAns(oi)}>
                <span className="opt-lbl">{"ABCD"[oi]}</span>
                <span style={{flex:1}}>{opt}</span>
                {sel&&<span className="chk">✅</span>}
              </button>
            );
          })}
          {answers[cur]!==undefined&&(
            <div style={{textAlign:"center",marginTop:4}}>
              <button onClick={clrAns} style={{background:"none",border:"1.5px solid #e5e7eb",borderRadius:20,padding:"6px 18px",color:"#9ca3af",fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
                onMouseEnter={e=>{e.target.style.borderColor="#ef4444";e.target.style.color="#ef4444";}}
                onMouseLeave={e=>{e.target.style.borderColor="#e5e7eb";e.target.style.color="#9ca3af";}}>
                {t.test.clear}
              </button>
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:20}}>
            <button className="btn btn-s" onClick={()=>goQ(-1)} disabled={cur===0} style={{flex:1,opacity:cur===0?.4:1}}>{t.test.prev}</button>
            {cur<qs.length-1
              ?<button className="btn btn-p" onClick={()=>goQ(1)} style={{flex:2}}>{t.test.next}</button>
              :<button className={`btn btn-p${answered===qs.length?" btn-p-glow":""}`} onClick={submitTest} disabled={answered<qs.length} style={{flex:2}}>
                {answered<qs.length?`⚠️ ${qs.length-answered} ${t.test.unans}`:t.test.sub}
              </button>}
          </div>
        </div>
        {/* Quick nav */}
        <div className="card card-p au" style={{padding:"16px 18px"}}>
          <p style={{fontSize:12,color:"#9ca3af",fontWeight:600,letterSpacing:".03em",marginBottom:10}}>{t.test.jump}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {qs.map((_,i)=>{const done=answers[i]!==undefined,act=i===cur;return(
              <div key={i} className="ndot" onClick={()=>nav(()=>setCur(i),i>cur?1:-1)}
                style={{background:done?"#16a34a":act?"#dcfce7":"#f3f4f6",color:done?"#fff":act?"#16a34a":"#9ca3af",border:act?"2px solid #16a34a":"2px solid transparent"}}>{i+1}</div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // RESULT PAGE
  // ─────────────────────────────────────────
  if(page==="result"){
    const s=score??0,isPassed=s>=passT,isRetry=s>=retryT&&s<passT&&attempt===1,isFailed=!isPassed&&!isRetry;
    const cl=isPassed?"#16a34a":isRetry?"#f59e0b":"#ef4444";
    const circ=2*Math.PI*62,dash=(s/totalQ)*circ;
    return(
      <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
        <style dangerouslySetInnerHTML={{__html:CSS}} />
        <Header sub={t.res.title||"Result"}/>
        <div style={{maxWidth:540,margin:"0 auto",padding:"28px 16px 48px"}}>
          <div className="card card-p-lg si" style={{boxShadow:"0 20px 40px rgba(0,0,0,.1)",textAlign:"center"}}>
            {/* Emoji */}
            <div style={{fontSize:64,marginBottom:12,display:"inline-block",animation:isPassed?"bounceIn .7s cubic-bezier(.175,.885,.32,1.275) both":"float 3s ease-in-out infinite"}}>{isPassed?"🏆":isRetry?"💪":"😔"}</div>
            <h2 style={{fontSize:24,fontWeight:900,color:cl,marginBottom:4,letterSpacing:"-.02em"}}>{isPassed?t.res.cong:isRetry?t.res.again:t.res.sorry}</h2>
            <p style={{color:"#6b7280",fontSize:14.5,marginBottom:24,fontWeight:500}}>{cand.name} {cand.surname}</p>
            {/* Score ring */}
            <svg width="168" height="168" viewBox="0 0 168 168" style={{display:"block",margin:"0 auto 24px"}}>
              <circle cx="84" cy="84" r="62" fill="none" stroke="#f3f4f6" strokeWidth="13"/>
              <circle cx="84" cy="84" r="62" fill="none" stroke={cl} strokeWidth="13" strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 84 84)"
                style={{transition:"stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)",filter:`drop-shadow(0 0 6px ${cl}66)`}}/>
              <text x="84" y="79" textAnchor="middle" fill={cl} fontSize="30" fontWeight="900" fontFamily="Inter,sans-serif">{s}</text>
              <text x="84" y="100" textAnchor="middle" fill="#9ca3af" fontSize="14" fontFamily="Inter,sans-serif">/ {totalQ}</text>
            </svg>
            {/* Category breakdown */}
            {Object.keys(catS).length>0&&(
              <div style={{textAlign:"left",marginBottom:20,background:"#f9fafb",borderRadius:12,padding:"16px"}}>
                <p style={{fontSize:12,fontWeight:700,color:"#6b7280",letterSpacing:".04em",marginBottom:12}}>CATEGORY BREAKDOWN</p>
                {t.res.cats.map((cat,i)=>{const k=["company","values","hr","conduct","innovation"][i];const pct=Math.round(((catS[k]||0)/6)*100);return(
                  <div key={cat} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"#374151",marginBottom:4,fontWeight:500}}>
                      <span>{cat}</span><span style={{fontWeight:700,color:cl}}>{catS[k]||0}/6</span>
                    </div>
                    <div className="prog">
                      <div className="prog-f" style={{width:`${pct}%`,background:cl,animationDelay:`${i*.1}s`}}/>
                    </div>
                  </div>
                );})}
              </div>
            )}
            {/* Message */}
            <div style={{background:isPassed?"#f0fdf4":isRetry?"#fefce8":"#fff5f5",border:`1px solid ${isPassed?"#bbf7d0":isRetry?"#fde68a":"#fecaca"}`,borderRadius:12,padding:"14px 16px",marginBottom:18,fontSize:14,color:isPassed?"#166534":isRetry?"#92400e":"#991b1b",lineHeight:1.7,textAlign:"left"}}>
              {isPassed?t.res.passM:isRetry?t.res.retryM:t.res.failM}
            </div>
            <div style={{fontSize:12,color:"#9ca3af",marginBottom:18}}>{sbSt==="cloud"?t.res.cloud:t.res.local}</div>
            <div style={{display:"flex",gap:10}}>
              {isRetry&&<button className="btn btn-p" onClick={retryTest} style={{flex:1}}>{t.res.retry}</button>}
              <button className="btn btn-s" onClick={goHome} style={{flex:1}}>{t.res.home}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // LOGIN PAGE
  // ─────────────────────────────────────────
  if(page==="login") return(
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:CSS}} />
      <Header sub={t.adm.sub}/>
      <div style={{maxWidth:380,margin:"60px auto",padding:"0 16px"}}>
        <div className="card card-p-lg si" style={{textAlign:"center",boxShadow:"0 20px 40px rgba(0,0,0,.1)"}}>
          <div style={{width:72,height:72,borderRadius:20,background:"#f0fdf4",border:"2px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:34}}>🔐</div>
          <h3 style={{fontSize:20,fontWeight:800,color:"#111827",letterSpacing:"-.02em",marginBottom:5}}>{t.adm.lbl||"Admin"}</h3>
          <p style={{fontSize:13.5,color:"#9ca3af",marginBottom:24}}>{t.adm.sub}</p>
          <input type="password" className="inp" value={ap} onChange={e=>{setAp(e.target.value);setAe("");}} onKeyDown={e=>e.key==="Enter"&&loginAdmin()} placeholder={t.adm.pLbl} style={{marginBottom:10,textAlign:"center",letterSpacing:"0.1em"}}/>
          {ae&&<div style={{marginBottom:10,padding:"9px 14px",background:"#fee2e2",border:"1px solid #fecaca",borderRadius:8,fontSize:13.5,color:"#991b1b"}}>{ae}</div>}
          <button className="btn btn-p btn-w" onClick={loginAdmin}>{t.adm.login}</button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // ADMIN PAGE
  // ─────────────────────────────────────────
  if(page==="admin") return(
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:CSS}} />
      <Header sub={t.adm.title}/>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"24px 16px 48px"}}>
        {/* Cloud status */}
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"#fff",borderRadius:10,padding:"6px 14px",marginBottom:20,fontSize:12.5,color:sbSt==="cloud"?"#16a34a":"#6b7280",border:"1.5px solid #e5e7eb",fontWeight:600}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:sbSt==="cloud"?"#16a34a":"#9ca3af",display:"inline-block"}}/>
          {sbSt==="cloud"?t.adm.sb:t.adm.lc}
        </div>
        {/* Admin Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:20,borderBottom:"1.5px solid #e5e7eb"}}>
          {[{k:"results",label:lang==="ru"?"Результаты":lang==="en"?"Results":"Natijalar"},{k:"questions",label:lang==="ru"?"Разделы и вопросы":lang==="en"?"Sections & Questions":"Bo'limlar va savollar"}].map(({k,label})=>(
            <button key={k} onClick={()=>setAdminTab(k as any)} style={{background:"transparent",border:"none",cursor:"pointer",padding:"10px 18px",fontSize:14,fontWeight:700,fontFamily:"inherit",color:adminTab===k?"#16a34a":"#6b7280",borderBottom:adminTab===k?"2.5px solid #16a34a":"2.5px solid transparent",marginBottom:-2}}>{label}</button>
          ))}
        </div>
        {adminTab==="results" && (<>
        {/* Stats */}
        <div style={{display:"flex",gap:12,marginBottom:22,flexWrap:"wrap"}}>
          {[["📊",t.adm.tot,cnt.all,"#3b82f6","#eff6ff","#dbeafe"],["✅",t.adm.pass,cnt.passed,"#16a34a","#f0fdf4","#bbf7d0"],["⚠️",t.adm.ret,cnt.retry,"#f59e0b","#fffbeb","#fde68a"],["❌",t.adm.fail,cnt.failed,"#ef4444","#fff5f5","#fecaca"]].map(([ic,lb,v,cl,bg,bc],i)=>(
            <div key={lb} className="au" style={{flex:1,minWidth:130,background:bg,borderRadius:16,padding:"20px 18px",borderLeft:`4px solid ${cl}`,border:`1.5px solid ${bc}`,animationDelay:`${i*.07}s`}}>
              <div style={{fontSize:11,color:cl,fontWeight:700,letterSpacing:".06em",marginBottom:6}}>{ic} {lb.toUpperCase()}</div>
              <div style={{fontSize:36,fontWeight:900,color:cl,letterSpacing:"-.02em",lineHeight:1}}>{v}</div>
              {cnt.all>0&&<div style={{fontSize:11.5,color:cl,marginTop:4,opacity:.7}}>{Math.round((v/cnt.all)*100)}%</div>}
            </div>
          ))}
        </div>
        {/* Filter + search + export */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          {["all","passed","retry","failed"].map(f=>(
            <button key={f} onClick={()=>setFilt(f)} style={{padding:"8px 18px",borderRadius:20,border:`1.5px solid ${filt===f?"#16a34a":"#e5e7eb"}`,background:filt===f?"#16a34a":"#fff",color:filt===f?"#fff":"#374151",cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"inherit",transition:"all .15s"}}>
              {f==="all"?t.adm.all:f==="passed"?t.adm.pL:f==="retry"?t.adm.rL:t.adm.fL}
            </button>
          ))}
          <input type="search" value={srch} onChange={e=>setSrch(e.target.value)} placeholder={t.adm.search}
            style={{flex:1,minWidth:160,padding:"9px 14px",borderRadius:20,border:"1.5px solid #e5e7eb",fontSize:13.5,outline:"none",fontFamily:"inherit",background:"#fff"}}/>
          <span style={{fontSize:13,color:"#9ca3af",fontWeight:500}}>{fRes.length} {t.adm.tot.toLowerCase()}</span>
          <button className="btn btn-s btn-sm" onClick={exportCSV}>{t.adm.exp}</button>
        </div>
        {/* Table */}
        <div className="card" style={{overflow:"auto"}}>
          <table className="tbl">
            <thead>
              <tr style={{background:"linear-gradient(135deg,#0f2d1a,#16a34a)"}}>
                {t.adm.hdrs.map(h=><th key={h}>{h}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fRes.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:"52px",color:"#d1d5db",fontSize:15}}>{t.adm.none}</td></tr>}
              {fRes.map((r,i)=>{
                const cl=r.status==="passed"?"#16a34a":r.status==="retry"?"#f59e0b":"#ef4444";
                const lbl=r.status==="passed"?t.adm.pL:r.status==="retry"?t.adm.rL:t.adm.fL;
                const cls=r.status==="passed"?"bdg bdg-p":r.status==="retry"?"bdg bdg-r":"bdg bdg-f";
                return(
                  <tr key={i}>
                    <td style={{color:"#d1d5db",fontWeight:700,fontSize:12}}>{i+1}</td>
                    <td style={{fontWeight:700,color:"#111827"}}>{r.name} {r.surname}</td>
                    <td style={{fontWeight:900,color:cl,fontSize:16,letterSpacing:"-.01em"}}>{r.score}<span style={{fontSize:12,fontWeight:400,color:"#9ca3af"}}>/{r.meta?.total||30}</span></td>
                    <td style={{fontWeight:700,color:cl}}>{Math.round((r.score/(r.meta?.total||30))*100)}%</td>
                    <td style={{textAlign:"center",color:"#9ca3af",fontWeight:500}}>{r.attempt}</td>
                    <td><span className={cls}>{lbl}</span></td>
                    <td style={{color:"#9ca3af",fontSize:12.5}}>{r.created_at?new Date(r.created_at).toLocaleDateString():r.date||""}</td>
                    <td style={{textAlign:"center"}}>
                      {r.meta?.answers ? (
                        <button onClick={()=>setMistakesRow(r)} className="btn btn-s" style={{padding:"4px 10px",fontSize:12}}>👁 {L("Tafsilot","Детали","Details")}</button>
                      ) : (
                        <span style={{color:"#d1d5db",fontSize:11}}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {results.length>0&&(
          <button className="btn btn-s btn-sm" style={{marginTop:12,color:"#ef4444",borderColor:"#fecaca"}}
            onClick={()=>{if(window.confirm("Clear all local data?")){{localStorage.removeItem(LK);setResults([]);}}}}>
            {t.adm.clr}
          </button>
        )}
        </>)}
        {adminTab==="questions" && (
          managingSectionId ? (
            <QuestionsList
              sectionId={managingSectionId}
              lang={lang as any}
              onEditQuestion={q => setEditingQuestion(q)}
              onAddQuestion={() => setEditingQuestion("new")}
              onBack={() => setManagingSectionId(null)}
              refreshKey={adminRefresh}
            />
          ) : (
            <AdminQuestions
              lang={lang as any}
              onEditSection={s => setEditingSection(s ?? "new")}
              onAddQuestion={sectionId => { setManagingSectionId(sectionId); setEditingQuestion("new"); }}
              onManageQuestions={sectionId => setManagingSectionId(sectionId)}
              refreshKey={adminRefresh}
            />
          )
        )}
        {editingSection !== null && (
          <SectionFormModal
            section={editingSection === "new" ? null : editingSection}
            onClose={() => setEditingSection(null)}
            onSaved={() => { setEditingSection(null); setAdminRefresh(v=>v+1); }}
          />
        )}
        {editingQuestion !== null && managingSectionId && (
          <QuestionFormModal
            sectionId={managingSectionId}
            question={editingQuestion === "new" ? null : editingQuestion}
            onClose={() => setEditingQuestion(null)}
            onSaved={() => { setEditingQuestion(null); setAdminRefresh(v=>v+1); }}
          />
        )}
        {mistakesRow && (()=>{
          const m = mistakesRow.meta || {};
          const ans = m.answers || {};
          const correct = m.correct || [];
          // Resolve the question source from section_key.
          const skey:string = m.section_key || "";
          let questionsSrc:any[] = [];
          let sourceLabel = "";
          if(skey==="alcana"){questionsSrc=mapMlQs(QS_ALCANA);sourceLabel=m.section_label||"Alcana";}
          else if(skey==="umumiy"){questionsSrc=mapMlQs([...QS_UMUMIY, ...QS_ALCANA]);sourceLabel=m.section_label||"Umumiy";}
          else if(skey==="amocrm"){questionsSrc=mapMlQs(QS_AMOCRM);sourceLabel=m.section_label||"amoCRM";}
          else if(skey.startsWith("db:")){
            const id=skey.slice(3);
            const sec=dbSections.find(s=>s.id===id);
            if(sec){
              questionsSrc=(sec.questions||[]).map(dq=>({q:dq.text_uz,opts:(dq.options||[]).map(o=>o.text_uz),ans:dq.correct_index}));
              sourceLabel=sec.title_uz;
            }
          }
          const totalCount = m.total || questionsSrc.length || 0;
          const wrongList:number[] = [];
          for(let i=0;i<totalCount;i++){
            const picked = ans[i];
            const cor = correct[i] ?? questionsSrc[i]?.ans;
            if(picked!==cor)wrongList.push(i);
          }
          return(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setMistakesRow(null)}>
              <div className="card" style={{maxWidth:780,width:"100%",maxHeight:"90vh",overflowY:"auto",padding:24}} onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,gap:12,flexWrap:"wrap"}}>
                  <h3 style={{fontSize:18,fontWeight:800,color:"#111827"}}>
                    {mistakesRow.name} {mistakesRow.surname} — {sourceLabel}
                  </h3>
                  <button className="btn btn-s" onClick={()=>setMistakesRow(null)} style={{padding:"6px 12px",fontSize:12.5}}>✕</button>
                </div>
                <div style={{fontSize:13,color:"#6b7280",marginBottom:16}}>
                  {mistakesRow.score} / {totalCount} · {wrongList.length} {L("ta noto'g'ri","ошибок","wrong")}
                </div>
                {questionsSrc.length===0 ? (
                  <div style={{padding:16,background:"#fef3c7",borderRadius:8,color:"#92400e",fontSize:13}}>
                    {L("Bu test bo'limi topilmadi (arxivlangan yoki o'chirilgan bo'lishi mumkin).","Раздел теста не найден (возможно, архивирован или удалён).","Test section not found (may be archived or deleted).")}
                  </div>
                ) : (
                  questionsSrc.map((qq:any,i:number)=>{
                    const picked = ans[i];
                    const cor = correct[i] ?? qq.ans;
                    const isWrong = picked !== cor;
                    const wasUnanswered = picked === -1 || picked === undefined;
                    const showQ = qq.q;
                    return(
                      <div key={i} style={{padding:14,marginBottom:10,borderRadius:10,border:`1.5px solid ${isWrong?"#fecaca":"#bbf7d0"}`,background:isWrong?"#fef2f2":"#f0fdf4"}}>
                        <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:8}}>
                          <div style={{fontSize:13,fontWeight:700,color:"#374151"}}>#{i+1}</div>
                          <div style={{fontSize:12,fontWeight:700,color:isWrong?"#991b1b":"#166534"}}>
                            {isWrong ? (wasUnanswered ? L("Javobsiz","Без ответа","Unanswered") : L("Noto'g'ri","Неверно","Wrong")) : L("To'g'ri","Верно","Correct")}
                          </div>
                        </div>
                        <div style={{fontSize:14,color:"#111827",marginBottom:8,lineHeight:1.5}}>{showQ}</div>
                        {(qq.opts||[]).map((opt:string,oi:number)=>{
                          const isCor = oi===cor;
                          const isPicked = oi===picked;
                          const showOpt = opt;
                          return(
                            <div key={oi} style={{fontSize:13,padding:"6px 10px",marginBottom:4,borderRadius:6,background:isCor?"#dcfce7":isPicked?"#fee2e2":"#fff",border:`1px solid ${isCor?"#86efac":isPicked?"#fecaca":"#e5e7eb"}`,color:isCor?"#166534":isPicked?"#991b1b":"#4b5563",fontWeight:isCor||isPicked?600:400}}>
                              {String.fromCharCode(65+oi)}) {showOpt}
                              {isCor && <span style={{marginLeft:6,fontWeight:700}}>✓</span>}
                              {isPicked && !isCor && <span style={{marginLeft:6,fontWeight:700}}>← {L("tanlandi","выбрано","picked")}</span>}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
