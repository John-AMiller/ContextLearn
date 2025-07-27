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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { LessonProgress } from '@/types/linearLessons';
import { getCurriculumForLanguage } from '@/constants/linearLessons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface RoadmapLesson {
  id: string;
  title: string;
  category: string;
  icon: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isNext: boolean;
  position: { x: number; y: number };
}

export const JourneyScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [roadmapLessons, setRoadmapLessons] = useState<RoadmapLesson[]>([]);

  const curriculum = getCurriculumForLanguage(currentLanguage);
  
  useEffect(() => {
    loadUserProgress();
  }, [currentLanguage, user]);

  useEffect(() => {
    generateRoadmapData();
  }, [lessonProgress, curriculum]);

  const loadUserProgress = async () => {
    // TODO: Load from Supabase
    const mockProgress: Record<string, LessonProgress> = {
      'intro-1': {
        lessonId: 'intro-1',
        userId: user?.id || '',
        isCompleted: true,
        isUnlocked: true,
        score: 95,
        timeSpent: 300,
        exerciseScores: {},
        lastAttempted: new Date(),
        attemptsCount: 1
      },
      'greetings-1': {
        lessonId: 'greetings-1',
        userId: user?.id || '',
        isCompleted: true,
        isUnlocked: true,
        score: 88,
        timeSpent: 420,
        exerciseScores: {},
        lastAttempted: new Date(),
        attemptsCount: 2
      },
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

  const generateRoadmapData = () => {
    const lessons: RoadmapLesson[] = [];
    
    // Create a roadmap from the curriculum
    const roadmapData = [
      { id: 'intro-1', title: 'Welcome', category: 'intro', icon: 'flag-variant' },
      { id: 'greetings-1', title: 'Greetings', category: 'greetings', icon: 'hand-wave' },
      { id: 'nouns-1', title: 'Basic Items', category: 'nouns', icon: 'cube-outline' },
      { id: 'nouns-2', title: 'Family', category: 'nouns', icon: 'account-group' },
      { id: 'nouns-3', title: 'Places', category: 'nouns', icon: 'map-marker' },
      { id: 'verbs-1', title: 'Basic Actions', category: 'verbs', icon: 'run' },
      { id: 'adjectives-1', title: 'Descriptions', category: 'adjectives', icon: 'palette-outline' },
      { id: 'colors-1', title: 'Colors', category: 'colors', icon: 'palette' },
      { id: 'numbers-1', title: 'Numbers', category: 'numbers', icon: 'numeric' },
      { id: 'time-1', title: 'Time', category: 'time', icon: 'clock-outline' },
      { id: 'food-1', title: 'Food', category: 'food', icon: 'food-apple' },
      { id: 'travel-1', title: 'Travel', category: 'travel', icon: 'airplane' }
    ];

    // Generate winding path positions
    roadmapData.forEach((lesson, index) => {
      const progress = lessonProgress[lesson.id];
      const isCompleted = progress?.isCompleted || false;
      const isUnlocked = progress?.isUnlocked || index === 0 || 
        (index > 0 && lessonProgress[roadmapData[index - 1].id]?.isCompleted);
      
      // Find next uncompleted lesson
      const nextIncompleteIndex = roadmapData.findIndex(l => 
        !lessonProgress[l.id]?.isCompleted
      );
      const isNext = index === nextIncompleteIndex;

      // Create winding path - alternating sides with increasing Y
      const pathWidth = width - 80;
      const stepHeight = 120;
      const x = index % 2 === 0 
        ? 60 + pathWidth * 0.2  // Left side
        : 60 + pathWidth * 0.8; // Right side
      
      const y = 200 + (index * stepHeight); // Start after header

      lessons.push({
        ...lesson,
        isCompleted,
        isUnlocked,
        isNext,
        position: { x, y }
      });
    });

    setRoadmapLessons(lessons);
  };

  const handleLessonPress = (lesson: RoadmapLesson) => {
    if (!lesson.isUnlocked) return;
    
    // TODO: Navigate to lesson
    console.log('Starting lesson:', lesson.title);
  };

  const renderPathSegment = (from: { x: number; y: number }, to: { x: number; y: number }, isCompleted: boolean) => {
    const pathColor = isCompleted ? '#d69e2e' : 'rgba(214, 158, 46, 0.3)';
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    
    return (
      <View
        key={`path-${from.x}-${from.y}`}
        style={[
          styles.pathSegment,
          {
            position: 'absolute',
            left: from.x + 30,
            top: from.y + 30,
            width: distance - 60,
            backgroundColor: pathColor,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: 'left center'
          }
        ]}
      />
    );
  };

  const renderLesson = (lesson: RoadmapLesson, index: number) => {
    return (
      <TouchableOpacity
        key={lesson.id}
        style={[
          styles.lessonNode,
          {
            position: 'absolute',
            left: lesson.position.x - 30,
            top: lesson.position.y - 30,
          },
          lesson.isCompleted && styles.lessonCompleted,
          lesson.isNext && styles.lessonNext,
          !lesson.isUnlocked && styles.lessonLocked
        ]}
        onPress={() => handleLessonPress(lesson)}
        disabled={!lesson.isUnlocked}
      >
        <LinearGradient
          colors={lesson.isCompleted 
            ? ['#2f855a', '#38a169'] 
            : lesson.isNext
              ? ['#d69e2e', '#ed8936']
              : lesson.isUnlocked 
                ? ['rgba(47, 133, 90, 0.1)', 'rgba(45, 55, 72, 0.3)']
                : ['rgba(45, 55, 72, 0.2)', 'rgba(45, 55, 72, 0.1)']
          }
          style={styles.lessonGradient}
        >
          <Icon 
            name={lesson.icon} 
            size={20} 
            color={lesson.isUnlocked ? '#f7fafc' : 'rgba(247, 250, 252, 0.3)'} 
          />
          {lesson.isCompleted && (
            <View style={styles.completedBadge}>
              <Icon name="check" size={10} color="#f7fafc" />
            </View>
          )}
          {lesson.isNext && (
            <View style={styles.nextBadge}>
              <Text style={styles.nextText}>▶</Text>
            </View>
          )}
        </LinearGradient>
        
        <View style={styles.lessonLabel}>
          <Text style={[
            styles.lessonTitle,
            { 
              color: lesson.isUnlocked ? '#f7fafc' : 'rgba(247, 250, 252, 0.3)',
              fontFamily: 'System' // Cinzel-like
            }
          ]}>
            {lesson.title}
          </Text>
          <Text style={[
            styles.lessonCategory,
            { color: lesson.isUnlocked ? '#d69e2e' : 'rgba(214, 158, 46, 0.3)' }
          ]}>
            {lesson.category.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getCompletedCount = () => {
    return roadmapLessons.filter(lesson => lesson.isCompleted).length;
  };

  const getTotalCount = () => {
    return roadmapLessons.length;
  };

  const getProgressPercentage = () => {
    return getTotalCount() > 0 ? (getCompletedCount() / getTotalCount()) * 100 : 0;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Scholarly Header - Exact match to HTML */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#2f855a', '#38a169']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}
        >
          {/* Elvish pattern overlay */}
          <View style={styles.headerOverlay} />
          
          <View style={styles.headerContent}>
            <View style={styles.scholarBadge}>
              <Text style={styles.badgeText}>Scholar's Journey</Text>
            </View>
            <Text style={styles.greeting}>Your Learning Path</Text>
            <Text style={styles.subtitle}>Follow the ancient road to mastery</Text>
            
            <View style={styles.progressOrbs}>
              <View style={styles.orb}>
                <Text style={styles.orbValue}>{getCompletedCount()}</Text>
                <Text style={styles.orbLabel}>Complete</Text>
              </View>
              <View style={styles.orb}>
                <Text style={styles.orbValue}>{getTotalCount()}</Text>
                <Text style={styles.orbLabel}>Total</Text>
              </View>
              <View style={styles.orb}>
                <Text style={styles.orbValue}>{Math.round(getProgressPercentage())}%</Text>
                <Text style={styles.orbLabel}>Progress</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Journey Map with exact background styling */}
      <ScrollView 
        style={styles.mapContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          minHeight: Math.max(height, roadmapLessons.length * 120 + 400),
          paddingBottom: 100
        }}
      >
        <LinearGradient
          colors={['#1a202c', '#2d3748', '#1a202c']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.journeyBackground}
        >
          {/* Path Segments */}
          {roadmapLessons.map((lesson, index) => {
            if (index < roadmapLessons.length - 1) {
              const nextLesson = roadmapLessons[index + 1];
              return renderPathSegment(
                lesson.position, 
                nextLesson.position, 
                lesson.isCompleted
              );
            }
            return null;
          })}
          
          {/* Lesson Nodes */}
          {roadmapLessons.map((lesson, index) => renderLesson(lesson, index))}
          
          {/* Journey Landscape Elements */}
          <View style={[styles.landscapeElement, { top: 100, left: 20 }]}>
            <Text style={styles.landscapeEmoji}>🌲</Text>
          </View>
          <View style={[styles.landscapeElement, { top: 300, right: 30 }]}>
            <Text style={styles.landscapeEmoji}>🏔️</Text>
          </View>
          <View style={[styles.landscapeElement, { top: 500, left: 40 }]}>
            <Text style={styles.landscapeEmoji}>🌊</Text>
          </View>
          <View style={[styles.landscapeElement, { top: 700, right: 20 }]}>
            <Text style={styles.landscapeEmoji}>🏰</Text>
          </View>
          <View style={[styles.landscapeElement, { top: 900, left: 30 }]}>
            <Text style={styles.landscapeEmoji}>⛰️</Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 12,
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
    // Pattern would be added here in a real implementation
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  scholarBadge: {
    backgroundColor: '#d69e2e',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#1a202c',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#f7fafc',
    marginBottom: 4,
    fontFamily: 'System', // Cinzel-like
  },
  subtitle: {
    fontSize: 12,
    color: '#e2e8f0',
    opacity: 0.9,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  progressOrbs: {
    flexDirection: 'row',
    gap: 8,
  },
  orb: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#d69e2e',
  },
  orbLabel: {
    fontSize: 7,
    color: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  mapContainer: {
    flex: 1,
  },
  journeyBackground: {
    flex: 1,
    position: 'relative',
    minHeight: '100%',
  },
  pathSegment: {
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  lessonNode: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(214, 158, 46, 0.2)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lessonCompleted: {
    borderColor: 'rgba(214, 158, 46, 0.5)',
    transform: [{ scale: 1.05 }],
  },
  lessonNext: {
    borderColor: '#d69e2e',
    shadowColor: '#d69e2e',
    shadowOpacity: 0.4,
  },
  lessonLocked: {
    opacity: 0.5,
  },
  lessonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  completedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#38a169',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f7fafc',
  },
  nextBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#d69e2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f7fafc',
  },
  nextText: {
    color: '#1a202c',
    fontSize: 8,
    fontWeight: 'bold',
  },
  lessonLabel: {
    position: 'absolute',
    top: 70,
    left: -20,
    right: -20,
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  lessonCategory: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  landscapeElement: {
    position: 'absolute',
    opacity: 0.4,
  },
  landscapeEmoji: {
    fontSize: 20,
  },
});