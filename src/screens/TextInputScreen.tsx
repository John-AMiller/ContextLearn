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
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/types/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import * as lessonService from '@/services/lesson.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const TextInputScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { currentLanguage } = useLanguage();
  const [scenario, setScenario] = useState('');
  const [location, setLocation] = useState('');
  const [formality, setFormality] = useState<'casual' | 'neutral' | 'formal'>('neutral');
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    'Order food with dietary restrictions',
    'Ask for directions to the train station',
    'Make a doctor appointment',
    'Complain about hotel room issues',
    'Negotiate price at a market'
  ];

  const locations = [
    { label: 'Mexico City, Mexico', value: 'mexico' },
    { label: 'Madrid, Spain', value: 'spain' },
    { label: 'Buenos Aires, Argentina', value: 'argentina' },
    { label: 'Rome, Italy', value: 'italy' },
    { label: 'General/Multiple regions', value: 'general' }
  ];

  const handleGenerateLesson = async () => {
    if (!scenario.trim()) return;

    setIsLoading(true);
    try {
      const lesson = await lessonService.generateLessonFromScenario(
        scenario,
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
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>What do you need to learn?</Text>
            </View>

            <Card>
            <Input
                label="Describe your scenario"
                placeholder="Example: I need to order a sandwich at a deli and ask about ingredients because I have allergies..."
                value={scenario}
                onChangeText={setScenario}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />

            <View style={styles.suggestions}>
                <Text style={styles.suggestionsTitle}>Popular scenarios:</Text>
                <View style={styles.suggestionTags}>
                {suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                    key={index}
                    style={styles.suggestionTag}
                    onPress={() => setScenario(suggestion)}
                    >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>
            </Card>

            <Card>
            <Text style={styles.sectionTitle}>Customize your lesson</Text>
            
            <View style={styles.field}>
                <Text style={styles.fieldLabel}>Where will you use this?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                </ScrollView>
            </View>

            <View style={styles.field}>
                <Text style={styles.fieldLabel}>Formality level?</Text>
                <View style={styles.formalityOptions}>
                {(['casual', 'neutral', 'formal'] as const).map((level) => (
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
            </View>
            </Card>

            <View style={styles.footer}>
            <Button
                title="Generate Personalized Lesson"
                onPress={handleGenerateLesson}
                disabled={!scenario.trim()}
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  suggestions: {
    marginTop: Layout.spacing.md,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
  },
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  suggestionTag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  field: {
    marginBottom: Layout.spacing.lg,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  optionButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Layout.spacing.sm,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  optionTextActive: {
    color: Colors.background,
  },
  formalityOptions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  formalityButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.surface,
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
    fontWeight: '500',
    color: Colors.text,
  },
  formalityTextActive: {
    color: Colors.background,
  },
  footer: {
    padding: Layout.spacing.lg,
  },
});