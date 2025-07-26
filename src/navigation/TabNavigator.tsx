import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@/types/navigation';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import ProgressScreen from '@/screens/ProgressScreen';
import { Colors } from '@/constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};



import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/common/Card';
import { Layout } from '@/constants/layout';
import { useProgress } from '@/hooks/useProgress';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  overviewCard: {
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayBar: {
    width: '60%',
    borderRadius: Layout.borderRadius.sm,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.sm,
  },
  scenarioItem: {
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  scenarioInfo: {
    marginBottom: Layout.spacing.sm,
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  scenarioDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  masteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  masteryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    width: 40,
  },
  masteryBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
  },
  masteryFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
});

export default TabNavigator;