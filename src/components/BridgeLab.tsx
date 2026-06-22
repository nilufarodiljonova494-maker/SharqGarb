/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Brain, Wind, Lightbulb, CheckCircle2, Award, Zap, RefreshCw } from 'lucide-react';

interface BridgeLabProps {
  onEarnStars: (amount: number, track: 'east' | 'west' | 'bridge') => void;
  onUnlockBadge: (badgeId: string) => void;
}

const DESIGN_CHALLENGES = [
  {
    id: "dc_1",
    theme: "Ekologik Smart Ruchka",
    problem: "Dunyodagi millionlab plastik ruchkalar tabiatni ifloslantiradi. Qanday qilib uni aqlli va ekologik toza qilish mumkin?",
    optionsMaterial: ["Bambuk yog'ochi", "Qayta ishlangan sut idishlari", "Makkajo'xori kraxmali plastik"],
    optionsEnergy: ["Barmoq bosimi kinetic energiyasi", "Kichik quyosh paneli", "Issiqlik datchigi"],
    optionsFeature: ["Imlo xatolarini tebranish orqali aytish", "Raqamli yozuvlarni telefonga ko'chirish", "Havo tozalovchi hid chiqarish"]
  },
  {
    id: "dc_2",
    theme: "Quyosh nuri bilan ishlovchi muzlatgich-sumka",
    problem: "Issiq yoz kunlarida chekka hududlardagi bolalarga dori yoki sovuq suv yetkazish qiyin.",
    optionsMaterial: ["Yengil qayta ishlangan alyuminiy", "Kendir matosi tolasi", "Ekologik penoplast"],
    optionsEnergy: ["Yupqa quyosh paneli", "Mexanik qo'l aylantirgichi", "Suv bug'lanish kuchi"],
    optionsFeature: ["Dori haroratini ovozli aytish", "Telefon quvvatlagich", "Haddan tashqari qizib ketishdan himoya signalizatsiyasi"]
  }
];

