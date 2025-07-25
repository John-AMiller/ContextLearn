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
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavigationProp, LessonScreenRouteProp } from '@/types/navigation';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PhraseCard } from '@/components/lesson/PhraseCard';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { getLanguageFlag } from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LessonScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<LessonScreenRouteProp>();
  const { lesson } = route.params;
  const { addCompletedScenario } = useProgress();
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showTranslations, setShowTranslations] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const currentPhrase = lesson.phrases[currentPhraseIndex];

  const handleDownload = async () => {
    try {
      await AsyncStorage.setItem(`lesson_${lesson.id}`, JSON.stringify(lesson));
      setIsDownloaded(true);
      Alert.alert('Success', 'Lesson downloaded for offline use!');
    } catch (error) {
      Alert.alert('Error', 'Failed to download lesson');
    }
  };

  const handleStartPractice = () => {
    navigation.navigate('Practice', { lesson });
  };

  const nextPhrase = () => {
    if (currentPhraseIndex < lesson.phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    }
  };

  const previousPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>{lesson.title}</Text>
          <TouchableOpacity onPress={handleDownload}>
            <Icon 
              name={isDownloaded ? "download-check" : "download"} 
              size={24} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.languageIndicator}>
          <Text style={styles.languageText}>
            {getLanguageFlag(lesson.language)} {lesson.language}
          </Text>
          <Text style={styles.difficultyText}>
            Difficulty: {'⭐'.repeat(lesson.difficulty)}
          </Text>
        </View>

        {lesson.culturalNotes && (
          <Card style={styles.culturalCard}>
            <View style={styles.culturalHeader}>
              <Icon name="earth" size={20} color={Colors.warning} />
              <Text style={styles.culturalTitle}>Cultural Note</Text>
            </View>
            <Text style={styles.culturalText}>{lesson.culturalNotes}</Text>
          </Card>
        )}

        <Card>
          <View style={styles.phraseHeader}>
            <Text style={styles.sectionTitle}>
              Quick Reference - Perfect for waiting in line!
            </Text>
            <TouchableOpacity 
              onPress={() => setShowTranslations(!showTranslations)}
              style={styles.toggleButton}
            >
              <Icon 
                name={showTranslations ? "eye-off" : "eye"} 
                size={20} 
                color={Colors.primary} 
              />
              <Text style={styles.toggleText}>
                {showTranslations ? 'Hide' : 'Show'} translations
              </Text>
            </TouchableOpacity>
          </View>

          <PhraseCard
            phrase={currentPhrase}
            showTranslation={showTranslations}
            onAudioPress={() => console.log('Play audio')}
          />

          <View style={styles.navigation}>
            <TouchableOpacity 
              onPress={previousPhrase}
              disabled={currentPhraseIndex === 0}
              style={[styles.navButton, currentPhraseIndex === 0 && styles.navButtonDisabled]}
            >
              <Icon name="chevron-left" size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <View style={styles.dots}>
              {lesson.phrases.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentPhraseIndex && styles.dotActive
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity 
              onPress={nextPhrase}
              disabled={currentPhraseIndex === lesson.phrases.length - 1}
              style={[styles.navButton, currentPhraseIndex === lesson.phrases.length - 1 && styles.navButtonDisabled]}
            >
              <Icon name="chevron-right" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </Card>

        {lesson.variations && (
          <Card>
            <Text style={styles.sectionTitle}>Variations</Text>
            
            {lesson.variations.formal && lesson.variations.formal.length > 0 && (
              <View style={styles.variationSection}>
                <Text style={styles.variationType}>Formal:</Text>
                {lesson.variations.formal.map((phrase, index) => (
                  <Text key={index} style={styles.variationText}>{phrase}</Text>
                ))}
              </View>
            )}

            {lesson.variations.informal && lesson.variations.informal.length > 0 && (
              <View style={styles.variationSection}>
                <Text style={styles.variationType}>Informal:</Text>
                {lesson.variations.informal.map((phrase, index) => (
                  <Text key={index} style={styles.variationText}>{phrase}</Text>
                ))}
              </View>
            )}
          </Card>
        )}

        {lesson.variations.regional && Object.keys(lesson.variations.regional).length > 0 && (
          <Card style={styles.regionalCard}>
            <Text style={styles.sectionTitle}>Regional Differences</Text>
            <View style={styles.regionalContainer}>
              {Object.entries(lesson.variations.regional).map(([key, variation]) => (
                <View key={key} style={styles.regionalItem}>
                  <Text style={styles.regionalName}>{variation.region}:</Text>
                  {variation.phrases.map((phrase, index) => (
                    <Text key={index} style={styles.regionalPhrase}>{phrase}</Text>
                  ))}
                  {variation.notes && (
                    <Text style={styles.regionalNote}>{variation.notes}</Text>
                  )}
                </View>
              ))}
            </View>
          </Card>
        )}

        <View style={styles.footer}>
          <Button
            title="Start Practice"
            onPress={handleStartPractice}
            icon={<Icon name="play" size={20} color={Colors.background} />}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginHorizontal: Layout.spacing.md,
  },
  languageIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  languageText: {
    fontSize: 16,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  difficultyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  culturalCard: {
    backgroundColor: '#FEF3C7',
    marginBottom: Layout.spacing.md,
  },
  culturalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  culturalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: Layout.spacing.sm,
  },
  culturalText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.primary,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.lg,
  },
  navButton: {
    padding: Layout.spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  dots: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  variationSection: {
    marginBottom: Layout.spacing.md,
  },
  variationType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  variationText: {
    fontSize: 15,
    color: Colors.text,
    fontStyle: 'italic',
    marginBottom: Layout.spacing.xs,
  },
  regionalCard: {
    marginBottom: Layout.spacing.xl,
  },
  regionalContainer: {
    gap: Layout.spacing.md,
  },
  regionalItem: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
  },
  regionalName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  regionalPhrase: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  regionalNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Layout.spacing.xs,
  },
  footer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
});