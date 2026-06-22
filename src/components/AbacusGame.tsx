/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, HelpCircle, Swords, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';

interface AbacusColumn {
  upper: boolean; // true if active (slid down)
  lower: number;  // 0 to 4 active (slid up)
}

interface MathQuest {
  question: string;
  targetValue: number;
  rewardStars: number;
  hint: string;
}

const ABACUS_QUESTS: MathQuest[] = [
  {
    question: "Abakusda 5 sonini hosil qiling. (Tepada bitta toshni pastga tushiring)",
    targetValue: 5,
    rewardStars: 10,
    hint: "Har bir ustundagi yuqori qismdagi tosh 5 qiymatiga ega."
  },
  {
    question: "Abakusda 9 sonini ko'rsating. (Bitta 5 toshi va to'rtta 1 toshini birga faollashtiring)",
    targetValue: 9,
    rewardStars: 15,
    hint: "Yuqori toshni pastga suring (5) va ostidagi barcha to'rtta toshni teppaga ko'taring (4)."
  },
  {
    question: "Keling 24 sonini hosil qilamiz! (O'nliklar ustunida 2, birliklar ustunida 4)",
    targetValue: 24,
    rewardStars: 20,
    hint: "O'ngdan ikkinchi ustun (o'nliklar) pastki qismidan 2 ta tosh ko'taring, o'ngdagi birinchi ustunda 4 ta ko'taring."
  },
  {
    question: "Ajoyib kashfiyot! Abakusda 57 sonini tasvirlang.",
    targetValue: 57,
    rewardStars: 25,
    hint: "O'nliklarda 5 (tepa tosh), birliklarda 7 (tepa 5 va pastdan 2 ta tosh)."
  },
  {
    question: "Murakkab sinov: 135 sonini ko'rsata olasizmi?",
    targetValue: 135,
    rewardStars: 30,
    hint: "Yuzliklarda 1 (pastdan 1), o'nliklarda 3 (pastdan 3), birliklarda 5 (tepadan 5)."
  }
];

interface AbacusGameProps {
  onEarnStars: (amount: number, track: 'east' | 'west' | 'bridge') => void;
  onUnlockBadge: (badgeId: string) => void;
  totalStars: number;
}

