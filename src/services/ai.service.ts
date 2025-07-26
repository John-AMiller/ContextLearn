// src/services/ai.service.ts

import * as FileSystem from 'expo-file-system';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
  };
}

export interface VocabularyItem {
  word: string;
  translation: string;
  priority: 'essential' | 'important' | 'bonus';
  examples: string[];
  grammarNote?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase' | 'adverb';
}

export interface AIConfirmationOptions {
  question: string;
  options: string[];
}

export interface AILessonContent {
  vocabulary: VocabularyItem[];
  scenario: string;
  culturalNotes?: string;
}

/**
 * Converts image file to base64 string
 */
const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
};

/**
 * Analyzes an image and/or text to generate confirmation options
 * @param imageUri - The URI of the image to analyze (optional)
 * @param userText - Text input from user (optional)
 * @param targetLanguage - The language the user is learning
 * @returns Confirmation options for the user to choose from
 */
export const generateConfirmationOptions = async (
  imageUri: string | null,
  userText: string | null,
  targetLanguage: string
): Promise<AIConfirmationOptions> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env.local file.');
    }

    // Build the analysis prompt based on what we have
    let analysisPrompt = '';
    const messageContent: any[] = [];

    if (imageUri && userText) {
      analysisPrompt = `I have an image and the user mentioned "${userText}". Based on both the image and their text, what might they want to learn in ${targetLanguage}?`;
      messageContent.push({
        type: 'text',
        text: analysisPrompt
      });
      const base64Image = await imageToBase64(imageUri);
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`,
          detail: 'high'
        }
      });
    } else if (imageUri) {
      analysisPrompt = `Based on this image, what might the user want to learn in ${targetLanguage}?`;
      messageContent.push({
        type: 'text',
        text: analysisPrompt
      });
      const base64Image = await imageToBase64(imageUri);
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`,
          detail: 'high'
        }
      });
    } else if (userText) {
      analysisPrompt = `The user mentioned "${userText}". What might they want to learn in ${targetLanguage}?`;
      messageContent.push({
        type: 'text',
        text: analysisPrompt
      });
    } else {
      throw new Error('Either image or text input is required');
    }

    const systemPrompt = `You are a language learning assistant. Based on the provided image and/or text, generate a confirmation question and 3-4 specific learning options.

IMPORTANT: Respond in this EXACT JSON format:
{
  "question": "A clear question about what they want to learn",
  "options": [
    "Option 1: Specific learning goal",
    "Option 2: Another specific learning goal", 
    "Option 3: Another specific learning goal",
    "Option 4: Another specific learning goal (optional)"
  ]
}

Example for a restaurant menu image + "fork":
{
  "question": "I see a restaurant menu and you mentioned 'fork'. What would you like to learn about?",
  "options": [
    "Ordering food and restaurant vocabulary",
    "Dining etiquette and table manners",
    "Kitchen utensils and cooking terms",
    "Reading menus and food descriptions"
  ]
}

Make options specific and practical for ${targetLanguage} learning. Consider multiple contexts and meanings (like homonyms).`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: imageUri ? 'gpt-4.1' : 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: messageContent
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific API errors
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (response.status === 401) {
        throw new Error('API key is invalid. Please check your OpenAI API key.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Please check your OpenAI account has access to GPT-4 Vision.');
      } else {
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }

    const content = data.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from OpenAI API');
    }

    // Parse the JSON response
    try {
      const parsedResponse = JSON.parse(content);
      
      if (!parsedResponse.question || !parsedResponse.options || !Array.isArray(parsedResponse.options)) {
        throw new Error('Invalid response format from AI');
      }

      return {
        question: parsedResponse.question,
        options: parsedResponse.options.slice(0, 4) // Ensure max 4 options
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      
      // Fallback options based on input
      return generateFallbackOptions(userText, targetLanguage);
    }

  } catch (error) {
    console.error('AI Confirmation Error:', error);
    
    // Re-throw API-specific errors so user sees helpful messages
    if (error instanceof Error && (
      error.message.includes('Too many requests') ||
      error.message.includes('API key') ||
      error.message.includes('Access denied') ||
      error.message.includes('not configured')
    )) {
      throw error;
    }
    
    // For other errors, provide fallback options
    return generateFallbackOptions(userText, targetLanguage);
  }
};

