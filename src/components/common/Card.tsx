import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

interface CardProps extends ViewProps {
  padding?: keyof typeof Layout.spacing;
  margin?: keyof typeof Layout.spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  margin = 'sm',
  style,
  ...props
}) => {
  return (
    <View 
      style={[
        styles.card, 
        { 
          padding: Layout.spacing[padding],
          margin: Layout.spacing[margin] 
        },
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});