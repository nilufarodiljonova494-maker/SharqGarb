/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, AlertCircle, MessageSquare, ArrowRight, RefreshCw, Swords, User } from 'lucide-react';
import { Message } from '../types';

interface SagesRoomProps {
  onEarnStars: (amount: number, track: 'east' | 'west' | 'bridge') => void;
  onUnlockBadge: (badgeId: string) => void;
}

const OFFLINE_DILEMMAS = [
  {
    question: "Kitob o'qish yaxshimi yoki o'yin o'ynash?",
    donoBobo: "Sharqona Hikmat (Dono Bobo): Har ikkalasi o'z o'rnida go'zal! Kitob - bu ongingizni charxlovchi chiroqdir. O'yin esa tanangizni chiniqtiradi. Ammo, agar tartib-intizom bo'lmasa, o'yin insonni dangasa qilishi mumkin. Shuning uchun, avval darslaringizni mukammal qilib o'qing (Sharq), so'ng erkin tadqiqot o'yinlariga vaqt ajrating!",
    profSpark: "G'arbona Mantiq (Professor Spark): Qiziqarli o'yinlar aslida kashshoflikning eng zo'r yo'lidir! Biz o'yin davomida fizika qonunlarini, matematika sirlarini mustaqil kashf qilamiz. Ammo kitoblar boshqa kashfiyotchilarning xaritalaridir. Kitob o'qish orqali yangi o'yinlar haqida tasavvurga ega bo'lasiz. Shuning uchun ikkalasini birlashtiring!"
  },
  {
    question: "Inson qanday qilib daho (eng aqlli) bo'ladi?",
    donoBobo: "Sharqona Hikmat (Dono Bobo): Buyuk daho bo'lish uchun uch narsa muhimdir: Birinchisi - Murabbiylar (Ustoz) va ota-onaga say-harakat bilan xizmat qilib fotiha olish, ikkinchisi - sabrlilik va diqqatni faqat bitta maqsadga yo'naltira olish, uchinchisi - xattotlik kabi sohalar bilan ongni harakatsiz to'g'irlash.",
    profSpark: "G'arbona Mantiq (Professor Spark): Aqlli bo'lishning eng katta siri - 'Nega?' savolidan qo'rqmaslikdir! Doimiy ravishda tabiat hodisalarini kuzatish, xato qilish, yangiliklar o'rtasida tajriba o'tkazish, muammolarni qayta-qayta yechish va dunyo xaritasini o'zgartirishdan hayajonlanish buyuk ixtirolarga olib boradi!"
  }
];

