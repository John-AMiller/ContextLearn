// src/types/linearLessons.ts

export interface LinearLesson {
  id: string;
  title: string;
  category: LessonCategory;
  level: number;
  language: string;
  prerequisites: string[]; // Array of lesson IDs that must be completed first
  learningObjectives: string[];
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
  isLocked: boolean;
  estimatedTime: number; // in minutes
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  audioUrl?: string;
  imageUrl?: string;
  examples: string[];
  partOfSpeech: PartOfSpeech;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  question: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  distractors: string[]; // Previously learned words used as wrong answers
  hint?: string;
  explanation?: string;
}

export type LessonCategory = 
  | 'nouns' 
  | 'verbs' 
  | 'adjectives' 
  | 'pronouns' 
  | 'prepositions'
  | 'numbers'
  | 'colors'
  | 'family'
  | 'food'
  | 'time'
  | 'weather'
  | 'travel'
  | 'grammar-basics'
  | 'sentence-structure';

export type ExerciseType = 
  | 'translation-to-target'    // Translate "apple" to Spanish
  | 'translation-to-native'    // Translate "manzana" to English
  | 'multiple-choice'          // What is "manzana"? a) apple b) orange c) banana
  | 'fill-in-blank'           // I want to eat an ___ (apple/manzana)
  | 'listening'               // Listen and type what you hear
  | 'match-pairs'             // Match words with their translations
  | 'sentence-building'       // Arrange words to form a sentence
  | 'pronunciation'           // Speak this word correctly;

export type PartOfSpeech = 
  | 'noun' 
  | 'verb' 
  | 'adjective' 
  | 'pronoun' 
  | 'preposition' 
  | 'adverb' 
  | 'article' 
  | 'conjunction';

export interface LessonProgress {
  lessonId: string;
  userId: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  score: number; // 0-100
  timeSpent: number; // in seconds
  exerciseScores: Record<string, number>; // exerciseId -> score
  lastAttempted: Date;
  attemptsCount: number;
}

export interface LessonPath {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  lessons: LinearLesson[];
  color: string;
  icon: string;
}

// Curriculum structure for easy progression tracking
export interface Curriculum {
  language: string;
  paths: LessonPath[];
  totalLessons: number;
  estimatedDuration: string; // "3-6 months"
}