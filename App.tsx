import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler'; // MUST be first line
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ProgressProvider } from './src/contexts/ProgressContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <ProgressProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
          </ProgressProvider>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}