import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { useProgress } from '@/hooks/useProgress';

const ProgressScreen: React.FC = () => {
  const { completedScenarios, totalXP, streak } = useProgress();
  
  // Get weekly activity data (initialize as empty for new users)
  const getWeeklyActivity = () => {
    // For now, return empty data for new users
    // Later, this would come from actual user activity data
    return [0, 0, 0, 0, 0, 0, 0]; // 7 days, all zero for new users
  };

  const weeklyData = getWeeklyActivity();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
        </View>

        <Card style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.weekChart}>
            {weeklyData.map((activity, index) => {
              const height = Math.max(activity * 10, 5); // Convert activity to percentage, minimum 5% for visibility
              return (
                <View key={index} style={styles.dayColumn}>
                  <View 
                    style={[
                      styles.dayBar, 
                      { 
                        height: `${height}%`, 
                        backgroundColor: activity > 0 ? Colors.primary : Colors.border 
                      }
                    ]} 
                  />
                  <Text style={styles.dayLabel}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>
            Completed Scenarios ({completedScenarios.length})
          </Text>
          {completedScenarios.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No completed scenarios yet</Text>
              <Text style={styles.emptySubtext}>
                Start learning to see your progress here!
              </Text>
            </View>
          ) : (
            completedScenarios.map((scenario) => (
              <View key={scenario.id} style={styles.scenarioItem}>
                <View style={styles.scenarioInfo}>
                  <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                  <Text style={styles.scenarioDate}>
                    {new Date(scenario.lastPracticed).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.masteryContainer}>
                  <Text style={styles.masteryText}>{scenario.mastery}%</Text>
                  <View style={styles.masteryBar}>
                    <View 
                      style={[
                        styles.masteryFill, 
                        { width: `${scenario.mastery}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md, // Match HomeScreen padding
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  overviewCard: {
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayBar: {
    width: '60%',
    borderRadius: Layout.borderRadius.sm,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scenarioItem: {
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  scenarioInfo: {
    marginBottom: Layout.spacing.sm,
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  scenarioDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  masteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  masteryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    width: 40,
  },
  masteryBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
  },
  masteryFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
});

export default ProgressScreen;