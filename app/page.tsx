"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";

// Force Next.js to render this strictly on demand to fix build loops
export const dynamic = "force-dynamic";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ADMIN_PASS = "Alcana2024";
const LK = "alcana_v5";

// ─── NEXT.JS COMPLIANT INLINE OVERRIDES ─────────────────────────
// Cleaned up raw CSS properties that cause Next.js compiler errors.
const CSS = `
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

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;font-family:inherit;font-weight:600;letter-spacing:-.01em;white-space:nowrap;transition:all 200ms cubic-bezier(.4,0,.2,1);user-select:none;}
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

.inp{width:100%;padding:12px 16px;border-radius:8px;border:1.5px solid #e5e7eb;font-size:15px;font-family:inherit;color:#111827;background:#fff;outline:none;transition:all 200ms;box-sizing:border-box;}
.inp:focus{border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.12);}

.opt{display:flex;align-items:center;gap:14px;width:100%;padding:15px 18px;margin-bottom:10px;border-radius:12px;border:2px solid #e5e7eb;background:#fff;cursor:pointer;font-size:15px;font-weight:400;text-align:left;color:#374151;font-family:inherit;line-height:1.5;transition:all 200ms cubic-bezier(.4,0,.2,1);}
.opt:hover{border-color:#86efac;background:#f9fafb;transform:translateX(4px);box-shadow:0 2px 8px rgba(22,163,74,.08);}
.opt.sel{border-color:#16a34a;background:linear-gradient(135deg,#f0fdf4,#dcfce7);transform:translateX(4px);box-shadow:0 4px 14px rgba(22,163,74,.15);color:#166534;font-weight:500;}
.opt-lbl{width:32px;height:32px;min-width:32px;border-radius:9px;background:#f3f4f6;color:#374151;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;transition:all 200ms;}
.opt.sel .opt-lbl{background:#16a34a;color:#fff;}
.chk{margin-left:auto;font-size:16px;flex-shrink:0;animation:checkPop .3s cubic-bezier(.175,.885,.32,1.275) both;}

.card{background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.05);}
.card-p{padding:24px;} .card-p-lg{padding:32px;}

.prog{height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;}
.prog-f{height:100%;border-radius:4px;background:linear-gradient(90deg,#16a34a,#10b981);transition:width 500ms cubic-bezier(.4,0,.2,1);box-shadow:0 0 10px rgba(22,163,74,.4);}

.ndot{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all 150ms;border:2px solid transparent;font-family:inherit;}
.ndot:hover{transform:scale(1.15);}

.bdg{display:inline-flex;align-items:center;gap:4px;border-radius:20px;padding:5px 12px;font-size:12.5px;font-weight:700;}
.bdg-p{background:#dcfce7;color:#166534;border:1.5px solid rgba(22,163,74,.3);}
.bdg-r{background:#fef9c3;color:#92400e;border:1.5px solid rgba(245,158,11,.3);}
.bdg-f{background:#fee2e2;color:#991b1b;border:1.5px solid rgba(239,68,68,.3);}

.tbl{width:100%;border-collapse:collapse;}
.tbl th{padding:14px 16px;text-align:left;font-size:12.5px;font-weight:700;color:#fff;letter-spacing:.03em;}
.tbl td{padding:13px 16px;font-size:13.5px;border-bottom:1px solid #f3f4f6;color:#374151;}
.tbl tr:hover td{background:#f9fafb;}
.tbl tr:last-child td{border-bottom:none;}

.hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#071810 0%,#0d2818 35%,#163824 65%,#0d2818 100%);padding:68px 24px 88px;text-align:center;}
.hero-g1{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(22,163,74,.22) 0%,transparent 68%);top:-280px;left:-180px;animation:gradPulse 7s ease-in-out infinite;}
.hero-g2{position:absolute;width:550px;height:550px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.16) 0%,transparent 68%);bottom:-240px;right:-120px;animation:gradPulse 9s ease-in-out infinite 2.5s;}
.hero-grid{position:absolute;inset:0;opacity:.035;background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);background-size:48px 48px;}
.hero-wave{position:absolute;bottom:0;left:0;right:0;height:52px;overflow:hidden;}
.glass-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(12px);border-radius:16px;padding:20px 16px;text-align:center;transition:all 250ms;}
.glass-card:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.22);transform:translateY(-3px);}

.lang-dd{position:absolute;top:48px;right:0;background:#fff;border:1.5px solid #e5e7eb;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.12);overflow:hidden;z-index:999;min-width:160px;animation:slideDown .2s ease both;}
.lang-item{padding:12px 16px;cursor:pointer;font-size:14px;font-family:inherit;transition:all .12s;display:flex;align-items:center;gap:10px;border-left:3px solid transparent;}
.lang-item:hover{background:#f3f4f6;border-left-color:#16a34a;color:#16a34a;}
.lang-item.active{background:#f0fdf4;border-left-color:#16a34a;color:#166534;font-weight:600;}
`;

