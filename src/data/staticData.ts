/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Badge, FactItem, FableComparison, QuizItem } from '../types';

export const BADGES: Badge[] = [
  {
    id: "first_step",
    name: "Ilk Qadam",
    icon: "Sparkles",
    description: "Sharq va G'arb ta'lim olamiga ilk bor kirdi",
    level: "Boshlang'ich"
  },
  {
    id: "abacus_master",
    name: "Soroban Ustasi",
    icon: "Cpu",
    description: "東 (Sharq) abakusida 5 ta ketma-ket misolni to'g'ri bajardi",
    level: "Kashfiyotchi"
  },
  {
    id: "inquiry_detective",
    name: "Savolxon Detektiv",
    icon: "Search",
    description: "G'arbiy tabiat tadqiqotlarida 'Nega?' savollariga to'g'ri javob topdi",
    level: "Arximed"
  },
  {
    id: "harmonious_mind",
    name: "Uyg'un Tafakkur",
    icon: "Compass",
    description: "Sharq intizomi va G'arb ijodkorligini birlashtiruvchi ko'prikdan o'tdi",
    level: "Donishmand"
  },
  {
    id: "zen_focus",
    name: "Zen Diqqat",
    icon: "Moon",
    description: "1-daqiqa davomida nafas-fokus mashqlarini muvaffaqiyatli bajardi",
    level: "Kashfiyotchi"
  },
  {
    id: "quiz_champion",
    name: "Bilimlar Sultoni",
    icon: "Trophy",
    description: "Integral testlardan 100% to'g'ri natijaga erishdi",
    level: "Donishmand"
  }
];

export const FACTS: FactItem[] = [
  {
    id: "fact_1",
    title: "Tezkor Hisob-Kitob",
    category: "Matematika",
    eastPerspective: "Sharqda (masalan, Yaponiya va Xitoy) bolalar qadimiy 'Soroban' abakuysidan foydalanib, sonlarni rasm shaklida ko'z oldiga keltiradilar va kalkulyatordan ham tezroq miyada hisoblaydilar (Anzan mashqi).",
    westPerspective: "G'arbda esa matematika vizual o'yinlar, amaliy mantiqiy bloklar va tenglamalarning hayotiy misollari yordamida o'rgatiladi, ijodiy muammolarni yechishga e'tibor qaratiladi.",
    funTask: "Soroban o'yinida 3 ta xonali hisobni miyangizda rasm qilib hisoblab ko'ring!",
    funTaskType: "abacus"
  },
  {
    id: "fact_2",
    title: "Yozuv va San'at sirlari",
    category: "San'at va Yozuv",
    eastPerspective: "Sharqiy xattotlikda (Kalligrafiya) har bir chiziq nafas olish ritmi, qat'iy intizom va qalb xotirjamligini talab qiladi. Yozuv - bu diqqatni jamlash meditatsiyasidir.",
    westPerspective: "G'arbda esa bolalar yozish davomida erkin eskiz chizishga, harflarning tipografiyasi bilan tajriba qilishga va o'z his-tuyg'ularini ranglar orqali cheklovsiz ifodalashga rag'batlantiriladi.",
    funTask: "Qog'ozga bitta so'zni juda sekin va chiroyli yozib, so'ng uning atrofiga erkin rasmlar chizing!",
    funTaskType: "focus"
  },
  {
    id: "fact_3",
    title: "Tabiatni o'rganish usullari",
    category: "Tabiatshunoslik",
    eastPerspective: "Sharq ta'limida tabiat bilan butunlik va uyg'unlik his qilinadi. Bolalar tabiatni jimgina kuzatib, barcha jonzotlarga hurmat va rahmdillik tuyg'ularini tarbiyalaydilar.",
    westPerspective: "G'arbda fan darslari qiziqarli tajribalar orqali o'tiladi: 'Agar suvga tuz solsak nima bo'ladi?', 'Nega barglar yashil?'. Tajribalar, faol tekshiruv va mikroskoplar asosiy quroldir.",
    funTask: "Xonangizdagi o'simlikni 1 daqiqa kuzating (Sharqona), so'ng uning barglari nima uchun quyoshga qarab o'sishini tadqiq qilib savol bering (G'arbona)!",
    funTaskType: "inquiry"
  },
  {
    id: "fact_4",
    title: "Muammolarni yechish (Sokrat va Konfutsiy)",
    category: "Falsafa va Odob",
    eastPerspective: "Konfutsiy yondashuvida o'zaro hurmat, oila va murabbiylarning ko'pming yillik hikmatlariga quloq solish, qat'iy muloqot odobi va jamiyat totuvligi boshlang'ich qadriyatdir.",
    westPerspective: "Sokrat usulida esa o'qituvchi tayyor javobni aytmaydi. U o'quvchiga ketma-ket savollar berib, xatolarini o'quvchining o'ziga topdiradi va mustaqil fikrlay olish qobiliyatini rivojlantiradi.",
    funTask: "Dono Bobodan o'z muammoingizga maslahat so'rang va u bergan savollarga javob izlang!",
    funTaskType: "inquiry"
  }
];