export default function SagesRoom({ onEarnStars, onUnlockBadge }: SagesRoomProps) {
  const [activePersona, setActivePersona] = useState<'wisdom' | 'invention'>('wisdom');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Assalomu alaykum, aziz shogirdim! Men Dono Boboman. Sharqiy falsafa, xattotlik va buyuk donishmandlar sirlari haqida mendan so'rashingiz mumkin.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  // Debate visual triggers
  const [debateIdx, setDebateIdx] = useState<number | null>(null);

  const handleSwitchPersona = (persona: 'wisdom' | 'invention') => {
    setActivePersona(persona);
    const greetingText = persona === 'wisdom'
      ? "Assalomu alaykum, aziz shogirdim! Men Dono Boboman. Sharqiy falsafa, xattotlik va buyuk donishmandlar sirlari haqida mendan so'rashingiz mumkin."
      : "Salom, do'stim! Men muhandis va tadqiqotchi Professor Sparkman. G'arbdagi ilmiy tajribalar, 'Evrika' kashfiyotlari, 'Nega?' savollari haqida muloqot qilamiz!";

    setMessages([
      {
        role: 'model',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setDebateIdx(null);
    setErrMessage("");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isPending) return;

    const userText = inputValue;
    setInputValue("");
    setErrMessage("");

    const newMsgs = [...messages, {
      role: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
    setMessages(newMsgs);
    setIsPending(true);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          persona: activePersona,
          history: newMsgs.slice(-6).map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Tizim uzilishi yuz berdi. Offline yordam tizimidan foydalanamiz!");
      }

      const data = await response.json();
      if (data && data.text) {
        setMessages(prev => [...prev, {
          role: 'model',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        onEarnStars(10, activePersona === 'wisdom' ? 'east' : 'west');
      } else {
        throw new Error("Bo'sh javob");
      }
    } catch (err: any) {
      setErrMessage("AI tarmoq so'rovi isitilmoqda. Quyidagi tayyor donolik savollaridan birini tanlang!");
      // Fallback response based on simple offline key matches
      let fallbackText = "Kechirasiz, aqlli AI ko'prik tarmog'imiz hozircha to'yinmoqda. Ekrandagi qiziqarli munozara tugmalarini bosib, mening va Professorning tayyor donishmandlik o'gitlarimizni darhol o'qib olishingiz mumkin!";

      if (userText.toLowerCase().includes("matematika") || userText.toLowerCase().includes("abakus")) {
        fallbackText = "Abakus (Soroban) simlari qadimgi Sharqda hisob kitobni miyada shunchaki tasvirlab tez va mustaqil hisoblash uchun mo'ljallangan oliy tarbiyadir!";
      } else if (userText.toLowerCase().includes("tajriba") || userText.toLowerCase().includes("kashfiyot")) {
        fallbackText = "G'arbdagi ilmiy tajribalar esa tabiatni sinovlar orqali isbotlashga tayanadi. Doim 'Agar ... qilsam, nima bo'ladi?' deb o'ylang!";
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsPending(false);
    }
  };

  const handleSimulateDebate = (idx: number) => {
    setDebateIdx(idx);
    const dilemma = OFFLINE_DILEMMAS[idx];
    setMessages([
      {
        role: 'user',
        text: `Munozara mavzusi: ${dilemma.question}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        role: 'model',
        text: `👴 ${dilemma.donoBobo}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        role: 'model',
        text: `⚙️ ${dilemma.profSpark}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    onEarnStars(15, 'bridge');
  };

  return (
    <div id="sages-room-section" className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar: Mentor Presets & Debate games */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-rose-600 block mb-1">Ustoz va Mentorlarni Tanlash</span>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            <button
              onClick={() => handleSwitchPersona('wisdom')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                activePersona === 'wisdom' && debateIdx === null
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="text-xl">👴</div>
              <div>
                <b className="text-xs block">Dono Bobo</b>
                <span className="text-[9px] opacity-90 block">Sharqona saboqlar</span>
              </div>
            </button>

            <button
              onClick={() => handleSwitchPersona('invention')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                activePersona === 'invention' && debateIdx === null
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="text-xl">⚙️</div>
              <div>
                <b className="text-xs block">Professor Spark</b>
                <span className="text-[9px] opacity-90 block">G'arbiy kashfiyotlar</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick debates selector panel */}
        <div className="space-y-3 bg-stone-50 p-4 rounded-2.5xl border border-stone-200">
          <h4 className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5 uppercase tracking-wide">
            <Swords className="w-4 h-4 text-indigo-500 animate-pulse" /> Sokratik Bahslashuvlar
          </h4>
          <p className="text-[10px] text-stone-500">
            Har ikkala daho ustoz birgalikda eng qiziqarli bolalar dilemnalarini tahlil qilishini istaysizmi?
          </p>
          <div className="flex flex-col gap-1.5 mt-2">
            {OFFLINE_DILEMMAS.map((dil, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateDebate(idx)}
                className={`p-2 bg-white hover:bg-indigo-50 border hover:border-indigo-200 text-left text-[11px] font-bold text-stone-700 rounded-xl flex items-center justify-between ${
                  debateIdx === idx ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <span>{dil.question}</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Stream workspace */}
      <div className="lg:col-span-8 flex flex-col h-[400px] justify-between bg-stone-50 rounded-2.5xl border border-stone-200 p-4 overflow-hidden">
        {/* Stream chat cards container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {messages.map((m, idx) => {
            const isModel = m.role === 'model';
            return (
              <div
                key={idx}
                className={`flex gap-2 w-full ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs shadow select-none">
                    {m.text.includes("👴") || activePersona === 'wisdom' ? "👴" : "⚙️"}
                  </div>
                )}
                <div
                  className={`p-3 max-w-[80%] rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                    isModel
                      ? 'bg-white border border-stone-100 text-stone-800 rounded-tl-none'
                      : 'bg-indigo-650 text-white rounded-tr-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className="block text-right text-[8px] opacity-60 mt-1">{m.timestamp}</span>
                </div>
                {!isModel && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shadow">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
          {isPending && (
            <div className="flex gap-2 justify-start items-center">
              <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs animate-spin font-bold text-indigo-600">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-stone-500 font-bold italic animate-pulse">Ustoz chuqur o'ylamoqda, kuting...</span>
            </div>
          )}
        </div>

        {/* Form input messaging controller */}
        <div className="mt-4 pt-3 border-t border-stone-200">
          {errMessage && (
            <div className="text-[9px] text-amber-800 bg-amber-50 rounded px-2 py-1 mb-2 border border-amber-200">
              💡 {errMessage}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              disabled={isPending}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ustozga savol bering (Masalan: 'Ilm nimaga kerak?', 'Koinot qanday paydo bo'lgan?')..."
              className="flex-1 p-3 bg-white rounded-xl border border-stone-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isPending || !inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white rounded-xl px-4 py-3 shadow transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
