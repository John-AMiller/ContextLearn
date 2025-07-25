export const calculateNextReviewDate = (
  masteryLevel: number, 
  lastReview: Date
): Date => {
  // Simple spaced repetition algorithm
  const intervals = [1, 3, 7, 14, 30, 60]; // days
  const index = Math.min(
    Math.floor(masteryLevel / 20), 
    intervals.length - 1
  );
  
  const nextReview = new Date(lastReview);
  nextReview.setDate(nextReview.getDate() + intervals[index]);
  
  return nextReview;
};

export const calculateMasteryLevel = (
  currentMastery: number,
  isCorrect: boolean,
  responseTime?: number
): number => {
  const baseChange = isCorrect ? 10 : -5;
  const timeBonus = responseTime && responseTime < 3000 ? 2 : 0;
  
  const newMastery = currentMastery + baseChange + timeBonus;
  return Math.max(0, Math.min(100, newMastery));
};

export const shouldReview = (nextReviewDate: Date): boolean => {
  return new Date() >= nextReviewDate;
};