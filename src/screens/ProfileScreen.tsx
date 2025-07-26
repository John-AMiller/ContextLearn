import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert 
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

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, signOut } = useAuth();
  const { currentLanguage, nativeLanguage } = useLanguage();
  const { totalXP, streak, longestStreak, completedScenarios } = useProgress();

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
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>
              {getLanguageFlag(currentLanguage)} {currentLanguage?.charAt(0).toUpperCase() + currentLanguage?.slice(1)}
            </Text>
            <Text style={styles.levelNumber}>Level {Math.floor(totalXP / 100) + 1}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(totalXP % 100)}%` }]} />
          </View>
          <Text style={styles.xpText}>{totalXP % 100}/100 XP to next level</Text>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Icon name="trophy" size={32} color={Colors.warning} />
            <Text style={styles.statNumber}>{totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="fire" size={32} color={Colors.danger} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="check-circle" size={32} color={Colors.success} />
            <Text style={styles.statNumber}>{completedScenarios.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languagesList}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>{getLanguageFlag(nativeLanguage)}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{nativeLanguage}</Text>
                <Text style={styles.languageLevel}>Native</Text>
              </View>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>{getLanguageFlag(currentLanguage)}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{currentLanguage}</Text>
                <Text style={styles.languageLevel}>
                  Level {Math.floor(totalXP / 100) + 1}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSettings}>
            <Icon name="translate" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Language Preferences</Text>
            <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="bell" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
            <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="help-circle" size={24} color={Colors.primary} />
            <Text style={styles.settingText}>Help & Support</Text>
            <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            icon={<Icon name="logout" size={20} color={Colors.danger} />}
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
  },
  avatar: {
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
    marginBottom: Layout.spacing.sm,
  },
  levelTitle: {
    fontSize: 16,
    color: Colors.background,
    textTransform: 'capitalize',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.background,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.background,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 14,
    color: Colors.background,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Layout.spacing.lg,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: Layout.spacing.sm,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  languagesList: {
    marginBottom: Layout.spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  languageFlag: {
    fontSize: 32,
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
  languageLevel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  achievementsList: {
    gap: Layout.spacing.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  achievementIcon: {
    fontSize: 32,
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
    fontSize: 14,
    color: Colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: Layout.spacing.md,
  },
  footer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
});