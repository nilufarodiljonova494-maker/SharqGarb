/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  level: "Boshlang'ich" | "Kashfiyotchi" | "Arximed" | "Donishmand";
  unlockedAt?: string;
}

export interface ScoreProgress {
  totalStars: number;
  easternFocusStars: number;
  westernInquiryStars: number;
  balanceStars: number;
  completedQuizzes: string[];
  unlockedBadges: string[];
  abacusLevel: number;
  breathingStreak: number;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  source: 'east' | 'west' | 'bridge';
  topic: string;
}

export interface FactItem {
  id: string;
  title: string;
  text?: string;
  eastPerspective: string;
  westPerspective: string;
  category: 'Matematika' | 'Tabiatshunoslik' | 'San\'at va Yozuv' | 'Falsafa va Odob';
  funTask: string;
  funTaskType: 'abacus' | 'inquiry' | 'focus';
}

export interface FableComparison {
  id: string;
  title: string;
  eastFableTitle: string;
  eastFableSummary: string;
  eastMoral: string;
  westFableTitle: string;
  westFableSummary: string;
  westMoral: string;
  bridgeMessage: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
