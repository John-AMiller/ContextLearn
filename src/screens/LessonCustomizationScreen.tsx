// src/screens/LessonCustomizationScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavigationProp, LessonCustomizationScreenRouteProp } from '@/types/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Lesson } from '@/types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { generateLessonContent, filterVocabularyByLength } from '@/services/ai.service';
import { generateLessonTitle, generateLessonId } from '@/utils/lessonHelpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const LessonCustomizationScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<LessonCustomizationScreenRouteProp>();
  const { currentLanguage } = useLanguage();
  const { inputText } = route.params;
  
  const [lessonType, setLessonType] = useState<'rapid' | 'full' | null>(null);
  const [location, setLocation] = useState('');
  const [formality, setFormality] = useState<'casual' | 'neutral' | 'formal'>('neutral');
  const [isLoading, setIsLoading] = useState(false);

  const locations = [
    { label: 'Mexico City, Mexico', value: 'mexico' },
    { label: 'Madrid, Spain', value: 'spain' },
    { label: 'Buenos Aires, Argentina', value: 'argentina' },
    { label: 'Santiago, Chile', value: 'chile' },
    { label: 'General/Multiple regions', value: 'general' }
  ];

  const formalityLevels: Array<'casual' | 'neutral' | 'formal'> = ['casual', 'neutral', 'formal'];

  const handleGenerateLesson = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please provide some text to generate a lesson from');
      return;
    }

    if (!lessonType) {
      Alert.alert('Please select a lesson length');
      return;
    }

    if (!location) {
      Alert.alert('Please select a location');
      return;
    }

    setIsLoading(true);
    try {
      const lessonContent = await generateLessonContent(
        inputText,
        currentLanguage,
        location,
        formality
      );
      
      const filteredVocabulary = filterVocabularyByLength(lessonContent.vocabulary, lessonType);
      
      // Generate meaningful title and ID
      const lessonTitle = generateLessonTitle(inputText);
      const lessonId = generateLessonId(lessonTitle);
      
      const lesson: Lesson = {
        id: lessonId,
        title: lessonTitle,
        scenario: lessonContent.scenario,
        language: currentLanguage,
        difficulty: (lessonType === 'rapid' ? 2 : 3) as 1 | 2 | 3 | 4 | 5,
        culturalNotes: lessonContent.culturalNotes,
        phrases: filteredVocabulary.map((vocab, index) => ({
          id: `phrase-${index}`,
          phrase: vocab.word,
          translation: vocab.translation,
          literal: vocab.examples[0] || vocab.word,
          grammarNote: vocab.grammarNote
        })),
        variations: {
          formal: [],
          informal: [],
          regional: {}
        },
        tags: ['text-generated', lessonType]
      };
      
      navigation.navigate('Practice', { lesson });
    } catch (error) {
      console.error('Error generating lesson:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate lesson';
      Alert.alert('Lesson Generation Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Customize Your Lesson</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Show what they entered */}
          <Card style={styles.inputSummaryCard}>
            <Text style={styles.inputSummaryLabel}>You want to learn:</Text>
            <Text style={styles.inputSummaryText}>"{inputText}"</Text>
          </Card>

          {/* Lesson Length Selection */}
          <Card>
            <Text style={styles.sectionTitle}>Choose Lesson Length</Text>
            <Text style={styles.sectionDescription}>
              How much vocabulary would you like to learn?
            </Text>
            
            <View style={styles.lessonTypeRow}>
              <TouchableOpacity
                style={[
                  styles.lessonTypeButton,
                  lessonType === 'rapid' && styles.lessonTypeButtonActive
                ]}
                onPress={() => setLessonType('rapid')}
              >
                <Icon name="flash" size={20} color={lessonType === 'rapid' ? Colors.background : Colors.primary} />
                <Text style={[
                  styles.lessonTypeText,
                  lessonType === 'rapid' && styles.lessonTypeTextActive
                ]}>
                  Rapid
                </Text>
                <Text style={[
                  styles.lessonTypeSubtext,
                  lessonType === 'rapid' && styles.lessonTypeSubtextActive
                ]}>
                  5-6 words
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.lessonTypeButton,
                  lessonType === 'full' && styles.lessonTypeButtonActive
                ]}
                onPress={() => setLessonType('full')}
              >
                <Icon name="book-open-variant" size={20} color={lessonType === 'full' ? Colors.background : Colors.primary} />
                <Text style={[
                  styles.lessonTypeText,
                  lessonType === 'full' && styles.lessonTypeTextActive
                ]}>
                  Full
                </Text>
                <Text style={[
                  styles.lessonTypeSubtext,
                  lessonType === 'full' && styles.lessonTypeSubtextActive
                ]}>
                  15-20 words
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Location Selection */}
          <Card>
            <Text style={styles.sectionTitle}>Where will you use this?</Text>
            <Text style={styles.sectionDescription}>
              This helps us include region-specific phrases and cultural context
            </Text>
            
            <View style={styles.optionsGrid}>
              {locations.map((loc) => (
                <TouchableOpacity
                  key={loc.value}
                  style={[
                    styles.optionButton,
                    location === loc.value && styles.optionButtonActive
                  ]}
                  onPress={() => setLocation(loc.value)}
                >
                  <Text style={[
                    styles.optionText,
                    location === loc.value && styles.optionTextActive
                  ]}>
                    {loc.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Formality Level */}
          <Card>
            <Text style={styles.sectionTitle}>How formal should this be?</Text>
            <Text style={styles.sectionDescription}>
              Choose the tone that matches your situation
            </Text>
            
            <View style={styles.formalityContainer}>
              {formalityLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.formalityButton,
                    formality === level && styles.formalityButtonActive
                  ]}
                  onPress={() => setFormality(level)}
                >
                  <Text style={[
                    styles.formalityText,
                    formality === level && styles.formalityTextActive
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <View style={styles.footer}>
            <Button
              title="Generate Personalized Lesson"
              onPress={handleGenerateLesson}
              disabled={!lessonType || !location}
              loading={isLoading}
              icon={<Icon name="auto-fix" size={20} color={Colors.background} />}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  inputSummaryCard: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    marginBottom: Layout.spacing.md,
    marginHorizontal: Layout.spacing.lg,
  },
  inputSummaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  inputSummaryText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  lessonTypeRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  lessonTypeButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  lessonTypeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  lessonTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Layout.spacing.xs,
    marginBottom: Layout.spacing.xs,
  },
  lessonTypeTextActive: {
    color: Colors.background,
  },
  lessonTypeSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  lessonTypeSubtextActive: {
    color: Colors.background + 'CC',
  },
  optionsGrid: {
    gap: Layout.spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  optionTextActive: {
    color: Colors.background,
    fontWeight: '500',
  },
  formalityContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  formalityButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  formalityButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  formalityText: {
    fontSize: 14,
    color: Colors.text,
  },
  formalityTextActive: {
    color: Colors.background,
    fontWeight: '500',
  },
  footer: {
    padding: Layout.spacing.lg,
  },
});