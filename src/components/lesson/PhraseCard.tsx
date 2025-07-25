import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Phrase } from '@/types';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PhraseCardProps {
  phrase: Phrase;
  showTranslation: boolean;
  onAudioPress?: () => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  showTranslation,
  onAudioPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.phraseText}>{phrase.phrase}</Text>
        {onAudioPress && (
          <TouchableOpacity onPress={onAudioPress} style={styles.audioButton}>
            <Icon name="volume-high" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      {showTranslation && (
        <View style={styles.translationContainer}>
          <Text style={styles.translationText}>{phrase.translation}</Text>
          {phrase.literal && (
            <Text style={styles.literalText}>
              Literally: {phrase.literal}
            </Text>
          )}
        </View>
      )}
      
      {phrase.pronunciation && (
        <Text style={styles.pronunciationText}>
          [{phrase.pronunciation}]
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  phraseText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  audioButton: {
    padding: Layout.spacing.sm,
  },
  translationContainer: {
    marginTop: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  translationText: {
    fontSize: 16,
    color: Colors.text,
    fontStyle: 'italic',
  },
  literalText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  pronunciationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.sm,
    fontStyle: 'italic',
  },
});