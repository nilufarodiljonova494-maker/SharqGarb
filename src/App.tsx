/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BADGES, FACTS } from './data/staticData';
import { Badge, ScoreProgress } from './types';
import AbacusGame from './components/AbacusGame';
import CompareFables from './components/CompareFables';
import BridgeLab from './components/BridgeLab';
import QuizArena from './components/QuizArena';
import SagesRoom from './components/SagesRoom';

import {
  Trophy,
  Sparkles,
  Compass,
  Cpu,
  Search,
  BookOpen,
  Award,
  MessageSquare,
  GraduationCap,
  LayoutDashboard,
  User,
  Edit2,
  Check,
  Flame,
  Lightbulb,
  Moon,
  Info
} from 'lucide-react';

export default function App() {
  // Track State
  const [stars, setStars] = useState<ScoreProgress>({
    totalStars: 10, // Initial balance greeting stars
    easternFocusStars: 0,
    westernInquiryStars: 0,
    balanceStars: 10,
    completedQuizzes: [],
    unlockedBadges: ["first_step"], // Pre-unlocked general welcome
    abacusLevel: 1,
    breathingStreak: 0,
  });

  const [userName, setUserName] = useState("Daho Shogird");
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("Daho Shogird");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊"); // Child chooses friendly Eastern/Western avatars
  const [activeTab, setActiveTab] = useState<'dashboard' | 'abacus' | 'sages' | 'fables' | 'lab' | 'quizzes'>('dashboard');

  // Congratulatory modal State for badge unlocking
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('sharq_garb_progress');
    const savedName = localStorage.getItem('sharq_garb_username');
    const savedAvatar = localStorage.getItem('sharq_garb_avatar');

    if (savedProgress) {
      try {
        setStars(JSON.parse(savedProgress));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedName) {
      setUserName(savedName);
      setNameInput(savedName);
    }
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);

  // Save to LocalStorage
  const saveProgress = (newStars: ScoreProgress) => {
    localStorage.setItem('sharq_garb_progress', JSON.stringify(newStars));
  };

  const handleEarnStars = (amount: number, track: 'east' | 'west' | 'bridge') => {
    setStars(prev => {
      const update = { ...prev };
      update.totalStars += amount;
      if (track === 'east') {
        update.easternFocusStars += amount;
      } else if (track === 'west') {
        update.westernInquiryStars += amount;
      } else {
        update.balanceStars += amount;
      }
      saveProgress(update);
      return update;
    });
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (stars.unlockedBadges.includes(badgeId)) return;

    const matchedBadge = BADGES.find(b => b.id === badgeId);
    if (matchedBadge) {
      setStars(prev => {
        const update = {
          ...prev,
          unlockedBadges: [...prev.unlockedBadges, badgeId]
        };
        saveProgress(update);
        return update;
      });
      setNewlyUnlockedBadge(matchedBadge);
    }
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput);
      localStorage.setItem('sharq_garb_username', nameInput);
      setIsEditingName(false);
    }
  };

  const handleSelectAvatar = (av: string) => {
    setSelectedAvatar(av);
    localStorage.setItem('sharq_garb_avatar', av);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased flex flex-col justify-between">
      {/* Visual Header Branding */}
      <header className="bg-white border-b border-rose-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-md select-none">
              東🎴
            </span>
            <div>
              <h1 className="text-lg font-extrabold text-stone-800 font-sans tracking-tight leading-none">
                Sharq va G'arb ta'limi
              </h1>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5 block">
                Innovatsion Bolalar platformasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Point Ledger */}
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer">
                <span className="text-base">⭐</span>
                <span className="text-xs font-black text-amber-950 font-mono">{stars.totalStars}</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="text-xs">東</span>
                <span className="text-xs font-bold text-rose-900 font-mono">{stars.easternFocusStars}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="text-xs">W</span>
                <span className="text-xs font-bold text-blue-900 font-mono">{stars.westernInquiryStars}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-8">
        {/* Playable Navigation Menu Rails */}
        <div className="flex flex-wrap border-b border-stone-200 gap-1 bg-white p-1.5 rounded-2xl shadow-sm">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'abacus', label: 'Soroban Abakusi', icon: Cpu },
            { id: 'fables', label: 'Ibratli Ertaklar', icon: BookOpen },
            { id: 'lab', label: 'Breathing & Invention Lab', icon: Compass },
            { id: 'sages', label: 'Tafakkur Munozarasi', icon: MessageSquare },
            { id: 'quizzes', label: 'Bilimlar Arenasi', icon: GraduationCap },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setNewlyUnlockedBadge(null);
                }}
                className={`flex-1 min-w-[130px] sm:flex-none flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Outer view router */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Grand Showcase Banner using custom Watercolor illustration */}
              <div className="bg-indigo-950 text-white rounded-3xl overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-12 items-center border border-indigo-900 min-h-64">
                <div className="md:col-span-7 p-8 space-y-4 z-10 relative">
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-amber-400 to-rose-400 text-indigo-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      Miyalar Birlashuvi
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-sans leading-tight">
                    Sharqning <b className="text-amber-400">g'ayratli intizomi</b> va G'arbning <b className="text-emerald-300">ijodiy yorqinligi</b> yagona ko'prikda!
                  </h2>
                  <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                    Xush kelibsiz! Ushbu sehrli platformada siz qadimiy Sharq mental math (Soroban abakusi)
                    and sokin Zen konsentratsiyasini, G'arbdagi kashshoflik tabiati, Sokratik qiziqarli tajribalari bilan birga uyg'un tarzda kashf qilasiz!
                  </p>
                </div>

                {/* The Illustration display */}
                <div className="md:col-span-5 h-full min-h-48 relative flex justify-center items-center overflow-hidden bg-indigo-900/40">
                  <img
                    src="/src/assets/images/landing_illustration_1782150462127.jpg"
                    alt="Sharq va Garb ta'limi premium watercolor art"
                    className="object-cover w-full h-full min-h-48 absolute inset-0 mix-blend-lighten blur-[0.5px] opacity-90 hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glowing Overlay effect */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-indigo-950 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Kid Config Profile and badges section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Learner badge ID-Card */}
                <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-rose-500 block">Kashshof Talaba Kartasi</span>

                    {/* Avatar choice row */}
                    <div className="flex gap-2 items-center bg-stone-50 p-3 rounded-2xl border border-stone-200">
                      <div className="text-3xl bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm select-none">
                        {selectedAvatar}
                      </div>
                      <div className="flex-1">
                        {isEditingName ? (
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="text"
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full bg-white text-xs font-bold p-1 rounded border border-stone-300 outline-none"
                            />
                            <button
                              onClick={handleSaveName}
                              className="p-1.5 bg-indigo-650 rounded-lg text-white"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1.5 items-center">
                            <h4 className="font-extrabold text-sm text-stone-800">{userName}</h4>
                            <button onClick={() => setIsEditingName(true)} className="text-stone-400 hover:text-stone-600">
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <span className="text-[9px] font-bold text-stone-400 block mt-0.5">Boshlang'ich Daho bosqichi</span>
                      </div>
                    </div>

                    {/* Avatar selectors */}
                    <div className="flex gap-2 justify-center py-2 border-t border-b border-rose-50">
                      {["🦊", "🐼", "🦉", "🦁", "🐢"].map(av => (
                        <button
                          key={av}
                          onClick={() => handleSelectAvatar(av)}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                            selectedAvatar === av ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-105' : 'bg-stone-50 hover:bg-stone-100'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>

                    {/* Stars ledger */}
                    <div className="space-y-2 pt-1.5 text-xs text-stone-600">
                      <div className="flex justify-between font-bold">
                        <span>Sharqiy Intizom (Sokinlik):</span>
                        <span className="text-rose-600 font-mono">⭐ {stars.easternFocusStars}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>G'arbiy Kashfiyot (Mantiq):</span>
                        <span className="text-blue-600 font-mono">⭐ {stars.westernInquiryStars}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Integrallashgan muvozanat:</span>
                        <span className="text-indigo-600 font-mono">⭐ {stars.balanceStars}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-400/20 to-rose-400/10 p-3.5 rounded-2xl border border-amber-300/30 text-center mt-6">
                    <span className="block text-[9px] uppercase tracking-wider font-extrabold text-amber-900">Miyalar Bahosi</span>
                    <p className="text-[10px] text-stone-700 font-semibold mt-1">Siz Sharq va G'arb fanlarining mukammal ko'prigidan bormoqdasiz!</p>
                  </div>
                </div>

                {/* Fact list dashboard board */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-rose-100 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-600 block">Kunning qiziqarli qiyosiy faktlari</span>
                    <h3 className="text-lg font-black text-stone-800 leading-snug">
                      Har doim o'rganish kuchi muvozanatidadir!
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {FACTS.slice(0, 2).map(f => (
                        <div key={f.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left space-y-1">
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase block w-max">
                            {f.category}
                          </span>
                          <h4 className="font-bold text-stone-800 text-xs mt-1">{f.title}</h4>
                          <p className="text-[10px] text-stone-500 leading-relaxed line-clamp-3">
                            {f.eastPerspective}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-rose-50 flex justify-between items-center mt-6">
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Barcha darsliklar va o'yinlar mutlaqo bepul.
                    </div>
                    <button
                      onClick={() => setActiveTab('quizzes')}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      Darhol test yechib ball olish →
                    </button>
                  </div>
                </div>
              </div>

              {/* My Achieved Badges Shelf */}
              <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl space-y-4">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-rose-500 block">Mening Yutuqlarim va Ko'krak Nishonlarim</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {BADGES.map(badge => {
                    const isUnlocked = stars.unlockedBadges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between items-center h-44 ${
                          isUnlocked
                            ? 'bg-amber-500/10 border-amber-300'
                            : 'bg-stone-50 border-stone-200 opacity-50'
                        }`}
                      >
                        <span className="text-3xl select-none">
                          {badge.id === "first_step" ? "🎖️" : badge.id === "abacus_master" ? "🧮" : badge.id === "inquiry_detective" ? "🔍" : badge.id === "harmonious_mind" ? "⚖️" : badge.id === "zen_focus" ? "🧘" : "🏆"}
                        </span>
                        <div>
                          <b className="text-[11px] block text-stone-800 leading-tight">{badge.name}</b>
                          <span className="text-[9px] text-stone-400 mt-1 block leading-snug">{badge.description}</span>
                        </div>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                          isUnlocked ? 'bg-amber-200 text-amber-900' : 'bg-stone-200 text-stone-500'
                        }`}>
                          {isUnlocked ? "Elishgan" : "Qulfli"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'abacus' && (
            <motion.div
              key="abacus"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <AbacusGame
                onEarnStars={handleEarnStars}
                onUnlockBadge={handleUnlockBadge}
                totalStars={stars.totalStars}
              />
            </motion.div>
          )}

          {activeTab === 'fables' && (
            <motion.div
              key="fables"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CompareFables
                onEarnStars={handleEarnStars}
                onUnlockBadge={handleUnlockBadge}
              />
            </motion.div>
          )}

          {activeTab === 'lab' && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <BridgeLab
                onEarnStars={handleEarnStars}
                onUnlockBadge={handleUnlockBadge}
              />
            </motion.div>
          )}

          {activeTab === 'sages' && (
            <motion.div
              key="sages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SagesRoom
                onEarnStars={handleEarnStars}
                onUnlockBadge={handleUnlockBadge}
              />
            </motion.div>
          )}

          {activeTab === 'quizzes' && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuizArena
                onEarnStars={handleEarnStars}
                onUnlockBadge={handleUnlockBadge}
                userName={userName}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global badge unlock notifier modal */}
      <AnimatePresence>
        {newlyUnlockedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 border-4 border-amber-400 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-amber-400/10 pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-purple-500/10 pointer-events-none" />

              <span className="text-5xl animate-bounce inline-block select-none mt-4">
                🏆
              </span>

              <div>
                <span className="text-xs uppercase tracking-widest font-black text-amber-600 block">Tabriklaymiz!</span>
                <h3 className="text-xl font-black text-stone-800 mt-1">Yangi Nishon Ochildi!</h3>
                <p className="text-xs text-stone-500 mt-1">Siz platformadagi mashaqqatli yo'lni muvaffaqiyatli bosib o'tdingiz!</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <b className="font-bold text-stone-800 text-sm block">🏅 {newlyUnlockedBadge.name}</b>
                <span className="text-xs text-stone-600 mt-1 block">{newlyUnlockedBadge.description}</span>
              </div>

              <button
                onClick={() => setNewlyUnlockedBadge(null)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3 border-b-4 border-amber-700 active:translate-y-0.5 rounded-xl text-xs transition-all"
              >
                Ofarin! Davom Etish
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Humble footer */}
      <footer className="bg-white border-t border-rose-100 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">
            ⚙️ Sharq va G'arb ta'limi platformasi • 2026
          </p>
          <p className="text-[10px] text-stone-400">
            Dono Bobo va Professor Spark yordamida mantiq va intizomni kashf qiling.
          </p>
        </div>
      </footer>
    </div>
  );
}