// ─── TRANSLATIONS ──────────────────────────────────────────
const T: any = {
  uz:{lang:"🇺🇿 O'zbek",h:{admin:"Admin",mus:"🌊 Musiqa",musOff:"🔇 Musiqa",exit:"Chiqish"},home:{badge:"Yangi Xodim Testi",hero:"Alcana Group",sub:"Onboarding Assessment Platform",dur:"30 savol · ~15 daqiqa",info:"Ma'lumotlaringizni kiriting",fnL:"Ism",fnP:"Ismingiz...",lnL:"Familiya",lnP:"Familiyangiz...",start:"Testni Boshlash →",err:"Iltimos, ism va familiyangizni kiriting!",hint:"Tinch okean musiqasi uchun yuqoridagi tugmani bosing 🌊",s27:"O'tdi",s20:"Qayta",s0:"O'tmadi"},test:{q:"Savol",ans:"javoblandi",prev:"← Oldingi",next:"Keyingi →",sub:"Testni Yakunlash",unans:"ta javobsiz",jump:"Tez o'tish:",clear:"Javobni o'zgartirish",att:"urinish"},res:{cong:"Tabriklaymiz!",again:"Yana bir bor!",sorry:"Afsuski...",passM:"🎉 Siz Alcana Group jamoasiga to'liq loyiqsiz! HR bo'limi siz bilan tez orada bog'lanadi.",retryM:"Siz chegaradan o'tdingiz! Materiallarni qayta o'qib chiqing va ikkinchi urinishda muvaffaqiyat qozing.",failM:"Bu safar kutilgan natijaga erisha olmadingiz. Kuchingizni to'plab, keyinroq qayta murojaat qilishingiz mumkin.",retry:"🔄 Qayta urinish",home:"🏠 Bosh sahifa",cloud:"☁️ Bulutga saqlandi",local:"💾 Qurilmaga saqlandi",cats:["Kompaniya","Qadriyatlar","HR Siyosat","Xulq-Atvor","Innovatsiya"]},adm:{title:"Admin Boshqaruv Paneli",pLbl:"Parolni kiriting...",login:"Kirish →",wrong:"❌ Noto'g'ri parol!",tot:"Jami",pass:"O'tdi",ret:"Qayta",fail:"O'tmadi",all:"Barchasi",search:"Ism bo'yicha...",none:"Natija topilmadi",hdrs:["#","Ism Familiya","Ball","%","Urinish","Holat","Sana"],exp:"📊 CSV",clr:"🗑️ Tozalash",pL:"✅ O'tdi",rL:"⚠️ Qayta",fL:"❌ O'tmadi",sub:"Faqat vakolatli menejerlar",sb:"☁️ Supabase",lc:"💾 Mahalliy"},mot:["Ajoyib! 🌊","Zo'r! ✨","Davom eting! 💪","A'lo! 🎯","Kuchli! 🔥","Olg'a! 🚀"]},
  ru:{lang:"🇷🇺 Русский",h:{admin:"Админ",mus:"🌊 Музыка",musOff:"🔇 Музыка",exit:"Выход"},home:{badge:"Тест нового сотрудника",hero:"Alcana Group",sub:"Платформа адаптации сотрудников",dur:"30 вопросов · ~15 минут",info:"Введите ваши данные",fnL:"Имя",fnP:"Ваше имя...",lnL:"Фамилия",lnP:"Ваша фамилия...",start:"Начать тест →",err:"Пожалуйста, введите имя и фамилию!",hint:"Нажмите кнопку выше для звуков океана 🌊",s27:"Прошёл",s20:"Повтор",s0:"Не прошёл"},test:{q:"Вопрос",ans:"отвечено",prev:"← Назад",next:"Далее →",sub:"Завершить тест",unans:"без ответа",jump:"Быстрый переход:",clear:"Изменить ответ",att:"попытка"},res:{cong:"Поздравляем!",again:"Ещё раз!",sorry:"К сожалению...",passM:"🎉 Вы полностью подходите для вступления в команду Alcana Group!",retryM:"Вы перешли порог! Повторно изучите материалы и попробуйте снова.",failM:"На этот раз не удалось достичь результата. Обращайтесь позднее.",retry:"🔄 Повторить",home:"🏠 Главная",cloud:"☁️ Сохранено в облаке",local:"💾 Сохранено на устройстве",cats:["Компания","Ценности","HR Политика","Поведение","Инновации"]},adm:{title:"Панель администратора",pLbl:"Введите пароль...",login:"Войти →",wrong:"❌ Неверный пароль!",tot:"Всего",pass:"Прошли",ret:"Повтор",fail:"Не прошли",all:"Все",search:"Поиск по имени...",none:"Результатов не найдено",hdrs:["#","Имя Фамилия","Балл","%","Попытка","Статус","Дата"],exp:"📊 CSV",clr:"🗑️ Очистить",pL:"✅ Прошёл",rL:"⚠️ Повтор",fL:"❌ Не прошёл",sub:"Только авторизованные менеджеры",sb:"☁️ Supabase",lc:"💾 Локально"},mot:["Отлично! 🌊","Здорово! ✨","Продолжайте! 💪","Превосходно! 🎯","Сильно! 🔥","Вперёд! 🚀"]},
  en:{lang:"🇬🇧 English",h:{admin:"Admin",mus:"🌊 Music",musOff:"🔇 Music",exit:"Exit"},home:{badge:"New Employee Test",hero:"Alcana Group",sub:"Onboarding Assessment Platform",dur:"30 questions · ~15 minutes",info:"Enter your information",fnL:"First Name",fnP:"Your first name...",lnL:"Last Name",lnP:"Your last name...",start:"Start Test →",err:"Please enter your first and last name!",hint:"Click the button above for ocean sounds 🌊",s27:"Passed",s20:"Retry",s0:"Failed"},test:{q:"Question",ans:"answered",prev:"← Previous",next:"Next →",sub:"Submit Test",unans:"unanswered",jump:"Quick jump:",clear:"Change answer",att:"attempt"},res:{cong:"Congratulations!",again:"Try Again!",sorry:"Unfortunately...",passM:"🎉 You are fully eligible to join the Alcana Group team! HR will contact you soon.",retryM:"You crossed the threshold! Review the materials and succeed on your second attempt.",failM:"This time you didn't reach the expected result. Gather your strength and reapply later.",retry:"🔄 Retry",home:"🏠 Home",cloud:"☁️ Saved to cloud",local:"💾 Saved to device",cats:["Company","Values","HR Policy","Conduct","Innovation"]},adm:{title:"Admin Control Panel",pLbl:"Enter password...",login:"Login →",wrong:"❌ Wrong password!",tot:"Total",pass:"Passed",ret:"Retry",fail:"Failed",all:"All",search:"Search by name...",none:"No results found",hdrs:["#","Full Name","Score","%","Attempt","Status","Date"],exp:"📊 CSV",clr:"🗑️ Clear",pL:"✅ Passed",rL:"⚠️ Retry",fL:"❌ Failed",sub:"Authorized managers only",sb:"☁️ Supabase",lc:"💾 Local"},mot:["Amazing! 🌊","Great! ✨","Keep going! 💪","Excellent! 🎯","Strong! 🔥","Forward! 🚀"]}
};

