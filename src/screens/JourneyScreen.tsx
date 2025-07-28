// src/screens/JourneyScreen.tsx - Custom Background Image Implementation

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  ImageBackground
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

interface LessonNode {
  id: string;
  number: number;
  title: string;
  category: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  position: { x: number; y: number };
  landmarkType: 'village' | 'tower' | 'bridge' | 'castle' | 'forest' | 'mountain' | 'river' | 'hut' | 'ruins';
}

export const JourneyScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [lessonNodes, setLessonNodes] = useState<LessonNode[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [scholarPosition] = useState(new Animated.ValueXY());
  const [backgroundDimensions, setBackgroundDimensions] = useState({ width: 0, height: 0 });
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });

  // Background image - you'll replace this with your actual image
  const backgroundImage = require('./journey-background.png'); // Update path

  useEffect(() => {
    loadUserProgress();
  }, [currentLanguage, user]);

  useEffect(() => {
    generateLessonNodes();
  }, [lessonProgress, backgroundDimensions, originalImageDimensions]);

  // Auto-scroll and animate scholar when map loads
  useEffect(() => {
    if (lessonNodes.length > 0 && scrollViewRef.current) {
      const currentLesson = lessonNodes[currentLessonIndex];
      if (currentLesson) {
        // Scroll to current lesson (bottom-to-top progression)
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: 0,
            y: Math.max(0, backgroundDimensions.height - currentLesson.position.y - height / 2),
            animated: true
          });
        }, 500);

        // Animate scholar to current position
        Animated.spring(scholarPosition, {
          toValue: { 
            x: currentLesson.position.x - 80, 
            y: currentLesson.position.y - 10 
          },
          useNativeDriver: false,
          tension: 50,
          friction: 8
        }).start();
      }
    }
  }, [lessonNodes, currentLessonIndex, backgroundDimensions]);

