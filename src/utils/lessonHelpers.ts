// src/utils/lessonHelpers.ts

/**
 * Generates a meaningful lesson title from user description
 * Example: "I want to order ice cream from this menu" → "Ice Cream Ordering"
 */
export const generateLessonTitle = (description: string): string => {
  // Remove common phrases and words
  const commonPhrases = [
    'i want to', 'i need to', 'i would like to', 'help me', 'teach me',
    'learn', 'how to', 'from this', 'in this', 'at this', 'with this',
    'menu', 'image', 'photo', 'picture', 'location', 'place'
  ];
  
  let cleaned = description.toLowerCase();
  
  // Remove common phrases
  commonPhrases.forEach(phrase => {
    cleaned = cleaned.replace(new RegExp(phrase, 'g'), '');
  });
  
  // Split into words and filter out empty strings and short words
  const words = cleaned
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'for', 'with', 'about'].includes(word));
  
  // Take first 2-3 meaningful words
  const keyWords = words.slice(0, 3);
  
  // If we have good keywords, use them
  if (keyWords.length > 0) {
    let title = keyWords
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Add context if it makes sense
    if (description.toLowerCase().includes('order')) {
      title += ' Ordering';
    } else if (description.toLowerCase().includes('ask') || description.toLowerCase().includes('question')) {
      title += ' Questions';
    } else if (description.toLowerCase().includes('direction')) {
      title += ' Directions';
    } else if (description.toLowerCase().includes('describe')) {
      title += ' Description';
    } else if (!title.includes('ing')) {
      title += ' Vocabulary';
    }
    
    return title;
  }
  
  // Fallback to category-based titles
  if (description.toLowerCase().includes('food') || description.toLowerCase().includes('restaurant')) {
    return 'Restaurant Vocabulary';
  } else if (description.toLowerCase().includes('travel') || description.toLowerCase().includes('direction')) {
    return 'Travel Phrases';
  } else if (description.toLowerCase().includes('shop') || description.toLowerCase().includes('buy')) {
    return 'Shopping Vocabulary';
  } else {
    return 'Language Practice';
  }
};

/**
 * Generates a meaningful lesson ID from description
 * Example: "Ice Cream Ordering" → "ice-cream-ordering-1234567890"
 */
export const generateLessonId = (title: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Remove multiple consecutive dashes
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
  
  const timestamp = Date.now();
  return `${slug}-${timestamp}`;
};

/**
 * Formats date to "Jan 26, 2025" format
 */
export const formatLessonDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats "just now" or relative time for recent lessons
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return formatLessonDate(dateObj);
  }
};