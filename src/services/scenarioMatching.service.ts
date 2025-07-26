// src/services/scenarioMatching.service.ts

import { CATEGORIES } from '@/constants/lessons';

export interface ScenarioMatch {
  isMatch: boolean;
  matchedScenario?: string;
  matchedCategory?: string;
  confidence: number; // 0-1 score
}

/**
 * Keywords for each scenario to improve matching
 */
const SCENARIO_KEYWORDS: Record<string, string[]> = {
  'ordering food': ['restaurant', 'dining', 'eating', 'menu', 'food', 'order', 'waiter', 'cafe', 'bistro'],
  'asking for directions': ['directions', 'navigate', 'lost', 'map', 'street', 'address', 'way', 'route', 'location'],
  'shopping': ['store', 'buy', 'purchase', 'shopping', 'market', 'mall', 'clothes', 'items', 'checkout'],
  'hotel check-in': ['hotel', 'accommodation', 'booking', 'reservation', 'check-in', 'room', 'stay', 'lodge'],
  'transportation': ['train', 'bus', 'taxi', 'metro', 'transport', 'ticket', 'station', 'airport', 'travel'],
  'at the doctor': ['doctor', 'medical', 'hospital', 'health', 'appointment', 'sick', 'medicine', 'clinic'],
  'introducing yourself': ['introduction', 'meeting', 'hello', 'name', 'greet', 'nice to meet', 'first time'],
  'making small talk': ['chat', 'conversation', 'talk', 'weather', 'small talk', 'casual', 'friendly'],
  'at the bank': ['bank', 'money', 'account', 'withdraw', 'deposit', 'atm', 'card', 'finance'],
  'emergency situations': ['emergency', 'help', 'urgent', 'police', 'fire', 'accident', 'problem', 'danger'],
};

/**
 * Normalizes text for better matching (lowercase, remove punctuation, etc.)
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
};

/**
 * Calculates similarity between two strings using simple word overlap
 */
const calculateSimilarity = (input: string, target: string): number => {
  const inputWords = normalizeText(input).split(/\s+/);
  const targetWords = normalizeText(target).split(/\s+/);
  
  let matches = 0;
  inputWords.forEach(word => {
    if (targetWords.some(targetWord => 
      targetWord.includes(word) || word.includes(targetWord)
    )) {
      matches++;
    }
  });
  
  return matches / Math.max(inputWords.length, targetWords.length);
};

/**
 * Checks if user input matches any existing scenarios
 */
export const findScenarioMatch = (userInput: string): ScenarioMatch => {
  const normalizedInput = normalizeText(userInput);
  let bestMatch: ScenarioMatch = { isMatch: false, confidence: 0 };
  
  // Get all scenarios from categories
  const allScenarios: Array<{scenario: string, category: string}> = [];
  
  CATEGORIES.forEach(category => {
    category.scenarios.forEach(scenario => {
      allScenarios.push({ scenario, category: category.name });
    });
  });
  
  // Check direct scenario matches
  allScenarios.forEach(({ scenario, category }) => {
    const directSimilarity = calculateSimilarity(userInput, scenario);
    
    if (directSimilarity > bestMatch.confidence) {
      bestMatch = {
        isMatch: directSimilarity >= 0.6, // 60% similarity threshold
        matchedScenario: scenario,
        matchedCategory: category,
        confidence: directSimilarity
      };
    }
  });
  
  // Check keyword-based matches if no direct match found
  if (bestMatch.confidence < 0.6) {
    Object.entries(SCENARIO_KEYWORDS).forEach(([scenarioKey, keywords]) => {
      // Find if this scenario exists in our categories
      const matchingScenario = allScenarios.find(({ scenario }) => 
        normalizeText(scenario).includes(scenarioKey) || 
        scenarioKey.includes(normalizeText(scenario))
      );
      
      if (matchingScenario) {
        // Check if user input contains any of these keywords
        const keywordMatches = keywords.filter(keyword => 
          normalizedInput.includes(keyword) || keyword.includes(normalizedInput)
        );
        
        const keywordSimilarity = keywordMatches.length / keywords.length;
        
        if (keywordSimilarity > bestMatch.confidence) {
          bestMatch = {
            isMatch: keywordSimilarity >= 0.3, // Lower threshold for keyword matching
            matchedScenario: matchingScenario.scenario,
            matchedCategory: matchingScenario.category,
            confidence: keywordSimilarity
          };
        }
      }
    });
  }
  
  return bestMatch;
};

/**
 * Gets a user-friendly confirmation message for a matched scenario
 */
export const getConfirmationMessage = (scenario: string): string => {
  const normalizedScenario = normalizeText(scenario);
  
  if (normalizedScenario.includes('order') || normalizedScenario.includes('food')) {
    return 'Do you want to learn about ordering food?';
  } else if (normalizedScenario.includes('direction')) {
    return 'Do you want to learn about asking for directions?';
  } else if (normalizedScenario.includes('shop')) {
    return 'Do you want to learn about shopping?';
  } else if (normalizedScenario.includes('hotel')) {
    return 'Do you want to learn about hotel check-in?';
  } else if (normalizedScenario.includes('transport')) {
    return 'Do you want to learn about transportation?';
  } else if (normalizedScenario.includes('doctor') || normalizedScenario.includes('medical')) {
    return 'Do you want to learn about medical/doctor visits?';
  } else if (normalizedScenario.includes('introduc') || normalizedScenario.includes('meet')) {
    return 'Do you want to learn about introducing yourself?';
  } else if (normalizedScenario.includes('small talk') || normalizedScenario.includes('conversation')) {
    return 'Do you want to learn about making small talk?';
  } else if (normalizedScenario.includes('bank') || normalizedScenario.includes('money')) {
    return 'Do you want to learn about banking?';
  } else if (normalizedScenario.includes('emergency')) {
    return 'Do you want to learn about emergency situations?';
  } else {
    return `Do you want to learn about ${scenario.toLowerCase()}?`;
  }
};

/**
 * Example usage and testing function
 */
export const testMatching = () => {
  const testCases = [
    'ordering food',
    'restaurant',
    'I want to eat',
    'asking for directions',
    'I am lost',
    'fork', // Should not match
    'shopping for clothes',
    'hotel reservation',
    'Ordering penne alla vodka at a fancy restaurant in Rome' // Should not match (too specific)
  ];
  
  testCases.forEach(testCase => {
    const result = findScenarioMatch(testCase);
    console.log(`"${testCase}" -> Match: ${result.isMatch}, Scenario: ${result.matchedScenario}, Confidence: ${result.confidence.toFixed(2)}`);
  });
};