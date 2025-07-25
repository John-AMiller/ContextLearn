import { supabase, Profile } from '@/utils/supabase';
import { User } from '@/types';

export const signIn = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw profileError;

  return transformProfile(profile);
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) throw error;

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user!.id,
      email,
      name,
      native_language: 'english',
      learning_languages: []
    });

  if (profileError) throw profileError;

  return {
    id: data.user!.id,
    email,
    name,
    nativeLanguage: 'english',
    learningLanguages: [],
    currentLevel: {}
  };
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;

  return transformProfile(profile);
};

const transformProfile = (profile: Profile): User => {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    nativeLanguage: profile.native_language,
    learningLanguages: profile.learning_languages || [],
    currentLevel: {} // Load from progress table
  };
};