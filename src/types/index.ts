export interface User {
  id: string;
  email: string;
  name: string;
  nativeLanguage: string;
  learningLanguages: string[];
  currentLevel: Record<string, LanguageLevel>;
}

export interface LanguageLevel {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  xp: number;
  lessonsCompleted: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  scenario: string;
  language: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  culturalNotes?: string;
  phrases: Phrase[];
  variations: LessonVariations;
  tags: string[];
}

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  pronunciation?: string;
  audioUrl?: string;
  literal?: string;
}

export interface LessonVariations {
  formal?: string[];
  informal?: string[];
  regional: Record<string, RegionalVariation>;
}

export interface RegionalVariation {
  region: string;
  phrases: string[];
  notes?: string;
}

export interface UserProgress {
  lessonId: string;
  userId: string;
  masteryLevel: number; // 0-100
  lastPracticed: Date;
  nextReview: Date;
  attemptCount: number;
  correctCount: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  suggestedPhrases: string[];
}

export type InputMethod = 'text' | 'categories' | 'photo';

export interface CompletedScenario {
  id: string;
  title: string;
  mastery: number;
  lastPracticed: string;
}