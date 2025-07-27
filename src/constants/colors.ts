// src/constants/colors.ts - Updated for Style 2B Card Game Adventure
export const Colors = {
  // Primary gaming colors
  primary: '#38b2ac', // Teal for main actions
  secondary: '#319795', // Darker teal
  accent: '#fbd38d', // Gold for special elements
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#48bb78', // Green for achievements
  
  // Dark gaming theme backgrounds
  background: '#1a202c', // Dark slate
  surface: '#2d3748', // Lighter dark slate for cards
  text: '#ffffff', // White text
  textSecondary: '#a0aec0', // Light gray text
  textDisabled: '#718096', // Darker gray for disabled text
  
  // Gaming UI elements
  border: 'rgba(255,255,255,0.2)', // Semi-transparent white borders
  divider: 'rgba(255,255,255,0.1)', // Subtle dividers
  
  // Card game specific colors
  cardBackground: 'rgba(255,255,255,0.05)', // Glass morphism effect
  cardBorder: 'rgba(255,255,255,0.1)', // Subtle card borders
  energy: '#68d391', // Green for energy bar
  gems: '#fbd38d', // Gold for gems/currency
  
  // Card rarity colors
  common: '#4c51bf', // Blue
  rare: '#ed64a6', // Pink
  epic: '#38b2ac', // Teal
  legendary: '#ed8936', // Orange
  
  // Language specific (keeping these for compatibility)
  spanish: '#C60B1E',
  italian: '#009246',
  english: '#012169',
} as const;