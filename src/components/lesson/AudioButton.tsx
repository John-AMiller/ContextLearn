import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';

interface AudioButtonProps {
  text: string;
  language: string;
  size?: number;
  color?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  language,
  size = 24,
  color = Colors.primary,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = async () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    
    const languageCode = language === 'spanish' ? 'es' : 
                        language === 'italian' ? 'it' : 'en';
    
    Speech.speak(text, {
      language: languageCode,
      rate: 0.9,
      onDone: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      {isPlaying ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Icon name="volume-high" size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});