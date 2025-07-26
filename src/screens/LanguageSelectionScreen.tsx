import React, { useState } from 'react';
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
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const APP_LANGUAGES = [
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'french', name: 'Français', flag: '🇫🇷' },
  { code: 'german', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'italian', name: 'Italiano', flag: '🇮🇹' },
];

export const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { nativeLanguage, setNativeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(nativeLanguage);

  const handleSave = () => {
    setNativeLanguage(selectedLanguage);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>App Language</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.description}>
            Choose the language for the app interface. This doesn't affect your learning languages.
          </Text>
          
          {APP_LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                selectedLanguage === lang.code && styles.languageOptionSelected
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={styles.languageName}>{lang.name}</Text>
              {selectedLanguage === lang.code && (
                <Icon name="check" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
    lineHeight: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  languageOptionSelected: {
    backgroundColor: Colors.surface,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
});