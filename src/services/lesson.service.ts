import { Lesson, Scenario } from '@/types';
import { SAMPLE_LESSONS } from '@/constants/lessons';

export const getLessonsByLanguage = (language: string): Lesson[] => {
  return SAMPLE_LESSONS[language] || [];
};

export const getLessonById = (lessonId: string, language: string): Lesson | undefined => {
  const lessons = SAMPLE_LESSONS[language] || [];
  return lessons.find(lesson => lesson.id === lessonId);
};

export const generateLessonFromScenario = async (
  scenario: string, 
  language: string,
  location?: string,
  formality?: 'casual' | 'neutral' | 'formal'
): Promise<Lesson> => {
  // Simulate API call to generate lesson
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For now, return a mock lesson
  // In production, this would call your AI service
  return {
    id: `generated-${Date.now()}`,
    title: `Custom: ${scenario}`,
    scenario: scenario,
    language: language,
    difficulty: 2,
    culturalNotes: `This is a custom lesson for: ${scenario}`,
    phrases: [
      {
        id: '1',
        phrase: 'Custom phrase in target language',
        translation: 'Custom phrase in native language',
      }
    ],
    variations: {
      formal: formality === 'formal' ? ['Formal variation'] : [],
      informal: formality === 'casual' ? ['Informal variation'] : [],
      regional: {}
    },
    tags: ['custom', 'user-generated']
  };
};

export const searchLessons = (query: string, language: string): Lesson[] => {
  const lessons = SAMPLE_LESSONS[language] || [];
  return lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(query.toLowerCase()) ||
    lesson.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
};