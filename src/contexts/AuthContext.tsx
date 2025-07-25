import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import * as authService from '@/services/auth.service';
import { supabase } from '@/utils/supabase';


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFirstTimeUser: boolean; // This should be here
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    checkAuthState();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          // Check if user has selected languages
          if (currentUser && (!currentUser.learningLanguages || currentUser.learningLanguages.length === 0)) {
            setIsFirstTimeUser(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsFirstTimeUser(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Check if first time user (no languages selected)
      if (currentUser && (!currentUser.learningLanguages || currentUser.learningLanguages.length === 0)) {
        setIsFirstTimeUser(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const user = await authService.signIn(email, password);
    setUser(user);
    
    if (!user.learningLanguages || user.learningLanguages.length === 0) {
      setIsFirstTimeUser(true);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const user = await authService.signUp(email, password, name);
    setUser(user);
    setIsFirstTimeUser(true); // New users always need language selection
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setIsFirstTimeUser(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    if (updates.learningLanguages && updates.learningLanguages.length > 0) {
      setIsFirstTimeUser(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isFirstTimeUser,
      signIn, 
      signUp, 
      signOut,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};