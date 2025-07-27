import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@/types/navigation';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { GuildScreen } from '@/screens/GuildScreen';
import { JourneyScreen } from '@/screens/JourneyScreen';
import { Colors } from '@/constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.navigation.active,
        tabBarInactiveTintColor: Colors.navigation.inactive,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 2,
          borderTopColor: Colors.navigation.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.3,
          marginTop: 3,
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
        name="Journey"
        component={JourneyScreen}
        options={{
          tabBarLabel: 'Journey',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Guild"
        component={GuildScreen}
        options={{
          tabBarLabel: 'Guild',
          tabBarIcon: ({ color, size }) => (
            <Icon name="castle" size={size} color={color} />
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

export default TabNavigator;