export default function BridgeLab({ onEarnStars, onUnlockBadge }: BridgeLabProps) {
  // Navigation states: 'intro' | 'breathing' | 'design' | 'result'
  const [stage, setStage] = useState<'intro' | 'breathing' | 'design' | 'result'>('intro');

  // Stage 1: Breathing State
  const [breathState, setBreathState] = useState<'Nafas oling' | 'Ushlab turing' | 'Nafas chiqaring'>('Nafas oling');
  const [breathCount, setBreathCount] = useState(0);
  const [saansTimer, setSaansTimer] = useState(30); // 30 seconds overall
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stage 2: Selection states
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [material, setMaterial] = useState("");
  const [energy, setEnergy] = useState("");
  const [feature, setFeature] = useState("");
  const [inventionName, setInventionName] = useState("");

  const currentChallenge = DESIGN_CHALLENGES[selectedChallengeIdx];

  // Breath rhythm controller (4s in, 2s hold, 4s out)
  useEffect(() => {
    if (stage !== 'breathing') return;

    let localSec = 0;
    const interval = setInterval(() => {
      localSec += 1;
      setSaansTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setStage('design');
          return 0;
        }
        return prev - 1;
      });

      // Update breath instruction
      const cyclePos = localSec % 10;
      if (cyclePos < 4) {
        setBreathState('Nafas oling');
      } else if (cyclePos < 6) {
        setBreathState('Ushlab turing');
      } else {
        setBreathState('Nafas chiqaring');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const handleStartLab = () => {
    setStage('breathing');
    setSaansTimer(20); // 20 seconds representation for faster children dynamics
  };

  const handleSubmitInvention = () => {
    if (!material || !energy || !feature || !inventionName.trim()) return;
    setStage('result');
    onEarnStars(30, 'bridge');
    onUnlockBadge('zen_focus');
  };

  const handleResetLab = () => {
    setStage('intro');
    setMaterial("");
    setEnergy("");
    setFeature("");
    setInventionName("");
  };

  return (
    <div id="bridge-lab-section" className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Dynamic Render Stages */}
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="text-center py-6"
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <h2 className="text-2xl font-black text-stone-800">Ijod va Fokus Laboratoriyasi (Sintez)</h2>
            <p className="text-stone-500 text-sm max-w-xl mx-auto mt-2 leading-relaxed">
              Muvaffaqiyatli daho bo'lish siri nafaqat g'oyalarda (G'arb), balki ularni rejalashtirib qila oladigan diqqat va sabrda (Sharq) dir! Ushbu sintez laboratoriyamizda siz buni amalda bajarasiz.
            </p>

            {/* Steps Visual Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto my-8">
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 text-left">
                <span className="text-xs uppercase font-extrabold text-rose-600 block mb-1">1-Bosqich: Sharqona Zen</span>
                <h4 className="font-bold text-stone-800 text-xs">Diqqatni bir yerga to'plash</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Nafas ritmini to'g'irlab, ongingizni shovqindan tozalang va diqqat darajasini 100% ga ko'taring.</p>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-left">
                <span className="text-xs uppercase font-extrabold text-indigo-600 block mb-1">2-Bosqich: G'arbona Eureka</span>
                <h4 className="font-bold text-stone-800 text-xs">Ijodiy Ixtiro yaratish</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Sinchkovlik bilan kashfiyot g'oyalarini tanlab, o'z muhandislik prototipingizni yarating!</p>
              </div>
            </div>

            <button
              onClick={handleStartLab}
              className="bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg text-sm text-center leading-none"
            >
              Laboratoriyani boshlash 🚀
            </button>
          </motion.div>
        )}

        {stage === 'breathing' && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 flex flex-col items-center justify-center space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                Sharq Sokinligi va Zen
              </span>
              <h3 className="text-xl font-bold text-stone-800 mt-2">Nafas Fokus Mashqi</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                Koinot bilan birga kiring. Sharq falsafasida kashfiyot qilishdan avval tana va ongni sokinlashtirish qadrlanadi.
              </p>
            </div>

            {/* Beautiful Breathing Pulsating Circle */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer wave rings */}
              <motion.div
                animate={{
                  scale: breathState === 'Nafas oling' ? 1.5 : breathState === 'Ushlab turing' ? 1.5 : 0.9,
                  opacity: breathState === 'Ushlab turing' ? 0.3 : 0.1,
                }}
                transition={{ duration: breathState === 'Ushlab turing' ? 2 : 4, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-rose-400"
              />
              <motion.div
                animate={{
                  scale: breathState === 'Nafas oling' ? 1.25 : breathState === 'Ushlab turing' ? 1.25 : 0.95,
                  opacity: breathState === 'Ushlab turing' ? 0.45 : 0.15,
                }}
                transition={{ duration: breathState === 'Ushlab turing' ? 2 : 4, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-full bg-indigo-300"
              />

              {/* Central text node */}
              <motion.div
                animate={{
                  scale: breathState === 'Nafas oling' ? 1.1 : breathState === 'Ushlab turing' ? 1.15 : 0.9,
                }}
                transition={{ duration: breathState === 'Ushlab turing' ? 2 : 4, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-white border-4 border-indigo-600 flex flex-col items-center justify-center shadow-lg relative z-10"
              >
                <Wind className="w-6 h-6 text-indigo-500 animate-pulse mb-1" />
                <span className="text-xs font-black text-stone-800 uppercase tracking-tight block">
                  {breathState}
                </span>
                <span className="text-[10px] text-stone-400 font-bold block mt-1">{saansTimer}s qoldi</span>
              </motion.div>
            </div>

            <div className="flex gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${breathState === 'Nafas oling' ? 'bg-indigo-600' : 'bg-stone-200'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${breathState === 'Ushlab turing' ? 'bg-indigo-600 animate-ping' : 'bg-stone-200'}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${breathState === 'Nafas chiqaring' ? 'bg-indigo-600' : 'bg-stone-200'}`} />
            </div>

            <p className="text-stone-500 text-xs italic">
              Ko'zingizni bir zum yumib, ko'krak qafasingiz to'lishini va bo'shashini kuzatib boring...
            </p>
          </motion.div>
        )}

        {stage === 'design' && (
          <motion.div
            key="design"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-indigo-50 pb-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                  G'arb Muhandisligi & Eureka
                </span>
                <h3 className="text-xl font-bold text-stone-800 mt-2">Kashfiyotchilik Prototipi Laboratoriyasi</h3>
              </div>
              <div className="flex gap-1.5">
                {DESIGN_CHALLENGES.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChallengeIdx(idx);
                      setMaterial("");
                      setEnergy("");
                      setFeature("");
                      setInventionName("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                      selectedChallengeIdx === idx ? 'bg-indigo-600 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    Ixtiro {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left">
              <span className="text-[10px] text-indigo-600 font-extrabold uppercase">Topshiriq mavzusi:</span>
              <h4 className="font-bold text-stone-800 text-sm mt-0.5">{currentChallenge.theme}</h4>
              <p className="text-xs text-stone-600 mt-1">{currentChallenge.problem}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Material Dropdown Selection */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-black uppercase tracking-wide text-stone-500">1. Asosiy Ekologik material:</label>
                <div className="flex flex-col gap-1.5">
                  {currentChallenge.optionsMaterial.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMaterial(m)}
                      className={`text-left p-2.5 rounded-lg text-[11px] font-bold border transition-all ${
                        material === m ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Dropdown Selection */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-black uppercase tracking-wide text-stone-500">2. Energetik manba:</label>
                <div className="flex flex-col gap-1.5">
                  {currentChallenge.optionsEnergy.map((e, idx) => (
                    <button
                      key={idx}
                      onClick={() => setEnergy(e)}
                      className={`text-left p-2.5 rounded-lg text-[11px] font-bold border transition-all ${
                        energy === e ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Feature Selection */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-black uppercase tracking-wide text-stone-500">3. Eng zo'r aqlli funksiya:</label>
                <div className="flex flex-col gap-1.5">
                  {currentChallenge.optionsFeature.map((f, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFeature(f)}
                      className={`text-left p-2.5 rounded-lg text-[11px] font-bold border transition-all ${
                        feature === f ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Invention Naming block */}
            <div className="text-left space-y-1 mt-6">
              <label className="text-[11px] font-black uppercase tracking-wide text-stone-500">Ixtiroingizga nom bering (Eksklyuziv):</label>
              <input
                type="text"
                value={inventionName}
                onChange={(e) => setInventionName(e.target.value)}
                placeholder="Masalan: EcoSparkler v1.0, SolariPen..."
                className="w-full p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 text-xs font-bold font-mono outline-none"
              />
            </div>

            <div className="pt-4 border-t border-indigo-50 flex justify-between items-center">
              <button
                onClick={handleResetLab}
                className="text-stone-500 hover:text-stone-800 text-xs font-semibold"
              >
                Ortga qaytish
              </button>
              <button
                disabled={!material || !energy || !feature || !inventionName.trim()}
                onClick={handleSubmitInvention}
                className="bg-indigo-600 disabled:bg-stone-200 disabled:text-stone-400 disabled:border-stone-200 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow text-xs flex items-center gap-1.5 transition-all"
              >
                Patentlash va natija olish <Zap className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 space-y-6"
          >
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">Ixtiro muvaffaqiyatli patentlandi!</span>
              <h3 className="text-2xl font-black text-stone-800 mt-1">Sintez Darajasi: OLIY (100%)</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                Zen sokinligi (Sokin aql) daho kashfiyoti kabi ulug'landi. Siz tabiatni hurmat qilish va muhandislikni hayratda qoldiruvchi uyg'unlikda birlashtirdingiz!
              </p>
            </div>

            {/* Generated blueprint review */}
            <div className="bg-indigo-950 text-white border-2 border-indigo-900 rounded-2xl p-5 text-left max-w-lg mx-auto relative shadow-2xl">
              <div className="absolute top-2 right-4 text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-black">Patent hujjati #8483-UZ</div>
              <h4 className="text-emerald-300 font-bold font-mono text-sm uppercase">📘 Ixtiro: {inventionName}</h4>
              <p className="text-[11px] text-stone-400 mt-1">Mavzu: {currentChallenge.theme}</p>

              <div className="mt-4 space-y-3 font-sans text-xs border-t border-indigo-900 pt-3">
                <p className="text-stone-200 leading-relaxed">
                  🔬 <b>Tuzilishi:</b> Ushbu ixtiro <b>{material}</b> asosidan barpo etilgan bo'lib, uning ishlash kuchi butunlay toza <b>{energy}</b> tizimiga tayanadi.
                </p>
                <p className="text-stone-200 leading-relaxed">
                  ⚡ <b>Patentlangan Aqlli Funksiya:</b> Ixtiro o'zining innovatsion <b>{feature}</b> qobiliyati bilan bolalar hayotiga buyuk qulaylik va xavfsizlik olib kiradi.
                </p>
                <div className="bg-indigo-900/50 p-3 rounded-lg border border-indigo-800 text-[11px] text-indigo-200 italic mt-3">
                  🕊️ <b>Faylasuf sabog'i:</b> "Biror narsa yaratish uchun diqqatni toshdek mustahkam qilish o'ta muhim. Shundagina g'oya quyosh kabi ziyo socha boshlaydi."
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleResetLab}
                className="px-5 py-2.5 hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-bold border border-stone-200 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Boshqasini yaratib ko'rish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
