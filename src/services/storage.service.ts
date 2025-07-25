import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompletedScenario, UserProgress } from '@/types';

const STORAGE_KEYS = {
  PROGRESS: 'user_progress',
  COMPLETED_SCENARIOS: 'completed_scenarios',
  STREAK: 'streak_data',
  SETTINGS: 'app_settings'
};

export interface ProgressData {
  completedScenarios: CompletedScenario[];
  streak: number;
  totalXP: number;
}

export const saveProgress = async (progress: ProgressData): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const getProgress = async (): Promise<ProgressData | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : null;
};

export const saveLesson = async (lessonId: string, lessonData: any): Promise<void> => {
  await AsyncStorage.setItem(`lesson_${lessonId}`, JSON.stringify(lessonData));
};

export const getLesson = async (lessonId: string): Promise<any | null> => {
  const data = await AsyncStorage.getItem(`lesson_${lessonId}`);
  return data ? JSON.parse(data) : null;
};

export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.clear();
};