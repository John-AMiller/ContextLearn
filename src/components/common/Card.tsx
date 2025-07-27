// src/components/common/Card.tsx - Scholarly Academy Style

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  mystical?: boolean;
  elevated?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  gradient = true,
  mystical = false,
  elevated = true,
  interactive = false
}) => {
  if (gradient) {
    return (
      <View style={[styles.container, elevated && styles.elevated, style]}>
        <LinearGradient
          colors={mystical 
            ? (Colors.gradients.mystical as [string, string, ...string[]]) 
            : (Colors.gradients.surface as [string, string, ...string[]])
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.gradientCard,
            interactive && styles.interactive,
            mystical && styles.mystical
          ]}
        >
          {/* Mystical pattern overlay */}
          {mystical && <View style={styles.mysticalOverlay} />}
          
          {/* Shimmer effect for interactive cards */}
          {interactive && <View style={styles.shimmerOverlay} />}
          
          <View style={styles.content}>
            {children}
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      styles.solidCard,
      elevated && styles.elevated,
      interactive && styles.interactive,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientCard: {
    borderWidth: 2,
    borderColor: Colors.card.border,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  solidCard: {
    backgroundColor: Colors.card.background,
    borderWidth: 2,
    borderColor: Colors.card.border,
    padding: Layout.spacing.md,
  },
  mystical: {
    borderColor: Colors.borderActive,
  },
  interactive: {
    borderColor: Colors.borderActive,
    transform: [{ scale: 1 }], // Base scale for animations
  },
  mysticalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.3,
    // In a real implementation, this would have the elvish pattern
  },
  shimmerOverlay: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    backgroundColor: 'transparent',
    // Shimmer effect would be implemented here
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});