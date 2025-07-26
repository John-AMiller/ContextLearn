import React, { useState } from 'react';
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
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { supabase } from '@/utils/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NATIVE_LANGUAGES = [
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'french', name: 'French', flag: '🇫🇷' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
  { code: 'italian', name: 'Italian', flag: '🇮🇹' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
];

const LEARNING_LANGUAGES = [
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'french', name: 'French', flag: '🇫🇷' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
  { code: 'italian', name: 'Italian', flag: '🇮🇹' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'english', name: 'English', flag: '🇺🇸' },
];

export const UserSetupScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, updateProfile } = useAuth();
  const { setNativeLanguage, setCurrentLanguage } = useLanguage();
  
  const [selectedNative, setSelectedNative] = useState('english');
  const [selectedLearning, setSelectedLearning] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleLearningLanguage = (languageCode: string) => {
    if (languageCode === selectedNative) return; // Can't learn your native language
    
    setSelectedLearning(prev => 
      prev.includes(languageCode) 
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode]
    );
  };

  const handleContinue = async () => {
    if (selectedLearning.length === 0) {
      Alert.alert('Please select a language', 'Choose at least one language you want to learn');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Please enter your location', 'This helps us provide region-specific content');
      return;
    }

    setIsLoading(true);
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          native_language: selectedNative,
          learning_languages: selectedLearning,
          location: location.trim(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local state
      setNativeLanguage(selectedNative);
      setCurrentLanguage(selectedLearning[0]);
      
      // Update auth context
      await updateProfile({
        nativeLanguage: selectedNative,
        learningLanguages: selectedLearning,
      });

    } catch (error) {
      console.error('Setup error:', error);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to ContextLearn!</Text>
          <Text style={styles.subtitle}>Let's personalize your learning experience</Text>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>I speak:</Text>
          <View style={styles.languageGrid}>
            {NATIVE_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  selectedNative === lang.code && styles.languageOptionSelected
                ]}
                onPress={() => setSelectedNative(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageName,
                  selectedNative === lang.code && styles.languageNameSelected
                ]}>
                  {lang.name}
                </Text>
                {selectedNative === lang.code && (
                  <Icon name="check" size={16} color={Colors.primary} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>I want to learn:</Text>
          <Text style={styles.hint}>Select one or more languages</Text>
          <View style={styles.languageGrid}>
            {LEARNING_LANGUAGES.map((lang) => {
              const isNative = lang.code === selectedNative;
              const isSelected = selectedLearning.includes(lang.code);
              
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    isSelected && styles.languageOptionSelected,
                    isNative && styles.languageOptionDisabled
                  ]}
                  onPress={() => toggleLearningLanguage(lang.code)}
                  disabled={isNative}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    isSelected && styles.languageNameSelected,
                    isNative && styles.languageNameDisabled
                  ]}>
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <Icon name="check" size={16} color={Colors.primary} style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Where will you primarily use this?</Text>
          <Text style={styles.hint}>
            This helps us teach relevant phrases and cultural context
          </Text>
          <Input
            value={location}
            onChangeText={setLocation}
            placeholder="e.g., Madrid, Tokyo, New York..."
            icon={<Icon name="map-marker" size={20} color={Colors.textSecondary} />}
          />
        </Card>

        <View style={styles.footer}>
          <Button
            title="Start Learning"
            onPress={handleContinue}
            loading={isLoading}
            disabled={selectedLearning.length === 0 || !location.trim()}
          />
          <Text style={styles.footerText}>
            You can change these preferences anytime in settings
          </Text>
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
  header: {
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  hint: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
  },
  languageOption: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.sm,
  },
  languageOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  languageOptionDisabled: {
    opacity: 0.5,
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: Layout.spacing.xs,
  },
  languageName: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  languageNameSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  languageNameDisabled: {
    color: Colors.textSecondary,
    opacity: 0.5,
  },
  checkIcon: {
    position: 'absolute',
    top: Layout.spacing.xs,
    right: Layout.spacing.xs,
  },
  footer: {
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.md,
    textAlign: 'center',
  },
});