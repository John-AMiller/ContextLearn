import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak?: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
}) => {
  const getStreakEmoji = () => {
    if (currentStreak === 0) return '💤';
    if (currentStreak < 3) return '✨';
    if (currentStreak < 7) return '🔥';
    if (currentStreak < 30) return '🔥🔥';
    return '🔥🔥🔥';
  };

  return (
    <View style={styles.container}>
      <View style={styles.streakHeader}>
        <Text style={styles.streakEmoji}>{getStreakEmoji()}</Text>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>
            {currentStreak === 1 ? 'Day Streak' : 'Day Streak'}
          </Text>
        </View>
      </View>
      
      <View style={styles.weekView}>
        {[...Array(7)].map((_, index) => {
          const isPastDay = index < (currentStreak % 7 || 7);
          const isCurrentWeek = currentStreak > 0 && currentStreak <= 7;
          const isActive = isCurrentWeek ? isPastDay : currentStreak > 7;
          
          return (
            <View
              key={index}
              style={[
                styles.dayCircle,
                isActive && styles.dayCircleActive
              ]}
            />
          );
        })}
      </View>
      
      {longestStreak && longestStreak > currentStreak && (
        <Text style={styles.longestStreak}>
          Longest streak: {longestStreak} days
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: Layout.spacing.sm,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  weekView: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
  },
  dayCircleActive: {
    backgroundColor: Colors.success,
  },
  longestStreak: {
    marginTop: Layout.spacing.sm,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});