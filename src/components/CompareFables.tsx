/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, AlertCircle, Compass, Smile, Award, ArrowUpRight } from 'lucide-react';
import { FABLES } from '../data/staticData';
import { FableComparison } from '../types';

interface CompareFablesProps {
  onEarnStars: (amount: number, track: 'east' | 'west' | 'bridge') => void;
  onUnlockBadge: (badgeId: string) => void;
}

export default function CompareFables({ onEarnStars, onUnlockBadge }: CompareFablesProps) {
  const [selectedFableIndex, setSelectedFableIndex] = useState(0);
  const [completedMatches, setCompletedMatches] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  // Virtue match mini-game questions
  const MATCHING_GAME = [
    {
      id: "m_1",
      question: "Mehnatsevarlik, mo'tadillik va rejalashtirish hikmatini eng kuchli tarbiyalovchi fazilat qaysi?",
      options: ["O'zaro Hurmat", "Ehtiyotkorlik va Mehnatsevarlik", "Ilmiy Quruvchilik", "Xushomadgo'ylik"],
      correct: "Ehtiyotkorlik va Mehnatsevarlik",
      reward: 15,
      explanation: "Har ikkala madaniyatda (Yapon ertagida dehqonlar mehnatsevarligi, Ezopda esa chumolilarning g'ayrati) vaqtida mehnat qilish siri ulug'lanadi!"
    },
    {
      id: "m_2",
      question: "Uchqun aql va sinchkovlik muammoning ildizini ochib beradi. Buni qaysilar ifodalaydi?",
      options: ["Afandining zukkoligi va Arximedning kashfiyoti", "Faqat sokinlik", "Faol qo'shiq aytish", "Xayolparastlik"],
      correct: "Afandining zukkoligi va Arximedning kashfiyoti",
      reward: 20,
      explanation: "To'ppa-to'g'ri! Sharqda bu inson munosabatlarini tarbiyalovchi o'tkir kulgi (Nasriddin Afandi), G'arbda esa tabiat fizika muammolarini yechuvchi ilmiy mantiq (Arximed) shaklida namoyon bo'ladi."
    }
  ];

  const handleMatchAnswer = (matchId: string, option: string, correctOption: string, points: number) => {
    if (completedMatches.includes(matchId)) return;

    if (option === correctOption) {
      setCompletedMatches(prev => [...prev, matchId]);
      setSelectedMatch("correct");
      setCorrectCount(prev => prev + 1);
      onEarnStars(points, 'bridge');

      // If finished all matching mini games
      if (completedMatches.length + 1 === MATCHING_GAME.length) {
        onUnlockBadge('harmonious_mind');
      }
    } else {
      setSelectedMatch("incorrect");
    }
  };

  const currentFable: FableComparison = FABLES[selectedFableIndex];

  return (
    <div id="compare-fables-section" className="space-y-8 max-w-5xl mx-auto">
      {/* Visual Navigation Tab */}
      <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase mb-2">
            <BookOpen className="w-3" /> Ertaklar va donolik uyg'unligi
          </span>
          <h2 className="text-2xl font-black font-sans text-stone-800 tracking-tight">
            Ibratli Hikoyalar Ko'prigi
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Sharq va G'arb xalq og'zaki ijodi, masallari hamda buyuk kashfiyot voqealarini taqqoslab o'rganing!
          </p>
        </div>

        {/* Story Selector Buttons */}
        <div className="flex gap-2">
          {FABLES.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFableIndex(idx);
                setSelectedMatch(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedFableIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-600'
              }`}
            >
              {idx + 1}-Taqqoslash: {f.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Side-by-Side Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eastern Fable Card */}
        <motion.div
          key={`east-${currentFable.id}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle eastern design watermark */}
          <div className="absolute top-2 right-4 text-6xl text-amber-50 font-serif pointer-events-none font-bold select-none">
            東
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mb-4 inline-block">
              Sharq Rivoyatlari
            </span>
            <h3 className="text-lg font-bold text-stone-800 mt-1">
              {currentFable.eastFableTitle}
            </h3>
            <div className="text-stone-600 text-sm mt-4 leading-relaxed bg-stone-50/50 p-4 rounded-xl border border-stone-100">
              <p className="indent-4">{currentFable.eastFableSummary}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-50">
            <div className="flex items-start gap-2.5 bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
              <span className="text-amber-600 text-xl font-bold">✨</span>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-amber-800">Sharqona Hikmat & Odob</h4>
                <p className="text-xs font-semibold text-amber-950 mt-0.5 leading-relaxed">{currentFable.eastMoral}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Western Fable Card */}
        <motion.div
          key={`west-${currentFable.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 border border-blue-100 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle western design watermark */}
          <div className="absolute top-2 right-4 text-6xl text-blue-50 font-mono pointer-events-none font-bold select-none">
            W
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-4 inline-block">
              G'arb Masallari
            </span>
            <h3 className="text-lg font-bold text-stone-800 mt-1">
              {currentFable.westFableTitle}
            </h3>
            <div className="text-stone-600 text-sm mt-4 leading-relaxed bg-stone-50/50 p-4 rounded-xl border border-stone-100">
              <p className="indent-4">{currentFable.westFableSummary}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-50">
            <div className="flex items-start gap-2.5 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
              <span className="text-blue-600 text-xl font-bold">🧪</span>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-blue-800">G'arbona Mantiq & Muammo mustaqilligi</h4>
                <p className="text-xs font-semibold text-blue-950 mt-0.5 leading-relaxed">{currentFable.westMoral}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Synthesis / Core Bridge Banner */}
      <motion.div
        key={`bridge-${currentFable.id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-indigo-950 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-400/20">
                Uyg'unlik Ko'prigi
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h4 className="text-lg font-bold text-emerald-300">Har ikkala dunyoning eng yaxshi saboqlari:</h4>
            <p className="text-sm text-stone-200 mt-2 leading-relaxed">
              {currentFable.bridgeMessage}
            </p>
          </div>
          <div className="lg:col-span-1 bg-indigo-900/50 p-4 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase block text-indigo-300 font-extrabold tracking-wider">Metodlarni Birlashtir</span>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Yozuvda Sharqona <b>intizom</b>, Tabiatda G'arbona <b>tadqiqot</b> - bu oliy muvaffaqiyat formulasidir!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Interactive Virtue Matching Minigame */}
      <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-800 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-500" /> "Fazilatlar Ko'prigi" mini-o'yini
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Hikoyalardan olgan saboqlaringizni rasm-savollar yordamida tekshiring va ko'prikni mustahkamlang!
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl font-bold font-mono text-xs">
            To'g'ri javoblar: {correctCount} / {MATCHING_GAME.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MATCHING_GAME.map((game, idx) => {
            const isCompleted = completedMatches.includes(game.id);
            return (
              <div
                key={game.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 opacity-90'
                    : 'bg-indigo-50/20 border-indigo-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    ⭐ +{game.reward} ball
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-800 leading-relaxed mb-4">
                  {game.question}
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  {game.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      disabled={isCompleted}
                      onClick={() => handleMatchAnswer(game.id, opt, game.correct, game.reward)}
                      className={`text-left p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        isCompleted && opt === game.correct
                          ? 'bg-emerald-600 border-emerald-700 text-white'
                          : isCompleted
                          ? 'bg-stone-50 text-stone-400 border-stone-200'
                          : 'bg-white border-stone-200 hover:bg-indigo-50 hover:border-indigo-300 text-stone-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-[11px] text-emerald-800 bg-emerald-100 p-2.5 rounded-lg font-medium leading-relaxed"
                  >
                    🎉 <b>To'g'ri:</b> {game.explanation}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {selectedMatch === "incorrect" && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 animate-bounce" /> Qaytadan urinib ko'ring! To'g'ri saboqni chuqurroq o'ylab chiqing.
          </div>
        )}
      </div>
    </div>
  );
}
