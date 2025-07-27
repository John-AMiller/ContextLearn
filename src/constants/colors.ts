// src/constants/colors.ts - Scholarly Academy Theme

export const Colors = {

  divider: '#E5E7EB', // Light gray for dividers
  
  // Scholarly Academy Primary Colors
  background: '#1a202c',        // Main dark background
  surface: '#1a202c',           // Card/container background
  surfaceSecondary: '#2d3748',  // Secondary container background
  
  // Scholar's Gold Theme
  primary: '#d69e2e',           // Golden primary (scholar badge, accents)
  primaryDark: '#b7791f',       // Darker gold for pressed states
  primaryLight: '#ed8936',      // Lighter gold for gradients
  
  // Mystical Green Accents
  secondary: '#2f855a',         // Deep green
  secondaryLight: '#38a169',    // Lighter green for gradients
  accent: '#38a169',            // Success/completed states
  
  // Text Colors
  text: '#f7fafc',              // Primary text (bright white)
  textSecondary: '#e2e8f0',     // Secondary text (light gray)
  textTertiary: '#cbd5e0',      // Tertiary text (muted)
  textMuted: 'rgba(247, 250, 252, 0.5)', // Disabled/muted text
  
  // Border & Dividers
  border: 'rgba(214, 158, 46, 0.2)',      // Default borders (golden)
  borderActive: 'rgba(214, 158, 46, 0.5)', // Active borders
  borderStrong: 'rgba(214, 158, 46, 0.3)', // Strong borders
  
  // Status Colors
  success: '#38a169',           // Success green
  warning: '#ed8936',           // Warning orange
  danger: '#e53e3e',            // Error red
  info: '#3182ce',              // Info blue
  
  // Overlay & Glass Effects
  overlay: 'rgba(26, 32, 44, 0.9)',       // Modal overlay
  glass: 'rgba(255, 255, 255, 0.1)',      // Glassmorphism effect
  glassStrong: 'rgba(255, 255, 255, 0.15)', // Stronger glass effect
  
  // Input & Interactive
  inputBackground: 'rgba(26, 32, 44, 0.6)', // Input field background
  inputBorder: 'rgba(214, 158, 46, 0.3)',   // Input borders
  inputFocus: '#d69e2e',                    // Focused input border
  
  // Gradients (for LinearGradient usage)
  gradients: {
    primary: ['#2f855a', '#38a169'],        // Header gradient
    secondary: ['#d69e2e', '#ed8936'],      // Badge/accent gradient
    background: ['#1a202c', '#2d3748', '#1a202c'], // Main background
    surface: ['rgba(47, 133, 90, 0.1)', 'rgba(45, 55, 72, 0.3)'], // Card gradient
    mystical: ['rgba(139, 92, 246, 0.05)', 'rgba(214, 158, 46, 0.1)'], // Mystical overlay
  },
  
  // Component-specific colors
  card: {
    background: 'rgba(47, 133, 90, 0.1)',   // Card background
    backgroundAlt: 'rgba(45, 55, 72, 0.3)', // Alternative card background
    border: 'rgba(214, 158, 46, 0.2)',      // Card borders
    borderHover: 'rgba(214, 158, 46, 0.5)', // Hovered card borders
  },
  
  button: {
    primary: '#d69e2e',                     // Primary button
    primaryText: '#1a202c',                 // Primary button text
    secondary: 'rgba(214, 158, 46, 0.2)',   // Secondary button
    secondaryText: '#d69e2e',               // Secondary button text
    disabled: 'rgba(45, 55, 72, 0.5)',     // Disabled button
    disabledText: 'rgba(247, 250, 252, 0.3)', // Disabled button text
  },
  
  navigation: {
    background: ['#1a202c', '#2d3748'],     // Tab bar gradient
    border: 'rgba(214, 158, 46, 0.3)',      // Tab bar border
    active: '#d69e2e',                      // Active tab
    inactive: 'rgba(203, 213, 224, 0.6)',   // Inactive tab
  }
};