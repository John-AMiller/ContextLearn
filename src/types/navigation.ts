import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { Lesson } from './index';

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  UserSetup: undefined; // New screen for initial user setup
  LanguageSelection: undefined; // Existing screen for app language preferences
  LessonCustomization: { inputText: string }; // Renamed from TextInput, now receives inputText
  Categories: undefined;
  Lesson: { lesson: Lesson };
  Practice: { lesson: Lesson };
};

export type TabParamList = {
  Home: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

// Screen Props
export type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;
export type PracticeScreenRouteProp = RouteProp<RootStackParamList, 'Practice'>;
export type LessonCustomizationScreenRouteProp = RouteProp<RootStackParamList, 'LessonCustomization'>;