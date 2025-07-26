import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavigationProp, LessonCustomizationScreenRouteProp } from '@/types/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import * as lessonService from '@/services/lesson.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const LessonCustomizationScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<LessonCustomizationScreenRouteProp>();
  const { currentLanguage } = useLanguage();
  const { inputText } = route.params;
  
  const [location, setLocation] = useState('');
  const [formality, setFormality] = useState<'casual' | 'neutral' | 'formal'>('neutral');
  const [isLoading, setIsLoading] = useState(false);

  const locations = [
    { label: 'Mexico City, Mexico', value: 'mexico' },
    { label: 'Madrid, Spain', value: 'spain' },
    { label: 'Buenos Aires, Argentina', value: 'argentina' },
    { label: 'Rome, Italy', value: 'italy' },
    { label: 'General/Multiple regions', value: 'general' }
  ];

  const formalityLevels: Array<'casual' | 'neutral' | 'formal'> = ['casual', 'neutral', 'formal'];

  const handleGenerateLesson = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const lesson = await lessonService.generateLessonFromScenario(
        inputText,
        currentLanguage,
        location,
        formality
      );
      navigation.navigate('Lesson', { lesson });
    } catch (error) {
      console.error('Error generating lesson:', error);
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
              disabled={!location}
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