export default function AbacusGame({ onEarnStars, onUnlockBadge, totalStars }: AbacusGameProps) {
  // Columns from left to right: Thousands (Index 0), Hundreds (1), Tens (2), Ones (3)
  const [columns, setColumns] = useState<AbacusColumn[]>([
    { upper: false, lower: 0 }, // 1000s
    { upper: false, lower: 0 }, // 100s
    { upper: false, lower: 0 }, // 10s
    { upper: false, lower: 0 }  // 1s
  ]);

  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [questStatus, setQuestStatus] = useState<'playing' | 'success' | 'failed'>('playing');
  const [abacusSum, setAbacusSum] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [customInputVal, setCustomInputVal] = useState<number | null>(null);

  // Recalculate abacus sum when columns change
  useEffect(() => {
    let sum = 0;
    // index 0: 1000, 1: 100, 2: 10, 3: 1
    const multipliers = [1000, 100, 10, 1];
    columns.forEach((col, idx) => {
      let colValue = 0;
      if (col.upper) colValue += 5;
      colValue += col.lower;
      sum += colValue * multipliers[idx];
    });
    setAbacusSum(sum);
    setQuestStatus('playing');
  }, [columns]);

  const toggleUpperBead = (colIdx: number) => {
    setColumns(prev => prev.map((col, idx) => {
      if (idx === colIdx) {
        return { ...col, upper: !col.upper };
      }
      return col;
    }));
  };

  const setLowerBeads = (colIdx: number, val: number) => {
    setColumns(prev => prev.map((col, idx) => {
      if (idx === colIdx) {
        // If they click on already activated, let them set or toggle
        return { ...col, lower: col.lower === val ? val - 1 : val };
      }
      return col;
    }));
  };

  const resetAbacus = () => {
    setColumns([
      { upper: false, lower: 0 },
      { upper: false, lower: 0 },
      { upper: false, lower: 0 },
      { upper: false, lower: 0 }
    ]);
    setQuestStatus('playing');
    setShowHint(false);
  };

  const handleVerifyQuest = () => {
    const currentQuest = ABACUS_QUESTS[currentQuestIndex];
    if (abacusSum === currentQuest.targetValue) {
      setQuestStatus('success');
      onEarnStars(currentQuest.rewardStars, 'east');
      // If we reached the end of Soroban, unlock master badge
      if (currentQuestIndex === ABACUS_QUESTS.length - 1) {
        onUnlockBadge('abacus_master');
      }
    } else {
      setQuestStatus('failed');
    }
  };

  const handleNextQuest = () => {
    if (currentQuestIndex < ABACUS_QUESTS.length - 1) {
      setCurrentQuestIndex(prev => prev + 1);
      resetAbacus();
    } else {
      // Loop or restart with fresh score
      setCurrentQuestIndex(0);
      resetAbacus();
    }
  };

  const currentQuest = ABACUS_QUESTS[currentQuestIndex];

  return (
    <div id="abacus-game-section" className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-rose-50">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 mb-2">
            <Calculator className="w-3.5 h-3.5" /> Sharqiy Mental Arifmetika
          </span>
          <h2 className="text-2xl font-bold font-sans text-stone-800 tracking-tight">
            Sehrli Soroban Abakusi
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Qadimiy Sharq hisoblagichida toshlarni surib, miyangizni super tezlikda ishlashga o'rgating!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetAbacus}
            className="px-4 py-2 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-semibold border border-stone-200 transition-colors"
          >
            Tozalash (M0)
          </button>
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] text-amber-600 uppercase font-bold tracking-wider">Hozirgi Hisob</span>
            <span className="text-xl font-black font-mono text-amber-900">{abacusSum}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Play Area: Abacus board */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-stone-100 p-6 rounded-2xl border-4 border-amber-950 relative shadow-inner">
          {/* Abacus Outer Frame Labeling */}
          <div className="w-full flex justify-between px-8 mb-2">
            {['Minglar', 'Yuzlar', 'O\'nlar', 'Birlar'].map((lbl, i) => (
              <span key={i} className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block w-14 text-center">
                {lbl}
              </span>
            ))}
          </div>

          <div className="w-full h-80 bg-amber-50/80 rounded-lg relative border-4 border-amber-900/45 overflow-hidden flex justify-between px-8 py-4 shadow-lg">
            {/* The Horizontal Divider Beam */}
            <div className="absolute top-[33%] left-0 right-0 h-4 bg-amber-950/90 z-10 flex items-center justify-end pr-4 shadow-md">
              {/* Silver alignment dots for sorting decimals on a traditional abacus */}
              <div className="flex gap-24 mr-10">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 block"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 block"></span>
              </div>
            </div>

            {/* Vertical Silver Rods & Beads for each Column */}
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="w-16 relative flex flex-col justify-between items-center h-full">
                {/* Silver Metal Rod (Vertical background bar) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-r from-stone-400 to-stone-200 z-0 shadow-inner rounded" />

                {/* UPPER DECK (Value 5): Slided UP means inactive (value 0), slided DOWN touched divider beam means active (value 5) */}
                <div className="h-16 w-full relative z-10 flex flex-col justify-end">
                  <motion.button
                    onClick={() => toggleUpperBead(colIdx)}
                    animate={{ y: col.upper ? 28 : -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-12 h-6 rounded-xl border border-amber-900 absolute left-1/2 -translateX-50 cursor-pointer shadow-md select-none ${
                      col.upper
                        ? 'bg-rose-500 border-rose-950 text-white font-bold text-[10px] flex items-center justify-center'
                        : 'bg-amber-100'
                    }`}
                    style={{ x: '-50%' }}
                  >
                    <span className="text-[8px] font-mono select-none">{col.upper ? "5" : ""}</span>
                  </motion.button>
                </div>

                {/* LOWER DECK (Value 1 * N): Slided DOWN means inactive, slided UP touched divider beam means active */}
                <div className="h-44 w-full relative z-10 flex flex-col justify-start mt-6">
                  {[1, 2, 3, 4].map((beadNum) => {
                    const isActive = col.lower >= beadNum;
                    // Lower beads should group together at the top of the lower deck structure
                    // An active bead moves UPwards (towards divider). Inactive bead sleeps at bottom.
                    let targetYOffset = 180; // Default inactive bottom position
                    if (isActive) {
                      // Active beads slide upwards closely packed
                      targetYOffset = 0 + (beadNum - 1) * 20;
                    } else {
                      // Inactive beads rest closely packed at the bottom
                      targetYOffset = 90 + (beadNum - 1) * 20;
                    }

                    return (
                      <motion.button
                        key={beadNum}
                        onClick={() => setLowerBeads(colIdx, beadNum)}
                        animate={{ y: targetYOffset }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`w-12 h-5 rounded-lg border cursor-pointer border-amber-900 absolute left-1/2 -translateX-50 shadow-sm ${
                          isActive
                            ? 'bg-amber-700 border-amber-950 text-white text-[9px] font-mono flex items-center justify-center'
                            : 'bg-amber-200 shadow-inner'
                        }`}
                        style={{ x: '-50%' }}
                      >
                        <span className="text-[7px] pointer-events-none">{isActive ? "1" : ""}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-[11px] text-stone-500 font-medium text-center bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
            💡 <b className="text-stone-700">O'yin Yo'riqnomasi:</b> Har bir toshni bosib harakatlantiring. Tepadagilar 5, pastdagilar 1 balldan qo'shadi! Birliklar ustuni eng o'ngda joylashgan.
          </div>
        </div>

        {/* Challenge Quest Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-rose-50/50 rounded-2xl p-5 border border-rose-100">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-rose-600">
                Bosqich: {currentQuestIndex + 1} / {ABACUS_QUESTS.length}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
                ⭐ +{currentQuest.rewardStars}
              </span>
            </div>

            <h3 className="text-lg font-bold text-stone-800 leading-snug">
              {currentQuest.question}
            </h3>

            {/* Hint toggler */}
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-stone-500 hover:text-rose-600 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" /> {showHint ? "Yordamni yopish" : "Ustoz yordami (Kallit)"}
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 mt-2 leading-relaxed"
                  >
                    💡 {currentQuest.hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-rose-100">
            {questStatus === 'playing' ? (
              <button
                onClick={handleVerifyQuest}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/20 active:translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2"
              >
                Tekshirish
              </button>
            ) : questStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-xl text-center"
              >
                <span className="inline-block bg-emerald-100 text-emerald-700 p-2 rounded-full mb-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </span>
                <h4 className="font-bold text-emerald-800 text-sm">Ofarin! To'ppa-to'g'ri!</h4>
                <p className="text-xs text-emerald-600 mt-1 mb-4">
                  Siz Soroban ustunlarida aynan {currentQuest.targetValue} sonini mukammal tasvirladingiz!
                </p>
                <button
                  onClick={handleNextQuest}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-1 shadow-md"
                >
                  Keyingi bosqichga o'tish <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-center"
              >
                <h4 className="font-bold text-amber-800 text-sm">Biroz xatolik bordek...</h4>
                <p className="text-xs text-stone-600 mt-1 mb-4">
                  Siz tasvirlagan son: <b className="font-mono text-stone-900 text-sm">{abacusSum}</b>.
                  Bizga esa <b className="font-mono text-stone-900 text-sm">{currentQuest.targetValue}</b> kerak. Qaytadan urinib ko'ring!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={resetAbacus}
                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-2 px-4 rounded-lg text-xs"
                  >
                    Boshidan boshlash
                  </button>
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
                  >
                    Yordam olish
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
