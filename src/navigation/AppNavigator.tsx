import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/hooks/useAuth';
import { RootStackParamList } from '@/types/navigation';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { LessonCustomizationScreen } from '@/screens/LessonCustomizationScreen';
import { CategoriesScreen } from '@/screens/CategoriesScreen';
import { LessonScreen } from '@/screens/LessonsScreen';
import { PracticeScreen } from '@/screens/PracticeScreen';
import { LanguageSelectionScreen } from '@/screens/LanguageSelectionScreen';
import { UserSetupScreen } from '@/screens/UserSetupScreen';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/colors';

const Stack = createStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const AppNavigator: React.FC = () => {
  const { user, isLoading, isFirstTimeUser } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : isFirstTimeUser ? (
        <Stack.Screen name="UserSetup" component={UserSetupScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="LessonCustomization" component={LessonCustomizationScreen} />
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