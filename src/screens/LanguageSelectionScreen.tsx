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
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { getLanguageFlag } from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '@/utils/supabase';

const AVAILABLE_LANGUAGES = [
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'italian', name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  { code: 'french', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'german', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  { code: 'chinese', name: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'japanese', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { code: 'korean', name: 'Korean', flag: '🇰🇷', native: '한국어' },
];

const NATIVE_LANGUAGES = [
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'french', name: 'French', flag: '🇫🇷' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'chinese', name: 'Chinese', flag: '🇨🇳' },
];

export const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, updateProfile } = useAuth();
  const { setCurrentLanguage, setNativeLanguage } = useLanguage();
  const [selectedNative, setSelectedNative] = useState('english');
  const [selectedLearning, setSelectedLearning] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = (langCode: string) => {
    if (selectedLearning.includes(langCode)) {
      setSelectedLearning(selectedLearning.filter(l => l !== langCode));
    } else {
      setSelectedLearning([...selectedLearning, langCode]);
    }
  };

  const handleContinue = async () => {
    if (selectedLearning.length === 0) {
      Alert.alert('Select Languages', 'Please select at least one language to learn.');
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

      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to save language preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to ContextLearn!</Text>
          <Text style={styles.subtitle}>Let's set up your languages</Text>
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
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>I want to learn:</Text>
          <Text style={styles.hint}>Select all languages you're interested in</Text>
          <View style={styles.languageGrid}>
            {AVAILABLE_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  selectedLearning.includes(lang.code) && styles.languageOptionSelected
                ]}
                onPress={() => toggleLanguage(lang.code)}
                disabled={lang.code === selectedNative}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageName,
                  selectedLearning.includes(lang.code) && styles.languageNameSelected,
                  lang.code === selectedNative && styles.languageNameDisabled
                ]}>
                  {lang.name}
                </Text>
                {selectedLearning.includes(lang.code) && (
                  <Icon 
                    name="check-circle" 
                    size={20} 
                    color={Colors.primary} 
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            disabled={selectedLearning.length === 0}
          />
          <Text style={styles.footerText}>
            You can add or change languages anytime in settings
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