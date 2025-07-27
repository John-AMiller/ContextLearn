import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const GuildScreen: React.FC = () => {
  const { user } = useAuth();
  const [hasGuild, setHasGuild] = useState(false); // TODO: Get from backend

  const renderNoGuildState = () => (
    <View style={styles.centerContent}>
      <Icon name="castle" size={80} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>Join a Guild</Text>
      <Text style={styles.emptyDescription}>
        Guilds are communities where you can learn together, compete in challenges, 
        and support each other's language learning journey.
      </Text>
      
      <View style={styles.actionButtons}>
        <Button
          title="Create Guild"
          onPress={() => {
            // TODO: Navigate to guild creation
            console.log('Create guild pressed');
          }}
          style={styles.actionButton}
        />
        <Button
          title="Join Guild"
          onPress={() => {
            // TODO: Navigate to guild search/join
            console.log('Join guild pressed');
          }}
          variant="outline"
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  const renderGuildContent = () => (
    <>
      {/* Guild Header */}
      <Card style={styles.guildCard}>
        <View style={styles.guildHeader}>
          <View style={styles.guildIcon}>
            <Icon name="castle" size={32} color={Colors.primary} />
          </View>
          <View style={styles.guildInfo}>
            <Text style={styles.guildName}>Spanish Learners United</Text>
            <Text style={styles.guildMembers}>24 members • Level 12</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="cog" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.guildProgress}>
          <Text style={styles.progressLabel}>Weekly Challenge Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '67%' }]} />
          </View>
          <Text style={styles.progressText}>2,850 / 4,200 XP</Text>
        </View>
      </Card>

      {/* Guild Features */}
      <Card style={styles.featuresCard}>
        <Text style={styles.sectionTitle}>Guild Activities</Text>
        
        <TouchableOpacity style={styles.tomeItem}>
          <View style={styles.tomeIcon}>
            <Text style={styles.tomeEmoji}>🏆</Text>
          </View>
          <View style={styles.tomeContent}>
            <Text style={styles.tomeTitle}>Weekly Trials</Text>
            <Text style={styles.tomeDescription}>Compete with rival guilds</Text>
          </View>
          <View style={styles.masteryBadge}>
            <Text style={styles.masteryText}>Active</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tomeItem}>
          <View style={styles.tomeIcon}>
            <Icon name="account-group" size={24} color={Colors.secondary} />
          </View>
          <View style={styles.tomeContent}>
            <Text style={styles.tomeTitle}>Members</Text>
            <Text style={styles.tomeDescription}>Chat and collaborate</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tomeItem}>
          <View style={styles.tomeIcon}>
            <Icon name="chart-line" size={24} color={Colors.primary} />
          </View>
          <View style={styles.tomeContent}>
            <Text style={styles.tomeTitle}>Leaderboard</Text>
            <Text style={styles.tomeDescription}>See guild rankings</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tomeItem}>
          <View style={styles.tomeIcon}>
            <Icon name="target" size={24} color={Colors.success} />
          </View>
          <View style={styles.tomeContent}>
            <Text style={styles.tomeTitle}>Group Goals</Text>
            <Text style={styles.tomeDescription}>Achieve goals together</Text>
          </View>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Icon name="star" size={16} color={Colors.accent} />
          </View>
          <Text style={styles.activityText}>
            <Text style={styles.activityUser}>Maria</Text> completed 5 lessons today
          </Text>
          <Text style={styles.activityTime}>2h ago</Text>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Icon name="trophy" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.activityText}>
            Your guild reached the weekly goal!
          </Text>
          <Text style={styles.activityTime}>1d ago</Text>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Icon name="account-plus" size={16} color={Colors.secondary} />
          </View>
          <Text style={styles.activityText}>
            <Text style={styles.activityUser}>Carlos</Text> joined the guild
          </Text>
          <Text style={styles.activityTime}>2d ago</Text>
        </View>
      </Card>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Guild</Text>
        {hasGuild && (
          <TouchableOpacity>
            <Icon name="plus" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {hasGuild ? renderGuildContent() : renderNoGuildState()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: 'System', // Cinzel-like
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  castleEmoji: {
    fontSize: 80,
    marginBottom: Layout.spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    fontFamily: 'System', // Cinzel-like
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.lg,
    fontStyle: 'italic',
  },
  actionButtons: {
    width: '100%',
    gap: Layout.spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  guildCard: {
    marginBottom: Layout.spacing.md,
  },
  guildHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  guildIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(214, 158, 46, 0.3)',
  },
  guildEmoji: {
    fontSize: 24,
  },
  guildInfo: {
    flex: 1,
  },
  guildName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: 'System', // Cinzel-like
  },
  guildMembers: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  settingsButton: {
    padding: Layout.spacing.sm,
  },
  guildProgress: {
    marginTop: Layout.spacing.md,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
    fontFamily: 'System', // Cinzel-like
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  featuresCard: {
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    fontFamily: 'System', // Cinzel-like
  },
  tomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  tomeIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(214, 158, 46, 0.3)',
  },
  tomeEmoji: {
    fontSize: 16,
  },
  tomeContent: {
    flex: 1,
  },
  tomeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: 'System', // Cinzel-like
  },
  tomeDescription: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  masteryBadge: {
    backgroundColor: 'rgba(214, 158, 46, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(214, 158, 46, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  masteryText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  activityCard: {
    marginBottom: Layout.spacing.xl,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(214, 158, 46, 0.3)',
  },
  activityEmoji: {
    fontSize: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginRight: Layout.spacing.sm,
  },
  activityUser: {
    fontWeight: '600',
    color: Colors.primary,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});