import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler'; 
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ProgressProvider } from './src/contexts/ProgressContext';
import AppNavigator from './src/navigation/AppNavigator';

// Create a separate component for the context-dependent parts
const AppContent = () => {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <ProgressProvider>
            <AppContent />
          </ProgressProvider>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}