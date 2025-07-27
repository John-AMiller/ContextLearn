// src/components/common/Button.tsx - Scholarly Academy Style

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'mystical' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;
  
  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      styles[`${size}Button`],
      fullWidth && styles.fullWidth,
      isDisabled && styles.disabled,
    ];
    
    switch (variant) {
      case 'outline':
        return [...baseStyle, styles.outlineButton];
      case 'mystical':
        return [...baseStyle, styles.mysticalButton];
      case 'danger':
        return [...baseStyle, styles.dangerButton];
      case 'secondary':
        return [...baseStyle, styles.secondaryButton];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = [
      styles.text,
      styles[`${size}Text`],
      isDisabled && styles.disabledText,
    ];
    
    switch (variant) {
      case 'outline':
        return [...baseStyle, styles.outlineText];
      case 'mystical':
        return [...baseStyle, styles.mysticalText];
      case 'danger':
        return [...baseStyle, styles.dangerText];
      case 'secondary':
        return [...baseStyle, styles.secondaryText];
      default:
        return baseStyle;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <Icon 
          name={icon} 
          size={getIconSize()} 
          color={variant === 'primary' ? Colors.button.primaryText : Colors.button.secondaryText}
          style={styles.iconLeft}
        />
      )}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? Colors.button.primaryText : Colors.button.secondaryText} 
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
      
      {icon && iconPosition === 'right' && (
        <Icon 
          name={icon} 
          size={getIconSize()} 
          color={variant === 'primary' ? Colors.button.primaryText : Colors.button.secondaryText}
          style={styles.iconRight}
        />
      )}
    </>
  );

  if (variant === 'primary' || variant === 'mystical') {
    return (
      <TouchableOpacity
        style={[...getButtonStyle(), style]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={variant === 'mystical' 
            ? (Colors.gradients.secondary as [string, string, ...string[]])
            : ([Colors.primary, Colors.primaryLight] as [string, string, ...string[]])
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientButton}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  
  // Size variants
  smallButton: {
    minHeight: 32,
  },
  mediumButton: {
    minHeight: 44,
  },
  largeButton: {
    minHeight: 52,
  },
  
  // Variant styles
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.button.secondary,
    borderColor: Colors.border,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mysticalButton: {
    borderColor: Colors.borderActive,
  },
  dangerButton: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // State styles
  disabled: {
    opacity: 0.5,
    borderColor: Colors.button.disabled,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  
  // Text variants
  outlineText: {
    color: Colors.button.secondaryText,
  },
  secondaryText: {
    color: Colors.button.secondaryText,
  },
  mysticalText: {
    color: Colors.button.primaryText,
  },
  dangerText: {
    color: Colors.text,
  },
  disabledText: {
    color: Colors.button.disabledText,
  },
  
  // Icon styles
  iconLeft: {
    marginRight: Layout.spacing.xs,
  },
  iconRight: {
    marginLeft: Layout.spacing.xs,
  },
});