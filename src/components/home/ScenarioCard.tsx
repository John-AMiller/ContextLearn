import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CompletedScenario } from '@/types';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { formatDate } from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScenarioCardProps {
  scenario: CompletedScenario;
  onPress: () => void;
  onReview: () => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onPress,
  onReview,
}) => {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return Colors.success;
    if (mastery >= 50) return Colors.warning;
    return Colors.danger;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.title}>{scenario.title}</Text>
          <Text style={styles.date}>{formatDate(scenario.lastPracticed)}</Text>
        </View>
        
        <View style={styles.masterySection}>
          <View style={styles.masteryInfo}>
            <Text style={[styles.masteryText, { color: getMasteryColor(scenario.mastery) }]}>
              {scenario.mastery}%
            </Text>
            <Text style={styles.masteryLabel}>Mastery</Text>
          </View>
          
          <TouchableOpacity onPress={onReview} style={styles.reviewButton}>
            <Icon name="refresh" size={20} color={Colors.primary} />
            <Text style={styles.reviewText}>Review</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${scenario.mastery}%`,
              backgroundColor: getMasteryColor(scenario.mastery)
            }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: Layout.spacing.md,
  },
  info: {
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  masterySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryInfo: {
    alignItems: 'center',
  },
  masteryText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  masteryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.full,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderBottomLeftRadius: Layout.borderRadius.md,
    borderBottomRightRadius: Layout.borderRadius.md,
  },
  progressFill: {
    height: '100%',
    borderBottomLeftRadius: Layout.borderRadius.md,
    borderBottomRightRadius: Layout.borderRadius.md,
  },
});