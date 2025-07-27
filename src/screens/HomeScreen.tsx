// src/screens/HomeScreen.tsx - Updated for Style 2B Card Game Adventure
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  StatusBar
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
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { completedScenarios, streak, totalXP } = useProgress();
  
  const [inputText, setInputText] = useState('');

  // Mock data for gaming elements
  const gems = Math.floor(totalXP / 10) + 247; // Convert XP to gems
  const energy = 85; // Mock energy percentage

  const gameCards = [
    { 
      icon: '🏰', 
      title: 'Castle Academy', 
      description: 'Structured learning path',
      reward: '+50 XP',
      colors: ['#ed64a6', '#f687b3'],
      onPress: () => navigation.navigate('LinearLessons')
    },
    { 
      icon: '⚔️', 
      title: 'Battle Arena', 
      description: 'Quick conversation duels',
      reward: '+25 XP',
      colors: ['#38b2ac', '#4fd1c7'],
      onPress: () => navigation.navigate('Categories')
    },
    { 
      icon: '🗺️', 
      title: 'Explorer Mode', 
      description: 'Discover through images',
      reward: '+35 XP',
      colors: ['#ed8936', '#fbb033'],
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
              navigation.navigate('Categories');
            }
          },
          {
            text: 'No',
            onPress: () => {
              navigation.navigate('LessonCustomization', { inputText });
            }
          }
        ]
      );
    } else {
      navigation.navigate('LessonCustomization', { inputText });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header with Gaming UI */}
      <LinearGradient
        colors={['#38b2ac', '#319795']}
        style={styles.header}
      >
        <View style={styles.gemsCounter}>
          <Text style={styles.gemsText}>💎 {gems.toLocaleString()}</Text>
        </View>
        
        <Text style={styles.greeting}>Adventure Awaits! ⚔️</Text>
        <Text style={styles.subtitle}>Choose your learning quest</Text>
        
        {/* Energy Bar */}
        <View style={styles.energyContainer}>
          <View style={styles.energyBar}>
            <LinearGradient
              colors={['#68d391', '#48bb78']}
              style={[styles.energyFill, { width: `${energy}%` }]}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {/* Custom Quest Creation */}
        <View style={styles.deckArea}>
          <Text style={styles.deckLabel}>🎴 Create Custom Quest</Text>
          <Input
            value={inputText}
            onChangeText={setInputText}
            placeholder="Describe your learning adventure..."
            multiline
            style={styles.questInput}
            maxLength={300}
          />
          
          {inputText.trim().length > 0 && (
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handleContinueToCustomization}
            >
              <Text style={styles.playButtonText}>▶️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Game Cards */}
        <ScrollView 
          style={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {gameCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gameCard}
              onPress={card.onPress}
            >
              <LinearGradient
                colors={card.colors as [string, string, ...string[]]}
                style={styles.gameCardGradient}
              >
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>{card.icon}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>
                </View>
                <View style={styles.cardReward}>
                  <Text style={styles.cardRewardText}>{card.reward}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  gemsCounter: {
    position: 'absolute',
    top: Layout.spacing.lg,
    right: Layout.spacing.lg,
    backgroundColor: Colors.accent,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.lg,
  },
  gemsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#744210',
  },
  greeting: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text,
    opacity: 0.9,
    marginBottom: Layout.spacing.sm,
  },
  energyContainer: {
    marginTop: Layout.spacing.sm,
  },
  energyBar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Layout.borderRadius.sm,
    height: 6,
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.sm,
  },
  contentArea: {
    flex: 1,
    padding: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
  },
  deckArea: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
    marginBottom: Layout.spacing.lg,
  },
  deckLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
    fontWeight: 'bold',
  },
  questInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    color: Colors.text,
    minHeight: 60,
  },
  playButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: Layout.spacing.sm,
  },
  playButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  cardsContainer: {
    flex: 1,
  },
  gameCard: {
    marginBottom: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  gameCardGradient: {
    padding: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Layout.borderRadius.lg,
  },
  cardIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardIconText: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 11,
    color: Colors.text,
    opacity: 0.9,
  },
  cardReward: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardRewardText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.text,
  },
});