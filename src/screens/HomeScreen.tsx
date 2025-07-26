import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated,
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
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { getGreeting, getLanguageFlag } from '@/utils/helpers';
import { findScenarioMatch, getConfirmationMessage } from '@/services/scenarioMatching.service';
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
      icon: 'school-outline', 
      label: 'Lessons', 
      id: 'lessons',
      description: 'Structured curriculum from basics to advanced',
      onPress: () => navigation.navigate('LinearLessons')
    },
    { 
      icon: 'view-grid-outline', 
      label: 'Browse Categories', 
      id: 'categories',
      description: 'Practice specific scenarios and situations',
      onPress: () => navigation.navigate('Categories')
    },
    { 
      icon: 'camera-outline', 
      label: 'Upload Photo', 
      id: 'photo',
      description: 'Learn from images with AI assistance',
      onPress: () => navigation.navigate('PhotoUpload')
    }
  ];

  const handleContinueToCustomization = () => {
    if (!inputText.trim()) return;

    // Check if input matches any existing scenarios
    const scenarioMatch = findScenarioMatch(inputText.trim());
    
    if (scenarioMatch.isMatch && scenarioMatch.matchedScenario) {
      // Show confirmation dialog for matched scenario
      const confirmationMessage = getConfirmationMessage(scenarioMatch.matchedScenario);
      
      Alert.alert(
        'Found a Match!',
        confirmationMessage,
        [
          {
            text: 'Yes',
            onPress: () => {
              // Navigate to Categories screen (they'll find the matching scenario there)
              navigation.navigate('Categories');
            }
          },
          {
            text: 'No',
            onPress: () => {
              // Create custom lesson with original input
              navigation.navigate('LessonCustomization', { inputText });
            }
          }
        ]
      );
    } else {
      // No match found, go straight to custom lesson
      navigation.navigate('LessonCustomization', { inputText });
    }
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
              Learning {getLanguageFlag(currentLanguage)} {currentLanguage?.charAt(0).toUpperCase() + currentLanguage?.slice(1)}
            </Text>
          </View>
          <LanguageSwitcher />
        </View>

        {/* Streak Display */}
        {streak > 0 && (
          <Card style={styles.streakCard}>
            <View style={styles.streakContent}>
              <Icon name="fire" size={24} color="#ff6b35" />
              <Text style={styles.streakText}>
                {streak} day streak! Keep it up! 🔥
              </Text>
            </View>
          </Card>
        )}

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

        {/* Learning Options */}
        <Card>
          <Text style={styles.sectionTitle}>Learning Options</Text>
          {secondaryMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodButton}
              onPress={method.onPress}
            >
              <View style={styles.methodIcon}>
                <Icon name={method.icon} size={24} color={Colors.primary} />
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodText}>{method.label}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              <Icon name="chevron-right" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Ready for Review Section */}
        {completedScenarios.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Ready for Review</Text>
            {completedScenarios.slice(0, 3).map((scenario, index) => (
              <View key={scenario.id} style={styles.reviewItem}>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewTitle}>{scenario.title}</Text>
                  <Text style={styles.reviewMastery}>
                    {scenario.mastery}% mastery • {scenario.lastPracticed}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => {
                    // TODO: Navigate to review for this scenario
                    console.log('Review scenario:', scenario.id);
                  }}
                >
                  <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            {completedScenarios.length > 3 && (
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>
                  See all {completedScenarios.length} completed scenarios
                </Text>
                <Icon name="chevron-right" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </Card>
        )}
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
  },
  streakCard: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
    marginBottom: Layout.spacing.md,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d84315',
  },
  primaryCard: {
    marginBottom: Layout.spacing.md,
  },
  primaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  primarySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
  },
  inputContainer: {
    position: 'relative',
  },
  primaryInput: {
    minHeight: 80,
    paddingRight: 50,
  },
  continueButtonContainer: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  continueButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderBottomColor: Colors.border,
  },
  methodIcon: {
    width: 40,
    alignItems: 'center',
  },
  methodContent: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  methodDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewMastery: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  reviewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    marginTop: Layout.spacing.sm,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: Layout.spacing.xs,
  },
});