/**
 * Generates comprehensive lesson content with prioritized vocabulary
 * @param finalDescription - What the user confirmed they want to learn
 * @param targetLanguage - The language the user is learning
 * @param location - Geographic context (spain, mexico, italy, etc.)
 * @param formality - Formality level (casual, neutral, formal)
 * @returns Structured lesson content with prioritized vocabulary
 */
export const generateLessonContent = async (
  finalDescription: string,
  targetLanguage: string,
  location: string = 'general',
  formality: string = 'neutral'
): Promise<AILessonContent> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env.local file.');
    }

    const systemPrompt = `You are a language learning assistant. Create a comprehensive vocabulary lesson for learning ${targetLanguage}.

Based on the user's request, generate 15-20 vocabulary items with different priority levels:
- ESSENTIAL (5-6 items): Critical words needed immediately for the situation
- IMPORTANT (6-8 items): Very useful words that enhance communication  
- BONUS (4-6 items): Advanced/cultural words that add depth

Include a mix of nouns, verbs, adjectives, and useful phrases. Consider ${location} context and ${formality} formality level.

Respond in this EXACT JSON format:
{
  "vocabulary": [
    {
      "word": "helado",
      "translation": "ice cream", 
      "priority": "essential",
      "examples": ["Quisiera un helado", "Me gusta el helado"],
      "grammarNote": "Masculine noun - always 'el helado'",
      "partOfSpeech": "noun"
    }
  ],
  "scenario": "Brief scenario description for context",
  "culturalNotes": "Relevant cultural context for the location"
}

Make examples practical and region-appropriate. Grammar notes should be concise but helpful.`;

    const userPrompt = `Create a ${targetLanguage} vocabulary lesson for: "${finalDescription}"
    
Location context: ${location}
Formality level: ${formality}

Generate comprehensive vocabulary with priorities (essential/important/bonus) and include cultural context.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (response.status === 401) {
        throw new Error('API key is invalid. Please check your OpenAI API key.');
      } else {
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }

    const content = data.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response from OpenAI API');
    }

    try {
      const parsedResponse = JSON.parse(content);
      
      if (!parsedResponse.vocabulary || !Array.isArray(parsedResponse.vocabulary)) {
        throw new Error('Invalid lesson content format from AI');
      }

      return {
        vocabulary: parsedResponse.vocabulary,
        scenario: parsedResponse.scenario || 'Practice essential vocabulary',
        culturalNotes: parsedResponse.culturalNotes
      };
    } catch (parseError) {
      console.error('Failed to parse AI lesson content:', content);
      
      // Return fallback lesson content
      return generateFallbackLessonContent(finalDescription, targetLanguage);
    }

  } catch (error) {
    console.error('Lesson content generation error:', error);
    
    if (error instanceof Error && (
      error.message.includes('Too many requests') ||
      error.message.includes('API key') ||
      error.message.includes('not configured')
    )) {
      throw error;
    }
    
    throw new Error('Sorry, the lesson generation feature isn\'t working right now. Please try again later.');
  }
};

/**
 * Helper function to detect text in images (OCR functionality)
 * This can be useful for reading menus, signs, etc.
 */
export const extractTextFromImage = async (imageUri: string): Promise<string> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env.local file.');
    }

    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract and transcribe all visible text from this image. Return only the text, maintaining the original layout when possible. If no text is visible, respond with "No text detected".'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific API errors
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (response.status === 401) {
        throw new Error('API key is invalid. Please check your OpenAI API key.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Please check your OpenAI account has access to GPT-4 Vision.');
      } else {
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }

    const content = data.choices[0].message.content;
    if (!content || content.trim().length === 0) {
      return 'No text detected';
    }

    return content;

  } catch (error) {
    console.error('Text extraction error:', error);
    
    // Re-throw API-specific errors
    if (error instanceof Error && (
      error.message.includes('Too many requests') ||
      error.message.includes('API key') ||
      error.message.includes('Access denied') ||
      error.message.includes('not configured')
    )) {
      throw error;
    }
    
    // For other errors, throw a generic message
    throw new Error('Sorry, the text extraction feature isn\'t working right now. Please try again later.');
  }
};

/**
 * Filters vocabulary based on lesson length preference
 * @param vocabulary - Full vocabulary list from AI
 * @param lessonType - 'rapid' or 'full'
 * @returns Filtered vocabulary items
 */
export const filterVocabularyByLength = (
  vocabulary: VocabularyItem[], 
  lessonType: 'rapid' | 'full'
): VocabularyItem[] => {
  if (lessonType === 'rapid') {
    // For rapid lessons, prioritize essential items (5-6 total)
    const essential = vocabulary.filter(item => item.priority === 'essential');
    const important = vocabulary.filter(item => item.priority === 'important');
    
    // Take all essential + some important to reach ~6 items
    const rapidItems = [...essential];
    const remainingSlots = Math.max(0, 6 - essential.length);
    rapidItems.push(...important.slice(0, remainingSlots));
    
    return rapidItems.slice(0, 6);
  } else {
    // For full lessons, return all vocabulary (15-20 items)
    return vocabulary;
  }
};

/**
 * Generates fallback lesson content when AI fails
 */
const generateFallbackLessonContent = (
  description: string, 
  targetLanguage: string
): AILessonContent => {
  // Create basic vocabulary based on the description
  const fallbackVocabulary: VocabularyItem[] = [
    {
      word: "hola",
      translation: "hello",
      priority: "essential",
      examples: ["Hola, ¿cómo estás?"],
      grammarNote: "Standard greeting used any time of day",
      partOfSpeech: "phrase"
    },
    {
      word: "por favor",
      translation: "please",
      priority: "essential", 
      examples: ["Una mesa por favor", "Ayúdame por favor"],
      grammarNote: "Always use for polite requests",
      partOfSpeech: "phrase"
    },
    {
      word: "gracias",
      translation: "thank you",
      priority: "essential",
      examples: ["Gracias por su ayuda", "Muchas gracias"],
      grammarNote: "Can be enhanced with 'muchas' for emphasis",
      partOfSpeech: "phrase"
    },
    {
      word: "disculpe",
      translation: "excuse me",
      priority: "important",
      examples: ["Disculpe, ¿dónde está...?", "Disculpe la molestia"],
      grammarNote: "Formal way to get someone's attention",
      partOfSpeech: "phrase"
    },
    {
      word: "¿cuánto cuesta?",
      translation: "how much does it cost?",
      priority: "important",
      examples: ["¿Cuánto cuesta esto?", "¿Cuánto cuesta el menú?"],
      grammarNote: "Essential for shopping and dining",
      partOfSpeech: "phrase"
    }
  ];

  return {
    vocabulary: fallbackVocabulary,
    scenario: `Practice essential ${targetLanguage} vocabulary related to: ${description}`,
    culturalNotes: `These are fundamental phrases you'll use in most ${targetLanguage}-speaking situations.`
  };
};

/**
 * Generates fallback confirmation options when AI fails
 */
const generateFallbackOptions = (userText: string | null, targetLanguage: string): AIConfirmationOptions => {
  if (userText) {
    return {
      question: `What would you like to learn about "${userText}" in ${targetLanguage}?`,
      options: [
        `Basic vocabulary related to "${userText}"`,
        `Conversations involving "${userText}"`,
        `Grammar and sentence structure with "${userText}"`,
        `Cultural context and usage of "${userText}"`
      ]
    };
  } else {
    return {
      question: `What would you like to learn in ${targetLanguage}?`,
      options: [
        'Basic vocabulary and common words',
        'Everyday conversations and phrases',
        'Grammar and sentence structure',
        'Cultural expressions and idioms'
      ]
    };
  }
};