const loadUserProgress = async () => {
  const mockProgress: Record<string, LessonProgress> = {
    'lesson-1': { 
      isCompleted: true, 
      isUnlocked: true, 
      lessonId: 'lesson-1', 
      userId: user?.id || '', 
      score: 100, 
      timeSpent: 300, 
      lastAttempted: new Date(),
      exerciseScores: {
        'vocabulary': 95,
        'grammar': 100,
        'listening': 98,
        'speaking': 100
      },
      attemptsCount: 2
    },
    'lesson-2': { 
      isCompleted: true, 
      isUnlocked: true, 
      lessonId: 'lesson-2', 
      userId: user?.id || '', 
      score: 95, 
      timeSpent: 280, 
      lastAttempted: new Date(),
      exerciseScores: {
        'vocabulary': 90,
        'grammar': 95,
        'listening': 98
      },
      attemptsCount: 1
    },
    'lesson-3': { 
      isCompleted: false, 
      isUnlocked: true, 
      lessonId: 'lesson-3', 
      userId: user?.id || '', 
      score: 0, 
      timeSpent: 0, 
      lastAttempted: new Date(),
      exerciseScores: {}, // Empty object for incomplete lessons
      attemptsCount: 0
    },
    'lesson-4': { 
      isCompleted: false, 
      isUnlocked: false, 
      lessonId: 'lesson-4', 
      userId: user?.id || '', 
      score: 0, 
      timeSpent: 0, 
      lastAttempted: new Date(),
      exerciseScores: {},
      attemptsCount: 0
    },
  };
  setLessonProgress(mockProgress);
};

  const generateLessonNodes = () => {
    if (!backgroundDimensions.width || !backgroundDimensions.height || !originalImageDimensions.width) return;

    const lessons: LessonNode[] = [];
    
    // Calculate scale factors from original image to screen size
    const scaleX = backgroundDimensions.width / originalImageDimensions.width;
    const scaleY = backgroundDimensions.height / originalImageDimensions.height;
    
    // Language learning curriculum
    const lessonData = [
      { id: 'lesson-1', title: 'Introduction', category: 'basics', landmark: 'village' as const },
      { id: 'lesson-2', title: 'Greetings', category: 'basics', landmark: 'tower' as const },
      { id: 'lesson-3', title: 'Numbers', category: 'numbers', landmark: 'bridge' as const },
      { id: 'lesson-4', title: 'Colors', category: 'adjectives', landmark: 'forest' as const },
      { id: 'lesson-5', title: 'Nouns I', category: 'nouns', landmark: 'river' as const },
      { id: 'lesson-6', title: 'Nouns II', category: 'nouns', landmark: 'hut' as const },
      { id: 'lesson-7', title: 'Verbs I', category: 'verbs', landmark: 'mountain' as const },
      { id: 'lesson-8', title: 'Verbs II', category: 'verbs', landmark: 'castle' as const },
      { id: 'lesson-9', title: 'Family', category: 'nouns', landmark: 'ruins' as const },
    ];

    // Your absolute coordinates from the original image - properly scaled
    const originalCoordinates = [
      { x: 210, y: 1608 }, // Village (bottom)
      { x: 930, y: 1558 }, // Tower
      { x: 566, y: 1302 }, // Bridge
      // Add more coordinates as you identify them
      { x: 900, y: 1132 }, // Placeholder - replace with actual coordinates
      { x: 570, y: 920 },  // Placeholder - replace with actual coordinates
      { x: 795, y: 840 },  // Placeholder - replace with actual coordinates
      { x: 920, y: 550 },  // Placeholder - replace with actual coordinates
      { x: 800, y: 250 },  // Placeholder - replace with actual coordinates
      { x: 350, y: 66 },  // Placeholder - replace with actual coordinates
    ];

    // Scale coordinates to screen size
    const scaledCoordinates = originalCoordinates.map(coord => ({
      x: coord.x * scaleX,
      y: coord.y * scaleY
    }));


    // Generate lesson nodes
    lessonData.forEach((lesson, index) => {
      const progress = lessonProgress[lesson.id];
      const isCompleted = progress?.isCompleted || false;
      const isUnlocked = progress?.isUnlocked || index === 0 || 
        (index > 0 && lessonProgress[lessonData[index - 1].id]?.isCompleted);
      
      // Find current lesson (first incomplete unlocked lesson)
      const isCurrent = isUnlocked && !isCompleted && 
        (index === 0 || lessonProgress[lessonData[index - 1].id]?.isCompleted);
      
      if (isCurrent) {
        setCurrentLessonIndex(index);
      }

      // Use scaled coordinates or fallback
      const position = scaledCoordinates[index] || { 
        x: backgroundDimensions.width * 0.5, 
        y: backgroundDimensions.height * (0.9 - index * 0.08) 
      };

      lessons.push({
        ...lesson,
        number: index + 1,
        isCompleted,
        isUnlocked,
        isCurrent,
        position,
        landmarkType: lesson.landmark
      });
    });

    setLessonNodes(lessons);
  };

  const handleLessonPress = (lesson: LessonNode) => {
    if (!lesson.isUnlocked) return;
    
    // TODO: Navigate to lesson
    console.log('Starting lesson:', lesson.title);
    
    // Animate scholar to this lesson
    Animated.spring(scholarPosition, {
      toValue: { 
        x: lesson.position.x - 70, 
        y: lesson.position.y - 10 
      },
      useNativeDriver: false,
      tension: 50,
      friction: 8
    }).start();
  };

  const onBackgroundLoad = (event: any) => {
    const { width: imgWidth, height: imgHeight } = event.nativeEvent.source;
    const aspectRatio = imgHeight / imgWidth;
    const scaledHeight = width * aspectRatio;
    
    // Store both original and scaled dimensions
    setOriginalImageDimensions({
      width: imgWidth,
      height: imgHeight
    });
    
    setBackgroundDimensions({
      width: width,
      height: scaledHeight
    });
  };

  const getLandmarkIcon = (type: LessonNode['landmarkType']): string => {
    const icons = {
      village: 'home-group',
      tower: 'castle',
      bridge: 'bridge',
      mountain: 'image-filter-hdr',
      forest: 'tree',
      castle: 'chess-rook',
      river: 'water',
        hut: 'home',
        ruins: 'city-variant',
    };
    return icons[type];
  };

  const renderLessonNode = (lesson: LessonNode) => {
    return (
      <TouchableOpacity
        key={lesson.id}
        style={[
          styles.lessonNode,
          {
            position: 'absolute',
            left: lesson.position.x - 20,
            top: lesson.position.y - 15,
          },
          lesson.isCompleted && styles.completedNode,
          lesson.isCurrent && styles.currentNode,
          !lesson.isUnlocked && styles.lockedNode
        ]}
        onPress={() => handleLessonPress(lesson)}
        disabled={!lesson.isUnlocked}
      >
        {/* Lesson Background */}
        <LinearGradient
          colors={lesson.isCompleted 
            ? ['#2f855a', '#38a169'] 
            : lesson.isCurrent
              ? ['#d69e2e', '#ed8936']
              : lesson.isUnlocked 
                ? ['rgba(47, 133, 90, 0.8)', 'rgba(45, 55, 72, 0.8)']
                : ['rgba(45, 55, 72, 0.4)', 'rgba(45, 55, 72, 0.4)']
          }
          style={styles.lessonBackground}
        >
          <Icon 
            name={getLandmarkIcon(lesson.landmarkType)} 
            size={24} 
            color={lesson.isUnlocked ? '#f7fafc' : 'rgba(247, 250, 252, 0.3)'} 
          />
        </LinearGradient>
        
        {/* Lesson Number */}
        <View style={styles.lessonNumberBadge}>
          <Text style={styles.lessonNumber}>{lesson.number}</Text>
        </View>
        
        {/* Completion Badge */}
        {lesson.isCompleted && (
          <View style={styles.completedBadge}>
            <Icon name="check" size={16} color="#f7fafc" />
          </View>
        )}
        
        {/* Current Indicator */}
        {lesson.isCurrent && (
          <View style={styles.currentIndicator}>
            <Text style={styles.currentStar}>⭐</Text>
          </View>
        )}
        
        {/* Lesson Title */}
        <Text style={[
          styles.lessonTitle,
          { color: lesson.isUnlocked ? '#f7fafc' : 'rgba(247, 250, 252, 0.3)' }
        ]}>
          {lesson.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const getCompletedCount = () => {
    return lessonNodes.filter(lesson => lesson.isCompleted).length;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#2f855a', '#38a169']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Learning Journey</Text>
            <Text style={styles.headerSubtitle}>
              {getCompletedCount()}/{lessonNodes.length} lessons completed
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Fantasy World Map with Background Image */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.mapContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          height: backgroundDimensions.height || height * 2,
          position: 'relative'
        }}
      >
        <ImageBackground
          source={backgroundImage}
          style={[styles.backgroundImage, { 
            width: width,
            height: backgroundDimensions.height || height * 2
          }]}
          resizeMode="cover"
          onLoad={onBackgroundLoad}
        >
          {/* Lesson Nodes */}
          {lessonNodes.map(lesson => renderLessonNode(lesson))}
          
          {/* Animated Scholar Character */}
          <Animated.View style={[
            styles.scholarCharacter,
            {
              position: 'absolute',
              transform: [
                { translateX: scholarPosition.x },
                { translateY: scholarPosition.y }
              ]
            }
          ]}>
            <Text style={styles.scholarEmoji}>🧙‍♂️</Text>
          </Animated.View>
        </ImageBackground>
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
    overflow: 'hidden',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f7fafc',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(247, 250, 252, 0.8)',
  },
  mapContainer: {
    flex: 1,
  },
  backgroundImage: {
    position: 'relative',
  },
  
  // Lesson Nodes
  lessonNode: {
    alignItems: 'center',
  },
  lessonBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#d69e2e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  lessonNumberBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#d69e2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f7fafc',
  },
  lessonNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  completedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#38a169',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f7fafc',
  },
  currentIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#ffd700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f7fafc',
  },
  currentStar: {
    fontSize: 12,
  },
  lessonTitle: {
    position: 'absolute',
    top: 75,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    width: 80,
    left: -5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  completedNode: {
    transform: [{ scale: 1.05 }],
  },
  currentNode: {
    transform: [{ scale: 1.1 }],
  },
  lockedNode: {
    opacity: 1,
  },  
  // Scholar Character
  scholarCharacter: {
    alignItems: 'center',
    zIndex: 100,
  },
  scholarEmoji: {
    fontSize: 35,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});