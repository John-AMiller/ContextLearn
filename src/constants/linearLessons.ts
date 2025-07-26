// src/constants/linearLessons.ts

import { Curriculum, LessonPath, LinearLesson, VocabularyItem, Exercise } from '@/types/linearLessons';

// Helper function to create vocabulary items
const createVocab = (word: string, translation: string, examples: string[], partOfSpeech: any = 'noun'): VocabularyItem => ({
  id: `vocab-${word.toLowerCase().replace(/\s+/g, '-')}`,
  word,
  translation,
  examples,
  partOfSpeech,
});

// Helper function to create exercises with smart distractors
const createExercise = (
  type: any,
  instruction: string,
  question: string,
  correctAnswer: string,
  distractors: string[] = [],
  options?: string[]
): Exercise => ({
  id: `exercise-${Math.random().toString(36).substr(2, 9)}`,
  type,
  instruction,
  question,
  correctAnswer,
  distractors,
  options,
});

// Spanish Curriculum
const spanishCurriculum: Curriculum = {
  language: 'spanish',
  totalLessons: 24,
  estimatedDuration: '3-4 months',
  paths: [
    // NOUNS PATH
    {
      id: 'nouns-path',
      title: 'Nouns',
      description: 'Learn essential Spanish nouns',
      category: 'nouns',
      color: '#2196F3',
      icon: 'cube-outline',
      lessons: [
        // Nouns 1: Basic Items
        {
          id: 'nouns-1',
          title: 'Nouns 1: Basic Items',
          category: 'nouns',
          level: 1,
          language: 'spanish',
          prerequisites: [],
          isLocked: false,
          estimatedTime: 8,
          learningObjectives: [
            'Learn 8 basic Spanish nouns',
            'Understand gender (el/la)',
            'Practice pronunciation'
          ],
          vocabulary: [
            createVocab('la casa', 'house', ['Mi casa es grande', 'The house is big']),
            createVocab('el coche', 'car', ['El coche es azul', 'The car is blue']),
            createVocab('la mesa', 'table', ['La mesa está limpia', 'The table is clean']),
            createVocab('el libro', 'book', ['Leo un libro', 'I read a book']),
            createVocab('la silla', 'chair', ['La silla es cómoda', 'The chair is comfortable']),
            createVocab('el agua', 'water', ['Bebo agua', 'I drink water']),
            createVocab('la comida', 'food', ['La comida está deliciosa', 'The food is delicious']),
            createVocab('el teléfono', 'phone', ['Mi teléfono es nuevo', 'My phone is new']),
          ],
          exercises: [
            createExercise(
              'translation-to-target',
              'Translate to Spanish',
              'house',
              'la casa',
              [] // No distractors for first lesson
            ),
            createExercise(
              'translation-to-native',
              'Translate to English',
              'el coche',
              'car',
              []
            ),
            createExercise(
              'multiple-choice',
              'What is "la mesa" in English?',
              'la mesa',
              'table',
              [],
              ['table', 'chair', 'book', 'car']
            ),
            // More exercises...
          ]
        },
        
        // Nouns 2: Family & People
        {
          id: 'nouns-2',
          title: 'Nouns 2: Family & People',
          category: 'nouns',
          level: 2,
          language: 'spanish',
          prerequisites: ['nouns-1'],
          isLocked: true,
          estimatedTime: 10,
          learningObjectives: [
            'Learn family member names',
            'Practice with previously learned nouns',
            'Understand plural forms'
          ],
          vocabulary: [
            createVocab('la familia', 'family', ['Mi familia es grande', 'My family is big']),
            createVocab('el padre', 'father', ['Mi padre trabaja', 'My father works']),
            createVocab('la madre', 'mother', ['Mi madre cocina', 'My mother cooks']),
            createVocab('el hijo', 'son', ['El hijo estudia', 'The son studies']),
            createVocab('la hija', 'daughter', ['La hija canta', 'The daughter sings']),
            createVocab('el hermano', 'brother', ['Mi hermano es alto', 'My brother is tall']),
            createVocab('la hermana', 'sister', ['Mi hermana es doctora', 'My sister is a doctor']),
            createVocab('el amigo', 'friend', ['Mi amigo es divertido', 'My friend is fun']),
          ],
          exercises: [
            createExercise(
              'multiple-choice',
              'What is "el padre" in English?',
              'el padre',
              'father',
              ['la casa', 'el coche', 'la mesa'], // Using words from previous lesson as distractors
              ['father', 'house', 'car', 'table']
            ),
            createExercise(
              'translation-to-target',
              'Translate to Spanish',
              'family',
              'la familia',
              ['casa', 'coche', 'mesa', 'libro'] // Previous vocabulary as distractors
            ),
            // More exercises with smart distractors...
          ]
        },

        // Nouns 3: Advanced Items
        {
          id: 'nouns-3',
          title: 'Nouns 3: Advanced Items',
          category: 'nouns',
          level: 3,
          language: 'spanish',
          prerequisites: ['nouns-2'],
          isLocked: true,
          estimatedTime: 12,
          learningObjectives: [
            'Learn complex nouns',
            'Master gender rules',
            'Review all previous nouns'
          ],
          vocabulary: [
            createVocab('la universidad', 'university', ['Estudio en la universidad', 'I study at university']),
            createVocab('el trabajo', 'work/job', ['Mi trabajo es interesante', 'My work is interesting']),
            createVocab('la ciudad', 'city', ['La ciudad es grande', 'The city is big']),
            createVocab('el hospital', 'hospital', ['El hospital está cerca', 'The hospital is close']),
            createVocab('la escuela', 'school', ['Los niños van a la escuela', 'Children go to school']),
            createVocab('el supermercado', 'supermarket', ['Compro en el supermercado', 'I shop at the supermarket']),
          ],
          exercises: [
            createExercise(
              'multiple-choice',
              'What is "la universidad" in English?',
              'la universidad',
              'university',
              ['familia', 'padre', 'madre', 'casa', 'coche'], // Mix of previous lessons
              ['university', 'family', 'father', 'house']
            ),
            // More exercises with comprehensive review...
          ]
        }
      ]
    },

    // VERBS PATH
    {
      id: 'verbs-path',
      title: 'Verbs',
      description: 'Master Spanish verbs and conjugations',
      category: 'verbs',
      color: '#4CAF50',
      icon: 'run',
      lessons: [
        {
          id: 'verbs-1',
          title: 'Verbs 1: Basic Actions',
          category: 'verbs',
          level: 1,
          language: 'spanish',
          prerequisites: ['nouns-1'], // Must know some nouns first
          isLocked: true,
          estimatedTime: 10,
          learningObjectives: [
            'Learn basic action verbs',
            'Understand infinitive forms',
            'Practice present tense (yo form)'
          ],
          vocabulary: [
            createVocab('hablar', 'to speak', ['Hablo español', 'I speak Spanish'], 'verb'),
            createVocab('comer', 'to eat', ['Como comida', 'I eat food'], 'verb'),
            createVocab('beber', 'to drink', ['Bebo agua', 'I drink water'], 'verb'),
            createVocab('leer', 'to read', ['Leo un libro', 'I read a book'], 'verb'),
            createVocab('escribir', 'to write', ['Escribo una carta', 'I write a letter'], 'verb'),
            createVocab('caminar', 'to walk', ['Camino a casa', 'I walk home'], 'verb'),
          ],
          exercises: [
            createExercise(
              'translation-to-target',
              'Translate to Spanish',
              'to speak',
              'hablar',
              ['casa', 'coche', 'mesa', 'familia'] // Use learned nouns as distractors
            ),
            createExercise(
              'fill-in-blank',
              'Complete the sentence',
              'Yo _____ español (I speak Spanish)',
              'hablo',
              ['como', 'bebo', 'leo'] // Other verbs as distractors
            ),
            // More exercises...
          ]
        }
      ]
    },

    // ADJECTIVES PATH
    {
      id: 'adjectives-path',
      title: 'Adjectives',
      description: 'Describe things with Spanish adjectives',
      category: 'adjectives',
      color: '#FF9800',
      icon: 'palette-outline',
      lessons: [
        {
          id: 'adjectives-1',
          title: 'Adjectives 1: Basic Descriptions',
          category: 'adjectives',
          level: 1,
          language: 'spanish',
          prerequisites: ['nouns-2'], // Need to know nouns to describe them
          isLocked: true,
          estimatedTime: 9,
          learningObjectives: [
            'Learn basic adjectives',
            'Understand gender agreement',
            'Practice describing nouns'
          ],
          vocabulary: [
            createVocab('grande', 'big', ['La casa es grande', 'The house is big'], 'adjective'),
            createVocab('pequeño/a', 'small', ['El coche es pequeño', 'The car is small'], 'adjective'),
            createVocab('bueno/a', 'good', ['La comida es buena', 'The food is good'], 'adjective'),
            createVocab('malo/a', 'bad', ['El libro es malo', 'The book is bad'], 'adjective'),
            createVocab('nuevo/a', 'new', ['Mi teléfono es nuevo', 'My phone is new'], 'adjective'),
            createVocab('viejo/a', 'old', ['La mesa es vieja', 'The table is old'], 'adjective'),
          ],
          exercises: [
            createExercise(
              'multiple-choice',
              'How do you say "big" in Spanish?',
              'big',
              'grande',
              ['casa', 'coche', 'familia', 'padre'], // Mix nouns and other adjectives
              ['grande', 'casa', 'pequeño', 'bueno']
            ),
            // More exercises...
          ]
        }
      ]
    },

    // COLORS PATH
    {
      id: 'colors-path',
      title: 'Colors',
      description: 'Learn Spanish colors and combinations',
      category: 'colors',
      color: '#E91E63',
      icon: 'palette',
      lessons: [
        {
          id: 'colors-1',
          title: 'Colors 1: Basic Colors',
          category: 'colors',
          level: 1,
          language: 'spanish',
          prerequisites: ['adjectives-1'], // Should know adjectives first
          isLocked: true,
          estimatedTime: 7,
          learningObjectives: [
            'Learn primary colors',
            'Practice color agreement',
            'Describe objects with colors'
          ],
          vocabulary: [
            createVocab('rojo/a', 'red', ['El coche es rojo', 'The car is red'], 'adjective'),
            createVocab('azul', 'blue', ['La casa es azul', 'The house is blue'], 'adjective'),
            createVocab('verde', 'green', ['La mesa es verde', 'The table is green'], 'adjective'),
            createVocab('amarillo/a', 'yellow', ['El libro es amarillo', 'The book is yellow'], 'adjective'),
            createVocab('negro/a', 'black', ['El teléfono es negro', 'The phone is black'], 'adjective'),
            createVocab('blanco/a', 'white', ['La silla es blanca', 'The chair is white'], 'adjective'),
          ],
          exercises: [
            createExercise(
              'translation-to-target',
              'Translate to Spanish',
              'red',
              'rojo',
              ['grande', 'pequeño', 'bueno', 'nuevo'] // Previous adjectives as distractors
            ),
            // More exercises...
          ]
        }
      ]
    }
  ]
};

