import { Platform } from 'react-native';
import { setupURLPolyfill } from 'react-native-url-polyfill';

if (Platform.OS !== 'web') {
  setupURLPolyfill();
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock, 
  },
});

export interface Profile {
  id: string;
  email: string;
  name: string;
  native_language: string;
  learning_languages: string[];
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  language: string;
  lesson_id: string;
  mastery_level: number;
  last_practiced: string;
  next_review: string;
  created_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_practice_date: string;
  updated_at: string;
}