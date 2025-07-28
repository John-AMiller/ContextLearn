// src/screens/HomeScreen.tsx - Scholarly Academy Style (COMPLETE REPLACEMENT)

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
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
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { getGreeting, getLanguageFlag } from '@/utils/helpers';
import { findScenarioMatch, getConfirmationMessage } from '@/services/scenarioMatching.service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { completedScenarios, streak } = useProgress();
  
  const [inputText, setInputText] = useState('');

  // Scholar's learning tomes - using mystical language
  const ancientTomes = [
    { 
      icon: '📚', 
      title: 'Ancient Tomes', 
      description: 'Study structured language paths',
      badge: 'Scholar',
      onPress: () => navigation.navigate('LinearLessons')
    },
    { 
      icon: '🗣️', 
      title: 'Discourse Practice', 
      description: 'Learn common scenarios',
      badge: 'Practical',
      onPress: () => navigation.navigate('Categories')
    },
    { 
      icon: '🖼️', 
      title: 'Illuminated Texts', 
      description: 'Upload photos to learn',
      badge: 'Visual',
      onPress: () => navigation.navigate('PhotoUpload')
    }
  ];

  const handleBeginQuest = () => {
    if (!inputText.trim()) return;

    // Check if input matches any existing scenarios
    const scenarioMatch = findScenarioMatch(inputText.trim());
    
    if (scenarioMatch.isMatch && scenarioMatch.matchedScenario) {
      // Show confirmation dialog for matched scenario
      const confirmationMessage = getConfirmationMessage(scenarioMatch.matchedScenario);
      
      Alert.alert(
        'Ancient Knowledge Found!',
        confirmationMessage,
        [
          { text: 'Seek Different Wisdom', style: 'cancel' },
          { 
            text: 'Begin This Quest', 
            onPress: () => navigation.navigate('LessonCustomization', { inputText: scenarioMatch.matchedScenario! })
          }
        ]
      );
    } else {
      // Navigate to lesson customization
      navigation.navigate('LessonCustomization', { inputText: inputText.trim() });
    }
  };

  // Calculate scholar's wisdom stats
  const getWisdomPoints = () => {
    return completedScenarios.reduce((total, scenario) => total + scenario.mastery, 0);
  };

  const getQuestCount = () => {
    return completedScenarios.length;
  };

  const getScholarRank = () => {
    const wisdom = getWisdomPoints();
    if (wisdom < 100) return 'Novice';
    if (wisdom < 500) return 'Student';
    if (wisdom < 1000) return 'Scholar';
    if (wisdom < 2000) return 'Sage';
    return 'Master';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Scholarly Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={Colors.gradients.primary as [string, string, ...string[]]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.headerGradient}
          >
            {/* Mystical pattern overlay */}
            <View style={styles.headerOverlay} />
            
            <View style={styles.headerContent}>
              <View style={styles.languageSwitcherContainer}>
                <LanguageSwitcher />
              </View>
              
              <View style={styles.scholarBadge}>
                <Text style={styles.badgeText}>Scholar of Languages</Text>
              </View>
              
              <Text style={styles.greeting}>Welcome, Learned One</Text>
              <Text style={styles.subtitle}>Your linguistic journey continues in {currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)} {getLanguageFlag(currentLanguage)}</Text>
              
              <View style={styles.progressOrbs}>
                <View style={styles.orb}>
                  <Text style={styles.orbValue}>{getWisdomPoints()}</Text>
                  <Text style={styles.orbLabel}>Wisdom</Text>
                </View>
                <View style={styles.orb}>
                  <Text style={styles.orbValue}>{getQuestCount()}</Text>
                  <Text style={styles.orbLabel}>Quest</Text>
                </View>
                <View style={styles.orb}>
                  <Text style={styles.orbValue}>{getScholarRank()}</Text>
                  <Text style={styles.orbLabel}>Rank</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          
          {/* Scribe Your Learning Quest */}
          <Card mystical style={styles.scrollArea}>
            <View style={styles.scrollAreaOverlay} />
            <View style={styles.scrollContent}>
              <View style={styles.scrollLabelContainer}>
                <Text style={styles.scrollLabel}>📜 What do you wish to learn?</Text>
              </View>
              
              <TextInput
                style={styles.ancientInput}
                placeholder="The scribes await your request..."
                placeholderTextColor="rgba(226, 232, 240, 0.5)"
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={3}
              />
              
              <TouchableOpacity 
                style={styles.beginBtn}
                onPress={handleBeginQuest}
                disabled={!inputText.trim()}
              >
                <Text style={styles.beginBtnText}>✦</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Ancient Tomes Grid */}
          <View style={styles.tomesGrid}>
            {ancientTomes.map((tome, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tome}
                onPress={tome.onPress}
                activeOpacity={0.8}
              >
                <Card gradient interactive style={styles.tomeCard}>
                  <View style={styles.tomeShimmer} />
                  <View style={styles.tomeContent}>
                    <View style={styles.tomeIcon}>
                      <Text style={styles.tomeEmoji}>{tome.icon}</Text>
                    </View>
                    <View style={styles.tomeText}>
                      <Text style={styles.tomeTitle}>{tome.title}</Text>
                      <Text style={styles.tomeDescription}>{tome.description}</Text>
                    </View>
                    <View style={styles.masteryBadge}>
                      <Text style={styles.masteryText}>{tome.badge}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Scholar's Review Section */}
          {completedScenarios.length > 0 && (
            <Card style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>📖 Chronicles of Learning</Text>
              <Text style={styles.reviewSubtitle}>Review your completed quests</Text>
              
              {completedScenarios.slice(0, 2).map((scenario, index) => (
                <View key={scenario.id} style={styles.reviewItem}>
                  <View style={styles.reviewIcon}>
                    <Icon name="scroll-text" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewItemTitle}>{scenario.title}</Text>
                    <Text style={styles.reviewMastery}>
                      {scenario.mastery}% mastery • {scenario.lastPracticed}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.reviewButton}>
                    <Text style={styles.reviewButtonText}>Study</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.3,
    // Mystical pattern would be added here
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  languageSwitcherContainer: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  scholarBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'normal',
    color: Colors.text,
    marginBottom: 4,
    fontFamily: 'System', // Cinzel-like
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    opacity: 0.9,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  progressOrbs: {
    flexDirection: 'row',
    gap: 8,
  },
  orb: {
    backgroundColor: Colors.glass,
    borderWidth: 2,
    borderColor: 'rgba(214, 158, 46, 0.3)',
    borderRadius: 19,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  orbValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  orbLabel: {
    fontSize: 7,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  contentArea: {
    flex: 1,
    padding: 20,
  },
  scrollArea: {
    marginBottom: 14,
    position: 'relative',
  },
  scrollAreaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'transparent',
    opacity: 0.3,
    // Mystical gradient pattern
  },
  scrollContent: {
    position: 'relative',
    zIndex: 1,
  },
  scrollLabelContainer: {
    marginBottom: 8,
  },
  scrollLabel: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: 'System', // Cinzel-like
  },
  ancientInput: {
    width: '100%',
    backgroundColor: Colors.inputBackground,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    minHeight: 50,
    color: Colors.text,
    fontFamily: 'System', // Georgia-like
    textAlignVertical: 'top',
  },
  beginBtn: {
    backgroundColor: Colors.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  beginBtnText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tomesGrid: {
    gap: 8,
    marginBottom: 20,
  },
  tome: {
    // Wrapper for each tome
  },
  tomeCard: {
    // Card styling handled by Card component
  },
  tomeShimmer: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    backgroundColor: 'transparent',
    // Shimmer effect would be added here
  },
  tomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  tomeIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(214, 158, 46, 0.3)',
  },
  tomeEmoji: {
    fontSize: 16,
  },
  tomeText: {
    flex: 1,
  },
  tomeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
    fontFamily: 'System', // Cinzel-like
  },
  tomeDescription: {
    fontSize: 10,
    color: Colors.textTertiary,
    lineHeight: 12,
  },
  masteryBadge: {
    backgroundColor: 'rgba(214, 158, 46, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(214, 158, 46, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  masteryText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  reviewCard: {
    marginTop: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    fontFamily: 'System', // Cinzel-like
  },
  reviewSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewIcon: {
    width: 32,
    alignItems: 'center',
  },
  reviewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewMastery: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  reviewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reviewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});