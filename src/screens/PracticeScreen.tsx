// src/screens/PracticeScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavigationProp, PracticeScreenRouteProp } from '@/types/navigation';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/lesson/ProgressBar';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { formatRelativeTime } from '@/utils/lessonHelpers';

type Phase = 'teaching' | 'testing';
type TeachingMode = 'flashcard' | 'individual';

interface AttemptState {
  count: number;
  maxAttempts: number;
  showHint: boolean;
}

export const PracticeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<PracticeScreenRouteProp>();
  const { lesson } = route.params;
  const { addCompletedScenario, updateProgress } = useProgress();

  // Main state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('teaching');
  const [teachingMode] = useState<TeachingMode>(() => 
    Math.random() > 0.5 ? 'flashcard' : 'individual'
  );
  
  // Teaching phase state
  const [showTranslation, setShowTranslation] = useState(false); // Start with English (false = English, true = Spanish)
  const [hasSeenAllCards, setHasSeenAllCards] = useState(false);
  const [hasFlippedCard, setHasFlippedCard] = useState(false);
  
  // Testing phase state
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState<AttemptState>({
    count: 0,
    maxAttempts: 3,
    showHint: false
  });
  const [hasUsedHintButton, setHasUsedHintButton] = useState(false);
  
  // Overall progress
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

  const currentPhrase = lesson.phrases[currentIndex];
  const progress = phase === 'teaching' 
    ? ((currentIndex + (showTranslation ? 0.5 : 0)) / lesson.phrases.length) * 50 // Teaching is 50% of progress
    : 50 + ((completedWords.size / lesson.phrases.length) * 50); // Testing is the other 50%

  // Animation values
  const [flipAnimation] = useState(new Animated.Value(0));
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (teachingMode === 'individual' && phase === 'teaching') {
      // For individual mode, automatically show translation after 2 seconds
      const timer = setTimeout(() => {
        setShowTranslation(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, teachingMode, phase]);

  // Teaching Phase Methods
  const flipCard = () => {
    if (teachingMode === 'flashcard') {
      Animated.timing(flipAnimation, {
        toValue: showTranslation ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setShowTranslation(!showTranslation);
      setHasFlippedCard(true); // Card has been flipped at least once
    }
  };

  const nextTeachingCard = () => {
    if (currentIndex < lesson.phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
      setHasFlippedCard(false); // Reset flip state for new card
      flipAnimation.setValue(0);
    } else {
      if (teachingMode === 'flashcard' && !hasSeenAllCards) {
        // For flashcard mode, offer to review all cards again
        setHasSeenAllCards(true);
        setCurrentIndex(0);
        setShowTranslation(false);
        setHasFlippedCard(false);
        flipAnimation.setValue(0);
      } else {
        // Move to testing phase
        setPhase('testing');
        setCurrentIndex(0);
        setShowTranslation(false);
      }
    }
  };

  const skipToTesting = () => {
    setPhase('testing');
    setCurrentIndex(0);
    setShowTranslation(false);
  };

  // Testing Phase Methods
  const checkAnswer = () => {
    setTotalAttempts(totalAttempts + 1);
    
    const correctAnswer = currentPhrase.phrase.toLowerCase().trim();
    const userAnswerClean = userAnswer.toLowerCase().trim();
    
    // Remove punctuation for comparison
    const cleanCorrect = correctAnswer.replace(/[.,!?¿¡]/g, '');
    const cleanUser = userAnswerClean.replace(/[.,!?¿¡]/g, '');
    
    const correct = cleanCorrect === cleanUser || correctAnswer === userAnswerClean;
    
    if (correct) {
      setIsCorrect(true);
      setShowFeedback(true);
      setScore(score + 1);
      setCompletedWords(prev => new Set([...prev, currentIndex]));
    } else {
      // Handle wrong answer based on attempt count
      const newAttemptCount = attempts.count + 1;
      
      if (newAttemptCount >= attempts.maxAttempts) {
        // Show correct answer after max attempts
        setIsCorrect(false);
        setShowFeedback(true);
        setCompletedWords(prev => new Set([...prev, currentIndex]));
      } else {
        // Give another attempt
        setAttempts({
          ...attempts,
          count: newAttemptCount,
          showHint: newAttemptCount === 2 // Show hint on third attempt
        });
        
        // Shake animation for wrong answer
        Animated.sequence([
          Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();
        
        setUserAnswer('');
      }
    }
  };

  const nextTestingPhrase = () => {
    if (currentIndex < lesson.phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetTestingState();
    } else {
      completeLesson();
    }
  };

  const resetTestingState = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    setAttempts({
      count: 0,
      maxAttempts: 3,
      showHint: false
    });
    setHasUsedHintButton(false); // Reset hint button usage
  };

  const completeLesson = () => {
    const masteryLevel = Math.round((score / lesson.phrases.length) * 100);
    
    addCompletedScenario({
      id: lesson.id,
      title: lesson.title,
      mastery: masteryLevel,
      lastPracticed: formatRelativeTime(new Date())
    });

    updateProgress({
      lessonId: lesson.id,
      userId: 'current-user',
      masteryLevel,
      lastPracticed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
      attemptCount: totalAttempts,
      correctCount: score
    });

    navigation.navigate('Main');
  };

  const playAudio = () => {
    Speech.speak(currentPhrase.phrase, {
      language: lesson.language === 'spanish' ? 'es' : 
                lesson.language === 'italian' ? 'it' : 'en',
      rate: 0.8,
    });
  };

  const getHint = (forTextBox: boolean = false) => {
    const words = currentPhrase.phrase.split(' ');
    let lettersToShow = 2; // Default: show first 2 letters
    
    // Progressive hints: if user already used hint button, show more letters for auto-hint
    if (hasUsedHintButton && !forTextBox) {
      lettersToShow = 3; // Show 3 letters if they already used hint button
    }
    
    const hintWords = words.map(word => {
      const visiblePart = word.substring(0, lettersToShow);
      return forTextBox ? visiblePart : visiblePart + '...';
    });
    
    return hintWords.join(' ');
  };

  const handleHintButtonPress = () => {
    setHasUsedHintButton(true);
    setUserAnswer(getHint(true)); // Remove ellipsis for text box
  };

  const getAttemptFeedback = () => {
    if (attempts.count === 1) {
      return "Not quite right. Try again!";
    } else if (attempts.count === 2) {
      return "One more try! Here's a hint:";
    }
    return "";
  };

  // Render Teaching Phase
  const renderTeachingPhase = () => {
    if (teachingMode === 'flashcard') {
      return (
        <Card style={styles.teachingCard}>
          <Text style={styles.teachingTitle}>{lesson.title}</Text>
          <Text style={styles.phaseIndicator}>
            Card {currentIndex + 1} of {lesson.phrases.length}
          </Text>
          
          <TouchableOpacity onPress={flipCard} style={styles.flashcard}>
            <Animated.View style={[
              styles.flashcardInner,
              {
                transform: [{
                  rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }
            ]}>
              {!showTranslation ? (
                <View style={styles.flashcardFront}>
                  <Text style={styles.flashcardText}>{currentPhrase.translation}</Text>
                  <Text style={styles.flashcardLanguageLabel}>English</Text>
                </View>
              ) : (
                <Animated.View style={[
                  styles.flashcardBack,
                  {
                    transform: [{
                      rotateY: flipAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'] // Counter-rotate to fix mirroring
                      })
                    }]
                  }
                ]}>
                  <Text style={styles.flashcardTranslation}>{currentPhrase.phrase}</Text>
                  <Text style={styles.flashcardLanguageLabel}>{lesson.language.charAt(0).toUpperCase() + lesson.language.slice(1)}</Text>
                  <TouchableOpacity onPress={playAudio} style={styles.audioButton}>
                    <Icon name="volume-high" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                  {currentPhrase.literal && (
                    <Text style={styles.flashcardLiteral}>"{currentPhrase.literal}"</Text>
                  )}
                </Animated.View>
              )}
            </Animated.View>
          </TouchableOpacity>
          
          <Text style={styles.flashcardInstruction}>
            Tap the card to {showTranslation ? 'see the English' : `see the ${lesson.language.charAt(0).toUpperCase() + lesson.language.slice(1)}`}
          </Text>
          
          <View style={styles.teachingButtons}>
            <Button
              title="Next Word"
              onPress={nextTeachingCard}
              disabled={!hasFlippedCard} // Enable once card has been flipped
              style={[styles.teachingButton, !hasFlippedCard && styles.disabledButton]}
            />
            {hasSeenAllCards && (
              <Button
                title="Start Practice"
                onPress={skipToTesting}
                style={[styles.teachingButton, styles.primaryButton]}
              />
            )}
          </View>
        </Card>
      );
    } else {
      // Individual teaching mode
      return (
        <Card style={styles.teachingCard}>
          <Text style={styles.teachingTitle}>{lesson.title}</Text>
          <Text style={styles.phaseIndicator}>
            Word {currentIndex + 1} of {lesson.phrases.length}
          </Text>
          
          <View style={styles.individualCard}>
            <Text style={styles.newWordLabel}>New Word:</Text>
            <Text style={styles.individualWord}>{currentPhrase.phrase}</Text>
            
            <TouchableOpacity onPress={playAudio} style={styles.audioButton}>
              <Icon name="volume-high" size={24} color={Colors.primary} />
            </TouchableOpacity>
            
            {showTranslation && (
              <View style={styles.translationReveal}>
                <Text style={styles.individualTranslation}>
                  English: {currentPhrase.translation}
                </Text>
                {currentPhrase.literal && (
                  <Text style={styles.individualLiteral}>
                    Example: "{currentPhrase.literal}"
                  </Text>
                )}
              </View>
            )}
          </View>
          
          <View style={styles.teachingButtons}>
            <Button
              title="Continue"
              onPress={nextTeachingCard}
              disabled={!showTranslation}
              style={[styles.teachingButton, !showTranslation && styles.disabledButton]}
            />
          </View>
        </Card>
      );
    }
  };

  // Render Testing Phase
  const renderTestingPhase = () => {
    return (
      <Card style={styles.mainCard}>
        <Text style={styles.instruction}>How do you say:</Text>
        
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>
            {currentPhrase.translation}
          </Text>
        </View>

        <Animated.View style={[
          styles.answerSection,
          { transform: [{ translateX: shakeAnimation }] }
        ]}>
          <Text style={styles.answerLabel}>
            Your answer in {lesson.language}:
          </Text>
          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Type your answer..."
            placeholderTextColor={Colors.textSecondary}
            editable={!showFeedback}
            onSubmitEditing={checkAnswer}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Animated.View>

        {/* Show feedback for wrong answers before final attempt */}
        {attempts.count > 0 && !showFeedback && (
          <View style={styles.attemptFeedback}>
            <Text style={styles.attemptFeedbackText}>
              {getAttemptFeedback()}
            </Text>
            {attempts.showHint && (
              <Text style={styles.autoHintText}>{getHint()}</Text>
            )}
          </View>
        )}

        {/* Hint for first attempt if answer is empty */}
        {!showFeedback && userAnswer.length === 0 && attempts.count === 0 && (
          <TouchableOpacity onPress={handleHintButtonPress}>
            <Text style={styles.hintLink}>
              <Icon name="lightbulb-outline" size={16} /> Need a hint?
            </Text>
          </TouchableOpacity>
        )}

        {showFeedback && (
          <Card style={[styles.feedbackCard, isCorrect ? styles.correctCard : styles.incorrectCard]}>
            <View style={styles.feedbackHeader}>
              <Icon 
                name={isCorrect ? "check-circle" : "close-circle"} 
                size={24} 
                color={isCorrect ? Colors.success : Colors.danger} 
              />
              <Text style={[styles.feedbackTitle, isCorrect ? styles.correctText : styles.incorrectText]}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </Text>
            </View>
            
            {!isCorrect && (
              <View style={styles.correctAnswerSection}>
                <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
                <Text style={styles.correctAnswerText}>{currentPhrase.phrase}</Text>
                <TouchableOpacity onPress={playAudio} style={styles.audioButtonSmall}>
                  <Icon name="volume-high" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Grammar tip appears only in feedback */}
            {(isCorrect || !isCorrect) && currentPhrase.grammarNote && (
              <View style={styles.grammarTip}>
                <Text style={styles.grammarTipLabel}>Grammar Tip:</Text>
                <Text style={styles.grammarTipText}>{currentPhrase.grammarNote}</Text>
              </View>
            )}
            
            {/* Show literal translation in feedback */}
            {currentPhrase.literal && (
              <Text style={styles.literalInFeedback}>
                Example: "{currentPhrase.literal}"
              </Text>
            )}
          </Card>
        )}

        <View style={styles.buttonContainer}>
          {!showFeedback ? (
            <Button
              title="Check Answer"
              onPress={checkAnswer}
              disabled={userAnswer.trim().length === 0}
              style={styles.checkButton}
            />
          ) : (
            <Button
              title={currentIndex < lesson.phrases.length - 1 ? "Next Word" : "Complete Lesson"}
              onPress={nextTestingPhrase}
              style={styles.nextButton}
            />
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.counter}>
              {phase === 'teaching' ? 'Learning' : 'Practice'} {' • '}
              {currentIndex + 1} / {lesson.phrases.length}
            </Text>
          </View>

          <ProgressBar progress={progress} />

          {phase === 'teaching' ? renderTeachingPhase() : renderTestingPhase()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Layout.spacing.md,
    paddingBottom: Layout.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  counter: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  // Teaching Phase Styles
  teachingCard: {
    marginTop: Layout.spacing.md,
    padding: Layout.spacing.lg,
  },
  teachingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  phaseIndicator: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  flashcard: {
    height: 200,
    marginVertical: Layout.spacing.lg,
  },
  flashcardInner: {
    flex: 1,
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  flashcardFront: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  flashcardBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    backgroundColor: Colors.primary + '10',
  },
  flashcardText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  flashcardTranslation: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  flashcardLanguageLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  flashcardLiteral: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  flashcardInstruction: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  individualCard: {
    alignItems: 'center',
    padding: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.lg,
    marginVertical: Layout.spacing.lg,
  },
  newWordLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
  },
  individualWord: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  translationReveal: {
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
    padding: Layout.spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: Layout.borderRadius.md,
    width: '100%',
  },
  individualTranslation: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  individualLiteral: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  teachingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  teachingButton: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.border,
  },
  audioButton: {
    padding: Layout.spacing.sm,
  },
  audioButtonSmall: {
    padding: Layout.spacing.xs,
    marginLeft: Layout.spacing.sm,
  },
  // Testing Phase Styles
  mainCard: {
    marginTop: Layout.spacing.md,
  },
  instruction: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  questionBox: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  answerSection: {
    marginBottom: Layout.spacing.lg,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  attemptFeedback: {
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  attemptFeedbackText: {
    fontSize: 14,
    color: Colors.warning,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  autoHintText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  hintLink: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  feedbackCard: {
    marginBottom: Layout.spacing.lg,
  },
  correctCard: {
    backgroundColor: Colors.success + '20',
    borderColor: Colors.success,
    borderWidth: 1,
  },
  incorrectCard: {
    backgroundColor: Colors.danger + '20',
    borderColor: Colors.danger,
    borderWidth: 1,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Layout.spacing.sm,
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.danger,
  },
  correctAnswerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    flexWrap: 'wrap',
  },
  correctAnswerLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: Layout.spacing.sm,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  grammarTip: {
    backgroundColor: Colors.primary + '10',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  grammarTipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  grammarTipText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  literalInFeedback: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: Layout.spacing.md,
  },
  checkButton: {
    backgroundColor: Colors.primary,
  },
  nextButton: {
    backgroundColor: Colors.success,
  },
});