// ─── QUESTIONS ─────────────────────────────────────────────
const QS: any = {
  uz:[
    {q:"1. Alcana Group o'zini bozorda qanday kompaniya sifatida namoyon etadi?",opts:["Mijozlarga eng arzon xizmat ko'rsatuvchi reklama agentligi","G'oyalarni natijaga aylantiradigan va bizneslarga real qiymat beradigan jamoa","Faqat tayyor andozalar asosida ishlaydigan poligrafiya korxonasi","Faqat yirik davlat buyurtmalari bilan ishlaydigan yopiq tashkilot"],ans:1},
    {q:"2. Kompaniyaning yaqin yillar ichidagi katta maqsadlaridan biri qaysi javobda to'g'ri ko'rsatilgan?",opts:["O'zbekistondagi eng ko'p xodimga ega kompaniyaga aylanish","Faqat onlayn reklama bozorini to'liq egallash","Xalqaro miqyosda raqobatlashuvchi brend qurish va 7 qavatli shaxsiy binoga ega bo'lish","Balla ishlab chiqarish jarayonlarini autsorsingga topshirish"],ans:2},
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
    {q:"21. Dizayner tayyorlagan faylini ishlab chiqarishga topshirishdan ifoda nima qilishi shart?",opts:["Faylni to'g'ridan-to'g'ri ishlab chiqarish kompyuteriga tashlab ketishi kerak","Mijozdan faylni qayta tekshirib berishini so'rashi lozim","Faylning barcha texnik parametrlarini shaxsan o'zi diqqat bilan tekshirishi shart","Faylni koll-markaz operatori orqali yuborishi kerak"],ans:2},
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
    {q:"16. Какие сотрудники подходят компании?",opts:["Только опытные, но не желающие менять методы работы","Выполняющие приказы беспрекословно, без своего мнения","Желающие развиваться, ответственные, решительные и честные","Только специалисты с высшим образованием в сфере рекламы"],ans:2},
    {q:"17. Какая категория людей абсолютно не подходит компании?",opts:["Предпочитающие спокойную рабочую атмосферу","Ищущие оправдания, ленивые, недисциплинированные","Не желающие участвовать в командных спортивных играх","Не знающие компьютерных программ в совершенстве"],ans:1},
    {q:"18. Какую гарантию даёт компания сотруднику, не показавшему рост за 3-6 месяцев?",opts:["Рекомендует дополнительный 2-месячный бесплатный тренинг","Переводит в другой отдел","Выплачивает компенсацию в размере 10 000 000 сум","Продлевает испытательный срок"],ans:2},
    {q:"19. Что может получить лучший сотрудник месяца, выигравший культурный отдых?",opts:["Путёвку за рубеж","Билеты в кино, семейный или командный ваучер в ресторан","Дополнительный 3-дневный оплачиваемый отпуск","Дорогостоящую бытовую технику"],ans:1},
    {q:"20. Каково значение «Deadline» для дисциплинированного дизайнера?",opts:["Срок — понятие относительное, главное — совершенство идеи","Правило, которому нужно строго следовать, чтобы производство не опаздывало","На срок обращают внимание только если клиент доплатил","Срок контролирует только оператор колл-центра"],ans:1},
    {q:"21. Что дизайнер обязан сделать перед передачей файла в производство?",opts:["Просто скинуть файл на компьютер производства","Попросить клиента повторно проверить файл","Лично внимательно проверить все технические параметры файла","Отправить файл через оператора колл-центра"],ans:2},
    {q:"22. Когда производственные сотрудники должны обеспечивать чистоту при монтаже билбордов?",opts:["Только при смене смены","Раз в неделю, после субботнего собрания","В процессе работы и сразу после её завершения","Только по команде начальника производства"],ans:2},
    {q:"23. Как упорядочиваются инструменты и обрезки материалов в мастерской?",opts:["Обрезки складываются под стол, инструменты остаются на рабочем месте","Инструменты убираются на своё место, обрезки сортируются и выбрасываются","Всё оставляется для уборки следующей сменой","Остатки материалов просто выносятся за пределы мастерской"],ans:1},
    {q:"24. Какое правило колл-центра «Подход к клиентам» верно указано?",opts:["Общаться с клиентом в зависимости от суммы заказа","Видеть в клиенте партнёра, всегда быть вежливым и профессиональным","Соглашаться с любым предложением клиента без проверки","Сразу направлять проблемных клиентов в производство"],ans:1},
    {q:"25. Как оператор колл-центра должен передавать заказы в конце смены?",opts:["Достаточно оставить все данные в памяти компьютера","Дисциплинированно записывает заказы и нерешённые вопросы и передаёт следующей смене","Предупреждает только о крупных заказах","Просит клиентов перезвонить"],ans:1},
    {q:"26. Какую технологию внедряет Alcana Group для повышения эффективности?",opts:["Только облачные системы хранения","Технологии искусственного интеллекта (AI)","Только зарубежные мессенджеры","Автоматические телефонные станции"],ans:1},
    {q:"27. Сколько эффективных инструментов использует компания в управлении?",opts:["Более 20","Около 40","Более 60","Без ограничений"],ans:2},
    {q:"28. Как Alcana Group отслеживает мировые инновации?",opts:["Покупает отчёты местных экспертов","Участвует в международных выставках за рубежом","Ограничивается открытыми статьями в интернете","Копирует методы работы конкурентов"],ans:1},
    {q:"29. Какая возможность существует для улучшения речи и мотивации сотрудников?",opts:["Выделяется время только для самостоятельного чтения","Возможность участвовать в еженедельных мотивационных встречах","Направляют на платные курсы ораторского искусства","Специальные занятия только для сотрудников колл-центра"],ans:1},
    {q:"30. Что означает «хорошо» для Alcana Group согласно манифесту?",opts:["Любая красивая и креативная идея","Проект, понравившийся клиенту и долго обсуждавшийся","Работа и качество продукта, принёсшие конкретную пользу","Заказ, выполненный быстро и с минимальными затратами"],ans:2},
  ],
  en:[
    {q:"1. How does Alcana Group present itself in the market?",opts:["An ad agency offering the cheapest services","A team that turns ideas into results and creates real value for businesses","A printing company working only with ready-made templates","A closed organization working only with government orders"],ans:1},
    {q:"2. Which major company goal for the coming years is correctly stated?",opts:["To have the most employees in Uzbekistan","To fully capture the online advertising market","To build an internationally competitive brand and own a 7-story building","To outsource all production processes"],ans:2},
    {q:"3. What convenience does Alcana Group plan to create for its team?",opts:["Switch to a 3-day workweek","Implement a remote work-from-home system","Provide 3 meals a day at company expense","Send employees on free trips abroad every year"],ans:2},
    {q:"4. What market position does the company aim to achieve in Central Asia?",opts:["Enter the top 5 by revenue","Become one of the 10 strongest advertising agencies","Take 1st place only in digital marketing","Control at least 80% market share"],ans:1},
    {q:"5. With which country does Alcana Group plan to open a joint venture?",opts:["Turkey — a new startup project","UAE (Dubai) — international branch","China — joint venture","Russia — merging advertising networks"],ans:2},
    {q:"6. Which of the following are Alcana Group's core values?",opts:["Speed, eliminating competitors, confidentiality","Honesty, justice, responsibility, results and development","Creativity, freedom, individual approach","Experience, flexibility, fulfilling any client request"],ans:1},
    {q:"7. With which type of business is cooperation permitted under company values?",opts:["Pawnshops and nightclubs","Alcohol and tobacco manufacturers","Gambling organizations","Healthy food and public catering companies"],ans:3},
    {q:"8. Which financial limitation when accepting orders is correctly stated?",opts:["Low budget orders are not accepted","Kickback orders are strictly rejected","Only working with 100% advance payment","Cash orders are restricted"],ans:1},
    {q:"9. How are problems approached in the company and what is salvation?",opts:["Problem is a system error, salvation is in experience","Problem is not an excuse, but an opportunity; salvation is in knowledge","Problem is client fault, salvation is in quick decisions","Problem is temporary, salvation is in patience"],ans:1},
    {q:"10. What is the standard working hours pattern in Alcana Group?",opts:["Mon–Fri 9:00–17:00, Saturday off","Mon–Fri 8:00–18:00, Saturday meetings","6 days a week, every day 9:00–18:00","Daily 9:00–19:00, Saturday special order"],ans:3},
    {q:"11. What is special about the Saturday work regime?",opts:["Work starts at 10:00","Meeting at 8:00 AM, work continues until 18:00","Work only until lunch, then sports games","Only online reports submitted on Saturday"],ans:1},
    {q:"12. What hours are set for the lunch break?",opts:["12:00–13:00","13:00–14:00","12:30–13:30","Separate schedule for each department"],ans:1},
    {q:"13. How is punctuality measured when arriving at work?",opts:["Up to 5 minutes late is normal","Being late counts from 15 minutes","Even 1 minute late is considered a violation","Only those arriving after 9:30 are recorded"],ans:2},
    {q:"14. What measure is taken against employees who violate discipline?",opts:["Deducted directly from salary","A fine in the form of charity from 10,000 to 200,000 UZS","That day's full salary is cancelled","Deprived of next week's lunch"],ans:1},
    {q:"15. What is the attitude toward 'This is not my job' in Alcana Group?",opts:["Correct — everyone should only do what's in their contract","Such a concept doesn't exist; responsibility for results is on every employee","Only allowed with the manager's permission","Only applies to probationary employees"],ans:1},
    {q:"16. What kind of employees suit the company?",opts:["Only experienced ones who don't want to change","Those who follow orders without personal opinion","Those who want to grow, are responsible, determined and honest","Only specialists with advertising degrees"],ans:2},
    {q:"17. What type of people absolutely don't suit the company?",opts:["Those who prefer a calm work environment","Those who make excuses, are lazy, undisciplined, and don't self-develop","Those who don't want to join team sports","Those who don't know computer programs perfectly"],ans:1},
    {q:"18. What guarantee does the company give to an employee showing no growth in 3-6 months?",opts:["Recommends additional 2-month free training","Transfers to another department","Pays compensation of 10,000,000 UZS","Extends the probation period"],ans:2},
    {q:"19. What can the best employee of the month who won a cultural leisure prize receive?",opts:["A trip abroad","Cinema tickets, family or team restaurant vouchers","An additional 3-day paid vacation","Expensive household appliances"],ans:1},
    {q:"20. What is the importance of 'Deadline' for a disciplined designer?",opts:["Deadline is relative; the main thing is perfection of idea","Strictly mandatory to prevent production chain delays","Only matters if client pays extra","Controlled only by call center operator"],ans:1},
    {q:"21. What must a designer do before submitting files to production?",opts:["Drop files directly to production computer","Ask client to double-check","Personally verify all technical parameters carefully","Send file via call center operator"],ans:2},
    {q:"22. When should production employees ensure cleanliness when assembling billboards?",opts:["Only when shifts change","Once a week, after Saturday's meeting","During and immediately after completing work","Only when the production manager orders it"],ans:2},
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

// ─── OCEAN AUDIO ──────────────────────────────────────────
function mkOcean(ctx: any){
  const master=ctx.createGain();master.gain.value=0.42;master.connect(ctx.destination);
  const stops: any[]=[];
  function layer(lpF: number,gV: number,lfoR: number,lfoD: number,hpF=30,pan=0){
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
  return ()=>stops.forEach(f=>f());
}

// ─── COMPONENT UI PARTS ────────────────────────────────────
const Header = memo(function Header({sub,onAdminClick,music,onMusicToggle,onExit,lang,onLangClick,languages,langOpen,onLangSel}: any){
  return (
    <header style={{background:"#fff",borderBottom:"1.5px solid #e5e7eb",padding:"14px 20px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 3px rgba(0,0,0,.02)"}}>
      <div style={{maxWidth:1120,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"between",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={onExit}>
          <span style={{fontSize:22,fontWeight:900,color:"#16a34a",letterSpacing:"-.03em",textTransform:"uppercase"}}>Alcana</span>
          <span style={{fontSize:11,background:"#f3f4f6",color:"#4b5563",padding:"3px 8px",borderRadius:6,fontWeight:700}}>{sub}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
          {onMusicToggle && (
            <button className="btn btn-s" onClick={onMusicToggle} style={{padding:"8px 14px",fontSize:13,borderRadius:8}}>
              {music ? T[lang].h.musOff : T[lang].h.mus}
            </button>
          )}
          {onAdminClick && (
            <button className="btn btn-s" onClick={onAdminClick} style={{padding:"8px 14px",fontSize:13,borderRadius:8}}>
              ⚙️ {T[lang].h.admin}
            </button>
          )}
          {onExit && (
            <button className="btn btn-s" onClick={onExit} style={{padding:"8px 14px",fontSize:13,borderRadius:8,borderColor:"#fee2e2",color:"#991b1b"}}>
              {T[lang].h.exit}
            </button>
          )}
          {onLangClick && (
            <div style={{position:"relative"}}>
              <button className="btn btn-s" onClick={(e)=>{e.stopPropagation();onLangClick();}} style={{padding:"8px 14px",fontSize:13,borderRadius:8,background:"#f9fafb"}}>
                {languages[lang].lang} ▾
              </button>
              {langOpen && (
                <div className="lang-dd">
                  {Object.keys(languages).map(k=>(
                    <div key={k} className={`lang-item${lang===k?" active":""}`} onClick={()=>onLangSel(k)}>
                      {languages[k].lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

const NameForm = memo(function NameForm({t,onStart}: any){
  const [fn,setFn]=useState("");const [ln,setLn]=useState("");const [err,setErr]=useState("");
  const go=useCallback(()=>{if(!fn.trim()||!ln.trim()){setErr(t.err);return;}onStart(fn.trim(),ln.trim());},[fn,ln,t.err,onStart]);
  return(
    <div className="card card-p" style={{marginTop:24}}>
      <p style={{fontSize:13,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:".05em",marginBottom:16}}>{t.info}</p>
      <div style={{display:"flex",gap:12,marginBottom:err?0:4,flexWrap:"wrap"}}>
        {[[t.fnL,t.fnP,fn,setFn],[t.lnL,t.lnP,ln,setLn]].map(([lb,ph,v,sv]: any)=>(
          <div key={lb} style={{flex:1,minWidth:140}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",marginBottom:6,letterSpacing:".03em"}}>{lb.toUpperCase()}</label>
            <input type="text" className={`inp${err&&!v.trim()?" inp-err":""}`} value={v} placeholder={ph} onChange={e=>{sv(e.target.value);if(err)setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} style={{border:`1.5px solid ${err&&!v.trim()?"#ef4444":"#e5e7eb"}`}}/>
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
  const [lang,setLang]=useState("uz");
  const [page,setPage]=useState("home");
  const [cand,setCand]=useState({name:"",surname:""});
  const [answers,setAnswers]=useState<any>({});
  const [cur,setCur]=useState(0);
  const [score,setScore]=useState<number | null>(null);
  const [attempt,setAttempt]=useState(1);
  const [ap,setAp]=useState("");const [ae,setAe]=useState("");
  const [results,setResults]=useState<any[]>([]);
  const [filt,setFilt]=useState("all");const [srch,setSrch]=useState("");
  const [music,setMusic] = useState(false);
  const [sk,setSk]=useState(0);const [sd,setSd]=useState(1);
  const [toast,setToast]=useState("");const [tv,setTv]=useState(false);
  const [sbSt,setSbSt]=useState("local");
  const [langOpen,setLangOpen]=useState(false);
  const [catS,setCatS]=useState<any>({});
  const actx=useRef<any>(null);const stopO=useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("al_lang");
      if (stored) setLang(stored);
    }
  }, []);

  useEffect(()=>{if (typeof window !== "undefined") localStorage.setItem("al_lang",lang);},[lang]);
  useEffect(()=>()=>{if(stopO.current)stopO.current();if(actx.current)actx.current.close();},[]);
  useEffect(()=>{const h=()=>setLangOpen(false);if(langOpen)document.addEventListener("click",h);return()=>document.removeEventListener("click",h);},[langOpen]);

  const toggleMusic=useCallback(()=>{
    if(music){if(stopO.current)stopO.current();if(actx.current){actx.current.close();actx.current=null;}setMusic(false);}
    else{const c=new(window.AudioContext||(window as any).webkitAudioContext)();actx.current=c;stopO.current=mkOcean(c);setMusic(true);}
  },[music]);

  const showToast=msg=>{setToast(msg);setTv(true);setTimeout(()=>setTv(false),1600);};
  const nav=(fn,dir=1)=>{setSd(dir);setSk(k=>k+1);fn();};
  const startTest=useCallback((name,surname)=>{setCand({name,surname});setAnswers({});setCur(0);setScore(null);nav(()=>setPage("test"));},[]);
  const selAns=oi=>{setAnswers(p=>({...p,[cur]:oi}));showToast(T[lang].mot[Math.floor(Math.random()*T[lang].mot.length)]);};
  const clrAns=()=>setAnswers(p=>{const n={...p};delete n[cur];return n;});
  const goQ=dir=>nav(()=>setCur(c=>c+dir),dir);

  const submitTest=async()=>{
    const qs=QS[lang];let s=0;const ck=["company","values","hr","conduct","innovation"];const cs={};ck.forEach(k=>cs[k]=0);
    qs.forEach((q,i)=>{if(answers[i]===q.ans){s++;cs[ck[Math.min(Math.floor(i/6),4)]]++;}});
    setScore(s);setCatS(cs);
    const status=s>=27?"passed":s>=20?"retry":"failed";
    setSbSt("local");
    if(SB_URL && SB_KEY){
      try{
        const r=await fetch(`${SB_URL}/rest/v1/assessment_results`,{method:"POST",headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":"return=minimal"},body:JSON.stringify({name:cand.name,surname:cand.surname,score:s,attempt,status,meta:{cats:cs}})});
        if(r.ok)setSbSt("cloud");
      }catch{}
    }
    nav(()=>setPage("results"));
  };

  const retryTest=()=>{setAttempt(a=>a+1);setAnswers({});setCur(0);setScore(null);nav(()=>setPage("test"));};
  const goHome=()=>{setCand({name:"",surname:""});setAnswers({});setCur(0);setScore(null);setAttempt(1);nav(()=>setPage("home"),-1);};
  const goLogin=()=>{setAp("");setAe("");setPage("login");};
  const doLogin=async()=>{
    if(ap!==ADMIN_PASS){setAe(T[lang].adm.wrong);return;}setAe("");setPage("admin");
    if(SB_URL&&SB_KEY){
      try{
        const r=await fetch(`${SB_URL}/rest/v1/assessment_results?select=*&order=created_at.desc`,{headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`}});
        if(r.ok){const d=await r.json();setResults(d);}
      }catch{}
    }
  };

  const clearDatabase=async()=>{
    if(!window.confirm("Delete all rows from database?"))return;
    if(SB_URL&&SB_KEY){
      try{
        const r=await fetch(`${SB_URL}/rest/v1/assessment_results?score=neq.-1`,{method:"DELETE",headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`}});
        if(r.ok){setResults([]);showToast("Cleared!");}
      }catch{}
    }
  };

  const exportCSV=()=>{
    let c="Name,Surname,Score,Percentage,Attempt,Status,Date\n";
    results.forEach(r=>{const pct=Math.round((r.score/30)*100);c+=`"${r.name}","${r.surname}",${r.score},${pct}%,${r.attempt},"${r.status}","${r.created_at||""}"\n`;});
    const b=new Blob([c],{type:"text/csv;charset=utf-8;"}),u=URL.createObjectURL(b),a=document.createElement("a");
    a.href=u;a.setAttribute("download","alcana_results.csv");a.click();
  };

  const t=T[lang],qs=QS[lang],q=qs[cur],answered=Object.keys(answers).length;
  const slideClass=sd>0?"sr":"sl";

  // ─────────────────────────────────────────
  // HOME PAGE
  // ─────────────────────────────────────────
  if(page==="home") return(
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{CSS}</style>
      <Header sub={t.home.badge} onAdminClick={goLogin} music={music} onMusicToggle={toggleMusic} lang={lang} onLangClick={()=>setLangOpen(p=>!p)} languages={T} langOpen={langOpen} onLangSel={k=>setLang(k)}/>
      <section className="hero">
        <div className="hero-g1"></div><div className="hero-g2"></div><div className="hero-grid"></div>
        <div style={{position:"relative",zIndex:10,maxWidth:640,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",background:"rgba(34,197,94,.14)",color:"#4ade80",padding:"6px 14px",borderRadius:20,fontSize:12.5,fontWeight:700,letterSpacing:".04em",marginBottom:24,border:"1px solid rgba(34,197,94,.2)"}}>✨ {t.home.badge.toUpperCase()}</div>
          <h1 style={{fontSize:46,fontWeight:900,color:#ffffff,letterSpacing:"-.03em",lineHeight:1.1,marginBottom:14}}>{t.home.hero}</h1>
          <p style={{fontSize:17,color:"#a7f3d0",fontWeight:500,maxWidth:480,margin:"0 auto 28px",lineHeight:1.5}}>{t.home.sub}</p>
          <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
            <div className="glass-card"><p style={{fontSize:12,color:"#93c5fd",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>🎯 CRITERIA</p><p style={{fontSize:15,color:"#fff",fontWeight:700}}>27+ {t.home.s27} / 20+ {t.home.s20}</p></div>
            <div className="glass-card"><p style={{fontSize:12,color:"#a7f3d0",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>⏱️ TIMING</p><p style={{fontSize:15,color:"#fff",fontWeight:700}}>{t.home.dur}</p></div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 52" preserveAspectRatio="none" style={{width:"100%",height:"100%"}}><path d="M0,30 C240,50 480,10 720,30 C960,50 1200,10 1440,30 L1440,52 L0,52 Z" fill="#f9fafb"/></svg>
        </div>
      </section>
      <div style={{maxWidth:640,margin:"0 auto",padding:"8px 16px 48px"}}>
        <div className="au"><NameForm t={t.home} onStart={startTest}/></div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // TEST PAGE
  // ─────────────────────────────────────────
  if(page==="test") return(
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",top:80,left:"50%",pointerEvents:"none",zIndex:999,opacity:tv?1:0,transition:"opacity .25s"}}>
        <div style={{background:"#16a34a",color:"#fff",borderRadius:24,padding:"10px 22px",fontWeight:700,fontSize:14,boxShadow:"0 4px 20px rgba(22,163,74,.45)",whiteSpace:"nowrap",transform:"translateX(-50%)"}}>{toast}</div>
      </div>
      <Header sub={`${cand.name} ${cand.surname} · ${attempt} ${t.test.att}`} lang={lang} languages={T}/>
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 40px"}}>
        <div className="card card-p au" style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#6b7280",marginBottom:10,fontWeight:500}}>
            <span>📝 <span style={{color:"#111827",fontWeight:700}}>{answered}</span> / {qs.length} {t.test.ans}</span>
            <span>{t.test.q} <span style={{color:"#16a34a",fontWeight:700}}>{cur+1}</span> / {qs.length}</span>
          </div>
          <div className="prog"><div className="prog-f" style={{width:`${(answered/qs.length)*100}%`}}/></div>
        </div>
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
                <span className="opt-lbl">{String.fromCharCode(65+oi)}</span>
                <span style={{flex:1}}>{opt}</span>
                {sel&&<span className="chk">✅</span>}
              </button>
            );
          })}
          {answers[cur]!==undefined && <button className="btn btn-s" onClick={clrAns} style={{marginTop:8,fontSize:12.5,padding:"8px 14px",borderRadius:8}}>{t.test.clear}</button>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:24}}>
          <button className="btn btn-s" onClick={()=>goQ(-1)} disabled={cur===0} style={{padding:"11px 20px"}}>{t.test.prev}</button>
          {cur<qs.length-1 ? (
            <button className="btn btn-p" onClick={()=>goQ(1)} style={{padding:"11px 24px"}}>{t.test.next}</button>
          ) : (
            <button className="btn btn-p btn-p-glow" onClick={submitTest} disabled={answered<qs.length} style={{padding:"11px 28px"}}>{t.test.sub} {answered<qs.length?`(${qs.length-answered} ${t.test.unans})`:""}</button>
          )}
        </div>
        <div className="card card-p au" style={{background:"#f9fafb"}}>
          <p style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".04em",marginBottom:10}}>{t.test.jump}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {qs.map((_,i)=>{
              const done=answers[i]!==undefined,isCur=i===cur;
              const bg=isCur?"#16a34a":done?"#bbf7d0":"#fff";
              const co=isCur?"#fff":done?"#166534":"#4b5563";
              const bd=isCur?"#16a34a":done?"#86efac":"#e5e7eb";
              return <button key={i} className="ndot" onClick={()=>nav(()=>setCur(i),i>cur?1:-1)} style={{background:bg,color:co,borderColor:bd}}>{i+1}</button>;
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // RESULTS PAGE
  // ─────────────────────────────────────────
  if(page === "results" && score !== null) {
    const isPassed=score>=27,isRetry=score>=20&&score<27;
    const cl=isPassed?"#16a34a":isRetry?"#d97706":"#dc2626";
    const title=isPassed?t.res.cong:isRetry?t.res.again:t.res.sorry;
    return(
      <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
        <style>{CSS}</style>
        <Header sub={cand.name+" "+cand.surname} lang={lang} languages={T}/>
        <div style={{maxWidth:440,margin:"40px auto",padding:"0 16px"}}>
          <div className="card card-p-lg bi" style={{textAlign:"center",boxShadow:"0 20px 40px rgba(0,0,0,.08)"}}>
            <h2 style={{fontSize:28,fontWeight:900,color:cl,marginBottom:6,letterSpacing:"-.02em"}}>{title}</h2>
            <div style={{fontSize:68,fontWeight:900,color:cl,margin:"14px 0 6px",letterSpacing:"-.04em"}}>{score}<span style={{fontSize:24,color:"#9ca3af",fontWeight:500}}>/30</span></div>
            <div style={{fontSize:18,fontWeight:800,color:"#111827",marginBottom:20}}>{Math.round((score/30)*100)}%</div>
            <div style={{background:"#f9fafb",borderRadius:12,padding:"14px 16px",marginBottom:18,fontSize:14,color:isPassed?"#166534":isRetry?"#92400e":"#991b1b",lineHeight:1.7,textAlign:"left"}}>
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
      <style>{CSS}</style>
      <Header sub={t.adm.sub} lang={lang} languages={T}/>
      <div style={{maxWidth:380,margin:"60px auto",padding:"0 16px"}}>
        <div className="card card-p-lg si" style={{textAlign:"center",boxShadow:"0 20px 40px rgba(0,0,0,.1)"}}>
          <div style={{width:72,height:72,borderRadius:20,background:"#f0fdf4",border:"2px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:34}}>🔐</div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#111827",marginBottom:6}}>{t.adm.title}</h2>
          <p style={{fontSize:13,color:"#6b7280",marginBottom:20}}>{t.adm.sub}</p>
          <input type="password" className="inp" value={ap} placeholder={t.adm.pLbl} onChange={e=>setAp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{textAlign:"center",letterSpacing:"4px",fontSize:18,marginBottom:12}}/>
          {ae&&<div style={{color:#dc2626,fontSize:13,fontWeight:600,marginBottom:12}}>{ae}</div>}
          <div style={{display:"flex",gap:8,marginTop:6}}>
            <button className="btn btn-s" onClick={goHome} style={{flex:1}}>←</button>
            <button className="btn btn-p" onClick={doLogin} style={{flex:2}}>{t.adm.login}</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // ADMIN PANEL
  // ─────────────────────────────────────────
  if(page==="admin") {
    const list=results.filter(r=>{if(filt==="all")return true;return r.status===filt;}).filter(r=>{if(!srch.trim())return true;const fn=r.name||"",ln=r.surname||"";return(fn+" "+ln).toLowerCase().includes(srch.toLowerCase());});
    const cTot=results.length,cPas=results.filter(r=>r.status==="passed").length,cRet=results.filter(r=>r.status==="retry").length,cFai=results.filter(r=>r.status==="failed").length;
    return(
      <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'Inter',system-ui,sans-serif"}}>
        <style>{CSS}</style>
        <Header sub="Dashboard" onExit={goHome} lang={lang} languages={T}/>
        <div style={{maxWidth:1120,margin:"24px auto",padding:"0 16px 48px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div><h2 style={{fontSize:24,fontWeight:900,color:"#111827",letterSpacing:"-.02em"}}>{t.adm.title}</h2><p style={{fontSize:13.5,color:"#6b7280"}}>Connected to: <span style={{fontWeight:700,color:"#16a34a"}}>{t.adm.sb}</span></p></div>
            <div style={{display:"flex",gap:8}}><button className="btn btn-s" onClick={exportCSV} disabled={results.length===0}>{t.adm.exp}</button><button className="btn btn-s" onClick={clearDatabase} disabled={results.length===0} style={{borderColor:"#fee2e2",color:"#991b1b"}}>{t.adm.clr}</button></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
            {[[t.adm.tot,cTot,"#111827","#fff"],[t.adm.pass,cPas,"#16a34a","#f0fdf4"],[t.adm.ret,cRet,"#d97706","#fffb2e2"],[t.adm.fail,cFai,"#dc2626","#fee2e2"]].map(([lb,val,co,bg]: any)=>(
              <div key={lb} className="card card-p" style={{background:bg,borderColor:co+"22",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><p style={{fontSize:12,fontWeight:700,color:co,textTransform:"uppercase",letterSpacing:".04em",opacity:.8}}>{lb}</p><p style={{fontSize:28,fontWeight:900,color:co,marginTop:2}}>{val}</p></div>
                <div style={{fontSize:24,opacity:.25}}>📊</div>
              </div>
            ))}
          </div>
          <div className="card" style={{overflow:"hidden",boxShadow:"0 10px 30px rgba(0,0,0,.04)"}}>
            <div style={{padding:"16px 20px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:6}}>
                {["all","passed","retry","failed"].map(k=>{
                  const active=filt===k,lbl=k==="all"?t.adm.all:k==="passed"?t.adm.pass:k==="retry"?t.adm.ret:t.adm.fail;
                  return <button key={k} className="btn btn-s" onClick={()=>setFilt(k)} style={{padding:"6px 12px",fontSize:12.5,borderRadius:6,background:active?"#111827":"#fff",color:active?"#fff":"#374151",borderColor:active?"#111827":"#e5e7eb"}}>{lbl}</button>;
                })}
              </div>
              <input type="text" className="inp" value={srch} placeholder={t.adm.search} onChange={e=>setSrch(e.target.value)} style={{maxWidth:240,padding:"8px 14px",fontSize:13.5,borderRadius:6}}/>
            </div>
            <div style={{overflowX:"auto"}}>
              <table className="tbl">
                <thead style={{background:"#111827"}}>
                  <tr>{t.adm.hdrs.map(h=><th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {list.map((r,i)=>{
                    const cl=r.status==="passed"?"#16a34a":r.status==="retry"?"#f59e0b":"#ef4444";
                    const lbl=r.status==="passed"?t.adm.pL:r.status==="retry"?t.adm.rL:t.adm.fL;
                    const cls=r.status==="passed"?"bdg bdg-p":r.status==="retry"?"bdg bdg-r":"bdg bdg-f";
                    return(
                      <tr key={i}>
                        <td style={{color:"#d1d5db",fontWeight:700,fontSize:12}}>{i+1}</td>
                        <td style={{fontWeight:700,color:"#111827"}}>{r.name} {r.surname}</td>
                        <td style={{fontWeight:900,color:cl,fontSize:16,letterSpacing:"-.01em"}}>{r.score}<span style={{fontSize:12,fontWeight:400,color:"#9ca3af"}}>/30</span></td>
                        <td style={{fontWeight:700,color:cl}}>{Math.round((r.score/30)*100)}%</td>
                        <td style={{textAlign:"center",color:"#9ca3af",fontWeight:500}}>{r.attempt}</td>
                        <td><span className={cls}>{lbl}</span></td>
                        <td style={{color:"#9ca3af",fontSize:12.5}}>{r.created_at?new Date(r.created_at).toLocaleDateString():r.date||\"\"}</td>
                      </tr>
                    );
                  })}
                  {list.length===0&&<tr><td colSpan={7} style={{textAlign:"center",padding:"32px 16px",color:"#9ca3af",fontWeight:500}}>{t.adm.none}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}