export const FABLES: FableComparison[] = [
  {
    id: "fable_1",
    title: "Mehnat va Intizom darsi",
    eastFableTitle: "Yapon Ertagi: Sadoqatli Bo'ri",
    eastFableSummary: "Bo'ri qishloq ahlining mehnatsevarligini va yerga bo'lgan hurmatini ko'rib, ularning bog'larini himoya qiladi. Dehqonlar o'z vaqtida, intizom bilan mehnat qiladi va tabiat ularni mukofotlaydi.",
    eastMoral: "Hikmat: Hurmat, tartib-intizom va sadoqat hamjamiyat va muvaffaqiyatning kalitidir.",
    westFableTitle: "Ezop Masali: Chumoli va Ninachi",
    westFableSummary: "Chumoli yoz bo'yi mehnat qilib qishga ozuqa to'playdi, ninachi esa faqat qo'shiq aytadi. Qish kelganda qiynalgan ninachi mehnatning qanchalik muhimligini tushunib yetadi.",
    westMoral: "Hikmat: Kelajakni rejalashtirish, oqilona harakat va shaxsiy mas'uliyat muhimdir.",
    bridgeMessage: "Uchrashuv Ko'prigi: Har ikkala ertak ham mehnatga chorlaydi, ammo Sharq jamoaviy uyg'unlikka, G'arb esa shaxsiy oqibat va mas'uliyatga ko'proq e'tibor qaratadi."
  },
  {
    id: "fable_2",
    title: "Zehn va Topqirlik",
    eastFableTitle: "Afandi va qozonning tug'ilishi",
    eastFableSummary: "Nasriddin Afandi qo'shnisidan qozon olib, qaytarishda ichiga kichkina qozoncha solib beradi va qozon tug'di deydi. Keyingi safar katta qozonni olib, o'ldi deb qaytarmaydi.",
    eastMoral: "Hikmat: Birovning haqqiga ko'zi uchgan kishi o'zining tayyor narsasidan ham ayrilishi mumkin (Zehn va o'tkir hazil orqali tarbiya).",
    westFableTitle: "Arximed va Toj siri",
    westFableSummary: "Sardor podshohning toji soxta oltindan yasalganini gubka orqali isbotlash uchun vannada cho'milayotganda suv toshishini kuzatadi va 'Evrika!' deb ko'chaga yuguradi, gidrostatik qonunni kashf qiladi.",
    westMoral: "Hikmat: Har qanday muammoni faqat ko'r-ko'rona ishonmay, ilmiy o'lchovlar va amaliy kashfiyotlar orqali yechish kerak.",
    bridgeMessage: "Uchrashuv Ko'prigi: Zehn - o'tkir aql bo'lib, u Sharqda insoniy munosabatlarni tartibga soluvchi o'yin yordamida, G'arbda esa tabiat fizika qonunlarini ochishda ishlatiladi."
  }
];

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: "q_1",
    question: "Abakus (Soroban) simidagi tepadagi bitta tosh qanday qiymatni bildiradi?",
    options: ["1", "5", "10", "100"],
    answerIndex: 1,
    explanation: "Sharqiy Soroban abakusida tepadagi har bir tosh besh (5) qiymatini, pastdagi har bir tosh esa bir (1) qiymatini bildiradi.",
    source: "east",
    topic: "Mental Arifmetika"
  },
  {
    id: "q_2",
    question: "Sokratik savol-javob usulining asosiy maqsadi nima?",
    options: [
      "Tayyor javobni yodlash",
      "Ketma-ket savollar berib, insonni o'zi mustaqil haqiqatni topishiga undash",
      "Darsda qat'iy jimgina o'tirish",
      "Faqat kitobdan o'qib berish"
    ],
    answerIndex: 1,
    explanation: "G'arb faylasufi Sokrat odamlarga tayyor javob bermagan, balki to'g'ri yo'naltiruvchi savollar orqali ularni o'ylashga va mustaqil yechim topishga o'rgatgan.",
    source: "west",
    topic: "Inson va Jamiyat"
  },
  {
    id: "q_3",
    question: "Xitoyda ixtiro qilingan va bugungi kunda dunyo bo'ylab bilim yozishda ishlatiladigan eng muhim narsa qaysi?",
    options: ["Kompyuter", "Qog'oz", "Teleskop", "Plastilin"],
    answerIndex: 1,
    explanation: "Qog'oz qadimgi Sharqda (Xitoyda Tsay Lun tomonidan) ixtiro qilingan bo'lib, u keyinchalik G'arbdagi Gutenberg bosmaxonasi bilan birlashib, dunyoga ilm tarqalishiga xizmat qilgan.",
    source: "bridge",
    topic: "Kashfiyotlar tarixi"
  },
  {
    id: "q_4",
    question: "Ilmiy tajriba o'tkazayotganda, kashfiyot qilishning eng birinchi bosqichi nima?",
    options: ["Natijani sotish", "Kuzatish va 'Nega bunday bo'ldi?' deb savol berish", "Ko'zni yumib uxlash", "Xatoni yashirish"],
    answerIndex: 1,
    explanation: "G'arbiy tadqiqot usulida eng muhimi - sinchkovlik bilan kuzatish va unga gipoteza (taxmin) tuzish, so'ng tajriba orqali tekshirish hisoblanadi.",
    source: "west",
    topic: "Tabiiy fanlar"
  },
  {
    id: "q_5",
    question: "Sharqdagi Konfutsiy ta'limotida o'quvchining ustozga bo'lgan munosabati qanday bo'lishi kerak?",
    options: [
      "Doimiy tortishish va bahslashish",
      "Sadoqat, chuqur hurmat va o'gitlarini hayotga tatbiq etish",
      "Darslarni umuman pisand qilmaslik",
      "Faqat sovg'alar berib baho olish"
    ],
    answerIndex: 1,
    explanation: "Konfutsiy ta'limining asosi - ustozni otadek ulug'lash, uning hikmatli saboqlarini chuqur odob va intizom bilan o'rganishdir.",
    source: "east",
    topic: "Odobnoma"
  }
];
