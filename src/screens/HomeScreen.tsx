import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
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
import { getGreeting, getLanguageFlag } from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { completedScenarios, streak } = useProgress();

  const inputMethods = [
    { 
      icon: 'message-text-outline', 
      label: 'Describe Scenario', 
      id: 'text',
      onPress: () => navigation.navigate('TextInput')
    },
    { 
      icon: 'view-grid-outline', 
      label: 'Browse Categories', 
      id: 'categories',
      onPress: () => navigation.navigate('Categories')
    },
    { 
      icon: 'camera-outline', 
      label: 'Upload Photo', 
      id: 'photo',
      onPress: () => console.log('Photo upload - coming soon!')
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>
                {getGreeting()}, {user?.name || 'Learner'}!
                </Text>
                <Text style={styles.subtitle}>
                Learning {getLanguageFlag(currentLanguage)} {currentLanguage}
                </Text>
            </View>
            <LanguageSwitcher />
        </View>



        <Card>
            <Text style={styles.sectionTitle}>What do you need help with?</Text>
            {inputMethods.map(method => (
            <TouchableOpacity
                key={method.id}
                style={styles.methodButton}
                onPress={method.onPress}
            >
                <Icon name={method.icon} size={24} color={Colors.primary} />
                <Text style={styles.methodText}>{method.label}</Text>
                <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
            ))}
        </Card>

        {completedScenarios.length > 0 && (
            <Card>
            <Text style={styles.sectionTitle}>Ready for Review</Text>
            {completedScenarios.slice(0, 3).map((scenario) => (
                <View key={scenario.id} style={styles.reviewItem}>
                <View style={styles.reviewInfo}>
                    <Text style={styles.reviewTitle}>{scenario.title}</Text>
                    <Text style={styles.reviewSubtitle}>
                    {scenario.lastPracticed} • {scenario.mastery}% mastery
                    </Text>
                </View>
                <Button
                    title="Review"
                    variant="outline"
                    size="small"
                    onPress={() => console.log('Review:', scenario.id)}
                />
                </View>
            ))}
            </Card>
        )}

        <Card style={styles.streakCard}>
            <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>Current Streak</Text>
            <Text style={styles.streakCount}>🔥 {streak} days</Text>
            </View>
            <View style={styles.streakDays}>
            {[...Array(7)].map((_, i) => (
                <View 
                key={i} 
                style={[
                    styles.streakDay, 
                    i < streak ? styles.streakDayActive : styles.streakDayInactive
                ]} 
                />
            ))}
            </View>
        </Card>
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
    flex:1,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: Layout.spacing.md,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.sm,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  reviewSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  streakCard: {
    marginBottom: Layout.spacing.xl,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  streakCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakDays: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  streakDay: {
    flex: 1,
    height: 8,
    borderRadius: Layout.borderRadius.sm,
  },
  streakDayActive: {
    backgroundColor: Colors.success,
  },
  streakDayInactive: {
    backgroundColor: Colors.divider,
  },
});