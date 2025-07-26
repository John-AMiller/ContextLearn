import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/types/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { LessonPath, LinearLesson, LessonProgress } from '@/types/linearLessons';
import { getCurriculumForLanguage } from '@/constants/linearLessons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export const LinearLessonsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});

  const curriculum = getCurriculumForLanguage(currentLanguage);
  
  useEffect(() => {
    loadUserProgress();
  }, [currentLanguage, user]);

  const loadUserProgress = async () => {
    // TODO: Load from Supabase
    // For now, simulate some progress
    const mockProgress: Record<string, LessonProgress> = {
      'nouns-1': {
        lessonId: 'nouns-1',
        userId: user?.id || '',
        isCompleted: true,
        isUnlocked: true,
        score: 85,
        timeSpent: 480,
        exerciseScores: {},
        lastAttempted: new Date(),
        attemptsCount: 2
      },
      'nouns-2': {
        lessonId: 'nouns-2',
        userId: user?.id || '',
        isCompleted: false,
        isUnlocked: true,
        score: 0,
        timeSpent: 0,
        exerciseScores: {},
        lastAttempted: new Date(),
        attemptsCount: 0
      }
    };
    setLessonProgress(mockProgress);
  };

  const handleLessonPress = (lesson: LinearLesson) => {
    const progress = lessonProgress[lesson.id];
    
    if (!progress?.isUnlocked && !isLessonUnlocked(lesson)) {
      return; // Don't allow access to locked lessons
    }

    // TODO: Navigate to LinearLessonScreen with lesson data
    console.log('Starting lesson:', lesson.title);
  };

  const isLessonUnlocked = (lesson: LinearLesson): boolean => {
    if (lesson.prerequisites.length === 0) return true;
    
    return lesson.prerequisites.every(prereqId => 
      lessonProgress[prereqId]?.isCompleted
    );
  };

  const getPathProgress = (path: LessonPath): number => {
    const completed = path.lessons.filter(lesson => 
      lessonProgress[lesson.id]?.isCompleted
    ).length;
    return path.lessons.length > 0 ? (completed / path.lessons.length) * 100 : 0;
  };

  const getTotalProgress = (): number => {
    const allLessons = curriculum.paths.flatMap(path => path.lessons);
    const completed = allLessons.filter(lesson => 
      lessonProgress[lesson.id]?.isCompleted
    ).length;
    return allLessons.length > 0 ? (completed / allLessons.length) * 100 : 0;
  };

  const renderLessonItem = (lesson: LinearLesson, index: number) => {
    const progress = lessonProgress[lesson.id];
    const isUnlocked = progress?.isUnlocked || isLessonUnlocked(lesson);
    const isCompleted = progress?.isCompleted || false;
    
    return (
      <TouchableOpacity
        key={lesson.id}
        style={[
          styles.lessonItem,
          !isUnlocked && styles.lessonItemLocked,
          isCompleted && styles.lessonItemCompleted
        ]}
        onPress={() => handleLessonPress(lesson)}
        disabled={!isUnlocked}
      >
        <View style={styles.lessonNumber}>
          {isCompleted ? (
            <Icon name="check" size={16} color={Colors.background} />
          ) : (
            <Text style={[
              styles.lessonNumberText,
              !isUnlocked && styles.lessonNumberTextLocked
            ]}>
              {index + 1}
            </Text>
          )}
        </View>
        
        <View style={styles.lessonContent}>
          <Text style={[
            styles.lessonTitle,
            !isUnlocked && styles.lessonTitleLocked
          ]}>
            {lesson.title}
          </Text>
          <Text style={[
            styles.lessonObjectives,
            !isUnlocked && styles.lessonObjectivesLocked
          ]}>
            {lesson.learningObjectives.slice(0, 2).join(' • ')}
          </Text>
          <View style={styles.lessonMeta}>
            <Text style={[
              styles.lessonTime,
              !isUnlocked && styles.lessonTimeLocked
            ]}>
              <Icon name="clock-outline" size={12} /> {lesson.estimatedTime}min
            </Text>
            <Text style={[
              styles.lessonVocab,
              !isUnlocked && styles.lessonVocabLocked
            ]}>
              <Icon name="book-outline" size={12} /> {lesson.vocabulary.length} words
            </Text>
          </View>
        </View>

        <View style={styles.lessonStatus}>
          {!isUnlocked ? (
            <Icon name="lock" size={20} color={Colors.textSecondary} />
          ) : isCompleted ? (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{progress?.score}%</Text>
            </View>
          ) : (
            <Icon name="play" size={20} color={Colors.primary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPathHeader = (path: LessonPath) => {
    const progress = getPathProgress(path);
    const completedLessons = path.lessons.filter(lesson => 
      lessonProgress[lesson.id]?.isCompleted
    ).length;
    
    return (
      <TouchableOpacity
        style={[styles.pathHeader, { borderLeftColor: path.color }]}
        onPress={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
      >
        <View style={styles.pathIcon}>
          <Icon name={path.icon} size={24} color={path.color} />
        </View>
        <View style={styles.pathInfo}>
          <Text style={styles.pathTitle}>{path.title}</Text>
          <Text style={styles.pathDescription}>{path.description}</Text>
          <View style={styles.pathProgress}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: path.color }]} />
            </View>
            <Text style={styles.pathProgressText}>
              {completedLessons}/{path.lessons.length} lessons
            </Text>
          </View>
        </View>
        <Icon 
          name={selectedPath === path.id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.textSecondary} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Lessons</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Overall Progress */}
        <Card style={styles.overallProgress}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(getTotalProgress())}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${getTotalProgress()}%`, backgroundColor: Colors.primary }]} />
          </View>
          <Text style={styles.progressSubtitle}>
            {curriculum.totalLessons} lessons • Est. {curriculum.estimatedDuration}
          </Text>
        </Card>

        {/* Learning Paths */}
        {curriculum.paths.map(path => (
          <Card key={path.id} style={styles.pathCard}>
            {renderPathHeader(path)}
            
            {selectedPath === path.id && (
              <View style={styles.lessonsList}>
                {path.lessons.map((lesson, index) => renderLessonItem(lesson, index))}
              </View>
            )}
          </Card>
        ))}

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Icon name="lightbulb-outline" size={20} color={Colors.primary} />
            <Text style={styles.tipsTitle}>Learning Tips</Text>
          </View>
          <Text style={styles.tipText}>
            • Complete lessons in order to unlock new content{'\n'}
            • Practice daily to maintain your streak{'\n'}
            • Review completed lessons to strengthen memory{'\n'}
            • Each lesson builds on previous knowledge
          </Text>
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
  overallProgress: {
    marginBottom: Layout.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pathCard: {
    marginBottom: Layout.spacing.md,
    padding: 0,
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderLeftWidth: 4,
  },
  pathIcon: {
    width: 40,
    alignItems: 'center',
  },
  pathInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  pathDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  pathProgress: {
    marginTop: Layout.spacing.sm,
  },
  pathProgressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  lessonsList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lessonItemLocked: {
    opacity: 0.5,
  },
  lessonItemCompleted: {
    backgroundColor: '#f8fff8',
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.background,
  },
  lessonNumberTextLocked: {
    color: Colors.textSecondary,
  },
  lessonContent: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  lessonTitleLocked: {
    color: Colors.textSecondary,
  },
  lessonObjectives: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  lessonObjectivesLocked: {
    color: Colors.textSecondary,
  },
  lessonMeta: {
    flexDirection: 'row',
    marginTop: Layout.spacing.xs,
    gap: Layout.spacing.md,
  },
  lessonTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  lessonTimeLocked: {
    color: Colors.textSecondary,
  },
  lessonVocab: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  lessonVocabLocked: {
    color: Colors.textSecondary,
  },
  lessonStatus: {
    width: 40,
    alignItems: 'center',
  },
  scoreContainer: {
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.background,
  },
  tipsCard: {
    backgroundColor: '#f0f8ff',
    marginBottom: Layout.spacing.xl,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: Layout.spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});