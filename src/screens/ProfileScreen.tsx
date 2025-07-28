// src/screens/ProfileScreen.tsx - FIXED: Added profile picture loading from AsyncStorage

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { getLanguageFlag } from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, signOut } = useAuth();
  const { currentLanguage, nativeLanguage } = useLanguage();
  const { totalXP, streak, longestStreak, completedScenarios } = useProgress();
  
  // ADDED: State for profile image
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // ADDED: Load saved profile image on component mount
  useEffect(() => {
    loadSavedProfileImage();
  }, [user]);

  // ADDED: Function to load saved profile image from AsyncStorage
  const loadSavedProfileImage = async () => {
    try {
      const savedImageUri = await AsyncStorage.getItem(`profileImage_${user?.id}`);
      if (savedImageUri) {
        setProfileImage(savedImageUri);
      }
    } catch (error) {
      console.error('Error loading saved profile image:', error);
    }
  };

  // ADDED: Refresh profile image when screen gets focus (when coming back from AccountManagement)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedProfileImage();
    });

    return unsubscribe;
  }, [navigation, user]);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const handleLanguageSettings = () => {
    navigation.navigate('LanguageSelection');
  };

  const handleAccountManagement = () => {
    navigation.navigate('AccountManagement');
  };

  const achievements = [
    { icon: '🎯', title: 'First Steps', description: 'Completed your first lesson' },
    { icon: '🔥', title: 'On Fire', description: 'Maintained a 7-day streak' },
    { icon: '📚', title: 'Scholar', description: 'Completed 10 scenarios' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
        </View>

        <Card style={styles.userCard}>
          <TouchableOpacity style={styles.userInfo} onPress={handleAccountManagement}>
            <View style={styles.userSection}>
              {/* UPDATED: Show saved profile image or fallback to letter */}
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Scholar Level</Text>
            <Text style={styles.levelValue}>
              {totalXP > 1000 ? 'Master' : totalXP > 500 ? 'Advanced' : 'Beginner'}
            </Text>
          </View>
          <View style={styles.levelDetails}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languageItem}>
            <Text style={styles.languageFlag}>{getLanguageFlag(nativeLanguage)}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{nativeLanguage}</Text>
              <Text style={styles.languageLabel}>Native Language</Text>
            </View>
          </View>
          <View style={styles.languageItem}>
            <Text style={styles.languageFlag}>{getLanguageFlag(currentLanguage)}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{currentLanguage}</Text>
              <Text style={styles.languageLabel}>Currently Learning</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSettings}>
            <Icon name="translate" size={20} color={Colors.primary} />
            <Text style={styles.settingText}>App Language</Text>
            <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            icon="logout"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userCard: {
    marginBottom: Layout.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // UPDATED: Style for actual image
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
  },
  // ADDED: Style for letter placeholder
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.background,
  },
  userDetails: {
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  levelCard: {
    backgroundColor: Colors.primary,
    marginBottom: Layout.spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.background,
  },
  levelValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.background,
  },
  levelDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.background,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.background,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    textTransform: 'capitalize',
  },
  languageLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  achievementDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  footer: {
    padding: Layout.spacing.lg,
  },
});