// Function to get curriculum for a specific language
export const getCurriculumForLanguage = (language: string): Curriculum => {
  switch (language) {
    case 'spanish':
      return spanishCurriculum;
    case 'italian':
      // TODO: Implement Italian curriculum
      return { ...spanishCurriculum, language: 'italian', totalLessons: 0, paths: [] };
    case 'french':
      // TODO: Implement French curriculum
      return { ...spanishCurriculum, language: 'french', totalLessons: 0, paths: [] };
    default:
      return { ...spanishCurriculum, language: 'english', totalLessons: 0, paths: [] };
  }
};

// Helper function to get all previously learned vocabulary up to a certain lesson
export const getPreviousVocabulary = (curriculum: Curriculum, upToLessonId: string): VocabularyItem[] => {
  const allVocab: VocabularyItem[] = [];
  
  for (const path of curriculum.paths) {
    for (const lesson of path.lessons) {
      if (lesson.id === upToLessonId) {
        return allVocab; // Return vocabulary learned before this lesson
      }
      allVocab.push(...lesson.vocabulary);
    }
  }
  
  return allVocab;
};

// Helper function to generate smart distractors for exercises
export const generateSmartDistractors = (
  correctAnswer: string,
  previousVocab: VocabularyItem[],
  count: number = 3
): string[] => {
  // Filter out the correct answer and get random previous vocabulary
  const availableWords = previousVocab
    .filter(vocab => vocab.translation !== correctAnswer && vocab.word !== correctAnswer)
    .slice(0, count * 2); // Get more than needed to have variety
  
  // Shuffle and take the required count
  const shuffled = availableWords.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(vocab => vocab.translation);
};