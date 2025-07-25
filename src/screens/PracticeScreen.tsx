import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
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

export const PracticeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<PracticeScreenRouteProp>();
  const { lesson } = route.params;
  const { addCompletedScenario, updateProgress } = useProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const currentPhrase = lesson.phrases[currentIndex];
  const progress = ((currentIndex + (showFeedback ? 1 : 0)) / lesson.phrases.length) * 100;

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  const checkAnswer = () => {
    setAttempts(attempts + 1);
    
    const correctAnswer = currentPhrase.phrase.toLowerCase().trim();
    const userAnswerClean = userAnswer.toLowerCase().trim();
    
    // Remove punctuation for comparison
    const cleanCorrect = correctAnswer.replace(/[.,!?¿¡]/g, '');
    const cleanUser = userAnswerClean.replace(/[.,!?¿¡]/g, '');
    
    const correct = cleanCorrect === cleanUser || correctAnswer === userAnswerClean;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const playAudio = () => {
    Speech.speak(currentPhrase.phrase, {
      language: lesson.language === 'spanish' ? 'es' : 
                lesson.language === 'italian' ? 'it' : 'en',
      rate: 0.8,
    });
  };

  const nextPhrase = () => {
    if (currentIndex < lesson.phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      completeLesson();
    }
  };

  const completeLesson = () => {
    const masteryLevel = Math.round((score / lesson.phrases.length) * 100);
    
    // Add to completed scenarios
    addCompletedScenario({
      id: lesson.id,
      title: lesson.title,
      mastery: masteryLevel,
      lastPracticed: 'just now'
    });

    // Update progress
    updateProgress({
      lessonId: lesson.id,
      userId: 'current-user', // This would come from auth context
      masteryLevel,
      lastPracticed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
      attemptCount: attempts,
      correctCount: score
    });

    // Navigate back to home
    navigation.navigate('Main');
  };

  const getHint = () => {
    // Show first few letters of each word
    return currentPhrase.phrase
      .split(' ')
      .map(word => word.substring(0, 2) + '...')
      .join(' ');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.counter}>
                {currentIndex + 1} / {lesson.phrases.length}
            </Text>
            </View>

            <ProgressBar progress={progress} />

            <Card style={styles.mainCard}>
            <Text style={styles.instruction}>How do you say:</Text>
            
            <View style={styles.questionBox}>
                <Text style={styles.questionText}>
                {currentPhrase.translation}
                </Text>
                {currentPhrase.literal && (
                <Text style={styles.literalText}>
                    (Literally: {currentPhrase.literal})
                </Text>
                )}
            </View>

            <View style={styles.answerSection}>
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
            </View>

            {!showFeedback && userAnswer.length === 0 && (
                <TouchableOpacity onPress={() => setUserAnswer(getHint())}>
                <Text style={styles.hintText}>
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
                    <View>
                    <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
                    <Text style={styles.correctAnswer}>{currentPhrase.phrase}</Text>
                    </View>
                )}
                
                <TouchableOpacity onPress={playAudio} style={styles.audioButton}>
                    <Icon name="volume-high" size={20} color={Colors.primary} />
                    <Text style={styles.audioText}>Listen to pronunciation</Text>
                </TouchableOpacity>
                </Card>
            )}
            </Card>

            <View style={styles.footer}>
            {!showFeedback ? (
                <Button
                title="Check Answer"
                onPress={checkAnswer}
                disabled={!userAnswer.trim()}
                />
            ) : (
                <Button
                title={currentIndex < lesson.phrases.length - 1 ? "Next Phrase" : "Complete Lesson"}
                onPress={nextPhrase}
                variant="primary"
                />
            )}
            </View>

            <View style={styles.progressInfo}>
            <Text style={styles.scoreText}>
                Score: {score}/{lesson.phrases.length}
            </Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  counter: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  mainCard: {
    margin: Layout.spacing.lg,
    marginTop: Layout.spacing.sm,
  },
  instruction: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  questionBox: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  questionText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  literalText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
    fontStyle: 'italic',
  },
  answerSection: {
    marginBottom: Layout.spacing.md,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
    textTransform: 'capitalize',
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
  hintText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  feedbackCard: {
    marginTop: Layout.spacing.md,
  },
  correctCard: {
    backgroundColor: '#D1FAE5',
  },
  incorrectCard: {
    backgroundColor: '#FEE2E2',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.danger,
  },
  correctAnswerLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  correctAnswer: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    alignSelf: 'center',
  },
  audioText: {
    fontSize: 14,
    color: Colors.primary,
  },
  footer: {
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
  },
  progressInfo: {
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  scoreText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});