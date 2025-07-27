export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString();
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getLanguageFlag = (language: string): string => {
  const flags: Record<string, string> = {
    english: '🇬🇧',
    spanish: '🇪🇸',
    italian: '🇮🇹',
    french: '🇫🇷',
    german: '🇩🇪',
    portuguese: '🇵🇹',
    chinese: '🇨🇳',
    japanese: '🇯🇵',
    korean: '🇰🇷'
  };
  return flags[language.toLowerCase()] || '🏳️';
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

