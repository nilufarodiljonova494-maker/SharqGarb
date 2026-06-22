/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizItem } from '../types';
import { INITIAL_QUIZZES } from '../data/staticData';
import { Award, CheckCircle, XCircle, AlertCircle, RefreshCw, GraduationCap, Printer, ExternalLink, HelpCircle } from 'lucide-react';

interface QuizArenaProps {
  onEarnStars: (amount: number, track: 'east' | 'west' | 'bridge') => void;
  onUnlockBadge: (badgeId: string) => void;
  userName: string;
}

export default function QuizArena({ onEarnStars, onUnlockBadge, userName }: QuizArenaProps) {
  const [quizzes, setQuizzes] = useState<any[]>(INITIAL_QUIZZES);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scores, setScores] = useState({ correct: 0, wrong: 0 });
  const [quizState, setQuizState] = useState<'playing' | 'summarizing'>('playing');

  // AI Generation configuration states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationErr, setGenerationErr] = useState("");
  const [gradeLevel, setGradeLevel] = useState("3");
  const [quizSubject, setQuizSubject] = useState("barchasi");

  const currentQuiz = quizzes[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOpt(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedOpt === currentQuiz.answerIndex;

    const source: 'east' | 'west' | 'bridge' = currentQuiz.source || 'bridge';

    if (isCorrect) {
      setScores(prev => ({ ...prev, correct: prev.correct + 1 }));
      onEarnStars(10, source);
    } else {
      setScores(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < quizzes.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      setQuizState('summarizing');
      // If they finished with 100% correct answers
      const isPerfect = scores.correct + (selectedOpt === currentQuiz.answerIndex ? 1 : 0) === quizzes.length;
      if (isPerfect) {
        onUnlockBadge('quiz_champion');
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScores({ correct: 0, wrong: 0 });
    setQuizState('playing');
  };

  // Live dynamic question generation via Express backend
  const handleGenerateAIQuiz = async () => {
    setIsGenerating(true);
    setGenerationErr("");
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: gradeLevel,
          subject: quizSubject
        })
      });

      if (!response.ok) {
        throw new Error("AI or Express server is initializing. Please try again in 5 seconds!");
      }

      const data = await response.json();
      if (data && Array.isArray(data.quizzes) && data.quizzes.length > 0) {
        setQuizzes(data.quizzes);
        setCurrentIdx(0);
        setSelectedOpt(null);
        setIsSubmitted(false);
        setScores({ correct: 0, wrong: 0 });
        setQuizState('playing');
      } else {
        throw new Error("Server returned invalid data format. Using standard premium questions instead.");
      }
    } catch (err: any) {
      setGenerationErr(err.toString());
      // fallback immediately to standard preset to maintain robust usage
      setQuizzes(INITIAL_QUIZZES);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="quiz-arena-section" className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 max-w-4xl mx-auto">
      {/* Quiz Area Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-rose-50">
        <div>
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase mb-2">
            🏆 Bilimlar Arenasi
          </span>
          <h2 className="text-2xl font-black text-stone-800">Uyg'un Savollar Ringi</h2>
          <p className="text-xs text-stone-500 mt-1">
            Aqlingizni charxlang. Sharq intizomi va G'arb fanlariga doir eng qiziqarli topishmoqlarga javob toping!
          </p>
        </div>

        {/* AI customizer panel inline */}
        <div className="flex flex-wrap gap-2 items-center bg-stone-50 p-2 border border-stone-200 rounded-2xl w-full md:w-auto">
          <div className="flex gap-1">
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="bg-white text-xs font-bold border border-stone-300 p-1.5 rounded-lg text-stone-700 cursor-pointer outline-none"
            >
              <option value="1">1-sinf</option>
              <option value="2">2-sinf</option>
              <option value="3">3-sinf</option>
              <option value="4">4-sinf</option>
            </select>
            <select
              value={quizSubject}
              onChange={(e) => setQuizSubject(e.target.value)}
              className="bg-white text-xs font-bold border border-stone-300 p-1.5 rounded-lg text-stone-700 cursor-pointer outline-none animate-pulse"
            >
              <option value="barchasi">Barcha fanlar</option>
              <option value="matematika">Mental Math</option>
              <option value="tabiat">G'arbiy Tabiat</option>
              <option value="ijtimoiy">Tafakkur Ko'prigi</option>
            </select>
          </div>
          <button
            onClick={handleGenerateAIQuiz}
            disabled={isGenerating}
            className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-[10px] px-3.5 py-2.5 rounded-xl transition-all disabled:from-stone-300 disabled:to-stone-400 font-mono tracking-tight uppercase"
          >
            {isGenerating ? "AI Yaratmoqda..." : "Yangi AI Test Yaratish"}
          </button>
        </div>
      </div>

      {generationErr && (
        <div className="mb-4 text-[10px] text-amber-800 bg-amber-50 rounded-lg p-2.5 border border-amber-200">
          💡 Ma'lumot: {generationErr !== "Error: Failed to fetch" ? "AI serveri isitilmoqda, standart viktorinadan foydalanamiz!" : "Ofitsial savollar yuklandi!"}
        </div>
      )}

      {quizState === 'playing' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Question view */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold uppercase tracking-wide text-rose-500">
                Savol: {currentIdx + 1} / {quizzes.length}
              </span>
              <span className="font-bold text-emerald-600 font-mono">To'g'ri: {scores.correct}</span>
            </div>

            {/* Question Card Box */}
            <div className="bg-gradient-to-tr from-stone-50 to-rose-50/20 p-6 rounded-2xl border border-stone-100 shadow-sm min-h-36 flex flex-col justify-center">
              <h3 className="text-base font-bold text-stone-800 leading-relaxed font-sans">
                {currentQuiz.question}
              </h3>
              {currentQuiz.topic && (
                <span className="inline-block self-start mt-4 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] rounded font-bold uppercase tracking-wider">
                  Mavzu: {currentQuiz.topic}
                </span>
              )}
            </div>

            {/* Options display */}
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {currentQuiz.options.map((opt: string, optIdx: number) => {
                const isSelected = selectedOpt === optIdx;
                const isCorrectIndex = optIdx === currentQuiz.answerIndex;
                let optColor = "bg-white border-stone-200 hover:bg-stone-50 hover:border-indigo-400";
                if (isSubmitted) {
                  if (isCorrectIndex) {
                    optColor = "bg-emerald-500 text-white border-emerald-600";
                  } else if (isSelected) {
                    optColor = "bg-rose-500 text-white border-rose-600";
                  } else {
                    optColor = "bg-stone-50 border-stone-200 text-stone-400";
                  }
                } else if (isSelected) {
                  optColor = "bg-indigo-600 text-white border-indigo-700 shadow-md";
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${optColor} flex justify-between items-center`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrectIndex && <CheckCircle className="w-4 h-4 text-white" />}
                    {isSubmitted && isSelected && !isCorrectIndex && <XCircle className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* Verification action panel */}
            <div className="pt-4 flex justify-between items-center">
              <div className="text-[10px] text-stone-400 font-bold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Har bir to'g'ri javobga +10 ball va yulduz beriladi!
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="bg-indigo-600 disabled:bg-stone-200 disabled:text-stone-400 disabled:border-stone-200 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg text-xs"
                >
                  Javob berish
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg text-xs"
                >
                  {currentIdx === quizzes.length - 1 ? "Natijani Ko'rish" : "Keyingi Savol"}
                </button>
              )}
            </div>
          </div>

          {/* Right Explanations Sidebar pane for children */}
          <div className="md:col-span-4 bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 block mb-2">Ustoz Sharhi</span>
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-[11px] font-bold text-stone-700 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-200">
                    {currentQuiz.explanation}
                  </p>
                  <div className="bg-amber-50 p-2.5 rounded-lg text-[10px] text-amber-800 border border-amber-200">
                    💡 <b>Fakt:</b> Har doim ko'prikda kashfiyotlar eng yuqori bo'ladi. Muvaffaqiyatli darslar!
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 flex flex-col items-center"
                >
                  <GraduationCap className="w-10 h-10 text-stone-300 animate-bounce" />
                  <p className="text-[10px] text-stone-500 mt-2">Savolni diqqat bilan o'qib javob bering, so'ng ustozingiz sharhini kuting.</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-[9px] text-stone-500 font-bold border-t border-stone-200 pt-2.5 mt-4">
              Viktorina: Bepul onlayn testlar
            </div>
          </div>
        </div>
      ) : (
        /* Summarizing Certificate View */
        <motion.div
          initial={{ opacity: 0, Math: 0.95 }}
          animate={{ opacity: 1, Math: 1 }}
          className="text-center py-6"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <Award className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-stone-800">Viktorina Yakunlandi!</h3>
          <p className="text-sm font-semibold text-stone-600 mt-1">Siz to'plagan ball: {scores.correct} / {quizzes.length}</p>

          {/* Interactive certificate visualizer */}
          <div className="my-8 max-w-xl mx-auto p-1 bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 rounded-3xl shadow-xl relative overflow-hidden">
            {/* The actual paper scroll inside */}
            <div className="bg-amber-50/95 border-4 border-amber-900/10 rounded-2.5xl p-6 relative flex flex-col justify-between min-h-80">
              {/* Outer classic certificate border elements */}
              <div className="absolute top-2 left-2 text-[8px] font-serif uppercase tracking-widest text-amber-800">Sharq va Garb talimi</div>
              <div className="absolute top-2 right-2 text-[8px] font-serif uppercase tracking-widest text-amber-800">Diplom</div>

              {/* Certificate content core */}
              <div className="space-y-4 text-center mt-4">
                <GraduationCap className="w-12 h-12 text-amber-800 mx-auto" />
                <h4 className="font-serif text-amber-900 font-extrabold text-lg uppercase tracking-wider">FALSAFA & BILIM DIPLOMI</h4>
                <p className="text-[11px] text-stone-600 font-medium italic">Ushbu faxriy yorliq bilan taqdirlanadi:</p>
                <p className="text-xl font-black text-stone-900 tracking-tight font-serif uppercase border-b-2 border-dashed border-amber-900/30 max-w-xs mx-auto pb-1">
                  {userName || "Daho Bolajon"}
                </p>
                <p className="text-[10px] text-stone-500 max-w-sm mx-auto leading-relaxed">
                  boshlang'ich sint innovatsion '"Sharq va G'arb ta'limi" platformasidagi integrallashgan mantiq,
                  soroban mental math hamda g'arbiy tabiat kashfiyoti test uchrashuvlardan muvaffaqiyatli g'olib bo'lgani uchun.
                </p>
              </div>

              {/* Signatures & Stamps */}
              <div className="flex justify-between items-end mt-8 border-t border-amber-900/10 pt-4 px-6">
                <div className="text-left">
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-stone-400">Dono Bobo</span>
                  <span className="font-serif text-stone-700 text-[10px] italic">Sh. Xattotlik</span>
                </div>
                {/* Traditional eastern red stamp simulation */}
                <div className="w-10 h-10 rounded-lg border-2 border-rose-500 flex items-center justify-center text-rose-500 font-black text-[8px] rotate-12 select-none uppercase">
                  Ш.Г.Т
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-wider font-extrabold text-stone-400">Professor Spark</span>
                  <span className="font-mono text-stone-700 text-[9px] italic">P. Spark</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Diplomni Chop Etish
            </button>
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Qayta topshirish
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
