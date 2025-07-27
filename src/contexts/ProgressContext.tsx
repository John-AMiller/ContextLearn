import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserProgress, CompletedScenario } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage'; 
import * as storageService from '@/services/storage.service';
import * as streakService from '@/services/streak.service';
import { supabase } from '@/utils/supabase';
import { formatRelativeTime } from '@/utils/lessonHelpers';

interface ProgressContextType {
  completedScenarios: CompletedScenario[];
  streak: number;
  longestStreak: number;
  totalXP: number;
  isLoading: boolean;
  addCompletedScenario: (scenario: CompletedScenario) => Promise<void>;
  updateProgress: (progress: UserProgress) => Promise<void>;
  getScenarioProgress: (scenarioId: string) => CompletedScenario | undefined;
  refreshStreak: () => Promise<void>;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useAuth();
  const languageContext = useLanguage();
  
  // Add safety checks
  const user = authContext?.user;
  const currentLanguage = languageContext?.currentLanguage;
  
  const [completedScenarios, setCompletedScenarios] = useState<CompletedScenario[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run if contexts are available
    if (authContext && languageContext) {
      if (user) {
        loadProgress();
        loadStreak();
      } else {
        setCompletedScenarios([]);
        setStreak(0);
        setLongestStreak(0);
        setTotalXP(0);
        setIsLoading(false);
      }
    }
  }, [user, currentLanguage, authContext, languageContext]);


  const loadProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('language', currentLanguage) // Filter by current language
        .order('last_practiced', { ascending: false });

      if (error) throw error;

      const scenarios: CompletedScenario[] = data.map(progress => ({
        id: progress.lesson_id,
        title: progress.lesson_id,
        mastery: progress.mastery_level,
        lastPracticed: new Date(progress.last_practiced).toISOString(),
      }));

      setCompletedScenarios(scenarios);
      
      const xp = data.reduce((sum, progress) => sum + (progress.mastery_level * 10), 0);
      setTotalXP(xp);
    } catch (error) {
      console.error('Error loading progress:', error);
      const localProgress = await storageService.getProgress();
      if (localProgress) {
        setCompletedScenarios(localProgress.completedScenarios || []);
        setTotalXP(localProgress.totalXP || 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadStreak = async () => {
    if (!user) return;

    const streakData = await streakService.getStreak(user.id);
    if (streakData) {
      setStreak(streakData.current_streak);
      setLongestStreak(streakData.longest_streak);
    }
  };

  const addCompletedScenario = async (scenario: CompletedScenario) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          language: currentLanguage, // Use currentLanguage from context
          lesson_id: scenario.id,
          mastery_level: scenario.mastery,
          last_practiced: new Date().toISOString(),
          next_review: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });

      if (error) throw error;

      const updated = [...completedScenarios, scenario];
      setCompletedScenarios(updated);

      await refreshStreak();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const updateProgress = async (progress: UserProgress) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          language: currentLanguage, // Use language from progress or current
          lesson_id: progress.lessonId,
          mastery_level: progress.masteryLevel,
          last_practiced: progress.lastPracticed.toISOString(),
          next_review: progress.nextReview.toISOString(),
          attempt_count: progress.attemptCount,
          correct_count: progress.correctCount,
        });

      if (error) throw error;

      const xpGained = Math.round(progress.masteryLevel * 10);
      setTotalXP(prev => prev + xpGained);

      await refreshStreak();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const refreshStreak = async () => {
    if (!user) return;

    const updatedStreak = await streakService.updateStreak(user.id);
    if (updatedStreak) {
      setStreak(updatedStreak.current_streak);
      setLongestStreak(updatedStreak.longest_streak);
    }
  };

  const getScenarioProgress = (scenarioId: string) => {
    return completedScenarios.find(s => s.id === scenarioId);
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        completedScenarios, 
        streak,
        longestStreak,
        totalXP,
        isLoading,
        addCompletedScenario,
        updateProgress,
        getScenarioProgress,
        refreshStreak,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};