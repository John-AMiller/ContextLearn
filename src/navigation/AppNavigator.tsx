import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { RootStackParamList } from '@/types/navigation';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { TextInputScreen } from '@/screens/TextInputScreen';
import { CategoriesScreen } from '@/screens/CategoriesScreen';
import { LessonScreen } from '@/screens/LessonsScreen';
import { PracticeScreen } from '@/screens/PracticeScreen';
import { LanguageSelectionScreen } from '@/screens/LanguageSelectionScreen';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/colors';
const Stack = createStackNavigator<RootStackParamList>();



const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { currentLanguage } = useLanguage();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isFirstTimeUser = user && !currentLanguage;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : isFirstTimeUser ? (
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="TextInput" component={TextInputScreen} />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="Lesson" component={LessonScreen} />
          <Stack.Screen name="Practice" component={PracticeScreen} />
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
