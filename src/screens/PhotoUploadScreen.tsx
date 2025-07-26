import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/types/navigation';
import { Lesson } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { generateConfirmationOptions, generateLessonContent, filterVocabularyByLength, AIConfirmationOptions, AILessonContent, VocabularyItem } from '@/services/ai.service';

export const PhotoUploadScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { currentLanguage } = useLanguage();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [contextText, setContextText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confirmationOptions, setConfirmationOptions] = useState<AIConfirmationOptions | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [lessonType, setLessonType] = useState<'rapid' | 'full' | null>(null);
  const [location, setLocation] = useState('general');
  const [formality, setFormality] = useState<'casual' | 'neutral' | 'formal'>('neutral');
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);

  const locations = [
    { label: 'Mexico City, Mexico', value: 'mexico' },
    { label: 'Madrid, Spain', value: 'spain' },
    { label: 'Buenos Aires, Argentina', value: 'argentina' },
    { label: 'Rome, Italy', value: 'italy' },
    { label: 'General/Multiple regions', value: 'general' }
  ];

  const formalityLevels: Array<'casual' | 'neutral' | 'formal'> = ['casual', 'neutral', 'formal'];

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'We need camera and photo library permissions to use this feature.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleImageSelection = () => {
    Alert.alert(
      'Add Photo',
      'How would you like to add a photo?',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      resetAnalysis(); // Reset all analysis-related state
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      resetAnalysis(); // Reset all analysis-related state
    }
  };

  const resetAnalysis = () => {
    setConfirmationOptions(null);
    setSelectedOption(null);
    setAdditionalContext('');
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const options = await generateConfirmationOptions(
        selectedImage,
        contextText.trim() || null,
        currentLanguage
      );
      
      setConfirmationOptions(options);
      
    } catch (error) {
      console.error('Image analysis error:', error);
      
      // Show the specific error message from the AI service
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Analysis Failed', errorMessage);
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setAdditionalContext(''); // Clear additional context when selecting an option
  };

  const generateLesson = async () => {
    if (!selectedOption && !additionalContext.trim()) {
      Alert.alert('Please select an option or add more context');
      return;
    }

    if (!lessonType) {
      Alert.alert('Please select a lesson length');
      return;
    }

    setIsGeneratingLesson(true);
    try {
      // Use additional context if provided, otherwise use selected option
      const finalDescription = additionalContext.trim() || selectedOption || '';
      
      const lessonContent = await generateLessonContent(
        finalDescription, 
        currentLanguage,
        location,
        formality
      );
      
      // Filter vocabulary based on lesson type
      const filteredVocabulary = filterVocabularyByLength(lessonContent.vocabulary, lessonType);
      
      // Convert AI vocabulary to lesson format for PracticeScreen
      const lesson: Lesson = {
        id: `ai-lesson-${Date.now()}`,
        title: `AI Lesson: ${finalDescription}`,
        scenario: lessonContent.scenario,
        language: currentLanguage,
        difficulty: (lessonType === 'rapid' ? 2 : 3) as 1 | 2 | 3 | 4 | 5,
        culturalNotes: lessonContent.culturalNotes,
        phrases: filteredVocabulary.map((vocab, index) => ({
          id: `phrase-${index}`,
          phrase: vocab.word,
          translation: vocab.translation,
          literal: vocab.examples[0] || vocab.word
        })),
        variations: {
          formal: [],
          informal: [],
          regional: {}
        },
        tags: ['ai-generated', lessonType]
      };
      
      // Navigate directly to PracticeScreen
      navigation.navigate('Practice', { lesson });
      
    } catch (error) {
      console.error('Lesson generation error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Lesson Generation Failed', errorMessage);
      
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setContextText('');
    resetAnalysis();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Learn from Photos</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Instructions - only show if no analysis yet */}
          {!confirmationOptions && (
            <Card style={styles.instructionsCard}>
              <View style={styles.instructionsHeader}>
                <Icon name="lightbulb-outline" size={20} color={Colors.primary} />
                <Text style={styles.instructionsTitle}>How it works</Text>
              </View>
              <Text style={styles.instructionsText}>
                1. Take a photo or upload one from your gallery{'\n'}
                2. Optionally add context about what you want to learn{'\n'}
                3. Our AI will analyze the image and suggest relevant vocabulary{'\n'}
                4. Get a customized lesson based on what you photographed
              </Text>
            </Card>
          )}

          {/* Image Selection - only show if no analysis yet */}
          {!confirmationOptions && (
            <Card>
              <Text style={styles.sectionTitle}>Select Image</Text>
              
              {selectedImage ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                  <View style={styles.imageActions}>
                    <TouchableOpacity style={styles.imageActionButton} onPress={clearImage}>
                      <Icon name="delete-outline" size={20} color={Colors.danger} />
                      <Text style={styles.imageActionText}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageActionButton} onPress={handleImageSelection}>
                      <Icon name="camera-outline" size={20} color={Colors.primary} />
                      <Text style={styles.imageActionText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadArea} onPress={handleImageSelection}>
                  <Icon name="camera-plus-outline" size={48} color={Colors.textSecondary} />
                  <Text style={styles.uploadText}>Tap to add photo</Text>
                  <Text style={styles.uploadSubtext}>Camera or Photo Library</Text>
                </TouchableOpacity>
              )}
            </Card>
          )}

          {/* Context Input - only show if no analysis yet */}
          {selectedImage && !confirmationOptions && (
            <Card>
              <Text style={styles.sectionTitle}>Add Context (Optional)</Text>
              <Text style={styles.sectionDescription}>
                Tell us what you want to learn about this image
              </Text>
              
              <Input
                value={contextText}
                onChangeText={setContextText}
                placeholder="e.g., I want to order food from this menu, I'm at this location and need directions, I want to describe what I see..."
                multiline
                style={styles.contextInput}
                maxLength={300}
              />
              
              <Text style={styles.characterCount}>
                {contextText.length}/300 characters
              </Text>
            </Card>
          )}

          {/* Analysis Section */}
          {selectedImage && !confirmationOptions && (
            <Card>
              <Text style={styles.sectionTitle}>AI Analysis</Text>
              
              <View style={styles.analysisEmpty}>
                <Icon name="robot-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.analysisEmptyText}>
                  Ready to analyze your image
                </Text>
                <Text style={styles.analysisEmptySubtext}>
                  Our AI will identify learning opportunities
                </Text>
              </View>

              <Button
                title={isAnalyzing ? "Analyzing..." : "Analyze Image"}
                onPress={analyzeImage}
                loading={isAnalyzing}
                disabled={!selectedImage}
                style={styles.analyzeButton}
                icon={<Icon name="robot" size={20} color={Colors.background} />}
              />
            </Card>
          )}

          {/* Confirmation Options */}
          {confirmationOptions && (
            <Card>
              <View style={styles.analysisHeader}>
                <Icon name="check-circle" size={20} color={Colors.success} />
                <Text style={styles.analysisHeaderText}>Analysis Complete</Text>
              </View>
              
              <Text style={styles.confirmationQuestion}>
                {confirmationOptions.question}
              </Text>
              
              <View style={styles.optionsContainer}>
                {confirmationOptions.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedOption === option && styles.optionButtonSelected
                    ]}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      selectedOption === option && styles.optionButtonTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.orText}>Or add more context:</Text>
              
              <Input
                value={additionalContext}
                onChangeText={setAdditionalContext}
                placeholder="Describe exactly what you want to learn..."
                multiline
                style={styles.additionalContextInput}
                maxLength={200}
              />
              
              {additionalContext.length > 0 && (
                <Text style={styles.characterCount}>
                  {additionalContext.length}/200 characters
                </Text>
              )}
            </Card>
          )}

          {/* Lesson Length Selection */}
          {confirmationOptions && (selectedOption || additionalContext.trim()) && (
            <Card>
              <Text style={styles.sectionTitle}>Choose Lesson Length</Text>
              
              <View style={styles.lessonTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.lessonTypeButton,
                    lessonType === 'rapid' && styles.lessonTypeButtonSelected
                  ]}
                  onPress={() => setLessonType('rapid')}
                >
                  <Icon name="flash" size={24} color={lessonType === 'rapid' ? Colors.background : Colors.primary} />
                  <Text style={[
                    styles.lessonTypeTitle,
                    lessonType === 'rapid' && styles.lessonTypeTitleSelected
                  ]}>
                    Rapid
                  </Text>
                  <Text style={[
                    styles.lessonTypeTime,
                    lessonType === 'rapid' && styles.lessonTypeTimeSelected
                  ]}>
                    5 minutes
                  </Text>
                  <Text style={[
                    styles.lessonTypeDescription,
                    lessonType === 'rapid' && styles.lessonTypeDescriptionSelected
                  ]}>
                    Essential words you need right now
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.lessonTypeButton,
                    lessonType === 'full' && styles.lessonTypeButtonSelected
                  ]}
                  onPress={() => setLessonType('full')}
                >
                  <Icon name="book-open" size={24} color={lessonType === 'full' ? Colors.background : Colors.primary} />
                  <Text style={[
                    styles.lessonTypeTitle,
                    lessonType === 'full' && styles.lessonTypeTitleSelected
                  ]}>
                    Full
                  </Text>
                  <Text style={[
                    styles.lessonTypeTime,
                    lessonType === 'full' && styles.lessonTypeTimeSelected
                  ]}>
                    15 minutes
                  </Text>
                  <Text style={[
                    styles.lessonTypeDescription,
                    lessonType === 'full' && styles.lessonTypeDescriptionSelected
                  ]}>
                    Complete vocabulary + cultural context
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Location and Formality Selection */}
          {lessonType && (
            <Card>
              <Text style={styles.sectionTitle}>Customize Your Lesson</Text>
              
              <Text style={styles.subsectionTitle}>Where will you use this?</Text>
              <View style={styles.optionsGrid}>
                {locations.map((loc) => (
                  <TouchableOpacity
                    key={loc.value}
                    style={[
                      styles.locationButton,
                      location === loc.value && styles.locationButtonSelected
                    ]}
                    onPress={() => setLocation(loc.value)}
                  >
                    <Text style={[
                      styles.locationButtonText,
                      location === loc.value && styles.locationButtonTextSelected
                    ]}>
                      {loc.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.subsectionTitle}>Formality Level</Text>
              <View style={styles.formalityContainer}>
                {formalityLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.formalityButton,
                      formality === level && styles.formalityButtonSelected
                    ]}
                    onPress={() => setFormality(level)}
                  >
                    <Text style={[
                      styles.formalityButtonText,
                      formality === level && styles.formalityButtonTextSelected
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          )}

          {/* Generate Lesson */}
          {lessonType && (
            <Card style={styles.lessonCard}>
              <Text style={styles.sectionTitle}>Ready to Learn!</Text>
              <Text style={styles.lessonDescription}>
                Start your {lessonType} lesson and practice immediately
              </Text>
              
              <Button
                title={isGeneratingLesson ? "Generating..." : "Start Practice"}
                onPress={generateLesson}
                loading={isGeneratingLesson}
                style={styles.generateButton}
                icon={<Icon name="play" size={20} color={Colors.background} />}
              />
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  instructionsCard: {
    backgroundColor: '#f0f8ff',
    marginBottom: Layout.spacing.md,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: Layout.spacing.sm,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.xl,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Layout.spacing.sm,
  },
  uploadSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  imageActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageActionText: {
    fontSize: 14,
    marginLeft: Layout.spacing.xs,
    color: Colors.text,
  },
  contextInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Layout.spacing.xs,
  },
  analysisEmpty: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  analysisEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Layout.spacing.sm,
  },
  analysisEmptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  confirmationSection: {
    marginBottom: Layout.spacing.md,
  },
  confirmationQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  optionButtonText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  optionButtonTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  orText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  additionalContextInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  lessonTypeContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  lessonTypeButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  lessonTypeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  lessonTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Layout.spacing.xs,
  },
  lessonTypeTitleSelected: {
    color: Colors.background,
  },
  lessonTypeTime: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: Layout.spacing.xs,
  },
  lessonTypeTimeSelected: {
    color: Colors.background,
  },
  lessonTypeDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
  },
  lessonTypeDescriptionSelected: {
    color: Colors.background,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
  },
  optionsGrid: {
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  locationButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationButtonSelected: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  locationButtonText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  locationButtonTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  formalityContainer: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  formalityButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  formalityButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  formalityButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  formalityButtonTextSelected: {
    color: Colors.background,
    fontWeight: '600',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  analysisHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    marginLeft: Layout.spacing.xs,
  },
  analysisText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  analyzeButton: {
    marginTop: Layout.spacing.md,
  },
  lessonCard: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  lessonDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
  },
  generateButton: {
    backgroundColor: Colors.success,
  },
});