import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/types/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { CATEGORIES, SAMPLE_LESSONS } from '@/constants/lessons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { currentLanguage } = useLanguage();

  const handleScenarioPress = (scenarioTitle: string) => {
    // Find a matching lesson or generate one
    const lessons = SAMPLE_LESSONS[currentLanguage] || [];
    const matchingLesson = lessons.find(lesson => 
      lesson.title.toLowerCase().includes(scenarioTitle.toLowerCase())
    );

    if (matchingLesson) {
      navigation.navigate('Lesson', { lesson: matchingLesson });
    } else {
      // Navigate to text input with pre-filled scenario
      navigation.navigate('TextInput');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Choose a Category</Text>
        </View>

        {CATEGORIES.map((category) => (
            <Card key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.scenarioContainer}>
                {category.scenarios.map((scenario, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.scenarioButton}
                    onPress={() => handleScenarioPress(scenario)}
                >
                    <Text style={styles.scenarioText}>{scenario}</Text>
                </TouchableOpacity>
                ))}
            </View>
            </Card>
        ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  categoryCard: {
    marginBottom: Layout.spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: Layout.spacing.sm,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  scenarioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  scenarioButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scenarioText: {
    fontSize: 14,
    color: Colors.text,
  },
});