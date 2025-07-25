import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  currentLanguage: string;
  nativeLanguage: string;
  setCurrentLanguage: (language: string) => void;
  setNativeLanguage: (language: string) => void;
  availableLanguages: string[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('spanish');
  const [nativeLanguage, setNativeLanguage] = useState('english');
  const availableLanguages = ['english', 'spanish', 'italian'];

  useEffect(() => {
    loadLanguagePreferences();
  }, []);

  const loadLanguagePreferences = async () => {
    try {
      const current = await AsyncStorage.getItem('currentLanguage');
      const native = await AsyncStorage.getItem('nativeLanguage');
      if (current) setCurrentLanguage(current);
      if (native) setNativeLanguage(native);
    } catch (error) {
      console.error('Error loading language preferences:', error);
    }
  };

  const updateCurrentLanguage = async (language: string) => {
    setCurrentLanguage(language);
    await AsyncStorage.setItem('currentLanguage', language);
  };

  const updateNativeLanguage = async (language: string) => {
    setNativeLanguage(language);
    await AsyncStorage.setItem('nativeLanguage', language);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        nativeLanguage, 
        setCurrentLanguage: updateCurrentLanguage,
        setNativeLanguage: updateNativeLanguage,
        availableLanguages 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};