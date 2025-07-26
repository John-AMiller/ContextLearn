import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
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
  
  const [inputText, setInputText] = useState('');

  const secondaryMethods = [
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

  const handleContinueToCustomization = () => {
    navigation.navigate('LessonCustomization', { inputText });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.name || 'Learner'}!
            </Text>
            <Text style={styles.subtitle}>
              Learning {getLanguageFlag(currentLanguage)} {}
            </Text>
          </View>
          <LanguageSwitcher />
        </View>

        {/* Primary Input Section */}
        <Card style={styles.primaryCard}>
          <Text style={styles.primaryTitle}>What would you like to learn?</Text>
          <Text style={styles.primarySubtitle}>
            Describe a scenario, topic, or specific words you want to practice
          </Text>
          
          <View style={styles.inputContainer}>
            <Input
              value={inputText}
              onChangeText={setInputText}
              placeholder="Enter a scenario, topic, or word..."
              multiline
              style={styles.primaryInput}
              maxLength={300}
            />
            
            {inputText.trim().length > 0 && (
              <Animated.View style={styles.continueButtonContainer}>
                <TouchableOpacity 
                  style={styles.continueButton}
                  onPress={handleContinueToCustomization}
                >
                  <Icon name="arrow-right" size={20} color={Colors.background} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
          
          {inputText.trim().length > 0 && (
            <Text style={styles.characterCount}>
              {inputText.length}/300 characters
            </Text>
          )}
        </Card>

        {/* Secondary Options */}
        <Card>
          <Text style={styles.sectionTitle}>Other Options</Text>
          {secondaryMethods.map(method => (
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

        {/* Ready for Review Section */}
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

        {/* Streak Card */}
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
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    textTransform: 'capitalize',
  },
  primaryCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.primary + '10', // Light primary color background
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  primaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  primarySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  inputContainer: {
    position: 'relative',
  },
  primaryInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
    paddingRight: 60, // Space for the button
  },
  continueButtonContainer: {
    position: 'absolute',
    right: Layout.spacing.sm,
    bottom: Layout.spacing.sm,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
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